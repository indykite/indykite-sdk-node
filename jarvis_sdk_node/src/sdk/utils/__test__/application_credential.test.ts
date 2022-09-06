import { SdkError, SdkErrorCode } from '../../error';
import { ApplicationCredential } from '../application_credential';
import { applicationTokenMock } from '../test_utils';

describe('Crednetial', () => {
  it('from ...', () => {
    const str = JSON.stringify(applicationTokenMock);
    const buf = Buffer.from(str);
    const credBuff = ApplicationCredential.fromBuffer(buf);
    const credStr = ApplicationCredential.fromString(str);
    const credObj = ApplicationCredential.fromObject(applicationTokenMock);
    expect(credBuff).toEqual(credObj);
    expect(credStr).toEqual(credBuff);
  });

  it('with ...', () => {
    const credObj = ApplicationCredential.fromObject(applicationTokenMock);
    const agentId = 'gid:AAABBBCCCDDD';
    credObj
      .withAppAgentId(agentId)
      .withEndpoint('ENDPOINT')
      .withJwk(JSON.stringify({ key: 'JWK' }));
    expect(credObj).toMatchObject({
      appAgentId: agentId,
      endpoint: 'ENDPOINT',
      privateKey: { key: 'JWK' },
    });
  });
  it('build token', async () => {
    const credObj = ApplicationCredential.fromObject(applicationTokenMock);
    const token = credObj.buildToken();
    expect(token).resolves.toHaveProperty('jwt');

    const err = new SdkError(SdkErrorCode.SDK_CODE_1, 'Must run build() function first');
    try {
      const newCred = ApplicationCredential.fromObject(applicationTokenMock);
      newCred.token;
      expect(true).toEqual(false);
    } catch (error) {
      expect(error).toEqual(err);
    }
  });
});
