import { CallOptions, Metadata } from '@grpc/grpc-js';
import { ServiceError, SurfaceCall } from '@grpc/grpc-js/build/src/call';
import { Status } from '@grpc/grpc-js/build/src/constants';
import {
  CreateOAuth2ProviderResponse,
  DeleteOAuth2ProviderResponse,
  ReadOAuth2ProviderResponse,
  UpdateOAuth2ProviderResponse,
} from '../../../grpc/indykite/config/v1beta1/config_management_api';
import { ConfigClient } from '../../config';
import { SdkError, SdkErrorCode } from '../../error';
import { Utils } from '../../utils/utils';
import { OAuth2Provider } from '../../model/config/oauth2_provider';
import {
  GrantType,
  OAuth2ProviderConfig,
  ResponseType,
  TokenEndpointAuthMethod,
} from '../../model/config/oauth2_provider_config';
import { serviceAccountTokenMock } from '../../utils/test_utils';

let configExample: OAuth2ProviderConfig;

beforeEach(() => {
  configExample = new OAuth2ProviderConfig({
    grantTypes: [GrantType.AUTHORIZATION_CODE],
    responseTypes: [ResponseType.CODE],
    scopes: ['openid'],
    tokenEndpointAuthMethod: [TokenEndpointAuthMethod.CLIENT_SECRET_BASIC],
    tokenEndpointAuthSigningAlg: ['ES256', 'RS256'],
    frontChannelLoginUri: { default: 'https://example.com/login/oauth2' },
    frontChannelConsentUri: { default: 'https://example.com/consent' },
  });
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('createOAuth2Provider', () => {
  describe('when no error is returned', () => {
    let oauth2Provider: OAuth2Provider;
    let createOAuth2ProviderSpy: jest.SpyInstance;
    let sdk: ConfigClient;

    beforeEach(async () => {
      sdk = await ConfigClient.createInstance(JSON.stringify(serviceAccountTokenMock));
      createOAuth2ProviderSpy = jest
        .spyOn(sdk['client'], 'createOAuth2Provider')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response: CreateOAuth2ProviderResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(null, {
                id: 'new-oauth2-provider-id',
                etag: '111',
                bookmark: 'bookmark-token',
              });
            }
            return {} as SurfaceCall;
          },
        );
    });

    describe('when necessary values are sent only', () => {
      beforeEach(async () => {
        oauth2Provider = await sdk.createOAuth2Provider(
          'app-space-id',
          'oauth2-provider-name',
          configExample,
        );
      });

      it('sends correct request', () => {
        expect(createOAuth2ProviderSpy).toBeCalledWith(
          {
            appSpaceId: 'app-space-id',
            name: 'oauth2-provider-name',
            config: {
              grantTypes: [GrantType.AUTHORIZATION_CODE],
              responseTypes: [ResponseType.CODE],
              scopes: ['openid'],
              tokenEndpointAuthMethod: [TokenEndpointAuthMethod.CLIENT_SECRET_BASIC],
              tokenEndpointAuthSigningAlg: ['ES256', 'RS256'],
              frontChannelLoginUri: { default: 'https://example.com/login/oauth2' },
              frontChannelConsentUri: { default: 'https://example.com/consent' },
              requestObjectSigningAlg: '',
              requestUris: [],
            },
            bookmarks: [],
          },
          expect.any(Function),
        );
      });

      it('returns a correct instance', () => {
        expect(oauth2Provider.id).toBe('new-oauth2-provider-id');
        expect(oauth2Provider.appSpaceId).toBe('app-space-id');
        expect(oauth2Provider.etag).toBe('111');
        expect(oauth2Provider.name).toBe('oauth2-provider-name');
        expect(oauth2Provider.displayName).toBeUndefined();
        expect(oauth2Provider.description).toBeUndefined();
      });
    });

    describe('when all possible values are sent', () => {
      beforeEach(async () => {
        oauth2Provider = await sdk.createOAuth2Provider(
          'app-space-id',
          'oauth2-provider-name',
          configExample,
          'Display Name',
          'Description',
        );
      });

      it('sends correct request', () => {
        expect(createOAuth2ProviderSpy).toBeCalledWith(
          {
            appSpaceId: 'app-space-id',
            name: 'oauth2-provider-name',
            config: {
              grantTypes: [GrantType.AUTHORIZATION_CODE],
              responseTypes: [ResponseType.CODE],
              scopes: ['openid'],
              tokenEndpointAuthMethod: [TokenEndpointAuthMethod.CLIENT_SECRET_BASIC],
              tokenEndpointAuthSigningAlg: ['ES256', 'RS256'],
              frontChannelLoginUri: { default: 'https://example.com/login/oauth2' },
              frontChannelConsentUri: { default: 'https://example.com/consent' },
              requestObjectSigningAlg: '',
              requestUris: [],
            },
            displayName: { value: 'Display Name' },
            description: { value: 'Description' },
            bookmarks: [],
          },
          expect.any(Function),
        );
      });

      it('returns a correct instance', () => {
        expect(oauth2Provider.id).toBe('new-oauth2-provider-id');
        expect(oauth2Provider.appSpaceId).toBe('app-space-id');
        expect(oauth2Provider.etag).toBe('111');
        expect(oauth2Provider.name).toBe('oauth2-provider-name');
        expect(oauth2Provider.displayName).toBe('Display Name');
        expect(oauth2Provider.description).toBe('Description');
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
        .spyOn(sdk['client'], 'createOAuth2Provider')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response?: CreateOAuth2ProviderResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(error);
            }
            return {} as SurfaceCall;
          },
        );
      sdk
        .createOAuth2Provider('app-space-id', 'oauth2-provider-name', configExample)
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
        .spyOn(sdk['client'], 'createOAuth2Provider')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response?: CreateOAuth2ProviderResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(null);
            }
            return {} as SurfaceCall;
          },
        );
      sdk
        .createOAuth2Provider('app-space-id', 'oauth2-provider-name', configExample)
        .catch((err) => {
          thrownError = err;
        });
    });

    it('throws an error', () => {
      expect(thrownError.message).toBe('No OAuth2 provider response');
    });
  });
});

describe('readOAuth2Provider', () => {
  describe('when no error is returned', () => {
    let oauth2Provider: OAuth2Provider;
    let readOAuth2ProviderSpy: jest.SpyInstance;

    beforeEach(async () => {
      const sdk = await ConfigClient.createInstance(JSON.stringify(serviceAccountTokenMock));
      readOAuth2ProviderSpy = jest
        .spyOn(sdk['client'], 'readOAuth2Provider')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response: ReadOAuth2ProviderResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(null, {
                oauth2Provider: {
                  id: 'oauth2-provider-id',
                  name: 'oauth2-provider-name',
                  etag: 'etag-token',
                  displayName: 'OAuth2 Provider Name',
                  createTime: Utils.dateToTimestamp(new Date(2022, 5, 28, 11, 54)),
                  updateTime: Utils.dateToTimestamp(new Date(2022, 5, 28, 11, 55)),
                  deleteTime: Utils.dateToTimestamp(new Date(2022, 5, 28, 11, 56)),
                  destroyTime: Utils.dateToTimestamp(new Date(2022, 5, 28, 11, 57)),
                  customerId: 'customer-id',
                  appSpaceId: 'app-space-id',
                  config: configExample.marshal(),
                },
              });
            }
            return {} as SurfaceCall;
          },
        );
      oauth2Provider = await sdk.readOAuth2Provider('oauth2-provider-id-request');
    });

    it('sends correct request', () => {
      expect(readOAuth2ProviderSpy).toBeCalledWith(
        {
          id: 'oauth2-provider-id-request',
          bookmarks: [],
        },
        expect.any(Function),
      );
    });

    it('returns a correct instance', () => {
      expect(oauth2Provider).toEqual({
        id: 'oauth2-provider-id',
        name: 'oauth2-provider-name',
        etag: 'etag-token',
        displayName: 'OAuth2 Provider Name',
        createTime: new Date(2022, 5, 28, 11, 54),
        updateTime: new Date(2022, 5, 28, 11, 55),
        deleteTime: new Date(2022, 5, 28, 11, 56),
        destroyTime: new Date(2022, 5, 28, 11, 57),
        customerId: 'customer-id',
        appSpaceId: 'app-space-id',
        config: expect.any(OAuth2ProviderConfig),
      });

      expect(oauth2Provider.config).toEqual({
        grantTypes: [GrantType.AUTHORIZATION_CODE],
        responseTypes: [ResponseType.CODE],
        scopes: ['openid'],
        tokenEndpointAuthMethod: [TokenEndpointAuthMethod.CLIENT_SECRET_BASIC],
        tokenEndpointAuthSigningAlg: ['ES256', 'RS256'],
        frontChannelLoginUri: { default: 'https://example.com/login/oauth2' },
        frontChannelConsentUri: { default: 'https://example.com/consent' },
        requestObjectSigningAlg: '',
        requestUris: [],
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
        .spyOn(sdk['client'], 'readOAuth2Provider')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response?: ReadOAuth2ProviderResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(error);
            }
            return {} as SurfaceCall;
          },
        );
      sdk.readOAuth2Provider('oauth2-provider-id-request').catch((err) => {
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
        .spyOn(sdk['client'], 'readOAuth2Provider')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response?: ReadOAuth2ProviderResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(null);
            }
            return {} as SurfaceCall;
          },
        );
      sdk.readOAuth2Provider('oauth2-provider-id-request').catch((err) => {
        thrownError = err;
      });
    });

    it('throws an error', () => {
      expect(thrownError.message).toBe('No OAuth2 provider response');
    });
  });
});

describe('updateOAuth2Provider', () => {
  describe('when no error is returned', () => {
    let updatedOAuth2Provider: OAuth2Provider;
    let updateOAuth2ProviderSpy: jest.SpyInstance;
    let sdk: ConfigClient;

    beforeEach(async () => {
      sdk = await ConfigClient.createInstance(JSON.stringify(serviceAccountTokenMock));
      updateOAuth2ProviderSpy = jest
        .spyOn(sdk['client'], 'updateOAuth2Provider')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response: UpdateOAuth2ProviderResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(null, {
                etag: 'new-etag-id',
                id: 'oauth2-provider-id',
                updateTime: Utils.dateToTimestamp(new Date(2022, 2, 15, 13, 16)),
                bookmark: 'bookmark-token',
              });
            }
            return {} as SurfaceCall;
          },
        );
    });

    describe('when necessary values are sent only', () => {
      beforeEach(async () => {
        const oauth2Provider = new OAuth2Provider(
          'oauth2-provider-id',
          'oauth2-provider-name',
          'app-space-id',
        );
        updatedOAuth2Provider = await sdk.updateOAuth2Provider(oauth2Provider);
      });

      it('sends correct request', () => {
        expect(updateOAuth2ProviderSpy).toBeCalledWith(
          {
            id: 'oauth2-provider-id',
            bookmarks: [],
          },
          expect.any(Function),
        );
      });

      it('returns a correct instance', () => {
        expect(updatedOAuth2Provider).toEqual({
          id: 'oauth2-provider-id',
          name: 'oauth2-provider-name',
          appSpaceId: 'app-space-id',
          etag: 'new-etag-id',
          updateTime: new Date(2022, 2, 15, 13, 16),
        });
      });
    });

    describe('when all possible values are sent', () => {
      beforeEach(async () => {
        const oauth2Provider = new OAuth2Provider(
          'oauth2-provider-id',
          'oauth2-provider-name',
          'app-space-id',
          'OAuth2 Provider Name',
          'Description',
          'etag-token',
          configExample,
          new Date(2022, 5, 28, 11, 54),
          new Date(2022, 5, 28, 11, 55),
          new Date(2022, 5, 28, 11, 56),
          new Date(2022, 5, 28, 11, 57),
          'customer-id',
        );
        updatedOAuth2Provider = await sdk.updateOAuth2Provider(oauth2Provider);
      });

      it('sends correct request', () => {
        expect(updateOAuth2ProviderSpy).toBeCalledWith(
          {
            id: 'oauth2-provider-id',
            etag: { value: 'etag-token' },
            displayName: { value: 'OAuth2 Provider Name' },
            description: { value: 'Description' },
            config: configExample.marshal(),
            bookmarks: [],
          },
          expect.any(Function),
        );
      });

      it('returns a correct instance', () => {
        expect(updatedOAuth2Provider).toEqual({
          id: 'oauth2-provider-id',
          name: 'oauth2-provider-name',
          etag: 'new-etag-id',
          displayName: 'OAuth2 Provider Name',
          description: 'Description',
          createTime: new Date(2022, 5, 28, 11, 54),
          updateTime: new Date(2022, 2, 15, 13, 16),
          deleteTime: new Date(2022, 5, 28, 11, 56),
          destroyTime: new Date(2022, 5, 28, 11, 57),
          customerId: 'customer-id',
          appSpaceId: 'app-space-id',
          config: expect.any(OAuth2ProviderConfig),
        });
      });
    });
  });

  describe('when a different oauth2 provider is returned', () => {
    let thrownError: SdkError;

    beforeEach(async () => {
      const sdk = await ConfigClient.createInstance(JSON.stringify(serviceAccountTokenMock));
      jest
        .spyOn(sdk['client'], 'updateOAuth2Provider')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response: UpdateOAuth2ProviderResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(null, {
                etag: '777',
                id: 'different-oauth2-provider-id',
                updateTime: Utils.dateToTimestamp(new Date(2022, 2, 15, 13, 16)),
                bookmark: 'bookmark-token',
              });
            }
            return {} as SurfaceCall;
          },
        );
      const oauth2Provider = new OAuth2Provider(
        'oauth2-provider-id',
        'oauth2-provider-name',
        'app-space-id',
      );
      return sdk.updateOAuth2Provider(oauth2Provider).catch((err) => (thrownError = err));
    });

    it('throws an error', () => {
      expect(thrownError.code).toEqual(SdkErrorCode.SDK_CODE_1);
      expect(thrownError.description).toBe(
        'Update returned with different id: req.iq=oauth2-provider-id, res.id=different-oauth2-provider-id',
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
        .spyOn(sdk['client'], 'updateOAuth2Provider')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response?: UpdateOAuth2ProviderResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(error);
            }
            return {} as SurfaceCall;
          },
        );
      const oauth2Provider = new OAuth2Provider(
        'oauth2-provider-id',
        'oauth2-provider-name',
        'app-space-id',
      );
      sdk.updateOAuth2Provider(oauth2Provider).catch((err) => {
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
        .spyOn(sdk['client'], 'updateOAuth2Provider')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response?: UpdateOAuth2ProviderResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(null);
            }
            return {} as SurfaceCall;
          },
        );
      const oauth2Application = new OAuth2Provider(
        'oauth2-provider-id',
        'oauth2-provider-name',
        'app-space-id',
      );
      sdk.updateOAuth2Provider(oauth2Application).catch((err) => {
        thrownError = err;
      });
    });

    it('throws an error', () => {
      expect(thrownError.message).toBe(
        'Update returned with different id: req.iq=oauth2-provider-id, res.id=undefined',
      );
    });
  });
});

describe('deleteOAuth2Provider', () => {
  describe('when no error is returned', () => {
    let deleteOAuth2ProviderSpy: jest.SpyInstance;
    let sdk: ConfigClient;

    beforeEach(async () => {
      sdk = await ConfigClient.createInstance(JSON.stringify(serviceAccountTokenMock));
      deleteOAuth2ProviderSpy = jest
        .spyOn(sdk['client'], 'deleteOAuth2Provider')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response: DeleteOAuth2ProviderResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(null, {
                bookmark: 'bookmark-token',
              });
            }
            return {} as SurfaceCall;
          },
        );
      return sdk.deleteOAuth2Provider('oauth2-provider-id');
    });

    it('sends correct request', () => {
      expect(deleteOAuth2ProviderSpy).toBeCalledWith(
        {
          id: 'oauth2-provider-id',
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
      const sdk = await ConfigClient.createInstance(JSON.stringify(serviceAccountTokenMock));
      jest
        .spyOn(sdk['client'], 'deleteOAuth2Provider')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response?: DeleteOAuth2ProviderResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(error);
            }
            return {} as SurfaceCall;
          },
        );
      sdk.deleteOAuth2Provider('oauth2-provider-id').catch((err) => {
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
        .spyOn(sdk['client'], 'deleteOAuth2Provider')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response?: DeleteOAuth2ProviderResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(null);
            }
            return {} as SurfaceCall;
          },
        );
      sdk.deleteOAuth2Provider('oauth2-provider-id').catch((err) => {
        thrownError = err;
      });
    });

    it('throws an error', () => {
      expect(thrownError.message).toBe('No OAuth2 provider response');
    });
  });
});
