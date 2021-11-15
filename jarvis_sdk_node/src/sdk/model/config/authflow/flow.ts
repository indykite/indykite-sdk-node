import {
  AuthFlowConfig,
  AuthFlowConfig_Format,
} from '../../../../grpc/indykite/config/v1beta1/model';
import { Any } from '../../../../grpc/google/protobuf/any';
import { NodeConfiguration } from '../configuration';

export type AuthFlowSourceType = AuthFlowConfig_Format;

export class AuthFlow extends NodeConfiguration {
  proto?: unknown;

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
      default: this.defaultFlow,
    };
    if (this.proto) flow.proto = Any.fromJSON(this.proto);

    return flow;
  }
}
