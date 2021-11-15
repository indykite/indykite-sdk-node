import { v4 } from 'uuid';
import { SdkError, SdkErrorCode } from '../../error';
import { ApplicationCredential } from '../credential';

const applicationToken = {
  appSpaceId: '696e6479-6b69-4465-8000-010f00000000',
  appAgentId: '696e6479-6b69-4465-8000-050f00000000',
  endpoint: 'jarvis.local:8043',
  privateKeyJWK: {
    kty: 'EC',
    d: 'WNzV013IthOWgjef4eNVXzTQUYy6hb6DD5riu_5SZNI',
    use: 'sig',
    crv: 'P-256',
    kid: 'EfUEiFnOzA5PCp8SSksp7iXv7cHRehCsIGo6NAQ9H7w',
    x: 'sMeLa9xExlGkmo6tr2KSv4rqbYXdAM1RBkTNehZ_XfQ',
    y: 'FqBmruVIbVykGMWjVcv4VhN_XbMxW3rLqRcJ8mAUOdY',
    alg: 'ES256',
  },
};

describe('Crednetial', () => {
  it('from ...', () => {
    const str = JSON.stringify(applicationToken);
    const buf = Buffer.from(str);
    const credBuff = ApplicationCredential.fromBuffer(buf);
    const credStr = ApplicationCredential.fromString(str);
    const credObj = ApplicationCredential.fromObject(applicationToken);
    expect(credBuff).toEqual(credObj);
    expect(credStr).toEqual(credBuff);
  });

  it('with ...', () => {
    const credObj = ApplicationCredential.fromObject(applicationToken);
    const appSpaceId = v4();
    const agentId = v4();
    credObj
      .withAppAgentId(agentId)
      .withAppSpaceId(appSpaceId)
      .withEndpoint('ENDPOINT')
      .withJwk(JSON.stringify({ key: 'JWK' }));
    expect(credObj).toMatchObject({
      appSpaceId,
      appAgentId: agentId,
      endpoint: 'ENDPOINT',
      privateKey: { key: 'JWK' },
    });
  });
  it('build token', async () => {
    const credObj = ApplicationCredential.fromObject(applicationToken);
    let token = credObj.buildToken();
    expect(token).resolves.toHaveProperty('jwt');

    let err = new SdkError(SdkErrorCode.SDK_CODE_1, 'Missing or invalid format of appAgentId');
    credObj.withAppAgentId('NOT_VALID_UUID');
    token = credObj.buildToken();
    expect(token).rejects.toEqual(err);

    err = new SdkError(SdkErrorCode.SDK_CODE_1, 'Missing or invalid format of appSpaceId');
    credObj.withAppAgentId(v4()).withAppSpaceId('NOT_VALID_UUID');
    token = credObj.buildToken();
    expect(token).rejects.toEqual(err);

    err = new SdkError(SdkErrorCode.SDK_CODE_1, 'Must run build() function first');
    try {
      const newCred = ApplicationCredential.fromObject(applicationToken);
      newCred.token;
      expect(true).toEqual(false);
    } catch (error) {
      expect(error).toEqual(err);
    }
  });
});
