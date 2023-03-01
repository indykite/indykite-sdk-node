import { WebAuthnProviderFactory } from '../factory';
import {
  AuthenticatorAttachment,
  ConveyancePreference,
  UserVerificationRequirement,
  WebAuthnProvider,
} from '../webauthn_provider';

describe('createInstance', () => {
  let client: WebAuthnProvider;

  beforeEach(() => {
    client = WebAuthnProviderFactory.createInstance('instance-name', {
      attestationPreference: ConveyancePreference.NONE,
      authenticatorAttachment: AuthenticatorAttachment.DEFAULT,
      relyingParties: { 'http://localhost:3000': 'default' },
      requireResidentKey: false,
      userVerification: UserVerificationRequirement.PREFERRED,
    });
  });

  it('creates a correct instance', () => {
    expect(client).toEqual(
      new WebAuthnProvider({
        name: 'instance-name',
        attestationPreference: ConveyancePreference.NONE,
        authenticatorAttachment: AuthenticatorAttachment.DEFAULT,
        relyingParties: {
          'http://localhost:3000': 'default',
        },
        requireResidentKey: false,
        userVerification: UserVerificationRequirement.PREFERRED,
      }),
    );
  });
});
