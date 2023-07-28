import { StringValue } from '../../../../grpc/google/protobuf/wrappers';
import {
  AuthorizationPolicyConfig,
  AuthorizationPolicyConfig_Status,
} from '../../../../grpc/indykite/config/v1beta1/model';
import { ConfigNode } from '../config_node';

type IOptions = {
  policy: string;
  status: AuthorizationPolicyConfig_Status;
  tags?: string[];
  name: string;
  displayName?: string;
  description?: StringValue;
};

/**
 * https://buf.build/indykite/indykiteapis/docs/main:indykite.config.v1beta1#indykite.config.v1beta1.AuthorizationPolicyConfig
 */
export class AuthorizationPolicy extends ConfigNode {
  public policy: string;
  public status: AuthorizationPolicyConfig_Status;
  public tags: string[];

  constructor(options: IOptions) {
    super(options.name);

    this.displayName = options.displayName;
    this.description = options.description;
    this.policy = options.policy;
    this.status = options.status;
    this.tags = options.tags ?? [];
  }

  marshal(): AuthorizationPolicyConfig {
    return {
      policy: this.policy,
      tags: this.tags,
      status: this.status,
    };
  }
}

export { AuthorizationPolicyConfig_Status } from '../../../../grpc/indykite/config/v1beta1/model';
