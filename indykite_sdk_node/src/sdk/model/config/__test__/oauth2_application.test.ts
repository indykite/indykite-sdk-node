import { SdkError, SdkErrorCode } from '../../../error';
import { OAuth2Application } from '../oauth2_application';
import { Utils } from '../../../utils/utils';
import {
  OAuth2ApplicationConfig,
  ClientSubjectType,
  TokenEndpointAuthMethod,
} from '../oauth2_application_config';

const configExample = new OAuth2ApplicationConfig({
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

describe('deserialize', () => {
  describe('when there is a read response with the description', () => {
    let oauth2Application: OAuth2Application;

    beforeEach(() => {
      oauth2Application = OAuth2Application.deserialize({
        oauth2Application: {
          id: 'oauth2-application-id',
          name: 'oauth2-application-name',
          etag: 'etag-token',
          displayName: 'OAuth2 Application Name',
          description: { value: 'Description' },
          createdBy: 'Lorem ipsum - creator',
          updatedBy: 'Lorem ipsum - updater',
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
    });

    it('creates a correct application oauth2 application instance', () => {
      expect(oauth2Application).toEqual({
        id: 'oauth2-application-id',
        name: 'oauth2-application-name',
        etag: 'etag-token',
        displayName: 'OAuth2 Application Name',
        description: 'Description',
        createTime: new Date(2022, 5, 28, 11, 54),
        updateTime: new Date(2022, 5, 28, 11, 55),
        deleteTime: new Date(2022, 5, 28, 11, 56),
        destroyTime: new Date(2022, 5, 28, 11, 57),
        customerId: 'customer-id',
        appSpaceId: 'app-space-id',
        oauth2ProviderId: 'oauth2-provider-id',
        config: expect.any(OAuth2ApplicationConfig),
      });
    });
  });

  describe('when there is a read response without the description', () => {
    let oauth2Application: OAuth2Application;

    beforeEach(() => {
      oauth2Application = OAuth2Application.deserialize({
        oauth2Application: {
          id: 'oauth2-application-id',
          name: 'oauth2-application-name',
          etag: 'etag-token',
          displayName: 'OAuth2 Application Name',
          createdBy: 'Lorem ipsum - creator',
          updatedBy: 'Lorem ipsum - updater',
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
    });

    it('creates a correct application oauth2 application instance', () => {
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
    });
  });

  describe('when the creation response contains all values', () => {
    let oauth2Application: OAuth2Application;

    beforeEach(() => {
      oauth2Application = OAuth2Application.deserialize(
        {
          id: 'oauth2-application-id',
          etag: 'etag-token',
          createdBy: 'Lorem ipsum - creator',
          updatedBy: 'Lorem ipsum - updater',
          createTime: Utils.dateToTimestamp(new Date(2022, 5, 28, 11, 54)),
          updateTime: Utils.dateToTimestamp(new Date(2022, 5, 28, 11, 55)),
          clientId: 'client-id-token',
          clientSecret: 'client-secret-token',
          bookmark: 'bookmark-token',
        },
        'oauth2-application-name',
        configExample,
        'OAuth2 Application Name',
        'Description',
      );
    });

    it('creates a correct application oauth2 application instance', () => {
      expect(oauth2Application).toEqual({
        id: 'oauth2-application-id',
        name: 'oauth2-application-name',
        etag: 'etag-token',
        displayName: 'OAuth2 Application Name',
        description: 'Description',
        createTime: new Date(2022, 5, 28, 11, 54),
        updateTime: new Date(2022, 5, 28, 11, 55),
        config: configExample,
      });
    });
  });

  describe('when the creation response contains required values only', () => {
    let oauth2Application: OAuth2Application;

    beforeEach(() => {
      oauth2Application = OAuth2Application.deserialize(
        {
          id: 'oauth2-application-id',
          etag: 'etag-token',
          createdBy: 'Lorem ipsum - creator',
          updatedBy: 'Lorem ipsum - updater',
          createTime: Utils.dateToTimestamp(new Date(2022, 5, 28, 11, 54)),
          updateTime: Utils.dateToTimestamp(new Date(2022, 5, 28, 11, 55)),
          clientId: 'client-id-token',
          clientSecret: 'client-secret-token',
          bookmark: 'bookmark-token',
        },
        'oauth2-application-name',
        configExample,
      );
    });

    it('creates a correct application oauth2 application instance', () => {
      expect(oauth2Application).toEqual({
        id: 'oauth2-application-id',
        name: 'oauth2-application-name',
        etag: 'etag-token',
        createTime: new Date(2022, 5, 28, 11, 54),
        updateTime: new Date(2022, 5, 28, 11, 55),
        config: configExample,
      });
    });
  });

  describe('when name is undefined with the creation response', () => {
    let thrownError: SdkError;

    beforeEach(() => {
      try {
        OAuth2Application.deserialize(
          {
            id: 'oauth2-application-id',
            etag: 'etag-token',
            createdBy: 'Lorem ipsum - creator',
            updatedBy: 'Lorem ipsum - updater',
            createTime: Utils.dateToTimestamp(new Date(2022, 5, 28, 11, 54)),
            updateTime: Utils.dateToTimestamp(new Date(2022, 5, 28, 11, 55)),
            clientId: 'client-id-token',
            clientSecret: 'client-secret-token',
            bookmark: 'bookmark-token',
          },
          undefined as unknown as string,
          configExample,
        );
      } catch (err) {
        thrownError = err as SdkError;
      }
    });

    it('throws an error', () => {
      expect(thrownError.code).toBe(SdkErrorCode.SDK_CODE_1);
      expect(thrownError.description).toBe("Can't deserialize OAuth2 application");
    });
  });
});

describe('construct with the object argument', () => {
  describe('when the response contains all values', () => {
    let oauth2Application: OAuth2Application;

    beforeEach(() => {
      oauth2Application = new OAuth2Application({
        id: 'oauth2-application-id',
        name: 'oauth2-application-name',
        etag: 'etag-token',
        displayName: 'OAuth2 Application Name',
        description: 'Description',
        createTime: new Date(2022, 5, 28, 11, 54),
        updateTime: new Date(2022, 5, 28, 11, 55),
        deleteTime: new Date(2022, 5, 28, 11, 56),
        destroyTime: new Date(2022, 5, 28, 11, 57),
        customerId: 'customer-id',
        appSpaceId: 'app-space-id',
        oauth2ProviderId: 'oauth2-provider-id',
        config: configExample,
      });
    });

    it('creates a correct application oauth2 application instance', () => {
      expect(oauth2Application).toEqual({
        id: 'oauth2-application-id',
        name: 'oauth2-application-name',
        etag: 'etag-token',
        displayName: 'OAuth2 Application Name',
        description: 'Description',
        createTime: new Date(2022, 5, 28, 11, 54),
        updateTime: new Date(2022, 5, 28, 11, 55),
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
