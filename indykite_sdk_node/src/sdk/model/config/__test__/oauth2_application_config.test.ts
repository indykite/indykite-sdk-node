import { SdkError, SdkErrorCode } from '../../../error';
import { OAuth2ApplicationConfig as OAuth2ApplicationConfigModel } from '../../../../grpc/indykite/config/v1beta1/model';
import {
  ClientSubjectType,
  GrantType,
  OAuth2ApplicationConfig,
  ResponseType,
  TokenEndpointAuthMethod,
} from '../oauth2_application_config';

describe('deserialize', () => {
  describe('when the response contains all values', () => {
    let appAgentCredential: OAuth2ApplicationConfig;

    beforeEach(() => {
      appAgentCredential = OAuth2ApplicationConfig.deserialize({
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
        description: 'Description',
        allowedCorsOrigins: ['http://localhost'],
        additionalContacts: ['user@localhost'],
        sectorIdentifierUri: 'http://localhost:3000/sector',
        grantTypes: [GrantType.AUTHORIZATION_CODE],
        responseTypes: [ResponseType.CODE],
        audiences: ['audience'],
        userinfoSignedResponseAlg: 'RS256',
        trusted: false,
      });
    });

    it('creates a correct application oauth2 app config instance', () => {
      expect(appAgentCredential.clientId).toBe('client-id-token');
      expect(appAgentCredential.displayName).toBe('Display Name');
      expect(appAgentCredential.redirectUris).toEqual(['http://localhost:3000']);
      expect(appAgentCredential.owner).toBe('Owner');
      expect(appAgentCredential.policyUri).toBe('http://localhost:3000/policy');
      expect(appAgentCredential.termsOfServiceUri).toBe('http://localhost:3000/tos');
      expect(appAgentCredential.clientUri).toBe('http://localhost:3000/client');
      expect(appAgentCredential.logoUri).toBe('http://localhost:3000/logo.png');
      expect(appAgentCredential.userSupportEmailAddress).toBe('support@localhost');
      expect(appAgentCredential.subjectType).toBe(ClientSubjectType.PUBLIC);
      expect(appAgentCredential.scopes).toEqual(['openid']);
      expect(appAgentCredential.tokenEndpointAuthMethod).toBe(
        TokenEndpointAuthMethod.CLIENT_SECRET_BASIC,
      );
      expect(appAgentCredential.tokenEndpointAuthSigningAlg).toBe('ES256');
      expect(appAgentCredential.description).toBe('Description');
      expect(appAgentCredential.allowedCorsOrigins).toEqual(['http://localhost']);
      expect(appAgentCredential.additionalContacts).toEqual(['user@localhost']);
      expect(appAgentCredential.sectorIdentifierUri).toBe('http://localhost:3000/sector');
      expect(appAgentCredential.grantTypes).toEqual([GrantType.AUTHORIZATION_CODE]);
      expect(appAgentCredential.responseTypes).toEqual([ResponseType.CODE]);
      expect(appAgentCredential.audiences).toEqual(['audience']);
      expect(appAgentCredential.userinfoSignedResponseAlg).toBe('RS256');
    });
  });

  describe('when scopes are undefined', () => {
    let thrownError: SdkError;

    beforeEach(() => {
      try {
        OAuth2ApplicationConfig.deserialize({
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
          scopes: undefined as unknown as string[],
          tokenEndpointAuthMethod: TokenEndpointAuthMethod.CLIENT_SECRET_BASIC,
          tokenEndpointAuthSigningAlg: 'ES256',
          description: 'Description',
          allowedCorsOrigins: ['http://localhost'],
          additionalContacts: ['user@localhost'],
          sectorIdentifierUri: 'http://localhost:3000/sector',
          grantTypes: [GrantType.AUTHORIZATION_CODE],
          responseTypes: [ResponseType.CODE],
          audiences: ['audience'],
          userinfoSignedResponseAlg: 'RS256',
          trusted: false,
        });
      } catch (err) {
        thrownError = err as SdkError;
      }
    });

    it('throws an error', () => {
      expect(thrownError.code).toBe(SdkErrorCode.SDK_CODE_1);
      expect(thrownError.description).toBe("Can't create OAuth2 application configuration");
    });
  });
});

describe('construct with the object argument', () => {
  describe('when the response contains all values', () => {
    let appAgentCredential: OAuth2ApplicationConfig;

    beforeEach(() => {
      appAgentCredential = new OAuth2ApplicationConfig({
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
        description: 'Description',
        allowedCorsOrigins: ['http://localhost'],
        additionalContacts: ['user@localhost'],
        sectorIdentifierUri: 'http://localhost:3000/sector',
        grantTypes: [GrantType.AUTHORIZATION_CODE],
        responseTypes: [ResponseType.CODE],
        audiences: ['audience'],
        userinfoSignedResponseAlg: 'RS256',
        trusted: false,
      });
    });

    it('creates a correct application oauth2 app config instance', () => {
      expect(appAgentCredential.clientId).toBe('client-id-token');
      expect(appAgentCredential.displayName).toBe('Display Name');
      expect(appAgentCredential.redirectUris).toEqual(['http://localhost:3000']);
      expect(appAgentCredential.owner).toBe('Owner');
      expect(appAgentCredential.policyUri).toBe('http://localhost:3000/policy');
      expect(appAgentCredential.termsOfServiceUri).toBe('http://localhost:3000/tos');
      expect(appAgentCredential.clientUri).toBe('http://localhost:3000/client');
      expect(appAgentCredential.logoUri).toBe('http://localhost:3000/logo.png');
      expect(appAgentCredential.userSupportEmailAddress).toBe('support@localhost');
      expect(appAgentCredential.subjectType).toBe(ClientSubjectType.PUBLIC);
      expect(appAgentCredential.scopes).toEqual(['openid']);
      expect(appAgentCredential.tokenEndpointAuthMethod).toBe(
        TokenEndpointAuthMethod.CLIENT_SECRET_BASIC,
      );
      expect(appAgentCredential.tokenEndpointAuthSigningAlg).toBe('ES256');
      expect(appAgentCredential.description).toBe('Description');
      expect(appAgentCredential.allowedCorsOrigins).toEqual(['http://localhost']);
      expect(appAgentCredential.additionalContacts).toEqual(['user@localhost']);
      expect(appAgentCredential.sectorIdentifierUri).toBe('http://localhost:3000/sector');
      expect(appAgentCredential.grantTypes).toEqual([GrantType.AUTHORIZATION_CODE]);
      expect(appAgentCredential.responseTypes).toEqual([ResponseType.CODE]);
      expect(appAgentCredential.audiences).toEqual(['audience']);
      expect(appAgentCredential.userinfoSignedResponseAlg).toBe('RS256');
    });

    describe('when the marshall prop is called', () => {
      let marshallResult: OAuth2ApplicationConfigModel;

      beforeEach(() => {
        marshallResult = appAgentCredential.marshal();
      });

      it('returns correct object', () => {
        expect(marshallResult).toEqual({
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
          description: 'Description',
          allowedCorsOrigins: ['http://localhost'],
          additionalContacts: ['user@localhost'],
          sectorIdentifierUri: 'http://localhost:3000/sector',
          grantTypes: [GrantType.AUTHORIZATION_CODE],
          responseTypes: [ResponseType.CODE],
          audiences: ['audience'],
          userinfoSignedResponseAlg: 'RS256',
          trusted: false,
        });
      });
    });
  });

  describe('when the response contains required values only', () => {
    let appAgentCredential: OAuth2ApplicationConfig;

    beforeEach(() => {
      appAgentCredential = new OAuth2ApplicationConfig({
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
        trusted: false,
      });
    });

    it('creates a correct application oauth2 app config instance', () => {
      expect(appAgentCredential.clientId).toBe('client-id-token');
      expect(appAgentCredential.displayName).toBe('Display Name');
      expect(appAgentCredential.redirectUris).toEqual(['http://localhost:3000']);
      expect(appAgentCredential.owner).toBe('Owner');
      expect(appAgentCredential.policyUri).toBe('http://localhost:3000/policy');
      expect(appAgentCredential.termsOfServiceUri).toBe('http://localhost:3000/tos');
      expect(appAgentCredential.clientUri).toBe('http://localhost:3000/client');
      expect(appAgentCredential.logoUri).toBe('http://localhost:3000/logo.png');
      expect(appAgentCredential.userSupportEmailAddress).toBe('support@localhost');
      expect(appAgentCredential.subjectType).toBe(ClientSubjectType.PUBLIC);
      expect(appAgentCredential.scopes).toEqual(['openid']);
      expect(appAgentCredential.tokenEndpointAuthMethod).toBe(
        TokenEndpointAuthMethod.CLIENT_SECRET_BASIC,
      );
      expect(appAgentCredential.tokenEndpointAuthSigningAlg).toBe('ES256');
      expect(appAgentCredential.description).toBeUndefined();
      expect(appAgentCredential.allowedCorsOrigins).toBeUndefined();
      expect(appAgentCredential.additionalContacts).toBeUndefined();
      expect(appAgentCredential.sectorIdentifierUri).toBeUndefined();
      expect(appAgentCredential.grantTypes).toBeUndefined();
      expect(appAgentCredential.responseTypes).toBeUndefined();
      expect(appAgentCredential.audiences).toBeUndefined();
      expect(appAgentCredential.userinfoSignedResponseAlg).toBeUndefined();
    });

    describe('when the marshall prop is called', () => {
      let marshallResult: OAuth2ApplicationConfigModel;

      beforeEach(() => {
        marshallResult = appAgentCredential.marshal();
      });

      it('returns correct object', () => {
        expect(marshallResult).toEqual({
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
          trusted: false,
        });
      });
    });
  });
});
