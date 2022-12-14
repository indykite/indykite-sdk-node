import { ClientDuplexStream } from '@grpc/grpc-js';
import { Duplex, Readable, Writable } from 'stream';
import IndexFixer from '../../index_fixer';
import streamKeeper from '../stream_keeper';

class DuplexWithMetadata extends Duplex {
  public testIndex = 0;
  public isClosed = false;
}

const getStreamResults = async (stream: Readable): Promise<unknown[]> => {
  return new Promise((resolve, reject) => {
    const results: unknown[] = [];
    stream.on('data', (data: unknown) => {
      results.push(data);
    });
    stream.on('end', () => {
      resolve(results);
    });
    stream.on('error', (err) => {
      reject(err);
    });
  });
};

const timeouts: Record<number, { fn: () => void; isClientTimeout: boolean }> = {};

const runUnusedClientTimeouts = () => {
  Object.values(timeouts).forEach((timeout) => {
    if (!timeout.isClientTimeout) {
      timeout.fn();
    }
  });
};

const runClientTimeouts = () => {
  Object.values(timeouts).forEach((timeout) => {
    if (timeout.isClientTimeout) {
      timeout.fn();
    }
  });
};

beforeEach(() => {
  jest.spyOn(global, 'setTimeout').mockImplementation((cb, timeout) => {
    const allIndexes = Object.keys(timeouts).map((index) => Number.parseInt(index));
    const index = allIndexes.length > 0 ? Math.max(...allIndexes) + 1 : 0;
    timeouts[index] = {
      isClientTimeout: timeout === 30 * 1000,
      fn: cb,
    };

    return index as unknown as NodeJS.Timeout;
  });
  jest.spyOn(global, 'clearTimeout').mockImplementation((index) => {
    delete timeouts[index as number];
  });
});

afterEach(() => {
  (setTimeout as unknown as jest.SpyInstance).mockRestore();
  (clearTimeout as unknown as jest.SpyInstance).mockRestore();
});

describe('when no modifier is used', () => {
  let input: Writable;
  let output: Readable;
  let results: unknown;
  let streamKeeperFnSpy: jest.SpyInstance;

  beforeEach(async () => {
    streamKeeperFnSpy = jest.fn().mockImplementation(() => {
      const clientStreamWrite = jest.fn().mockImplementation((chunk, encoding, next) => {
        clientStream.push({ ...chunk, index: clientStream.testIndex++ }, encoding);
        next();
      });
      const clientStream: DuplexWithMetadata = new DuplexWithMetadata({
        write: clientStreamWrite,
        read: () => {
          //
        },
        objectMode: true,
      });
      jest.spyOn(clientStream, 'end').mockImplementation(() => {
        clientStream.push(null);
        clientStream.isClosed = true;
        return clientStream;
      });
      clientStream.testIndex = 0;
      return clientStream;
    });
    [input, output] = streamKeeper(
      streamKeeperFnSpy as unknown as () => ClientDuplexStream<unknown, unknown>,
    );
  });

  describe('when the input stream is closed', () => {
    beforeEach(async () => {
      input.end();
      results = await getStreamResults(output);
    });

    it('returns no results', () => {
      expect(results).toEqual([]);
    });
  });

  describe('when there is an error in the input stream', () => {
    let thrownError: Error;

    beforeEach(async () => {
      input.destroy(new Error('Input stream error'));
      return getStreamResults(output).catch((error) => {
        thrownError = error;
      });
    });

    it('throws the error', () => {
      expect(thrownError).toEqual(new Error('Input stream error'));
    });
  });

  describe('when an item is pushed to the input stream', () => {
    beforeEach(async () => {
      input.write({ email: 'test_email+1@gmail.com' });
    });

    describe('when the input stream is closed', () => {
      beforeEach(async () => {
        input.end();
        results = await getStreamResults(output);
      });

      it('returns correct results', () => {
        expect(results).toEqual([{ email: 'test_email+1@gmail.com', index: 0 }]);
      });
    });

    describe('when there is an error in the input stream', () => {
      let thrownError: Error;

      beforeEach(async () => {
        input.destroy(new Error('Input stream error'));
        return getStreamResults(output).catch((error) => {
          thrownError = error;
        });
      });

      it('throws the error', () => {
        expect(thrownError).toEqual(new Error('Input stream error'));
      });
    });

    describe('when another item is pushed to the input stream', () => {
      beforeEach(async () => {
        input.write({ email: 'test_email+2@gmail.com' });
      });

      it('keeps the stream opened', () => {
        expect(streamKeeperFnSpy.mock.results[0].value.isClosed).toEqual(false);
      });

      describe('when the input stream is closed', () => {
        beforeEach(async () => {
          input.end();
          results = await getStreamResults(output);
        });

        it('returns correct results', () => {
          expect(results).toEqual([
            { email: 'test_email+1@gmail.com', index: 0 },
            { email: 'test_email+2@gmail.com', index: 1 },
          ]);
        });
      });

      describe('when the unused client timeout is up', () => {
        beforeEach(async () => {
          runUnusedClientTimeouts();
        });

        it('closes the stream', () => {
          expect(streamKeeperFnSpy.mock.results[0].value.isClosed).toEqual(true);
        });

        describe('when the input stream is closed', () => {
          beforeEach(async () => {
            input.end();
            results = await getStreamResults(output);
          });

          it('returns correct results', () => {
            expect(results).toEqual([
              { email: 'test_email+1@gmail.com', index: 0 },
              { email: 'test_email+2@gmail.com', index: 1 },
            ]);
          });
        });

        describe('when another item is pushed to the input stream', () => {
          beforeEach(async () => {
            input.write({ email: 'test_email+3@gmail.com' });
          });

          it('opens a new stream', () => {
            expect(streamKeeperFnSpy.mock.results[0].value.isClosed).toEqual(true);
            expect(streamKeeperFnSpy.mock.results[1].value.isClosed).toEqual(false);
          });

          describe('when the input stream is closed', () => {
            beforeEach(async () => {
              input.end();
              results = await getStreamResults(output);
            });

            it('returns correct results', () => {
              expect(results).toEqual([
                { email: 'test_email+1@gmail.com', index: 0 },
                { email: 'test_email+2@gmail.com', index: 1 },
                { email: 'test_email+3@gmail.com', index: 0 },
              ]);
            });
          });
        });

        describe('when the client timeout is up', () => {
          beforeEach(async () => {
            runClientTimeouts();
          });

          it('closes the stream', () => {
            expect(streamKeeperFnSpy.mock.results[0].value.isClosed).toEqual(true);
          });

          describe('when the input stream is closed', () => {
            beforeEach(async () => {
              input.end();
              results = await getStreamResults(output);
            });

            it('returns correct results', () => {
              expect(results).toEqual([
                { email: 'test_email+1@gmail.com', index: 0 },
                { email: 'test_email+2@gmail.com', index: 1 },
              ]);
            });
          });

          describe('when another item is pushed to the input stream', () => {
            beforeEach(async () => {
              input.write({ email: 'test_email+3@gmail.com' });
            });

            it('opens a new stream', () => {
              expect(streamKeeperFnSpy.mock.results[0].value.isClosed).toEqual(true);
              expect(streamKeeperFnSpy.mock.results[1].value.isClosed).toEqual(false);
            });

            describe('when the input stream is closed', () => {
              beforeEach(async () => {
                input.end();
                results = await getStreamResults(output);
              });

              it('returns correct results', () => {
                expect(results).toEqual([
                  { email: 'test_email+1@gmail.com', index: 0 },
                  { email: 'test_email+2@gmail.com', index: 1 },
                  { email: 'test_email+3@gmail.com', index: 0 },
                ]);
              });
            });
          });
        });
      });

      describe('when the client timeout is up', () => {
        beforeEach(async () => {
          runClientTimeouts();
        });

        it('closes the stream', () => {
          expect(streamKeeperFnSpy.mock.results[0].value.isClosed).toEqual(true);
        });

        describe('when the input stream is closed', () => {
          beforeEach(async () => {
            input.end();
            results = await getStreamResults(output);
          });

          it('returns correct results', () => {
            expect(results).toEqual([
              { email: 'test_email+1@gmail.com', index: 0 },
              { email: 'test_email+2@gmail.com', index: 1 },
            ]);
          });
        });

        describe('when another item is pushed to the input stream', () => {
          beforeEach(async () => {
            input.write({ email: 'test_email+3@gmail.com' });
          });

          it('opens a new stream', () => {
            expect(streamKeeperFnSpy.mock.results[0].value.isClosed).toEqual(true);
            expect(streamKeeperFnSpy.mock.results[1].value.isClosed).toEqual(false);
          });

          describe('when the input stream is closed', () => {
            beforeEach(async () => {
              input.end();
              results = await getStreamResults(output);
            });

            it('returns correct results', () => {
              expect(results).toEqual([
                { email: 'test_email+1@gmail.com', index: 0 },
                { email: 'test_email+2@gmail.com', index: 1 },
                { email: 'test_email+3@gmail.com', index: 0 },
              ]);
            });
          });
        });

        describe('when the unused client timeout is up', () => {
          beforeEach(async () => {
            runUnusedClientTimeouts();
          });

          it('closes the stream', () => {
            expect(streamKeeperFnSpy.mock.results[0].value.isClosed).toEqual(true);
          });

          describe('when another item is pushed to the input stream', () => {
            beforeEach(async () => {
              input.write({ email: 'test_email+3@gmail.com' });
            });

            it('opens a new stream', () => {
              expect(streamKeeperFnSpy.mock.results[0].value.isClosed).toEqual(true);
              expect(streamKeeperFnSpy.mock.results[1].value.isClosed).toEqual(false);
            });

            describe('when the input stream is closed', () => {
              beforeEach(async () => {
                input.end();
                results = await getStreamResults(output);
              });

              it('returns correct results', () => {
                expect(results).toEqual([
                  { email: 'test_email+1@gmail.com', index: 0 },
                  { email: 'test_email+2@gmail.com', index: 1 },
                  { email: 'test_email+3@gmail.com', index: 0 },
                ]);
              });
            });
          });
        });
      });
    });
  });
});

describe('when index fixer modifier is used', () => {
  let input: Writable;
  let output: Readable;
  let results: unknown;
  let streamKeeperFnSpy: jest.SpyInstance;

  beforeEach(async () => {
    streamKeeperFnSpy = jest.fn().mockImplementation(() => {
      const clientStreamWrite = jest.fn().mockImplementation((chunk, encoding, next) => {
        clientStream.push({ ...chunk, index: clientStream.testIndex++ }, encoding);
        next();
      });
      const clientStream: DuplexWithMetadata = new DuplexWithMetadata({
        write: clientStreamWrite,
        read: () => {
          //
        },
        objectMode: true,
      });
      jest.spyOn(clientStream, 'end').mockImplementation(() => {
        clientStream.push(null);
        clientStream.isClosed = true;
        return clientStream;
      });
      clientStream.testIndex = 0;
      return clientStream;
    });
    [input, output] = streamKeeper(
      streamKeeperFnSpy as unknown as () => ClientDuplexStream<unknown, unknown>,
      [new IndexFixer('index')],
    );
  });

  describe('when the input stream is closed', () => {
    beforeEach(async () => {
      input.end();
      results = await getStreamResults(output);
    });

    it('returns no results', () => {
      expect(results).toEqual([]);
    });
  });

  describe('when there is an error in the input stream', () => {
    let thrownError: Error;

    beforeEach(async () => {
      input.destroy(new Error('Input stream error'));
      return getStreamResults(output).catch((error) => {
        thrownError = error;
      });
    });

    it('throws the error', () => {
      expect(thrownError).toEqual(new Error('Input stream error'));
    });
  });

  describe('when an item is pushed to the input stream', () => {
    beforeEach(async () => {
      input.write({ email: 'test_email+1@gmail.com' });
    });

    describe('when the input stream is closed', () => {
      beforeEach(async () => {
        input.end();
        results = await getStreamResults(output);
      });

      it('returns correct results', () => {
        expect(results).toEqual([{ email: 'test_email+1@gmail.com', index: 0 }]);
      });
    });

    describe('when there is an error in the input stream', () => {
      let thrownError: Error;

      beforeEach(async () => {
        input.destroy(new Error('Input stream error'));
        return getStreamResults(output).catch((error) => {
          thrownError = error;
        });
      });

      it('throws the error', () => {
        expect(thrownError).toEqual(new Error('Input stream error'));
      });
    });

    describe('when another item is pushed to the input stream', () => {
      beforeEach(async () => {
        input.write({ email: 'test_email+2@gmail.com' });
      });

      it('keeps the stream opened', () => {
        expect(streamKeeperFnSpy.mock.results[0].value.isClosed).toEqual(false);
      });

      describe('when the input stream is closed', () => {
        beforeEach(async () => {
          input.end();
          results = await getStreamResults(output);
        });

        it('returns correct results', () => {
          expect(results).toEqual([
            { email: 'test_email+1@gmail.com', index: 0 },
            { email: 'test_email+2@gmail.com', index: 1 },
          ]);
        });
      });

      describe('when the unused client timeout is up', () => {
        beforeEach(async () => {
          runUnusedClientTimeouts();
        });

        it('closes the stream', () => {
          expect(streamKeeperFnSpy.mock.results[0].value.isClosed).toEqual(true);
        });

        describe('when the input stream is closed', () => {
          beforeEach(async () => {
            input.end();
            results = await getStreamResults(output);
          });

          it('returns correct results', () => {
            expect(results).toEqual([
              { email: 'test_email+1@gmail.com', index: 0 },
              { email: 'test_email+2@gmail.com', index: 1 },
            ]);
          });
        });

        describe('when another item is pushed to the input stream', () => {
          beforeEach(async () => {
            input.write({ email: 'test_email+3@gmail.com' });
          });

          it('opens a new stream', () => {
            expect(streamKeeperFnSpy.mock.results[0].value.isClosed).toEqual(true);
            expect(streamKeeperFnSpy.mock.results[1].value.isClosed).toEqual(false);
          });

          describe('when the input stream is closed', () => {
            beforeEach(async () => {
              input.end();
              results = await getStreamResults(output);
            });

            it('returns correct results', () => {
              expect(results).toEqual([
                { email: 'test_email+1@gmail.com', index: 0 },
                { email: 'test_email+2@gmail.com', index: 1 },
                { email: 'test_email+3@gmail.com', index: 2 },
              ]);
            });
          });
        });

        describe('when the client timeout is up', () => {
          beforeEach(async () => {
            runClientTimeouts();
          });

          it('closes the stream', () => {
            expect(streamKeeperFnSpy.mock.results[0].value.isClosed).toEqual(true);
          });

          describe('when the input stream is closed', () => {
            beforeEach(async () => {
              input.end();
              results = await getStreamResults(output);
            });

            it('returns correct results', () => {
              expect(results).toEqual([
                { email: 'test_email+1@gmail.com', index: 0 },
                { email: 'test_email+2@gmail.com', index: 1 },
              ]);
            });
          });

          describe('when another item is pushed to the input stream', () => {
            beforeEach(async () => {
              input.write({ email: 'test_email+3@gmail.com' });
            });

            it('opens a new stream', () => {
              expect(streamKeeperFnSpy.mock.results[0].value.isClosed).toEqual(true);
              expect(streamKeeperFnSpy.mock.results[1].value.isClosed).toEqual(false);
            });

            describe('when the input stream is closed', () => {
              beforeEach(async () => {
                input.end();
                results = await getStreamResults(output);
              });

              it('returns correct results', () => {
                expect(results).toEqual([
                  { email: 'test_email+1@gmail.com', index: 0 },
                  { email: 'test_email+2@gmail.com', index: 1 },
                  { email: 'test_email+3@gmail.com', index: 2 },
                ]);
              });
            });
          });
        });
      });

      describe('when the client timeout is up', () => {
        beforeEach(async () => {
          runClientTimeouts();
        });

        it('closes the stream', () => {
          expect(streamKeeperFnSpy.mock.results[0].value.isClosed).toEqual(true);
        });

        describe('when the input stream is closed', () => {
          beforeEach(async () => {
            input.end();
            results = await getStreamResults(output);
          });

          it('returns correct results', () => {
            expect(results).toEqual([
              { email: 'test_email+1@gmail.com', index: 0 },
              { email: 'test_email+2@gmail.com', index: 1 },
            ]);
          });
        });

        describe('when another item is pushed to the input stream', () => {
          beforeEach(async () => {
            input.write({ email: 'test_email+3@gmail.com' });
          });

          it('opens a new stream', () => {
            expect(streamKeeperFnSpy.mock.results[0].value.isClosed).toEqual(true);
            expect(streamKeeperFnSpy.mock.results[1].value.isClosed).toEqual(false);
          });

          describe('when the input stream is closed', () => {
            beforeEach(async () => {
              input.end();
              results = await getStreamResults(output);
            });

            it('returns correct results', () => {
              expect(results).toEqual([
                { email: 'test_email+1@gmail.com', index: 0 },
                { email: 'test_email+2@gmail.com', index: 1 },
                { email: 'test_email+3@gmail.com', index: 2 },
              ]);
            });
          });
        });

        describe('when the unused client timeout is up', () => {
          beforeEach(async () => {
            runUnusedClientTimeouts();
          });

          it('closes the stream', () => {
            expect(streamKeeperFnSpy.mock.results[0].value.isClosed).toEqual(true);
          });

          describe('when another item is pushed to the input stream', () => {
            beforeEach(async () => {
              input.write({ email: 'test_email+3@gmail.com' });
            });

            it('opens a new stream', () => {
              expect(streamKeeperFnSpy.mock.results[0].value.isClosed).toEqual(true);
              expect(streamKeeperFnSpy.mock.results[1].value.isClosed).toEqual(false);
            });

            describe('when the input stream is closed', () => {
              beforeEach(async () => {
                input.end();
                results = await getStreamResults(output);
              });

              it('returns correct results', () => {
                expect(results).toEqual([
                  { email: 'test_email+1@gmail.com', index: 0 },
                  { email: 'test_email+2@gmail.com', index: 1 },
                  { email: 'test_email+3@gmail.com', index: 2 },
                ]);
              });
            });
          });
        });
      });
    });
  });
});
