import {
  ClientSubjectType,
  GrantType,
  ResponseType,
  TokenEndpointAuthMethod,
  OAuth2ApplicationConfig as OAuth2ApplicationConfigModel,
} from '../../../grpc/indykite/config/v1beta1/model';
import { SdkError, SdkErrorCode } from '../../error';

export type IOptions = {
  clientId: string;
  displayName: string;
  redirectUris: string[];
  owner: string;
  policyUri: string;
  termsOfServiceUri: string;
  clientUri: string;
  logoUri: string;
  userSupportEmailAddress: string;
  subjectType: ClientSubjectType;
  scopes: string[];
  tokenEndpointAuthMethod: TokenEndpointAuthMethod;
  tokenEndpointAuthSigningAlg: string;
  description?: string;
  allowedCorsOrigins?: string[];
  additionalContacts?: string[];
  sectorIdentifierUri?: string;
  grantTypes?: GrantType[];
  responseTypes?: ResponseType[];
  audiences?: string[];
  userinfoSignedResponseAlg?: string;
  clientSecret?: string;
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
    clientSecret?: string,
  );
  constructor(options: IOptions);
  constructor(
    clientIdOrOptions: string | IOptions,
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
    public clientSecret?: string,
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
      this.clientSecret = clientIdOrOptions.clientSecret;
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
    this.clientSecret = clientSecret;
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
    };
  }
}
