import { stringify } from 'uuid';
import * as grpcIdentity from '../../grpc/indykite/identity/v1beta1/identity_management_api';
import * as grpcModel from '../../grpc/indykite/identity/v1beta1/model';
import { Utils } from '../utils/utils';
import { DigitalTwinCore } from './digitaltwin';

export type ProviderType =
  | 'password'
  | 'oidc'
  | 'webauthn'
  | 'email'
  | 'sms'
  | 'invalid'
  | 'unrecognized';
export class ProviderInfo {
  constructor(public type: ProviderType, public issuer: string) {}

  private static deserializeProviderType(type: grpcModel.ProviderType): ProviderType {
    switch (type) {
      case grpcModel.ProviderType.EMAIL:
        return 'email';
      case grpcModel.ProviderType.INVALID:
        return 'invalid';
      case grpcModel.ProviderType.OIDC:
        return 'oidc';
      case grpcModel.ProviderType.PASSWORD:
        return 'password';
      case grpcModel.ProviderType.SMS:
        return 'sms';
      case grpcModel.ProviderType.WEBAUTHN:
        return 'webauthn';
    }
  }

  static deserialize(message: grpcModel.ProviderInfo): ProviderInfo {
    return new ProviderInfo(ProviderInfo.deserializeProviderType(message.type), message.issuer);
  }
}

export class TokenInfo {
  active?: boolean;
  customerId?: string;
  appSpaceId?: string;
  applicationId?: string;
  subject?: DigitalTwinCore;
  impersonated?: DigitalTwinCore;
  issueTime?: Date;
  expireTime?: Date;
  authenticationTime?: Date;
  providerInfo?: ProviderInfo[];

  constructor(active?: boolean) {
    if (active !== undefined) this.active = active;
  }

  static deserialize(
    message: grpcIdentity.TokenIntrospectResponse | grpcModel.IdentityTokenInfo,
  ): TokenInfo {
    const tokenInfo = 'active' in message ? new TokenInfo(message.active) : new TokenInfo();
    const msgTokenInfo = 'active' in message ? message.tokenInfo : message;
    if (msgTokenInfo) {
      tokenInfo.appSpaceId = stringify(msgTokenInfo.appSpaceId);
      tokenInfo.applicationId = stringify(msgTokenInfo.applicationId);
      tokenInfo.authenticationTime = Utils.timestampToDate(msgTokenInfo.authenticationTime);
      tokenInfo.customerId = stringify(msgTokenInfo.customerId);
      tokenInfo.expireTime = Utils.timestampToDate(msgTokenInfo.expireTime);
      if (msgTokenInfo.impersonated) {
        const dt = msgTokenInfo.impersonated;
        tokenInfo.impersonated = new DigitalTwinCore(
          stringify(dt.id),
          stringify(dt.tenantId),
          dt.kind,
          dt.state,
          dt.tags,
        );
      }
      tokenInfo.issueTime = Utils.timestampToDate(msgTokenInfo.issueTime);
      if (msgTokenInfo.subject) {
        const dt = msgTokenInfo.subject;
        tokenInfo.subject = new DigitalTwinCore(
          stringify(dt.id),
          stringify(dt.tenantId),
          dt.kind,
          dt.state,
          dt.tags,
        );
      }
      tokenInfo.providerInfo = msgTokenInfo.providerInfo.map((v) => ProviderInfo.deserialize(v));
    }
    return tokenInfo;
  }
}
