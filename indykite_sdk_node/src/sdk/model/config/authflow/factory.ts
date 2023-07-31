import { AuthFlowConfig } from '../../../../grpc/indykite/config/v1beta1/model';
import { AuthFlow } from './flow';

export const AUTH_FLOW_CONFIG = 'authFlowConfig';
export class AuthflowFactory {
  static createInstance(name: string, config: AuthFlowConfig): AuthFlow {
    const flow = new AuthFlow(
      name,
      config.sourceFormat,
      Buffer.from(config.source),
      config.default ?? false,
    );
    return flow;
  }
}
