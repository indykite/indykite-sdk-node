import { ClientDuplexStream } from '@grpc/grpc-js';
import { Readable, Writable } from 'stream';
import ClientOutput, { OutputModifier } from './client_output';

const streamKeeper = <RequestType, ResponseType>(
  fn: () => ClientDuplexStream<RequestType, ResponseType>,
  modifiers?: OutputModifier[],
): [Writable, Readable] => {
  let currentClient: ClientDuplexStream<RequestType, ResponseType> | null = null;
  let unusedClientTimeout: NodeJS.Timeout | null = null;
  let currentClientTimeout: NodeJS.Timeout | null = null;

  const output = new ClientOutput<RequestType, ResponseType>(modifiers);

  const clearTimeouts = () => {
    if (unusedClientTimeout) {
      clearTimeout(unusedClientTimeout);
      unusedClientTimeout = null;
    }
  };

  const clearAllTimeouts = () => {
    clearTimeouts();

    if (currentClientTimeout) {
      clearTimeout(currentClientTimeout);
      currentClientTimeout = null;
    }
  };

  const input = new Writable({
    write: (chunk, encoding, next) => {
      if (!currentClient) {
        currentClient = fn();

        output.addGrpcClient(currentClient);
        currentClient.on('end', () => {
          clearAllTimeouts();
        });
      }

      clearTimeouts();

      // If there is nothing sent in 10 seconds, close the connection
      unusedClientTimeout = setTimeout(() => {
        clearAllTimeouts();
        if (currentClient) {
          currentClient.end();
          currentClient = null;
        }
      }, 1000 * 10);

      // If the connection is opened for more than 30 seconds, close the connection
      if (!currentClientTimeout) {
        currentClientTimeout = setTimeout(() => {
          clearAllTimeouts();
          if (currentClient) {
            currentClient.end();
            currentClient = null;
          }
        }, 1000 * 30);
      }

      currentClient.write(chunk);
      next();
    },
    destroy: (error: Error | null, next) => {
      // Inform the output instance that there will be no more input data.
      // In case there's an error, push it there as well.
      output.setInputEnd(error);

      if (currentClient) {
        if (error) {
          currentClient.destroy(error);
        } else {
          currentClient.end();
        }
      }
      clearAllTimeouts();
      next(null);
    },
    objectMode: true,
  });

  return [input, output];
};

export default streamKeeper;
