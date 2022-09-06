import { SdkError, SdkErrorCode } from '../../error';
import { ServiceAccountCredential } from '../service_account_credential';
import { serviceAccountTokenMock } from '../test_utils';

describe('Crednetial', () => {
  it('from ...', () => {
    const str = JSON.stringify(serviceAccountTokenMock);
    const buf = Buffer.from(str);
    const credBuff = ServiceAccountCredential.fromBuffer(buf);
    const credStr = ServiceAccountCredential.fromString(str);
    const credObj = ServiceAccountCredential.fromObject(serviceAccountTokenMock);
    expect(credBuff).toEqual(credObj);
    expect(credStr).toEqual(credBuff);
  });

  it('with ...', () => {
    const credObj = ServiceAccountCredential.fromObject(serviceAccountTokenMock);
    const serviceAccountId = 'gid:AA112233';
    credObj
      .withServiceAccountId(serviceAccountId)
      .withEndpoint('ENDPOINT')
      .withJwk(JSON.stringify({ key: 'JWK' }));
    expect(credObj).toMatchObject({
      serviceAccountId,
      endpoint: 'ENDPOINT',
      privateKey: { key: 'JWK' },
    });
  });
  it('build token', async () => {
    const credObj = ServiceAccountCredential.fromObject(serviceAccountTokenMock);
    const token = credObj.buildToken();
    expect(token).resolves.toHaveProperty('jwt');

    const err = new SdkError(SdkErrorCode.SDK_CODE_1, 'Must run build() function first');
    try {
      const newCred = ServiceAccountCredential.fromObject(serviceAccountTokenMock);
      newCred.token;
      expect(true).toEqual(false);
    } catch (error) {
      expect(error).toEqual(err);
    }
  });
});
