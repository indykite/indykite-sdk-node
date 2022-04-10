import { ConfigNode } from '../../../grpc/indykite/config/v1beta1/model';
import { SdkErrorCode, SdkError } from '../../error';
import { Utils } from '../../utils/utils';
import { AuthflowFactory } from './authflow/factory';
import { AuthFlow } from './authflow/flow';
import { NodeConfiguration } from './configuration';
import { EmailProviderType, EmailProviderFactory } from './email/factory';

export type ConfigurationType = EmailProviderType | AuthFlow;

export class ConfigurationFactory {
  static createInstance(config: ConfigNode): ConfigurationType {
    if (config.config) {
      const meta = {
        displayName: config.displayName,
        etag: config.etag,
        id: config.id,
        customerId: config.customerId,
        appSpaceId: config.appSpaceId,
        tenantId: config.tenantId,
        createTime: Utils.timestampToDate(config.createTime),
        updateTime: Utils.timestampToDate(config.updateTime),
      } as NodeConfiguration;
      if (config.description) meta.description = config.description.value;

      // console.log(JSON.stringify(config, null, 2));
      switch (config.config.oneofKind) {
        case 'emailServiceConfig': {
          const provider = EmailProviderFactory.createInstance(
            config.name,
            config.config.emailServiceConfig,
          );
          const ret = Object.assign(provider, meta);
          return ret;
        }
        case 'authFlowConfig': {
          const flow = AuthflowFactory.createInstance(config.name, config.config.authFlowConfig);
          return Object.assign(flow, meta);
        }
      }
    }
    throw new SdkError(
      SdkErrorCode.SDK_CODE_1,
      `can't unmarshal configuration: ${config.config.oneofKind}`,
    );
  }
}
