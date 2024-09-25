import { ExternalDataResolverConfig } from '../../../../grpc/indykite/config/v1beta1/model';
import { ExternalDataResolver } from './external_data_resolver';

export const EXTERNAL_DATA_RESOLVER_CONFIG = 'externalDataResolverConfig';

export class ExternalDataResolverFactory {
  static createInstance(name: string, config: ExternalDataResolverConfig): ExternalDataResolver {
    const client = new ExternalDataResolver({
      ...config,
      name,
    });
    return client;
  }
}
