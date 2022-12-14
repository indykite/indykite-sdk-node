import { ProviderInfo, ProviderType } from '../../../grpc/indykite/identity/v1beta1/model';
import * as sdkTypes from '../../model';

describe('token', () => {
  const issuer = 'indykite.com';
  it('provider info', () => {
    const types = ['email', 'invalid', 'oidc', 'password', 'sms', 'webauthn'];
    [
      ProviderType.EMAIL,
      ProviderType.INVALID,
      ProviderType.OIDC,
      ProviderType.PASSWORD,
      ProviderType.SMS,
      ProviderType.WEBAUTHN,
    ].forEach((type, idx) => {
      const pInfo = ProviderInfo.fromJson({
        type,
        issuer,
      });
      const deserializedInfo = sdkTypes.ProviderInfo.deserialize(pInfo);
      expect(deserializedInfo.type).toEqual(types[idx]);
      expect(deserializedInfo.issuer).toEqual(issuer);
    });
  });
});
