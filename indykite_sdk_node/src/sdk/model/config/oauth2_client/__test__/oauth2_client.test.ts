import { AuthStyle, ProviderType } from '../../../../../grpc/indykite/config/v1beta1/model';
import { OAuth2Client } from '../oauth2_client';

describe('when the config contains required properties only', () => {
  let client: OAuth2Client;

  beforeEach(() => {
    client = new OAuth2Client({
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
      name: 'instance-name',
      displayName: 'Instance Name',
      description: 'Instance description',
    });
  });

  it('creates a correct instance', () => {
    expect(client.name).toBe('instance-name');
    expect(client.displayName).toBe('Instance Name');
    expect(client.description?.value).toBe('Instance description');
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

  it('marshals correctly', () => {
    expect(client.marshal()).toEqual({
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
      privateKeyId: '',
      privateKeyPem: new Uint8Array(),
      teamId: '',
    });
  });
});

describe('when the config contains all properties', () => {
  let client: OAuth2Client;

  beforeEach(() => {
    client = new OAuth2Client({
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
      name: 'instance-name',
      displayName: 'Instance Name',
      description: 'Instance description',
      privateKeyId: 'private-key-id',
      privateKeyPem: Buffer.from('private-key-pem'),
      teamId: 'team-id',
    });
  });

  it('creates a correct instance', () => {
    expect(client.name).toBe('instance-name');
    expect(client.displayName).toBe('Instance Name');
    expect(client.description?.value).toBe('Instance description');
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

  it('marshals correctly', () => {
    expect(client.marshal()).toEqual({
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
      privateKeyId: 'private-key-id',
      privateKeyPem: Uint8Array.from(Buffer.from('private-key-pem')),
      teamId: 'team-id',
    });
  });
});

describe('when the config contains some properties', () => {
  let client: OAuth2Client;

  beforeEach(() => {
    client = new OAuth2Client({
      providerType: ProviderType.LINKEDIN_COM,
      clientId: 'client-id',
      clientSecret: 'client-secret',
      redirectUri: ['https://example.com/page'],
      name: 'instance-name',
      displayName: 'Instance Name',
      description: 'Instance description',
      privateKeyId: 'private-key-id',
      privateKeyPem: Buffer.from('private-key-pem'),
      teamId: 'team-id',
    });
  });

  it('marshals correctly', () => {
    expect(client.marshal()).toEqual({
      providerType: ProviderType.LINKEDIN_COM,
      clientId: 'client-id',
      clientSecret: 'client-secret',
      redirectUri: ['https://example.com/page'],
      defaultScopes: [],
      allowedScopes: [],
      allowSignup: false,
      issuer: '',
      authorizationEndpoint: '',
      tokenEndpoint: '',
      discoveryUrl: '',
      userinfoEndpoint: '',
      jwksUri: '',
      imageUrl: '',
      tenant: '',
      hostedDomain: '',
      authStyle: AuthStyle.INVALID,
      privateKeyId: 'private-key-id',
      privateKeyPem: Uint8Array.from(Buffer.from('private-key-pem')),
      teamId: 'team-id',
    });
  });
});
