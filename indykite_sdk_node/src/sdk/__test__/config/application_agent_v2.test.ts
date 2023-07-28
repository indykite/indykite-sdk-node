import { EventEmitter } from 'events';
import { CallOptions, Metadata } from '@grpc/grpc-js';
import { ClientReadableStream, ServiceError, SurfaceCall } from '@grpc/grpc-js/build/src/call';
import { Status } from '@grpc/grpc-js/build/src/constants';
import {
  CreateApplicationAgentResponse,
  CreateApplicationResponse,
  DeleteApplicationAgentResponse,
  ListApplicationAgentsResponse,
  ReadApplicationAgentRequest,
  ReadApplicationAgentResponse,
  UpdateApplicationAgentResponse,
} from '../../../grpc/indykite/config/v1beta1/config_management_api';
import { ConfigClientV2 } from '../../config_v2';
import { SdkError, SdkErrorCode } from '../../error';
import { StringValue } from '../../../grpc/google/protobuf/wrappers';
import { Utils } from '../../utils/utils';
import { ApplicationAgent } from '../../model/config/application_agent';
import { serviceAccountTokenMock } from '../../utils/test_utils';

afterEach(() => {
  jest.restoreAllMocks();
});

describe('ApplicationAgent', () => {
  describe('newReadApplicationAgentRequest with empty config is returned', () => {
    const response: ReadApplicationAgentRequest = ConfigClientV2.newReadApplicationAgentRequest(
      'name', //kind
      'app-space-id',
      'app-agent-name',
    );
    expect(response.identifier?.oneofKind).toBe('name');
    expect(response.identifier).toHaveProperty('name');
    if (response.identifier?.oneofKind === 'name') {
      expect(response.identifier?.name?.name).toBe('app-agent-name');
      expect(response.identifier?.name?.location).toBe('app-space-id');
    }
  });
});

describe('createApplicationAgent', () => {
  describe('when no error is returned', () => {
    let applicationAgent: CreateApplicationAgentResponse;
    let createApplicationAgentSpy: jest.SpyInstance;
    let sdk: ConfigClientV2;

    beforeEach(async () => {
      sdk = await ConfigClientV2.createInstance(JSON.stringify(serviceAccountTokenMock));
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
                bookmark: 'bookmark-token',
                createdBy: 'Lorem ipsum - creator',
                updatedBy: 'Lorem ipsum - updater',
                createTime: Utils.dateToTimestamp(new Date(Date.UTC(2022, 2, 15, 13, 12))),
                updateTime: Utils.dateToTimestamp(new Date(Date.UTC(2022, 2, 15, 13, 13))),
              });
            }
            return {} as SurfaceCall;
          },
        );
    });

    describe('when necessary values are sent only', () => {
      beforeEach(async () => {
        applicationAgent = await sdk.createApplicationAgent(
          ConfigClientV2.newCreateApplicationAgentRequest('application-id', 'app-agent-name'),
        );
      });

      it('sends correct request', () => {
        expect(createApplicationAgentSpy).toBeCalledWith(
          {
            applicationId: 'application-id',
            name: 'app-agent-name',
            bookmarks: [],
          },
          expect.any(Function),
        );
      });

      it('returns a correct instance', () => {
        expect(applicationAgent.id).toBe('new-app-agent-id');
        expect(applicationAgent.createTime?.toString()).toBe(
          Utils.dateToTimestamp(new Date(Date.UTC(2022, 2, 15, 13, 12))).toString(),
        );
        expect(applicationAgent.createdBy).toBe('Lorem ipsum - creator');
        expect(applicationAgent.updateTime?.toString()).toBe(
          Utils.dateToTimestamp(new Date(Date.UTC(2022, 2, 15, 13, 13))).toString(),
        );
        expect(applicationAgent.updatedBy).toBe('Lorem ipsum - updater');
        expect(applicationAgent.etag).toBe('111');
      });
    });

    describe('when all possible values are sent', () => {
      beforeEach(async () => {
        applicationAgent = await sdk.createApplicationAgent(
          ConfigClientV2.newCreateApplicationAgentRequest(
            'application-id',
            'app-agent-name',
            'My Application Agent',
            'Application Agent description',
          ),
        );
      });

      it('sends correct request', () => {
        expect(createApplicationAgentSpy).toBeCalledWith(
          {
            applicationId: 'application-id',
            name: 'app-agent-name',
            displayName: StringValue.create({ value: 'My Application Agent' }),
            description: StringValue.create({ value: 'Application Agent description' }),
            bookmarks: [],
          },
          expect.any(Function),
        );
      });

      it('returns a correct instance', () => {
        expect(applicationAgent.id).toBe('new-app-agent-id');
        expect(applicationAgent.createTime?.toString()).toBe(
          Utils.dateToTimestamp(new Date(Date.UTC(2022, 2, 15, 13, 12))).toString(),
        );
        expect(applicationAgent.createdBy).toBe('Lorem ipsum - creator');
        expect(applicationAgent.updateTime?.toString()).toBe(
          Utils.dateToTimestamp(new Date(Date.UTC(2022, 2, 15, 13, 12))).toString(),
        );
        expect(applicationAgent.updatedBy).toBe('Lorem ipsum - updater');
        expect(applicationAgent.etag).toBe('111');
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
          ConfigClientV2.newCreateApplicationAgentRequest(
            'application-id',
            'app-agent-name',
            'My Application Agent',
            'Application Agent description',
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
          ConfigClientV2.newCreateApplicationAgentRequest(
            'application-id',
            'app-agent-name',
            'My Application Agent',
            'Application Agent description',
          ),
        )
        .catch((err) => {
          thrownError = err;
        });
    });

    it('throws an error', () => {
      expect(thrownError.message).toBe('No ApplicationAgent response.');
    });
  });
});

describe('readApplicationAgentById', () => {
  describe('when no error is returned', () => {
    let applicationAgent: ApplicationAgent;
    let readApplicationAgentSpy: jest.SpyInstance;

    beforeEach(async () => {
      const sdk = await ConfigClientV2.createInstance(JSON.stringify(serviceAccountTokenMock));
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
      applicationAgent = ApplicationAgent.deserialize(
        await sdk.readApplicationAgent(
          ConfigClientV2.newReadApplicationAgentRequest('id', 'app-agent-id-request'),
        ),
      );
    });

    it('sends correct request', () => {
      expect(readApplicationAgentSpy).toBeCalledWith(
        {
          identifier: {
            oneofKind: 'id',
            id: 'app-agent-id-request',
          },
          bookmarks: [],
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
        new Date(Date.UTC(2022, 2, 15, 13, 12)).toString(),
      );
      expect(applicationAgent.updateTime?.toString()).toBe(
        new Date(Date.UTC(2022, 2, 15, 13, 13)).toString(),
      );
      expect(applicationAgent.deleteTime?.toString()).toBe(
        new Date(Date.UTC(2022, 2, 15, 13, 14)).toString(),
      );
      expect(applicationAgent.destroyTime?.toString()).toBe(
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
        .readApplicationAgent(
          ConfigClientV2.newReadApplicationAgentRequest('id', 'app-agent-id-request'),
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
        .readApplicationAgent(
          ConfigClientV2.newReadApplicationAgentRequest('id', 'app-agent-id-request'),
        )
        .catch((err) => {
          thrownError = err;
        });
    });

    it('throws an error', () => {
      expect(thrownError.message).toBe('No ApplicationAgent response.');
    });
  });
});

describe('readApplicationAgentByName', () => {
  describe('when no error is returned', () => {
    let applicationAgent: ApplicationAgent;
    let readApplicationSpy: jest.SpyInstance;

    beforeEach(async () => {
      const sdk = await ConfigClientV2.createInstance(JSON.stringify(serviceAccountTokenMock));
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
      applicationAgent = ApplicationAgent.deserialize(
        await sdk.readApplicationAgent(
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
      expect(applicationAgent.id).toBe('app-agent-id');
      expect(applicationAgent.appSpaceId).toBe('app-space-id');
      expect(applicationAgent.applicationId).toBe('application-id');
      expect(applicationAgent.customerId).toBe('customer-id');
      expect(applicationAgent.name).toBe('app-agent-name');
      expect(applicationAgent.description).toBe('Application Agent description');
      expect(applicationAgent.displayName).toBe('Application Agent Name');
      expect(applicationAgent.etag).toBe('5432');
      expect(applicationAgent.createTime?.toString()).toBe(
        new Date(Date.UTC(2022, 2, 15, 13, 12)).toString(),
      );
      expect(applicationAgent.updateTime?.toString()).toBe(
        new Date(Date.UTC(2022, 2, 15, 13, 13)).toString(),
      );
      expect(applicationAgent.deleteTime?.toString()).toBe(
        new Date(Date.UTC(2022, 2, 15, 13, 14)).toString(),
      );
      expect(applicationAgent.destroyTime?.toString()).toBe(
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
        .readApplicationAgent(
          ConfigClientV2.newReadApplicationRequest(
            'name',
            'app-space-id-request',
            'app-agent-name-request',
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
        .readApplicationAgent(
          ConfigClientV2.newReadApplicationRequest(
            'name',
            'app-space-id-request',
            'app-agent-name-request',
          ),
        )
        .catch((err) => {
          thrownError = err;
        });
    });

    it('throws an error', () => {
      expect(thrownError.message).toBe('No ApplicationAgent response.');
    });
  });
});

describe('updateApplicationAgent', () => {
  describe('when no error is returned', () => {
    let updateApplicationAgentResponse: UpdateApplicationAgentResponse;
    let updateApplicationAgentSpy: jest.SpyInstance;
    let sdk: ConfigClientV2;

    beforeEach(async () => {
      sdk = await ConfigClientV2.createInstance(JSON.stringify(serviceAccountTokenMock));
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
                createdBy: 'Lorem ipsum - creator',
                updatedBy: 'Lorem ipsum - updater',
                updateTime: Utils.dateToTimestamp(new Date(Date.UTC(2022, 2, 15, 13, 16))),
                bookmark: 'bookmark-token',
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
        updateApplicationAgentResponse = await sdk.updateApplicationAgent(
          ConfigClientV2.newUpdateApplicationAgentRequest(applicationAgent),
        );
      });

      it('sends correct request', () => {
        expect(updateApplicationAgentSpy).toBeCalledWith(
          {
            id: 'app-agent-id',
            bookmarks: [],
          },
          expect.any(Function),
        );
      });

      it('returns a correct instance', () => {
        expect(updateApplicationAgentResponse.id).toBe('app-agent-id');
        expect(updateApplicationAgentResponse.createTime).toBeUndefined();
        expect(updateApplicationAgentResponse.createdBy).toBe('Lorem ipsum - creator');
        expect(updateApplicationAgentResponse.updateTime?.toString()).toBe(
          Utils.dateToTimestamp(new Date(Date.UTC(2022, 2, 15, 13, 16))).toString(),
        );
        expect(updateApplicationAgentResponse.updatedBy).toBe('Lorem ipsum - updater');
        expect(updateApplicationAgentResponse.etag).toBe('new-etag-id');
        expect(updateApplicationAgentResponse.bookmark).toBe('bookmark-token');
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
          new Date(Date.UTC(2022, 2, 15, 13, 15)),
          new Date(Date.UTC(2022, 2, 15, 13, 16)),
          undefined,
          undefined,
          'Lorem ipsum - creator',
          'Lorem ipsum - updater',
        );
        updateApplicationAgentResponse = await sdk.updateApplicationAgent(
          ConfigClientV2.newUpdateApplicationAgentRequest(applicationAgent),
        );
      });

      it('sends correct request', () => {
        expect(updateApplicationAgentSpy).toBeCalledWith(
          {
            id: 'app-agent-id',
            etag: { value: 'etag-id' },
            displayName: { value: 'Application Agent Name' },
            description: { value: 'Agent Description' },
            bookmarks: [],
          },
          expect.any(Function),
        );
      });

      it('returns a correct instance', () => {
        expect(updateApplicationAgentResponse.id).toBe('app-agent-id');
        expect(updateApplicationAgentResponse.createTime).toBeUndefined();
        expect(updateApplicationAgentResponse.createdBy).toBe('Lorem ipsum - creator');
        expect(updateApplicationAgentResponse.updateTime?.toString()).toBe(
          Utils.dateToTimestamp(new Date(Date.UTC(2022, 2, 15, 13, 16))).toString(),
        );
        expect(updateApplicationAgentResponse.updatedBy).toBe('Lorem ipsum - updater');
        expect(updateApplicationAgentResponse.etag).toBe('new-etag-id');
        expect(updateApplicationAgentResponse.bookmark).toBe('bookmark-token');
      });
    });
  });

  describe('when a different application agent is returned', () => {
    let thrownError: SdkError;

    beforeEach(async () => {
      const sdk = await ConfigClientV2.createInstance(JSON.stringify(serviceAccountTokenMock));
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
                createdBy: 'Lorem ipsum - creator',
                updatedBy: 'Lorem ipsum - updater',
                updateTime: Utils.dateToTimestamp(new Date(Date.UTC(2022, 2, 15, 13, 16))),
                bookmark: 'bookmark-token',
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
      return sdk
        .updateApplicationAgent(ConfigClientV2.newUpdateApplicationAgentRequest(applicationAgent))
        .catch((err) => (thrownError = err));
    });

    it('throws an error', () => {
      expect(thrownError.code).toEqual(SdkErrorCode.SDK_CODE_4);
      expect(thrownError.description).toBe(
        'Update returned with different id: request.id=app-agent-id, response.id=different-app-agent-id.',
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
      sdk
        .updateApplicationAgent(ConfigClientV2.newUpdateApplicationAgentRequest(applicationAgent))
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
      sdk
        .updateApplicationAgent(ConfigClientV2.newUpdateApplicationAgentRequest(applicationAgent))
        .catch((err) => {
          thrownError = err;
        });
    });

    it('throws an error', () => {
      expect(thrownError.message).toBe(
        'Update returned with different id: request.id=app-agent-id, response.id=undefined.',
      );
    });
  });
});

describe('readApplicationAgentList', () => {
  describe('when no error is returned', () => {
    const applicationAgents: ApplicationAgent[] = [];
    let listApplicationAgentsSpy: jest.SpyInstance;

    beforeEach(async () => {
      const sdk = await ConfigClientV2.createInstance(JSON.stringify(serviceAccountTokenMock));
      const eventEmitter = Object.assign(new EventEmitter(), {
        read: () => {
          return {
            applicationAgent: {
              id: 'app-agent-id',
              appSpaceId: 'app-space-id',
              applicationId: 'application-id',
              customerId: 'customer-id',
              name: 'app-agent-name',
              description: StringValue.create({ value: 'Application Agent description' }),
              displayName: 'Application Agent Name',
              etag: 'etag-id',
              createTime: Utils.dateToTimestamp(new Date(Date.UTC(2022, 2, 15, 13, 12))),
              updateTime: Utils.dateToTimestamp(new Date(Date.UTC(2022, 2, 15, 13, 13))),
              deleteTime: Utils.dateToTimestamp(new Date(Date.UTC(2022, 2, 15, 13, 14))),
              destroyTime: Utils.dateToTimestamp(new Date(Date.UTC(2022, 2, 15, 13, 15))),
            },
          };
        },
      });
      listApplicationAgentsSpy = jest
        .spyOn(sdk['client'], 'listApplicationAgents')
        .mockImplementation(() => {
          setTimeout(() => eventEmitter.emit('readable'), 0);
          setTimeout(() => eventEmitter.emit('readable'), 0);
          setTimeout(() => eventEmitter.emit('end'), 0);
          return eventEmitter as unknown as ClientReadableStream<ListApplicationAgentsResponse>;
        });

      await sdk
        .listApplicationAgents(
          ConfigClientV2.newListApplicationAgentsRequest('app-space-id-request', [
            'app-agent-name',
          ]),
        )
        .on('error', () => {
          // Nothing to do here.
        })
        .on('data', (data) => {
          if (data && data.applicationAgent) {
            applicationAgents.push(ApplicationAgent.deserialize(data));
          }
        })
        .on('end', () => {
          // Nothing to do here.
        });
    });

    it('sends correct request', () => {
      expect(listApplicationAgentsSpy).toBeCalledWith({
        appSpaceId: 'app-space-id-request',
        match: ['app-agent-name'],
        bookmarks: [],
      });
    });

    it('returns a correct instance', () => {
      expect(applicationAgents.length).toBe(2);
      expect(applicationAgents[0].id).toBe('app-agent-id');
      expect(applicationAgents[0].appSpaceId).toBe('app-space-id');
      expect(applicationAgents[0].applicationId).toBe('application-id');
      expect(applicationAgents[0].customerId).toBe('customer-id');
      expect(applicationAgents[0].name).toBe('app-agent-name');
      expect(applicationAgents[0].description).toBe('Application Agent description');
      expect(applicationAgents[0].displayName).toBe('Application Agent Name');
      expect(applicationAgents[0].etag).toBe('etag-id');
      expect(applicationAgents[0].createTime?.toString()).toBe(
        new Date(Date.UTC(2022, 2, 15, 13, 12)).toString(),
      );
      expect(applicationAgents[0].updateTime?.toString()).toBe(
        new Date(Date.UTC(2022, 2, 15, 13, 13)).toString(),
      );
      expect(applicationAgents[0].deleteTime?.toString()).toBe(
        new Date(Date.UTC(2022, 2, 15, 13, 14)).toString(),
      );
      expect(applicationAgents[0].destroyTime?.toString()).toBe(
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
    let sdk: ConfigClientV2;

    beforeEach(async () => {
      sdk = await ConfigClientV2.createInstance(JSON.stringify(serviceAccountTokenMock));
      const eventEmitter = Object.assign(new EventEmitter(), { read: jest.fn() });
      jest.spyOn(sdk['client'], 'listApplicationAgents').mockImplementation(() => {
        setTimeout(() => eventEmitter.emit('error', error), 0);
        return eventEmitter as unknown as ClientReadableStream<ListApplicationAgentsResponse>;
      });
    });

    it('throws an error', () => {
      sdk
        .listApplicationAgents(
          ConfigClientV2.newListApplicationAgentsRequest('app-space-id-request', [
            'app-agent-name',
          ]),
        )
        .on('error', (err) => {
          expect(err).toBe(error);
        })
        .on('data', () => {
          // Nothing to do here.
        })
        .on('end', () => {
          // Nothing to do here.
        });
    });
  });

  describe('when a close event is triggered', () => {
    let sdk: ConfigClientV2;

    beforeEach(async () => {
      sdk = await ConfigClientV2.createInstance(JSON.stringify(serviceAccountTokenMock));
      const eventEmitter = Object.assign(new EventEmitter(), { read: jest.fn() });
      jest.spyOn(sdk['client'], 'listApplicationAgents').mockImplementation(() => {
        setTimeout(() => eventEmitter.emit('close'), 0);
        return eventEmitter as unknown as ClientReadableStream<ListApplicationAgentsResponse>;
      });
    });

    it('close has been triggered', () => {
      sdk
        .listApplicationAgents(
          ConfigClientV2.newListApplicationAgentsRequest('app-space-id-request', [
            'app-agent-name',
          ]),
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

describe('deleteApplicationAgent', () => {
  describe('when no error is returned', () => {
    let deleteApplicationAgentSpy: jest.SpyInstance;
    let sdk: ConfigClientV2;

    beforeEach(async () => {
      sdk = await ConfigClientV2.createInstance(JSON.stringify(serviceAccountTokenMock));
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
                bookmark: 'bookmark-token',
              });
            }
            return {} as SurfaceCall;
          },
        );
      return sdk.deleteApplicationAgent(
        ConfigClientV2.newDeleteApplicationAgentRequest('app-agent-id'),
      );
    });

    it('sends correct request', () => {
      expect(deleteApplicationAgentSpy).toBeCalledWith(
        {
          id: 'app-agent-id',
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
      sdk
        .deleteApplicationAgent(ConfigClientV2.newDeleteApplicationAgentRequest('app-agent-id'))
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
      sdk
        .deleteApplicationAgent(ConfigClientV2.newDeleteApplicationAgentRequest('app-agent-id'))
        .catch((err) => {
          thrownError = err;
        });
    });

    it('throws an error', () => {
      expect(thrownError.message).toBe('No ApplicationAgent response.');
    });
  });
});
