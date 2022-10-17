import { CallOptions, Metadata } from '@grpc/grpc-js';
import { ServiceError, SurfaceCall } from '@grpc/grpc-js/build/src/call';
import { Status } from '@grpc/grpc-js/build/src/constants';
import {
  DeleteServiceAccountCredentialResponse,
  ReadServiceAccountCredentialResponse,
  RegisterServiceAccountCredentialResponse,
} from '../../../grpc/indykite/config/v1beta1/config_management_api';
import { ConfigClient } from '../../config';
import { Utils } from '../../utils/utils';
import { ServiceAccountCredential } from '../../model/config/service_account_credential';
import { serviceAccountTokenMock } from '../../utils/test_utils';

afterEach(() => {
  jest.clearAllMocks();
});

describe('registerServiceAccountCredential', () => {
  describe('when no error is returned', () => {
    let serviceAccountCredential: ServiceAccountCredential;
    let registerServiceAccountCredentialSpy: jest.SpyInstance;
    let sdk: ConfigClient;

    beforeEach(async () => {
      sdk = await ConfigClient.createInstance(JSON.stringify(serviceAccountTokenMock));
      registerServiceAccountCredentialSpy = jest
        .spyOn(sdk['client'], 'registerServiceAccountCredential')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((
                  err: ServiceError | null,
                  response: RegisterServiceAccountCredentialResponse,
                ) => void),
          ) => {
            if (typeof res === 'function') {
              res(null, {
                id: 'new-service-account-credentials-id',
                kid: 'kid-id',
                serviceAccountConfig: new Uint8Array(
                  Buffer.from(
                    '{"baseUrl":"https://jarvis-dev.indykite.com" /* SKIPPED REST VALUES */}',
                    'utf-8',
                  ),
                ),
                createTime: Utils.dateToTimestamp(new Date(2022, 5, 20, 11, 27)),
                expireTime: req.expireTime,
                serviceAccountId: 'service-account-id',
              });
            }
            return {} as SurfaceCall;
          },
        );
    });

    describe('when necessary values are sent only', () => {
      beforeEach(async () => {
        serviceAccountCredential = await sdk.registerServiceAccountCredential(
          'service-account-id',
          'Service Account Credentials',
        );
      });

      it('sends correct request', () => {
        expect(registerServiceAccountCredentialSpy).toBeCalledWith(
          {
            serviceAccountId: 'service-account-id',
            displayName: 'Service Account Credentials',
            publicKey: { oneofKind: undefined },
          },
          expect.any(Function),
        );
      });

      it('returns a correct instance', () => {
        expect(serviceAccountCredential.id).toBe('new-service-account-credentials-id');
        expect(serviceAccountCredential.kid).toBe('kid-id');
        expect(serviceAccountCredential.serviceAccountId).toBe('service-account-id');
        expect(serviceAccountCredential.serviceAccountConfig).toBe(
          '{"baseUrl":"https://jarvis-dev.indykite.com" /* SKIPPED REST VALUES */}',
        );
        expect(serviceAccountCredential.appSpaceId).toBeUndefined();
        expect(serviceAccountCredential.createTime?.toString()).toBe(
          new Date(2022, 5, 20, 11, 27).toString(),
        );
        expect(serviceAccountCredential.customerId).toBeUndefined();
        expect(serviceAccountCredential.deleteTime).toBeUndefined();
        expect(serviceAccountCredential.destroyTime).toBeUndefined();
        expect(serviceAccountCredential.displayName).toBe('Service Account Credentials');
        expect(serviceAccountCredential.expireTime).toBeUndefined();
      });
    });

    describe('when all possible values are sent (JWK variant)', () => {
      const publicKey = Buffer.from('mocked-jwk-key');
      const expireTime = new Date(2022, 11, 31, 23, 59, 59);

      beforeEach(async () => {
        serviceAccountCredential = await sdk.registerServiceAccountCredential(
          'service-account-id',
          'Service Account Credentials',
          'jwk',
          publicKey,
          expireTime,
        );
      });

      it('sends correct request', () => {
        expect(registerServiceAccountCredentialSpy).toBeCalledWith(
          {
            serviceAccountId: 'service-account-id',
            displayName: 'Service Account Credentials',
            publicKey: { oneofKind: 'jwk', jwk: publicKey },
            expireTime: Utils.dateToTimestamp(expireTime),
          },
          expect.any(Function),
        );
      });

      it('returns a correct instance', () => {
        expect(serviceAccountCredential.id).toBe('new-service-account-credentials-id');
        expect(serviceAccountCredential.kid).toBe('kid-id');
        expect(serviceAccountCredential.serviceAccountId).toBe('service-account-id');
        expect(serviceAccountCredential.serviceAccountConfig).toBe(
          '{"baseUrl":"https://jarvis-dev.indykite.com" /* SKIPPED REST VALUES */}',
        );
        expect(serviceAccountCredential.appSpaceId).toBeUndefined();
        expect(serviceAccountCredential.createTime?.toString()).toBe(
          new Date(2022, 5, 20, 11, 27).toString(),
        );
        expect(serviceAccountCredential.customerId).toBeUndefined();
        expect(serviceAccountCredential.deleteTime).toBeUndefined();
        expect(serviceAccountCredential.destroyTime).toBeUndefined();
        expect(serviceAccountCredential.displayName).toBe('Service Account Credentials');
        expect(serviceAccountCredential.expireTime?.toString()).toBe(
          new Date(2022, 11, 31, 23, 59, 59).toString(),
        );
      });
    });

    describe('when all possible values are sent (PEM variant)', () => {
      const publicKey = Buffer.from('mocked-pem-key');
      const expireTime = new Date(2022, 11, 31, 23, 59, 59);

      beforeEach(async () => {
        serviceAccountCredential = await sdk.registerServiceAccountCredential(
          'service-account-id',
          'Service Account Credentials',
          'pem',
          publicKey,
          expireTime,
        );
      });

      it('sends correct request', () => {
        expect(registerServiceAccountCredentialSpy).toBeCalledWith(
          {
            serviceAccountId: 'service-account-id',
            displayName: 'Service Account Credentials',
            publicKey: { oneofKind: 'pem', pem: publicKey },
            expireTime: Utils.dateToTimestamp(expireTime),
          },
          expect.any(Function),
        );
      });

      it('returns a correct instance', () => {
        expect(serviceAccountCredential.id).toBe('new-service-account-credentials-id');
        expect(serviceAccountCredential.kid).toBe('kid-id');
        expect(serviceAccountCredential.serviceAccountId).toBe('service-account-id');
        expect(serviceAccountCredential.serviceAccountConfig).toBe(
          '{"baseUrl":"https://jarvis-dev.indykite.com" /* SKIPPED REST VALUES */}',
        );
        expect(serviceAccountCredential.appSpaceId).toBeUndefined();
        expect(serviceAccountCredential.createTime?.toString()).toBe(
          new Date(2022, 5, 20, 11, 27).toString(),
        );
        expect(serviceAccountCredential.customerId).toBeUndefined();
        expect(serviceAccountCredential.deleteTime).toBeUndefined();
        expect(serviceAccountCredential.destroyTime).toBeUndefined();
        expect(serviceAccountCredential.displayName).toBe('Service Account Credentials');
        expect(serviceAccountCredential.expireTime?.toString()).toBe(
          new Date(2022, 11, 31, 23, 59, 59).toString(),
        );
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
      const sdk = await ConfigClient.createInstance(JSON.stringify(serviceAccountTokenMock));
      jest
        .spyOn(sdk['client'], 'registerServiceAccountCredential')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((
                  err: ServiceError | null,
                  response?: RegisterServiceAccountCredentialResponse,
                ) => void),
          ) => {
            if (typeof res === 'function') {
              res(error);
            }
            return {} as SurfaceCall;
          },
        );
      sdk
        .registerServiceAccountCredential('service-account-id', 'Service Account Credentials')
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
      const sdk = await ConfigClient.createInstance(JSON.stringify(serviceAccountTokenMock));
      jest
        .spyOn(sdk['client'], 'registerServiceAccountCredential')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((
                  err: ServiceError | null,
                  response?: RegisterServiceAccountCredentialResponse,
                ) => void),
          ) => {
            if (typeof res === 'function') {
              res(null);
            }
            return {} as SurfaceCall;
          },
        );
      sdk
        .registerServiceAccountCredential('service-account-id', 'Service Account Credentials')
        .catch((err) => {
          thrownError = err;
        });
    });

    it('throws an error', () => {
      expect(thrownError.message).toBe('No service account credential response');
    });
  });
});

describe('readServiceAccountCredential', () => {
  describe('when no error is returned', () => {
    let credential: ServiceAccountCredential;
    let readServiceAccountCredentialSpy: jest.SpyInstance;

    beforeEach(async () => {
      const sdk = await ConfigClient.createInstance(JSON.stringify(serviceAccountTokenMock));
      readServiceAccountCredentialSpy = jest
        .spyOn(sdk['client'], 'readServiceAccountCredential')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((
                  err: ServiceError | null,
                  response: ReadServiceAccountCredentialResponse,
                ) => void),
          ) => {
            if (typeof res === 'function') {
              res(null, {
                serviceAccountCredential: {
                  id: 'service-account-credential-id',
                  kid: 'kid-id',
                  appSpaceId: 'app-space-id',
                  serviceAccountId: 'service-account-id',
                  customerId: 'customer-id',
                  displayName: 'Service Account Credential',
                  createTime: Utils.dateToTimestamp(new Date(2022, 2, 15, 13, 13)),
                  deleteTime: Utils.dateToTimestamp(new Date(2022, 2, 15, 13, 14)),
                  destroyTime: Utils.dateToTimestamp(new Date(2022, 2, 15, 13, 15)),
                },
              });
            }
            return {} as SurfaceCall;
          },
        );
      credential = await sdk.readServiceAccountCredential('service-account-credential-id');
    });

    it('sends correct request', () => {
      expect(readServiceAccountCredentialSpy).toBeCalledWith(
        {
          id: 'service-account-credential-id',
        },
        expect.any(Function),
      );
    });

    it('returns a correct instance', () => {
      expect(credential.id).toBe('service-account-credential-id');
      expect(credential.kid).toBe('kid-id');
      expect(credential.appSpaceId).toBe('app-space-id');
      expect(credential.serviceAccountId).toBe('service-account-id');
      expect(credential.customerId).toBe('customer-id');
      expect(credential.displayName).toBe('Service Account Credential');
      expect(credential.createTime?.toString()).toBe(new Date(2022, 2, 15, 13, 13).toString());
      expect(credential.deleteTime?.toString()).toBe(new Date(2022, 2, 15, 13, 14).toString());
      expect(credential.destroyTime?.toString()).toBe(new Date(2022, 2, 15, 13, 15).toString());
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
      const sdk = await ConfigClient.createInstance(JSON.stringify(serviceAccountTokenMock));
      jest
        .spyOn(sdk['client'], 'readServiceAccountCredential')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((
                  err: ServiceError | null,
                  response?: ReadServiceAccountCredentialResponse,
                ) => void),
          ) => {
            if (typeof res === 'function') {
              res(error);
            }
            return {} as SurfaceCall;
          },
        );
      sdk.readServiceAccountCredential('service-account-credential-id').catch((err) => {
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
      const sdk = await ConfigClient.createInstance(JSON.stringify(serviceAccountTokenMock));
      jest
        .spyOn(sdk['client'], 'readServiceAccountCredential')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((
                  err: ServiceError | null,
                  response?: ReadServiceAccountCredentialResponse,
                ) => void),
          ) => {
            if (typeof res === 'function') {
              res(null);
            }
            return {} as SurfaceCall;
          },
        );
      sdk.readServiceAccountCredential('service-account-credential-id').catch((err) => {
        thrownError = err;
      });
    });

    it('throws an error', () => {
      expect(thrownError.message).toBe('No service account credential response');
    });
  });
});

describe('deleteServiceAccountCredential', () => {
  describe('when no error is returned', () => {
    let deleteServiceAccountCredentialSpy: jest.SpyInstance;
    let sdk: ConfigClient;

    beforeEach(async () => {
      sdk = await ConfigClient.createInstance(JSON.stringify(serviceAccountTokenMock));
      deleteServiceAccountCredentialSpy = jest
        .spyOn(sdk['client'], 'deleteServiceAccountCredential')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((
                  err: ServiceError | null,
                  response: DeleteServiceAccountCredentialResponse,
                ) => void),
          ) => {
            if (typeof res === 'function') {
              res(null, {
                id: 'service-account-credential-id',
                etag: 'etag-id',
              });
            }
            return {} as SurfaceCall;
          },
        );
      return sdk.deleteServiceAccountCredential('service-account-credential-id');
    });

    it('sends correct request', () => {
      expect(deleteServiceAccountCredentialSpy).toBeCalledWith(
        {
          id: 'service-account-credential-id',
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
      const sdk = await ConfigClient.createInstance(JSON.stringify(serviceAccountTokenMock));
      jest
        .spyOn(sdk['client'], 'deleteServiceAccountCredential')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((
                  err: ServiceError | null,
                  response?: DeleteServiceAccountCredentialResponse,
                ) => void),
          ) => {
            if (typeof res === 'function') {
              res(error);
            }
            return {} as SurfaceCall;
          },
        );
      sdk.deleteServiceAccountCredential('service-account-credential-id').catch((err) => {
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
      const sdk = await ConfigClient.createInstance(JSON.stringify(serviceAccountTokenMock));
      jest
        .spyOn(sdk['client'], 'deleteServiceAccountCredential')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((
                  err: ServiceError | null,
                  response?: DeleteServiceAccountCredentialResponse,
                ) => void),
          ) => {
            if (typeof res === 'function') {
              res(null);
            }
            return {} as SurfaceCall;
          },
        );
      sdk.deleteServiceAccountCredential('service-account-credential-id').catch((err) => {
        thrownError = err;
      });
    });

    it('throws an error', () => {
      expect(thrownError.message).toBe('No service account credential response');
    });
  });
});
