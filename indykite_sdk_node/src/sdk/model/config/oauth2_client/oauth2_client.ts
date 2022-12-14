import {
  AuthStyle as OAuth2AuthStyle,
  ProviderType as OAuth2ProviderType,
  OAuth2ClientConfig as OAuth2ClientConfigModel,
} from '../../../../grpc/indykite/config/v1beta1/model';
import { NodeConfiguration } from '../configuration';

export { OAuth2AuthStyle, OAuth2ProviderType };

export type IOAuth2ClientConfigOptions = {
  providerType: OAuth2ProviderType;
  clientId: string;
  clientSecret: string;
  redirectUri: string[];
  defaultScopes: string[];
  allowedScopes: string[];
  allowSignup: boolean;
  issuer: string;
  authorizationEndpoint: string;
  tokenEndpoint: string;
  discoveryUrl: string;
  userinfoEndpoint: string;
  jwksUri: string;
  imageUrl: string;
  tenant: string;
  hostedDomain: string;
  authStyle: OAuth2AuthStyle;
  name: string;
  displayName?: string;
  description?: string;
  privateKeyId?: string;
  privateKeyPem?: Buffer;
  teamId?: string;
};

export class OAuth2Client extends NodeConfiguration {
  public providerType: OAuth2ProviderType;
  public clientId: string;
  public clientSecret: string;
  public redirectUri: string[];
  public defaultScopes: string[];
  public allowedScopes: string[];
  public allowSignup: boolean;
  public issuer: string;
  public authorizationEndpoint: string;
  public tokenEndpoint: string;
  public discoveryUrl: string;
  public userinfoEndpoint: string;
  public jwksUri: string;
  public imageUrl: string;
  public tenant: string;
  public hostedDomain: string;
  public authStyle: OAuth2AuthStyle;
  public privateKeyId?: string;
  public privateKeyPem?: Buffer;
  public teamId?: string;

  constructor(options: IOAuth2ClientConfigOptions) {
    super(options.name);

    this.providerType = options.providerType;
    this.clientId = options.clientId;
    this.clientSecret = options.clientSecret;
    this.redirectUri = options.redirectUri;
    this.defaultScopes = options.defaultScopes;
    this.allowedScopes = options.allowedScopes;
    this.allowSignup = options.allowSignup;
    this.issuer = options.issuer;
    this.authorizationEndpoint = options.authorizationEndpoint;
    this.tokenEndpoint = options.tokenEndpoint;
    this.discoveryUrl = options.discoveryUrl;
    this.userinfoEndpoint = options.userinfoEndpoint;
    this.jwksUri = options.jwksUri;
    this.imageUrl = options.imageUrl;
    this.tenant = options.tenant;
    this.hostedDomain = options.hostedDomain;
    this.authStyle = options.authStyle;
    this.displayName = options.displayName;
    this.description = options.description;
    this.privateKeyId = options.privateKeyId;
    this.privateKeyPem = options.privateKeyPem;
    this.teamId = options.teamId;
  }

  marshal(): OAuth2ClientConfigModel {
    return {
      providerType: this.providerType,
      clientId: this.clientId,
      clientSecret: this.clientSecret,
      redirectUri: this.redirectUri,
      defaultScopes: this.defaultScopes,
      allowedScopes: this.allowedScopes,
      allowSignup: this.allowSignup,
      issuer: this.issuer,
      authorizationEndpoint: this.authorizationEndpoint,
      tokenEndpoint: this.tokenEndpoint,
      discoveryUrl: this.discoveryUrl,
      userinfoEndpoint: this.userinfoEndpoint,
      jwksUri: this.jwksUri,
      imageUrl: this.imageUrl,
      tenant: this.tenant,
      hostedDomain: this.hostedDomain,
      authStyle: this.authStyle,
      privateKeyId: this.privateKeyId ?? '',
      privateKeyPem: Uint8Array.from(this.privateKeyPem ?? []),
      teamId: this.teamId ?? '',
    };
  }
}
