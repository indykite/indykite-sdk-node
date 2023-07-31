import { ConfigNode } from '../../../grpc/indykite/config/v1beta1/model';
import { SdkErrorCode, SkdErrorText, SdkError } from '../../error';
import { Utils } from '../../utils/utils';
import { AUTH_FLOW_CONFIG, AuthflowFactory } from './authflow/factory';
import { AUTHORIZATION_POLICY_CONFIG, AuthorizationPolicyFactory } from './authorization_policy';
import { ConfigNodeType, ConfigNode as ConfigNodeSDK } from './config_node';
import { EMAIL_SERVICE_CONFIG, EmailServiceFactory } from './email/factory';
import { OAUTH2_CLIENT_CONFIG, OAuth2ClientFactory } from './oauth2_client/factory';
import { WEBAUTHN_PROVIDER_CONFIG, WebAuthnProviderFactory } from './webauthn_provider';

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
      tenantId: config.tenantId,
      createTime: Utils.timestampToDate(config.createTime),
      updateTime: Utils.timestampToDate(config.updateTime),
      createdBy: config.createdBy,
      updatedBy: config.updatedBy,
    } as ConfigNode;
    if (config.description) meta.description = config.description;

    switch (config.config.oneofKind) {
      case EMAIL_SERVICE_CONFIG: {
        const provider = EmailServiceFactory.createInstance(
          config.name,
          config.config.emailServiceConfig,
        );
        const ret = Object.assign(provider, meta);
        return ret;
      }
      case AUTH_FLOW_CONFIG: {
        const flow = AuthflowFactory.createInstance(config.name, config.config.authFlowConfig);
        return Object.assign(flow, meta);
      }
      case OAUTH2_CLIENT_CONFIG: {
        const flow = OAuth2ClientFactory.createInstance(
          config.name,
          config.config.oauth2ClientConfig,
        );
        return Object.assign(flow, meta);
      }
      case WEBAUTHN_PROVIDER_CONFIG: {
        const flow = WebAuthnProviderFactory.createInstance(
          config.name,
          config.config.webauthnProviderConfig,
        );
        return Object.assign(flow, meta);
      }
      case AUTHORIZATION_POLICY_CONFIG: {
        const flow = AuthorizationPolicyFactory.createInstance(
          config.name,
          config.config.authorizationPolicyConfig,
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
