import { OAuth2ClientConfig } from '../../../../grpc/indykite/config/v1beta1/model';
import { OAuth2Client } from './oauth2_client';

export class OAuth2ClientFactory {
  static createInstance(name: string, config: OAuth2ClientConfig): OAuth2Client {
    const client = new OAuth2Client({
      name,
      providerType: config.providerType,
      clientId: config.clientId,
      clientSecret: config.clientSecret,
      redirectUri: config.redirectUri,
      defaultScopes: config.defaultScopes,
      allowedScopes: config.allowedScopes,
      allowSignup: config.allowSignup,
      issuer: config.issuer,
      authorizationEndpoint: config.authorizationEndpoint,
      tokenEndpoint: config.tokenEndpoint,
      discoveryUrl: config.discoveryUrl,
      userinfoEndpoint: config.userinfoEndpoint,
      jwksUri: config.jwksUri,
      imageUrl: config.imageUrl,
      tenant: config.tenant,
      hostedDomain: config.hostedDomain,
      authStyle: config.authStyle,
      privateKeyId: config.privateKeyId,
      privateKeyPem: Buffer.from(config.privateKeyPem),
      teamId: config.teamId,
    });
    return client;
  }
}
