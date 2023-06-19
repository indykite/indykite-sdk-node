import { ConfigNode } from '../../../grpc/indykite/config/v1beta1/model';
import { SdkErrorCode, SdkError } from '../../error';
import { Utils } from '../../utils/utils';
import { AuthflowFactory } from './authflow/factory';
import { AuthFlow } from './authflow/flow';
import { AuthorizationPolicy, AuthorizationPolicyFactory } from './authorization_policy';
import { NodeConfiguration } from './configuration';
import { EmailProviderType, EmailProviderFactory } from './email/factory';
import { OAuth2ClientFactory } from './oauth2_client/factory';
import { OAuth2Client } from './oauth2_client/oauth2_client';
import { WebAuthnProvider, WebAuthnProviderFactory } from './webauthn_provider';

export type ConfigurationType =
  | EmailProviderType
  | AuthFlow
  | OAuth2Client
  | WebAuthnProvider
  | AuthorizationPolicy;

export class ConfigurationFactory {
  static createInstance(config: ConfigNode): ConfigurationType {
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
      case 'oauth2ClientConfig': {
        const flow = OAuth2ClientFactory.createInstance(
          config.name,
          config.config.oauth2ClientConfig,
        );
        return Object.assign(flow, meta);
      }
      case 'webauthnProviderConfig': {
        const flow = WebAuthnProviderFactory.createInstance(
          config.name,
          config.config.webauthnProviderConfig,
        );
        return Object.assign(flow, meta);
      }
      case 'authorizationPolicyConfig': {
        const flow = AuthorizationPolicyFactory.createInstance(
          config.name,
          config.config.authorizationPolicyConfig,
        );
        return Object.assign(flow, meta);
      }
    }
    throw new SdkError(
      SdkErrorCode.SDK_CODE_1,
      `can't unmarshal configuration: ${config.config.oneofKind}`,
    );
  }
}
