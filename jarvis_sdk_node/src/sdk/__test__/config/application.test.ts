import { EventEmitter } from 'events';
import { CallOptions, Metadata } from '@grpc/grpc-js';
import { ClientReadableStream, ServiceError, SurfaceCall } from '@grpc/grpc-js/build/src/call';
import { Status } from '@grpc/grpc-js/build/src/constants';
import {
  CreateApplicationResponse,
  ListApplicationsResponse,
  ReadApplicationResponse,
  UpdateApplicationResponse,
} from '../../../grpc/indykite/config/v1beta1/config_management_api';
import { ConfigClient } from '../../config';
import { SdkError, SdkErrorCode } from '../../error';
import { StringValue } from '../../../grpc/google/protobuf/wrappers';
import { Utils } from '../../utils/utils';
import { Application } from '../../model/config/application';

const userToken = 'user-token';

afterEach(() => {
  jest.restoreAllMocks();
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
