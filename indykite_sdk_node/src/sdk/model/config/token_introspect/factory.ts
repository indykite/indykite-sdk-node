import { TokenIntrospectConfig } from '../../../../grpc/indykite/config/v1beta1/model';
import { TokenIntrospect } from './token_introspect';

export const TOKEN_INTROSPECT_CONFIG = 'tokenIntrospectConfig';

export class TokenIntrospectFactory {
  static createInstance(name: string, config: TokenIntrospectConfig): TokenIntrospect {
    const client = new TokenIntrospect({
      ...config,
      name,
    });
    return client;
  }
}
