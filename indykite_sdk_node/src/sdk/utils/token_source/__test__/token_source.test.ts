import { TokenSource } from '../token_source';
import { Token } from '../token';
import { SdkClient } from '../../../client/client';

jest.mock('../../../client/client', () => {
  return {
    SdkClient: {
      buildApplicationCredentialToken: jest.fn(),
    },
  };
});

beforeEach(() => {
  jest.clearAllMocks();
  (SdkClient.buildApplicationCredentialToken as jest.Mock).mockReturnValue(
    new Token('newAccessToken', 'Bearer', new Date(2099, 11, 31)),
  );
});

let instance: TokenSource;

describe('reuseApplicationTokenSource', () => {
  describe('when there is no cached token', () => {
    beforeEach(() => {
      instance = TokenSource.reuseApplicationTokenSource();
    });

    describe('when the token is requested', () => {
      let result: Token;

      beforeEach(async () => {
        result = await instance.getApplicationToken();
      });

      it('builds a new token', () => {
        expect(SdkClient.buildApplicationCredentialToken).toBeCalledTimes(1);
      });

      it('returns the new token', () => {
        expect(result.accessToken).toBe('newAccessToken');
      });
    });
  });

  describe('when there is a cached token', () => {
    describe('when the cached token is not expired', () => {
      const cachedToken = new Token('accessToken', 'Bearer', new Date(2099, 11, 31));

      beforeEach(() => {
        instance = TokenSource.reuseApplicationTokenSource(cachedToken);
      });

      describe('when the token is requested', () => {
        let result: Token;

        beforeEach(async () => {
          result = await instance.getApplicationToken();
        });

        it('does not build a new token', () => {
          expect(SdkClient.buildApplicationCredentialToken).toBeCalledTimes(0);
        });

        it('returns the cached token', () => {
          expect(result.accessToken).toBe('accessToken');
        });
      });
    });

    describe('when the cached token is expired', () => {
      const cachedToken = new Token('accessToken', 'Bearer', new Date(2022, 11, 31));

      beforeEach(() => {
        instance = TokenSource.reuseApplicationTokenSource(cachedToken);
      });

      describe('when the token is requested', () => {
        let result: Token;

        beforeEach(async () => {
          result = await instance.getApplicationToken();
        });

        it('builds a new token', () => {
          expect(SdkClient.buildApplicationCredentialToken).toBeCalledTimes(1);
        });

        it('returns the new token', () => {
          expect(result.accessToken).toBe('newAccessToken');
        });
      });
    });
  });
});

describe('staticApplicationTokenSource', () => {
  describe('when there is no cached token', () => {
    beforeEach(() => {
      instance = TokenSource.staticApplicationTokenSource();
    });

    describe('when the token is requested', () => {
      let caughtError: unknown;

      beforeEach(async () => {
        caughtError = null;
        try {
          await instance.getApplicationToken();
        } catch (err) {
          caughtError = err;
        }
      });

      it('does not build a new token', () => {
        expect(SdkClient.buildApplicationCredentialToken).toBeCalledTimes(0);
      });

      it('throws an error', () => {
        expect((caughtError as Error).message).toBe('HTTP Client has no generated token');
      });
    });
  });

  describe('when there is a cached token', () => {
    describe('when the cached token is not expired', () => {
      const cachedToken = new Token('accessToken', 'Bearer', new Date(2099, 11, 31));

      beforeEach(() => {
        instance = TokenSource.staticApplicationTokenSource(cachedToken);
      });

      describe('when the token is requested', () => {
        let result: Token;

        beforeEach(async () => {
          result = await instance.getApplicationToken();
        });

        it('does not build a new token', () => {
          expect(SdkClient.buildApplicationCredentialToken).toBeCalledTimes(0);
        });

        it('returns the cached token', () => {
          expect(result.accessToken).toBe('accessToken');
        });
      });
    });

    describe('when the cached token is expired', () => {
      const cachedToken = new Token('accessToken', 'Bearer', new Date(2022, 11, 31));

      beforeEach(() => {
        instance = TokenSource.staticApplicationTokenSource(cachedToken);
      });

      describe('when the token is requested', () => {
        let result: Token;

        beforeEach(async () => {
          result = await instance.getApplicationToken();
        });

        it('does not build a new token', () => {
          expect(SdkClient.buildApplicationCredentialToken).toBeCalledTimes(0);
        });

        it('returns the cached token', () => {
          expect(result.accessToken).toBe('accessToken');
        });
      });
    });
  });
});
