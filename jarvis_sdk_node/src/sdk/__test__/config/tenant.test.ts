import { EventEmitter } from 'events';
import { CallOptions, Metadata } from '@grpc/grpc-js';
import { ClientReadableStream, ServiceError, SurfaceCall } from '@grpc/grpc-js/build/src/call';
import { Status } from '@grpc/grpc-js/build/src/constants';
import {
  CreateTenantResponse,
  ListTenantsResponse,
  ReadTenantResponse,
  UpdateTenantResponse,
} from '../../../grpc/indykite/config/v1beta1/config_management_api';
import { ConfigClient } from '../../config';
import { SdkError, SdkErrorCode } from '../../error';
import { StringValue } from '../../../grpc/google/protobuf/wrappers';
import { Utils } from '../../utils/utils';
import { Tenant } from '../../model/config/tenant';

const userToken = 'user-token';

afterEach(() => {
  jest.restoreAllMocks();
});

describe('createTenant', () => {
  describe('when no error is returned', () => {
    let tenant: Tenant;
    let createTenantSpy: jest.SpyInstance;
    let sdk: ConfigClient;

    beforeEach(async () => {
      sdk = await ConfigClient.createInstance(userToken);
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
                createTime: Utils.dateToTimestamp(new Date(2022, 2, 15, 13, 12)),
                updateTime: Utils.dateToTimestamp(new Date(2022, 2, 15, 13, 13)),
              });
            }
            return {} as SurfaceCall;
          },
        );
    });

    describe('when necessary values are sent only', () => {
      beforeEach(async () => {
        tenant = await sdk.createTenant('issuer-id', 'new-tenant');
      });

      it('sends correct request', () => {
        expect(createTenantSpy).toBeCalledWith(
          {
            issuerId: 'issuer-id',
            name: 'new-tenant',
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
        expect(tenant.createTime?.toString()).toBe(new Date(2022, 2, 15, 13, 12).toString());
        expect(tenant.updateTime?.toString()).toBe(new Date(2022, 2, 15, 13, 13).toString());
      });
    });

    describe('when all possible values are sent', () => {
      beforeEach(async () => {
        tenant = await sdk.createTenant(
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
        expect(tenant.createTime?.toString()).toBe(new Date(2022, 2, 15, 13, 12).toString());
        expect(tenant.updateTime?.toString()).toBe(new Date(2022, 2, 15, 13, 13).toString());
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
      const sdk = await ConfigClient.createInstance(userToken);
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
        .createTenant('issuer-id', 'new-tenant', 'New Tenant', 'Tenant description')
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
      const sdk = await ConfigClient.createInstance(userToken);
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
        .createTenant('issuer-id', 'new-tenant', 'New Tenant', 'Tenant description')
        .catch((err) => {
          thrownError = err;
        });
    });

    it('throws an error', () => {
      expect(thrownError.message).toBe('No tenant response');
    });
  });
});

describe('readTenantById', () => {
  describe('when no error is returned', () => {
    let tenant: Tenant;
    let readTenantSpy: jest.SpyInstance;

    beforeEach(async () => {
      const sdk = await ConfigClient.createInstance(userToken);
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
                  createTime: Utils.dateToTimestamp(new Date(2022, 2, 15, 13, 12)),
                  updateTime: Utils.dateToTimestamp(new Date(2022, 2, 15, 13, 13)),
                  deleteTime: Utils.dateToTimestamp(new Date(2022, 2, 15, 13, 14)),
                  destroyTime: Utils.dateToTimestamp(new Date(2022, 2, 15, 13, 15)),
                },
              });
            }
            return {} as SurfaceCall;
          },
        );
      tenant = await sdk.readTenantById('tenant-id-request');
    });

    it('sends correct request', () => {
      expect(readTenantSpy).toBeCalledWith(
        {
          identifier: {
            oneofKind: 'id',
            id: 'tenant-id-request',
          },
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
      expect(tenant.createTime?.toString()).toBe(new Date(2022, 2, 15, 13, 12).toString());
      expect(tenant.updateTime?.toString()).toBe(new Date(2022, 2, 15, 13, 13).toString());
      expect(tenant.deleteTime?.toString()).toBe(new Date(2022, 2, 15, 13, 14).toString());
      expect(tenant.destroyTime?.toString()).toBe(new Date(2022, 2, 15, 13, 15).toString());
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
      const sdk = await ConfigClient.createInstance(userToken);
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
      sdk.readTenantById('tenant-id-request').catch((err) => {
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
      const sdk = await ConfigClient.createInstance(userToken);
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
      sdk.readTenantById('tenant-id-request').catch((err) => {
        thrownError = err;
      });
    });

    it('throws an error', () => {
      expect(thrownError.message).toBe('No tenant response');
    });
  });
});

describe('readTenantByName', () => {
  describe('when no error is returned', () => {
    let tenant: Tenant;
    let readTenantSpy: jest.SpyInstance;

    beforeEach(async () => {
      const sdk = await ConfigClient.createInstance(userToken);
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
                  createTime: Utils.dateToTimestamp(new Date(2022, 2, 15, 13, 12)),
                  updateTime: Utils.dateToTimestamp(new Date(2022, 2, 15, 13, 13)),
                  deleteTime: Utils.dateToTimestamp(new Date(2022, 2, 15, 13, 14)),
                  destroyTime: Utils.dateToTimestamp(new Date(2022, 2, 15, 13, 15)),
                },
              });
            }
            return {} as SurfaceCall;
          },
        );
      tenant = await sdk.readTenantByName('app-space-id-request', 'tenant-name-request');
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
      expect(tenant.createTime?.toString()).toBe(new Date(2022, 2, 15, 13, 12).toString());
      expect(tenant.updateTime?.toString()).toBe(new Date(2022, 2, 15, 13, 13).toString());
      expect(tenant.deleteTime?.toString()).toBe(new Date(2022, 2, 15, 13, 14).toString());
      expect(tenant.destroyTime?.toString()).toBe(new Date(2022, 2, 15, 13, 15).toString());
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
      const sdk = await ConfigClient.createInstance(userToken);
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
      sdk.readTenantByName('app-space-id-request', 'tenant-name-request').catch((err) => {
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
      const sdk = await ConfigClient.createInstance(userToken);
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
      sdk.readTenantByName('app-space-id-request', 'tenant-name-request').catch((err) => {
        thrownError = err;
      });
    });

    it('throws an error', () => {
      expect(thrownError.message).toBe('No tenant response');
    });
  });
});

describe('readTenantList', () => {
  describe('when no error is returned', () => {
    let tenants: Tenant[];
    let listTenantsSpy: jest.SpyInstance;

    beforeEach(async () => {
      const sdk = await ConfigClient.createInstance(userToken);
      const eventEmitter = Object.assign(new EventEmitter(), {});
      listTenantsSpy = jest.spyOn(sdk['client'], 'listTenants').mockImplementation(() => {
        setTimeout(
          () =>
            eventEmitter.emit('data', {
              tenant: {
                id: 'tenant-id',
                appSpaceId: 'app-space-id',
                customerId: 'customer-id',
                name: 'tenant-name',
                description: StringValue.create({ value: 'Tenant description' }),
                displayName: 'Tenant Name',
                etag: '5432',
                issuerId: 'issuer-id',
                createTime: Utils.dateToTimestamp(new Date(2022, 2, 15, 13, 12)),
                updateTime: Utils.dateToTimestamp(new Date(2022, 2, 15, 13, 13)),
                deleteTime: Utils.dateToTimestamp(new Date(2022, 2, 15, 13, 14)),
                destroyTime: Utils.dateToTimestamp(new Date(2022, 2, 15, 13, 15)),
              },
            }),
          0,
        );
        setTimeout(() => eventEmitter.emit('end'), 0);
        return eventEmitter as unknown as ClientReadableStream<ListTenantsResponse>;
      });

      tenants = await sdk.readTenantList('app-space-id-request', ['tenant-name']);
    });

    it('sends correct request', () => {
      expect(listTenantsSpy).toBeCalledWith({
        appSpaceId: 'app-space-id-request',
        match: ['tenant-name'],
      });
    });

    it('returns a correct instance', () => {
      expect(tenants.length).toBe(1);
      expect(tenants[0].id).toBe('tenant-id');
      expect(tenants[0].appSpaceId).toBe('app-space-id');
      expect(tenants[0].customerId).toBe('customer-id');
      expect(tenants[0].name).toBe('tenant-name');
      expect(tenants[0].description).toBe('Tenant description');
      expect(tenants[0].displayName).toBe('Tenant Name');
      expect(tenants[0].etag).toBe('5432');
      expect(tenants[0].issuerId).toBe('issuer-id');
      expect(tenants[0].createTime?.toString()).toBe(new Date(2022, 2, 15, 13, 12).toString());
      expect(tenants[0].updateTime?.toString()).toBe(new Date(2022, 2, 15, 13, 13).toString());
      expect(tenants[0].deleteTime?.toString()).toBe(new Date(2022, 2, 15, 13, 14).toString());
      expect(tenants[0].destroyTime?.toString()).toBe(new Date(2022, 2, 15, 13, 15).toString());
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
      const sdk = await ConfigClient.createInstance(userToken);
      const eventEmitter = Object.assign(new EventEmitter(), { read: jest.fn() });
      jest.spyOn(sdk['client'], 'listTenants').mockImplementation(() => {
        setTimeout(() => eventEmitter.emit('error', error), 0);
        return eventEmitter as unknown as ClientReadableStream<ListTenantsResponse>;
      });

      return sdk
        .readTenantList('app-space-id-request', ['tenant-name'])
        .catch((err) => (thrownError = err));
    });

    it('throws an error', () => {
      expect(thrownError).toBe(error);
    });
  });
});

describe('updateTenant', () => {
  describe('when no error is returned', () => {
    let updatedTenant: Tenant;
    let updateTenantSpy: jest.SpyInstance;
    let sdk: ConfigClient;

    beforeEach(async () => {
      sdk = await ConfigClient.createInstance(userToken);
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
                updateTime: Utils.dateToTimestamp(new Date(2022, 2, 15, 13, 16)),
              });
            }
            return {} as SurfaceCall;
          },
        );
    });

    describe('when necessary values are sent only', () => {
      beforeEach(async () => {
        const tenant = new Tenant('tenant-id', 'tenant', 'customer-id', 'app-space-id');
        updatedTenant = await sdk.updateTenant(tenant);
      });

      it('sends correct request', () => {
        expect(updateTenantSpy).toBeCalledWith(
          {
            id: 'tenant-id',
          },
          expect.any(Function),
        );
      });

      it('returns a correct instance', () => {
        expect(updatedTenant.id).toBe('tenant-id');
        expect(updatedTenant.appSpaceId).toBe('app-space-id');
        expect(updatedTenant.customerId).toBe('customer-id');
        expect(updatedTenant.name).toBe('tenant');
        expect(updatedTenant.description).toBeUndefined();
        expect(updatedTenant.displayName).toBeUndefined();
        expect(updatedTenant.etag).toBe('777');
        expect(updatedTenant.issuerId).toBeUndefined();
        expect(updatedTenant.createTime).toBeUndefined();
        expect(updatedTenant.updateTime?.toString()).toBe(new Date(2022, 2, 15, 13, 16).toString());
        expect(updatedTenant.deleteTime).toBeUndefined();
        expect(updatedTenant.destroyTime).toBeUndefined();
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
        updatedTenant = await sdk.updateTenant(tenant);
      });

      it('sends correct request', () => {
        expect(updateTenantSpy).toBeCalledWith(
          {
            id: 'tenant-id',
            etag: { value: '555' },
            displayName: { value: 'Tenant Name' },
            description: { value: 'Description' },
          },
          expect.any(Function),
        );
      });

      it('returns a correct instance', () => {
        expect(updatedTenant.id).toBe('tenant-id');
        expect(updatedTenant.appSpaceId).toBe('app-space-id');
        expect(updatedTenant.customerId).toBe('customer-id');
        expect(updatedTenant.name).toBe('tenant');
        expect(updatedTenant.description).toBe('Description');
        expect(updatedTenant.displayName).toBe('Tenant Name');
        expect(updatedTenant.etag).toBe('777');
        expect(updatedTenant.issuerId).toBe('11');
        expect(updatedTenant.createTime).toBeUndefined();
        expect(updatedTenant.updateTime?.toString()).toBe(new Date(2022, 2, 15, 13, 16).toString());
        expect(updatedTenant.deleteTime).toBeUndefined();
        expect(updatedTenant.destroyTime).toBeUndefined();
      });
    });
  });

  describe('when a different tenant is returned', () => {
    let thrownError: SdkError;

    beforeEach(async () => {
      const sdk = await ConfigClient.createInstance(userToken);
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
                updateTime: Utils.dateToTimestamp(new Date(2022, 2, 15, 13, 16)),
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
      return sdk.updateTenant(tenant).catch((err) => (thrownError = err));
    });

    it('throws an error', () => {
      expect(thrownError.code).toEqual(SdkErrorCode.SDK_CODE_1);
      expect(thrownError.description).toBe(
        'Update returned with different id: req.iq=tenant-id, res.id=different-tenant-id',
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
      const sdk = await ConfigClient.createInstance(userToken);
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
      sdk.updateTenant(tenant).catch((err) => {
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
      const sdk = await ConfigClient.createInstance(userToken);
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
      sdk.updateTenant(tenant).catch((err) => {
        thrownError = err;
      });
    });

    it('throws an error', () => {
      expect(thrownError.message).toBe(
        'Update returned with different id: req.iq=tenant-id, res.id=undefined',
      );
    });
  });
});
