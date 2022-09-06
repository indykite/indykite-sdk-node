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
import { OAuth2Client } from '../../model/config/oauth2Client/oauth2_client';
import { AuthStyle, ProviderType } from '../../../grpc/indykite/config/v1beta1/model';
import { StringValue } from '../../../grpc/google/protobuf/wrappers';
import { serviceAccountTokenMock } from '../../utils/test_utils';

let configExample: OAuth2Client;

beforeEach(() => {
  configExample = new OAuth2Client({
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
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('createOAuth2Client', () => {
  describe('when no error is returned', () => {
    let oauth2Client: OAuth2Client;
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
                id: 'new-oauth2-client-id',
                etag: 'etag-token',
                createTime: Utils.dateToTimestamp(new Date(Date.UTC(2022, 6, 21, 13, 5))),
                updateTime: Utils.dateToTimestamp(new Date(Date.UTC(2022, 6, 21, 13, 6))),
              });
            }
            return {} as SurfaceCall;
          },
        );
    });

    describe('when necessary values are sent only', () => {
      beforeEach(async () => {
        oauth2Client = await sdk.createOAuth2Client('location-id', configExample);
      });

      it('sends correct request', () => {
        expect(createConfigNodeSpy).toBeCalledWith(
          {
            name: 'oauth2-client-name',
            location: 'location-id',
            config: {
              oneofKind: 'oauth2ClientConfig',
              oauth2ClientConfig: {
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
              },
            },
          },
          expect.any(Function),
        );
      });

      it('returns a correct instance', () => {
        expect(oauth2Client.id).toBe('new-oauth2-client-id');
        expect(oauth2Client.etag).toBe('etag-token');
        expect(oauth2Client.name).toBe('oauth2-client-name');
        expect(oauth2Client.displayName).toBeUndefined();
        expect(oauth2Client.description).toBeUndefined();
      });
    });

    describe('when all possible values are sent', () => {
      beforeEach(async () => {
        configExample.displayName = 'OAuth2 Client Name';
        configExample.description = 'OAuth2 Client description';
        oauth2Client = await sdk.createOAuth2Client('location-id', configExample);
      });

      it('sends correct request', () => {
        expect(createConfigNodeSpy).toBeCalledWith(
          {
            name: 'oauth2-client-name',
            displayName: StringValue.fromJson('OAuth2 Client Name'),
            description: StringValue.fromJson('OAuth2 Client description'),
            location: 'location-id',
            config: {
              oneofKind: 'oauth2ClientConfig',
              oauth2ClientConfig: {
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
              },
            },
          },
          expect.any(Function),
        );
      });

      it('returns a correct instance', () => {
        expect(oauth2Client.id).toBe('new-oauth2-client-id');
        expect(oauth2Client.etag).toBe('etag-token');
        expect(oauth2Client.name).toBe('oauth2-client-name');
        expect(oauth2Client.displayName).toBe('OAuth2 Client Name');
        expect(oauth2Client.description).toBe('OAuth2 Client description');
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
      sdk.createOAuth2Client('location-id', configExample).catch((err) => {
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
      sdk.createOAuth2Client('location-id', configExample).catch((err) => {
        thrownError = err;
      });
    });

    it('throws an error', () => {
      expect(thrownError.message).toBe('No OAuth2 client response');
    });
  });
});

describe('readOAuth2Client', () => {
  describe('when no error is returned', () => {
    let oauth2Client: OAuth2Client;
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
                  displayName: 'OAuth2 Client Name',
                  description: StringValue.fromJson('OAuth2 Client description'),
                  etag: 'etag-token',
                  id: 'oauth2-client-id',
                  createTime: Utils.dateToTimestamp(new Date(Date.UTC(2022, 6, 21, 11, 13))),
                  updateTime: Utils.dateToTimestamp(new Date(Date.UTC(2022, 6, 21, 11, 14))),
                  customerId: 'customer-id',
                  appSpaceId: 'app-space-id',
                  tenantId: 'tenant-id',
                  name: 'oauth2-client-name',
                  config: {
                    oneofKind: 'oauth2ClientConfig',
                    oauth2ClientConfig: {
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
                    },
                  },
                },
              });
            }
            return {} as SurfaceCall;
          },
        );
      oauth2Client = await sdk.readOAuth2Client('oauth2-client-id-request');
    });

    it('sends correct request', () => {
      expect(readConfigNodeSpy).toBeCalledWith(
        {
          id: 'oauth2-client-id-request',
        },
        expect.any(Function),
      );
    });

    it('returns a correct instance', () => {
      expect(oauth2Client).toEqual({
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
        displayName: 'OAuth2 Client Name',
        description: 'OAuth2 Client description',
        etag: 'etag-token',
        id: 'oauth2-client-id',
        createTime: new Date(Date.UTC(2022, 6, 21, 11, 13)),
        updateTime: new Date(Date.UTC(2022, 6, 21, 11, 14)),
        customerId: 'customer-id',
        appSpaceId: 'app-space-id',
        tenantId: 'tenant-id',
        name: 'oauth2-client-name',
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
      sdk.readOAuth2Client('oauth2-client-id-request').catch((err) => {
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
      sdk.readOAuth2Client('oauth2-client-id-request').catch((err) => {
        thrownError = err;
      });
    });

    it('throws an error', () => {
      expect(thrownError.message).toBe('config_error_read_oauth2client');
    });
  });
});

describe('updateOAuth2Client', () => {
  describe('when no error is returned', () => {
    let updatedOAuth2Client: OAuth2Client;
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
                id: 'oauth2-client-id',
                updateTime: Utils.dateToTimestamp(new Date(Date.UTC(2022, 6, 21, 14, 56))),
              });
            }
            return {} as SurfaceCall;
          },
        );
    });

    describe('when necessary values are sent only', () => {
      beforeEach(async () => {
        configExample.id = 'oauth2-client-id';
        updatedOAuth2Client = await sdk.updateOAuth2Client(configExample);
      });

      it('sends correct request', () => {
        expect(updateConfigNodeSpy).toBeCalledWith(
          {
            id: 'oauth2-client-id',
            config: {
              oneofKind: 'oauth2ClientConfig',
              oauth2ClientConfig: {
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
              },
            },
          },
          expect.any(Function),
        );
      });

      it('returns a correct instance', () => {
        expect(updatedOAuth2Client).toEqual({
          id: 'oauth2-client-id',
          name: 'oauth2-client-name',
          etag: 'new-etag-token',
          updateTime: new Date(Date.UTC(2022, 6, 21, 14, 56)),
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
        });
      });
    });

    describe('when all possible values are sent', () => {
      beforeEach(async () => {
        configExample.displayName = 'OAuth2 Client Name';
        configExample.description = 'OAuth2 Client description';
        configExample.id = 'oauth2-client-id';
        configExample.etag = 'etag-token';
        updatedOAuth2Client = await sdk.updateOAuth2Client(configExample);
      });

      it('sends correct request', () => {
        expect(updateConfigNodeSpy).toBeCalledWith(
          {
            id: 'oauth2-client-id',
            etag: StringValue.fromJson('etag-token'),
            description: StringValue.fromJson('OAuth2 Client description'),
            displayName: StringValue.fromJson('OAuth2 Client Name'),
            config: {
              oneofKind: 'oauth2ClientConfig',
              oauth2ClientConfig: {
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
              },
            },
          },
          expect.any(Function),
        );
      });

      it('returns a correct instance', () => {
        expect(updatedOAuth2Client).toEqual({
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
          displayName: 'OAuth2 Client Name',
          description: 'OAuth2 Client description',
          etag: 'new-etag-token',
          id: 'oauth2-client-id',
          name: 'oauth2-client-name',
          updateTime: new Date(Date.UTC(2022, 6, 21, 14, 56)),
        });
      });
    });
  });

  describe('when a different oauth2 client is returned', () => {
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
                etag: '777',
                id: 'different-oauth2-client-id',
                updateTime: Utils.dateToTimestamp(new Date(2022, 2, 15, 13, 16)),
              });
            }
            return {} as SurfaceCall;
          },
        );
      configExample.id = 'oauth2-client-id';
      return sdk.updateOAuth2Client(configExample).catch((err) => (thrownError = err));
    });

    it('throws an error', () => {
      expect(thrownError.code).toEqual(SdkErrorCode.SDK_CODE_1);
      expect(thrownError.description).toBe(
        'Update returned with different id: req.iq=oauth2-client-id, res.id=different-oauth2-client-id',
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
      configExample.id = 'oauth2-client-id';
      sdk.updateOAuth2Client(configExample).catch((err) => {
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
      configExample.id = 'oauth2-client-id';
      sdk.updateOAuth2Client(configExample).catch((err) => {
        thrownError = err;
      });
    });

    it('throws an error', () => {
      expect(thrownError.message).toBe(
        'Update returned with different id: req.iq=oauth2-client-id, res.id=undefined',
      );
    });
  });
});

describe('deleteOAuth2Client', () => {
  describe('when no error is returned', () => {
    let deleteConfigNodeSpy: jest.SpyInstance;
    let sdk: ConfigClient;

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
                  id: 'oauth2-client-id',
                  etag: 'etag-id',
                });
              }
              return {} as SurfaceCall;
            },
          );
        configExample.id = 'oauth2-client-id';
        return sdk.deleteOAuth2Client(configExample);
      });

      it('sends correct request', () => {
        expect(deleteConfigNodeSpy).toBeCalledWith(
          {
            id: 'oauth2-client-id',
          },
          expect.any(Function),
        );
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
                  id: 'oauth2-client-id',
                  etag: 'new-etag-token',
                });
              }
              return {} as SurfaceCall;
            },
          );
        configExample.id = 'oauth2-client-id';
        configExample.etag = 'etag-token';
        return sdk.deleteOAuth2Client(configExample);
      });

      it('sends correct request', () => {
        expect(deleteConfigNodeSpy).toBeCalledWith(
          {
            id: 'oauth2-client-id',
            etag: StringValue.fromJson('etag-token'),
          },
          expect.any(Function),
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
      configExample.id = 'oauth2-client-id';
      sdk.deleteOAuth2Client(configExample).catch((err) => {
        thrownError = err;
      });
    });

    it('throws an error', () => {
      expect(thrownError).toBe(error);
    });
  });
});
