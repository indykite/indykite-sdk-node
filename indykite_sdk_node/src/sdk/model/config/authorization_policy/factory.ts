import { AuthorizationPolicyConfig } from '../../../../grpc/indykite/config/v1beta1/model';
import { AuthorizationPolicy } from './authorization_policy';

export class AuthorizationPolicyFactory {
  static createInstance(name: string, config: AuthorizationPolicyConfig): AuthorizationPolicy {
    const client = new AuthorizationPolicy({
      ...config,
      name,
    });
    return client;
  }
}
