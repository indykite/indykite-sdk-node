import * as grpcModel from '../../grpc/indykite/identity/v1beta2/model';
import { DigitalTwinCore } from './digitaltwin';

export type ProviderType =
  | 'password'
  | 'oidc'
  | 'webauthn'
  | 'email'
  | 'sms'
  | 'invalid'
  | 'custom'
  | 'unrecognized';
export class ProviderInfo {
  constructor(
    public type: ProviderType,
    public issuer: string,
  ) {}

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
      case grpcModel.ProviderType.CUSTOM:
        return 'custom';
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
}

export class IdentityTokenInfo {
  active?: boolean;
  tokenInfo?: {
    oneofKind: 'identityToken';
    identityToken: {
      customerId?: string;
      appSpaceId?: string;
      applicationId?: string;
      subject?: DigitalTwinCore;
      impersonated?: DigitalTwinCore;
      issueTime?: Date;
      expireTime?: Date;
      authenticationTime?: Date;
      providerInfo?: ProviderInfo[];
    };
  };

  constructor(active?: boolean) {
    if (active !== undefined) this.active = active;
  }
}
