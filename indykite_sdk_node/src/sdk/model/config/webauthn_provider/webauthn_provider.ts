import {
  AuthenticatorAttachment,
  ConveyancePreference,
  UserVerificationRequirement,
  WebAuthnProviderConfig,
} from '../../../../grpc/indykite/config/v1beta1/model';
import { Utils } from '../../../utils/utils';
import { NodeConfiguration } from '../configuration';

type IOptions = {
  relyingParties: Record<string, string>;
  requireResidentKey: boolean;
  attestationPreference: ConveyancePreference;
  authenticatorAttachment: AuthenticatorAttachment;
  userVerification: UserVerificationRequirement;
  registrationTimeout?: number;
  authenticationTimeout?: number;
  name: string;
  displayName?: string;
  description?: string;
};

export class WebAuthnProvider extends NodeConfiguration {
  public relyingParties: Record<string, string>;
  public requireResidentKey: boolean;
  public attestationPreference: ConveyancePreference;
  public authenticatorAttachment: AuthenticatorAttachment;
  public userVerification: UserVerificationRequirement;
  public registrationTimeout?: number;
  public authenticationTimeout?: number;

  constructor(options: IOptions) {
    super(options.name);

    this.displayName = options.displayName;
    this.description = options.description;
    this.relyingParties = options.relyingParties;
    this.requireResidentKey = options.requireResidentKey;
    this.attestationPreference = options.attestationPreference;
    this.authenticatorAttachment = options.authenticatorAttachment;
    this.userVerification = options.userVerification;
    this.registrationTimeout = options.registrationTimeout;
    this.authenticationTimeout = options.authenticationTimeout;
  }

  marshal(): WebAuthnProviderConfig {
    return {
      relyingParties: this.relyingParties,
      requireResidentKey: this.requireResidentKey,
      attestationPreference: this.attestationPreference,
      authenticatorAttachment: this.authenticatorAttachment,
      userVerification: this.userVerification,
      registrationTimeout: Utils.numberToDuration(this.registrationTimeout),
      authenticationTimeout: Utils.numberToDuration(this.authenticationTimeout),
    };
  }
}

export {
  AuthenticatorAttachment,
  ConveyancePreference,
  UserVerificationRequirement,
} from '../../../../grpc/indykite/config/v1beta1/model';
