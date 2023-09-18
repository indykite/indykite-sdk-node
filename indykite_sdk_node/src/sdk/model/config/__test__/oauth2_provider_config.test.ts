import { SdkError, SdkErrorCode } from '../../../error';
import { OAuth2ProviderConfig as OAuth2ProviderConfigModel } from '../../../../grpc/indykite/config/v1beta1/model';
import {
  GrantType,
  OAuth2ProviderConfig,
  ResponseType,
  TokenEndpointAuthMethod,
} from '../oauth2_provider_config';

describe('deserialize', () => {
  describe('when the response contains all values', () => {
    let oauth2ProviderConfig: OAuth2ProviderConfig;

    beforeEach(() => {
      oauth2ProviderConfig = OAuth2ProviderConfig.deserialize({
        grantTypes: [GrantType.AUTHORIZATION_CODE],
        responseTypes: [ResponseType.CODE],
        scopes: ['openid'],
        tokenEndpointAuthMethod: [TokenEndpointAuthMethod.CLIENT_SECRET_BASIC],
        tokenEndpointAuthSigningAlg: ['ES256', 'RS256'],
        requestUris: ['https://example.com'],
        requestObjectSigningAlg: 'ES256',
        frontChannelLoginUri: { default: 'https://example.com/login/oauth2' },
        frontChannelConsentUri: { default: 'https://example.com/consent' },
      });
    });

    it('creates a correct oauth2 provider config instance', () => {
      expect(oauth2ProviderConfig.grantTypes).toEqual([GrantType.AUTHORIZATION_CODE]);
      expect(oauth2ProviderConfig.responseTypes).toEqual([ResponseType.CODE]);
      expect(oauth2ProviderConfig.scopes).toEqual(['openid']);
      expect(oauth2ProviderConfig.tokenEndpointAuthMethod).toEqual([
        TokenEndpointAuthMethod.CLIENT_SECRET_BASIC,
      ]);
      expect(oauth2ProviderConfig.tokenEndpointAuthSigningAlg).toEqual(['ES256', 'RS256']);
      expect(oauth2ProviderConfig.requestUris).toEqual(['https://example.com']);
      expect(oauth2ProviderConfig.requestObjectSigningAlg).toBe('ES256');
      expect(oauth2ProviderConfig.frontChannelLoginUri).toEqual({
        default: 'https://example.com/login/oauth2',
      });
      expect(oauth2ProviderConfig.frontChannelConsentUri).toEqual({
        default: 'https://example.com/consent',
      });
    });
  });

  describe('when scopes are undefined', () => {
    let thrownError: SdkError;

    beforeEach(() => {
      try {
        OAuth2ProviderConfig.deserialize({
          grantTypes: [GrantType.AUTHORIZATION_CODE],
          responseTypes: [ResponseType.CODE],
          scopes: undefined as unknown as string[],
          tokenEndpointAuthMethod: [TokenEndpointAuthMethod.CLIENT_SECRET_BASIC],
          tokenEndpointAuthSigningAlg: ['ES256', 'RS256'],
          requestUris: ['https://example.com'],
          requestObjectSigningAlg: 'ES256',
          frontChannelLoginUri: { default: 'https://example.com/login/oauth2' },
          frontChannelConsentUri: { default: 'https://example.com/consent' },
        });
      } catch (err) {
        thrownError = err as SdkError;
      }
    });

    it('throws an error', () => {
      expect(thrownError.code).toBe(SdkErrorCode.SDK_CODE_1);
      expect(thrownError.description).toBe("Can't create OAuth2 provider configuration");
    });
  });
});

describe('construct with the object argument', () => {
  describe('when the response contains all values', () => {
    let oauth2ProviderConfig: OAuth2ProviderConfig;

    beforeEach(() => {
      oauth2ProviderConfig = new OAuth2ProviderConfig({
        grantTypes: [GrantType.AUTHORIZATION_CODE],
        responseTypes: [ResponseType.CODE],
        scopes: ['openid'],
        tokenEndpointAuthMethod: [TokenEndpointAuthMethod.CLIENT_SECRET_BASIC],
        tokenEndpointAuthSigningAlg: ['ES256', 'RS256'],
        requestUris: ['https://example.com'],
        requestObjectSigningAlg: 'ES256',
        frontChannelLoginUri: { default: 'https://example.com/login/oauth2' },
        frontChannelConsentUri: { default: 'https://example.com/consent' },
        trusted: false,
      });
    });

    it('creates a correct oauth2 provider config instance', () => {
      expect(oauth2ProviderConfig.grantTypes).toEqual([GrantType.AUTHORIZATION_CODE]);
      expect(oauth2ProviderConfig.responseTypes).toEqual([ResponseType.CODE]);
      expect(oauth2ProviderConfig.scopes).toEqual(['openid']);
      expect(oauth2ProviderConfig.tokenEndpointAuthMethod).toEqual([
        TokenEndpointAuthMethod.CLIENT_SECRET_BASIC,
      ]);
      expect(oauth2ProviderConfig.tokenEndpointAuthSigningAlg).toEqual(['ES256', 'RS256']);
      expect(oauth2ProviderConfig.requestUris).toEqual(['https://example.com']);
      expect(oauth2ProviderConfig.requestObjectSigningAlg).toBe('ES256');
      expect(oauth2ProviderConfig.frontChannelLoginUri).toEqual({
        default: 'https://example.com/login/oauth2',
      });
      expect(oauth2ProviderConfig.frontChannelConsentUri).toEqual({
        default: 'https://example.com/consent',
      });
    });

    describe('when the marshall prop is called', () => {
      let marshallResult: OAuth2ProviderConfigModel;

      beforeEach(() => {
        marshallResult = oauth2ProviderConfig.marshal();
      });

      it('returns correct object', () => {
        expect(marshallResult).toEqual({
          grantTypes: [GrantType.AUTHORIZATION_CODE],
          responseTypes: [ResponseType.CODE],
          scopes: ['openid'],
          tokenEndpointAuthMethod: [TokenEndpointAuthMethod.CLIENT_SECRET_BASIC],
          tokenEndpointAuthSigningAlg: ['ES256', 'RS256'],
          requestUris: ['https://example.com'],
          requestObjectSigningAlg: 'ES256',
          frontChannelLoginUri: { default: 'https://example.com/login/oauth2' },
          frontChannelConsentUri: { default: 'https://example.com/consent' },
        });
      });
    });
  });

  describe('when the response contains required values only', () => {
    let oauth2ProviderConfig: OAuth2ProviderConfig;

    beforeEach(() => {
      oauth2ProviderConfig = new OAuth2ProviderConfig({
        grantTypes: [GrantType.AUTHORIZATION_CODE],
        responseTypes: [ResponseType.CODE],
        scopes: ['openid'],
        tokenEndpointAuthMethod: [TokenEndpointAuthMethod.CLIENT_SECRET_BASIC],
        tokenEndpointAuthSigningAlg: ['ES256', 'RS256'],
        frontChannelLoginUri: { default: 'https://example.com/login/oauth2' },
        frontChannelConsentUri: { default: 'https://example.com/consent' },
        trusted: false,
      });
    });

    it('creates a correct application oauth2 app config instance', () => {
      expect(oauth2ProviderConfig.grantTypes).toEqual([GrantType.AUTHORIZATION_CODE]);
      expect(oauth2ProviderConfig.responseTypes).toEqual([ResponseType.CODE]);
      expect(oauth2ProviderConfig.scopes).toEqual(['openid']);
      expect(oauth2ProviderConfig.tokenEndpointAuthMethod).toEqual([
        TokenEndpointAuthMethod.CLIENT_SECRET_BASIC,
      ]);
      expect(oauth2ProviderConfig.tokenEndpointAuthSigningAlg).toEqual(['ES256', 'RS256']);
      expect(oauth2ProviderConfig.requestUris).toBeUndefined();
      expect(oauth2ProviderConfig.requestObjectSigningAlg).toBeUndefined();
      expect(oauth2ProviderConfig.frontChannelLoginUri).toEqual({
        default: 'https://example.com/login/oauth2',
      });
      expect(oauth2ProviderConfig.frontChannelConsentUri).toEqual({
        default: 'https://example.com/consent',
      });
    });

    describe('when the marshall prop is called', () => {
      let marshallResult: OAuth2ProviderConfigModel;

      beforeEach(() => {
        marshallResult = oauth2ProviderConfig.marshal();
      });

      it('returns correct object', () => {
        expect(marshallResult).toEqual({
          grantTypes: [GrantType.AUTHORIZATION_CODE],
          responseTypes: [ResponseType.CODE],
          scopes: ['openid'],
          tokenEndpointAuthMethod: [TokenEndpointAuthMethod.CLIENT_SECRET_BASIC],
          tokenEndpointAuthSigningAlg: ['ES256', 'RS256'],
          requestUris: [],
          requestObjectSigningAlg: '',
          frontChannelLoginUri: { default: 'https://example.com/login/oauth2' },
          frontChannelConsentUri: { default: 'https://example.com/consent' },
        });
      });
    });
  });
});
