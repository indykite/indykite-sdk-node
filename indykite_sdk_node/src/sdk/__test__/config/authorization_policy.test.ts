import { CallOptions, Metadata } from '@grpc/grpc-js';
import { ServiceError, SurfaceCall } from '@grpc/grpc-js/build/src/call';
import { Status } from '@grpc/grpc-js/build/src/constants';
import {
  CreateConfigNodeResponse,
  DeleteConfigNodeResponse,
  ReadConfigNodeResponse,
  UpdateConfigNodeResponse,
} from '../../../grpc/indykite/config/v1beta1/config_management_api';
import { ConfigClient } from '../../config';
import { SdkError, SdkErrorCode } from '../../error';
import { Utils } from '../../utils/utils';
import { StringValue } from '../../../grpc/google/protobuf/wrappers';
import { serviceAccountTokenMock } from '../../utils/test_utils';
import { AuthorizationPolicy, AuthorizationPolicyConfig_Status } from '../../model';

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
let configExample: AuthorizationPolicy;

beforeEach(() => {
  configExample = new AuthorizationPolicy({
    name: 'authorization-policy',
    policy,
    status: AuthorizationPolicyConfig_Status.ACTIVE,
  });
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('createAuthorizationPolicyConfiguration', () => {
  describe('when no error is returned', () => {
    let authorizationProvider: AuthorizationPolicy;
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
                id: 'new-authorization-policy-id',
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
        authorizationProvider = await sdk.createAuthorizationPolicyConfiguration(
          'location-id',
          configExample,
        );
      });

      it('sends correct request', () => {
        expect(createConfigNodeSpy).toBeCalledWith(
          {
            name: 'authorization-policy',
            location: 'location-id',
            bookmarks: [],
            config: {
              oneofKind: 'authorizationPolicyConfig',
              authorizationPolicyConfig: {
                policy,
                status: AuthorizationPolicyConfig_Status.ACTIVE,
                tags: [],
              },
            },
          },
          expect.any(Function),
        );
      });

      it('returns a correct instance', () => {
        expect(authorizationProvider.id).toBe('new-authorization-policy-id');
        expect(authorizationProvider.etag).toBe('etag-token');
        expect(authorizationProvider.name).toBe('authorization-policy');
        expect(authorizationProvider.displayName).toBeUndefined();
        expect(authorizationProvider.description).toBeUndefined();
      });
    });

    describe('when all possible values are sent', () => {
      beforeEach(async () => {
        configExample.displayName = 'Authorization Policy Name';
        configExample.description = StringValue.fromJson('Authorization Policy description');
        authorizationProvider = await sdk.createAuthorizationPolicyConfiguration(
          'location-id',
          configExample,
        );
      });

      it('sends correct request', () => {
        expect(createConfigNodeSpy).toBeCalledWith(
          {
            name: 'authorization-policy',
            location: 'location-id',
            bookmarks: [],
            config: {
              oneofKind: 'authorizationPolicyConfig',
              authorizationPolicyConfig: {
                policy,
                status: AuthorizationPolicyConfig_Status.ACTIVE,
                tags: [],
              },
            },
            description: {
              value: 'Authorization Policy description',
            },
            displayName: {
              value: 'Authorization Policy Name',
            },
          },
          expect.any(Function),
        );
      });

      it('returns a correct instance', () => {
        expect(authorizationProvider.id).toBe('new-authorization-policy-id');
        expect(authorizationProvider.etag).toBe('etag-token');
        expect(authorizationProvider.name).toBe('authorization-policy');
        expect(authorizationProvider.displayName).toBe('Authorization Policy Name');
        expect(authorizationProvider.description?.value).toBe('Authorization Policy description');
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
      return sdk
        .createAuthorizationPolicyConfiguration('location-id', configExample)
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
      return sdk
        .createAuthorizationPolicyConfiguration('location-id', configExample)
        .catch((err) => {
          thrownError = err;
        });
    });

    it('throws an error', () => {
      expect(thrownError.message).toBe('No authorization policy response');
    });
  });
});

describe('readAuthorizationPolicyConfiguration', () => {
  describe('when no error is returned', () => {
    let authorizationPolicy: AuthorizationPolicy;
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
                  id: 'authorization-policy-id',
                  createdBy: 'Lorem ipsum - creator',
                  updatedBy: 'Lorem ipsum - updater',
                  createTime: Utils.dateToTimestamp(new Date(Date.UTC(2022, 6, 21, 11, 13))),
                  updateTime: Utils.dateToTimestamp(new Date(Date.UTC(2022, 6, 21, 11, 14))),
                  customerId: 'customer-id',
                  appSpaceId: 'app-space-id',
                  tenantId: 'tenant-id',
                  name: 'instance-name',
                  config: {
                    oneofKind: 'authorizationPolicyConfig',
                    authorizationPolicyConfig: {
                      policy,
                      status: AuthorizationPolicyConfig_Status.ACTIVE,
                      tags: [],
                    },
                  },
                  version: "1"
                },
              });
            }
            return {} as SurfaceCall;
          },
        );
      authorizationPolicy = await sdk.readAuthorizationPolicyConfiguration(
        'authorization-policy-id-request',
      );
    });

    it('sends correct request', () => {
      expect(readConfigNodeSpy).toBeCalledWith(
        {
          id: 'authorization-policy-id-request',
          bookmarks: [],
          version: '',
        },
        expect.any(Function),
      );
    });

    it('returns a correct instance', () => {
      expect(authorizationPolicy).toEqual(
        Object.assign(
          new AuthorizationPolicy({
            name: 'instance-name',
            policy,
            tags: [],
            status: AuthorizationPolicyConfig_Status.ACTIVE,
          }),
          {
            displayName: 'Instance Name',
            description: { value: 'Instance description' },
            etag: 'etag-token',
            id: 'authorization-policy-id',
            createTime: new Date(Date.UTC(2022, 6, 21, 11, 13)),
            updateTime: new Date(Date.UTC(2022, 6, 21, 11, 14)),
            customerId: 'customer-id',
            appSpaceId: 'app-space-id',
            tenantId: 'tenant-id',
            createdBy: 'Lorem ipsum - creator',
            updatedBy: 'Lorem ipsum - updater',
          },
        ),
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
        .readAuthorizationPolicyConfiguration('authorization-policy-id-request')
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
        .readAuthorizationPolicyConfiguration('authorization-policy-id-request')
        .catch((err) => {
          thrownError = err;
        });
    });

    it('throws an error', () => {
      expect(thrownError.message).toBe('config_error_read_authorizationpolicyconfiguration');
    });
  });
});

describe('updateAuthorizationPolicyConfiguration', () => {
  describe('when no error is returned', () => {
    let authorizationPolicy: AuthorizationPolicy;
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
                id: 'authorization-policy-id',
                updateTime: Utils.dateToTimestamp(new Date(Date.UTC(2022, 6, 21, 14, 56))),
                bookmark: 'bookmark-token',
                createdBy: 'Lorem ipsum - creator',
                updatedBy: 'Lorem ipsum - updater',
                locationId: 'location-id',
              });
            }
            return {} as SurfaceCall;
          },
        );
    });

    describe('when necessary values are sent only', () => {
      beforeEach(async () => {
        configExample.id = 'authorization-policy-id';
        authorizationPolicy = await sdk.updateAuthorizationPolicyConfiguration(configExample);
      });

      it('sends correct request', () => {
        expect(updateConfigNodeSpy).toBeCalledWith(
          {
            id: 'authorization-policy-id',
            config: {
              oneofKind: 'authorizationPolicyConfig',
              authorizationPolicyConfig: {
                policy,
                tags: [],
                status: AuthorizationPolicyConfig_Status.ACTIVE,
              },
            },
            bookmarks: [],
          },
          expect.any(Function),
        );
      });

      it('returns a correct instance', () => {
        expect(authorizationPolicy).toEqual(
          Object.assign(
            new AuthorizationPolicy({
              name: 'authorization-policy',
              policy,
              tags: [],
              status: AuthorizationPolicyConfig_Status.ACTIVE,
            }),
            {
              etag: 'new-etag-token',
              id: 'authorization-policy-id',
              updateTime: new Date(Date.UTC(2022, 6, 21, 14, 56)),
            },
          ),
        );
      });
    });

    describe('when all possible values are sent', () => {
      beforeEach(async () => {
        configExample.displayName = 'Authorization Policy name';
        configExample.description = StringValue.fromJson('Authorization Policy description');
        configExample.etag = 'etag-token';
        configExample.id = 'authorization-policy-id';
        authorizationPolicy = await sdk.updateAuthorizationPolicyConfiguration(configExample);
      });

      it('sends correct request', () => {
        expect(updateConfigNodeSpy).toBeCalledWith(
          {
            id: 'authorization-policy-id',
            config: {
              oneofKind: 'authorizationPolicyConfig',
              authorizationPolicyConfig: {
                policy,
                tags: [],
                status: AuthorizationPolicyConfig_Status.ACTIVE,
              },
            },
            description: {
              value: 'Authorization Policy description',
            },
            displayName: {
              value: 'Authorization Policy name',
            },
            etag: {
              value: 'etag-token',
            },
            bookmarks: [],
          },
          expect.any(Function),
        );
      });

      it('returns a correct instance', () => {
        expect(authorizationPolicy).toEqual(
          Object.assign(
            new AuthorizationPolicy({
              name: 'authorization-policy',
              policy,
              tags: [],
              status: AuthorizationPolicyConfig_Status.ACTIVE,
            }),
            {
              description: StringValue.fromJson('Authorization Policy description'),
              displayName: 'Authorization Policy name',
              etag: 'new-etag-token',
              id: 'authorization-policy-id',
              updateTime: new Date(Date.UTC(2022, 6, 21, 14, 56)),
            },
          ),
        );
      });
    });
  });

  describe('when a different Authorization Policy is returned', () => {
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
                id: 'different-authorization-policy-id',
                updateTime: Utils.dateToTimestamp(new Date(Date.UTC(2022, 6, 21, 14, 56))),
                bookmark: 'bookmark-token',
                createdBy: 'Lorem ipsum - creator',
                updatedBy: 'Lorem ipsum - updater',
                locationId: 'location-id',
              });
            }
            return {} as SurfaceCall;
          },
        );
      configExample.id = 'authorization-policy-id';
      return sdk
        .updateAuthorizationPolicyConfiguration(configExample)
        .catch((err) => (thrownError = err));
    });

    it('throws an error', () => {
      expect(thrownError.code).toEqual(SdkErrorCode.SDK_CODE_1);
      expect(thrownError.description).toBe(
        'Update returned with different id: req.iq=authorization-policy-id, res.id=different-authorization-policy-id',
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
      configExample.id = 'authorization-policy-id';
      return sdk.updateAuthorizationPolicyConfiguration(configExample).catch((err) => {
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
      configExample.id = 'authorization-policy-id';
      return sdk.updateAuthorizationPolicyConfiguration(configExample).catch((err) => {
        thrownError = err;
      });
    });

    it('throws an error', () => {
      expect(thrownError.message).toBe(
        'Update returned with different id: req.iq=authorization-policy-id, res.id=undefined',
      );
    });
  });
});

describe('deleteAuthorizationPolicyConfiguration', () => {
  describe('when no error is returned', () => {
    let deleteConfigNodeSpy: jest.SpyInstance;
    let sdk: ConfigClient;
    let returnedValue: boolean;

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
        configExample.id = 'authorization-policy-id';
        returnedValue = await sdk.deleteAuthorizationPolicyConfiguration(configExample);
      });

      it('sends correct request', () => {
        expect(deleteConfigNodeSpy).toBeCalledWith(
          {
            id: 'authorization-policy-id',
            bookmarks: [],
          },
          expect.any(Function),
        );
      });

      it('returns a correct value', () => {
        expect(returnedValue).toBe(true);
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
        configExample.id = 'authorization-policy-id';
        configExample.etag = 'etag-token';
        returnedValue = await sdk.deleteAuthorizationPolicyConfiguration(configExample);
      });

      it('sends correct request', () => {
        expect(deleteConfigNodeSpy).toBeCalledWith(
          {
            id: 'authorization-policy-id',
            etag: StringValue.fromJson('etag-token'),
            bookmarks: [],
          },
          expect.any(Function),
        );
      });

      it('returns a correct value', () => {
        expect(returnedValue).toBe(true);
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
      configExample.id = 'authorization-policy-id';
      return sdk.deleteAuthorizationPolicyConfiguration(configExample).catch((err) => {
        thrownError = err;
      });
    });

    it('throws an error', () => {
      expect(thrownError).toBe(error);
    });
  });
});
