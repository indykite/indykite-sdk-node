import { CallOptions, Metadata } from '@grpc/grpc-js';
import { ServiceError, SurfaceCall } from '@grpc/grpc-js/build/src/call';
import { Status } from '@grpc/grpc-js/build/src/constants';
import { EnrichTokenResponse } from '../../../grpc/indykite/identity/v1beta2/identity_management_api';
import { IdentityClientV2 } from '../../identity_v2';
import { applicationTokenMock } from '../../utils/test_utils';

describe('resendInvitation', () => {
  describe('when no error is returned', () => {
    let enrichTokenSpy: jest.SpyInstance;
    let sdk: IdentityClientV2;

    beforeEach(async () => {
      sdk = await IdentityClientV2.createInstance(JSON.stringify(applicationTokenMock));
      enrichTokenSpy = jest
        .spyOn(sdk['client'], 'enrichToken')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response?: EnrichTokenResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(null);
            }
            return {} as SurfaceCall;
          },
        );
      await sdk.enrichToken({
        accessToken: 'access-token',
        tokenClaims: {
          fields: {
            customClaim: {
              kind: {
                oneofKind: 'numberValue',
                numberValue: 42,
              },
            },
          },
        },
        sessionClaims: {
          fields: {
            customClaim: {
              kind: {
                oneofKind: 'numberValue',
                numberValue: 62,
              },
            },
          },
        },
      });
    });

    it('sends correct request', () => {
      expect(enrichTokenSpy).toBeCalledWith(
        {
          accessToken: 'access-token',
          tokenClaims: {
            fields: {
              customClaim: {
                kind: {
                  oneofKind: 'numberValue',
                  numberValue: 42,
                },
              },
            },
          },
          sessionClaims: {
            fields: {
              customClaim: {
                kind: {
                  oneofKind: 'numberValue',
                  numberValue: 62,
                },
              },
            },
          },
        },
        expect.any(Function),
      );
    });
  });

  describe('when an error is returned', () => {
    const error = {
      code: Status.NOT_FOUND,
      details: 'DETAILS',
      metadata: {},
    } as ServiceError;
    let thrownError: Error;

    beforeEach(async () => {
      const sdk = await IdentityClientV2.createInstance(JSON.stringify(applicationTokenMock));
      jest
        .spyOn(sdk['client'], 'enrichToken')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response?: EnrichTokenResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(error);
            }
            return {} as SurfaceCall;
          },
        );
      sdk
        .enrichToken({
          accessToken: 'access-token',
          tokenClaims: {
            fields: {
              customClaim: {
                kind: {
                  oneofKind: 'numberValue',
                  numberValue: 42,
                },
              },
            },
          },
          sessionClaims: {
            fields: {
              customClaim: {
                kind: {
                  oneofKind: 'numberValue',
                  numberValue: 62,
                },
              },
            },
          },
        })
        .catch((err) => {
          thrownError = err;
        });
    });

    it('throws an error', () => {
      expect(thrownError).toBe(error);
    });
  });
});
