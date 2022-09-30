import { AuthStyle, ProviderType } from '../../../../../grpc/indykite/config/v1beta1/model';
import { OAuth2ClientFactory } from '../factory';
import { OAuth2Client } from '../oauth2_client';

describe('createInstance', () => {
  let client: OAuth2Client;

  beforeEach(() => {
    client = OAuth2ClientFactory.createInstance('instance-name', {
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

  it('creates a correct instance', () => {
    expect(client.name).toBe('instance-name');
    expect(client.providerType).toBe(ProviderType.LINKEDIN_COM);
    expect(client.clientId).toBe('client-id');
    expect(client.clientSecret).toBe('client-secret');
    expect(client.redirectUri).toEqual(['https://example.com/page']);
    expect(client.defaultScopes).toEqual(['openid']);
    expect(client.allowedScopes).toEqual(['openid', 'email']);
    expect(client.allowSignup).toBe(true);
    expect(client.issuer).toBe('issuer');
    expect(client.authorizationEndpoint).toBe('https://example.com/authorization');
    expect(client.tokenEndpoint).toBe('https://example.com/token');
    expect(client.discoveryUrl).toBe('https://example.com/discovery');
    expect(client.userinfoEndpoint).toBe('https://example.com/info');
    expect(client.jwksUri).toBe('https://example.com/jwks');
    expect(client.imageUrl).toBe('https://example.com/image.png');
    expect(client.tenant).toBe('tenant');
    expect(client.hostedDomain).toBe('https://example.com');
    expect(client.authStyle).toBe(AuthStyle.AUTO_DETECT);
  });
});
