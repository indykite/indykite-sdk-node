/* eslint-disable @typescript-eslint/no-unused-vars */
import { ConfigManagementAPIClient } from '../../../grpc/indykite/config/v1beta1/config_management_api.grpc-client';
import { SdkClient } from '../client';
import { SdkError, SdkErrorCode } from '../../error';

jest.mock('fs');
import * as fs from 'fs';
import {
  CallCredentials,
  ChannelCredentials,
  ClientOptions,
  credentials,
  Interceptor,
  InterceptorOptions,
  Metadata,
  StatusObject,
} from '@grpc/grpc-js';
import { LIB_VERSION } from '../../../version';
import { IdentityManagementAPIClient } from '../../../grpc/indykite/identity/v1beta2/identity_management_api.grpc-client';
import { InterceptingListener, MessageContext } from '@grpc/grpc-js/build/src/call-stream';
import * as ClientInterceptors from '@grpc/grpc-js/build/src/client-interceptors';
import { CallMetadataOptions } from '@grpc/grpc-js/build/src/call-credentials';
import { Status } from '@grpc/grpc-js/build/src/constants';

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

class IdentityManagementAPIClientMock extends IdentityManagementAPIClient {
  endpoint: string;
  channelCredentials: ChannelCredentials;
  interceptors: Interceptor[];

  constructor(endpoint: string, channelCredentials: ChannelCredentials, options: ClientOptions) {
    super('ENDPOINT', credentials.createInsecure());
    this.endpoint = endpoint;
    this.channelCredentials = channelCredentials;
    this.interceptors = options.interceptors ?? [];
  }
}

class InterceptingCallMock extends ClientInterceptors.InterceptingCall {
  listener?: Partial<InterceptingListener>;
  private options: InterceptorOptions;

  constructor(
    options: InterceptorOptions,
    nextCall: ClientInterceptors.InterceptingCallInterface,
    requester?: Partial<ClientInterceptors.FullRequester>,
  ) {
    super(nextCall, requester);
    this.options = options;
  }

  start(metadata: Metadata, listener?: Partial<InterceptingListener>): void {
    this.listener = listener;
    super.start(metadata, listener);
  }
}

const emptyFn = () => {
  //
};

type CallCredentialsMock = CallCredentials & { metadata?: Metadata };

describe('application credentials', () => {
  beforeEach(() => {
    delete process.env.INDYKITE_APPLICATION_CREDENTIALS;
    delete process.env.INDYKITE_APPLICATION_CREDENTIALS_FILE;
  });

  it('as string', () => {
    const sdk = SdkClient.createIdentityInstance(
      ConfigManagementAPIClient,
      JSON.stringify(appCredential),
    );
    expect(sdk).resolves.toBeInstanceOf(SdkClient);
  });

  it('as env', () => {
    process.env.INDYKITE_APPLICATION_CREDENTIALS = JSON.stringify(appCredential);
    const sdk = SdkClient.createIdentityInstance(ConfigManagementAPIClient);
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
    const sdk = SdkClient.createIdentityInstance(ConfigManagementAPIClient);
    expect(sdk).resolves.toBeInstanceOf(SdkClient);
  });

  it('missing', () => {
    const sdk = SdkClient.createIdentityInstance(ConfigManagementAPIClient);
    expect(sdk).rejects.toEqual(
      new SdkError(SdkErrorCode.SDK_CODE_1, 'missing application credentials'),
    );
  });
});

describe('service account credentials', () => {
  beforeEach(() => {
    delete process.env.INDYKITE_SERVICE_ACCOUNT_CREDENTIALS;
    delete process.env.INDYKITE_SERVICE_ACCOUNT_CREDENTIALS_FILE;
  });

  it('as string', () => {
    const sdk = SdkClient.createServiceInstance(
      ConfigManagementAPIClient,
      JSON.stringify(appCredential),
    );
    expect(sdk).resolves.toBeInstanceOf(SdkClient);
  });

  it('as env', () => {
    process.env.INDYKITE_SERVICE_ACCOUNT_CREDENTIALS = JSON.stringify(appCredential);
    const sdk = SdkClient.createServiceInstance(ConfigManagementAPIClient);
    expect(sdk).resolves.toBeInstanceOf(SdkClient);
  });

  it('as file', () => {
    process.env.INDYKITE_SERVICE_ACCOUNT_CREDENTIALS_FILE = 'file';
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
      new SdkError(SdkErrorCode.SDK_CODE_1, 'missing service account credentials'),
    );
  });
});

describe('channel credential', () => {
  const originalNewChannelCredentialsFn = SdkClient['newChannelCredentials'];
  const err = new SdkError(SdkErrorCode.SDK_CODE_1, 'UNKNOWN');
  const staticFunc = jest.fn(() => {
    throw err;
  });

  beforeEach(() => {
    SdkClient['newChannelCredentials'] = staticFunc;
  });

  afterEach(() => {
    SdkClient['newChannelCredentials'] = originalNewChannelCredentialsFn;
  });

  it('identity instance', () => {
    const sdk = SdkClient.createIdentityInstance(
      ConfigManagementAPIClient,
      '{ "mocked": "example" }',
    );
    expect(sdk).rejects.toEqual(err);
  });

  it('service instance', () => {
    const sdk = SdkClient.createServiceInstance(
      ConfigManagementAPIClient,
      JSON.stringify(appCredential),
    );
    expect(sdk).rejects.toEqual(err);
  });
});

describe('call credential', () => {
  let createFromMetadataGeneratorMock: jest.SpyInstance;
  let createSslMock: jest.SpyInstance;

  beforeEach(() => {
    createFromMetadataGeneratorMock = jest
      .spyOn(credentials, 'createFromMetadataGenerator')
      .mockImplementation((fn) => {
        const callCredentialsMock = CallCredentials.createEmpty() as CallCredentialsMock;
        fn({} as CallMetadataOptions, (err, md) => {
          callCredentialsMock.metadata = md;
        });
        return callCredentialsMock;
      });
    createSslMock = jest.spyOn(credentials, 'createSsl').mockImplementation();
  });

  afterEach(() => {
    createFromMetadataGeneratorMock.mockRestore();
    createSslMock.mockRestore();
  });

  describe('interceptors', () => {
    let credentialsInterceptor: (
      options: InterceptorOptions,
      nextCall: ClientInterceptors.NextCall,
    ) => ClientInterceptors.InterceptingCall;
    let unauthenticatedStatusInterceptor: (
      options: InterceptorOptions,
      nextCall: ClientInterceptors.NextCall,
    ) => ClientInterceptors.InterceptingCall;

    beforeEach(async () => {
      const sdk = await SdkClient.createServiceInstance(
        IdentityManagementAPIClientMock,
        appCredential,
      );
      const client = sdk.client as IdentityManagementAPIClientMock;
      expect(client.interceptors).toHaveLength(2);
      [credentialsInterceptor, unauthenticatedStatusInterceptor] = client.interceptors;
    });

    it('credentials interceptor', () => {
      credentialsInterceptor({} as InterceptorOptions, (options: InterceptorOptions) => {
        const credentials = options.credentials as CallCredentialsMock;
        expect(
          /^Bearer [a-zA-Z0-9.]{8,}/.test(
            credentials.metadata?.get('authorization')?.[0].toString() ?? '',
          ),
        ).toBeTruthy();
        expect(credentials.metadata?.get('iksdk-version')).toEqual([LIB_VERSION]);
        return new InterceptingCallMock(
          {} as InterceptorOptions,
          {} as ClientInterceptors.InterceptingCallInterface,
        );
      });
    });

    describe('unauthenticated interceptor', () => {
      let runInterceptingCall: () => ClientInterceptors.InterceptingCall;
      let startInterceptor: ClientInterceptors.MetadataRequester;
      let sendMessage: ClientInterceptors.MessageRequester;

      beforeAll(() => {
        startInterceptor = emptyFn;
        sendMessage = emptyFn;
      });

      beforeEach(() => {
        runInterceptingCall = () =>
          unauthenticatedStatusInterceptor(
            {} as InterceptorOptions,
            (options: InterceptorOptions) => {
              return new InterceptingCallMock(
                options,
                new InterceptingCallMock(
                  {} as InterceptorOptions,
                  {} as ClientInterceptors.InterceptingCallInterface,
                ),
                {
                  start: startInterceptor,
                  sendMessage,
                },
              );
            },
          );
      });

      afterEach(() => {
        startInterceptor = emptyFn;
        sendMessage = emptyFn;
      });

      describe('when a message is sent', () => {
        let sentMessage: string;

        beforeEach(() => {
          return new Promise<string>((resolve) => {
            sendMessage = (message) => {
              resolve(message);
            };
            const interceptingCall = runInterceptingCall();
            interceptingCall.start(new Metadata());
            interceptingCall.sendMessage('Message to be send.');
          }).then((message) => {
            sentMessage = message;
          });
        });

        it('sends correct message', () => {
          expect(sentMessage).toBe('Message to be send.');
        });
      });

      describe('when a message is received with a correct status', () => {
        let receivedMessage: string;
        let receivedStatus: StatusObject;

        beforeEach(() => {
          return new Promise<void>((resolve) => {
            startInterceptor = (metadata, listener) => {
              listener.onReceiveMessage('Received message');
              listener.onReceiveStatus({
                code: Status.OK,
                details: 'Correct',
                metadata,
              });
            };
            const interceptingCall = runInterceptingCall();
            interceptingCall.start(new Metadata(), {
              onReceiveMessage: (message) => {
                receivedMessage = message;
              },
              onReceiveStatus: (status) => {
                receivedStatus = status;
                resolve();
              },
            });
          });
        });

        it('sends correct message', () => {
          expect(receivedMessage).toBe('Received message');
          expect(receivedStatus.code).toBe(Status.OK);
          expect(receivedStatus.details).toBe('Correct');
        });
      });

      describe('when a message is received with an unauthenticated status', () => {
        let receivedMessage: string;
        let receivedStatus: StatusObject;

        beforeEach(() => {
          return new Promise<void>((resolve) => {
            startInterceptor = jest
              .fn()
              .mockImplementationOnce((metadata, listener) => {
                listener.onReceiveMessage(null);
                listener.onReceiveStatus({
                  code: Status.UNAUTHENTICATED,
                  details: 'Error',
                  metadata,
                });
              })
              .mockImplementationOnce((metadata, listener) => {
                listener.onReceiveMessage('Received message');
                listener.onReceiveStatus({
                  code: Status.OK,
                  details: 'Correct',
                  metadata,
                });
              });
            const interceptingCall = runInterceptingCall();
            interceptingCall.start(new Metadata(), {
              onReceiveMessage: (message) => {
                receivedMessage = message;
              },
              onReceiveStatus: (status) => {
                receivedStatus = status;
                resolve();
              },
            });
          });
        });

        it('sends correct message', () => {
          expect(receivedMessage).toBe('Received message');
          expect(receivedStatus.code).toBe(Status.OK);
          expect(receivedStatus.details).toBe('Correct');
        });
      });
    });
  });
});
