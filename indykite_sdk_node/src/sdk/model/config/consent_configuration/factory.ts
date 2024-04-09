import { ConsentConfiguration } from '../../../../grpc/indykite/config/v1beta1/model';
import { ConsentNode } from './consent_configuration';

export const CONSENT_CONFIG = 'consentConfig';

export class ConsentConfigFactory {
  static createInstance(name: string, config: ConsentConfiguration): ConsentNode {
    const client = new ConsentNode({
      ...config,
      name,
    });
    return client;
  }
}
