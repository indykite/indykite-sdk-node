import { CallOptions, Metadata } from '@grpc/grpc-js';
import { ServiceError, SurfaceCall } from '@grpc/grpc-js/build/src/call';
import { Status } from '@grpc/grpc-js/build/src/constants';
import { RegisterDigitalTwinWithoutCredentialResponse } from '../../../grpc/indykite/identity/v1beta2/identity_management_api';
import { IdentityClient } from '../../identity';
import { applicationTokenMock } from '../../utils/test_utils';
import { DigitalTwinKind } from '../../../grpc/indykite/identity/v1beta2/model';

describe('registerDigitalTwinWithoutCredential', () => {
  describe('when no error is returned', () => {
    const registerDigitalTwinWithoutCredentialResponse: RegisterDigitalTwinWithoutCredentialResponse =
      {
        bookmark: 'bookmarj-token',
        results: [
          {
            index: '0',
            result: {
              oneofKind: 'success',
              success: {
                propertyId: 'property-id',
              },
            },
          },
        ],
      };
    let registerDigitalTwinWithoutCredentialSpy: jest.SpyInstance;
    let sdk: IdentityClient;
    let response: RegisterDigitalTwinWithoutCredentialResponse;

    beforeEach(async () => {
      sdk = await IdentityClient.createInstance(JSON.stringify(applicationTokenMock));
      registerDigitalTwinWithoutCredentialSpy = jest
        .spyOn(sdk['client'], 'registerDigitalTwinWithoutCredential')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((
                  err: ServiceError | null,
                  response: RegisterDigitalTwinWithoutCredentialResponse,
                ) => void),
          ) => {
            if (typeof res === 'function') {
              res(null, registerDigitalTwinWithoutCredentialResponse);
            }
            return {} as SurfaceCall;
          },
        );
      response = await sdk.registerDigitalTwinWithoutCredential({
        bookmarks: [],
        tenantId: 'tenant-id',
        digitalTwinKind: DigitalTwinKind.PERSON,
        digitalTwinTags: [],
        properties: [],
      });
    });

    it('sends correct request', () => {
      expect(registerDigitalTwinWithoutCredentialSpy).toBeCalledWith(
        {
          bookmarks: [],
          tenantId: 'tenant-id',
          digitalTwinKind: DigitalTwinKind.PERSON,
          digitalTwinTags: [],
          properties: [],
        },
        expect.any(Function),
      );
    });

    it('gets correct response', () => {
      expect(response).toEqual(registerDigitalTwinWithoutCredentialResponse);
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
      const sdk = await IdentityClient.createInstance(JSON.stringify(applicationTokenMock));
      jest
        .spyOn(sdk['client'], 'registerDigitalTwinWithoutCredential')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((
                  err: ServiceError | null,
                  response?: RegisterDigitalTwinWithoutCredentialResponse,
                ) => void),
          ) => {
            if (typeof res === 'function') {
              res(error);
            }
            return {} as SurfaceCall;
          },
        );
      sdk
        .registerDigitalTwinWithoutCredential({
          bookmarks: [],
          tenantId: 'tenant-id',
          digitalTwinKind: DigitalTwinKind.PERSON,
          digitalTwinTags: [],
          properties: [],
        })
        .catch((err) => {
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
      const sdk = await IdentityClient.createInstance(JSON.stringify(applicationTokenMock));
      jest
        .spyOn(sdk['client'], 'registerDigitalTwinWithoutCredential')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((
                  err: ServiceError | null,
                  response?: RegisterDigitalTwinWithoutCredentialResponse,
                ) => void),
          ) => {
            if (typeof res === 'function') {
              res(null);
            }
            return {} as SurfaceCall;
          },
        );
      sdk
        .registerDigitalTwinWithoutCredential({
          bookmarks: [],
          tenantId: 'tenant-id',
          digitalTwinKind: DigitalTwinKind.PERSON,
          digitalTwinTags: [],
          properties: [],
        })
        .catch((err) => {
          thrownError = err;
        });
    });

    it('throws an error', () => {
      expect(thrownError.message).toBe('Missing register digital twin response');
    });
  });
});
