import { ConfigNode } from '../../../grpc/indykite/config/v1beta1/model';
import { SdkErrorCode, SkdErrorText, SdkError } from '../../error';
import { Utils } from '../../utils/utils';
import { AUTHORIZATION_POLICY_CONFIG, AuthorizationPolicyFactory } from './authorization_policy';
import { ConfigNodeType, ConfigNode as ConfigNodeSDK } from './config_node';
import { CONSENT_CONFIG, ConsentConfigFactory } from './consent_configuration/factory';
import { TOKEN_INTROSPECT_CONFIG, TokenIntrospectFactory } from './token_introspect/factory';

export class ConfigNodeFactory {
  static createInstance(config: ConfigNode | undefined): ConfigNodeType {
    if (!config) {
      throw new SdkError(
        SdkErrorCode.SDK_CODE_2,
        SkdErrorText.SDK_CODE_2(ConfigNode.typeName, undefined),
      );
    }
    const meta = {
      id: config.id,
      displayName: config.displayName,
      etag: config.etag,
      customerId: config.customerId,
      appSpaceId: config.appSpaceId,
      createTime: Utils.timestampToDate(config.createTime),
      updateTime: Utils.timestampToDate(config.updateTime),
      createdBy: config.createdBy,
      updatedBy: config.updatedBy,
    } as ConfigNode;
    if (config.description) meta.description = config.description;

    switch (config.config.oneofKind) {
      case AUTHORIZATION_POLICY_CONFIG: {
        const flow = AuthorizationPolicyFactory.createInstance(
          config.name,
          config.config.authorizationPolicyConfig,
        );
        return Object.assign(flow, meta);
      }
      case CONSENT_CONFIG: {
        const flow = ConsentConfigFactory.createInstance(config.name, config.config.consentConfig);
        return Object.assign(flow, meta);
      }
      case TOKEN_INTROSPECT_CONFIG: {
        const flow = TokenIntrospectFactory.createInstance(
          config.name,
          config.config.tokenIntrospectConfig,
        );
        return Object.assign(flow, meta);
      }
    }
    throw new SdkError(
      SdkErrorCode.SDK_CODE_2,
      SkdErrorText.SDK_CODE_2(ConfigNodeSDK.name, config.config.oneofKind),
    );
  }
}
