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

    const err = new SdkError(SdkErrorCode.SDK_CODE_1, 'Must run buildToken() function first');
    try {
      const newCred = ServiceAccountCredential.fromObject(serviceAccountTokenMock);
      newCred.token;
      expect(true).toEqual(false);
    } catch (error) {
      expect(error).toEqual(err);
    }
  });
  it('build token - get expiration time fail', async () => {
    const err = new SdkError(SdkErrorCode.SDK_CODE_1, 'Must run buildToken() function first');
    try {
      const newCred = ServiceAccountCredential.fromObject(serviceAccountTokenMock);
      newCred.getExpirationTime();
      expect(true).toEqual(false);
    } catch (error) {
      expect(error).toEqual(err);
    }
  });
  it('build token - get expiration time fail', async () => {
    const newCred = ServiceAccountCredential.fromObject(serviceAccountTokenMock);
    const token = await newCred.buildToken();
    expect(token.getExpirationTime()).not.toBeUndefined();
  });
  it('build token - get expiration time valid', async () => {
    const newCred = ServiceAccountCredential.fromObject(serviceAccountTokenMock);
    const token = await newCred.buildToken();
    expect(token.getExpirationTime().getTime()).toBeGreaterThan(new Date().getTime());
  });
  it('build token - get expiration time invalid, in the future', async () => {
    const newCred = ServiceAccountCredential.fromObject(serviceAccountTokenMock);
    const token = await newCred.buildToken();
    expect(token.getExpirationTime().getTime()).not.toBeGreaterThan(new Date().setHours(token.getExpirationTime().getHours() + 2));
  });
});
