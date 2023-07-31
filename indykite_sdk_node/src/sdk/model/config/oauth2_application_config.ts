import {
  ClientSubjectType,
  GrantType,
  ResponseType,
  TokenEndpointAuthMethod,
  OAuth2ApplicationConfig as OAuth2ApplicationConfigModel,
} from '../../../grpc/indykite/config/v1beta1/model';
import { SdkError, SdkErrorCode } from '../../error';

/**
 * https://buf.build/indykite/indykiteapis/docs/main:indykite.config.v1beta1#indykite.config.v1beta1.OAuth2ApplicationConfig
 */
export type IOAuth2ApplicationConfigOptions = {
  // #1 ClientId is the id for this client.
  // It is read-only and is ignored during create/update request.
  clientId: string;
  // #3 DisplayName is a human readable name to show in consent page etc, not in Console
  displayName: string;
  // #4 Description is a optional description to show in consent page etc, not in Console
  description?: string;
  // #5 RedirectURIs is an array of allowed redirect urls for the client, for example http://mydomain/oauth/callback .
  redirectUris: string[];
  // #6 Owner is a string identifying the owner of the OAuth 2.0 Client.
  owner: string;
  // #7 PolicyURI is a URL string that points to a human-readable privacy policy document
  // that describes how the deployment organization collects, uses,
  // retains, and discloses personal data.
  policyUri: string;
  // #8 AllowedCORSOrigins are one or more URLs (scheme://host[:port]) which are allowed to make CORS requests
  // to the /oauth/token endpoint. If this array is empty, the sever's CORS origin configuration (`CORS_ALLOWED_ORIGINS`)
  // will be used instead. If this array is set, the allowed origins are appended to the server's CORS origin configuration.
  // Be aware that environment variable `CORS_ENABLED` MUST be set to `true` for this to work.
  allowedCorsOrigins?: string[];
  // #9 TermsOfServiceURI is a URL string that points to a human-readable terms of service
  // document for the client that describes a contractual relationship
  // between the end-user and the client that the end-user accepts when
  // authorizing the client.
  termsOfServiceUri: string;
  // #10 ClientURI is an URL string of a web page providing information about the client.
  // If present, the server SHOULD display this URL to the end-user in
  // a clickable fashion.
  clientUri: string;
  // #11 LogoURI is an URL string that references a logo for the client.
  logoUri: string;
  // #12 UserSupportEmailAddress is main email contact for User support
  userSupportEmailAddress: string;
  // #13 AdditionalContacts is a array of strings representing ways to contact people responsible
  // for this client, typically email addresses.
  additionalContacts?: string[];
  // #14 SubjectType requested for responses to this Client. The subject_types_supported Discovery parameter contains a
  // list of the supported subject_type values for this server.
  subjectType: ClientSubjectType;
  // #15 URL using the https scheme to be used in calculating Pseudonymous Identifiers by the OP. The URL references a
  // file with a single JSON array of redirect_uri values.
  sectorIdentifierUri?: string;
  // #16 GrantTypes is an array of grant types the client is allowed to use.
  grantTypes?: GrantType[];
  // #17 ResponseTypes is an array of the OAuth 2.0 response type strings that the client can
  // use at the authorization endpoint.
  responseTypes?: ResponseType[];
  // #18 Scope is a string containing a space-separated list of scope values (as
  // described in Section 3.3 of OAuth 2.0 [RFC6749]) that the client
  // can use when requesting access tokens.
  // Pattern: ^[!#-\[\]-~]{1,254}$
  scopes: string[];
  // #19 Audience is a whitelist defining the audiences this client is allowed to request tokens for. An audience limits
  // the applicability of an OAuth 2.0 Access Token to, for example, certain API endpoints.
  audiences?: string[];
  // #20 Requested Client Authentication method for the Token Endpoint.
  tokenEndpointAuthMethod: TokenEndpointAuthMethod;
  // #21 Requested Client Authentication signing algorithm for the Token Endpoint.
  tokenEndpointAuthSigningAlg: string;
  // #22 JWS alg algorithm [JWA] REQUIRED for signing UserInfo Responses. If this is specified, the response will be JWT
  // [JWT] serialized, and signed using JWS. The default, if omitted, is for the UserInfo Response to return the Claims
  // as a UTF-8 encoded JSON object using the application/json content-type.
  userinfoSignedResponseAlg?: string;
  // FIXME: not in the model
  clientSecret?: string;
  trusted?: boolean;
};

export { ClientSubjectType, GrantType, ResponseType, TokenEndpointAuthMethod };

export class OAuth2ApplicationConfig {
  public clientId: string;
  public displayName: string;
  public redirectUris: string[];
  public owner: string;
  public policyUri: string;
  public termsOfServiceUri: string;
  public clientUri: string;
  public logoUri: string;
  public userSupportEmailAddress: string;
  public subjectType: ClientSubjectType;
  public scopes: string[];
  public tokenEndpointAuthMethod: TokenEndpointAuthMethod;
  public tokenEndpointAuthSigningAlg: string;
  public trusted: boolean;

  constructor(
    clientId: string,
    displayName: string,
    redirectUris: string[],
    owner: string,
    policyUri: string,
    termsOfServiceUri: string,
    clientUri: string,
    logoUri: string,
    userSupportEmailAddress: string,
    subjectType: ClientSubjectType,
    scopes: string[],
    tokenEndpointAuthMethod: TokenEndpointAuthMethod,
    tokenEndpointAuthSigningAlg: string,
    description?: string,
    allowedCorsOrigins?: string[],
    additionalContacts?: string[],
    sectorIdentifierUri?: string,
    grantTypes?: GrantType[],
    responseTypes?: ResponseType[],
    audiences?: string[],
    userinfoSignedResponseAlg?: string,
    // FIXME: not in the model
    clientSecret?: string,
    trusted?: boolean,
  );
  constructor(options: IOAuth2ApplicationConfigOptions);
  constructor(
    clientIdOrOptions: string | IOAuth2ApplicationConfigOptions,
    displayName?: string,
    redirectUris?: string[],
    owner?: string,
    policyUri?: string,
    termsOfServiceUri?: string,
    clientUri?: string,
    logoUri?: string,
    userSupportEmailAddress?: string,
    subjectType?: ClientSubjectType,
    scopes?: string[],
    tokenEndpointAuthMethod?: TokenEndpointAuthMethod,
    tokenEndpointAuthSigningAlg?: string,
    public description?: string,
    public allowedCorsOrigins?: string[],
    public additionalContacts?: string[],
    public sectorIdentifierUri?: string,
    public grantTypes?: GrantType[],
    public responseTypes?: ResponseType[],
    public audiences?: string[],
    public userinfoSignedResponseAlg?: string,
    // FIXME: not in the model
    public clientSecret?: string,
    trusted?: boolean,
  ) {
    if (typeof clientIdOrOptions === 'object') {
      this.displayName = clientIdOrOptions.displayName;
      this.redirectUris = clientIdOrOptions.redirectUris;
      this.owner = clientIdOrOptions.owner;
      this.policyUri = clientIdOrOptions.policyUri;
      this.termsOfServiceUri = clientIdOrOptions.termsOfServiceUri;
      this.clientUri = clientIdOrOptions.clientUri;
      this.logoUri = clientIdOrOptions.logoUri;
      this.userSupportEmailAddress = clientIdOrOptions.userSupportEmailAddress;
      this.subjectType = clientIdOrOptions.subjectType;
      this.scopes = clientIdOrOptions.scopes;
      this.tokenEndpointAuthMethod = clientIdOrOptions.tokenEndpointAuthMethod;
      this.tokenEndpointAuthSigningAlg = clientIdOrOptions.tokenEndpointAuthSigningAlg;
      this.description = clientIdOrOptions.description;
      this.allowedCorsOrigins = clientIdOrOptions.allowedCorsOrigins;
      this.additionalContacts = clientIdOrOptions.additionalContacts;
      this.sectorIdentifierUri = clientIdOrOptions.sectorIdentifierUri;
      this.grantTypes = clientIdOrOptions.grantTypes;
      this.responseTypes = clientIdOrOptions.responseTypes;
      this.audiences = clientIdOrOptions.audiences;
      this.userinfoSignedResponseAlg = clientIdOrOptions.userinfoSignedResponseAlg;
      this.clientId = clientIdOrOptions.clientId;
      // FIXME: not in the model
      this.clientSecret = clientIdOrOptions.clientSecret;
      this.trusted = clientIdOrOptions.trusted ?? false;
      return;
    }

    if (
      typeof clientIdOrOptions !== 'string' ||
      displayName === undefined ||
      redirectUris === undefined ||
      owner === undefined ||
      policyUri === undefined ||
      termsOfServiceUri === undefined ||
      clientUri === undefined ||
      logoUri === undefined ||
      userSupportEmailAddress === undefined ||
      subjectType === undefined ||
      scopes === undefined ||
      tokenEndpointAuthMethod === undefined ||
      tokenEndpointAuthSigningAlg === undefined
    ) {
      throw new SdkError(SdkErrorCode.SDK_CODE_1, "Can't create OAuth2 application configuration");
    }

    this.clientId = clientIdOrOptions;
    this.displayName = displayName;
    this.redirectUris = redirectUris;
    this.owner = owner;
    this.policyUri = policyUri;
    this.termsOfServiceUri = termsOfServiceUri;
    this.clientUri = clientUri;
    this.logoUri = logoUri;
    this.userSupportEmailAddress = userSupportEmailAddress;
    this.subjectType = subjectType;
    this.scopes = scopes;
    this.tokenEndpointAuthMethod = tokenEndpointAuthMethod;
    this.tokenEndpointAuthSigningAlg = tokenEndpointAuthSigningAlg;
    this.description = description;
    this.allowedCorsOrigins = allowedCorsOrigins;
    this.additionalContacts = additionalContacts;
    this.sectorIdentifierUri = sectorIdentifierUri;
    this.grantTypes = grantTypes;
    this.responseTypes = responseTypes;
    this.audiences = audiences;
    this.userinfoSignedResponseAlg = userinfoSignedResponseAlg;
    // FIXME: not in the model
    this.clientSecret = clientSecret;
    this.trusted = trusted ?? false;
  }

  static deserialize(config: OAuth2ApplicationConfigModel): OAuth2ApplicationConfig {
    return new OAuth2ApplicationConfig(
      config.clientId,
      config.displayName,
      config.redirectUris,
      config.owner,
      config.policyUri,
      config.termsOfServiceUri,
      config.clientUri,
      config.logoUri,
      config.userSupportEmailAddress,
      config.subjectType,
      config.scopes,
      config.tokenEndpointAuthMethod,
      config.tokenEndpointAuthSigningAlg,
      config.description,
      config.allowedCorsOrigins,
      config.additionalContacts,
      config.sectorIdentifierUri,
      config.grantTypes,
      config.responseTypes,
      config.audiences,
      config.userinfoSignedResponseAlg,
      undefined,
      config.trusted,
    );
  }

  marshal(): OAuth2ApplicationConfigModel {
    return {
      clientId: this.clientId,
      displayName: this.displayName,
      redirectUris: this.redirectUris,
      owner: this.owner,
      policyUri: this.policyUri,
      termsOfServiceUri: this.termsOfServiceUri,
      clientUri: this.clientUri,
      logoUri: this.logoUri,
      userSupportEmailAddress: this.userSupportEmailAddress,
      subjectType: this.subjectType,
      scopes: this.scopes,
      tokenEndpointAuthMethod: this.tokenEndpointAuthMethod,
      tokenEndpointAuthSigningAlg: this.tokenEndpointAuthSigningAlg,
      description: this.description ?? '',
      allowedCorsOrigins: this.allowedCorsOrigins ?? [],
      additionalContacts: this.additionalContacts ?? [],
      sectorIdentifierUri: this.sectorIdentifierUri ?? '',
      grantTypes: this.grantTypes ?? [],
      responseTypes: this.responseTypes ?? [],
      audiences: this.audiences ?? [],
      userinfoSignedResponseAlg: this.userinfoSignedResponseAlg ?? '',
      trusted: this.trusted ?? false,
    };
  }
}
