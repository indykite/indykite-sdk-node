import { StringValue } from '../../../../grpc/google/protobuf/wrappers';
import {
  TokenIntrospectConfig,
  TokenIntrospectConfig_Claim,
} from '../../../../grpc/indykite/config/v1beta1/model';
import {
  TokenIntrospectConfig_JWT,
  TokenIntrospectConfig_Opaque,
  TokenIntrospectConfig_Offline,
  TokenIntrospectConfig_Online,
} from '../../../../grpc/indykite/config/v1beta1/model';
import { ConfigNode } from '../config_node';

type IOptions = {
  tokenMatcher:
    | { oneofKind: 'jwt'; jwt: TokenIntrospectConfig_JWT }
    | { oneofKind: 'opaque'; opaque: TokenIntrospectConfig_Opaque }
    | { oneofKind: undefined };
  validation:
    | { oneofKind: 'offline'; offline: TokenIntrospectConfig_Offline }
    | { oneofKind: 'online'; online: TokenIntrospectConfig_Online }
    | { oneofKind: undefined };
  claimsMapping: { [key: string]: TokenIntrospectConfig_Claim };
  name: string;
  displayName?: string;
  description?: StringValue;
  ikgNodeType: string;
  performUpsert: boolean;
};

export { TokenIntrospectConfig_Claim };

/**
 * https://buf.build/indykite/indykiteapis/docs/main:indykite.config.v1beta1#indykite.config.v1beta1.TokenIntrospectConfig
 */
export class TokenIntrospect extends ConfigNode {
  public tokenMatcher:
    | { oneofKind: 'jwt'; jwt: TokenIntrospectConfig_JWT }
    | { oneofKind: 'opaque'; opaque: TokenIntrospectConfig_Opaque }
    | { oneofKind: undefined };
  public validation:
    | { oneofKind: 'offline'; offline: TokenIntrospectConfig_Offline }
    | { oneofKind: 'online'; online: TokenIntrospectConfig_Online }
    | { oneofKind: undefined };
  public claimsMapping: { [key: string]: TokenIntrospectConfig_Claim };
  public ikgNodeType: string;
  public performUpsert: boolean;

  constructor(options: IOptions) {
    super(options.name);

    this.displayName = options.displayName;
    this.description = options.description;
    this.tokenMatcher = options.tokenMatcher;
    this.validation = options.validation;
    this.claimsMapping = options.claimsMapping;
    this.ikgNodeType = options.ikgNodeType;
    this.performUpsert = options.performUpsert;
  }

  marshal(): TokenIntrospectConfig {
    return {
      tokenMatcher: this.tokenMatcher,
      validation: this.validation,
      claimsMapping: this.claimsMapping,
      ikgNodeType: this.ikgNodeType,
      performUpsert: this.performUpsert,
    };
  }
}
