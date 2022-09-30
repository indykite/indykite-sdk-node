import { SdkError, SdkErrorCode } from '../../../error';
import { OAuth2Provider } from '../oauth2_provider';
import { Utils } from '../../../utils/utils';
import {
  OAuth2ProviderConfig,
  TokenEndpointAuthMethod,
  GrantType,
  ResponseType,
} from '../oauth2_provider_config';

const configExample = new OAuth2ProviderConfig({
  grantTypes: [GrantType.AUTHORIZATION_CODE],
  responseTypes: [ResponseType.CODE],
  scopes: ['openid'],
  tokenEndpointAuthMethod: [TokenEndpointAuthMethod.CLIENT_SECRET_BASIC],
  tokenEndpointAuthSigningAlg: ['ES256', 'RS256'],
  frontChannelLoginUri: { default: 'https://example.com/login/oauth2' },
  frontChannelConsentUri: { default: 'https://example.com/consent' },
});

describe('deserialize', () => {
  describe('when there is a read response with the description', () => {
    let oauth2Provider: OAuth2Provider;

    beforeEach(() => {
      oauth2Provider = OAuth2Provider.deserialize({
        oauth2Provider: {
          id: 'oauth2-provider-id',
          name: 'oauth2-provider-name',
          etag: 'etag-token',
          displayName: 'OAuth2 Provider Name',
          description: { value: 'Description' },
          createTime: Utils.dateToTimestamp(new Date(2022, 5, 28, 11, 54)),
          updateTime: Utils.dateToTimestamp(new Date(2022, 5, 28, 11, 55)),
          deleteTime: Utils.dateToTimestamp(new Date(2022, 5, 28, 11, 56)),
          destroyTime: Utils.dateToTimestamp(new Date(2022, 5, 28, 11, 57)),
          customerId: 'customer-id',
          appSpaceId: 'app-space-id',
          config: configExample.marshal(),
        },
      });
    });

    it('creates a correct oauth2 provider instance', () => {
      expect(oauth2Provider).toEqual({
        id: 'oauth2-provider-id',
        name: 'oauth2-provider-name',
        etag: 'etag-token',
        displayName: 'OAuth2 Provider Name',
        description: 'Description',
        createTime: new Date(2022, 5, 28, 11, 54),
        updateTime: new Date(2022, 5, 28, 11, 55),
        deleteTime: new Date(2022, 5, 28, 11, 56),
        destroyTime: new Date(2022, 5, 28, 11, 57),
        customerId: 'customer-id',
        appSpaceId: 'app-space-id',
        config: expect.any(OAuth2ProviderConfig),
      });
    });
  });

  describe('when there is a read response without the description', () => {
    let oauth2Provider: OAuth2Provider;

    beforeEach(() => {
      oauth2Provider = OAuth2Provider.deserialize({
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
    });

    it('creates a correct oauth2 provider instance', () => {
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
    });
  });

  describe('when the creation response contains all values', () => {
    let oauth2Provider: OAuth2Provider;

    beforeEach(() => {
      oauth2Provider = OAuth2Provider.deserialize(
        {
          id: 'oauth2-provider-id',
          etag: 'etag-token',
          createTime: Utils.dateToTimestamp(new Date(2022, 5, 28, 11, 54)),
          updateTime: Utils.dateToTimestamp(new Date(2022, 5, 28, 11, 55)),
        },
        'oauth2-provider-name',
        'app-space-id',
        configExample,
        'OAuth2 Provider Name',
        'Description',
      );
    });

    it('creates a correct oauth2 provider instance', () => {
      expect(oauth2Provider).toEqual({
        appSpaceId: 'app-space-id',
        id: 'oauth2-provider-id',
        name: 'oauth2-provider-name',
        etag: 'etag-token',
        displayName: 'OAuth2 Provider Name',
        description: 'Description',
        createTime: new Date(2022, 5, 28, 11, 54),
        updateTime: new Date(2022, 5, 28, 11, 55),
        config: configExample,
      });
    });
  });

  describe('when the creation response contains required values only', () => {
    let oauth2Provider: OAuth2Provider;

    beforeEach(() => {
      oauth2Provider = OAuth2Provider.deserialize(
        {
          id: 'oauth2-provider-id',
          etag: 'etag-token',
          createTime: Utils.dateToTimestamp(new Date(2022, 5, 28, 11, 54)),
          updateTime: Utils.dateToTimestamp(new Date(2022, 5, 28, 11, 55)),
        },
        'oauth2-provider-name',
        'app-space-id',
        configExample,
      );
    });

    it('creates a correct oauth2 provider instance', () => {
      expect(oauth2Provider).toEqual({
        appSpaceId: 'app-space-id',
        id: 'oauth2-provider-id',
        name: 'oauth2-provider-name',
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
        OAuth2Provider.deserialize(
          {
            id: 'oauth2-provider-id',
            etag: 'etag-token',
            createTime: Utils.dateToTimestamp(new Date(2022, 5, 28, 11, 54)),
            updateTime: Utils.dateToTimestamp(new Date(2022, 5, 28, 11, 55)),
          },
          undefined as unknown as string,
          'app-space-id',
          configExample,
        );
      } catch (err) {
        thrownError = err as SdkError;
      }
    });

    it('throws an error', () => {
      expect(thrownError.code).toBe(SdkErrorCode.SDK_CODE_1);
      expect(thrownError.description).toBe("Can't deserialize OAuth2 provider");
    });
  });
});

describe('construct with the object argument', () => {
  describe('when the response contains all values', () => {
    let oauth2Application: OAuth2Provider;

    beforeEach(() => {
      oauth2Application = new OAuth2Provider({
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
        config: configExample,
        description: 'Description',
      });
    });

    it('creates a correct oauth2 provider instance', () => {
      expect(oauth2Application).toEqual({
        id: 'oauth2-provider-id',
        name: 'oauth2-provider-name',
        etag: 'etag-token',
        displayName: 'OAuth2 Provider Name',
        description: 'Description',
        createTime: new Date(2022, 5, 28, 11, 54),
        updateTime: new Date(2022, 5, 28, 11, 55),
        deleteTime: new Date(2022, 5, 28, 11, 56),
        destroyTime: new Date(2022, 5, 28, 11, 57),
        customerId: 'customer-id',
        appSpaceId: 'app-space-id',
        config: expect.any(OAuth2ProviderConfig),
      });
    });
  });
});
