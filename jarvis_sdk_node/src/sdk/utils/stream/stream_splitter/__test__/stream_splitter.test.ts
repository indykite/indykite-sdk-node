import { ServiceError } from '@grpc/grpc-js';
import { Readable } from 'stream';
import IndexFixer from '../../index_fixer';
import streamSplitter from '../stream_splitter';

const getStreamResults = async (stream: Readable): Promise<unknown[]> => {
  return new Promise((resolve, reject) => {
    const results: unknown[] = [];
    stream.on('data', (data: unknown[]) => {
      results.push(...data);
    });
    stream.on('end', () => {
      resolve(results);
    });
    stream.on('error', (err) => {
      reject(err);
    });
  });
};

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {
    //
  });
});

afterEach(() => {
  (console.error as unknown as jest.SpyInstance).mockRestore();
});

describe('when no modifiers are used', () => {
  describe('when one item is pushed to the stream', () => {
    let inputStream: Readable;
    let outputStream: Readable;
    let grpcRequestMakerFn: (
      input: Record<string, unknown>,
      cb: (err: ServiceError | null, value?: unknown) => void,
    ) => void;
    let payloadRequestMakerFn: (chunks: unknown[]) => Promise<Record<string, unknown>>;

    beforeEach(() => {
      inputStream = new Readable({
        read: () => {
          // Nothing needed to be done here
        },
        objectMode: true,
      });

      grpcRequestMakerFn = jest.fn().mockImplementation((payload, cb) => {
        cb(
          null,
          payload.map((payloadItem: unknown, index: number) => ({
            result: 'ok',
            index: index,
            email: (payloadItem as Record<string, unknown>).email,
          })),
        );
      });

      payloadRequestMakerFn = jest.fn().mockImplementation((chunks: unknown[]) => {
        return Promise.resolve(
          chunks.map((chunk) => ({
            email: (chunk as Record<string, unknown>).email,
            displayName: (chunk as Record<string, unknown>).name,
          })),
        );
      });

      inputStream.push({ email: 'test+1@gmail.com', name: 'Test #1' });
      outputStream = streamSplitter(inputStream, grpcRequestMakerFn, 2, payloadRequestMakerFn);

      // Wait till stream events are propagated
      return new Promise((resolve) => setTimeout(resolve, 0));
    });

    it('does not send amy data to the payload maker', async () => {
      expect(payloadRequestMakerFn).toBeCalledTimes(0);
    });

    it('does not send any data to the gRPC function', async () => {
      expect(grpcRequestMakerFn).toBeCalledTimes(0);
    });

    describe('when input stream throws an error', () => {
      let results: unknown;

      beforeEach(async () => {
        inputStream.destroy(new Error('Error message'));
        results = await getStreamResults(outputStream);
      });

      it('prints an error message', () => {
        expect(console.error as unknown as jest.SpyInstance).toBeCalledTimes(1);
        expect(console.error as unknown as jest.SpyInstance).toBeCalledWith(
          new Error('Error message'),
        );
      });

      it('returns correct items', async () => {
        expect(results).toEqual([
          {
            email: 'test+1@gmail.com',
            index: 0,
            result: 'ok',
          },
        ]);
      });
    });

    describe('when EOF is sent to the stream', () => {
      let results: unknown;

      beforeEach(async () => {
        inputStream.push(null);
        results = await getStreamResults(outputStream);
      });

      it('returns correct items', async () => {
        expect(results).toEqual([
          {
            email: 'test+1@gmail.com',
            index: 0,
            result: 'ok',
          },
        ]);
      });

      it('sends correct data to the payload maker', async () => {
        expect(payloadRequestMakerFn).toBeCalledTimes(1);
        expect(payloadRequestMakerFn).toBeCalledWith([
          {
            email: 'test+1@gmail.com',
            name: 'Test #1',
          },
        ]);
      });

      it('sends correct data to the gRPC function', async () => {
        expect(grpcRequestMakerFn).toBeCalledTimes(1);
        expect(grpcRequestMakerFn).toBeCalledWith(
          [
            {
              email: 'test+1@gmail.com',
              displayName: 'Test #1',
            },
          ],
          expect.any(Function),
        );
      });
    });

    describe('when another item is pushed to the stream', () => {
      beforeEach(async () => {
        inputStream.push({ email: 'test+2@gmail.com', name: 'Test #2' });

        // Wait till stream events are propagated
        return new Promise((resolve) => setTimeout(resolve, 0));
      });

      it('sends correct data to the payload maker', async () => {
        expect(payloadRequestMakerFn).toBeCalledTimes(1);
        expect(payloadRequestMakerFn).toBeCalledWith([
          {
            email: 'test+1@gmail.com',
            name: 'Test #1',
          },
          {
            email: 'test+2@gmail.com',
            name: 'Test #2',
          },
        ]);
      });

      it('sends correct data to the gRPC function', async () => {
        expect(grpcRequestMakerFn).toBeCalledTimes(1);
        expect(grpcRequestMakerFn).toBeCalledWith(
          [
            {
              email: 'test+1@gmail.com',
              displayName: 'Test #1',
            },
            {
              email: 'test+2@gmail.com',
              displayName: 'Test #2',
            },
          ],
          expect.any(Function),
        );
      });

      describe('when EOF is sent to the stream', () => {
        let results: unknown;

        beforeEach(async () => {
          inputStream.push(null);
          results = await getStreamResults(outputStream);
        });

        it('returns correct items', async () => {
          expect(results).toEqual([
            {
              email: 'test+1@gmail.com',
              index: 0,
              result: 'ok',
            },
            {
              email: 'test+2@gmail.com',
              index: 1,
              result: 'ok',
            },
          ]);
        });

        it('sends correct data to the payload maker', async () => {
          expect(payloadRequestMakerFn).toBeCalledTimes(1);
          expect(payloadRequestMakerFn).toBeCalledWith([
            {
              email: 'test+1@gmail.com',
              name: 'Test #1',
            },
            {
              email: 'test+2@gmail.com',
              name: 'Test #2',
            },
          ]);
        });

        it('sends correct data to the gRPC function', async () => {
          expect(grpcRequestMakerFn).toBeCalledTimes(1);
          expect(grpcRequestMakerFn).toBeCalledWith(
            [
              {
                email: 'test+1@gmail.com',
                displayName: 'Test #1',
              },
              {
                email: 'test+2@gmail.com',
                displayName: 'Test #2',
              },
            ],
            expect.any(Function),
          );
        });
      });

      describe('when another item is pushed to the stream', () => {
        beforeEach(async () => {
          inputStream.push({ email: 'test+3@gmail.com', name: 'Test #3' });

          // Wait till stream events are propagated
          return new Promise((resolve) => setTimeout(resolve, 0));
        });

        it('sends correct data to the payload maker', async () => {
          expect(payloadRequestMakerFn).toBeCalledTimes(1);
          expect(payloadRequestMakerFn).toBeCalledWith([
            {
              email: 'test+1@gmail.com',
              name: 'Test #1',
            },
            {
              email: 'test+2@gmail.com',
              name: 'Test #2',
            },
          ]);
        });

        it('sends correct data to the gRPC function', async () => {
          expect(grpcRequestMakerFn).toBeCalledTimes(1);
          expect(grpcRequestMakerFn).toBeCalledWith(
            [
              {
                email: 'test+1@gmail.com',
                displayName: 'Test #1',
              },
              {
                email: 'test+2@gmail.com',
                displayName: 'Test #2',
              },
            ],
            expect.any(Function),
          );
        });

        describe('when EOF is sent to the stream', () => {
          let results: unknown;

          beforeEach(async () => {
            inputStream.push(null);
            results = await getStreamResults(outputStream);
          });

          it('returns correct items', async () => {
            expect(results).toEqual([
              {
                email: 'test+1@gmail.com',
                index: 0,
                result: 'ok',
              },
              {
                email: 'test+2@gmail.com',
                index: 1,
                result: 'ok',
              },
              {
                email: 'test+3@gmail.com',
                index: 0,
                result: 'ok',
              },
            ]);
          });

          it('sends correct data to the payload maker', async () => {
            expect(payloadRequestMakerFn).toBeCalledTimes(2);
            expect(payloadRequestMakerFn).nthCalledWith(1, [
              {
                email: 'test+1@gmail.com',
                name: 'Test #1',
              },
              {
                email: 'test+2@gmail.com',
                name: 'Test #2',
              },
            ]);
            expect(payloadRequestMakerFn).nthCalledWith(2, [
              {
                email: 'test+3@gmail.com',
                name: 'Test #3',
              },
            ]);
          });

          it('sends correct data to the gRPC function', async () => {
            expect(grpcRequestMakerFn).toBeCalledTimes(2);
            expect(grpcRequestMakerFn).nthCalledWith(
              1,
              [
                {
                  email: 'test+1@gmail.com',
                  displayName: 'Test #1',
                },
                {
                  email: 'test+2@gmail.com',
                  displayName: 'Test #2',
                },
              ],
              expect.any(Function),
            );
            expect(grpcRequestMakerFn).nthCalledWith(
              2,
              [
                {
                  email: 'test+3@gmail.com',
                  displayName: 'Test #3',
                },
              ],
              expect.any(Function),
            );
          });

          it('prints no error message', () => {
            expect(console.error as unknown as jest.SpyInstance).toBeCalledTimes(0);
          });
        });
      });
    });
  });
});

describe('when index fixer modifier is used', () => {
  let inputStream: Readable;
  let outputStream: Readable;
  let grpcRequestMakerFn: jest.Mock<
    void,
    [Record<string, unknown>[], (err: ServiceError | null, value?: unknown) => void]
  >;
  let payloadRequestMakerFn: jest.Mock<Promise<Record<string, unknown>[]>, [unknown[]]>;
  let results: unknown;
  let indexFixer: IndexFixer<'index'>;
  let indexFixerDataError: Error | null;
  let indexFixerClientClosedError: Error | null;

  beforeEach(() => {
    inputStream = new Readable({
      read: () => {
        // Nothing needed to be done here
      },
      objectMode: true,
    });

    grpcRequestMakerFn = jest
      .fn<void, [Record<string, unknown>[], (err: ServiceError | null, value?: unknown) => void]>()
      .mockImplementation((payload, cb) => {
        cb(
          null,
          payload.map((payloadItem: unknown, index: number) => ({
            result: 'ok',
            index: index,
            email: (payloadItem as Record<string, unknown>).email,
          })),
        );
      });

    payloadRequestMakerFn = jest
      .fn<Promise<Record<string, unknown>[]>, [unknown[]]>()
      .mockImplementation((chunks: unknown[]) => {
        return Promise.resolve(
          chunks.map((chunk) => ({
            email: (chunk as Record<string, unknown>).email,
            displayName: (chunk as Record<string, unknown>).name,
          })),
        );
      });

    indexFixer = new IndexFixer('index');
    outputStream = streamSplitter(inputStream, grpcRequestMakerFn, 2, payloadRequestMakerFn, [
      {
        onData: async (data, next) => {
          if (indexFixerDataError) {
            throw indexFixerDataError;
          }
          indexFixer.onData(data, next);
        },
        onClientClosed: async () => {
          if (indexFixerClientClosedError) {
            throw indexFixerClientClosedError;
          }
          indexFixer.onClientClosed();
        },
      },
    ]);

    indexFixerDataError = null;
    indexFixerClientClosedError = null;

    // Wait till stream events are propagated
    return new Promise((resolve) => setTimeout(resolve, 0));
  });

  describe('when no error is thrown', () => {
    it('does not send amy data to the payload maker', async () => {
      expect(payloadRequestMakerFn).toBeCalledTimes(0);
    });

    it('does not send any data to the gRPC function', async () => {
      expect(grpcRequestMakerFn).toBeCalledTimes(0);
    });

    describe('when 3 items are pushed to the stream', () => {
      beforeEach(async () => {
        inputStream.push({ email: 'test+1@gmail.com', name: 'Test #1' });
        inputStream.push({ email: 'test+2@gmail.com', name: 'Test #2' });
        inputStream.push({ email: 'test+3@gmail.com', name: 'Test #3' });
        inputStream.push(null);
        results = await getStreamResults(outputStream);
      });

      it('returns correct items', async () => {
        expect(results).toEqual([
          {
            email: 'test+1@gmail.com',
            index: 0,
            result: 'ok',
          },
          {
            email: 'test+2@gmail.com',
            index: 1,
            result: 'ok',
          },
          {
            email: 'test+3@gmail.com',
            index: 2,
            result: 'ok',
          },
        ]);
      });

      it('sends correct data to the payload maker', async () => {
        expect(payloadRequestMakerFn).toBeCalledTimes(2);
        expect(payloadRequestMakerFn).nthCalledWith(1, [
          {
            email: 'test+1@gmail.com',
            name: 'Test #1',
          },
          {
            email: 'test+2@gmail.com',
            name: 'Test #2',
          },
        ]);
        expect(payloadRequestMakerFn).nthCalledWith(2, [
          {
            email: 'test+3@gmail.com',
            name: 'Test #3',
          },
        ]);
      });

      it('sends correct data to the gRPC function', async () => {
        expect(grpcRequestMakerFn).toBeCalledTimes(2);
        expect(grpcRequestMakerFn).nthCalledWith(
          1,
          [
            {
              email: 'test+1@gmail.com',
              displayName: 'Test #1',
            },
            {
              email: 'test+2@gmail.com',
              displayName: 'Test #2',
            },
          ],
          expect.any(Function),
        );
        expect(grpcRequestMakerFn).nthCalledWith(
          2,
          [
            {
              email: 'test+3@gmail.com',
              displayName: 'Test #3',
            },
          ],
          expect.any(Function),
        );
      });

      it('prints no error message', () => {
        expect(console.error as unknown as jest.SpyInstance).toBeCalledTimes(0);
      });
    });
  });

  describe('when input stream throws an error', () => {
    beforeEach(async () => {
      inputStream.destroy(new Error('Error message'));
      results = await getStreamResults(outputStream);
    });

    it('prints an error message', () => {
      expect(console.error as unknown as jest.SpyInstance).toBeCalledTimes(1);
      expect(console.error as unknown as jest.SpyInstance).toBeCalledWith(
        new Error('Error message'),
      );
    });

    it('returns correct items', async () => {
      expect(results).toEqual([]);
    });
  });

  describe('when request maker throws an error', () => {
    let thrownError: Error;

    beforeEach(async () => {
      grpcRequestMakerFn.mockImplementation(() => {
        throw new Error('GRPC request maker error');
      });
      inputStream.push({ email: 'test+1@gmail.com', name: 'Test #1' });
      inputStream.push({ email: 'test+2@gmail.com', name: 'Test #2' });
      inputStream.push(null);

      return getStreamResults(outputStream).catch((err) => {
        thrownError = err;
      });
    });

    it('does not print any error message', () => {
      expect(console.error as unknown as jest.SpyInstance).toBeCalledTimes(0);
    });

    it('throws an error', async () => {
      expect(thrownError).toEqual(new Error('GRPC request maker error'));
    });
  });

  describe('when request maker throws an error', () => {
    let thrownError: Error;

    beforeEach(async () => {
      grpcRequestMakerFn.mockImplementation(() => {
        throw new Error('GRPC request maker error');
      });
      inputStream.push({ email: 'test+1@gmail.com', name: 'Test #1' });
      inputStream.push({ email: 'test+2@gmail.com', name: 'Test #2' });
      inputStream.push(null);

      return getStreamResults(outputStream).catch((err) => {
        thrownError = err;
      });
    });

    it('does not print any error message', () => {
      expect(console.error as unknown as jest.SpyInstance).toBeCalledTimes(0);
    });

    it('throws an error', async () => {
      expect(thrownError).toEqual(new Error('GRPC request maker error'));
    });
  });

  describe('when data modifier throws an error', () => {
    let thrownError: Error | undefined;

    beforeEach(async () => {
      indexFixerDataError = new Error('Modifier data error');
      inputStream.push({ email: 'test+1@gmail.com', name: 'Test #1' });
      inputStream.push(null);

      return getStreamResults(outputStream).catch((err) => {
        thrownError = err;
      });
    });

    it('does not print any error message', () => {
      expect(console.error as unknown as jest.SpyInstance).toBeCalledTimes(0);
    });

    it('throws an error', async () => {
      expect(thrownError).toEqual(new Error('Modifier data error'));
    });
  });

  describe('when client closed modifier throws an error', () => {
    let thrownError: Error | undefined;

    beforeEach(async () => {
      indexFixerClientClosedError = new Error('Modifier client closed error');
      inputStream.push({ email: 'test+1@gmail.com', name: 'Test #1' });
      inputStream.push(null);

      return getStreamResults(outputStream).catch((err) => {
        thrownError = err;
      });
    });

    it('does not print any error message', () => {
      expect(console.error as unknown as jest.SpyInstance).toBeCalledTimes(0);
    });

    it('throws an error', async () => {
      expect(thrownError).toEqual(new Error('Modifier client closed error'));
    });
  });
});
