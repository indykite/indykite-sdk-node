import { EventEmitter } from 'events';
import { CallOptions, Metadata } from '@grpc/grpc-js';
import { ClientReadableStream, ServiceError, SurfaceCall } from '@grpc/grpc-js/build/src/call';
import { Status } from '@grpc/grpc-js/build/src/constants';
import {
  CreateApplicationResponse,
  DeleteApplicationAgentResponse,
  ListApplicationAgentsResponse,
  ReadApplicationAgentResponse,
  UpdateApplicationAgentResponse,
} from '../../../grpc/indykite/config/v1beta1/config_management_api';
import { ConfigClient } from '../../config';
import { SdkError, SdkErrorCode } from '../../error';
import { StringValue } from '../../../grpc/google/protobuf/wrappers';
import { Utils } from '../../utils/utils';
import { ApplicationAgent } from '../../model/config/application_agent';
import { serviceAccountTokenMock } from '../../utils/test_utils';

afterEach(() => {
  jest.restoreAllMocks();
});

describe('createApplicationAgent', () => {
  describe('when no error is returned', () => {
    let applicationAgent: ApplicationAgent;
    let createApplicationAgentSpy: jest.SpyInstance;
    let sdk: ConfigClient;

    beforeEach(async () => {
      sdk = await ConfigClient.createInstance(JSON.stringify(serviceAccountTokenMock));
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
      const sdk = await ConfigClient.createInstance(JSON.stringify(serviceAccountTokenMock));
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
      const sdk = await ConfigClient.createInstance(JSON.stringify(serviceAccountTokenMock));
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
      const sdk = await ConfigClient.createInstance(JSON.stringify(serviceAccountTokenMock));
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
      const sdk = await ConfigClient.createInstance(JSON.stringify(serviceAccountTokenMock));
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
      const sdk = await ConfigClient.createInstance(JSON.stringify(serviceAccountTokenMock));
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
      const sdk = await ConfigClient.createInstance(JSON.stringify(serviceAccountTokenMock));
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
      const sdk = await ConfigClient.createInstance(JSON.stringify(serviceAccountTokenMock));
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
      const sdk = await ConfigClient.createInstance(JSON.stringify(serviceAccountTokenMock));
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
      sdk = await ConfigClient.createInstance(JSON.stringify(serviceAccountTokenMock));
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
      const sdk = await ConfigClient.createInstance(JSON.stringify(serviceAccountTokenMock));
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
      const sdk = await ConfigClient.createInstance(JSON.stringify(serviceAccountTokenMock));
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
      const sdk = await ConfigClient.createInstance(JSON.stringify(serviceAccountTokenMock));
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
      const sdk = await ConfigClient.createInstance(JSON.stringify(serviceAccountTokenMock));
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
      const sdk = await ConfigClient.createInstance(JSON.stringify(serviceAccountTokenMock));
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
      sdk = await ConfigClient.createInstance(JSON.stringify(serviceAccountTokenMock));
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
      const sdk = await ConfigClient.createInstance(JSON.stringify(serviceAccountTokenMock));
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
      const sdk = await ConfigClient.createInstance(JSON.stringify(serviceAccountTokenMock));
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
