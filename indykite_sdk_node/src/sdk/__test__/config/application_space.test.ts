import { EventEmitter } from 'events';
import { CallOptions, Metadata } from '@grpc/grpc-js';
import { ClientReadableStream, ServiceError, SurfaceCall } from '@grpc/grpc-js/build/src/call';
import { Status } from '@grpc/grpc-js/build/src/constants';
import {
  CreateApplicationSpaceResponse,
  DeleteApplicationSpaceResponse,
  ListApplicationSpacesResponse,
  ReadApplicationSpaceResponse,
  UpdateApplicationSpaceResponse,
} from '../../../grpc/indykite/config/v1beta1/config_management_api';
import { ConfigClient } from '../../config';
import { ApplicationSpace } from '../../model/config/application_space';
import { SdkError, SdkErrorCode } from '../../error';
import { StringValue } from '../../../grpc/google/protobuf/wrappers';
import { Utils } from '../../utils/utils';
import { serviceAccountTokenMock } from '../../utils/test_utils';
import { AppSpaceIKGStatus } from '../../../grpc/indykite/config/v1beta1/model';

afterEach(() => {
  jest.restoreAllMocks();
});

describe('createApplicationSpace', () => {
  describe('when no error is returned', () => {
    let appSpace: ApplicationSpace;
    let createApplicationSpaceSpy: jest.SpyInstance;
    let sdk: ConfigClient;

    beforeEach(async () => {
      sdk = await ConfigClient.createInstance(JSON.stringify(serviceAccountTokenMock));
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
        appSpace = ApplicationSpace.deserialize(
          await sdk.createApplicationSpace(
            ConfigClient.newCreateApplicationSpaceRequest('customer-id', 'new-app-space'),
          ),
          'customer-id',
          'new-app-space',
        );
      });

      it('sends correct request', () => {
        expect(createApplicationSpaceSpy).toBeCalledWith(
          {
            customerId: 'customer-id',
            name: 'new-app-space',
            bookmarks: [],
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
        expect(appSpace.createTime?.toString()).toBe(
          new Date(Date.UTC(2022, 2, 15, 13, 12)).toString(),
        );
        expect(appSpace.updateTime?.toString()).toBe(
          new Date(Date.UTC(2022, 2, 15, 13, 13)).toString(),
        );
      });
    });

    describe('when all possible values are sent', () => {
      beforeEach(async () => {
        appSpace = ApplicationSpace.deserialize(
          await sdk.createApplicationSpace(
            ConfigClient.newCreateApplicationSpaceRequest(
              'customer-id',
              'new-app-space',
              'New App Space',
              'App space description',
            ),
          ),
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
            bookmarks: [],
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
        expect(appSpace.createTime?.toString()).toBe(
          new Date(Date.UTC(2022, 2, 15, 13, 12)).toString(),
        );
        expect(appSpace.updateTime?.toString()).toBe(
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
      const sdk = await ConfigClient.createInstance(JSON.stringify(serviceAccountTokenMock));
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
          ConfigClient.newCreateApplicationSpaceRequest(
            'customer-id',
            'new-app-space',
            'New App Space',
            'App space description',
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
      const sdk = await ConfigClient.createInstance(JSON.stringify(serviceAccountTokenMock));
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
          ConfigClient.newCreateApplicationSpaceRequest(
            'customer-id',
            'new-app-space',
            'New App Space',
            'App space description',
          ),
        )
        .catch((err) => {
          thrownError = err;
        });
    });

    it('throws an error', () => {
      expect(thrownError.message).toBe('No ApplicationSpace response.');
    });
  });
});

describe('readApplicationSpaceById', () => {
  describe('when no error is returned', () => {
    let appSpace: ApplicationSpace;
    let readApplicationSpaceSpy: jest.SpyInstance;

    beforeEach(async () => {
      const sdk = await ConfigClient.createInstance(JSON.stringify(serviceAccountTokenMock));
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
                  createdBy: 'Lorem ipsum - creator',
                  updatedBy: 'Lorem ipsum - updater',
                  createTime: Utils.dateToTimestamp(new Date(Date.UTC(2022, 2, 15, 13, 12))),
                  updateTime: Utils.dateToTimestamp(new Date(Date.UTC(2022, 2, 15, 13, 13))),
                  deleteTime: Utils.dateToTimestamp(new Date(Date.UTC(2022, 2, 15, 13, 14))),
                  destroyTime: Utils.dateToTimestamp(new Date(Date.UTC(2022, 2, 15, 13, 15))),
                  ikgStatus: AppSpaceIKGStatus.APP_SPACE_IKG_STATUS_STATUS_INVALID,
                },
              });
            }
            return {} as SurfaceCall;
          },
        );
      appSpace = ApplicationSpace.deserialize(
        await sdk.readApplicationSpace(
          ConfigClient.newReadApplicationSpaceRequest('id', 'app-space-id-request'),
        ),
      );
    });

    it('sends correct request', () => {
      expect(readApplicationSpaceSpy).toBeCalledWith(
        {
          identifier: {
            oneofKind: 'id',
            id: 'app-space-id-request',
          },
          bookmarks: [],
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
      expect(appSpace.createTime?.toString()).toBe(
        new Date(Date.UTC(2022, 2, 15, 13, 12)).toString(),
      );
      expect(appSpace.updateTime?.toString()).toBe(
        new Date(Date.UTC(2022, 2, 15, 13, 13)).toString(),
      );
      expect(appSpace.deleteTime?.toString()).toBe(
        new Date(Date.UTC(2022, 2, 15, 13, 14)).toString(),
      );
      expect(appSpace.destroyTime?.toString()).toBe(
        new Date(Date.UTC(2022, 2, 15, 13, 15)).toString(),
      );
      expect(appSpace.ikgStatus).toBe(AppSpaceIKGStatus.APP_SPACE_IKG_STATUS_STATUS_INVALID);
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
        .readApplicationSpace(
          ConfigClient.newReadApplicationSpaceRequest('id', 'app-space-id-request'),
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
      const sdk = await ConfigClient.createInstance(JSON.stringify(serviceAccountTokenMock));
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
        .readApplicationSpace(
          ConfigClient.newReadApplicationSpaceRequest('name', 'app-space-id-request'),
        )
        .catch((err) => {
          thrownError = err;
        });
    });

    it('throws an error', () => {
      expect(thrownError.message).toBe('No ApplicationSpace response.');
    });
  });
});

describe('readApplicationSpaceByName', () => {
  describe('when no error is returned', () => {
    let appSpace: ApplicationSpace;
    let readApplicationSpaceSpy: jest.SpyInstance;

    beforeEach(async () => {
      const sdk = await ConfigClient.createInstance(JSON.stringify(serviceAccountTokenMock));
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
                  createdBy: 'Lorem ipsum - creator',
                  updatedBy: 'Lorem ipsum - updater',
                  createTime: Utils.dateToTimestamp(new Date(Date.UTC(2022, 2, 15, 13, 12))),
                  updateTime: Utils.dateToTimestamp(new Date(Date.UTC(2022, 2, 15, 13, 13))),
                  deleteTime: Utils.dateToTimestamp(new Date(Date.UTC(2022, 2, 15, 13, 14))),
                  destroyTime: Utils.dateToTimestamp(new Date(Date.UTC(2022, 2, 15, 13, 15))),
                  ikgStatus: AppSpaceIKGStatus.APP_SPACE_IKG_STATUS_STATUS_INVALID,
                },
              });
            }
            return {} as SurfaceCall;
          },
        );
      appSpace = ApplicationSpace.deserialize(
        await sdk.readApplicationSpace(
          ConfigClient.newReadApplicationRequest(
            'name',
            'customer-id-request',
            'app-space-name-request',
          ),
        ),
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
          bookmarks: [],
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
      expect(appSpace.createTime?.toString()).toBe(
        new Date(Date.UTC(2022, 2, 15, 13, 12)).toString(),
      );
      expect(appSpace.updateTime?.toString()).toBe(
        new Date(Date.UTC(2022, 2, 15, 13, 13)).toString(),
      );
      expect(appSpace.deleteTime?.toString()).toBe(
        new Date(Date.UTC(2022, 2, 15, 13, 14)).toString(),
      );
      expect(appSpace.destroyTime?.toString()).toBe(
        new Date(Date.UTC(2022, 2, 15, 13, 15)).toString(),
      );
      expect(appSpace.ikgStatus).toBe(AppSpaceIKGStatus.APP_SPACE_IKG_STATUS_STATUS_INVALID);
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
        .readApplicationSpace(
          ConfigClient.newReadApplicationRequest(
            'name',
            'customer-id-request',
            'app-space-name-request',
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
      const sdk = await ConfigClient.createInstance(JSON.stringify(serviceAccountTokenMock));
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
        .readApplicationSpace(
          ConfigClient.newReadApplicationRequest(
            'name',
            'customer-id-request',
            'app-space-name-request',
          ),
        )
        .catch((err) => {
          thrownError = err;
        });
    });

    it('throws an error', () => {
      expect(thrownError.message).toBe('No ApplicationSpace response.');
    });
  });
});

describe('listApplicationSpaces', () => {
  let appSpaces: ApplicationSpace[] = [];
  let listApplicationSpacesSpy: jest.SpyInstance;

  describe('when no error is returned', () => {
    beforeEach(async () => {
      const sdk = await ConfigClient.createInstance(JSON.stringify(serviceAccountTokenMock));
      const eventEmitter = Object.assign(new EventEmitter(), {
        read: () => {
          return {
            appSpace: {
              id: 'app-space-id',
              customerId: 'customer-id',
              name: 'app-space-name',
              description: StringValue.create({ value: 'App space description' }),
              displayName: 'App Space Name',
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
      listApplicationSpacesSpy = jest
        .spyOn(sdk['client'], 'listApplicationSpaces')
        .mockImplementation(() => {
          setTimeout(() => eventEmitter.emit('readable'), 0);
          setTimeout(() => eventEmitter.emit('readable'), 0);
          setTimeout(() => eventEmitter.emit('end'), 0);
          setTimeout(() => eventEmitter.emit('close'), 1);
          return eventEmitter as unknown as ClientReadableStream<ListApplicationSpacesResponse>;
        });
      appSpaces = await new Promise((resolve, reject) => {
        const tmp: ApplicationSpace[] = [];
        sdk
          .listApplicationSpaces(
            ConfigClient.newListApplicationSpacesRequest('customer-id-request', ['app-space-name']),
          )
          .on('error', (err) => {
            reject(err);
          })
          .on('data', (data) => {
            if (data && data.appSpace) {
              tmp.push(ApplicationSpace.deserialize(data));
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
      expect(listApplicationSpacesSpy).toBeCalledWith({
        customerId: 'customer-id-request',
        match: ['app-space-name'],
        bookmarks: [],
      });
    });

    it('returns correct data', async () => {
      expect(appSpaces.length).toBe(2);
      expect(appSpaces[0].id).toBe('app-space-id');
      expect(appSpaces[0].customerId).toBe('customer-id');
      expect(appSpaces[0].name).toBe('app-space-name');
      expect(appSpaces[0].description).toBe('App space description');
      expect(appSpaces[0].displayName).toBe('App Space Name');
      expect(appSpaces[0].etag).toBe('5432');
      expect(appSpaces[0].issuerId).toBe('issuer-id');
      expect(appSpaces[0].createTime?.toString()).toBe(
        new Date(Date.UTC(2022, 2, 15, 13, 12)).toString(),
      );
      expect(appSpaces[0].updateTime?.toString()).toBe(
        new Date(Date.UTC(2022, 2, 15, 13, 13)).toString(),
      );
      expect(appSpaces[0].deleteTime?.toString()).toBe(
        new Date(Date.UTC(2022, 2, 15, 13, 14)).toString(),
      );
      expect(appSpaces[0].destroyTime?.toString()).toBe(
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
    let sdk: ConfigClient;

    beforeEach(async () => {
      sdk = await ConfigClient.createInstance(JSON.stringify(serviceAccountTokenMock));
      const eventEmitter = Object.assign(new EventEmitter(), { read: jest.fn() });
      jest.spyOn(sdk['client'], 'listApplicationSpaces').mockImplementation(() => {
        setTimeout(() => eventEmitter.emit('error', error), 0);
        return eventEmitter as unknown as ClientReadableStream<ListApplicationSpacesResponse>;
      });
      result = await new Promise((resolve, reject) => {
        sdk
          .listApplicationSpaces(
            ConfigClient.newListApplicationSpacesRequest('customer-id-request', ['app-space-name']),
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
    let sdk: ConfigClient;

    beforeEach(async () => {
      sdk = await ConfigClient.createInstance(JSON.stringify(serviceAccountTokenMock));
      const eventEmitter = Object.assign(new EventEmitter(), { read: jest.fn() });
      jest.spyOn(sdk['client'], 'listApplicationSpaces').mockImplementation(() => {
        setTimeout(() => eventEmitter.emit('close'), 0);
        return eventEmitter as unknown as ClientReadableStream<ListApplicationSpacesResponse>;
      });
    });

    it('close has been triggered', () => {
      sdk
        .listApplicationSpaces(
          ConfigClient.newListApplicationSpacesRequest('customer-id-request', ['app-space-name']),
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

describe('updateApplicationSpace', () => {
  describe('when no error is returned', () => {
    let updatedAppSpace: UpdateApplicationSpaceResponse;
    let updateApplicationSpaceSpy: jest.SpyInstance;
    let sdk: ConfigClient;

    beforeEach(async () => {
      sdk = await ConfigClient.createInstance(JSON.stringify(serviceAccountTokenMock));
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
        const appSpace = new ApplicationSpace('app-space-id', 'app-space', 'customer-id');
        updatedAppSpace = await sdk.updateApplicationSpace(
          ConfigClient.newUpdateApplicationSpaceRequest(appSpace),
        );
      });

      it('sends correct request', () => {
        expect(updateApplicationSpaceSpy).toBeCalledWith(
          {
            id: 'app-space-id',
            bookmarks: [],
          },
          expect.any(Function),
        );
      });

      it('returns a correct instance', () => {
        expect(updatedAppSpace.id).toBe('app-space-id');
        expect(updatedAppSpace.createTime).toBeUndefined();
        expect(updatedAppSpace.createdBy).toBe('Lorem ipsum - creator');
        expect(updatedAppSpace.updateTime?.toString()).toBe(
          Utils.dateToTimestamp(new Date(Date.UTC(2022, 2, 15, 13, 16))).toString(),
        );
        expect(updatedAppSpace.updatedBy).toBe('Lorem ipsum - updater');
        expect(updatedAppSpace.etag).toBe('777');
        expect(updatedAppSpace.bookmark).toBe('bookmark-token');
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
        updatedAppSpace = await sdk.updateApplicationSpace(
          ConfigClient.newUpdateApplicationSpaceRequest(appSpace),
        );
      });

      it('sends correct request', () => {
        expect(updateApplicationSpaceSpy).toBeCalledWith(
          {
            id: 'app-space-id',
            etag: { value: '555' },
            displayName: { value: 'App Space' },
            description: { value: 'Description' },
            bookmarks: [],
          },
          expect.any(Function),
        );
      });

      it('returns a correct instance', () => {
        expect(updatedAppSpace.id).toBe('app-space-id');
        expect(updatedAppSpace.createTime).toBeUndefined();
        expect(updatedAppSpace.createdBy).toBe('Lorem ipsum - creator');
        expect(updatedAppSpace.updateTime?.toString()).toBe(
          Utils.dateToTimestamp(new Date(Date.UTC(2022, 2, 15, 13, 16))).toString(),
        );
        expect(updatedAppSpace.updatedBy).toBe('Lorem ipsum - updater');
        expect(updatedAppSpace.etag).toBe('777');
        expect(updatedAppSpace.bookmark).toBe('bookmark-token');
      });
    });
  });

  describe('when a different app space is returned', () => {
    let thrownError: SdkError;

    beforeEach(async () => {
      const sdk = await ConfigClient.createInstance(JSON.stringify(serviceAccountTokenMock));
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
                updateTime: Utils.dateToTimestamp(new Date(Date.UTC(2022, 2, 15, 13, 16))),
                bookmark: 'bookmark-token',
                createdBy: 'Lorem ipsum - creator',
                updatedBy: 'Lorem ipsum - updater',
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
      return sdk
        .updateApplicationSpace(ConfigClient.newUpdateApplicationSpaceRequest(appSpace))
        .catch((err) => (thrownError = err));
    });

    it('throws an error', () => {
      expect(thrownError.code).toEqual(SdkErrorCode.SDK_CODE_4);
      expect(thrownError.description).toBe(
        'Update returned with different id: request.id=app-space-id, response.id=different-app-space-id.',
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
      sdk
        .updateApplicationSpace(ConfigClient.newUpdateApplicationSpaceRequest(appSpace))
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
      sdk
        .updateApplicationSpace(ConfigClient.newUpdateApplicationSpaceRequest(appSpace))
        .catch((err) => {
          thrownError = err;
        });
    });

    it('throws an error', () => {
      expect(thrownError.message).toBe(
        'Update returned with different id: request.id=app-space-id, response.id=undefined.',
      );
    });
  });
});

describe('deleteApplicationSpace', () => {
  describe('when no error is returned', () => {
    let returnedValue: DeleteApplicationSpaceResponse;
    let deleteApplicationSpaceSpy: jest.SpyInstance;

    beforeEach(async () => {
      const sdk = await ConfigClient.createInstance(JSON.stringify(serviceAccountTokenMock));
      deleteApplicationSpaceSpy = jest
        .spyOn(sdk['client'], 'deleteApplicationSpace')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response?: DeleteApplicationSpaceResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(null, { bookmark: 'bookmark-token' });
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
      returnedValue = await sdk.deleteApplicationSpace(
        ConfigClient.newDeleteApplicationSpaceRequest(appSpace),
      );
    });

    it('sends correct request', () => {
      expect(deleteApplicationSpaceSpy).toBeCalledWith(
        {
          id: 'app-space-id',
          etag: { value: '555' },
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
      const sdk = await ConfigClient.createInstance(JSON.stringify(serviceAccountTokenMock));
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
      sdk
        .deleteApplicationSpace(ConfigClient.newDeleteApplicationSpaceRequest(appSpace))
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
      const sdk = await ConfigClient.createInstance(JSON.stringify(serviceAccountTokenMock));
      jest
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
      sdk
        .deleteApplicationSpace(ConfigClient.newDeleteApplicationSpaceRequest(appSpace))
        .catch((err) => {
          thrownError = err;
        });
    });

    it('throws an error', () => {
      expect(thrownError.code).toEqual(SdkErrorCode.SDK_CODE_3);
      expect(thrownError.description).toBe('No ApplicationSpace response.');
    });
  });
});
