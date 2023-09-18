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
import { ConfigClientV2 } from '../../config_v2';
import { SdkError, SdkErrorCode } from '../../error';
import { Utils } from '../../utils/utils';
import { StringValue } from '../../../grpc/google/protobuf/wrappers';
import { serviceAccountTokenMock } from '../../utils/test_utils';
import {
  AuthFlowConfig_Format,
  AuthStyle,
  AuthenticatorAttachment,
  AuthorizationPolicyConfig_Status,
  ConveyancePreference,
  ProviderType,
  UserVerificationRequirement,
} from '../../../grpc/indykite/config/v1beta1/model';
import {
  AuthFlow,
  AuthorizationPolicy,
  EmailServiceConfigType,
  OAuth2Client,
  WebAuthnProvider,
} from '../../model';

let createConfigExample: CreateConfigNodeRequest;
let updateConfigExample: UpdateConfigNodeRequest;
let deleteConfigExample: DeleteConfigNodeRequest;

beforeEach(() => {
  createConfigExample = CreateConfigNodeRequest.fromJson({
    location: 'location-id',
    name: 'authFlowConfig',
    bookmarks: [],
    displayName: 'Webauthn Provider Name',
    description: 'Webauthn Provider description',
  });
  createConfigExample.config = {
    oneofKind: undefined,
  };
  updateConfigExample = {
    id: 'configNode-id',
    bookmarks: [],
    etag: StringValue.fromJson('etag-token'),
    displayName: StringValue.fromJson('WebAuthn Provider name'),
    description: StringValue.fromJson('WebAuthn Provider description'),
    config: {
      oneofKind: undefined,
    },
  } as UpdateConfigNodeRequest;
  updateConfigExample.config = {
    oneofKind: undefined,
  };
  const configAuthFlowExample = new AuthFlow(
    'authFlowConfig',
    AuthFlowConfig_Format.BARE_JSON,
    Buffer.from('{}'),
    false,
  );
  configAuthFlowExample.id = 'configNode-id';
  configAuthFlowExample.etag = 'etag-token';
  deleteConfigExample = ConfigClientV2.newDeleteConfigNodeRequest(configAuthFlowExample);
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
  const configEmailServiceConfigTypeExample: EmailServiceConfigType = new EmailServiceConfigType(
    'emailServiceConfig',
    'sdfsdfsdf', // apiKey:
    false, //sandboxMode:
  );
  configEmailServiceConfigTypeExample.host = StringValue.fromJson('https://example.com/mail');
  const configWebAuthnProviderExample = new WebAuthnProvider({
    name: 'webauthn-provider',
    attestationPreference: ConveyancePreference.DIRECT,
    authenticatorAttachment: AuthenticatorAttachment.CROSS_PLATFORM,
    relyingParties: {
      'http://localhost:3000': 'default',
    },
    requireResidentKey: true,
    userVerification: UserVerificationRequirement.REQUIRED,
    authenticationTimeout: 60,
    registrationTimeout: 120,
  });
  const configOAuth2ClientExample = new OAuth2Client({
    providerType: ProviderType.LINKEDIN_COM,
    clientId: 'client-id',
    clientSecret: 'client-secret',
    redirectUri: ['https://example.com/page'],
    defaultScopes: ['openid'],
    allowedScopes: ['openid', 'email'],
    allowSignup: true,
    issuer: 'issuer',
    authorizationEndpoint: 'https://example.com/authorization',
    tokenEndpoint: 'https://example.com/token',
    discoveryUrl: 'https://example.com/discovery',
    userinfoEndpoint: 'https://example.com/info',
    jwksUri: 'https://example.com/jwks',
    imageUrl: 'https://example.com/image.png',
    tenant: 'tenant',
    hostedDomain: 'https://example.com',
    authStyle: AuthStyle.AUTO_DETECT,
    name: 'oauth2-client-name',
  });
  ConfigClientV2.newUpdateConfigNodeRequest(configAuthFlowExample);
  ConfigClientV2.newUpdateConfigNodeRequest(configAuthorizationPolicyExample);
  ConfigClientV2.newUpdateConfigNodeRequest(configEmailServiceConfigTypeExample);
  ConfigClientV2.newUpdateConfigNodeRequest(configWebAuthnProviderExample);
  ConfigClientV2.newUpdateConfigNodeRequest(configOAuth2ClientExample);
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('createConfigNode', () => {
  describe('when no error is returned', () => {
    let configNodeResponse: CreateConfigNodeResponse;
    let createConfigNodeSpy: jest.SpyInstance;
    let sdk: ConfigClientV2;

    beforeEach(async () => {
      sdk = await ConfigClientV2.createInstance(JSON.stringify(serviceAccountTokenMock));
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
        expect(createConfigNodeSpy).toBeCalledWith(
          {
            name: 'authFlowConfig',
            location: 'location-id',
            description: {
              value: 'Webauthn Provider description',
            },
            displayName: { value: 'Webauthn Provider Name' },
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
        expect(createConfigNodeSpy).toBeCalledWith(
          {
            name: 'authFlowConfig',
            location: 'location-id',
            bookmarks: [],
            description: {
              value: 'Webauthn Provider description',
            },
            displayName: { value: 'Webauthn Provider Name' },
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
      const sdk = await ConfigClientV2.createInstance(JSON.stringify(serviceAccountTokenMock));
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
      const sdk = await ConfigClientV2.createInstance(JSON.stringify(serviceAccountTokenMock));
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
      const sdk = await ConfigClientV2.createInstance(JSON.stringify(serviceAccountTokenMock));
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
                  tenantId: 'tenant-id',
                  name: 'instance-name',
                  config: {
                    oneofKind: undefined,
                  },
                  version: "1"
                },
              });
            }
            return {} as SurfaceCall;
          },
        );
      readConfigNodeResponse = await sdk.readConfigNode(
        ConfigClientV2.newReadConfigNodeRequest('configNode-id-request'),
      );
      // configNodeResponse = ConfigNodeFactory.createInstance(readConfigNodeResponse.configNode);
    });

    it('sends correct request', () => {
      expect(readConfigNodeSpy).toBeCalledWith(
        {
          id: 'configNode-id-request',
          bookmarks: [],
          version: "",
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
          tenantId: 'tenant-id',
          createdBy: 'Lorem ipsum - creator',
          updatedBy: 'Lorem ipsum - updater',
          version: "1",
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
      const sdk = await ConfigClientV2.createInstance(JSON.stringify(serviceAccountTokenMock));
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
        .readConfigNode(ConfigClientV2.newReadConfigNodeRequest('configNode-id-request'))
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
        .readConfigNode(ConfigClientV2.newReadConfigNodeRequest('configNode-id-request'))
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
    let sdk: ConfigClientV2;

    beforeEach(async () => {
      sdk = await ConfigClientV2.createInstance(JSON.stringify(serviceAccountTokenMock));
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
        expect(updateConfigNodeSpy).toBeCalledWith(
          {
            id: 'configNode-id',
            bookmarks: [],
            config: {
              oneofKind: undefined,
            },
            description: {
              value: 'WebAuthn Provider description',
            },
            displayName: {
              value: 'WebAuthn Provider name',
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
        expect(updateConfigNodeSpy).toBeCalledWith(
          {
            id: 'configNode-id',
            description: {
              value: 'WebAuthn Provider description',
            },
            displayName: {
              value: 'WebAuthn Provider name',
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

  describe('when a different webauthn provider is returned', () => {
    let thrownError: SdkError;

    beforeEach(async () => {
      const sdk = await ConfigClientV2.createInstance(JSON.stringify(serviceAccountTokenMock));
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
      const sdk = await ConfigClientV2.createInstance(JSON.stringify(serviceAccountTokenMock));
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
      const sdk = await ConfigClientV2.createInstance(JSON.stringify(serviceAccountTokenMock));
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
    let sdk: ConfigClientV2;
    let returnedValue: DeleteConfigNodeResponse;

    describe('when necessary values are sent only', () => {
      beforeEach(async () => {
        sdk = await ConfigClientV2.createInstance(JSON.stringify(serviceAccountTokenMock));
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
        expect(deleteConfigNodeSpy).toBeCalledWith(
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
        sdk = await ConfigClientV2.createInstance(JSON.stringify(serviceAccountTokenMock));
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
        expect(deleteConfigNodeSpy).toBeCalledWith(
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
      const sdk = await ConfigClientV2.createInstance(JSON.stringify(serviceAccountTokenMock));
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
      const sdk = await ConfigClientV2.createInstance(JSON.stringify(serviceAccountTokenMock));
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
      const sdk = await ConfigClientV2.createInstance(JSON.stringify(serviceAccountTokenMock));
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
                configNodes: [{
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
                  tenantId: 'tenant-id',
                  name: 'instance-name',
                  config: {
                    oneofKind: undefined,
                  },
                  version:"1"
                }],
              });
            }
            return {} as SurfaceCall;
          },
        );
        listConfigNodeVersionsResponse = await sdk.listConfigNodeVersions(
        ConfigClientV2.newReadConfigNodeRequest('configNode-id-request'),
      );
      // configNodeResponse = ConfigNodeFactory.createInstance(readConfigNodeResponse.configNode);
    });

    it('sends correct request', () => {
      expect(listConfigNodeVersionsSpy).toBeCalledWith(
        {
          id: 'configNode-id-request',
          version: "",
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
      expect(listConfigNodeVersionsResponse.configNodes[0].tenantId).toEqual('tenant-id');
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
      return sdk
        .listConfigNodeVersions({id:'configNode-id-request'})
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
      return sdk
        .listConfigNodeVersions({id:'configNode-id-request'})
        .catch((err) => {
          thrownError = err;
        });
    });

    it('throws an error', () => {
      expect(thrownError.message).toBe('No ConfigNode response.');
    });
  });
});