import {
  GrantType,
  ResponseType,
  TokenEndpointAuthMethod,
  OAuth2ProviderConfig as OAuth2ProviderConfigModel,
} from '../../../grpc/indykite/config/v1beta1/model';
import { SdkError, SdkErrorCode } from '../../error';

export type IOAuth2ProviderConfigOptions = {
  grantTypes: GrantType[];
  responseTypes: ResponseType[];
  scopes: string[];
  tokenEndpointAuthMethod: TokenEndpointAuthMethod[];
  tokenEndpointAuthSigningAlg: string[];
  requestUris?: string[];
  requestObjectSigningAlg?: string;
  frontChannelLoginUri: Record<string, string>;
  frontChannelConsentUri: Record<string, string>;
  trusted: boolean;
};

export { GrantType, ResponseType, TokenEndpointAuthMethod };

export class OAuth2ProviderConfig {
  public grantTypes: GrantType[];
  public responseTypes: ResponseType[];
  public scopes: string[];
  public tokenEndpointAuthMethod: TokenEndpointAuthMethod[];
  public tokenEndpointAuthSigningAlg: string[];
  public frontChannelLoginUri: Record<string, string>;
  public frontChannelConsentUri: Record<string, string>;

  constructor(
    grantTypes: GrantType[],
    responseTypes: ResponseType[],
    scopes: string[],
    tokenEndpointAuthMethod: TokenEndpointAuthMethod[],
    tokenEndpointAuthSigningAlg: string[],
    frontChannelLoginUri: Record<string, string>,
    frontChannelConsentUri: Record<string, string>,
    requestUris?: string[],
    requestObjectSigningAlg?: string,
  );
  constructor(options: IOAuth2ProviderConfigOptions);
  constructor(
    grantTypesOrOptions: GrantType[] | IOAuth2ProviderConfigOptions,
    responseTypes?: ResponseType[],
    scopes?: string[],
    tokenEndpointAuthMethod?: TokenEndpointAuthMethod[],
    tokenEndpointAuthSigningAlg?: string[],
    frontChannelLoginUri?: Record<string, string>,
    frontChannelConsentUri?: Record<string, string>,
    public requestUris?: string[],
    public requestObjectSigningAlg?: string,
  ) {
    if (!Array.isArray(grantTypesOrOptions)) {
      this.grantTypes = grantTypesOrOptions.grantTypes;
      this.responseTypes = grantTypesOrOptions.responseTypes;
      this.scopes = grantTypesOrOptions.scopes;
      this.tokenEndpointAuthMethod = grantTypesOrOptions.tokenEndpointAuthMethod;
      this.tokenEndpointAuthSigningAlg = grantTypesOrOptions.tokenEndpointAuthSigningAlg;
      this.requestUris = grantTypesOrOptions.requestUris;
      this.requestObjectSigningAlg = grantTypesOrOptions.requestObjectSigningAlg;
      this.frontChannelLoginUri = grantTypesOrOptions.frontChannelLoginUri;
      this.frontChannelConsentUri = grantTypesOrOptions.frontChannelConsentUri;
      return;
    }

    if (
      responseTypes === undefined ||
      scopes === undefined ||
      tokenEndpointAuthMethod === undefined ||
      tokenEndpointAuthSigningAlg === undefined ||
      frontChannelLoginUri === undefined ||
      frontChannelConsentUri === undefined
    ) {
      throw new SdkError(SdkErrorCode.SDK_CODE_1, "Can't create OAuth2 provider configuration");
    }

    this.grantTypes = grantTypesOrOptions;
    this.responseTypes = responseTypes;
    this.scopes = scopes;
    this.tokenEndpointAuthMethod = tokenEndpointAuthMethod;
    this.tokenEndpointAuthSigningAlg = tokenEndpointAuthSigningAlg;
    this.requestUris = requestUris;
    this.requestObjectSigningAlg = requestObjectSigningAlg;
    this.frontChannelLoginUri = frontChannelLoginUri;
    this.frontChannelConsentUri = frontChannelConsentUri;
  }

  static deserialize(config: OAuth2ProviderConfigModel): OAuth2ProviderConfig {
    return new OAuth2ProviderConfig(
      config.grantTypes,
      config.responseTypes,
      config.scopes,
      config.tokenEndpointAuthMethod,
      config.tokenEndpointAuthSigningAlg,
      config.frontChannelLoginUri,
      config.frontChannelConsentUri,
      config.requestUris,
      config.requestObjectSigningAlg,
    );
  }

  marshal(): OAuth2ProviderConfigModel {
    return {
      grantTypes: this.grantTypes,
      responseTypes: this.responseTypes,
      scopes: this.scopes,
      tokenEndpointAuthMethod: this.tokenEndpointAuthMethod,
      tokenEndpointAuthSigningAlg: this.tokenEndpointAuthSigningAlg,
      requestUris: this.requestUris ?? [],
      requestObjectSigningAlg: this.requestObjectSigningAlg ?? '',
      frontChannelLoginUri: this.frontChannelLoginUri,
      frontChannelConsentUri: this.frontChannelConsentUri,
    };
  }
}
