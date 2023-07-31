import { CallOptions, Metadata } from '@grpc/grpc-js';
import { ServiceError, SurfaceCall } from '@grpc/grpc-js/build/src/call';
import { Status } from '@grpc/grpc-js/build/src/constants';
import {
  CreateServiceAccountResponse,
  DeleteServiceAccountResponse,
  ReadServiceAccountResponse,
  UpdateServiceAccountResponse,
} from '../../../grpc/indykite/config/v1beta1/config_management_api';
import { ConfigClientV2 } from '../../config_v2';
import { SdkError, SdkErrorCode } from '../../error';
import { Utils } from '../../utils/utils';
import { ServiceAccount, ServiceAccountRole } from '../../model/config/service_account';
import { serviceAccountTokenMock } from '../../utils/test_utils';

describe('createserviceAccount', () => {
  describe('when no error is returned', () => {
    let serviceAccount: ServiceAccount;
    let createServiceAccountSpy: jest.SpyInstance;
    let sdk: ConfigClientV2;

    beforeEach(async () => {
      sdk = await ConfigClientV2.createInstance(JSON.stringify(serviceAccountTokenMock));
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
                bookmark: 'bookmark-token',
                createdBy: 'Lorem ipsum - creator',
                updatedBy: 'Lorem ipsum - updater',
              });
            }
            return {} as SurfaceCall;
          },
        );
    });

    describe('when necessary values are sent only', () => {
      beforeEach(async () => {
        serviceAccount = ServiceAccount.deserialize(
          await sdk.createServiceAccount(
            ConfigClientV2.newCreateServiceAccountRequest(
              'customer-id',
              'service-account-name',
              ServiceAccountRole.ALL_EDITOR,
            ),
          ),
          'service-account-name',
        );
      });

      it('sends correct request', () => {
        expect(createServiceAccountSpy).toBeCalledWith(
          {
            location: 'customer-id',
            name: 'service-account-name',
            role: 'all_editor',
            bookmarks: [],
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
        serviceAccount = ServiceAccount.deserialize(
          await sdk.createServiceAccount(
            ConfigClientV2.newCreateServiceAccountRequest(
              'customer-id',
              'service-account-name',
              ServiceAccountRole.ALL_EDITOR,
              'Display Name',
              'Description',
            ),
          ),
          'service-account-name',
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
            bookmarks: [],
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
      const sdk = await ConfigClientV2.createInstance(JSON.stringify(serviceAccountTokenMock));
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
      sdk
        .createServiceAccount(
          ConfigClientV2.newCreateServiceAccountRequest(
            'customer-id',
            'service-account-name',
            ServiceAccountRole.ALL_EDITOR,
          ),
        )
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
      const sdk = await ConfigClientV2.createInstance(JSON.stringify(serviceAccountTokenMock));
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
      sdk
        .createServiceAccount(
          ConfigClientV2.newCreateServiceAccountRequest(
            'customer-id',
            'service-account-name',
            ServiceAccountRole.ALL_EDITOR,
          ),
        )
        .catch((err) => {
          thrownError = err;
        });
    });

    it('throws an error', () => {
      expect(thrownError.message).toBe('No ServiceAccount response.');
    });
  });
});

describe('readServiceAccountById', () => {
  describe('when no error is returned', () => {
    let serviceAccount: ServiceAccount;
    let readserviceAccountSpy: jest.SpyInstance;

    beforeEach(async () => {
      const sdk = await ConfigClientV2.createInstance(JSON.stringify(serviceAccountTokenMock));
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
                  createdBy: 'Lorem ipsum - creator',
                  updatedBy: 'Lorem ipsum - updater',
                  createTime: Utils.dateToTimestamp(new Date(Date.UTC(2022, 5, 28, 11, 54))),
                  updateTime: Utils.dateToTimestamp(new Date(Date.UTC(2022, 5, 28, 11, 55))),
                  deleteTime: Utils.dateToTimestamp(new Date(Date.UTC(2022, 5, 28, 11, 56))),
                  destroyTime: Utils.dateToTimestamp(new Date(Date.UTC(2022, 5, 28, 11, 57))),
                  customerId: 'customer-id',
                  appSpaceId: 'app-space-id',
                },
              });
            }
            return {} as SurfaceCall;
          },
        );
      serviceAccount = ServiceAccount.deserialize(
        await sdk.readServiceAccount(
          ConfigClientV2.newReadServiceAccountRequest('id', 'service-account-id-request'),
        ),
      );
    });

    it('sends correct request', () => {
      expect(readserviceAccountSpy).toBeCalledWith(
        {
          identifier: {
            oneofKind: 'id',
            id: 'service-account-id-request',
          },
          bookmarks: [],
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
        createTime: new Date(Date.UTC(2022, 5, 28, 11, 54)),
        updateTime: new Date(Date.UTC(2022, 5, 28, 11, 55)),
        deleteTime: new Date(Date.UTC(2022, 5, 28, 11, 56)),
        destroyTime: new Date(Date.UTC(2022, 5, 28, 11, 57)),
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
      const sdk = await ConfigClientV2.createInstance(JSON.stringify(serviceAccountTokenMock));
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
      sdk
        .readServiceAccount(
          ConfigClientV2.newReadServiceAccountRequest('id', 'service-account-id-request'),
        )
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
      const sdk = await ConfigClientV2.createInstance(JSON.stringify(serviceAccountTokenMock));
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
      sdk
        .readServiceAccount(
          ConfigClientV2.newReadServiceAccountRequest('id', 'service-account-id-request'),
        )
        .catch((err) => {
          thrownError = err;
        });
    });

    it('throws an error', () => {
      expect(thrownError.message).toBe('No ServiceAccount response.');
    });
  });
});

describe('readServiceAccountByName', () => {
  describe('when no error is returned', () => {
    let serviceAccount: ServiceAccount;
    let readServiceAccountSpy: jest.SpyInstance;

    beforeEach(async () => {
      const sdk = await ConfigClientV2.createInstance(JSON.stringify(serviceAccountTokenMock));
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
                  createdBy: 'Lorem ipsum - creator',
                  updatedBy: 'Lorem ipsum - updater',
                  createTime: Utils.dateToTimestamp(new Date(Date.UTC(2022, 5, 28, 11, 54))),
                  updateTime: Utils.dateToTimestamp(new Date(Date.UTC(2022, 5, 28, 11, 55))),
                  deleteTime: Utils.dateToTimestamp(new Date(Date.UTC(2022, 5, 28, 11, 56))),
                  destroyTime: Utils.dateToTimestamp(new Date(Date.UTC(2022, 5, 28, 11, 57))),
                  customerId: 'customer-id',
                  appSpaceId: 'app-space-id',
                },
              });
            }
            return {} as SurfaceCall;
          },
        );
      serviceAccount = ServiceAccount.deserialize(
        await sdk.readServiceAccount(
          ConfigClientV2.newReadServiceAccountRequest(
            'name',
            'customer-id',
            'service-account-name',
          ),
        ),
      );
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
          bookmarks: [],
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
        createTime: new Date(Date.UTC(2022, 5, 28, 11, 54)),
        updateTime: new Date(Date.UTC(2022, 5, 28, 11, 55)),
        deleteTime: new Date(Date.UTC(2022, 5, 28, 11, 56)),
        destroyTime: new Date(Date.UTC(2022, 5, 28, 11, 57)),
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
      const sdk = await ConfigClientV2.createInstance(JSON.stringify(serviceAccountTokenMock));
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
      sdk
        .readServiceAccount(
          ConfigClientV2.newReadServiceAccountRequest(
            'name',
            'customer-id',
            'service-account-name',
          ),
        )
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
      const sdk = await ConfigClientV2.createInstance(JSON.stringify(serviceAccountTokenMock));
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
      sdk
        .readServiceAccount(
          ConfigClientV2.newReadServiceAccountRequest(
            'name',
            'customer-id',
            'service-account-name',
          ),
        )
        .catch((err) => {
          thrownError = err;
        });
    });

    it('throws an error', () => {
      expect(thrownError.message).toBe('No ServiceAccount response.');
    });
  });
});

describe('updateServiceAccount', () => {
  describe('when no error is returned', () => {
    let updatedServiceAccount: UpdateServiceAccountResponse;
    let updateServiceAccountSpy: jest.SpyInstance;
    let sdk: ConfigClientV2;

    beforeEach(async () => {
      sdk = await ConfigClientV2.createInstance(JSON.stringify(serviceAccountTokenMock));
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
                updateTime: Utils.dateToTimestamp(new Date(Date.UTC(2022, 2, 15, 13, 16))),
                bookmark: 'bookmark-token',
                createdBy: 'Lorem ipsum - creator',
                updatedBy: 'Lorem ipsum - updater',
              });
            }
            return {} as SurfaceCall;
          },
        );
    });

    describe('when necessary values are sent only', () => {
      beforeEach(async () => {
        const serviceAccount = new ServiceAccount('service-account-id', 'service-account-name');
        updatedServiceAccount = await sdk.updateServiceAccount(
          ConfigClientV2.newUpdateServiceAccountRequest(serviceAccount),
        );
      });

      it('sends correct request', () => {
        expect(updateServiceAccountSpy).toBeCalledWith(
          {
            id: 'service-account-id',
            bookmarks: [],
          },
          expect.any(Function),
        );
      });

      it('returns a correct instance', () => {
        expect(updatedServiceAccount).toEqual({
          bookmark: 'bookmark-token',
          createdBy: 'Lorem ipsum - creator',
          updatedBy: 'Lorem ipsum - updater',
          etag: 'new-etag-id',
          id: 'service-account-id',
          updateTime: Utils.dateToTimestamp(new Date(Date.UTC(2022, 2, 15, 13, 16))),
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
          new Date(Date.UTC(2022, 5, 28, 11, 54)),
          new Date(Date.UTC(2022, 5, 28, 11, 55)),
          new Date(Date.UTC(2022, 5, 28, 11, 56)),
          new Date(Date.UTC(2022, 5, 28, 11, 57)),
          'Service Account Name',
          'Description',
        );
        updatedServiceAccount = await sdk.updateServiceAccount(
          ConfigClientV2.newUpdateServiceAccountRequest(serviceAccount),
        );
      });

      it('sends correct request', () => {
        expect(updateServiceAccountSpy).toBeCalledWith(
          {
            id: 'service-account-id',
            etag: { value: 'etag-token' },
            displayName: { value: 'Service Account Name' },
            description: { value: 'Description' },
            bookmarks: [],
          },
          expect.any(Function),
        );
      });

      it('returns a correct instance', () => {
        expect(updatedServiceAccount).toEqual({
          bookmark: 'bookmark-token',
          createdBy: 'Lorem ipsum - creator',
          updatedBy: 'Lorem ipsum - updater',
          etag: 'new-etag-id',
          id: 'service-account-id',
          updateTime: Utils.dateToTimestamp(new Date(Date.UTC(2022, 2, 15, 13, 16))),
        });
      });
    });
  });

  describe('when a different service account is returned', () => {
    let thrownError: SdkError;

    beforeEach(async () => {
      const sdk = await ConfigClientV2.createInstance(JSON.stringify(serviceAccountTokenMock));
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
                updateTime: Utils.dateToTimestamp(new Date(Date.UTC(2022, 2, 15, 13, 16))),
                bookmark: 'bookmark-token',
                createdBy: 'Lorem ipsum - creator',
                updatedBy: 'Lorem ipsum - updater',
              });
            }
            return {} as SurfaceCall;
          },
        );
      const serviceAccount = new ServiceAccount('service-account-id', 'service-account-name');
      return sdk
        .updateServiceAccount(ConfigClientV2.newUpdateServiceAccountRequest(serviceAccount))
        .catch((err) => (thrownError = err));
    });

    it('throws an error', () => {
      expect(thrownError.code).toEqual(SdkErrorCode.SDK_CODE_4);
      expect(thrownError.description).toBe(
        'Update returned with different id: request.id=service-account-id, response.id=different-service-account-id.',
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
      const sdk = await ConfigClientV2.createInstance(JSON.stringify(serviceAccountTokenMock));
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
      sdk
        .updateServiceAccount(ConfigClientV2.newUpdateServiceAccountRequest(serviceAccount))
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
      const sdk = await ConfigClientV2.createInstance(JSON.stringify(serviceAccountTokenMock));
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
      sdk
        .updateServiceAccount(ConfigClientV2.newUpdateServiceAccountRequest(serviceAccount))
        .catch((err) => {
          thrownError = err;
        });
    });

    it('throws an error', () => {
      expect(thrownError.message).toBe(
        'Update returned with different id: request.id=service-account-id, response.id=undefined.',
      );
    });
  });
});

describe('deleteServiceAccount', () => {
  describe('when id is used', () => {
    describe('when no error is returned', () => {
      let deleteServiceAccountSpy: jest.SpyInstance;
      let sdk: ConfigClientV2;

      beforeEach(async () => {
        sdk = await ConfigClientV2.createInstance(JSON.stringify(serviceAccountTokenMock));
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
                  bookmark: 'bookmark-token',
                });
              }
              return {} as SurfaceCall;
            },
          );
        return sdk.deleteServiceAccount(
          ConfigClientV2.newDeleteServiceAccountRequest('service-account-id'),
        );
      });

      it('sends correct request', () => {
        expect(deleteServiceAccountSpy).toBeCalledWith(
          {
            id: 'service-account-id',
            bookmarks: [],
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
        const sdk = await ConfigClientV2.createInstance(JSON.stringify(serviceAccountTokenMock));
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
        sdk
          .deleteServiceAccount(ConfigClientV2.newDeleteServiceAccountRequest('service-account-id'))
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
        const sdk = await ConfigClientV2.createInstance(JSON.stringify(serviceAccountTokenMock));
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
        sdk
          .deleteServiceAccount(ConfigClientV2.newDeleteServiceAccountRequest('service-account-id'))
          .catch((err) => {
            thrownError = err;
          });
      });

      it('throws an error', () => {
        expect(thrownError.message).toBe('No ServiceAccount response.');
      });
    });
  });

  describe('when an instance is used', () => {
    describe('when no error is returned', () => {
      let deleteServiceAccountSpy: jest.SpyInstance;
      let sdk: ConfigClientV2;
      let serviceAccountInstance: ServiceAccount;

      beforeEach(async () => {
        serviceAccountInstance = new ServiceAccount(
          'service-account-id',
          'service-account-name',
          'etag-token',
        );
        sdk = await ConfigClientV2.createInstance(JSON.stringify(serviceAccountTokenMock));
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
                  bookmark: 'bookmark-token',
                });
              }
              return {} as SurfaceCall;
            },
          );
        return sdk.deleteServiceAccount(
          ConfigClientV2.newDeleteServiceAccountRequest(serviceAccountInstance),
        );
      });

      it('sends correct request', () => {
        expect(deleteServiceAccountSpy).toBeCalledWith(
          {
            id: 'service-account-id',
            bookmarks: [],
            etag: {
              value: 'etag-token',
            },
          },
          expect.any(Function),
        );
      });
    });
  });
});
