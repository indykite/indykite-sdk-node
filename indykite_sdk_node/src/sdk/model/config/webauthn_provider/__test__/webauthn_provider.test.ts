import {
  AuthenticatorAttachment,
  ConveyancePreference,
  UserVerificationRequirement,
  WebAuthnProvider,
} from '../webauthn_provider';

describe('when the instance is created', () => {
  let client: WebAuthnProvider;

  beforeEach(() => {
    client = new WebAuthnProvider({
      name: 'instance-name',
      displayName: 'Instance Name',
      description: { value: 'Instance description' },
      attestationPreference: ConveyancePreference.NONE,
      authenticatorAttachment: AuthenticatorAttachment.DEFAULT,
      relyingParties: { 'http://localhost:3000': 'default' },
      requireResidentKey: false,
      userVerification: UserVerificationRequirement.PREFERRED,
    });
  });

  it('creates a correct instance', () => {
    expect(client.name).toBe('instance-name');
    expect(client.displayName).toBe('Instance Name');
    expect(client.description?.value).toBe('Instance description');
    expect(client.attestationPreference).toBe(ConveyancePreference.NONE);
    expect(client.authenticatorAttachment).toBe(AuthenticatorAttachment.DEFAULT);
    expect(client.relyingParties).toEqual({ 'http://localhost:3000': 'default' });
    expect(client.requireResidentKey).toBe(false);
    expect(client.userVerification).toBe(UserVerificationRequirement.PREFERRED);
  });

  it('marshals correctly', () => {
    expect(client.marshal()).toEqual({
      attestationPreference: 1,
      authenticationTimeout: undefined,
      authenticatorAttachment: 1,
      registrationTimeout: undefined,
      relyingParties: {
        'http://localhost:3000': 'default',
      },
      requireResidentKey: false,
      userVerification: 1,
    });
  });
});
