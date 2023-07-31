import { EventEmitter } from 'events';
import { CallOptions, Metadata } from '@grpc/grpc-js';
import { ClientReadableStream, ServiceError, SurfaceCall } from '@grpc/grpc-js/build/src/call';
import { Status } from '@grpc/grpc-js/build/src/constants';
import {
  CreateTenantResponse,
  DeleteTenantResponse,
  ListTenantsResponse,
  ReadTenantResponse,
  UpdateTenantResponse,
} from '../../../grpc/indykite/config/v1beta1/config_management_api';
import { ConfigClientV2 } from '../../config_v2';
import { SdkError, SdkErrorCode } from '../../error';
import { StringValue } from '../../../grpc/google/protobuf/wrappers';
import { Utils } from '../../utils/utils';
import { Tenant } from '../../model/config/tenant';
import { serviceAccountTokenMock } from '../../utils/test_utils';

afterEach(() => {
  jest.restoreAllMocks();
});

describe('createTenant', () => {
  describe('when no error is returned', () => {
    let tenant: Tenant;
    let createTenantSpy: jest.SpyInstance;
    let sdk: ConfigClientV2;

    beforeEach(async () => {
      sdk = await ConfigClientV2.createInstance(JSON.stringify(serviceAccountTokenMock));
      createTenantSpy = jest
        .spyOn(sdk['client'], 'createTenant')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response: CreateTenantResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(null, {
                id: 'new-tenant-id',
                etag: '111',
                createTime: Utils.dateToTimestamp(new Date(Date.UTC(2022, 2, 15, 13, 12))),
                updateTime: Utils.dateToTimestamp(new Date(Date.UTC(2022, 2, 15, 13, 13))),
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
        tenant = Tenant.deserialize(
          await sdk.createTenant(ConfigClientV2.newCreateTenantRequest('issuer-id', 'new-tenant')),
          'issuer-id',
          'new-tenant',
        );
      });

      it('sends correct request', () => {
        expect(createTenantSpy).toBeCalledWith(
          {
            issuerId: 'issuer-id',
            name: 'new-tenant',
            bookmarks: [],
          },
          expect.any(Function),
        );
      });

      it('returns a correct instance', () => {
        expect(tenant.id).toBe('new-tenant-id');
        expect(tenant.name).toBe('new-tenant');
        expect(tenant.issuerId).toBe('issuer-id');
        expect(tenant.etag).toBe('111');
        expect(tenant.displayName).toBeUndefined();
        expect(tenant.description).toBeUndefined();
        expect(tenant.createTime?.toString()).toBe(
          new Date(Date.UTC(2022, 2, 15, 13, 12)).toString(),
        );
        expect(tenant.updateTime?.toString()).toBe(
          new Date(Date.UTC(2022, 2, 15, 13, 13)).toString(),
        );
      });
    });

    describe('when all possible values are sent', () => {
      beforeEach(async () => {
        tenant = Tenant.deserialize(
          await sdk.createTenant(
            ConfigClientV2.newCreateTenantRequest(
              'issuer-id',
              'new-tenant',
              'New Tenant',
              'Tenant description',
            ),
          ),
          'issuer-id',
          'new-tenant',
          'New Tenant',
          'Tenant description',
        );
      });

      it('sends correct request', () => {
        expect(createTenantSpy).toBeCalledWith(
          {
            issuerId: 'issuer-id',
            name: 'new-tenant',
            displayName: StringValue.create({ value: 'New Tenant' }),
            description: StringValue.create({ value: 'Tenant description' }),
            bookmarks: [],
          },
          expect.any(Function),
        );
      });

      it('returns a correct instance', () => {
        expect(tenant.id).toBe('new-tenant-id');
        expect(tenant.name).toBe('new-tenant');
        expect(tenant.issuerId).toBe('issuer-id');
        expect(tenant.etag).toBe('111');
        expect(tenant.displayName).toBe('New Tenant');
        expect(tenant.description).toBe('Tenant description');
        expect(tenant.createTime?.toString()).toBe(
          new Date(Date.UTC(2022, 2, 15, 13, 12)).toString(),
        );
        expect(tenant.updateTime?.toString()).toBe(
          new Date(Date.UTC(2022, 2, 15, 13, 13)).toString(),
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
      const sdk = await ConfigClientV2.createInstance(JSON.stringify(serviceAccountTokenMock));
      jest
        .spyOn(sdk['client'], 'createTenant')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response?: CreateTenantResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(error);
            }
            return {} as SurfaceCall;
          },
        );
      sdk
        .createTenant(
          ConfigClientV2.newCreateTenantRequest(
            'issuer-id',
            'new-tenant',
            'New Tenant',
            'Tenant description',
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
        .spyOn(sdk['client'], 'createTenant')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response?: CreateTenantResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(null);
            }
            return {} as SurfaceCall;
          },
        );
      sdk
        .createTenant(
          ConfigClientV2.newCreateTenantRequest(
            'issuer-id',
            'new-tenant',
            'New Tenant',
            'Tenant description',
          ),
        )
        .catch((err) => {
          thrownError = err;
        });
    });

    it('throws an error', () => {
      expect(thrownError.message).toBe('No Tenant response.');
    });
  });
});

describe('readTenantById', () => {
  describe('when no error is returned', () => {
    let tenant: Tenant;
    let readTenantSpy: jest.SpyInstance;

    beforeEach(async () => {
      const sdk = await ConfigClientV2.createInstance(JSON.stringify(serviceAccountTokenMock));
      readTenantSpy = jest
        .spyOn(sdk['client'], 'readTenant')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response: ReadTenantResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(null, {
                tenant: {
                  id: 'tenant-id',
                  appSpaceId: 'app-space-id',
                  customerId: 'customer-id',
                  name: 'tenant-name',
                  description: StringValue.create({ value: 'Tenant description' }),
                  displayName: 'Tenant Name',
                  etag: '5432',
                  issuerId: 'issuer-id',
                  createdBy: 'Lorem ipsum - creator',
                  updatedBy: 'Lorem ipsum - updater',
                  createTime: Utils.dateToTimestamp(new Date(Date.UTC(2022, 2, 15, 13, 12))),
                  updateTime: Utils.dateToTimestamp(new Date(Date.UTC(2022, 2, 15, 13, 13))),
                  deleteTime: Utils.dateToTimestamp(new Date(Date.UTC(2022, 2, 15, 13, 14))),
                  destroyTime: Utils.dateToTimestamp(new Date(Date.UTC(2022, 2, 15, 13, 15))),
                  default: false,
                },
              });
            }
            return {} as SurfaceCall;
          },
        );
      tenant = Tenant.deserialize(
        await sdk.readTenant(ConfigClientV2.newReadTenantRequest('id', 'tenant-id-request')),
      );
    });

    it('sends correct request', () => {
      expect(readTenantSpy).toBeCalledWith(
        {
          identifier: {
            oneofKind: 'id',
            id: 'tenant-id-request',
          },
          bookmarks: [],
        },
        expect.any(Function),
      );
    });

    it('returns a correct instance', () => {
      expect(tenant.id).toBe('tenant-id');
      expect(tenant.appSpaceId).toBe('app-space-id');
      expect(tenant.customerId).toBe('customer-id');
      expect(tenant.name).toBe('tenant-name');
      expect(tenant.description).toBe('Tenant description');
      expect(tenant.displayName).toBe('Tenant Name');
      expect(tenant.etag).toBe('5432');
      expect(tenant.issuerId).toBe('issuer-id');
      expect(tenant.createTime?.toString()).toBe(
        new Date(Date.UTC(2022, 2, 15, 13, 12)).toString(),
      );
      expect(tenant.updateTime?.toString()).toBe(
        new Date(Date.UTC(2022, 2, 15, 13, 13)).toString(),
      );
      expect(tenant.deleteTime?.toString()).toBe(
        new Date(Date.UTC(2022, 2, 15, 13, 14)).toString(),
      );
      expect(tenant.destroyTime?.toString()).toBe(
        new Date(Date.UTC(2022, 2, 15, 13, 15)).toString(),
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
        .spyOn(sdk['client'], 'readTenant')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response?: ReadTenantResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(error);
            }
            return {} as SurfaceCall;
          },
        );
      sdk
        .readTenant(ConfigClientV2.newReadTenantRequest('id', 'tenant-id-request'))
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
        .spyOn(sdk['client'], 'readTenant')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response?: ReadTenantResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(null);
            }
            return {} as SurfaceCall;
          },
        );
      sdk
        .readTenant(ConfigClientV2.newReadTenantRequest('id', 'tenant-id-request'))
        .catch((err) => {
          thrownError = err;
        });
    });

    it('throws an error', () => {
      expect(thrownError.message).toBe('No Tenant response.');
    });
  });
});

describe('readTenantByName', () => {
  describe('when no error is returned', () => {
    let tenant: Tenant;
    let readTenantSpy: jest.SpyInstance;

    beforeEach(async () => {
      const sdk = await ConfigClientV2.createInstance(JSON.stringify(serviceAccountTokenMock));
      readTenantSpy = jest
        .spyOn(sdk['client'], 'readTenant')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response: ReadTenantResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(null, {
                tenant: {
                  id: 'tenant-id',
                  appSpaceId: 'app-space-id',
                  customerId: 'customer-id',
                  name: 'tenant-name',
                  displayName: 'Tenant Name',
                  etag: '5432',
                  issuerId: 'issuer-id',
                  createdBy: 'Lorem ipsum - creator',
                  updatedBy: 'Lorem ipsum - updater',
                  createTime: Utils.dateToTimestamp(new Date(Date.UTC(2022, 2, 15, 13, 12))),
                  updateTime: Utils.dateToTimestamp(new Date(Date.UTC(2022, 2, 15, 13, 13))),
                  deleteTime: Utils.dateToTimestamp(new Date(Date.UTC(2022, 2, 15, 13, 14))),
                  destroyTime: Utils.dateToTimestamp(new Date(Date.UTC(2022, 2, 15, 13, 15))),
                  default: false,
                },
              });
            }
            return {} as SurfaceCall;
          },
        );
      tenant = Tenant.deserialize(
        await sdk.readTenant(
          ConfigClientV2.newReadTenantRequest(
            'name',
            'app-space-id-request',
            'tenant-name-request',
          ),
        ),
      );
    });

    it('sends correct request', () => {
      expect(readTenantSpy).toBeCalledWith(
        {
          identifier: {
            oneofKind: 'name',
            name: {
              location: 'app-space-id-request',
              name: 'tenant-name-request',
            },
          },
          bookmarks: [],
        },
        expect.any(Function),
      );
    });

    it('returns a correct instance', () => {
      expect(tenant.id).toBe('tenant-id');
      expect(tenant.appSpaceId).toBe('app-space-id');
      expect(tenant.customerId).toBe('customer-id');
      expect(tenant.name).toBe('tenant-name');
      expect(tenant.description).toBeUndefined();
      expect(tenant.displayName).toBe('Tenant Name');
      expect(tenant.etag).toBe('5432');
      expect(tenant.issuerId).toBe('issuer-id');
      expect(tenant.createTime?.toString()).toBe(
        new Date(Date.UTC(2022, 2, 15, 13, 12)).toString(),
      );
      expect(tenant.updateTime?.toString()).toBe(
        new Date(Date.UTC(2022, 2, 15, 13, 13)).toString(),
      );
      expect(tenant.deleteTime?.toString()).toBe(
        new Date(Date.UTC(2022, 2, 15, 13, 14)).toString(),
      );
      expect(tenant.destroyTime?.toString()).toBe(
        new Date(Date.UTC(2022, 2, 15, 13, 15)).toString(),
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
        .spyOn(sdk['client'], 'readTenant')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response?: ReadTenantResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(error);
            }
            return {} as SurfaceCall;
          },
        );
      sdk
        .readTenant(
          ConfigClientV2.newReadTenantRequest(
            'name',
            'app-space-id-request',
            'tenant-name-request',
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
        .spyOn(sdk['client'], 'readTenant')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response?: ReadTenantResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(null);
            }
            return {} as SurfaceCall;
          },
        );
      sdk
        .readTenant(
          ConfigClientV2.newReadTenantRequest(
            'name',
            'app-space-id-request',
            'tenant-name-request',
          ),
        )
        .catch((err) => {
          thrownError = err;
        });
    });

    it('throws an error', () => {
      expect(thrownError.message).toBe('No Tenant response.');
    });
  });
});

describe('listTenants', () => {
  let tenants: Tenant[] = [];
  let listTenantsSpy: jest.SpyInstance;

  describe('when no error is returned', () => {
    beforeEach(async () => {
      const sdk = await ConfigClientV2.createInstance(JSON.stringify(serviceAccountTokenMock));
      const eventEmitter = Object.assign(new EventEmitter(), {
        read: () => {
          return {
            tenant: {
              id: 'tenant-id',
              appSpaceId: 'app-space-id',
              customerId: 'customer-id',
              name: 'tenant-name',
              description: StringValue.create({ value: 'Tenant description' }),
              displayName: 'Tenant Name',
              etag: '5432',
              issuerId: 'issuer-id',
              createTime: Utils.dateToTimestamp(new Date(Date.UTC(2022, 2, 15, 13, 12))),
              updateTime: Utils.dateToTimestamp(new Date(Date.UTC(2022, 2, 15, 13, 13))),
              deleteTime: Utils.dateToTimestamp(new Date(Date.UTC(2022, 2, 15, 13, 14))),
              destroyTime: Utils.dateToTimestamp(new Date(Date.UTC(2022, 2, 15, 13, 15))),
            },
          };
        },
      });

      listTenantsSpy = jest.spyOn(sdk['client'], 'listTenants').mockImplementation(() => {
        setTimeout(() => eventEmitter.emit('readable'), 0);
        setTimeout(() => eventEmitter.emit('data'), 0);
        setTimeout(() => eventEmitter.emit('readable'), 0);
        setTimeout(() => eventEmitter.emit('end'), 1);
        setTimeout(() => eventEmitter.emit('close'), 1);
        return eventEmitter as unknown as ClientReadableStream<ListTenantsResponse>;
      });

      tenants = await new Promise((resolve, reject) => {
        const tmp: Tenant[] = [];
        sdk
          .listTenants(
            ConfigClientV2.newListTenantsRequest('app-space-id-request', ['tenant-name']),
          )
          .on('error', (err) => {
            // Nothing to do here.
            reject(err);
          })
          .on('data', (data) => {
            if (data && data.tenant) {
              tmp.push(Tenant.deserialize(data));
            }
          })
          .on('close', () => {
            // Nothing to do here.
          })
          .on('end', () => {
            resolve(tmp);
          });
      });
    });
    it('check expect call', async () => {
      expect(listTenantsSpy).toBeCalledWith({
        appSpaceId: 'app-space-id-request',
        match: ['tenant-name'],
        bookmarks: [],
      });
    });

    it('returns correct data', async () => {
      expect(tenants.length).toBe(2);
      expect(tenants[0].id).toBe('tenant-id');
      expect(tenants[0].appSpaceId).toBe('app-space-id');
      expect(tenants[0].customerId).toBe('customer-id');
      expect(tenants[0].name).toBe('tenant-name');
      expect(tenants[0].description).toBe('Tenant description');
      expect(tenants[0].displayName).toBe('Tenant Name');
      expect(tenants[0].etag).toBe('5432');
      expect(tenants[0].issuerId).toBe('issuer-id');
      expect(tenants[0].createTime?.toString()).toBe(
        new Date(Date.UTC(2022, 2, 15, 13, 12)).toString(),
      );
      expect(tenants[0].updateTime?.toString()).toBe(
        new Date(Date.UTC(2022, 2, 15, 13, 13)).toString(),
      );
      expect(tenants[0].deleteTime?.toString()).toBe(
        new Date(Date.UTC(2022, 2, 15, 13, 14)).toString(),
      );
      expect(tenants[0].destroyTime?.toString()).toBe(
        new Date(Date.UTC(2022, 2, 15, 13, 15)).toString(),
      );
    });
  });

  describe('when an error is returned', () => {
    let result: ServiceError | string;
    const error = {
      code: Status.NOT_FOUND,
      details: 'DETAILS',
      metadata: {},
    } as ServiceError;
    let sdk: ConfigClientV2;

    beforeEach(async () => {
      sdk = await ConfigClientV2.createInstance(JSON.stringify(serviceAccountTokenMock));
      const eventEmitter = Object.assign(new EventEmitter(), { read: jest.fn() });
      jest.spyOn(sdk['client'], 'listTenants').mockImplementation(() => {
        setTimeout(() => eventEmitter.emit('error', error), 0);
        setTimeout(() => eventEmitter.emit('end'), 1);
        setTimeout(() => eventEmitter.emit('close'), 1);
        return eventEmitter as unknown as ClientReadableStream<ListTenantsResponse>;
      });
      result = await new Promise((resolve, reject) => {
        sdk
          .listTenants(
            ConfigClientV2.newListTenantsRequest('app-space-id-request', ['tenant-name']),
          )
          .on('error', (err) => {
            reject(err);
          })
          .on('data', () => {
            // Nothing to do here.
          })
          .on('end', () => {
            resolve('');
          });
      })
        .then((x) => x as string)
        .catch((errs) => {
          return errs as ServiceError;
        });
    });

    it('throws an error', () => {
      expect(result).toBe(error);
    });
  });

  describe('when a close event is triggered', () => {
    let sdk: ConfigClientV2;

    beforeEach(async () => {
      sdk = await ConfigClientV2.createInstance(JSON.stringify(serviceAccountTokenMock));
      const eventEmitter = Object.assign(new EventEmitter(), { read: jest.fn() });
      jest.spyOn(sdk['client'], 'listTenants').mockImplementation(() => {
        setTimeout(() => eventEmitter.emit('close'), 0);
        return eventEmitter as unknown as ClientReadableStream<ListTenantsResponse>;
      });
    });

    it('close has been triggered', () => {
      sdk
        .listTenants(ConfigClientV2.newListTenantsRequest('app-space-id-request', ['tenant-name']))
        .on('close', () => {
          expect(true).toBe(true);
        })
        .on('data', () => {
          // Nothing to do here.
        })
        .on('end', () => {
          // Nothing to do here.
        });
    });
  });
});

describe('updateTenant', () => {
  describe('when no error is returned', () => {
    let updatedTenant: UpdateTenantResponse;
    let updateTenantSpy: jest.SpyInstance;
    let sdk: ConfigClientV2;

    beforeEach(async () => {
      sdk = await ConfigClientV2.createInstance(JSON.stringify(serviceAccountTokenMock));
      updateTenantSpy = jest
        .spyOn(sdk['client'], 'updateTenant')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response: UpdateTenantResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(null, {
                etag: '777',
                id: 'tenant-id',
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
        const tenant = new Tenant('tenant-id', 'tenant', 'customer-id', 'app-space-id');
        updatedTenant = await sdk.updateTenant(ConfigClientV2.newUpdateTenantRequest(tenant));
      });

      it('sends correct request', () => {
        expect(updateTenantSpy).toBeCalledWith(
          {
            id: 'tenant-id',
            bookmarks: [],
          },
          expect.any(Function),
        );
      });

      it('returns a correct instance', () => {
        expect(updatedTenant.id).toBe('tenant-id');
        expect(updatedTenant.createTime).toBeUndefined();
        expect(updatedTenant.createdBy).toBe('Lorem ipsum - creator');
        expect(updatedTenant.updateTime?.toString()).toBe(
          Utils.dateToTimestamp(new Date(Date.UTC(2022, 2, 15, 13, 16))).toString(),
        );
        expect(updatedTenant.updatedBy).toBe('Lorem ipsum - updater');
        expect(updatedTenant.etag).toBe('777');
        expect(updatedTenant.bookmark).toBe('bookmark-token');
      });
    });

    describe('when all possible values are sent', () => {
      beforeEach(async () => {
        const tenant = new Tenant(
          'tenant-id',
          'tenant',
          'customer-id',
          'app-space-id',
          'Tenant Name',
          '11',
          '555',
          'Description',
        );
        updatedTenant = await sdk.updateTenant(ConfigClientV2.newUpdateTenantRequest(tenant));
      });

      it('sends correct request', () => {
        expect(updateTenantSpy).toBeCalledWith(
          {
            id: 'tenant-id',
            etag: { value: '555' },
            displayName: { value: 'Tenant Name' },
            description: { value: 'Description' },
            bookmarks: [],
          },
          expect.any(Function),
        );
      });

      it('returns a correct instance', () => {
        expect(updatedTenant.id).toBe('tenant-id');
        expect(updatedTenant.createTime).toBeUndefined();
        expect(updatedTenant.createdBy).toBe('Lorem ipsum - creator');
        expect(updatedTenant.updateTime?.toString()).toBe(
          Utils.dateToTimestamp(new Date(Date.UTC(2022, 2, 15, 13, 16))).toString(),
        );
        expect(updatedTenant.updatedBy).toBe('Lorem ipsum - updater');
        expect(updatedTenant.etag).toBe('777');
        expect(updatedTenant.bookmark).toBe('bookmark-token');
      });
    });
  });

  describe('when a different tenant is returned', () => {
    let thrownError: SdkError;

    beforeEach(async () => {
      const sdk = await ConfigClientV2.createInstance(JSON.stringify(serviceAccountTokenMock));
      jest
        .spyOn(sdk['client'], 'updateTenant')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response: UpdateTenantResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(null, {
                etag: '777',
                id: 'different-tenant-id',
                updateTime: Utils.dateToTimestamp(new Date(Date.UTC(2022, 2, 15, 13, 16))),
                bookmark: 'bookmark-token',
                createdBy: 'Lorem ipsum - creator',
                updatedBy: 'Lorem ipsum - updater',
              });
            }
            return {} as SurfaceCall;
          },
        );
      const tenant = new Tenant(
        'tenant-id',
        'tenant',
        'customer-id',
        'app-space-id',
        'Tenant Name',
        '11',
        '555',
        'Description',
      );
      return sdk
        .updateTenant(ConfigClientV2.newUpdateTenantRequest(tenant))
        .catch((err) => (thrownError = err));
    });

    it('throws an error', () => {
      expect(thrownError.code).toEqual(SdkErrorCode.SDK_CODE_4);
      expect(thrownError.description).toBe(
        'Update returned with different id: request.id=tenant-id, response.id=different-tenant-id.',
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
        .spyOn(sdk['client'], 'updateTenant')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response?: UpdateTenantResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(error);
            }
            return {} as SurfaceCall;
          },
        );
      const tenant = new Tenant(
        'tenant-id',
        'tenant',
        'customer-id',
        'app-space-id',
        'Tenant Name',
        '11',
        '555',
        'Description',
      );
      sdk.updateTenant(ConfigClientV2.newUpdateTenantRequest(tenant)).catch((err) => {
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
        .spyOn(sdk['client'], 'updateTenant')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response?: UpdateTenantResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(null);
            }
            return {} as SurfaceCall;
          },
        );
      const tenant = new Tenant(
        'tenant-id',
        'tenant',
        'customer-id',
        'app-space-id',
        'Tenant Name',
        '11',
        '555',
        'Description',
      );
      sdk.updateTenant(ConfigClientV2.newUpdateTenantRequest(tenant)).catch((err) => {
        thrownError = err;
      });
    });

    it('throws an error', () => {
      expect(thrownError.message).toBe(
        'Update returned with different id: request.id=tenant-id, response.id=undefined.',
      );
    });
  });
});

describe('deleteTenant', () => {
  describe('when no error is returned', () => {
    let returnedValue: DeleteTenantResponse;
    let deleteTenantSpy: jest.SpyInstance;

    beforeEach(async () => {
      const sdk = await ConfigClientV2.createInstance(JSON.stringify(serviceAccountTokenMock));
      deleteTenantSpy = jest
        .spyOn(sdk['client'], 'deleteTenant')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response?: DeleteTenantResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(null, { bookmark: 'bookmark-token' });
            }
            return {} as SurfaceCall;
          },
        );
      const tenant = new Tenant(
        'tenant-id',
        'tenant-name',
        'customer-id',
        'app-space-id',
        'Tenant',
        'issuer-id',
        'etag-token',
      );
      returnedValue = await sdk.deleteTenant(ConfigClientV2.newDeleteTenantRequest(tenant));
    });

    it('sends correct request', () => {
      expect(deleteTenantSpy).toBeCalledWith(
        {
          id: 'tenant-id',
          etag: { value: 'etag-token' },
          bookmarks: [],
        },
        expect.any(Function),
      );
    });

    it('returns true', () => {
      expect(returnedValue).not.toBeUndefined();
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
        .spyOn(sdk['client'], 'deleteTenant')
        .mockImplementation(
          (req, res: Metadata | CallOptions | ((err: ServiceError | null) => void)) => {
            if (typeof res === 'function') {
              res(error);
            }
            return {} as SurfaceCall;
          },
        );
      const tenant = new Tenant(
        'tenant-id',
        'tenant-name',
        'customer-id',
        'app-space-id',
        'Tenant',
        'issuer-id',
        'etag-token',
      );
      sdk.deleteTenant(ConfigClientV2.newDeleteTenantRequest(tenant)).catch((err) => {
        thrownError = err;
      });
    });

    it('throws an error', () => {
      expect(thrownError).toBe(error);
    });
  });

  describe('when response is not set an error is returned', () => {
    let thrownError: SdkError;

    beforeEach(async () => {
      const sdk = await ConfigClientV2.createInstance(JSON.stringify(serviceAccountTokenMock));
      jest
        .spyOn(sdk['client'], 'deleteTenant')
        .mockImplementation(
          (req, res: Metadata | CallOptions | ((err: ServiceError | null) => void)) => {
            if (typeof res === 'function') {
              res(null);
            }
            return {} as SurfaceCall;
          },
        );
      const tenant = new Tenant(
        'tenant-id',
        'tenant-name',
        'customer-id',
        'app-space-id',
        'Tenant',
        'issuer-id',
        'etag-token',
      );
      sdk.deleteTenant(ConfigClientV2.newDeleteTenantRequest(tenant)).catch((err) => {
        thrownError = err;
      });
    });

    it('throws an error', () => {
      expect(thrownError.code).toEqual(SdkErrorCode.SDK_CODE_3);
      expect(thrownError.description).toBe('No Tenant response.');
    });
  });
});
