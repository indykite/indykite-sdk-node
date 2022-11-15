import { ClientDuplexStream } from '@grpc/grpc-js/build/src/call';
import { Duplex } from 'stream';

export interface OutputModifier {
  onClientClosed: () => void;
  onData: (data: unknown, next: (modifiedData: unknown) => void) => Promise<void>;
}

class ClientOutput<RequestType, ResponseType> extends Duplex {
  private inputEnd: Error | boolean = false;
  private clients: ClientDuplexStream<RequestType, ResponseType>[] = [];
  private processingPromise = Promise.resolve();
  private futureData: { client: ClientDuplexStream<RequestType, ResponseType>; chunk: unknown }[] =
    [];

  constructor(private modifiers: OutputModifier[] = []) {
    super({
      write: (chunk, encoding, next) => {
        this.push(chunk, encoding);
        next();
      },
      read: () => {
        // There's no need to do anything
      },
      destroy: (err, next) => {
        next(err);
      },
      objectMode: true,
    });
  }

  addGrpcClient(client: ClientDuplexStream<RequestType, ResponseType>): void {
    this.clients.push(client);

    client.on('data', async (chunk) => {
      this.processData(client, chunk);
    });

    client.on('end', () => {
      this.processingPromise = this.processingPromise.then(() => {
        const currentClientIndex = this.clients.indexOf(client);
        this.clients.splice(currentClientIndex, 1);
        this.modifiers.forEach((modifier) => modifier.onClientClosed());

        // If we had (or still have) more opened clients and we already got some data
        // from the newer clients, they are buffered in the futureData array. As the
        // old client was closed we need to check whether we can process the buffered
        // data now.
        if (this.futureData.length > 0) {
          const futureData = this.futureData;
          this.futureData = [];
          futureData.forEach((data) => {
            this.processData(data.client, data.chunk);
          });
        }

        // If we don't have any other clients opened, we can close the output stream.
        if (!this.hasClients()) {
          this.finish();
        }
      });
    });
    client.on('error', (error) => {
      this.processingPromise = this.processingPromise.then(() => {
        this.destroy(error);
      });
    });
  }

  end(): this {
    this.processingPromise = this.processingPromise.then(() => {
      super.end(() => {
        this.emit('end');
      });
    });

    return this;
  }

  hasClients(): boolean {
    return this.clients.length > 0;
  }

  setInputEnd(error: Error | null): void {
    this.inputEnd = error ?? true;
    if (!this.hasClients()) {
      this.finish();
    }
  }

  private finish() {
    if (this.inputEnd === true) {
      this.end();
    } else if (this.inputEnd instanceof Error) {
      this.destroy(this.inputEnd);
    }
  }

  private processData(client: ClientDuplexStream<RequestType, ResponseType>, chunk: unknown) {
    // The client on index 0 is the oldest opened client. If we have opened more clients, we want
    // to process data related only to the oldest client (we might want to re-index returned objects
    // and if we would mix responses from different clients, then we would end up in inconsistent indexes).
    if (client !== this.clients[0]) {
      this.futureData.push({ client, chunk });
      return;
    }

    this.processingPromise = this.processingPromise.then(async () => {
      let modifiedChunk = chunk;
      let modifierIndex = 0;
      while (modifierIndex < this.modifiers.length) {
        modifiedChunk = await new Promise((resolve) => {
          const cb = (newChunk: unknown) => {
            ++modifierIndex;
            resolve(newChunk);
          };

          const modifier = this.modifiers[modifierIndex];
          modifier.onData(modifiedChunk, cb);
        });
      }

      this.write(modifiedChunk);
    });
  }
}

export default ClientOutput;
