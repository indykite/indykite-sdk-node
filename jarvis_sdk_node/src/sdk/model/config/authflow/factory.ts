import { AuthFlowConfig } from '../../../../grpc/indykite/config/v1beta1/model';
import { AuthFlow } from './flow';

export class AuthflowFactory {
  static createInstance(name: string, config: AuthFlowConfig): AuthFlow {
    const flow = new AuthFlow(name, config.sourceFormat, config.source, config.default);
    if (config.proto) flow.proto = config.proto;
    return flow;
  }
}
