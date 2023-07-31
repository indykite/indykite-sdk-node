import { EventEmitter } from 'events';
import { CallOptions, Metadata } from '@grpc/grpc-js';
import { ClientReadableStream, ServiceError, SurfaceCall } from '@grpc/grpc-js/build/src/call';
import { Status } from '@grpc/grpc-js/build/src/constants';
import {
  CreateApplicationResponse,
  DeleteApplicationResponse,
  ListApplicationsResponse,
  ReadApplicationResponse,
  UpdateApplicationResponse,
} from '../../../grpc/indykite/config/v1beta1/config_management_api';
import { ConfigClientV2 } from '../../config_v2';
import { SdkError, SdkErrorCode } from '../../error';
import { StringValue } from '../../../grpc/google/protobuf/wrappers';
import { Utils } from '../../utils/utils';
import { Application } from '../../model/config/application';
import { serviceAccountTokenMock } from '../../utils/test_utils';

afterEach(() => {
  jest.restoreAllMocks();
});

describe('createApplication', () => {
  describe('when no error is returned', () => {
    let application: CreateApplicationResponse;
    let createApplicationSpy: jest.SpyInstance;
    let sdk: ConfigClientV2;

    beforeEach(async () => {
      sdk = await ConfigClientV2.createInstance(JSON.stringify(serviceAccountTokenMock));
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
        application = await sdk.createApplication(
          ConfigClientV2.newCreateApplicationRequest('app-space-id', 'application-name'),
        );
      });

      it('sends correct request', () => {
        expect(createApplicationSpy).toBeCalledWith(
          {
            appSpaceId: 'app-space-id',
            name: 'application-name',
            bookmarks: [],
          },
          expect.any(Function),
        );
      });

      it('returns a correct instance', () => {
        expect(application.id).toBe('new-application-id');
        expect(application.createTime).toBeUndefined();
        expect(application.createdBy).toBe('Lorem ipsum - creator');
        expect(application.updateTime).toBeUndefined();
        expect(application.updatedBy).toBe('Lorem ipsum - updater');
        expect(application.etag).toBe('111');
        expect(application.bookmark).toBe('bookmark-token');
      });
    });

    describe('when all possible values are sent', () => {
      beforeEach(async () => {
        application = await sdk.createApplication(
          ConfigClientV2.newCreateApplicationRequest(
            'app-space-id',
            'application-name',
            'My Application',
            'Application description',
          ),
        );
      });

      it('sends correct request', () => {
        expect(createApplicationSpy).toBeCalledWith(
          {
            appSpaceId: 'app-space-id',
            name: 'application-name',
            displayName: StringValue.create({ value: 'My Application' }),
            description: StringValue.create({ value: 'Application description' }),
            bookmarks: [],
          },
          expect.any(Function),
        );
      });

      it('returns a correct instance', () => {
        expect(application.id).toBe('new-application-id');
        expect(application.createTime).toBeUndefined();
        expect(application.createdBy).toBe('Lorem ipsum - creator');
        expect(application.updateTime).toBeUndefined();
        expect(application.updatedBy).toBe('Lorem ipsum - updater');
        expect(application.etag).toBe('111');
        expect(application.bookmark).toBe('bookmark-token');
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
          ConfigClientV2.newCreateApplicationRequest(
            'app-space-id',
            'application-name',
            'My Application',
            'Application description',
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
          ConfigClientV2.newCreateApplicationRequest(
            'app-space-id',
            'application-name',
            'My Application',
            'Application description',
          ),
        )
        .catch((err) => {
          thrownError = err;
        });
    });

    it('throws an error', () => {
      expect(thrownError.message).toBe('No Application response.');
    });
  });
});

describe('readApplicationById', () => {
  describe('when no error is returned', () => {
    let application: Application;
    let readApplicationSpy: jest.SpyInstance;

    beforeEach(async () => {
      const sdk = await ConfigClientV2.createInstance(JSON.stringify(serviceAccountTokenMock));
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
                  createdBy: 'Lorem ipsum - creator',
                  updatedBy: 'Lorem ipsum - updater',
                  createTime: Utils.dateToTimestamp(new Date(Date.UTC(2022, 2, 15, 13, 12))),
                  updateTime: Utils.dateToTimestamp(new Date(Date.UTC(2022, 2, 15, 13, 13))),
                  deleteTime: Utils.dateToTimestamp(new Date(Date.UTC(2022, 2, 15, 13, 14))),
                  destroyTime: Utils.dateToTimestamp(new Date(Date.UTC(2022, 2, 15, 13, 15))),
                },
              });
            }
            return {} as SurfaceCall;
          },
        );
      application = Application.deserialize(
        await sdk.readApplication(
          ConfigClientV2.newReadApplicationRequest('id', 'application-id-request'),
        ),
      );
    });

    it('sends correct request', () => {
      expect(readApplicationSpy).toBeCalledWith(
        {
          identifier: {
            oneofKind: 'id',
            id: 'application-id-request',
          },
          bookmarks: [],
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
      expect(application.createTime?.toString()).toBe(
        new Date(Date.UTC(2022, 2, 15, 13, 12)).toString(),
      );
      expect(application.updateTime?.toString()).toBe(
        new Date(Date.UTC(2022, 2, 15, 13, 13)).toString(),
      );
      expect(application.deleteTime?.toString()).toBe(
        new Date(Date.UTC(2022, 2, 15, 13, 14)).toString(),
      );
      expect(application.destroyTime?.toString()).toBe(
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
      sdk
        .readApplication(ConfigClientV2.newReadApplicationRequest('id', 'application-id-request'))
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
      sdk
        .readApplication(ConfigClientV2.newReadApplicationRequest('id', 'application-id-request'))
        .catch((err) => {
          thrownError = err;
        });
    });

    it('throws an error', () => {
      expect(thrownError.message).toBe('No Application response.');
    });
  });
});

describe('readApplicationByName', () => {
  describe('when no error is returned', () => {
    let application: Application;
    let readApplicationSpy: jest.SpyInstance;

    beforeEach(async () => {
      const sdk = await ConfigClientV2.createInstance(JSON.stringify(serviceAccountTokenMock));
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
                  createdBy: 'Lorem ipsum - creator',
                  updatedBy: 'Lorem ipsum - updater',
                  createTime: Utils.dateToTimestamp(new Date(Date.UTC(2022, 2, 15, 13, 12))),
                  updateTime: Utils.dateToTimestamp(new Date(Date.UTC(2022, 2, 15, 13, 13))),
                  deleteTime: Utils.dateToTimestamp(new Date(Date.UTC(2022, 2, 15, 13, 14))),
                  destroyTime: Utils.dateToTimestamp(new Date(Date.UTC(2022, 2, 15, 13, 15))),
                },
              });
            }
            return {} as SurfaceCall;
          },
        );
      application = Application.deserialize(
        await sdk.readApplication(
          ConfigClientV2.newReadApplicationRequest(
            'name',
            'app-space-id-request',
            'application-name-request',
          ),
        ),
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
          bookmarks: [],
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
      expect(application.createTime?.toString()).toBe(
        new Date(Date.UTC(2022, 2, 15, 13, 12)).toString(),
      );
      expect(application.updateTime?.toString()).toBe(
        new Date(Date.UTC(2022, 2, 15, 13, 13)).toString(),
      );
      expect(application.deleteTime?.toString()).toBe(
        new Date(Date.UTC(2022, 2, 15, 13, 14)).toString(),
      );
      expect(application.destroyTime?.toString()).toBe(
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
      sdk
        .readApplication(
          ConfigClientV2.newReadApplicationRequest(
            'name',
            'app-space-id-request',
            'application-name-request',
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
      sdk
        .readApplication(
          ConfigClientV2.newReadApplicationRequest(
            'name',
            'app-space-id-request',
            'application-name-request',
          ),
        )
        .catch((err) => {
          thrownError = err;
        });
    });

    it('throws an error', () => {
      expect(thrownError.message).toBe('No Application response.');
    });
  });
});

describe('listApplications', () => {
  let applications: Application[] = [];
  let listApplicationsSpy: jest.SpyInstance;

  describe('when no error is returned', () => {
    beforeEach(async () => {
      const sdk = await ConfigClientV2.createInstance(JSON.stringify(serviceAccountTokenMock));
      const eventEmitter = Object.assign(new EventEmitter(), {
        read: () => {
          return {
            application: {
              id: 'application-id',
              appSpaceId: 'app-space-id',
              customerId: 'customer-id',
              name: 'application-name',
              description: StringValue.create({ value: 'Application description' }),
              displayName: 'Application Name',
              etag: '5432',
              createTime: Utils.dateToTimestamp(new Date(Date.UTC(2022, 2, 15, 13, 12))),
              updateTime: Utils.dateToTimestamp(new Date(Date.UTC(2022, 2, 15, 13, 13))),
              deleteTime: Utils.dateToTimestamp(new Date(Date.UTC(2022, 2, 15, 13, 14))),
              destroyTime: Utils.dateToTimestamp(new Date(Date.UTC(2022, 2, 15, 13, 15))),
            },
          };
        },
      });
      listApplicationsSpy = jest.spyOn(sdk['client'], 'listApplications').mockImplementation(() => {
        setTimeout(() => eventEmitter.emit('readable'), 0);
        setTimeout(() => eventEmitter.emit('readable'), 0);
        setTimeout(() => eventEmitter.emit('end'), 1);
        setTimeout(() => eventEmitter.emit('close'), 1);
        return eventEmitter as unknown as ClientReadableStream<ListApplicationsResponse>;
      });
      applications = await new Promise((resolve, reject) => {
        const tmp: Application[] = [];
        sdk
          .listApplications(
            ConfigClientV2.newListApplicationsRequest('app-space-id-request', ['application-name']),
          )
          .on('error', (err) => {
            reject(err);
          })
          .on('data', (data) => {
            if (data && data.application) {
              tmp.push(Application.deserialize(data));
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
      expect(listApplicationsSpy).toBeCalledWith({
        appSpaceId: 'app-space-id-request',
        match: ['application-name'],
        bookmarks: [],
      });
    });
    it('returns correct data', async () => {
      expect(applications.length).toBe(2);
      expect(applications[0].id).toBe('application-id');
      expect(applications[0].appSpaceId).toBe('app-space-id');
      expect(applications[0].customerId).toBe('customer-id');
      expect(applications[0].name).toBe('application-name');
      expect(applications[0].description).toBe('Application description');
      expect(applications[0].displayName).toBe('Application Name');
      expect(applications[0].etag).toBe('5432');
      expect(applications[0].createTime?.toString()).toBe(
        new Date(Date.UTC(2022, 2, 15, 13, 12)).toString(),
      );
      expect(applications[0].updateTime?.toString()).toBe(
        new Date(Date.UTC(2022, 2, 15, 13, 13)).toString(),
      );
      expect(applications[0].deleteTime?.toString()).toBe(
        new Date(Date.UTC(2022, 2, 15, 13, 14)).toString(),
      );
      expect(applications[0].destroyTime?.toString()).toBe(
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
      jest.spyOn(sdk['client'], 'listApplications').mockImplementation(() => {
        setTimeout(() => eventEmitter.emit('error', error), 0);
        return eventEmitter as unknown as ClientReadableStream<ListApplicationsResponse>;
      });
      result = await new Promise((resolve, reject) => {
        sdk
          .listApplications(
            ConfigClientV2.newListApplicationsRequest('app-space-id-request', ['application-name']),
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
      jest.spyOn(sdk['client'], 'listApplications').mockImplementation(() => {
        setTimeout(() => eventEmitter.emit('close'), 0);
        return eventEmitter as unknown as ClientReadableStream<ListApplicationsResponse>;
      });
    });

    it('close has been triggered', () => {
      sdk
        .listApplications(
          ConfigClientV2.newListApplicationsRequest('app-space-id-request', ['application-name']),
        )
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

describe('updateApplication', () => {
  describe('when no error is returned', () => {
    let updatedApplication: UpdateApplicationResponse;
    let updateApplicationSpy: jest.SpyInstance;
    let sdk: ConfigClientV2;

    beforeEach(async () => {
      sdk = await ConfigClientV2.createInstance(JSON.stringify(serviceAccountTokenMock));
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
        const application = new Application(
          'application-id',
          'application',
          'app-space-id',
          'customer-id',
        );
        updatedApplication = await sdk.updateApplication(
          ConfigClientV2.newUpdateApplicationRequest(application),
        );
      });

      it('sends correct request', () => {
        expect(updateApplicationSpy).toBeCalledWith(
          {
            id: 'application-id',
            bookmarks: [],
          },
          expect.any(Function),
        );
      });

      it('returns a correct instance', () => {
        expect(updatedApplication.id).toBe('application-id');
        expect(updatedApplication.createTime).toBeUndefined();
        expect(updatedApplication.createdBy).toBe('Lorem ipsum - creator');
        expect(updatedApplication.updateTime?.toString()).toBe(
          Utils.dateToTimestamp(new Date(Date.UTC(2022, 2, 15, 13, 16))).toString(),
        );
        expect(updatedApplication.updatedBy).toBe('Lorem ipsum - updater');
        expect(updatedApplication.etag).toBe('777');
        expect(updatedApplication.bookmark).toBe('bookmark-token');
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
        updatedApplication = await sdk.updateApplication(
          ConfigClientV2.newUpdateApplicationRequest(application),
        );
      });

      it('sends correct request', () => {
        expect(updateApplicationSpy).toBeCalledWith(
          {
            id: 'application-id',
            etag: { value: '555' },
            displayName: { value: 'Application Name' },
            description: { value: 'Description' },
            bookmarks: [],
          },
          expect.any(Function),
        );
      });

      it('returns a correct instance', () => {
        expect(updatedApplication.id).toBe('application-id');
        expect(updatedApplication.createTime).toBeUndefined();
        expect(updatedApplication.createdBy).toBe('Lorem ipsum - creator');
        expect(updatedApplication.updateTime?.toString()).toBe(
          Utils.dateToTimestamp(new Date(Date.UTC(2022, 2, 15, 13, 16))).toString(),
        );
        expect(updatedApplication.updatedBy).toBe('Lorem ipsum - updater');
        expect(updatedApplication.etag).toBe('777');
        expect(updatedApplication.bookmark).toBe('bookmark-token');
      });
    });
  });

  describe('when a different application is returned', () => {
    let thrownError: SdkError;

    beforeEach(async () => {
      const sdk = await ConfigClientV2.createInstance(JSON.stringify(serviceAccountTokenMock));
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
                updateTime: Utils.dateToTimestamp(new Date(Date.UTC(2022, 2, 15, 13, 16))),
                bookmark: 'bookmark-token',
                createdBy: 'Lorem ipsum - creator',
                updatedBy: 'Lorem ipsum - updater',
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
      return sdk
        .updateApplication(ConfigClientV2.newUpdateApplicationRequest(application))
        .catch((err) => (thrownError = err));
    });

    it('throws an error', () => {
      expect(thrownError.code).toEqual(SdkErrorCode.SDK_CODE_4);
      expect(thrownError.description).toBe(
        'Update returned with different id: request.id=application-id, response.id=different-application-id.',
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
      sdk
        .updateApplication(ConfigClientV2.newUpdateApplicationRequest(application))
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
      sdk
        .updateApplication(ConfigClientV2.newUpdateApplicationRequest(application))
        .catch((err) => {
          thrownError = err;
        });
    });

    it('throws an error', () => {
      expect(thrownError.message).toBe(
        'Update returned with different id: request.id=application-id, response.id=undefined.',
      );
    });
  });
});

describe('deleteApplication', () => {
  describe('when no error is returned', () => {
    let returnedValue: DeleteApplicationResponse;
    let deleteApplicationSpy: jest.SpyInstance;

    beforeEach(async () => {
      const sdk = await ConfigClientV2.createInstance(JSON.stringify(serviceAccountTokenMock));
      deleteApplicationSpy = jest
        .spyOn(sdk['client'], 'deleteApplication')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response?: DeleteApplicationResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(null, { bookmark: 'bookmark-token' });
            }
            return {} as SurfaceCall;
          },
        );
      const application = new Application(
        'application-id',
        'application-name',
        'app-space-id',
        'customer-id',
        'Application',
        'etag-token',
      );
      returnedValue = await sdk.deleteApplication(
        ConfigClientV2.newDeleteApplicationRequest(application),
      );
    });

    it('sends correct request', () => {
      expect(deleteApplicationSpy).toBeCalledWith(
        {
          id: 'application-id',
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
        .spyOn(sdk['client'], 'deleteApplication')
        .mockImplementation(
          (req, res: Metadata | CallOptions | ((err: ServiceError | null) => void)) => {
            if (typeof res === 'function') {
              res(error);
            }
            return {} as SurfaceCall;
          },
        );
      const application = new Application(
        'application-id',
        'application-name',
        'app-space-id',
        'customer-id',
        'Application',
        'etag-token',
      );
      sdk
        .deleteApplication(ConfigClientV2.newDeleteApplicationRequest(application))
        .catch((err) => {
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
        .spyOn(sdk['client'], 'deleteApplication')
        .mockImplementation(
          (req, res: Metadata | CallOptions | ((err: ServiceError | null) => void)) => {
            if (typeof res === 'function') {
              res(null);
            }
            return {} as SurfaceCall;
          },
        );
      const application = new Application(
        'application-id',
        'application-name',
        'app-space-id',
        'customer-id',
        'Application',
        'etag-token',
      );
      sdk
        .deleteApplication(ConfigClientV2.newDeleteApplicationRequest(application))
        .catch((err) => {
          thrownError = err;
        });
    });

    it('throws an error', () => {
      expect(thrownError.code).toEqual(SdkErrorCode.SDK_CODE_3);
      expect(thrownError.description).toBe('No Application response.');
    });
  });
});
