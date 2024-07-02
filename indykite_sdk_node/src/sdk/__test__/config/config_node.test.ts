import { CallOptions, Metadata } from '@grpc/grpc-js';
import { ServiceError, SurfaceCall } from '@grpc/grpc-js/build/src/call';
import { Status } from '@grpc/grpc-js/build/src/constants';
import {
  CreateConfigNodeRequest,
  CreateConfigNodeResponse,
  DeleteConfigNodeRequest,
  DeleteConfigNodeResponse,
  ListConfigNodeVersionsResponse,
  ReadConfigNodeResponse,
  UpdateConfigNodeRequest,
  UpdateConfigNodeResponse,
} from '../../../grpc/indykite/config/v1beta1/config_management_api';
import { ConfigClient } from '../../config';
import { SdkError, SdkErrorCode } from '../../error';
import { Utils } from '../../utils/utils';
import { StringValue } from '../../../grpc/google/protobuf/wrappers';
import { serviceAccountTokenMock } from '../../utils/test_utils';
import { AuthorizationPolicyConfig_Status } from '../../../grpc/indykite/config/v1beta1/model';
import { AuthorizationPolicy, ConsentNode } from '../../model';

let createConfigExample: CreateConfigNodeRequest;
let updateConfigExample: UpdateConfigNodeRequest;
let deleteConfigExample: DeleteConfigNodeRequest;

beforeEach(() => {
  createConfigExample = CreateConfigNodeRequest.fromJson({
    location: 'location-id',
    name: 'authzConfig',
    bookmarks: [],
    displayName: 'Authz Name',
    description: 'Authz description',
  });
  createConfigExample.config = {
    oneofKind: undefined,
  };
  updateConfigExample = {
    id: 'configNode-id',
    bookmarks: [],
    etag: StringValue.fromJson('etag-token'),
    displayName: StringValue.fromJson('Authz name'),
    description: StringValue.fromJson('Authz description'),
    config: {
      oneofKind: undefined,
    },
  } as UpdateConfigNodeRequest;
  updateConfigExample.config = {
    oneofKind: undefined,
  };

  const consentExample: ConsentNode = new ConsentNode({
    name: 'consent-node',
    purpose: 'Taking control',
    dataPoints: ['lastname', 'firstname', 'email'],
    applicationId: 'new-configNode-id',
    validityPeriod: '86400',
    revokeAfterUse: false,
  });

  consentExample.id = 'configNode-id';
  consentExample.etag = 'etag-token';
  deleteConfigExample = ConfigClient.newDeleteConfigNodeRequest(consentExample);

  const policy = `
  {
    "path": {
      "subjectId": "66444564",
      "resourceId": "53102471",
      "entities": [
        {
          "id": "66444564",
          "labels": [
            "Subject"
          ],
          "identityProperties": []
        },
        {
          "id": "53102471",
          "labels": [
            "Resource"
          ],
          "knowledgeProperties": []
        }
      ],
      "relationships": [
        {
          "source": "66444564",
          "target": "53102471",
          "types": [
            "AUTHORIZED_TO"
          ],
          "nonDirectional": false
        }
      ]
    },
    "actions": [
      "IS_AUTHORIZED"
    ],
    "active": true
  }
`;
  const configAuthorizationPolicyExample: AuthorizationPolicy = new AuthorizationPolicy({
    name: 'authorization-policy',
    policy,
    status: AuthorizationPolicyConfig_Status.ACTIVE,
  });

  ConfigClient.newUpdateConfigNodeRequest(configAuthorizationPolicyExample);
  ConfigClient.newUpdateConfigNodeRequest(consentExample);
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('createConfigNode', () => {
  describe('when no error is returned', () => {
    let configNodeResponse: CreateConfigNodeResponse;
    let createConfigNodeSpy: jest.SpyInstance;
    let sdk: ConfigClient;

    beforeEach(async () => {
      sdk = await ConfigClient.createInstance(JSON.stringify(serviceAccountTokenMock));
      createConfigNodeSpy = jest
        .spyOn(sdk['client'], 'createConfigNode')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response: CreateConfigNodeResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(null, {
                id: 'new-configNode-id',
                etag: 'etag-token',
                createdBy: 'Lorem ipsum - creator',
                updatedBy: 'Lorem ipsum - updater',
                createTime: Utils.dateToTimestamp(new Date(Date.UTC(2022, 6, 21, 13, 5))),
                updateTime: Utils.dateToTimestamp(new Date(Date.UTC(2022, 6, 21, 13, 6))),
                bookmark: 'bookmark-token',
                locationId: 'location-id-1',
              });
            }
            return {} as SurfaceCall;
          },
        );
    });

    describe('when necessary values are sent only', () => {
      beforeEach(async () => {
        configNodeResponse = await sdk.createConfigNode(createConfigExample);
      });

      it('sends correct request', () => {
        expect(createConfigNodeSpy).toHaveBeenCalledWith(
          {
            name: 'authzConfig',
            location: 'location-id',
            description: {
              value: 'Authz description',
            },
            displayName: { value: 'Authz Name' },
            bookmarks: [],
            config: {
              oneofKind: undefined,
            },
          },
          expect.any(Function),
        );
      });

      it('returns a correct instance', () => {
        expect(configNodeResponse.id).toBe('new-configNode-id');
        expect(configNodeResponse.locationId).toBe('location-id-1');
        expect(configNodeResponse.createTime?.toString()).toBe(
          Utils.dateToTimestamp(new Date(Date.UTC(2022, 6, 21, 13, 5))).toString(),
        );
        expect(configNodeResponse.createdBy).toBe('Lorem ipsum - creator');
        expect(configNodeResponse.updateTime?.toString()).toBe(
          Utils.dateToTimestamp(new Date(Date.UTC(2022, 6, 21, 13, 6))).toString(),
        );
        expect(configNodeResponse.updatedBy).toBe('Lorem ipsum - updater');
        expect(configNodeResponse.etag).toBe('etag-token');
      });
    });

    describe('when all possible values are sent', () => {
      beforeEach(async () => {
        configNodeResponse = await sdk.createConfigNode(createConfigExample);
      });

      it('sends correct request', () => {
        expect(createConfigNodeSpy).toHaveBeenCalledWith(
          {
            name: 'authzConfig',
            location: 'location-id',
            description: {
              value: 'Authz description',
            },
            displayName: { value: 'Authz Name' },
            bookmarks: [],
            config: {
              oneofKind: undefined,
            },
          },
          expect.any(Function),
        );
      });

      it('returns a correct instance', () => {
        expect(configNodeResponse.id).toBe('new-configNode-id');
        expect(configNodeResponse.locationId).toBe('location-id-1');
        expect(configNodeResponse.createTime?.toString()).toBe(
          Utils.dateToTimestamp(new Date(Date.UTC(2022, 6, 21, 13, 5))).toString(),
        );
        expect(configNodeResponse.createdBy).toBe('Lorem ipsum - creator');
        expect(configNodeResponse.updateTime?.toString()).toBe(
          Utils.dateToTimestamp(new Date(Date.UTC(2022, 6, 21, 13, 6))).toString(),
        );
        expect(configNodeResponse.updatedBy).toBe('Lorem ipsum - updater');
        expect(configNodeResponse.etag).toBe('etag-token');
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
        .spyOn(sdk['client'], 'createConfigNode')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response?: CreateConfigNodeResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(error);
            }
            return {} as SurfaceCall;
          },
        );
      return sdk.createConfigNode(createConfigExample).catch((err) => {
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
        .spyOn(sdk['client'], 'createConfigNode')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response?: CreateConfigNodeResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(null);
            }
            return {} as SurfaceCall;
          },
        );
      return sdk.createConfigNode(createConfigExample).catch((err) => {
        thrownError = err;
      });
    });

    it('throws an error', () => {
      expect(thrownError.message).toBe('No ConfigNode response.');
    });
  });
});

describe('readConfigNode', () => {
  describe('when no error is returned', () => {
    let readConfigNodeResponse: ReadConfigNodeResponse;
    let readConfigNodeSpy: jest.SpyInstance;

    beforeEach(async () => {
      const sdk = await ConfigClient.createInstance(JSON.stringify(serviceAccountTokenMock));
      readConfigNodeSpy = jest
        .spyOn(sdk['client'], 'readConfigNode')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response: ReadConfigNodeResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(null, {
                configNode: {
                  displayName: 'Instance Name',
                  description: StringValue.fromJson('Instance description'),
                  etag: 'etag-token',
                  id: 'configNode-id',
                  createdBy: 'Lorem ipsum - creator',
                  updatedBy: 'Lorem ipsum - updater',
                  createTime: Utils.dateToTimestamp(new Date(Date.UTC(2022, 6, 21, 11, 13))),
                  updateTime: Utils.dateToTimestamp(new Date(Date.UTC(2022, 6, 21, 11, 14))),
                  customerId: 'customer-id',
                  appSpaceId: 'app-space-id',
                  name: 'instance-name',
                  config: {
                    oneofKind: undefined,
                  },
                  version: '1',
                },
              });
            }
            return {} as SurfaceCall;
          },
        );
      readConfigNodeResponse = await sdk.readConfigNode(
        ConfigClient.newReadConfigNodeRequest('configNode-id-request'),
      );
      // configNodeResponse = ConfigNodeFactory.createInstance(readConfigNodeResponse.configNode);
    });

    it('sends correct request', () => {
      expect(readConfigNodeSpy).toHaveBeenCalledWith(
        {
          id: 'configNode-id-request',
          bookmarks: [],
          version: '',
        },
        expect.any(Function),
      );
    });

    it('returns a correct instance', () => {
      expect(readConfigNodeResponse).toEqual({
        configNode: {
          config: {
            oneofKind: undefined,
          },
          name: 'instance-name',
          displayName: 'Instance Name',
          description: { value: 'Instance description' },
          etag: 'etag-token',
          id: 'configNode-id',
          createTime: Utils.dateToTimestamp(new Date(Date.UTC(2022, 6, 21, 11, 13))),
          updateTime: Utils.dateToTimestamp(new Date(Date.UTC(2022, 6, 21, 11, 14))),
          customerId: 'customer-id',
          appSpaceId: 'app-space-id',
          createdBy: 'Lorem ipsum - creator',
          updatedBy: 'Lorem ipsum - updater',
          version: '1',
        },
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
        .spyOn(sdk['client'], 'readConfigNode')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response?: ReadConfigNodeResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(error);
            }
            return {} as SurfaceCall;
          },
        );
      return sdk
        .readConfigNode(ConfigClient.newReadConfigNodeRequest('configNode-id-request'))
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
        .spyOn(sdk['client'], 'readConfigNode')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response?: ReadConfigNodeResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(null);
            }
            return {} as SurfaceCall;
          },
        );
      return sdk
        .readConfigNode(ConfigClient.newReadConfigNodeRequest('configNode-id-request'))
        .catch((err) => {
          thrownError = err;
        });
    });

    it('throws an error', () => {
      expect(thrownError.message).toBe('No ConfigNode response.');
    });
  });
});

describe('updateConfigNode', () => {
  describe('when no error is returned', () => {
    let configNode: UpdateConfigNodeResponse;
    let updateConfigNodeSpy: jest.SpyInstance;
    let sdk: ConfigClient;

    beforeEach(async () => {
      sdk = await ConfigClient.createInstance(JSON.stringify(serviceAccountTokenMock));
      updateConfigNodeSpy = jest
        .spyOn(sdk['client'], 'updateConfigNode')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response: UpdateConfigNodeResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(null, {
                etag: 'new-etag-token',
                id: 'configNode-id',
                updateTime: Utils.dateToTimestamp(new Date(Date.UTC(2022, 6, 21, 14, 56))),
                bookmark: 'bookmark-token',
                createdBy: 'Lorem ipsum - creator',
                updatedBy: 'Lorem ipsum - updater',
                locationId: 'location-id-1',
              });
            }
            return {} as SurfaceCall;
          },
        );
    });

    describe('when necessary values are sent only', () => {
      beforeEach(async () => {
        configNode = await sdk.updateConfigNode(updateConfigExample);
      });

      it('sends correct request', () => {
        expect(updateConfigNodeSpy).toHaveBeenCalledWith(
          {
            id: 'configNode-id',
            bookmarks: [],
            config: {
              oneofKind: undefined,
            },
            description: {
              value: 'Authz description',
            },
            displayName: {
              value: 'Authz name',
            },
            etag: {
              value: 'etag-token',
            },
          },
          expect.any(Function),
        );
      });

      it('returns a correct instance', () => {
        expect(configNode.id).toBe('configNode-id');
        expect(configNode.createTime).toBeUndefined();
        expect(configNode.createdBy).toBe('Lorem ipsum - creator');
        expect(configNode.updateTime?.toString()).toBe(
          Utils.dateToTimestamp(new Date(Date.UTC(2022, 6, 21, 14, 56))).toString(),
        );
        expect(configNode.updatedBy).toBe('Lorem ipsum - updater');
        expect(configNode.etag).toBe('new-etag-token');
        expect(configNode.bookmark).toBe('bookmark-token');
      });
    });

    describe('when all possible values are sent', () => {
      beforeEach(async () => {
        configNode = await sdk.updateConfigNode(updateConfigExample);
      });

      it('sends correct request', () => {
        expect(updateConfigNodeSpy).toHaveBeenCalledWith(
          {
            id: 'configNode-id',
            description: {
              value: 'Authz description',
            },
            displayName: {
              value: 'Authz name',
            },
            etag: {
              value: 'etag-token',
            },
            bookmarks: [],
            config: {
              oneofKind: undefined,
            },
          },
          expect.any(Function),
        );
      });

      it('returns a correct instance', () => {
        expect(configNode.id).toBe('configNode-id');
        expect(configNode.createTime).toBeUndefined();
        expect(configNode.createdBy).toBe('Lorem ipsum - creator');
        expect(configNode.updateTime?.toString()).toBe(
          Utils.dateToTimestamp(new Date(Date.UTC(2022, 6, 21, 14, 56))).toString(),
        );
        expect(configNode.updatedBy).toBe('Lorem ipsum - updater');
        expect(configNode.etag).toBe('new-etag-token');
        expect(configNode.bookmark).toBe('bookmark-token');
      });
    });
  });

  describe('when a different authz policy is returned', () => {
    let thrownError: SdkError;

    beforeEach(async () => {
      const sdk = await ConfigClient.createInstance(JSON.stringify(serviceAccountTokenMock));
      jest
        .spyOn(sdk['client'], 'updateConfigNode')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response: UpdateConfigNodeResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(null, {
                etag: 'new-etag-token',
                id: 'different-configNode-id',
                updateTime: Utils.dateToTimestamp(new Date(Date.UTC(2022, 6, 21, 14, 56))),
                bookmark: 'bookmark-token',
                createdBy: 'Lorem ipsum - creator',
                updatedBy: 'Lorem ipsum - updater',
                locationId: 'location-id-1',
              });
            }
            return {} as SurfaceCall;
          },
        );
      return sdk.updateConfigNode(updateConfigExample).catch((err) => (thrownError = err));
    });

    it('throws an error', () => {
      expect(thrownError.code).toEqual(SdkErrorCode.SDK_CODE_4);
      expect(thrownError.description).toBe(
        'Update returned with different id: request.id=configNode-id, response.id=different-configNode-id.',
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
        .spyOn(sdk['client'], 'updateConfigNode')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response?: UpdateConfigNodeResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(error);
            }
            return {} as SurfaceCall;
          },
        );
      return sdk.updateConfigNode(updateConfigExample).catch((err) => {
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
        .spyOn(sdk['client'], 'updateConfigNode')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response?: UpdateConfigNodeResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(null);
            }
            return {} as SurfaceCall;
          },
        );
      return sdk.updateConfigNode(updateConfigExample).catch((err) => {
        thrownError = err;
      });
    });

    it('throws an error', () => {
      expect(thrownError.message).toBe(
        'Update returned with different id: request.id=configNode-id, response.id=undefined.',
      );
    });
  });
});

describe('deleteConfigNode', () => {
  describe('when no error is returned', () => {
    let deleteConfigNodeSpy: jest.SpyInstance;
    let sdk: ConfigClient;
    let returnedValue: DeleteConfigNodeResponse;

    describe('when necessary values are sent only', () => {
      beforeEach(async () => {
        sdk = await ConfigClient.createInstance(JSON.stringify(serviceAccountTokenMock));
        deleteConfigNodeSpy = jest
          .spyOn(sdk['client'], 'deleteConfigNode')
          .mockImplementation(
            (
              req,
              res:
                | Metadata
                | CallOptions
                | ((err: ServiceError | null, response: DeleteConfigNodeResponse) => void),
            ) => {
              if (typeof res === 'function') {
                res(null, {
                  bookmark: 'bookmark-token',
                });
              }
              return {} as SurfaceCall;
            },
          );
        returnedValue = await sdk.deleteConfigNode(deleteConfigExample);
      });

      it('sends correct request', () => {
        expect(deleteConfigNodeSpy).toHaveBeenCalledWith(
          {
            id: 'configNode-id',
            bookmarks: [],
            etag: {
              value: 'etag-token',
            },
          },
          expect.any(Function),
        );
      });

      it('returns a correct value', () => {
        expect(returnedValue).not.toBeUndefined();
      });
    });

    describe('when all possible values are sent', () => {
      beforeEach(async () => {
        sdk = await ConfigClient.createInstance(JSON.stringify(serviceAccountTokenMock));
        deleteConfigNodeSpy = jest
          .spyOn(sdk['client'], 'deleteConfigNode')
          .mockImplementation(
            (
              req,
              res:
                | Metadata
                | CallOptions
                | ((err: ServiceError | null, response: DeleteConfigNodeResponse) => void),
            ) => {
              if (typeof res === 'function') {
                res(null, {
                  bookmark: 'bookmark-token',
                });
              }
              return {} as SurfaceCall;
            },
          );
        returnedValue = await sdk.deleteConfigNode(deleteConfigExample);
      });

      it('sends correct request', () => {
        expect(deleteConfigNodeSpy).toHaveBeenCalledWith(
          {
            id: 'configNode-id',
            etag: StringValue.fromJson('etag-token'),
            bookmarks: [],
          },
          expect.any(Function),
        );
      });

      it('returns a correct value', () => {
        expect(returnedValue).not.toBeUndefined();
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
        .spyOn(sdk['client'], 'deleteConfigNode')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response?: DeleteConfigNodeResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(error);
            }
            return {} as SurfaceCall;
          },
        );
      return sdk.deleteConfigNode(deleteConfigExample).catch((err) => {
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
        .spyOn(sdk['client'], 'deleteConfigNode')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response?: DeleteConfigNodeResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(null);
            }
            return {} as SurfaceCall;
          },
        );
      return sdk.deleteConfigNode(deleteConfigExample).catch((err) => {
        thrownError = err;
      });
    });

    it('throws an error', () => {
      expect(thrownError.code).toEqual(SdkErrorCode.SDK_CODE_3);
      expect(thrownError.description).toBe('No ConfigNode response.');
    });
  });
});

describe('listConfigNodeVersions', () => {
  describe('when no error is returned', () => {
    let listConfigNodeVersionsResponse: ListConfigNodeVersionsResponse;
    let listConfigNodeVersionsSpy: jest.SpyInstance;

    beforeEach(async () => {
      const sdk = await ConfigClient.createInstance(JSON.stringify(serviceAccountTokenMock));
      listConfigNodeVersionsSpy = jest
        .spyOn(sdk['client'], 'listConfigNodeVersions')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response: ListConfigNodeVersionsResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(null, {
                configNodes: [
                  {
                    displayName: 'Instance Name',
                    description: StringValue.fromJson('Instance description'),
                    etag: 'etag-token',
                    id: 'configNode-id',
                    createdBy: 'Lorem ipsum - creator',
                    updatedBy: 'Lorem ipsum - updater',
                    createTime: Utils.dateToTimestamp(new Date(Date.UTC(2022, 6, 21, 11, 13))),
                    updateTime: Utils.dateToTimestamp(new Date(Date.UTC(2022, 6, 21, 11, 14))),
                    customerId: 'customer-id',
                    appSpaceId: 'app-space-id',
                    name: 'instance-name',
                    config: {
                      oneofKind: undefined,
                    },
                    version: '1',
                  },
                ],
              });
            }
            return {} as SurfaceCall;
          },
        );
      listConfigNodeVersionsResponse = await sdk.listConfigNodeVersions(
        ConfigClient.newReadConfigNodeRequest('configNode-id-request'),
      );
      // configNodeResponse = ConfigNodeFactory.createInstance(readConfigNodeResponse.configNode);
    });

    it('sends correct request', () => {
      expect(listConfigNodeVersionsSpy).toHaveBeenCalledWith(
        {
          id: 'configNode-id-request',
          version: '',
          bookmarks: [],
        },
        expect.any(Function),
      );
    });

    it('returns a correct instance', () => {
      expect(listConfigNodeVersionsResponse.configNodes).not.toBeUndefined();
      expect(listConfigNodeVersionsResponse.configNodes.length).toEqual(1);
      expect(listConfigNodeVersionsResponse.configNodes[0].name).toEqual('instance-name');
      expect(listConfigNodeVersionsResponse.configNodes[0].customerId).toEqual('customer-id');
      expect(listConfigNodeVersionsResponse.configNodes[0].appSpaceId).toEqual('app-space-id');
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
        .spyOn(sdk['client'], 'listConfigNodeVersions')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response?: ListConfigNodeVersionsResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(error);
            }
            return {} as SurfaceCall;
          },
        );
      return sdk.listConfigNodeVersions({ id: 'configNode-id-request' }).catch((err) => {
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
        .spyOn(sdk['client'], 'listConfigNodeVersions')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response?: ListConfigNodeVersionsResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(null);
            }
            return {} as SurfaceCall;
          },
        );
      return sdk.listConfigNodeVersions({ id: 'configNode-id-request' }).catch((err) => {
        thrownError = err;
      });
    });

    it('throws an error', () => {
      expect(thrownError.message).toBe('No ConfigNode response.');
    });
  });
});
