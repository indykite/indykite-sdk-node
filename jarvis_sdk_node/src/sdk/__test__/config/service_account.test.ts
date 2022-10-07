import { CallOptions, Metadata } from '@grpc/grpc-js';
import { ServiceError, SurfaceCall } from '@grpc/grpc-js/build/src/call';
import { Status } from '@grpc/grpc-js/build/src/constants';
import {
  CreateServiceAccountResponse,
  DeleteServiceAccountResponse,
  ReadServiceAccountResponse,
  UpdateServiceAccountResponse,
} from '../../../grpc/indykite/config/v1beta1/config_management_api';
import { ConfigClient } from '../../config';
import { SdkError, SdkErrorCode } from '../../error';
import { Utils } from '../../utils/utils';
import { ServiceAccount } from '../../model/config/service_account';
import { serviceAccountTokenMock } from '../../utils/test_utils';

describe('createserviceAccount', () => {
  describe('when no error is returned', () => {
    let serviceAccount: ServiceAccount;
    let createServiceAccountSpy: jest.SpyInstance;
    let sdk: ConfigClient;

    beforeEach(async () => {
      sdk = await ConfigClient.createInstance(JSON.stringify(serviceAccountTokenMock));
      createServiceAccountSpy = jest
        .spyOn(sdk['client'], 'createServiceAccount')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response: CreateServiceAccountResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(null, {
                id: 'new-service-account-id',
                etag: '111',
              });
            }
            return {} as SurfaceCall;
          },
        );
    });

    describe('when necessary values are sent only', () => {
      beforeEach(async () => {
        serviceAccount = await sdk.createServiceAccount(
          'customer-id',
          'service-account-name',
          'all_editor',
        );
      });

      it('sends correct request', () => {
        expect(createServiceAccountSpy).toBeCalledWith(
          {
            location: 'customer-id',
            name: 'service-account-name',
            role: 'all_editor',
          },
          expect.any(Function),
        );
      });

      it('returns a correct instance', () => {
        expect(serviceAccount.id).toBe('new-service-account-id');
        expect(serviceAccount.customerId).toBeUndefined();
        expect(serviceAccount.appSpaceId).toBeUndefined();
        expect(serviceAccount.etag).toBe('111');
        expect(serviceAccount.name).toBe('service-account-name');
        expect(serviceAccount.displayName).toBeUndefined();
        expect(serviceAccount.description).toBeUndefined();
      });
    });

    describe('when all possible values are sent', () => {
      beforeEach(async () => {
        serviceAccount = await sdk.createServiceAccount(
          'customer-id',
          'service-account-name',
          'all_editor',
          'Display Name',
          'Description',
        );
      });

      it('sends correct request', () => {
        expect(createServiceAccountSpy).toBeCalledWith(
          {
            location: 'customer-id',
            name: 'service-account-name',
            role: 'all_editor',
            displayName: { value: 'Display Name' },
            description: { value: 'Description' },
          },
          expect.any(Function),
        );
      });

      it('returns a correct instance', () => {
        expect(serviceAccount.id).toBe('new-service-account-id');
        expect(serviceAccount.customerId).toBeUndefined();
        expect(serviceAccount.appSpaceId).toBeUndefined();
        expect(serviceAccount.etag).toBe('111');
        expect(serviceAccount.name).toBe('service-account-name');
        expect(serviceAccount.displayName).toBe('Display Name');
        expect(serviceAccount.description).toBe('Description');
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
        .spyOn(sdk['client'], 'createServiceAccount')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response?: CreateServiceAccountResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(error);
            }
            return {} as SurfaceCall;
          },
        );
      sdk.createServiceAccount('customer-id', 'service-account-name', 'all_editor').catch((err) => {
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
        .spyOn(sdk['client'], 'createServiceAccount')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response?: CreateServiceAccountResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(null);
            }
            return {} as SurfaceCall;
          },
        );
      sdk.createServiceAccount('customer-id', 'service-account-name', 'all_editor').catch((err) => {
        thrownError = err;
      });
    });

    it('throws an error', () => {
      expect(thrownError.message).toBe('No service account response');
    });
  });
});

describe('readServiceAccountById', () => {
  describe('when no error is returned', () => {
    let serviceAccount: ServiceAccount;
    let readserviceAccountSpy: jest.SpyInstance;

    beforeEach(async () => {
      const sdk = await ConfigClient.createInstance(JSON.stringify(serviceAccountTokenMock));
      readserviceAccountSpy = jest
        .spyOn(sdk['client'], 'readServiceAccount')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response: ReadServiceAccountResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(null, {
                serviceAccount: {
                  id: 'service-account-id',
                  name: 'service-account-name',
                  etag: 'etag-token',
                  displayName: 'Service Account Name',
                  createTime: Utils.dateToTimestamp(new Date(2022, 5, 28, 11, 54)),
                  updateTime: Utils.dateToTimestamp(new Date(2022, 5, 28, 11, 55)),
                  deleteTime: Utils.dateToTimestamp(new Date(2022, 5, 28, 11, 56)),
                  destroyTime: Utils.dateToTimestamp(new Date(2022, 5, 28, 11, 57)),
                  customerId: 'customer-id',
                  appSpaceId: 'app-space-id',
                },
              });
            }
            return {} as SurfaceCall;
          },
        );
      serviceAccount = await sdk.readServiceAccountById('service-account-id-request');
    });

    it('sends correct request', () => {
      expect(readserviceAccountSpy).toBeCalledWith(
        {
          identifier: {
            oneofKind: 'id',
            id: 'service-account-id-request',
          },
        },
        expect.any(Function),
      );
    });

    it('returns a correct instance', () => {
      expect(serviceAccount).toEqual({
        id: 'service-account-id',
        name: 'service-account-name',
        etag: 'etag-token',
        displayName: 'Service Account Name',
        createTime: new Date(2022, 5, 28, 11, 54),
        updateTime: new Date(2022, 5, 28, 11, 55),
        deleteTime: new Date(2022, 5, 28, 11, 56),
        destroyTime: new Date(2022, 5, 28, 11, 57),
        customerId: 'customer-id',
        appSpaceId: 'app-space-id',
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
        .spyOn(sdk['client'], 'readServiceAccount')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response?: ReadServiceAccountResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(error);
            }
            return {} as SurfaceCall;
          },
        );
      sdk.readServiceAccountById('service-account-id-request').catch((err) => {
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
        .spyOn(sdk['client'], 'readServiceAccount')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response?: ReadServiceAccountResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(null);
            }
            return {} as SurfaceCall;
          },
        );
      sdk.readServiceAccountById('service-account-id-request').catch((err) => {
        thrownError = err;
      });
    });

    it('throws an error', () => {
      expect(thrownError.message).toBe('No service account response');
    });
  });
});

describe('readServiceAccountByName', () => {
  describe('when no error is returned', () => {
    let serviceAccount: ServiceAccount;
    let readServiceAccountSpy: jest.SpyInstance;

    beforeEach(async () => {
      const sdk = await ConfigClient.createInstance(JSON.stringify(serviceAccountTokenMock));
      readServiceAccountSpy = jest
        .spyOn(sdk['client'], 'readServiceAccount')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response: ReadServiceAccountResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(null, {
                serviceAccount: {
                  id: 'service-account-id',
                  name: 'service-account-name',
                  etag: 'etag-token',
                  displayName: 'Service Account Name',
                  createTime: Utils.dateToTimestamp(new Date(2022, 5, 28, 11, 54)),
                  updateTime: Utils.dateToTimestamp(new Date(2022, 5, 28, 11, 55)),
                  deleteTime: Utils.dateToTimestamp(new Date(2022, 5, 28, 11, 56)),
                  destroyTime: Utils.dateToTimestamp(new Date(2022, 5, 28, 11, 57)),
                  customerId: 'customer-id',
                  appSpaceId: 'app-space-id',
                },
              });
            }
            return {} as SurfaceCall;
          },
        );
      serviceAccount = await sdk.readServiceAccountByName('customer-id', 'service-account-name');
    });

    it('sends correct request', () => {
      expect(readServiceAccountSpy).toBeCalledWith(
        {
          identifier: {
            oneofKind: 'name',
            name: {
              location: 'customer-id',
              name: 'service-account-name',
            },
          },
        },
        expect.any(Function),
      );
    });

    it('returns a correct instance', () => {
      expect(serviceAccount).toEqual({
        id: 'service-account-id',
        name: 'service-account-name',
        etag: 'etag-token',
        displayName: 'Service Account Name',
        createTime: new Date(2022, 5, 28, 11, 54),
        updateTime: new Date(2022, 5, 28, 11, 55),
        deleteTime: new Date(2022, 5, 28, 11, 56),
        destroyTime: new Date(2022, 5, 28, 11, 57),
        customerId: 'customer-id',
        appSpaceId: 'app-space-id',
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
        .spyOn(sdk['client'], 'readServiceAccount')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response?: ReadServiceAccountResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(error);
            }
            return {} as SurfaceCall;
          },
        );
      sdk.readServiceAccountByName('customer-id', 'service-account-name').catch((err) => {
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
        .spyOn(sdk['client'], 'readServiceAccount')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response?: ReadServiceAccountResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(null);
            }
            return {} as SurfaceCall;
          },
        );
      sdk.readServiceAccountByName('customer-id', 'service-account-name').catch((err) => {
        thrownError = err;
      });
    });

    it('throws an error', () => {
      expect(thrownError.message).toBe('No service account response');
    });
  });
});

describe('updateServiceAccount', () => {
  describe('when no error is returned', () => {
    let updatedServiceAccount: ServiceAccount;
    let updateServiceAccountSpy: jest.SpyInstance;
    let sdk: ConfigClient;

    beforeEach(async () => {
      sdk = await ConfigClient.createInstance(JSON.stringify(serviceAccountTokenMock));
      updateServiceAccountSpy = jest
        .spyOn(sdk['client'], 'updateServiceAccount')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response: UpdateServiceAccountResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(null, {
                etag: 'new-etag-id',
                id: 'service-account-id',
                updateTime: Utils.dateToTimestamp(new Date(2022, 2, 15, 13, 16)),
              });
            }
            return {} as SurfaceCall;
          },
        );
    });

    describe('when necessary values are sent only', () => {
      beforeEach(async () => {
        const serviceAccount = new ServiceAccount('service-account-id', 'service-account-name');
        updatedServiceAccount = await sdk.updateServiceAccount(serviceAccount);
      });

      it('sends correct request', () => {
        expect(updateServiceAccountSpy).toBeCalledWith(
          {
            id: 'service-account-id',
          },
          expect.any(Function),
        );
      });

      it('returns a correct instance', () => {
        expect(updatedServiceAccount).toEqual({
          id: 'service-account-id',
          name: 'service-account-name',
          etag: 'new-etag-id',
          updateTime: new Date(2022, 2, 15, 13, 16),
        });
      });
    });

    describe('when all possible values are sent', () => {
      beforeEach(async () => {
        const serviceAccount = new ServiceAccount(
          'service-account-id',
          'service-account-name',
          'etag-token',
          'customer-id',
          'app-space-id',
          new Date(2022, 5, 28, 11, 54),
          new Date(2022, 5, 28, 11, 55),
          new Date(2022, 5, 28, 11, 56),
          new Date(2022, 5, 28, 11, 57),
          'Service Account Name',
          'Description',
        );
        updatedServiceAccount = await sdk.updateServiceAccount(serviceAccount);
      });

      it('sends correct request', () => {
        expect(updateServiceAccountSpy).toBeCalledWith(
          {
            id: 'service-account-id',
            etag: { value: 'etag-token' },
            displayName: { value: 'Service Account Name' },
            description: { value: 'Description' },
          },
          expect.any(Function),
        );
      });

      it('returns a correct instance', () => {
        expect(updatedServiceAccount).toEqual({
          id: 'service-account-id',
          name: 'service-account-name',
          etag: 'new-etag-id',
          displayName: 'Service Account Name',
          description: 'Description',
          createTime: new Date(2022, 5, 28, 11, 54),
          updateTime: new Date(2022, 2, 15, 13, 16),
          deleteTime: new Date(2022, 5, 28, 11, 56),
          destroyTime: new Date(2022, 5, 28, 11, 57),
          customerId: 'customer-id',
          appSpaceId: 'app-space-id',
        });
      });
    });
  });

  describe('when a different service account is returned', () => {
    let thrownError: SdkError;

    beforeEach(async () => {
      const sdk = await ConfigClient.createInstance(JSON.stringify(serviceAccountTokenMock));
      jest
        .spyOn(sdk['client'], 'updateServiceAccount')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response: UpdateServiceAccountResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(null, {
                etag: '777',
                id: 'different-service-account-id',
                updateTime: Utils.dateToTimestamp(new Date(2022, 2, 15, 13, 16)),
              });
            }
            return {} as SurfaceCall;
          },
        );
      const serviceAccount = new ServiceAccount('service-account-id', 'service-account-name');
      return sdk.updateServiceAccount(serviceAccount).catch((err) => (thrownError = err));
    });

    it('throws an error', () => {
      expect(thrownError.code).toEqual(SdkErrorCode.SDK_CODE_1);
      expect(thrownError.description).toBe(
        'Update returned with different id: req.iq=service-account-id, res.id=different-service-account-id',
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
        .spyOn(sdk['client'], 'updateServiceAccount')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response?: UpdateServiceAccountResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(error);
            }
            return {} as SurfaceCall;
          },
        );
      const serviceAccount = new ServiceAccount('service-account-id', 'service-account-name');
      sdk.updateServiceAccount(serviceAccount).catch((err) => {
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
        .spyOn(sdk['client'], 'updateServiceAccount')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response?: UpdateServiceAccountResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(null);
            }
            return {} as SurfaceCall;
          },
        );
      const serviceAccount = new ServiceAccount('service-account-id', 'service-account-name');
      sdk.updateServiceAccount(serviceAccount).catch((err) => {
        thrownError = err;
      });
    });

    it('throws an error', () => {
      expect(thrownError.message).toBe(
        'Update returned with different id: req.iq=service-account-id, res.id=undefined',
      );
    });
  });
});

describe('deleteServiceAccount', () => {
  describe('when no error is returned', () => {
    let deleteServiceAccountSpy: jest.SpyInstance;
    let sdk: ConfigClient;

    beforeEach(async () => {
      sdk = await ConfigClient.createInstance(JSON.stringify(serviceAccountTokenMock));
      deleteServiceAccountSpy = jest
        .spyOn(sdk['client'], 'deleteServiceAccount')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response: DeleteServiceAccountResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(null, {
                id: 'service-account-id',
                etag: 'etag-id',
              });
            }
            return {} as SurfaceCall;
          },
        );
      return sdk.deleteServiceAccount('service-account-id');
    });

    it('sends correct request', () => {
      expect(deleteServiceAccountSpy).toBeCalledWith(
        {
          id: 'service-account-id',
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
        .spyOn(sdk['client'], 'deleteServiceAccount')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response?: DeleteServiceAccountResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(error);
            }
            return {} as SurfaceCall;
          },
        );
      sdk.deleteServiceAccount('service-account-id').catch((err) => {
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
        .spyOn(sdk['client'], 'deleteServiceAccount')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response?: DeleteServiceAccountResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(null);
            }
            return {} as SurfaceCall;
          },
        );
      sdk.deleteServiceAccount('service-account-id').catch((err) => {
        thrownError = err;
      });
    });

    it('throws an error', () => {
      expect(thrownError.message).toBe('No service account response');
    });
  });
});
