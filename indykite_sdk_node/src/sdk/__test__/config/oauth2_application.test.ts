import { CallOptions, Metadata } from '@grpc/grpc-js';
import { ServiceError, SurfaceCall } from '@grpc/grpc-js/build/src/call';
import { Status } from '@grpc/grpc-js/build/src/constants';
import {
  CreateOAuth2ApplicationResponse,
  DeleteOAuth2ApplicationResponse,
  ReadOAuth2ApplicationResponse,
  UpdateOAuth2ApplicationResponse,
} from '../../../grpc/indykite/config/v1beta1/config_management_api';
import { ConfigClient } from '../../config';
import { SdkError, SdkErrorCode } from '../../error';
import { Utils } from '../../utils/utils';
import { OAuth2Application } from '../../model/config/oauth2_application';
import {
  OAuth2ApplicationConfig,
  ClientSubjectType,
  TokenEndpointAuthMethod,
} from '../../model/config/oauth2_application_config';
import { serviceAccountTokenMock } from '../../utils/test_utils';

let configExample: OAuth2ApplicationConfig;

beforeEach(() => {
  configExample = new OAuth2ApplicationConfig({
    clientId: 'client-id-token',
    displayName: 'Display Name',
    redirectUris: ['http://localhost:3000'],
    owner: 'Owner',
    policyUri: 'http://localhost:3000/policy',
    termsOfServiceUri: 'http://localhost:3000/tos',
    clientUri: 'http://localhost:3000/client',
    logoUri: 'http://localhost:3000/logo.png',
    userSupportEmailAddress: 'support@localhost',
    subjectType: ClientSubjectType.PUBLIC,
    scopes: ['openid'],
    tokenEndpointAuthMethod: TokenEndpointAuthMethod.CLIENT_SECRET_BASIC,
    tokenEndpointAuthSigningAlg: 'ES256',
  });
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('createOAuth2Application', () => {
  describe('when no error is returned', () => {
    let oauth2Application: OAuth2Application;
    let createOAuth2ApplicationSpy: jest.SpyInstance;
    let sdk: ConfigClient;

    beforeEach(async () => {
      sdk = await ConfigClient.createInstance(JSON.stringify(serviceAccountTokenMock));
      createOAuth2ApplicationSpy = jest
        .spyOn(sdk['client'], 'createOAuth2Application')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response: CreateOAuth2ApplicationResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(null, {
                id: 'new-oauth2-app-id',
                etag: '111',
                clientId: 'client-id-token',
                clientSecret: 'client-secret-token',
                bookmark: 'bookmark-token',
              });
            }
            return {} as SurfaceCall;
          },
        );
    });

    describe('when necessary values are sent only', () => {
      beforeEach(async () => {
        oauth2Application = await sdk.createOAuth2Application(
          'oauth2-provider-id',
          'oauth2-app-name',
          configExample,
        );
      });

      it('sends correct request', () => {
        expect(createOAuth2ApplicationSpy).toBeCalledWith(
          {
            oauth2ProviderId: 'oauth2-provider-id',
            name: 'oauth2-app-name',
            config: {
              clientId: 'client-id-token',
              displayName: 'Display Name',
              redirectUris: ['http://localhost:3000'],
              owner: 'Owner',
              policyUri: 'http://localhost:3000/policy',
              termsOfServiceUri: 'http://localhost:3000/tos',
              clientUri: 'http://localhost:3000/client',
              logoUri: 'http://localhost:3000/logo.png',
              userSupportEmailAddress: 'support@localhost',
              subjectType: ClientSubjectType.PUBLIC,
              scopes: ['openid'],
              tokenEndpointAuthMethod: TokenEndpointAuthMethod.CLIENT_SECRET_BASIC,
              tokenEndpointAuthSigningAlg: 'ES256',
              description: '',
              allowedCorsOrigins: [],
              additionalContacts: [],
              sectorIdentifierUri: '',
              grantTypes: [],
              responseTypes: [],
              audiences: [],
              userinfoSignedResponseAlg: '',
            },
            bookmarks: [],
          },
          expect.any(Function),
        );
      });

      it('returns a correct instance', () => {
        expect(oauth2Application.id).toBe('new-oauth2-app-id');
        expect(oauth2Application.etag).toBe('111');
        expect(oauth2Application.name).toBe('oauth2-app-name');
        expect(oauth2Application.displayName).toBeUndefined();
        expect(oauth2Application.description).toBeUndefined();
      });
    });

    describe('when all possible values are sent', () => {
      beforeEach(async () => {
        oauth2Application = await sdk.createOAuth2Application(
          'oauth2-provider-id',
          'oauth2-app-name',
          configExample,
          'Display Name',
          'Description',
        );
      });

      it('sends correct request', () => {
        expect(createOAuth2ApplicationSpy).toBeCalledWith(
          {
            oauth2ProviderId: 'oauth2-provider-id',
            name: 'oauth2-app-name',
            config: {
              clientId: 'client-id-token',
              displayName: 'Display Name',
              redirectUris: ['http://localhost:3000'],
              owner: 'Owner',
              policyUri: 'http://localhost:3000/policy',
              termsOfServiceUri: 'http://localhost:3000/tos',
              clientUri: 'http://localhost:3000/client',
              logoUri: 'http://localhost:3000/logo.png',
              userSupportEmailAddress: 'support@localhost',
              subjectType: ClientSubjectType.PUBLIC,
              scopes: ['openid'],
              tokenEndpointAuthMethod: TokenEndpointAuthMethod.CLIENT_SECRET_BASIC,
              tokenEndpointAuthSigningAlg: 'ES256',
              description: '',
              allowedCorsOrigins: [],
              additionalContacts: [],
              sectorIdentifierUri: '',
              grantTypes: [],
              responseTypes: [],
              audiences: [],
              userinfoSignedResponseAlg: '',
            },
            displayName: { value: 'Display Name' },
            description: { value: 'Description' },
            bookmarks: [],
          },
          expect.any(Function),
        );
      });

      it('returns a correct instance', () => {
        expect(oauth2Application.id).toBe('new-oauth2-app-id');
        expect(oauth2Application.etag).toBe('111');
        expect(oauth2Application.name).toBe('oauth2-app-name');
        expect(oauth2Application.displayName).toBe('Display Name');
        expect(oauth2Application.description).toBe('Description');
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
        .spyOn(sdk['client'], 'createOAuth2Application')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response?: CreateOAuth2ApplicationResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(error);
            }
            return {} as SurfaceCall;
          },
        );
      sdk
        .createOAuth2Application('oauth2-provider-id', 'oauth2-app-name', configExample)
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
        .spyOn(sdk['client'], 'createOAuth2Application')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response?: CreateOAuth2ApplicationResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(null);
            }
            return {} as SurfaceCall;
          },
        );
      sdk
        .createOAuth2Application('oauth2-provider-id', 'oauth2-app-name', configExample)
        .catch((err) => {
          thrownError = err;
        });
    });

    it('throws an error', () => {
      expect(thrownError.message).toBe('No OAuth2 client response');
    });
  });
});

describe('readOAuth2Application', () => {
  describe('when no error is returned', () => {
    let oauth2Application: OAuth2Application;
    let readOAuth2ApplicationSpy: jest.SpyInstance;

    beforeEach(async () => {
      const sdk = await ConfigClient.createInstance(JSON.stringify(serviceAccountTokenMock));
      readOAuth2ApplicationSpy = jest
        .spyOn(sdk['client'], 'readOAuth2Application')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response: ReadOAuth2ApplicationResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(null, {
                oauth2Application: {
                  id: 'oauth2-application-id',
                  name: 'oauth2-application-name',
                  etag: 'etag-token',
                  displayName: 'OAuth2 Application Name',
                  createTime: Utils.dateToTimestamp(new Date(2022, 5, 28, 11, 54)),
                  updateTime: Utils.dateToTimestamp(new Date(2022, 5, 28, 11, 55)),
                  deleteTime: Utils.dateToTimestamp(new Date(2022, 5, 28, 11, 56)),
                  destroyTime: Utils.dateToTimestamp(new Date(2022, 5, 28, 11, 57)),
                  customerId: 'customer-id',
                  appSpaceId: 'app-space-id',
                  oauth2ProviderId: 'oauth2-provider-id',
                  config: configExample.marshal(),
                },
              });
            }
            return {} as SurfaceCall;
          },
        );
      oauth2Application = await sdk.readOAuth2Application('oauth2-app-id-request');
    });

    it('sends correct request', () => {
      expect(readOAuth2ApplicationSpy).toBeCalledWith(
        {
          id: 'oauth2-app-id-request',
          bookmarks: [],
        },
        expect.any(Function),
      );
    });

    it('returns a correct instance', () => {
      expect(oauth2Application).toEqual({
        id: 'oauth2-application-id',
        name: 'oauth2-application-name',
        etag: 'etag-token',
        displayName: 'OAuth2 Application Name',
        createTime: new Date(2022, 5, 28, 11, 54),
        updateTime: new Date(2022, 5, 28, 11, 55),
        deleteTime: new Date(2022, 5, 28, 11, 56),
        destroyTime: new Date(2022, 5, 28, 11, 57),
        customerId: 'customer-id',
        appSpaceId: 'app-space-id',
        oauth2ProviderId: 'oauth2-provider-id',
        config: expect.any(OAuth2ApplicationConfig),
      });

      expect(oauth2Application.config).toEqual({
        clientId: 'client-id-token',
        displayName: 'Display Name',
        redirectUris: ['http://localhost:3000'],
        owner: 'Owner',
        policyUri: 'http://localhost:3000/policy',
        termsOfServiceUri: 'http://localhost:3000/tos',
        clientUri: 'http://localhost:3000/client',
        logoUri: 'http://localhost:3000/logo.png',
        userSupportEmailAddress: 'support@localhost',
        subjectType: ClientSubjectType.PUBLIC,
        scopes: ['openid'],
        tokenEndpointAuthMethod: TokenEndpointAuthMethod.CLIENT_SECRET_BASIC,
        tokenEndpointAuthSigningAlg: 'ES256',
        description: '',
        allowedCorsOrigins: [],
        additionalContacts: [],
        sectorIdentifierUri: '',
        grantTypes: [],
        responseTypes: [],
        audiences: [],
        userinfoSignedResponseAlg: '',
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
        .spyOn(sdk['client'], 'readOAuth2Application')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response?: ReadOAuth2ApplicationResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(error);
            }
            return {} as SurfaceCall;
          },
        );
      sdk.readOAuth2Application('oauth2-app-id-request').catch((err) => {
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
        .spyOn(sdk['client'], 'readOAuth2Application')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response?: ReadOAuth2ApplicationResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(null);
            }
            return {} as SurfaceCall;
          },
        );
      sdk.readOAuth2Application('oauth2-app-id-request').catch((err) => {
        thrownError = err;
      });
    });

    it('throws an error', () => {
      expect(thrownError.message).toBe('No OAuth2 client response');
    });
  });
});

describe('updateOAuth2Application', () => {
  describe('when no error is returned', () => {
    let updatedOAuth2Application: OAuth2Application;
    let updateOAuth2ApplicationSpy: jest.SpyInstance;
    let sdk: ConfigClient;

    beforeEach(async () => {
      sdk = await ConfigClient.createInstance(JSON.stringify(serviceAccountTokenMock));
      updateOAuth2ApplicationSpy = jest
        .spyOn(sdk['client'], 'updateOAuth2Application')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response: UpdateOAuth2ApplicationResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(null, {
                etag: 'new-etag-id',
                id: 'oauth2-app-id',
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
        const oauth2Application = new OAuth2Application('oauth2-app-id', 'oauth2-app-name');
        updatedOAuth2Application = await sdk.updateOAuth2Application(oauth2Application);
      });

      it('sends correct request', () => {
        expect(updateOAuth2ApplicationSpy).toBeCalledWith(
          {
            id: 'oauth2-app-id',
            bookmarks: [],
          },
          expect.any(Function),
        );
      });

      it('returns a correct instance', () => {
        expect(updatedOAuth2Application).toEqual({
          id: 'oauth2-app-id',
          name: 'oauth2-app-name',
          etag: 'new-etag-id',
          updateTime: new Date(2022, 2, 15, 13, 16),
        });
      });
    });

    describe('when all possible values are sent', () => {
      beforeEach(async () => {
        const oauth2Application = new OAuth2Application(
          'oauth2-app-id',
          'oauth2-app-name',
          'etag-token',
          'OAuth2 Application Name',
          'Description',
          new Date(2022, 5, 28, 11, 54),
          new Date(2022, 5, 28, 11, 55),
          new Date(2022, 5, 28, 11, 56),
          new Date(2022, 5, 28, 11, 57),
          'customer-id',
          'app-space-id',
          'oauth2-provider-id',
          configExample,
        );
        updatedOAuth2Application = await sdk.updateOAuth2Application(oauth2Application);
      });

      it('sends correct request', () => {
        expect(updateOAuth2ApplicationSpy).toBeCalledWith(
          {
            id: 'oauth2-app-id',
            etag: { value: 'etag-token' },
            displayName: { value: 'OAuth2 Application Name' },
            description: { value: 'Description' },
            config: configExample.marshal(),
            bookmarks: [],
          },
          expect.any(Function),
        );
      });

      it('returns a correct instance', () => {
        expect(updatedOAuth2Application).toEqual({
          id: 'oauth2-app-id',
          name: 'oauth2-app-name',
          etag: 'new-etag-id',
          displayName: 'OAuth2 Application Name',
          description: 'Description',
          createTime: new Date(2022, 5, 28, 11, 54),
          updateTime: new Date(2022, 2, 15, 13, 16),
          deleteTime: new Date(2022, 5, 28, 11, 56),
          destroyTime: new Date(2022, 5, 28, 11, 57),
          customerId: 'customer-id',
          appSpaceId: 'app-space-id',
          oauth2ProviderId: 'oauth2-provider-id',
          config: expect.any(OAuth2ApplicationConfig),
        });
      });
    });
  });

  describe('when a different oauth2 application is returned', () => {
    let thrownError: SdkError;

    beforeEach(async () => {
      const sdk = await ConfigClient.createInstance(JSON.stringify(serviceAccountTokenMock));
      jest
        .spyOn(sdk['client'], 'updateOAuth2Application')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response: UpdateOAuth2ApplicationResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(null, {
                etag: '777',
                id: 'different-oauth2-app-id',
                updateTime: Utils.dateToTimestamp(new Date(2022, 2, 15, 13, 16)),
                bookmark: 'bookmark-token',
              });
            }
            return {} as SurfaceCall;
          },
        );
      const oauth2Application = new OAuth2Application('oauth2-app-id', 'oauth2-app-name');
      return sdk.updateOAuth2Application(oauth2Application).catch((err) => (thrownError = err));
    });

    it('throws an error', () => {
      expect(thrownError.code).toEqual(SdkErrorCode.SDK_CODE_1);
      expect(thrownError.description).toBe(
        'Update returned with different id: req.iq=oauth2-app-id, res.id=different-oauth2-app-id',
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
        .spyOn(sdk['client'], 'updateOAuth2Application')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response?: UpdateOAuth2ApplicationResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(error);
            }
            return {} as SurfaceCall;
          },
        );
      const oauth2Application = new OAuth2Application('oauth2-app-id', 'oauth2-app-name');
      sdk.updateOAuth2Application(oauth2Application).catch((err) => {
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
        .spyOn(sdk['client'], 'updateOAuth2Application')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response?: UpdateOAuth2ApplicationResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(null);
            }
            return {} as SurfaceCall;
          },
        );
      const oauth2Application = new OAuth2Application('oauth2-app-id', 'oauth2-app-name');
      sdk.updateOAuth2Application(oauth2Application).catch((err) => {
        thrownError = err;
      });
    });

    it('throws an error', () => {
      expect(thrownError.message).toBe(
        'Update returned with different id: req.iq=oauth2-app-id, res.id=undefined',
      );
    });
  });
});

describe('deleteOAuth2Application', () => {
  describe('when no error is returned', () => {
    let deleteOAuth2ApplicationSpy: jest.SpyInstance;
    let sdk: ConfigClient;

    beforeEach(async () => {
      sdk = await ConfigClient.createInstance(JSON.stringify(serviceAccountTokenMock));
      deleteOAuth2ApplicationSpy = jest
        .spyOn(sdk['client'], 'deleteOAuth2Application')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response: DeleteOAuth2ApplicationResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(null, {
                bookmark: 'bookmark-token',
              });
            }
            return {} as SurfaceCall;
          },
        );
      return sdk.deleteOAuth2Application('oauth2-app-id');
    });

    it('sends correct request', () => {
      expect(deleteOAuth2ApplicationSpy).toBeCalledWith(
        {
          id: 'oauth2-app-id',
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
        .spyOn(sdk['client'], 'deleteOAuth2Application')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response?: DeleteOAuth2ApplicationResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(error);
            }
            return {} as SurfaceCall;
          },
        );
      sdk.deleteOAuth2Application('oauth2-app-id').catch((err) => {
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
        .spyOn(sdk['client'], 'deleteOAuth2Application')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response?: DeleteOAuth2ApplicationResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(null);
            }
            return {} as SurfaceCall;
          },
        );
      sdk.deleteOAuth2Application('oauth2-app-id').catch((err) => {
        thrownError = err;
      });
    });

    it('throws an error', () => {
      expect(thrownError.message).toBe('No OAuth2 application response');
    });
  });
});
