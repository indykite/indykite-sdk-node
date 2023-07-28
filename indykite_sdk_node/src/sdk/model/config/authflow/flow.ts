import {
  AuthFlowConfig,
  AuthFlowConfig_Format,
} from '../../../../grpc/indykite/config/v1beta1/model';
import { ConfigNode } from '../config_node';

export type AuthFlowSourceType = AuthFlowConfig_Format;

export class AuthFlow extends ConfigNode {
  constructor(
    name: string,
    public type: AuthFlowSourceType,
    public source: Buffer,
    public defaultFlow?: boolean,
  ) {
    super(name);
  }

  marshal(): AuthFlowConfig {
    const flow: AuthFlowConfig = {
      sourceFormat: this.type,
      source: this.source,
      default: this.defaultFlow ?? false,
    };

    return flow;
  }
}
