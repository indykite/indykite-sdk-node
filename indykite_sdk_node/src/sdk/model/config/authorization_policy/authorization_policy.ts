import {
  AuthorizationPolicyConfig,
  AuthorizationPolicyConfig_Status,
} from '../../../../grpc/indykite/config/v1beta1/model';
import { NodeConfiguration } from '../configuration';

type IOptions = {
  policy: string;
  status: AuthorizationPolicyConfig_Status;
  tags?: string[];
  name: string;
  displayName?: string;
  description?: string;
};

export class AuthorizationPolicy extends NodeConfiguration {
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
