// import exp = require('constants');
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
    const err = new SdkError(SdkErrorCode.SDK_CODE_1, 'Must run buildToken() function first');
    try {
      credStr.getExpirationTime();
    } catch (error) {
      expect(error).toEqual(err);
    }
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

    const err = new SdkError(SdkErrorCode.SDK_CODE_1, 'Must run buildToken() function first');
    try {
      const newCred = ApplicationCredential.fromObject(applicationTokenMock);
      newCred.token;
      expect(true).toEqual(false);
    } catch (error) {
      expect(error).toEqual(err);
    }
  });
  it('build token - get expiration time valid', async () => {
    const newCred = ApplicationCredential.fromObject(applicationTokenMock);
    const token = await newCred.buildToken();
    expect(token.getExpirationTime()).not.toBeUndefined();
    expect(token.getExpirationTime().getTime()).toBeGreaterThan(new Date().getTime());
  });
  it('build token - get expiration time invalid, in the future', async () => {
    const newCred = ApplicationCredential.fromObject(applicationTokenMock);
    const token = await newCred.buildToken();
    expect(token.getExpirationTime().getTime()).not.toBeGreaterThan(
      new Date().setHours(token.getExpirationTime().getHours() + 2),
    );
  });
  it('build token - get expiration time invalid, in the past', async () => {
    const newCred = ApplicationCredential.fromObject(applicationTokenMock);
    const tmpDate = new Date();
    tmpDate.setHours(tmpDate.getHours() - 2);
    newCred['expirationTime'] = tmpDate;
    expect(newCred.getExpirationTime().getTime()).not.toBeGreaterThan(new Date().getTime());
    const token = await newCred.buildToken();
    expect(token.getExpirationTime().getTime()).not.toBeGreaterThan(
      new Date().setHours(token.getExpirationTime().getHours() + 2),
    );
  });
  it('check credentials tokenLifetime', async () => {
    const credObj = ApplicationCredential.fromObject(applicationTokenMock);
    expect(applicationTokenMock).toHaveProperty('tokenLifetime');
    const tokenLifetimeString: string = credObj.getTokenLifetime(false) as string;
    const tokenLifetimeDate: Date = credObj.getTokenLifetime(true) as Date;
    expect(tokenLifetimeString).not.toBeUndefined();
    expect(tokenLifetimeDate).not.toBeUndefined();
  });
});
