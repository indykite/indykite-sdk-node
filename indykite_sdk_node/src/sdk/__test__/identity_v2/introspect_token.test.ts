import { CallOptions, Metadata } from '@grpc/grpc-js';
import { ServiceError, SurfaceCall } from '@grpc/grpc-js/build/src/call';
import { Status } from '@grpc/grpc-js/build/src/constants';
import { TokenIntrospectResponse } from '../../../grpc/indykite/identity/v1beta2/identity_management_api';
import { IdentityClientV2 } from '../../identity_v2';
import { applicationTokenMock } from '../../utils/test_utils';

describe('getPasswordCredential', () => {
  describe('when no error is returned', () => {
    let tokenIntrospectSpy: jest.SpyInstance;
    let sdk: IdentityClientV2;
    let response: TokenIntrospectResponse;

    beforeEach(async () => {
      sdk = await IdentityClientV2.createInstance(JSON.stringify(applicationTokenMock));
      tokenIntrospectSpy = jest
        .spyOn(sdk['client'], 'tokenIntrospect')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response: TokenIntrospectResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(null, { active: true });
            }
            return {} as SurfaceCall;
          },
        );
      response = await sdk.introspectToken('access-token');
    });

    it('sends correct request', () => {
      expect(tokenIntrospectSpy).toBeCalledWith(
        {
          tenantId: '',
          token: 'access-token',
        },
        expect.any(Function),
      );
    });

    it('gets correct response', () => {
      expect(response).toEqual({
        active: true,
      });
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
        .spyOn(sdk['client'], 'tokenIntrospect')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response?: TokenIntrospectResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(error);
            }
            return {} as SurfaceCall;
          },
        );
      sdk.introspectToken('access-token').catch((err) => {
        thrownError = err;
      });
    });

    it('throws an error', () => {
      expect(thrownError).toBe(error);
    });
  });

  describe('when no response is returned', () => {
    let thrownError: Error;

    beforeEach(async () => {
      const sdk = await IdentityClientV2.createInstance(JSON.stringify(applicationTokenMock));
      jest
        .spyOn(sdk['client'], 'tokenIntrospect')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response?: TokenIntrospectResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(null);
            }
            return {} as SurfaceCall;
          },
        );
      sdk.introspectToken('access-token').catch((err) => {
        thrownError = err;
      });
    });

    it('throws an error', () => {
      expect(thrownError.message).toBe('Missing token introspect response');
    });
  });
});
