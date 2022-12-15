import { ServiceError, SurfaceCall } from '@grpc/grpc-js/build/src/call';
import {
  EnrichTokenRequest,
  EnrichTokenResponse,
} from '../../../grpc/indykite/identity/v1beta2/identity_management_api';
import { IdentityClient } from '../../identity';
import { Status } from '@grpc/grpc-js/build/src/constants';
import { CallOptions, Metadata } from '@grpc/grpc-js';
import { applicationTokenMock } from '../../utils/test_utils';

let sdk: IdentityClient;

beforeAll(async () => {
  sdk = await IdentityClient.createInstance(applicationTokenMock);
});

afterEach(() => {
  jest.resetAllMocks();
});

describe('enrichToken', () => {
  describe('when the response is successful', () => {
    describe('when no optional arguments is used', () => {
      const accessToken = 'access-token';

      beforeEach(async () => {
        const mockFunc = jest.fn(
          (
            request: EnrichTokenRequest,
            callback:
              | Metadata
              | CallOptions
              | ((error: ServiceError | null, response?: EnrichTokenResponse) => void),
          ): SurfaceCall => {
            if (typeof callback === 'function') callback(null, {});
            return {} as SurfaceCall;
          },
        );

        jest.spyOn(sdk['client'], 'enrichToken').mockImplementation(mockFunc);

        return sdk.enrichToken(accessToken);
      });

      it('sends correct request', () => {
        expect(sdk['client'].enrichToken).toBeCalledTimes(1);
        expect(sdk['client'].enrichToken).toBeCalledWith(
          {
            accessToken,
          },
          expect.any(Function),
        );
      });
    });

    describe('when all arguments are used', () => {
      const accessToken = 'access-token';
      const tokenClaims = { myTokenKey: 'my-token-value' };
      const sessionClaims = { mySessionKey: 'my-session-value' };

      beforeEach(async () => {
        const mockFunc = jest.fn(
          (
            request: EnrichTokenRequest,
            callback:
              | Metadata
              | CallOptions
              | ((error: ServiceError | null, response?: EnrichTokenResponse) => void),
          ): SurfaceCall => {
            if (typeof callback === 'function') callback(null, {});
            return {} as SurfaceCall;
          },
        );

        jest.spyOn(sdk['client'], 'enrichToken').mockImplementation(mockFunc);

        return sdk.enrichToken(accessToken, tokenClaims, sessionClaims);
      });

      it('sends correct request', () => {
        expect(sdk['client'].enrichToken).toBeCalledTimes(1);
        expect(sdk['client'].enrichToken).toBeCalledWith(
          {
            accessToken,
            tokenClaims: {
              fields: {
                myTokenKey: {
                  kind: {
                    oneofKind: 'stringValue',
                    stringValue: 'my-token-value',
                  },
                },
              },
            },
            sessionClaims: {
              fields: {
                mySessionKey: {
                  kind: {
                    oneofKind: 'stringValue',
                    stringValue: 'my-session-value',
                  },
                },
              },
            },
          },
          expect.any(Function),
        );
      });
    });
  });

  describe('when the response contains an error', () => {
    const accessToken = 'access-token';
    const error = {
      code: Status.NOT_FOUND,
      details: 'no details',
      metadata: {},
    } as ServiceError;
    let caughtError: unknown;

    beforeEach(async () => {
      const mockFunc = jest.fn(
        (
          request: EnrichTokenRequest,
          callback:
            | Metadata
            | CallOptions
            | ((error: ServiceError | null, response?: EnrichTokenResponse) => void),
        ): SurfaceCall => {
          if (typeof callback === 'function') callback(error);
          return {} as SurfaceCall;
        },
      );

      jest.spyOn(sdk['client'], 'enrichToken').mockImplementation(mockFunc);

      try {
        await sdk.enrichToken(accessToken);
      } catch (err) {
        caughtError = err;
      }
    });

    it('throws the error', () => {
      expect(caughtError).toBe(error);
    });
  });
});
