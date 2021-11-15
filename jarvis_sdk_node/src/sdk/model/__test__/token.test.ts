import { ProviderInfo, ProviderType } from '../../../grpc/indykite/identity/v1beta1/model';
import * as sdkTypes from '../../model';

describe('token', () => {
  const issuer = 'indykite.com';
  it('provider info', () => {
    const types = ['email', 'invalid', 'oidc', 'password', 'sms', 'webauthn', 'unrecognized'];
    [
      ProviderType.PROVIDER_TYPE_EMAIL,
      ProviderType.PROVIDER_TYPE_INVALID,
      ProviderType.PROVIDER_TYPE_OIDC,
      ProviderType.PROVIDER_TYPE_PASSWORD,
      ProviderType.PROVIDER_TYPE_SMS,
      ProviderType.PROVIDER_TYPE_WEBAUTHN,
      ProviderType.UNRECOGNIZED,
    ].forEach((type, idx) => {
      const pInfo = ProviderInfo.fromJSON({
        type,
        issuer,
      });
      const deserializedInfo = sdkTypes.ProviderInfo.deserialize(pInfo);
      expect(deserializedInfo.type).toEqual(types[idx]);
      expect(deserializedInfo.issuer).toEqual(issuer);
    });
  });
});
