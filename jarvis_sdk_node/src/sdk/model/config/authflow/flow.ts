import {
  AuthFlowConfig,
  AuthFlowConfig_Format,
} from '../../../../grpc/indykite/config/v1beta1/model';
import { Any } from '../../../../grpc/google/protobuf/any';
import { NodeConfiguration } from '../configuration';
import { BoolValue } from '../../../../grpc/google/protobuf/wrappers';

export type AuthFlowSourceType = AuthFlowConfig_Format;

export class AuthFlow extends NodeConfiguration {
  proto?: Any;

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
      default: BoolValue.create({ value: this.defaultFlow }),
      proto: this.proto,
    };

    return flow;
  }
}
