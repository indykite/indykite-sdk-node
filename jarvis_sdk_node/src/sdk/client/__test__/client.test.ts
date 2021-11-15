/* eslint-disable @typescript-eslint/no-unused-vars */
import { ConfigManagementAPIClient } from '../../../grpc/indykite/config/v1beta1/config_management_api';
import { SdkClient } from '../client';
import { SdkError, SdkErrorCode } from '../../error';

jest.mock('fs');
import * as fs from 'fs';

const appCredential = {
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

describe('application credentials', () => {
  beforeEach(() => {
    delete process.env.INDYKITE_APPLICATION_CREDENTIALS;
    delete process.env.INDYKITE_APPLICATION_CREDENTIALS_FILE;
  });

  it('as string', () => {
    const sdk = SdkClient.createServiceInstance(
      ConfigManagementAPIClient,
      JSON.stringify(appCredential),
    );
    expect(sdk).resolves.toBeInstanceOf(SdkClient);
  });

  it('as env', () => {
    process.env.INDYKITE_APPLICATION_CREDENTIALS = JSON.stringify(appCredential);
    const sdk = SdkClient.createServiceInstance(ConfigManagementAPIClient);
    expect(sdk).resolves.toBeInstanceOf(SdkClient);
  });

  it('as file', () => {
    process.env.INDYKITE_APPLICATION_CREDENTIALS_FILE = 'file';
    const mockFunc = jest.fn(
      (
        path: fs.PathOrFileDescriptor,
        options?:
          | (fs.ObjectEncodingOptions & { flag?: string | undefined })
          | BufferEncoding
          | null
          | undefined,
      ): Buffer => {
        return Buffer.from(JSON.stringify(appCredential));
      },
    );

    jest.spyOn(fs, 'readFileSync').mockImplementation(mockFunc);
    const sdk = SdkClient.createServiceInstance(ConfigManagementAPIClient);
    expect(sdk).resolves.toBeInstanceOf(SdkClient);
  });

  it('missing', () => {
    const sdk = SdkClient.createServiceInstance(ConfigManagementAPIClient);
    expect(sdk).rejects.toEqual(
      new SdkError(SdkErrorCode.SDK_CODE_1, 'missing application credentials'),
    );
  });
});

describe('channel credential', () => {
  const err = new SdkError(SdkErrorCode.SDK_CODE_1, 'UNKNOWN');
  const staticFunc = jest.fn(() => {
    throw err;
  });

  it('identity instance', () => {
    SdkClient['newChannelCredentials'] = staticFunc;
    const sdk = SdkClient.createIdentityInstance(ConfigManagementAPIClient, 'TOKEN', 'ENDPOINT');
    expect(sdk).rejects.toEqual(err);
  });

  it('service instance', () => {
    SdkClient['newChannelCredentials'] = staticFunc;
    const sdk = SdkClient.createServiceInstance(
      ConfigManagementAPIClient,
      JSON.stringify(appCredential),
    );
    expect(sdk).rejects.toEqual(err);
  });
});
