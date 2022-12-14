import { AuthFlowConfig } from '../../../../grpc/indykite/config/v1beta1/model';
import { AuthFlow } from './flow';

export class AuthflowFactory {
  static createInstance(name: string, config: AuthFlowConfig): AuthFlow {
    const flow = new AuthFlow(
      name,
      config.sourceFormat,
      Buffer.from(config.source),
      config.default ? config.default.value : false,
    );
    return flow;
  }
}
