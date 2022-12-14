import { ServiceError } from '@grpc/grpc-js';
import { Readable } from 'stream';
import { OutputModifier } from '../index_fixer';

/**
 * Loop over all modifiers with the returned response and return the changed value.
 */
const modifyResponse = <ResponseType>(response: ResponseType, modifiers: OutputModifier[]) => {
  let promise: Promise<ResponseType> = Promise.resolve(response);
  for (let modifierIndex = 0; modifierIndex < modifiers.length; ++modifierIndex) {
    promise = promise.then(async (response: ResponseType) => {
      return new Promise((resolve, reject) => {
        const modifier = modifiers[modifierIndex];
        modifier
          .onData(response, (updatedResponse: unknown) => {
            ++modifierIndex;
            resolve(updatedResponse as ResponseType);
          })
          .catch(reject);
      });
    });
  }

  return promise;
};

/**
 * Loop over all modifiers with the information that the opened connection with a client was closed.
 */
const sendClientClosedInfo = async (modifiers: OutputModifier[]) => {
  await Promise.all(modifiers.map((modifier) => modifier.onClientClosed()));
};

/**
 * This function helps to split big requests into smaller ones.
 * @param inputStream The input stream.
 * @param requestMaker The function which is called when a new gRPC function is about to be created.
 * This can be e.g. importDigitalTwins gRPC function.
 * @param maxCount The maximal number of objects retrieved from the input stream which can be sent
 * in one gRPC request.
 * @param onDataCb The transform function used for creating gRPC request function payload.
 * ```
 * (chunks: unknown[]) => {
     return ImportDigitalTwinsRequest.create({
       hashAlgorithm: hashAlgorithm.marshal(),
       entities: chunks.map((chunk) => {
         if (!(chunk instanceof ImportDigitalTwin)) {
           throw new SdkError(SdkErrorCode.SDK_CODE_1, 'Incorrect stream object');
         }
 
         return chunk.marshal();
       }),
     });
   }
 * ```
 * @param modifiers The list of modifiers which can change the returned response objects (e.g. IndexFixer).
 * @returns The output stream which streames the returned response objects.
 */
const streamSplitter = <RequestType, ResponseType>(
  inputStream: Readable,
  requestMaker: (
    input: RequestType,
    cb: (err: ServiceError | null, value?: ResponseType) => void,
  ) => void,
  maxCount: number,
  onDataCb: (chunks: unknown[]) => RequestType | Promise<RequestType>,
  modifiers: OutputModifier[] = [],
): Readable => {
  let isFinished = false;
  let processingRequestsCount = 0;

  const output = new Readable({
    read: () => {
      // There's no need to do anything
    },
    objectMode: true,
  });

  const chunks: unknown[] = [];

  const process = async () => {
    ++processingRequestsCount;
    let requestPayload = onDataCb(chunks.slice());
    if (requestPayload instanceof Promise) {
      requestPayload = await requestPayload;
    }
    return new Promise<void>((resolve) => {
      requestMaker(
        requestPayload as RequestType,
        (err: ServiceError | null, response?: ResponseType) => {
          let processPromise = Promise.resolve();
          if (err) {
            --processingRequestsCount;
            output.destroy(err);
            resolve();
          } else {
            if (response) {
              processPromise = processPromise
                .then(async () => {
                  return modifyResponse(response, modifiers);
                })
                .then((response) => {
                  output.push(response);
                })
                .catch((err) => {
                  output.destroy(err);
                });
            }

            processPromise
              .then(async () => {
                await sendClientClosedInfo(modifiers);
                --processingRequestsCount;

                if (processingRequestsCount === 0 && isFinished) {
                  output.push(null);
                }
              })
              .catch((err) => {
                --processingRequestsCount;
                output.destroy(err);
              })
              .then(resolve);
          }
        },
      );
    }).catch((err) => {
      output.destroy(err);
    });
  };

  inputStream.on('data', async (chunk) => {
    chunks.push(chunk);
    if (chunks.length >= maxCount) {
      inputStream.pause();
      await process();
      inputStream.resume();

      chunks.splice(0, chunks.length);
    }
  });

  const endCallback = async () => {
    isFinished = true;
    if (processingRequestsCount === 0) {
      if (chunks.length > 0) {
        await process();
      } else {
        output.push(null);
      }
    }
  };

  inputStream.on('error', (err) => {
    console.error(err);
    endCallback();
  });

  inputStream.on('end', endCallback);

  return output;
};

export default streamSplitter;
