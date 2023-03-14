import { get as httpsGet, request as httpsRequest } from 'https';
import { HTTPClient, HTTPResponse } from '../http';
import { TokenSource } from '../utils/token_source/token_source';
import { applicationTokenMock } from '../utils/test_utils';
import { Token } from '../utils/token_source/token';

jest.mock('https');

const url = 'https://example.com';

const customCredentials = JSON.stringify(applicationTokenMock);
const successfulHttpRequest = (statusCode?: number) =>
  jest.fn().mockImplementation((url, options, cb) => {
    const resObject = {
      _events: {} as Record<string, (data?: unknown) => unknown>,
      on: jest.fn().mockImplementation((eventType, cb) => {
        resObject._events[eventType] = cb;
      }),
    };

    cb(resObject);

    const reqObject = {
      write: jest.fn(),
      end: jest.fn().mockImplementation(() => {
        const dataCb = resObject._events.data;
        const endCb = resObject._events.end;

        dataCb('{"data":"re');
        dataCb('sults"}');
        if (statusCode === 200) {
          (resObject as Record<string, unknown>).statusMessage = 'OK';
          (resObject as Record<string, unknown>).statusCode = 200;
        }
        endCb();
      }),
    };

    return reqObject;
  });
const failedHttpRequest = jest.fn().mockImplementation((url, options, cb) => {
  const resObject = {
    _events: {} as Record<string, (data?: unknown) => unknown>,
    on: jest.fn().mockImplementation((eventType, cb) => {
      resObject._events[eventType] = cb;
    }),
    statusMessage: '',
    statusCode: 0,
  };

  cb(resObject);

  const reqObject = {
    write: jest.fn(),
    end: jest.fn().mockImplementation(() => {
      const errorCb = resObject._events.error;

      errorCb(new Error('Test error'));
    }),
  };

  return reqObject;
});
const successfulHttpGet = (statusCode?: number) =>
  jest.fn().mockImplementation((url, options, cb) => {
    const resObject = {
      _events: {} as Record<string, (data?: unknown) => unknown>,
      on: jest.fn().mockImplementation((eventType, cb) => {
        resObject._events[eventType] = cb;
      }),
    };

    cb(resObject);
    const dataCb = resObject._events.data;
    const endCb = resObject._events.end;
    dataCb('{"data":"re');
    dataCb('sults"}');
    if (statusCode === 200) {
      (resObject as Record<string, unknown>).statusMessage = 'OK';
      (resObject as Record<string, unknown>).statusCode = 200;
    }
    endCb();
  });
const failedHttpGet = jest.fn().mockImplementation((url, options, cb) => {
  const resObject = {
    _events: {} as Record<string, (data?: unknown) => unknown>,
    on: jest.fn().mockImplementation((eventType, cb) => {
      resObject._events[eventType] = cb;
    }),
    statusMessage: '',
    statusCode: 0,
  };

  cb(resObject);
  const errorCb = resObject._events.error;
  errorCb(new Error('Test error'));
});

beforeAll(() => {
  jest.spyOn(TokenSource, 'reuseApplicationTokenSource');
  jest
    .spyOn(TokenSource.prototype, 'getApplicationToken')
    .mockReturnValue(Promise.resolve(new Token('access-token', 'Bearer', new Date(2099, 11, 31))));
});

beforeEach(() => {
  jest.clearAllMocks();
});

describe('when a new instance is created with custom credentials', () => {
  beforeEach(() => {
    HTTPClient.createInstance(customCredentials);
  });

  it('creates token source with the credentials', () => {
    expect(TokenSource.reuseApplicationTokenSource).toBeCalledTimes(1);
    expect(TokenSource.reuseApplicationTokenSource).toBeCalledWith(undefined, customCredentials);
  });
});

describe('when a new instance is created without custom credentials', () => {
  let httpClient: HTTPClient;

  beforeEach(async () => {
    httpClient = await HTTPClient.createInstance();
  });

  it('creates token source without credentials', () => {
    expect(TokenSource.reuseApplicationTokenSource).toBeCalledTimes(1);
    expect(TokenSource.reuseApplicationTokenSource).toBeCalledWith(undefined, undefined);
  });

  describe('when a post request is sent', () => {
    describe('when the response is successful', () => {
      let response: HTTPResponse;

      beforeEach(async () => {
        (httpsRequest as jest.Mock).mockImplementation(successfulHttpRequest(200));
        response = await httpClient.post(url, 'application/json', JSON.stringify({ id: 42 }));
      });

      it('sends correct request', () => {
        expect(httpsRequest).toBeCalledTimes(1);
        expect(httpsRequest).toBeCalledWith(
          url,
          {
            headers: {
              Authorization: 'Bearer access-token',
              'Content-Type': 'application/json',
            },
            method: 'POST',
          },
          expect.any(Function),
        );
      });

      it('returns correct response', () => {
        expect(response).toEqual({
          status: 'OK',
          statusCode: 200,
          body: JSON.stringify({ data: 'results' }),
        });
      });
    });

    describe('when the response misses status', () => {
      let response: HTTPResponse;

      beforeEach(async () => {
        (httpsRequest as jest.Mock).mockImplementation(successfulHttpRequest());
        response = await httpClient.post(url, 'application/json', JSON.stringify({ id: 42 }));
      });

      it('sends correct request', () => {
        expect(httpsRequest).toBeCalledTimes(1);
        expect(httpsRequest).toBeCalledWith(
          url,
          {
            headers: {
              Authorization: 'Bearer access-token',
              'Content-Type': 'application/json',
            },
            method: 'POST',
          },
          expect.any(Function),
        );
      });

      it('returns correct response', () => {
        expect(response).toEqual({
          status: 'Unknown',
          statusCode: 0,
          body: JSON.stringify({ data: 'results' }),
        });
      });
    });

    describe('when the response is failed', () => {
      let caughtError: Error;

      beforeEach(async () => {
        caughtError = new Error();
        (httpsRequest as jest.Mock).mockImplementation(failedHttpRequest);
        return httpClient.post(url, 'application/json', JSON.stringify({ id: 42 })).catch((err) => {
          caughtError = err;
        });
      });

      it('sends correct request', () => {
        expect(httpsRequest).toBeCalledTimes(1);
        expect(httpsRequest).toBeCalledWith(
          url,
          {
            headers: {
              Authorization: 'Bearer access-token',
              'Content-Type': 'application/json',
            },
            method: 'POST',
          },
          expect.any(Function),
        );
      });

      it('returns correct response', () => {
        expect(caughtError.message).toEqual('Test error');
      });
    });
  });

  describe('when a get request is sent', () => {
    describe('when the response is successful', () => {
      let response: HTTPResponse;

      beforeEach(async () => {
        (httpsGet as jest.Mock).mockImplementation(successfulHttpGet(200));
        response = await httpClient.get(url);
      });

      it('sends correct request', () => {
        expect(httpsGet).toBeCalledTimes(1);
        expect(httpsGet).toBeCalledWith(
          url,
          {
            headers: {
              Authorization: 'Bearer access-token',
            },
            method: 'GET',
          },
          expect.any(Function),
        );
      });

      it('returns correct response', () => {
        expect(response).toEqual({
          status: 'OK',
          statusCode: 200,
          body: JSON.stringify({ data: 'results' }),
        });
      });
    });

    describe('when the response misses status', () => {
      let response: HTTPResponse;

      beforeEach(async () => {
        (httpsGet as jest.Mock).mockImplementation(successfulHttpGet());
        response = await httpClient.get(url);
      });

      it('sends correct request', () => {
        expect(httpsGet).toBeCalledTimes(1);
        expect(httpsGet).toBeCalledWith(
          url,
          {
            headers: {
              Authorization: 'Bearer access-token',
            },
            method: 'GET',
          },
          expect.any(Function),
        );
      });

      it('returns correct response', () => {
        expect(response).toEqual({
          status: 'Unknown',
          statusCode: 0,
          body: JSON.stringify({ data: 'results' }),
        });
      });
    });

    describe('when the response is failed', () => {
      let caughtError: Error;

      beforeEach(async () => {
        caughtError = new Error();
        (httpsGet as jest.Mock).mockImplementation(failedHttpGet);
        return httpClient.get(url).catch((err) => {
          caughtError = err;
        });
      });

      it('sends correct request', () => {
        expect(httpsGet).toBeCalledTimes(1);
        expect(httpsGet).toBeCalledWith(
          url,
          {
            headers: {
              Authorization: 'Bearer access-token',
            },
            method: 'GET',
          },
          expect.any(Function),
        );
      });

      it('returns correct response', () => {
        expect(caughtError.message).toEqual('Test error');
      });
    });
  });

  describe('when a token source is requested', () => {
    let tokenSource: TokenSource;

    beforeEach(() => {
      tokenSource = HTTPClient.getTokenSource();
    });

    it('returns a correct token', async () => {
      const token = await tokenSource.getApplicationToken();
      expect(token).toEqual({
        accessToken: 'access-token',
        tokenType: 'Bearer',
        expiry: new Date(2099, 11, 31),
      });
    });
  });
});
