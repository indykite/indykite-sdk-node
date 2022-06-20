import { EventEmitter } from 'events';
import { CallOptions, Metadata } from '@grpc/grpc-js';
import { ClientReadableStream, ServiceError, SurfaceCall } from '@grpc/grpc-js/build/src/call';
import { Status } from '@grpc/grpc-js/build/src/constants';
import { ConfigManagementAPIClient } from '../../grpc/indykite/config/v1beta1/config_management_api.grpc-client';
import {
  CreateApplicationResponse,
  CreateApplicationSpaceResponse,
  CreateTenantResponse,
  DeleteApplicationAgentCredentialResponse,
  DeleteApplicationAgentResponse,
  ListApplicationAgentsResponse,
  ListApplicationSpacesResponse,
  ListApplicationsResponse,
  ListTenantsResponse,
  ReadApplicationAgentCredentialResponse,
  ReadApplicationAgentResponse,
  ReadApplicationResponse,
  ReadApplicationSpaceResponse,
  ReadCustomerResponse,
  ReadTenantResponse,
  RegisterApplicationAgentCredentialResponse,
  UpdateApplicationAgentResponse,
  UpdateApplicationResponse,
  UpdateApplicationSpaceResponse,
  UpdateTenantResponse,
} from '../../grpc/indykite/config/v1beta1/config_management_api';
import { SdkClient } from '../client/client';
import { ConfigClient } from '../config';
import { ApplicationSpace } from '../model/application_space';
import { Customer } from '../model/customer';
import { SdkError, SdkErrorCode } from '../error';
import { StringValue } from '../../grpc/google/protobuf/wrappers';
import { Utils } from '../utils/utils';
import { Tenant } from '../model/tenant';
import { Application } from '../model/application';
import { ApplicationAgent } from '../model/application_agent';
import { ApplicationAgentCredential } from '../model/application_agent_credential';

const userToken = 'user-token';

afterEach(() => {
  jest.restoreAllMocks();
});

describe('New client', () => {
  beforeEach(() => {
    jest
      .spyOn(SdkClient, 'createIdentityInstance')
      .mockImplementation(() => Promise.resolve({ client: {} } as SdkClient));
  });

  describe('when custom endpoint is not specified', () => {
    beforeEach(() => {
      return ConfigClient.createInstance(userToken);
    });

    it('New instance creation', () => {
      expect(SdkClient.createIdentityInstance).toBeCalledWith(
        ConfigManagementAPIClient,
        userToken,
        'jarvis.indykite.com',
      );
    });
  });

  describe('when custom endpoint is specified', () => {
    beforeEach(async () => {
      process.env.JARVIS_ENDPOINT = 'example.com';
      // we need to reload all tested modules so that the new environment variable is used
      jest.resetModules();
      const { ConfigClient } = await import('../config');
      const { SdkClient } = await import('../client/client');
      jest
        .spyOn(SdkClient, 'createIdentityInstance')
        .mockImplementation(() => Promise.resolve({} as SdkClient));

      return ConfigClient.createInstance(userToken);
    });

    afterEach(() => {
      process.env.JARVIS_ENDPOINT = '';
    });

    it('New instance creation', async () => {
      const { SdkClient } = await import('../client/client');
      const { ConfigManagementAPIClient } = await import(
        '../../grpc/indykite/config/v1beta1/config_management_api.grpc-client'
      );
      expect(SdkClient.createIdentityInstance).toBeCalledWith(
        ConfigManagementAPIClient,
        userToken,
        'example.com',
      );
    });
  });
});

describe('readCustomerById', () => {
  describe('when no error is returned', () => {
    let customer: Customer;
    let readCustomerSpy: jest.SpyInstance;

    beforeEach(async () => {
      const sdk = await ConfigClient.createInstance(userToken);
      readCustomerSpy = jest
        .spyOn(sdk['client'], 'readCustomer')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response: ReadCustomerResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(null, {
                customer: {
                  id: 'customer-id',
                  name: 'customer-name',
                  displayName: 'Customer Name',
                  etag: '123456',
                },
              });
            }
            return {} as SurfaceCall;
          },
        );
      customer = await sdk.readCustomerById('customer-id-request');
    });

    it('sends correct request', () => {
      expect(readCustomerSpy).toBeCalledWith(
        {
          identifier: {
            oneofKind: 'id',
            id: 'customer-id-request',
          },
        },
        expect.any(Function),
      );
    });

    it('returns a correct instance', () => {
      expect(customer.id).toBe('customer-id');
      expect(customer.name).toBe('customer-name');
      expect(customer.displayName).toBe('Customer Name');
      expect(customer.etag).toBe('123456');
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
        .spyOn(sdk['client'], 'readCustomer')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response: ReadCustomerResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(error, {});
            }
            return {} as SurfaceCall;
          },
        );
      sdk.readCustomerById('customer-id-request').catch((err) => {
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
        .spyOn(sdk['client'], 'readCustomer')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response?: ReadCustomerResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(null, undefined);
            }
            return {} as SurfaceCall;
          },
        );
      sdk.readCustomerById('customer-id-request').catch((err) => {
        thrownError = err;
      });
    });

    it('throws an error', () => {
      expect(thrownError.message).toBe('No customer response');
    });
  });
});

describe('readCustomerByName', () => {
  describe('when no error is returned', () => {
    let customer: Customer;
    let readCustomerSpy: jest.SpyInstance;

    beforeEach(async () => {
      const sdk = await ConfigClient.createInstance(userToken);
      readCustomerSpy = jest
        .spyOn(sdk['client'], 'readCustomer')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response: ReadCustomerResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(null, {
                customer: {
                  id: 'customer-id',
                  name: 'customer-name',
                  displayName: 'Customer Name',
                  etag: '123456',
                },
              });
            }
            return {} as SurfaceCall;
          },
        );
      customer = await sdk.readCustomerByName('customer-name-request');
    });

    it('sends correct request', () => {
      expect(readCustomerSpy).toBeCalledWith(
        {
          identifier: {
            oneofKind: 'name',
            name: 'customer-name-request',
          },
        },
        expect.any(Function),
      );
    });

    it('returns a correct instance', () => {
      expect(customer.id).toBe('customer-id');
      expect(customer.name).toBe('customer-name');
      expect(customer.displayName).toBe('Customer Name');
      expect(customer.etag).toBe('123456');
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
        .spyOn(sdk['client'], 'readCustomer')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response: ReadCustomerResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(error, {});
            }
            return {} as SurfaceCall;
          },
        );
      sdk.readCustomerByName('customer-name-request').catch((err) => {
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
        .spyOn(sdk['client'], 'readCustomer')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response?: ReadCustomerResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(null, undefined);
            }
            return {} as SurfaceCall;
          },
        );
      sdk.readCustomerByName('customer-name-request').catch((err) => {
        thrownError = err;
      });
    });

    it('throws an error', () => {
      expect(thrownError.message).toBe('No customer response');
    });
  });
});

describe('createApplicationSpace', () => {
  describe('when no error is returned', () => {
    let appSpace: ApplicationSpace;
    let createApplicationSpaceSpy: jest.SpyInstance;
    let sdk: ConfigClient;

    beforeEach(async () => {
      sdk = await ConfigClient.createInstance(userToken);
      createApplicationSpaceSpy = jest
        .spyOn(sdk['client'], 'createApplicationSpace')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response: CreateApplicationSpaceResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(null, {
                id: 'new-app-space-id',
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
        appSpace = await sdk.createApplicationSpace('customer-id', 'new-app-space');
      });

      it('sends correct request', () => {
        expect(createApplicationSpaceSpy).toBeCalledWith(
          {
            customerId: 'customer-id',
            name: 'new-app-space',
          },
          expect.any(Function),
        );
      });

      it('returns a correct instance', () => {
        expect(appSpace.id).toBe('new-app-space-id');
        expect(appSpace.name).toBe('new-app-space');
        expect(appSpace.displayName).toBeUndefined();
        expect(appSpace.description).toBeUndefined();
        expect(appSpace.etag).toBe('111');
        expect(appSpace.createTime?.toString()).toBe(new Date(2022, 2, 15, 13, 12).toString());
        expect(appSpace.updateTime?.toString()).toBe(new Date(2022, 2, 15, 13, 13).toString());
      });
    });

    describe('when all possible values are sent', () => {
      beforeEach(async () => {
        appSpace = await sdk.createApplicationSpace(
          'customer-id',
          'new-app-space',
          'New App Space',
          'App space description',
        );
      });

      it('sends correct request', () => {
        expect(createApplicationSpaceSpy).toBeCalledWith(
          {
            customerId: 'customer-id',
            name: 'new-app-space',
            displayName: StringValue.create({ value: 'New App Space' }),
            description: StringValue.create({ value: 'App space description' }),
          },
          expect.any(Function),
        );
      });

      it('returns a correct instance', () => {
        expect(appSpace.id).toBe('new-app-space-id');
        expect(appSpace.name).toBe('new-app-space');
        expect(appSpace.displayName).toBe('New App Space');
        expect(appSpace.description).toBe('App space description');
        expect(appSpace.etag).toBe('111');
        expect(appSpace.createTime?.toString()).toBe(new Date(2022, 2, 15, 13, 12).toString());
        expect(appSpace.updateTime?.toString()).toBe(new Date(2022, 2, 15, 13, 13).toString());
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
        .spyOn(sdk['client'], 'createApplicationSpace')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response?: CreateApplicationSpaceResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(error);
            }
            return {} as SurfaceCall;
          },
        );
      sdk
        .createApplicationSpace(
          'customer-id',
          'new-app-space',
          'New App Space',
          'App space description',
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
      const sdk = await ConfigClient.createInstance(userToken);
      jest
        .spyOn(sdk['client'], 'createApplicationSpace')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response?: CreateApplicationSpaceResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(null);
            }
            return {} as SurfaceCall;
          },
        );
      sdk
        .createApplicationSpace(
          'customer-id',
          'new-app-space',
          'New App Space',
          'App space description',
        )
        .catch((err) => {
          thrownError = err;
        });
    });

    it('throws an error', () => {
      expect(thrownError.message).toBe('No application space response');
    });
  });
});

describe('readApplicationSpaceById', () => {
  describe('when no error is returned', () => {
    let appSpace: ApplicationSpace;
    let readApplicationSpaceSpy: jest.SpyInstance;

    beforeEach(async () => {
      const sdk = await ConfigClient.createInstance(userToken);
      readApplicationSpaceSpy = jest
        .spyOn(sdk['client'], 'readApplicationSpace')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response: ReadApplicationSpaceResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(null, {
                appSpace: {
                  id: 'app-space-id',
                  customerId: 'customer-id',
                  name: 'app-space-name',
                  description: StringValue.create({ value: 'App space description' }),
                  displayName: 'App Space Name',
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
      appSpace = await sdk.readApplicationSpaceById('app-space-id-request');
    });

    it('sends correct request', () => {
      expect(readApplicationSpaceSpy).toBeCalledWith(
        {
          identifier: {
            oneofKind: 'id',
            id: 'app-space-id-request',
          },
        },
        expect.any(Function),
      );
    });

    it('returns a correct instance', () => {
      expect(appSpace.id).toBe('app-space-id');
      expect(appSpace.customerId).toBe('customer-id');
      expect(appSpace.name).toBe('app-space-name');
      expect(appSpace.description).toBe('App space description');
      expect(appSpace.displayName).toBe('App Space Name');
      expect(appSpace.etag).toBe('5432');
      expect(appSpace.issuerId).toBe('issuer-id');
      expect(appSpace.createTime?.toString()).toBe(new Date(2022, 2, 15, 13, 12).toString());
      expect(appSpace.updateTime?.toString()).toBe(new Date(2022, 2, 15, 13, 13).toString());
      expect(appSpace.deleteTime?.toString()).toBe(new Date(2022, 2, 15, 13, 14).toString());
      expect(appSpace.destroyTime?.toString()).toBe(new Date(2022, 2, 15, 13, 15).toString());
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
        .spyOn(sdk['client'], 'readApplicationSpace')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response?: ReadApplicationSpaceResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(error);
            }
            return {} as SurfaceCall;
          },
        );
      sdk.readApplicationSpaceById('app-space-id-request').catch((err) => {
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
        .spyOn(sdk['client'], 'readApplicationSpace')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response?: ReadApplicationSpaceResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(null);
            }
            return {} as SurfaceCall;
          },
        );
      sdk.readApplicationSpaceById('app-space-id-request').catch((err) => {
        thrownError = err;
      });
    });

    it('throws an error', () => {
      expect(thrownError.message).toBe('No application space response');
    });
  });
});

describe('readApplicationSpaceByName', () => {
  describe('when no error is returned', () => {
    let appSpace: ApplicationSpace;
    let readApplicationSpaceSpy: jest.SpyInstance;

    beforeEach(async () => {
      const sdk = await ConfigClient.createInstance(userToken);
      readApplicationSpaceSpy = jest
        .spyOn(sdk['client'], 'readApplicationSpace')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response: ReadApplicationSpaceResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(null, {
                appSpace: {
                  id: 'app-space-id',
                  customerId: 'customer-id',
                  name: 'app-space-name',
                  description: StringValue.create({ value: 'App space description' }),
                  displayName: 'App Space Name',
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
      appSpace = await sdk.readApplicationSpaceByName(
        'customer-id-request',
        'app-space-name-request',
      );
    });

    it('sends correct request', () => {
      expect(readApplicationSpaceSpy).toBeCalledWith(
        {
          identifier: {
            oneofKind: 'name',
            name: {
              location: 'customer-id-request',
              name: 'app-space-name-request',
            },
          },
        },
        expect.any(Function),
      );
    });

    it('returns a correct instance', () => {
      expect(appSpace.id).toBe('app-space-id');
      expect(appSpace.customerId).toBe('customer-id');
      expect(appSpace.name).toBe('app-space-name');
      expect(appSpace.description).toBe('App space description');
      expect(appSpace.displayName).toBe('App Space Name');
      expect(appSpace.etag).toBe('5432');
      expect(appSpace.issuerId).toBe('issuer-id');
      expect(appSpace.createTime?.toString()).toBe(new Date(2022, 2, 15, 13, 12).toString());
      expect(appSpace.updateTime?.toString()).toBe(new Date(2022, 2, 15, 13, 13).toString());
      expect(appSpace.deleteTime?.toString()).toBe(new Date(2022, 2, 15, 13, 14).toString());
      expect(appSpace.destroyTime?.toString()).toBe(new Date(2022, 2, 15, 13, 15).toString());
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
        .spyOn(sdk['client'], 'readApplicationSpace')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response?: ReadApplicationSpaceResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(error);
            }
            return {} as SurfaceCall;
          },
        );
      sdk
        .readApplicationSpaceByName('customer-id-request', 'app-space-name-request')
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
        .spyOn(sdk['client'], 'readApplicationSpace')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response?: ReadApplicationSpaceResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(null);
            }
            return {} as SurfaceCall;
          },
        );
      sdk
        .readApplicationSpaceByName('customer-id-request', 'app-space-name-request')
        .catch((err) => {
          thrownError = err;
        });
    });

    it('throws an error', () => {
      expect(thrownError.message).toBe('No application space response');
    });
  });
});

describe('readApplicationSpaceList', () => {
  describe('when no error is returned', () => {
    let appSpaces: ApplicationSpace[];
    let listApplicationSpacesSpy: jest.SpyInstance;

    beforeEach(async () => {
      const sdk = await ConfigClient.createInstance(userToken);
      const readMock = jest
        .fn()
        .mockImplementationOnce(() => ({
          appSpace: {
            id: 'app-space-id',
            customerId: 'customer-id',
            name: 'app-space-name',
            description: StringValue.create({ value: 'App space description' }),
            displayName: 'App Space Name',
            etag: '5432',
            issuerId: 'issuer-id',
            createTime: Utils.dateToTimestamp(new Date(2022, 2, 15, 13, 12)),
            updateTime: Utils.dateToTimestamp(new Date(2022, 2, 15, 13, 13)),
            deleteTime: Utils.dateToTimestamp(new Date(2022, 2, 15, 13, 14)),
            destroyTime: Utils.dateToTimestamp(new Date(2022, 2, 15, 13, 15)),
          },
        }))
        .mockImplementationOnce(() => null);
      const eventEmitter = Object.assign(new EventEmitter(), { read: readMock });
      listApplicationSpacesSpy = jest
        .spyOn(sdk['client'], 'listApplicationSpaces')
        .mockImplementation(() => {
          setTimeout(() => eventEmitter.emit('readable'), 0);
          setTimeout(() => eventEmitter.emit('readable'), 0);
          setTimeout(() => eventEmitter.emit('close'), 0);
          return eventEmitter as unknown as ClientReadableStream<ListApplicationSpacesResponse>;
        });

      appSpaces = await sdk.readApplicationSpaceList('customer-id-request', ['app-space-name']);
    });

    it('sends correct request', () => {
      expect(listApplicationSpacesSpy).toBeCalledWith({
        customerId: 'customer-id-request',
        match: ['app-space-name'],
      });
    });

    it('returns a correct instance', () => {
      expect(appSpaces.length).toBe(1);
      expect(appSpaces[0].id).toBe('app-space-id');
      expect(appSpaces[0].customerId).toBe('customer-id');
      expect(appSpaces[0].name).toBe('app-space-name');
      expect(appSpaces[0].description).toBe('App space description');
      expect(appSpaces[0].displayName).toBe('App Space Name');
      expect(appSpaces[0].etag).toBe('5432');
      expect(appSpaces[0].issuerId).toBe('issuer-id');
      expect(appSpaces[0].createTime?.toString()).toBe(new Date(2022, 2, 15, 13, 12).toString());
      expect(appSpaces[0].updateTime?.toString()).toBe(new Date(2022, 2, 15, 13, 13).toString());
      expect(appSpaces[0].deleteTime?.toString()).toBe(new Date(2022, 2, 15, 13, 14).toString());
      expect(appSpaces[0].destroyTime?.toString()).toBe(new Date(2022, 2, 15, 13, 15).toString());
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
      jest.spyOn(sdk['client'], 'listApplicationSpaces').mockImplementation(() => {
        setTimeout(() => eventEmitter.emit('error', error), 0);
        return eventEmitter as unknown as ClientReadableStream<ListApplicationSpacesResponse>;
      });

      return sdk
        .readApplicationSpaceList('customer-id-request', ['app-space-name'])
        .catch((err) => (thrownError = err));
    });

    it('throws an error', () => {
      expect(thrownError).toBe(error);
    });
  });
});

describe('updateApplicationSpace', () => {
  describe('when no error is returned', () => {
    let updatedAppSpace: ApplicationSpace;
    let updateApplicationSpaceSpy: jest.SpyInstance;
    let sdk: ConfigClient;

    beforeEach(async () => {
      sdk = await ConfigClient.createInstance(userToken);
      updateApplicationSpaceSpy = jest
        .spyOn(sdk['client'], 'updateApplicationSpace')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response: UpdateApplicationSpaceResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(null, {
                etag: '777',
                id: 'app-space-id',
                updateTime: Utils.dateToTimestamp(new Date(2022, 2, 15, 13, 16)),
              });
            }
            return {} as SurfaceCall;
          },
        );
    });

    describe('when necessary values are sent only', () => {
      beforeEach(async () => {
        const appSpace = new ApplicationSpace('app-space-id', 'app-space', 'customer-id');
        updatedAppSpace = await sdk.updateApplicationSpace(appSpace);
      });

      it('sends correct request', () => {
        expect(updateApplicationSpaceSpy).toBeCalledWith(
          {
            id: 'app-space-id',
          },
          expect.any(Function),
        );
      });

      it('returns a correct instance', () => {
        expect(updatedAppSpace.id).toBe('app-space-id');
        expect(updatedAppSpace.customerId).toBe('customer-id');
        expect(updatedAppSpace.name).toBe('app-space');
        expect(updatedAppSpace.description).toBeUndefined();
        expect(updatedAppSpace.displayName).toBeUndefined();
        expect(updatedAppSpace.etag).toBe('777');
        expect(updatedAppSpace.issuerId).toBeUndefined();
        expect(updatedAppSpace.createTime).toBeUndefined();
        expect(updatedAppSpace.updateTime?.toString()).toBe(
          new Date(2022, 2, 15, 13, 16).toString(),
        );
        expect(updatedAppSpace.deleteTime).toBeUndefined();
        expect(updatedAppSpace.destroyTime).toBeUndefined();
      });
    });

    describe('when all possible values are sent', () => {
      beforeEach(async () => {
        const appSpace = new ApplicationSpace(
          'app-space-id',
          'app-space',
          'customer-id',
          '555',
          'App Space',
          '11',
          'Description',
        );
        updatedAppSpace = await sdk.updateApplicationSpace(appSpace);
      });

      it('sends correct request', () => {
        expect(updateApplicationSpaceSpy).toBeCalledWith(
          {
            id: 'app-space-id',
            etag: { value: '555' },
            displayName: { value: 'App Space' },
            description: { value: 'Description' },
          },
          expect.any(Function),
        );
      });

      it('returns a correct instance', () => {
        expect(updatedAppSpace.id).toBe('app-space-id');
        expect(updatedAppSpace.customerId).toBe('customer-id');
        expect(updatedAppSpace.name).toBe('app-space');
        expect(updatedAppSpace.description).toBe('Description');
        expect(updatedAppSpace.displayName).toBe('App Space');
        expect(updatedAppSpace.etag).toBe('777');
        expect(updatedAppSpace.issuerId).toBe('11');
        expect(updatedAppSpace.createTime).toBeUndefined();
        expect(updatedAppSpace.updateTime?.toString()).toBe(
          new Date(2022, 2, 15, 13, 16).toString(),
        );
        expect(updatedAppSpace.deleteTime).toBeUndefined();
        expect(updatedAppSpace.destroyTime).toBeUndefined();
      });
    });
  });

  describe('when a different app space is returned', () => {
    let thrownError: SdkError;

    beforeEach(async () => {
      const sdk = await ConfigClient.createInstance(userToken);
      jest
        .spyOn(sdk['client'], 'updateApplicationSpace')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response: UpdateApplicationSpaceResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(null, {
                etag: '777',
                id: 'different-app-space-id',
                updateTime: Utils.dateToTimestamp(new Date(2022, 2, 15, 13, 16)),
              });
            }
            return {} as SurfaceCall;
          },
        );
      const appSpace = new ApplicationSpace(
        'app-space-id',
        'app-space',
        'customer-id',
        '555',
        'App Space',
        '11',
        'Description',
      );
      return sdk.updateApplicationSpace(appSpace).catch((err) => (thrownError = err));
    });

    it('throws an error', () => {
      expect(thrownError.code).toEqual(SdkErrorCode.SDK_CODE_1);
      expect(thrownError.description).toBe(
        'Update returned with different id: req.iq=app-space-id, res.id=different-app-space-id',
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
        .spyOn(sdk['client'], 'updateApplicationSpace')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response?: UpdateApplicationSpaceResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(error);
            }
            return {} as SurfaceCall;
          },
        );
      const appSpace = new ApplicationSpace(
        'app-space-id',
        'app-space',
        'customer-id',
        '555',
        'App Space',
        '11',
        'Description',
      );
      sdk.updateApplicationSpace(appSpace).catch((err) => {
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
        .spyOn(sdk['client'], 'updateApplicationSpace')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response?: UpdateApplicationSpaceResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(null);
            }
            return {} as SurfaceCall;
          },
        );
      const appSpace = new ApplicationSpace(
        'app-space-id',
        'app-space',
        'customer-id',
        '555',
        'App Space',
        '11',
        'Description',
      );
      sdk.updateApplicationSpace(appSpace).catch((err) => {
        thrownError = err;
      });
    });

    it('throws an error', () => {
      expect(thrownError.message).toBe(
        'Update returned with different id: req.iq=app-space-id, res.id=undefined',
      );
    });
  });
});

describe('deleteApplicationSpace', () => {
  describe('when no error is returned', () => {
    let returnedValue: boolean;
    let deleteApplicationSpaceSpy: jest.SpyInstance;

    beforeEach(async () => {
      const sdk = await ConfigClient.createInstance(userToken);
      deleteApplicationSpaceSpy = jest
        .spyOn(sdk['client'], 'deleteApplicationSpace')
        .mockImplementation(
          (req, res: Metadata | CallOptions | ((err: ServiceError | null) => void)) => {
            if (typeof res === 'function') {
              res(null);
            }
            return {} as SurfaceCall;
          },
        );
      const appSpace = new ApplicationSpace(
        'app-space-id',
        'app-space',
        'customer-id',
        '555',
        'App Space',
        '11',
        'Description',
      );
      returnedValue = await sdk.deleteApplicationSpace(appSpace);
    });

    it('sends correct request', () => {
      expect(deleteApplicationSpaceSpy).toBeCalledWith(
        {
          id: 'app-space-id',
          etag: { value: '555' },
        },
        expect.any(Function),
      );
    });

    it('returns true', () => {
      expect(returnedValue).toBe(true);
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
        .spyOn(sdk['client'], 'deleteApplicationSpace')
        .mockImplementation(
          (req, res: Metadata | CallOptions | ((err: ServiceError | null) => void)) => {
            if (typeof res === 'function') {
              res(error);
            }
            return {} as SurfaceCall;
          },
        );
      const appSpace = new ApplicationSpace(
        'app-space-id',
        'app-space',
        'customer-id',
        '555',
        'App Space',
        '11',
        'Description',
      );
      sdk.deleteApplicationSpace(appSpace).catch((err) => {
        thrownError = err;
      });
    });

    it('throws an error', () => {
      expect(thrownError).toBe(error);
    });
  });
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

describe('createApplication', () => {
  describe('when no error is returned', () => {
    let application: Application;
    let createApplicationSpy: jest.SpyInstance;
    let sdk: ConfigClient;

    beforeEach(async () => {
      sdk = await ConfigClient.createInstance(userToken);
      createApplicationSpy = jest
        .spyOn(sdk['client'], 'createApplication')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response: CreateApplicationResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(null, {
                id: 'new-application-id',
                etag: '111',
              });
            }
            return {} as SurfaceCall;
          },
        );
    });

    describe('when necessary values are sent only', () => {
      beforeEach(async () => {
        application = await sdk.createApplication('app-space-id', 'application-name');
      });

      it('sends correct request', () => {
        expect(createApplicationSpy).toBeCalledWith(
          {
            appSpaceId: 'app-space-id',
            name: 'application-name',
          },
          expect.any(Function),
        );
      });

      it('returns a correct instance', () => {
        expect(application.id).toBe('new-application-id');
        expect(application.etag).toBe('111');
        expect(application.appSpaceId).toBe('app-space-id');
        expect(application.name).toBe('application-name');
        expect(application.displayName).toBeUndefined();
        expect(application.description).toBeUndefined();
      });
    });

    describe('when all possible values are sent', () => {
      beforeEach(async () => {
        application = await sdk.createApplication(
          'app-space-id',
          'application-name',
          'My Application',
          'Application description',
        );
      });

      it('sends correct request', () => {
        expect(createApplicationSpy).toBeCalledWith(
          {
            appSpaceId: 'app-space-id',
            name: 'application-name',
            displayName: StringValue.create({ value: 'My Application' }),
            description: StringValue.create({ value: 'Application description' }),
          },
          expect.any(Function),
        );
      });

      it('returns a correct instance', () => {
        expect(application.id).toBe('new-application-id');
        expect(application.etag).toBe('111');
        expect(application.appSpaceId).toBe('app-space-id');
        expect(application.name).toBe('application-name');
        expect(application.displayName).toBe('My Application');
        expect(application.description).toBe('Application description');
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
        .spyOn(sdk['client'], 'createApplication')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response?: CreateApplicationResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(error);
            }
            return {} as SurfaceCall;
          },
        );
      sdk
        .createApplication(
          'app-space-id',
          'application-name',
          'My Application',
          'Application description',
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
      const sdk = await ConfigClient.createInstance(userToken);
      jest
        .spyOn(sdk['client'], 'createApplication')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response?: CreateApplicationResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(null);
            }
            return {} as SurfaceCall;
          },
        );
      sdk
        .createApplication(
          'app-space-id',
          'application-name',
          'My Application',
          'Application description',
        )
        .catch((err) => {
          thrownError = err;
        });
    });

    it('throws an error', () => {
      expect(thrownError.message).toBe('No application response');
    });
  });
});

describe('readApplicationById', () => {
  describe('when no error is returned', () => {
    let application: Application;
    let readApplicationSpy: jest.SpyInstance;

    beforeEach(async () => {
      const sdk = await ConfigClient.createInstance(userToken);
      readApplicationSpy = jest
        .spyOn(sdk['client'], 'readApplication')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response: ReadApplicationResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(null, {
                application: {
                  id: 'application-id',
                  appSpaceId: 'app-space-id',
                  customerId: 'customer-id',
                  name: 'application-name',
                  description: StringValue.create({ value: 'Application description' }),
                  displayName: 'Application Name',
                  etag: '5432',
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
      application = await sdk.readApplicationById('application-id-request');
    });

    it('sends correct request', () => {
      expect(readApplicationSpy).toBeCalledWith(
        {
          identifier: {
            oneofKind: 'id',
            id: 'application-id-request',
          },
        },
        expect.any(Function),
      );
    });

    it('returns a correct instance', () => {
      expect(application.id).toBe('application-id');
      expect(application.appSpaceId).toBe('app-space-id');
      expect(application.customerId).toBe('customer-id');
      expect(application.name).toBe('application-name');
      expect(application.description).toBe('Application description');
      expect(application.displayName).toBe('Application Name');
      expect(application.etag).toBe('5432');
      expect(application.createTime?.toString()).toBe(new Date(2022, 2, 15, 13, 12).toString());
      expect(application.updateTime?.toString()).toBe(new Date(2022, 2, 15, 13, 13).toString());
      expect(application.deleteTime?.toString()).toBe(new Date(2022, 2, 15, 13, 14).toString());
      expect(application.destroyTime?.toString()).toBe(new Date(2022, 2, 15, 13, 15).toString());
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
        .spyOn(sdk['client'], 'readApplication')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response?: ReadApplicationResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(error);
            }
            return {} as SurfaceCall;
          },
        );
      sdk.readApplicationById('application-id-request').catch((err) => {
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
        .spyOn(sdk['client'], 'readApplication')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response?: ReadApplicationResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(null);
            }
            return {} as SurfaceCall;
          },
        );
      sdk.readApplicationById('application-id-request').catch((err) => {
        thrownError = err;
      });
    });

    it('throws an error', () => {
      expect(thrownError.message).toBe('No application response');
    });
  });
});

describe('readApplicationByName', () => {
  describe('when no error is returned', () => {
    let application: Application;
    let readApplicationSpy: jest.SpyInstance;

    beforeEach(async () => {
      const sdk = await ConfigClient.createInstance(userToken);
      readApplicationSpy = jest
        .spyOn(sdk['client'], 'readApplication')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response: ReadApplicationResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(null, {
                application: {
                  id: 'application-id',
                  appSpaceId: 'app-space-id',
                  customerId: 'customer-id',
                  name: 'application-name',
                  displayName: 'Application Name',
                  etag: '5432',
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
      application = await sdk.readApplicationByName(
        'app-space-id-request',
        'application-name-request',
      );
    });

    it('sends correct request', () => {
      expect(readApplicationSpy).toBeCalledWith(
        {
          identifier: {
            oneofKind: 'name',
            name: {
              location: 'app-space-id-request',
              name: 'application-name-request',
            },
          },
        },
        expect.any(Function),
      );
    });

    it('returns a correct instance', () => {
      expect(application.id).toBe('application-id');
      expect(application.appSpaceId).toBe('app-space-id');
      expect(application.customerId).toBe('customer-id');
      expect(application.name).toBe('application-name');
      expect(application.description).toBeUndefined();
      expect(application.displayName).toBe('Application Name');
      expect(application.etag).toBe('5432');
      expect(application.createTime?.toString()).toBe(new Date(2022, 2, 15, 13, 12).toString());
      expect(application.updateTime?.toString()).toBe(new Date(2022, 2, 15, 13, 13).toString());
      expect(application.deleteTime?.toString()).toBe(new Date(2022, 2, 15, 13, 14).toString());
      expect(application.destroyTime?.toString()).toBe(new Date(2022, 2, 15, 13, 15).toString());
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
        .spyOn(sdk['client'], 'readApplication')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response?: ReadApplicationResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(error);
            }
            return {} as SurfaceCall;
          },
        );
      sdk.readApplicationByName('app-space-id-request', 'application-name-request').catch((err) => {
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
        .spyOn(sdk['client'], 'readApplication')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response?: ReadApplicationResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(null);
            }
            return {} as SurfaceCall;
          },
        );
      sdk.readApplicationByName('app-space-id-request', 'application-name-request').catch((err) => {
        thrownError = err;
      });
    });

    it('throws an error', () => {
      expect(thrownError.message).toBe('No application response');
    });
  });
});

describe('readApplicationList', () => {
  describe('when no error is returned', () => {
    let applications: Application[];
    let listApplicationsSpy: jest.SpyInstance;

    beforeEach(async () => {
      const sdk = await ConfigClient.createInstance(userToken);
      const eventEmitter = Object.assign(new EventEmitter(), {});
      listApplicationsSpy = jest.spyOn(sdk['client'], 'listApplications').mockImplementation(() => {
        setTimeout(
          () =>
            eventEmitter.emit('data', {
              application: {
                id: 'application-id',
                appSpaceId: 'app-space-id',
                customerId: 'customer-id',
                name: 'application-name',
                description: StringValue.create({ value: 'Application description' }),
                displayName: 'Application Name',
                etag: '5432',
                createTime: Utils.dateToTimestamp(new Date(2022, 2, 15, 13, 12)),
                updateTime: Utils.dateToTimestamp(new Date(2022, 2, 15, 13, 13)),
                deleteTime: Utils.dateToTimestamp(new Date(2022, 2, 15, 13, 14)),
                destroyTime: Utils.dateToTimestamp(new Date(2022, 2, 15, 13, 15)),
              },
            }),
          0,
        );
        setTimeout(() => eventEmitter.emit('end'), 0);
        return eventEmitter as unknown as ClientReadableStream<ListApplicationsResponse>;
      });

      applications = await sdk.readApplicationList('app-space-id-request', ['application-name']);
    });

    it('sends correct request', () => {
      expect(listApplicationsSpy).toBeCalledWith({
        appSpaceId: 'app-space-id-request',
        match: ['application-name'],
      });
    });

    it('returns a correct instance', () => {
      expect(applications.length).toBe(1);
      expect(applications[0].id).toBe('application-id');
      expect(applications[0].appSpaceId).toBe('app-space-id');
      expect(applications[0].customerId).toBe('customer-id');
      expect(applications[0].name).toBe('application-name');
      expect(applications[0].description).toBe('Application description');
      expect(applications[0].displayName).toBe('Application Name');
      expect(applications[0].etag).toBe('5432');
      expect(applications[0].createTime?.toString()).toBe(new Date(2022, 2, 15, 13, 12).toString());
      expect(applications[0].updateTime?.toString()).toBe(new Date(2022, 2, 15, 13, 13).toString());
      expect(applications[0].deleteTime?.toString()).toBe(new Date(2022, 2, 15, 13, 14).toString());
      expect(applications[0].destroyTime?.toString()).toBe(
        new Date(2022, 2, 15, 13, 15).toString(),
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
      const eventEmitter = Object.assign(new EventEmitter(), { read: jest.fn() });
      jest.spyOn(sdk['client'], 'listApplications').mockImplementation(() => {
        setTimeout(() => eventEmitter.emit('error', error), 0);
        return eventEmitter as unknown as ClientReadableStream<ListApplicationsResponse>;
      });

      return sdk
        .readApplicationList('app-space-id-request', ['application-name'])
        .catch((err) => (thrownError = err));
    });

    it('throws an error', () => {
      expect(thrownError).toBe(error);
    });
  });
});

describe('updateApplication', () => {
  describe('when no error is returned', () => {
    let updatedApplication: Application;
    let updateApplicationSpy: jest.SpyInstance;
    let sdk: ConfigClient;

    beforeEach(async () => {
      sdk = await ConfigClient.createInstance(userToken);
      updateApplicationSpy = jest
        .spyOn(sdk['client'], 'updateApplication')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response: UpdateApplicationResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(null, {
                etag: '777',
                id: 'application-id',
                updateTime: Utils.dateToTimestamp(new Date(2022, 2, 15, 13, 16)),
              });
            }
            return {} as SurfaceCall;
          },
        );
    });

    describe('when necessary values are sent only', () => {
      beforeEach(async () => {
        const application = new Application(
          'application-id',
          'application',
          'app-space-id',
          'customer-id',
        );
        updatedApplication = await sdk.updateApplication(application);
      });

      it('sends correct request', () => {
        expect(updateApplicationSpy).toBeCalledWith(
          {
            id: 'application-id',
          },
          expect.any(Function),
        );
      });

      it('returns a correct instance', () => {
        expect(updatedApplication.id).toBe('application-id');
        expect(updatedApplication.appSpaceId).toBe('app-space-id');
        expect(updatedApplication.customerId).toBe('customer-id');
        expect(updatedApplication.name).toBe('application');
        expect(updatedApplication.description).toBeUndefined();
        expect(updatedApplication.displayName).toBeUndefined();
        expect(updatedApplication.etag).toBe('777');
        expect(updatedApplication.createTime).toBeUndefined();
        expect(updatedApplication.updateTime?.toString()).toBe(
          new Date(2022, 2, 15, 13, 16).toString(),
        );
        expect(updatedApplication.deleteTime).toBeUndefined();
        expect(updatedApplication.destroyTime).toBeUndefined();
      });
    });

    describe('when all possible values are sent', () => {
      beforeEach(async () => {
        const application = new Application(
          'application-id',
          'application',
          'app-space-id',
          'customer-id',
          'Application Name',
          '555',
          'Description',
        );
        updatedApplication = await sdk.updateApplication(application);
      });

      it('sends correct request', () => {
        expect(updateApplicationSpy).toBeCalledWith(
          {
            id: 'application-id',
            etag: { value: '555' },
            displayName: { value: 'Application Name' },
            description: { value: 'Description' },
          },
          expect.any(Function),
        );
      });

      it('returns a correct instance', () => {
        expect(updatedApplication.id).toBe('application-id');
        expect(updatedApplication.appSpaceId).toBe('app-space-id');
        expect(updatedApplication.customerId).toBe('customer-id');
        expect(updatedApplication.name).toBe('application');
        expect(updatedApplication.description).toBe('Description');
        expect(updatedApplication.displayName).toBe('Application Name');
        expect(updatedApplication.etag).toBe('777');
        expect(updatedApplication.createTime).toBeUndefined();
        expect(updatedApplication.updateTime?.toString()).toBe(
          new Date(2022, 2, 15, 13, 16).toString(),
        );
        expect(updatedApplication.deleteTime).toBeUndefined();
        expect(updatedApplication.destroyTime).toBeUndefined();
      });
    });
  });

  describe('when a different application is returned', () => {
    let thrownError: SdkError;

    beforeEach(async () => {
      const sdk = await ConfigClient.createInstance(userToken);
      jest
        .spyOn(sdk['client'], 'updateApplication')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response: UpdateApplicationResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(null, {
                etag: '777',
                id: 'different-application-id',
                updateTime: Utils.dateToTimestamp(new Date(2022, 2, 15, 13, 16)),
              });
            }
            return {} as SurfaceCall;
          },
        );
      const application = new Application(
        'application-id',
        'application',
        'app-space-id',
        'customer-id',
        'Application Name',
        '11',
        'Description',
      );
      return sdk.updateApplication(application).catch((err) => (thrownError = err));
    });

    it('throws an error', () => {
      expect(thrownError.code).toEqual(SdkErrorCode.SDK_CODE_1);
      expect(thrownError.description).toBe(
        'Update returned with different id: req.iq=application-id, res.id=different-application-id',
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
        .spyOn(sdk['client'], 'updateApplication')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response?: UpdateApplicationResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(error);
            }
            return {} as SurfaceCall;
          },
        );
      const application = new Application(
        'application-id',
        'application',
        'app-space-id',
        'customer-id',
        'Application Name',
        '11',
        'Description',
      );
      sdk.updateApplication(application).catch((err) => {
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
        .spyOn(sdk['client'], 'updateApplication')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response?: UpdateApplicationResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(null);
            }
            return {} as SurfaceCall;
          },
        );
      const application = new Application(
        'application-id',
        'application',
        'app-space-id',
        'customer-id',
        'Application Name',
        '11',
        'Description',
      );
      sdk.updateApplication(application).catch((err) => {
        thrownError = err;
      });
    });

    it('throws an error', () => {
      expect(thrownError.message).toBe(
        'Update returned with different id: req.iq=application-id, res.id=undefined',
      );
    });
  });
});

describe('createApplicationAgent', () => {
  describe('when no error is returned', () => {
    let applicationAgent: ApplicationAgent;
    let createApplicationAgentSpy: jest.SpyInstance;
    let sdk: ConfigClient;

    beforeEach(async () => {
      sdk = await ConfigClient.createInstance(userToken);
      createApplicationAgentSpy = jest
        .spyOn(sdk['client'], 'createApplicationAgent')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response: CreateApplicationResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(null, {
                id: 'new-app-agent-id',
                etag: '111',
              });
            }
            return {} as SurfaceCall;
          },
        );
    });

    describe('when necessary values are sent only', () => {
      beforeEach(async () => {
        applicationAgent = await sdk.createApplicationAgent('application-id', 'app-agent-name');
      });

      it('sends correct request', () => {
        expect(createApplicationAgentSpy).toBeCalledWith(
          {
            applicationId: 'application-id',
            name: 'app-agent-name',
          },
          expect.any(Function),
        );
      });

      it('returns a correct instance', () => {
        expect(applicationAgent.id).toBe('new-app-agent-id');
        expect(applicationAgent.etag).toBe('111');
        expect(applicationAgent.applicationId).toBe('application-id');
        expect(applicationAgent.name).toBe('app-agent-name');
        expect(applicationAgent.displayName).toBeUndefined();
        expect(applicationAgent.description).toBeUndefined();
      });
    });

    describe('when all possible values are sent', () => {
      beforeEach(async () => {
        applicationAgent = await sdk.createApplicationAgent(
          'application-id',
          'app-agent-name',
          'My Application Agent',
          'Application Agent description',
        );
      });

      it('sends correct request', () => {
        expect(createApplicationAgentSpy).toBeCalledWith(
          {
            applicationId: 'application-id',
            name: 'app-agent-name',
            displayName: StringValue.create({ value: 'My Application Agent' }),
            description: StringValue.create({ value: 'Application Agent description' }),
          },
          expect.any(Function),
        );
      });

      it('returns a correct instance', () => {
        expect(applicationAgent.id).toBe('new-app-agent-id');
        expect(applicationAgent.etag).toBe('111');
        expect(applicationAgent.applicationId).toBe('application-id');
        expect(applicationAgent.name).toBe('app-agent-name');
        expect(applicationAgent.displayName).toBe('My Application Agent');
        expect(applicationAgent.description).toBe('Application Agent description');
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
        .spyOn(sdk['client'], 'createApplicationAgent')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response?: CreateApplicationResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(error);
            }
            return {} as SurfaceCall;
          },
        );
      sdk
        .createApplicationAgent(
          'application-id',
          'app-agent-name',
          'My Application Agent',
          'Application Agent description',
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
      const sdk = await ConfigClient.createInstance(userToken);
      jest
        .spyOn(sdk['client'], 'createApplicationAgent')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response?: CreateApplicationResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(null);
            }
            return {} as SurfaceCall;
          },
        );
      sdk
        .createApplicationAgent(
          'application-id',
          'app-agent-name',
          'My Application Agent',
          'Application Agent description',
        )
        .catch((err) => {
          thrownError = err;
        });
    });

    it('throws an error', () => {
      expect(thrownError.message).toBe('No application agent response');
    });
  });
});

describe('readApplicationAgentById', () => {
  describe('when no error is returned', () => {
    let applicationAgent: ApplicationAgent;
    let readApplicationAgentSpy: jest.SpyInstance;

    beforeEach(async () => {
      const sdk = await ConfigClient.createInstance(userToken);
      readApplicationAgentSpy = jest
        .spyOn(sdk['client'], 'readApplicationAgent')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response: ReadApplicationAgentResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(null, {
                applicationAgent: {
                  id: 'app-agent-id',
                  appSpaceId: 'app-space-id',
                  applicationId: 'application-id',
                  customerId: 'customer-id',
                  name: 'app-agent-name',
                  description: StringValue.create({ value: 'Application Agent description' }),
                  displayName: 'Application Agent Name',
                  etag: '5432',
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
      applicationAgent = await sdk.readApplicationAgentById('app-agent-id-request');
    });

    it('sends correct request', () => {
      expect(readApplicationAgentSpy).toBeCalledWith(
        {
          identifier: {
            oneofKind: 'id',
            id: 'app-agent-id-request',
          },
        },
        expect.any(Function),
      );
    });

    it('returns a correct instance', () => {
      expect(applicationAgent.id).toBe('app-agent-id');
      expect(applicationAgent.appSpaceId).toBe('app-space-id');
      expect(applicationAgent.applicationId).toBe('application-id');
      expect(applicationAgent.customerId).toBe('customer-id');
      expect(applicationAgent.name).toBe('app-agent-name');
      expect(applicationAgent.description).toBe('Application Agent description');
      expect(applicationAgent.displayName).toBe('Application Agent Name');
      expect(applicationAgent.etag).toBe('5432');
      expect(applicationAgent.createTime?.toString()).toBe(
        new Date(2022, 2, 15, 13, 12).toString(),
      );
      expect(applicationAgent.updateTime?.toString()).toBe(
        new Date(2022, 2, 15, 13, 13).toString(),
      );
      expect(applicationAgent.deleteTime?.toString()).toBe(
        new Date(2022, 2, 15, 13, 14).toString(),
      );
      expect(applicationAgent.destroyTime?.toString()).toBe(
        new Date(2022, 2, 15, 13, 15).toString(),
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
        .spyOn(sdk['client'], 'readApplicationAgent')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response?: ReadApplicationAgentResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(error);
            }
            return {} as SurfaceCall;
          },
        );
      sdk.readApplicationAgentById('app-agent-id-request').catch((err) => {
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
        .spyOn(sdk['client'], 'readApplicationAgent')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response?: ReadApplicationAgentResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(null);
            }
            return {} as SurfaceCall;
          },
        );
      sdk.readApplicationAgentById('app-agent-id-request').catch((err) => {
        thrownError = err;
      });
    });

    it('throws an error', () => {
      expect(thrownError.message).toBe('No application agent response');
    });
  });
});

describe('readApplicationAgentByName', () => {
  describe('when no error is returned', () => {
    let applicationAgent: ApplicationAgent;
    let readApplicationSpy: jest.SpyInstance;

    beforeEach(async () => {
      const sdk = await ConfigClient.createInstance(userToken);
      readApplicationSpy = jest
        .spyOn(sdk['client'], 'readApplicationAgent')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response: ReadApplicationAgentResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(null, {
                applicationAgent: {
                  id: 'app-agent-id',
                  appSpaceId: 'app-space-id',
                  applicationId: 'application-id',
                  customerId: 'customer-id',
                  name: 'app-agent-name',
                  description: StringValue.create({ value: 'Application Agent description' }),
                  displayName: 'Application Agent Name',
                  etag: '5432',
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
      applicationAgent = await sdk.readApplicationAgentByName(
        'app-space-id-request',
        'application-name-request',
      );
    });

    it('sends correct request', () => {
      expect(readApplicationSpy).toBeCalledWith(
        {
          identifier: {
            oneofKind: 'name',
            name: {
              location: 'app-space-id-request',
              name: 'application-name-request',
            },
          },
        },
        expect.any(Function),
      );
    });

    it('returns a correct instance', () => {
      expect(applicationAgent.id).toBe('app-agent-id');
      expect(applicationAgent.appSpaceId).toBe('app-space-id');
      expect(applicationAgent.applicationId).toBe('application-id');
      expect(applicationAgent.customerId).toBe('customer-id');
      expect(applicationAgent.name).toBe('app-agent-name');
      expect(applicationAgent.description).toBe('Application Agent description');
      expect(applicationAgent.displayName).toBe('Application Agent Name');
      expect(applicationAgent.etag).toBe('5432');
      expect(applicationAgent.createTime?.toString()).toBe(
        new Date(2022, 2, 15, 13, 12).toString(),
      );
      expect(applicationAgent.updateTime?.toString()).toBe(
        new Date(2022, 2, 15, 13, 13).toString(),
      );
      expect(applicationAgent.deleteTime?.toString()).toBe(
        new Date(2022, 2, 15, 13, 14).toString(),
      );
      expect(applicationAgent.destroyTime?.toString()).toBe(
        new Date(2022, 2, 15, 13, 15).toString(),
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
        .spyOn(sdk['client'], 'readApplicationAgent')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response?: ReadApplicationAgentResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(error);
            }
            return {} as SurfaceCall;
          },
        );
      sdk
        .readApplicationAgentByName('app-space-id-request', 'app-agent-name-request')
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
        .spyOn(sdk['client'], 'readApplicationAgent')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response?: ReadApplicationAgentResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(null);
            }
            return {} as SurfaceCall;
          },
        );
      sdk
        .readApplicationAgentByName('app-space-id-request', 'app-agent-name-request')
        .catch((err) => {
          thrownError = err;
        });
    });

    it('throws an error', () => {
      expect(thrownError.message).toBe('No application agent response');
    });
  });
});

describe('updateApplicationAgent', () => {
  describe('when no error is returned', () => {
    let updatedApplicationAgent: ApplicationAgent;
    let updateApplicationAgentSpy: jest.SpyInstance;
    let sdk: ConfigClient;

    beforeEach(async () => {
      sdk = await ConfigClient.createInstance(userToken);
      updateApplicationAgentSpy = jest
        .spyOn(sdk['client'], 'updateApplicationAgent')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response: UpdateApplicationAgentResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(null, {
                etag: 'new-etag-id',
                id: 'app-agent-id',
                updateTime: Utils.dateToTimestamp(new Date(2022, 2, 15, 13, 16)),
              });
            }
            return {} as SurfaceCall;
          },
        );
    });

    describe('when necessary values are sent only', () => {
      beforeEach(async () => {
        const applicationAgent = new ApplicationAgent(
          'app-agent-id',
          'app-agent-name',
          'application-id',
        );
        updatedApplicationAgent = await sdk.updateApplicationAgent(applicationAgent);
      });

      it('sends correct request', () => {
        expect(updateApplicationAgentSpy).toBeCalledWith(
          {
            id: 'app-agent-id',
          },
          expect.any(Function),
        );
      });

      it('returns a correct instance', () => {
        expect(updatedApplicationAgent.id).toBe('app-agent-id');
        expect(updatedApplicationAgent.appSpaceId).toBeUndefined();
        expect(updatedApplicationAgent.applicationId).toBe('application-id');
        expect(updatedApplicationAgent.customerId).toBeUndefined();
        expect(updatedApplicationAgent.name).toBe('app-agent-name');
        expect(updatedApplicationAgent.description).toBeUndefined();
        expect(updatedApplicationAgent.displayName).toBeUndefined();
        expect(updatedApplicationAgent.etag).toBe('new-etag-id');
        expect(updatedApplicationAgent.createTime).toBeUndefined();
        expect(updatedApplicationAgent.updateTime?.toString()).toBe(
          new Date(2022, 2, 15, 13, 16).toString(),
        );
        expect(updatedApplicationAgent.deleteTime).toBeUndefined();
        expect(updatedApplicationAgent.destroyTime).toBeUndefined();
      });
    });

    describe('when all possible values are sent', () => {
      beforeEach(async () => {
        const applicationAgent = new ApplicationAgent(
          'app-agent-id',
          'app-agent-name',
          'application-id',
          'app-space-id',
          'Application Agent Name',
          'customer-id',
          'etag-id',
          'Agent Description',
          new Date(2022, 2, 15, 13, 15),
        );
        updatedApplicationAgent = await sdk.updateApplicationAgent(applicationAgent);
      });

      it('sends correct request', () => {
        expect(updateApplicationAgentSpy).toBeCalledWith(
          {
            id: 'app-agent-id',
            etag: { value: 'etag-id' },
            displayName: { value: 'Application Agent Name' },
            description: { value: 'Agent Description' },
          },
          expect.any(Function),
        );
      });

      it('returns a correct instance', () => {
        expect(updatedApplicationAgent.id).toBe('app-agent-id');
        expect(updatedApplicationAgent.appSpaceId).toBe('app-space-id');
        expect(updatedApplicationAgent.applicationId).toBe('application-id');
        expect(updatedApplicationAgent.customerId).toBe('customer-id');
        expect(updatedApplicationAgent.name).toBe('app-agent-name');
        expect(updatedApplicationAgent.description).toBe('Agent Description');
        expect(updatedApplicationAgent.displayName).toBe('Application Agent Name');
        expect(updatedApplicationAgent.etag).toBe('new-etag-id');
        expect(updatedApplicationAgent.createTime?.toString()).toBe(
          new Date(2022, 2, 15, 13, 15).toString(),
        );
        expect(updatedApplicationAgent.updateTime?.toString()).toBe(
          new Date(2022, 2, 15, 13, 16).toString(),
        );
        expect(updatedApplicationAgent.deleteTime).toBeUndefined();
        expect(updatedApplicationAgent.destroyTime).toBeUndefined();
      });
    });
  });

  describe('when a different application agent is returned', () => {
    let thrownError: SdkError;

    beforeEach(async () => {
      const sdk = await ConfigClient.createInstance(userToken);
      jest
        .spyOn(sdk['client'], 'updateApplicationAgent')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response: UpdateApplicationAgentResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(null, {
                etag: '777',
                id: 'different-app-agent-id',
                updateTime: Utils.dateToTimestamp(new Date(2022, 2, 15, 13, 16)),
              });
            }
            return {} as SurfaceCall;
          },
        );
      const applicationAgent = new ApplicationAgent(
        'app-agent-id',
        'app-agent-name',
        'application-id',
        'app-space-id',
        'Application Agent Name',
        'customer-id',
        'etag-id',
        'Agent Description',
      );
      return sdk.updateApplicationAgent(applicationAgent).catch((err) => (thrownError = err));
    });

    it('throws an error', () => {
      expect(thrownError.code).toEqual(SdkErrorCode.SDK_CODE_1);
      expect(thrownError.description).toBe(
        'Update returned with different id: req.iq=app-agent-id, res.id=different-app-agent-id',
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
        .spyOn(sdk['client'], 'updateApplicationAgent')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response?: UpdateApplicationAgentResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(error);
            }
            return {} as SurfaceCall;
          },
        );
      const applicationAgent = new ApplicationAgent(
        'app-agent-id',
        'app-agent-name',
        'application-id',
        'app-space-id',
        'Application Agent Name',
        'customer-id',
        'etag-id',
        'Agent Description',
      );
      sdk.updateApplicationAgent(applicationAgent).catch((err) => {
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
        .spyOn(sdk['client'], 'updateApplicationAgent')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response?: UpdateApplicationAgentResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(null);
            }
            return {} as SurfaceCall;
          },
        );
      const applicationAgent = new ApplicationAgent(
        'app-agent-id',
        'app-agent-name',
        'application-id',
        'app-space-id',
        'Application Agent Name',
        'customer-id',
        'etag-id',
        'Agent Description',
      );
      sdk.updateApplicationAgent(applicationAgent).catch((err) => {
        thrownError = err;
      });
    });

    it('throws an error', () => {
      expect(thrownError.message).toBe(
        'Update returned with different id: req.iq=app-agent-id, res.id=undefined',
      );
    });
  });
});

describe('readApplicationAgentList', () => {
  describe('when no error is returned', () => {
    let applicationAgents: ApplicationAgent[];
    let listApplicationAgentsSpy: jest.SpyInstance;

    beforeEach(async () => {
      const sdk = await ConfigClient.createInstance(userToken);
      const eventEmitter = Object.assign(new EventEmitter(), {});
      listApplicationAgentsSpy = jest
        .spyOn(sdk['client'], 'listApplicationAgents')
        .mockImplementation(() => {
          setTimeout(
            () =>
              eventEmitter.emit('data', {
                applicationAgent: {
                  id: 'app-agent-id',
                  appSpaceId: 'app-space-id',
                  applicationId: 'application-id',
                  customerId: 'customer-id',
                  name: 'app-agent-name',
                  description: StringValue.create({ value: 'Application Agent description' }),
                  displayName: 'Application Agent Name',
                  etag: 'etag-id',
                  createTime: Utils.dateToTimestamp(new Date(2022, 2, 15, 13, 12)),
                  updateTime: Utils.dateToTimestamp(new Date(2022, 2, 15, 13, 13)),
                  deleteTime: Utils.dateToTimestamp(new Date(2022, 2, 15, 13, 14)),
                  destroyTime: Utils.dateToTimestamp(new Date(2022, 2, 15, 13, 15)),
                },
              }),
            0,
          );
          setTimeout(() => eventEmitter.emit('end'), 0);
          return eventEmitter as unknown as ClientReadableStream<ListApplicationAgentsResponse>;
        });

      applicationAgents = await sdk.readApplicationAgentList('app-space-id-request', [
        'app-agent-name',
      ]);
    });

    it('sends correct request', () => {
      expect(listApplicationAgentsSpy).toBeCalledWith({
        appSpaceId: 'app-space-id-request',
        match: ['app-agent-name'],
      });
    });

    it('returns a correct instance', () => {
      expect(applicationAgents.length).toBe(1);
      expect(applicationAgents[0].id).toBe('app-agent-id');
      expect(applicationAgents[0].appSpaceId).toBe('app-space-id');
      expect(applicationAgents[0].applicationId).toBe('application-id');
      expect(applicationAgents[0].customerId).toBe('customer-id');
      expect(applicationAgents[0].name).toBe('app-agent-name');
      expect(applicationAgents[0].description).toBe('Application Agent description');
      expect(applicationAgents[0].displayName).toBe('Application Agent Name');
      expect(applicationAgents[0].etag).toBe('etag-id');
      expect(applicationAgents[0].createTime?.toString()).toBe(
        new Date(2022, 2, 15, 13, 12).toString(),
      );
      expect(applicationAgents[0].updateTime?.toString()).toBe(
        new Date(2022, 2, 15, 13, 13).toString(),
      );
      expect(applicationAgents[0].deleteTime?.toString()).toBe(
        new Date(2022, 2, 15, 13, 14).toString(),
      );
      expect(applicationAgents[0].destroyTime?.toString()).toBe(
        new Date(2022, 2, 15, 13, 15).toString(),
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
      const eventEmitter = Object.assign(new EventEmitter(), { read: jest.fn() });
      jest.spyOn(sdk['client'], 'listApplicationAgents').mockImplementation(() => {
        setTimeout(() => eventEmitter.emit('error', error), 0);
        return eventEmitter as unknown as ClientReadableStream<ListApplicationAgentsResponse>;
      });

      return sdk
        .readApplicationAgentList('app-space-id-request', ['app-agent-name'])
        .catch((err) => (thrownError = err));
    });

    it('throws an error', () => {
      expect(thrownError).toBe(error);
    });
  });
});

describe('deleteApplicationAgent', () => {
  describe('when no error is returned', () => {
    let deleteApplicationAgentSpy: jest.SpyInstance;
    let sdk: ConfigClient;

    beforeEach(async () => {
      sdk = await ConfigClient.createInstance(userToken);
      deleteApplicationAgentSpy = jest
        .spyOn(sdk['client'], 'deleteApplicationAgent')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response: DeleteApplicationAgentResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(null, {
                id: 'app-agent-id',
                etag: 'etag-id',
              });
            }
            return {} as SurfaceCall;
          },
        );
      return sdk.deleteApplicationAgent('app-agent-id');
    });

    it('sends correct request', () => {
      expect(deleteApplicationAgentSpy).toBeCalledWith(
        {
          id: 'app-agent-id',
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
      const sdk = await ConfigClient.createInstance(userToken);
      jest
        .spyOn(sdk['client'], 'deleteApplicationAgent')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response?: DeleteApplicationAgentResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(error);
            }
            return {} as SurfaceCall;
          },
        );
      sdk.deleteApplicationAgent('app-agent-id').catch((err) => {
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
        .spyOn(sdk['client'], 'deleteApplicationAgent')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response?: DeleteApplicationAgentResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(null);
            }
            return {} as SurfaceCall;
          },
        );
      sdk.deleteApplicationAgent('app-agent-id').catch((err) => {
        thrownError = err;
      });
    });

    it('throws an error', () => {
      expect(thrownError.message).toBe('No application agent response');
    });
  });
});

describe('registerApplicationCredential', () => {
  describe('when no error is returned', () => {
    let applicationAgentCredential: ApplicationAgentCredential;
    let registerApplicationAgentCredentialSpy: jest.SpyInstance;
    let sdk: ConfigClient;

    beforeEach(async () => {
      sdk = await ConfigClient.createInstance(userToken);
      registerApplicationAgentCredentialSpy = jest
        .spyOn(sdk['client'], 'registerApplicationAgentCredential')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((
                  err: ServiceError | null,
                  response: RegisterApplicationAgentCredentialResponse,
                ) => void),
          ) => {
            if (typeof res === 'function') {
              res(null, {
                id: 'new-app-agent-credentials-id',
                applicationAgentId: 'app-agent-id',
                kid: 'kid-id',
                agentConfig: new Uint8Array(
                  Buffer.from(
                    '{"baseUrl":"https://jarvis-dev.indykite.com","applicationId":"00112233-a551-4b82-8648-939def7e3607" /* SKIPPED REST VALUES */}',
                    'utf-8',
                  ),
                ),
                createTime: Utils.dateToTimestamp(new Date(2022, 5, 20, 11, 27)),
                expireTime: req.expireTime,
              });
            }
            return {} as SurfaceCall;
          },
        );
    });

    describe('when necessary values are sent only', () => {
      beforeEach(async () => {
        applicationAgentCredential = await sdk.registerApplicationCredential(
          'app-agent-id',
          'Agent Credentials',
          'default-tenant-id',
        );
      });

      it('sends correct request', () => {
        expect(registerApplicationAgentCredentialSpy).toBeCalledWith(
          {
            applicationAgentId: 'app-agent-id',
            displayName: 'Agent Credentials',
            defaultTenantId: 'default-tenant-id',
            publicKey: { oneofKind: undefined },
          },
          expect.any(Function),
        );
      });

      it('returns a correct instance', () => {
        expect(applicationAgentCredential.id).toBe('new-app-agent-credentials-id');
        expect(applicationAgentCredential.kid).toBe('kid-id');
        expect(applicationAgentCredential.applicationAgentId).toBe('app-agent-id');
        expect(applicationAgentCredential.agentConfig).toBe(
          '{"baseUrl":"https://jarvis-dev.indykite.com","applicationId":"00112233-a551-4b82-8648-939def7e3607" /* SKIPPED REST VALUES */}',
        );
        expect(applicationAgentCredential.appSpaceId).toBeUndefined();
        expect(applicationAgentCredential.applicationId).toBeUndefined();
        expect(applicationAgentCredential.createTime?.toString()).toBe(
          new Date(2022, 5, 20, 11, 27).toString(),
        );
        expect(applicationAgentCredential.customerId).toBeUndefined();
        expect(applicationAgentCredential.deleteTime).toBeUndefined();
        expect(applicationAgentCredential.destroyTime).toBeUndefined();
        expect(applicationAgentCredential.displayName).toBe('Agent Credentials');
        expect(applicationAgentCredential.expireTime).toBeUndefined();
      });
    });

    describe('when all possible values are sent (JWK variant)', () => {
      const publicKey = Buffer.from('mocked-jwk-key');
      const expireTime = new Date(2022, 11, 31, 23, 59, 59);

      beforeEach(async () => {
        applicationAgentCredential = await sdk.registerApplicationCredential(
          'app-agent-id',
          'Agent Credentials',
          'default-tenant-id',
          'jwk',
          publicKey,
          expireTime,
        );
      });

      it('sends correct request', () => {
        expect(registerApplicationAgentCredentialSpy).toBeCalledWith(
          {
            applicationAgentId: 'app-agent-id',
            displayName: 'Agent Credentials',
            defaultTenantId: 'default-tenant-id',
            publicKey: { oneofKind: 'jwk', jwk: publicKey },
            expireTime: Utils.dateToTimestamp(expireTime),
          },
          expect.any(Function),
        );
      });

      it('returns a correct instance', () => {
        expect(applicationAgentCredential.id).toBe('new-app-agent-credentials-id');
        expect(applicationAgentCredential.kid).toBe('kid-id');
        expect(applicationAgentCredential.applicationAgentId).toBe('app-agent-id');
        expect(applicationAgentCredential.agentConfig).toBe(
          '{"baseUrl":"https://jarvis-dev.indykite.com","applicationId":"00112233-a551-4b82-8648-939def7e3607" /* SKIPPED REST VALUES */}',
        );
        expect(applicationAgentCredential.appSpaceId).toBeUndefined();
        expect(applicationAgentCredential.applicationId).toBeUndefined();
        expect(applicationAgentCredential.createTime?.toString()).toBe(
          new Date(2022, 5, 20, 11, 27).toString(),
        );
        expect(applicationAgentCredential.customerId).toBeUndefined();
        expect(applicationAgentCredential.deleteTime).toBeUndefined();
        expect(applicationAgentCredential.destroyTime).toBeUndefined();
        expect(applicationAgentCredential.displayName).toBe('Agent Credentials');
        expect(applicationAgentCredential.expireTime?.toString()).toBe(
          new Date(2022, 11, 31, 23, 59, 59).toString(),
        );
      });
    });

    describe('when all possible values are sent (PEM variant)', () => {
      const publicKey = Buffer.from('mocked-pem-key');
      const expireTime = new Date(2022, 11, 31, 23, 59, 59);

      beforeEach(async () => {
        applicationAgentCredential = await sdk.registerApplicationCredential(
          'app-agent-id',
          'Agent Credentials',
          'default-tenant-id',
          'pem',
          publicKey,
          expireTime,
        );
      });

      it('sends correct request', () => {
        expect(registerApplicationAgentCredentialSpy).toBeCalledWith(
          {
            applicationAgentId: 'app-agent-id',
            displayName: 'Agent Credentials',
            defaultTenantId: 'default-tenant-id',
            publicKey: { oneofKind: 'pem', pem: publicKey },
            expireTime: Utils.dateToTimestamp(expireTime),
          },
          expect.any(Function),
        );
      });

      it('returns a correct instance', () => {
        expect(applicationAgentCredential.id).toBe('new-app-agent-credentials-id');
        expect(applicationAgentCredential.kid).toBe('kid-id');
        expect(applicationAgentCredential.applicationAgentId).toBe('app-agent-id');
        expect(applicationAgentCredential.agentConfig).toBe(
          '{"baseUrl":"https://jarvis-dev.indykite.com","applicationId":"00112233-a551-4b82-8648-939def7e3607" /* SKIPPED REST VALUES */}',
        );
        expect(applicationAgentCredential.appSpaceId).toBeUndefined();
        expect(applicationAgentCredential.applicationId).toBeUndefined();
        expect(applicationAgentCredential.createTime?.toString()).toBe(
          new Date(2022, 5, 20, 11, 27).toString(),
        );
        expect(applicationAgentCredential.customerId).toBeUndefined();
        expect(applicationAgentCredential.deleteTime).toBeUndefined();
        expect(applicationAgentCredential.destroyTime).toBeUndefined();
        expect(applicationAgentCredential.displayName).toBe('Agent Credentials');
        expect(applicationAgentCredential.expireTime?.toString()).toBe(
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
      const sdk = await ConfigClient.createInstance(userToken);
      jest
        .spyOn(sdk['client'], 'registerApplicationAgentCredential')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((
                  err: ServiceError | null,
                  response?: RegisterApplicationAgentCredentialResponse,
                ) => void),
          ) => {
            if (typeof res === 'function') {
              res(error);
            }
            return {} as SurfaceCall;
          },
        );
      sdk
        .registerApplicationCredential('app-agent-id', 'Agent Credentials', 'default-tenant-id')
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
        .spyOn(sdk['client'], 'registerApplicationAgentCredential')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((
                  err: ServiceError | null,
                  response?: RegisterApplicationAgentCredentialResponse,
                ) => void),
          ) => {
            if (typeof res === 'function') {
              res(null);
            }
            return {} as SurfaceCall;
          },
        );
      sdk
        .registerApplicationCredential('app-agent-id', 'Agent Credentials', 'default-tenant-id')
        .catch((err) => {
          thrownError = err;
        });
    });

    it('throws an error', () => {
      expect(thrownError.message).toBe('No application agent credential response');
    });
  });
});

describe('readApplicationAgentCredential', () => {
  describe('when no error is returned', () => {
    let credential: ApplicationAgentCredential;
    let readApplicationAgentCredentialSpy: jest.SpyInstance;

    beforeEach(async () => {
      const sdk = await ConfigClient.createInstance(userToken);
      readApplicationAgentCredentialSpy = jest
        .spyOn(sdk['client'], 'readApplicationAgentCredential')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((
                  err: ServiceError | null,
                  response: ReadApplicationAgentCredentialResponse,
                ) => void),
          ) => {
            if (typeof res === 'function') {
              res(null, {
                applicationAgentCredential: {
                  id: 'app-agent-credential-id',
                  kid: 'kid-id',
                  appSpaceId: 'app-space-id',
                  applicationId: 'application-id',
                  applicationAgentId: 'app-agent-id',
                  customerId: 'customer-id',
                  displayName: 'Application Agent Credential',
                  createTime: Utils.dateToTimestamp(new Date(2022, 2, 15, 13, 13)),
                  deleteTime: Utils.dateToTimestamp(new Date(2022, 2, 15, 13, 14)),
                  destroyTime: Utils.dateToTimestamp(new Date(2022, 2, 15, 13, 15)),
                },
              });
            }
            return {} as SurfaceCall;
          },
        );
      credential = await sdk.readApplicationAgentCredential('app-agent-credential-id');
    });

    it('sends correct request', () => {
      expect(readApplicationAgentCredentialSpy).toBeCalledWith(
        {
          id: 'app-agent-credential-id',
        },
        expect.any(Function),
      );
    });

    it('returns a correct instance', () => {
      expect(credential.id).toBe('app-agent-credential-id');
      expect(credential.kid).toBe('kid-id');
      expect(credential.appSpaceId).toBe('app-space-id');
      expect(credential.applicationId).toBe('application-id');
      expect(credential.applicationAgentId).toBe('app-agent-id');
      expect(credential.customerId).toBe('customer-id');
      expect(credential.displayName).toBe('Application Agent Credential');
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
      const sdk = await ConfigClient.createInstance(userToken);
      jest
        .spyOn(sdk['client'], 'readApplicationAgentCredential')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((
                  err: ServiceError | null,
                  response?: ReadApplicationAgentCredentialResponse,
                ) => void),
          ) => {
            if (typeof res === 'function') {
              res(error);
            }
            return {} as SurfaceCall;
          },
        );
      sdk.readApplicationAgentCredential('app-agent-credential-id').catch((err) => {
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
        .spyOn(sdk['client'], 'readApplicationAgentCredential')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((
                  err: ServiceError | null,
                  response?: ReadApplicationAgentCredentialResponse,
                ) => void),
          ) => {
            if (typeof res === 'function') {
              res(null);
            }
            return {} as SurfaceCall;
          },
        );
      sdk.readApplicationAgentCredential('app-agent-credential-id').catch((err) => {
        thrownError = err;
      });
    });

    it('throws an error', () => {
      expect(thrownError.message).toBe('No application agent credential response');
    });
  });
});

describe('deleteApplicationAgentCredential', () => {
  describe('when no error is returned', () => {
    let deleteApplicationAgentCredentialSpy: jest.SpyInstance;
    let sdk: ConfigClient;

    beforeEach(async () => {
      sdk = await ConfigClient.createInstance(userToken);
      deleteApplicationAgentCredentialSpy = jest
        .spyOn(sdk['client'], 'deleteApplicationAgentCredential')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((
                  err: ServiceError | null,
                  response: DeleteApplicationAgentCredentialResponse,
                ) => void),
          ) => {
            if (typeof res === 'function') {
              res(null, {
                id: 'app-agent-id',
                etag: 'etag-id',
              });
            }
            return {} as SurfaceCall;
          },
        );
      return sdk.deleteApplicationAgentCredential('app-agent-credential-id');
    });

    it('sends correct request', () => {
      expect(deleteApplicationAgentCredentialSpy).toBeCalledWith(
        {
          id: 'app-agent-credential-id',
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
      const sdk = await ConfigClient.createInstance(userToken);
      jest
        .spyOn(sdk['client'], 'deleteApplicationAgentCredential')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((
                  err: ServiceError | null,
                  response?: DeleteApplicationAgentCredentialResponse,
                ) => void),
          ) => {
            if (typeof res === 'function') {
              res(error);
            }
            return {} as SurfaceCall;
          },
        );
      sdk.deleteApplicationAgentCredential('app-agent-credential-id').catch((err) => {
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
        .spyOn(sdk['client'], 'deleteApplicationAgentCredential')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((
                  err: ServiceError | null,
                  response?: DeleteApplicationAgentCredentialResponse,
                ) => void),
          ) => {
            if (typeof res === 'function') {
              res(null);
            }
            return {} as SurfaceCall;
          },
        );
      sdk.deleteApplicationAgentCredential('app-agent-credential-id').catch((err) => {
        thrownError = err;
      });
    });

    it('throws an error', () => {
      expect(thrownError.message).toBe('No application agent credential response');
    });
  });
});
