import {
  Metadata,
  credentials,
  ChannelCredentials,
  ClientOptions,
  InterceptorOptions,
  CallCredentials,
} from '@grpc/grpc-js';
import { InterceptingCall, NextCall } from '@grpc/grpc-js/build/src/client-interceptors';
import { Status } from '@grpc/grpc-js/build/src/constants';
import { readFileSync } from 'fs';

import { ConfigManagementAPIClient } from '../../grpc/indykite/config/v1beta1/config_management_api';
import { IdentityManagementAPIClient } from '../../grpc/indykite/identity/v1beta1/identity_management_api';

import { SdkErrorCode, SdkError } from '../error';
import { ApplicationCredential } from '../utils/credential';
import { LIB_VERSION } from '../../version';

type ClientType = IdentityManagementAPIClient | ConfigManagementAPIClient;
type ClientConstructor = new (
  endpoint: string,
  channelCredential: ChannelCredentials,
  options: ClientOptions,
) => ClientType;

export class SdkClient {
  callCredential: CallCredentials;
  client: ClientType;
  getNewCallCredential: () => Promise<CallCredentials>;

  private constructor(
    c: ClientConstructor,
    endpoint: string,
    channelCredential: ChannelCredentials,
    callCredential: CallCredentials,
    getNewCallCredential: () => Promise<CallCredentials>,
  ) {
    this.client = new c(endpoint, channelCredential, {
      interceptors: [this.getCredentialsInterceptor(), this.getUnauthenticatedStatusInterceptor()],
    });
    this.getNewCallCredential = getNewCallCredential;
    this.callCredential = callCredential;
  }

  private static newChannelCredentials() {
    return credentials.createSsl();
  }

  private static newCallCredentials(token: string) {
    return credentials.createFromMetadataGenerator((params, callback) => {
      const md = new Metadata();
      md.set('authorization', 'Bearer ' + token);
      md.set('iksdk-version', LIB_VERSION);
      callback(null, md);
    });
  }

  private static getApplicationCredential(appCredential?: string | unknown): ApplicationCredential {
    if (appCredential) {
      if (typeof appCredential === 'string') {
        return ApplicationCredential.fromString(appCredential);
      } else {
        return ApplicationCredential.fromObject(appCredential);
      }
    } else if (process.env.INDYKITE_APPLICATION_CREDENTIALS) {
      const token = process.env.INDYKITE_APPLICATION_CREDENTIALS;
      return ApplicationCredential.fromString(token);
    } else if (process.env.INDYKITE_APPLICATION_CREDENTIALS_FILE) {
      const token = readFileSync(process.env.INDYKITE_APPLICATION_CREDENTIALS_FILE);
      return ApplicationCredential.fromBuffer(token);
    } else {
      throw new SdkError(SdkErrorCode.SDK_CODE_1, 'missing application credentials');
    }
  }

  private getCredentialsInterceptor() {
    return (options: InterceptorOptions, nextCall: NextCall): InterceptingCall => {
      const optionsWithCredentials = {
        ...options,
        credentials: this.callCredential,
      };
      return new InterceptingCall(nextCall(optionsWithCredentials), {});
    };
  }

  private getUnauthenticatedStatusInterceptor() {
    return (options: InterceptorOptions, nextCall: NextCall): InterceptingCall => {
      let originalMessage: unknown;
      let savedMessageContent: unknown;
      let savedMessageNext: (message: unknown) => void;
      return new InterceptingCall(nextCall(options), {
        start: (metadata, listener, next) => {
          next(metadata, {
            onReceiveMessage: (message, next) => {
              savedMessageContent = message;
              savedMessageNext = next;
            },
            onReceiveStatus: async (status, next) => {
              if (status.code === Status.UNAUTHENTICATED) {
                await this.refreshCallCredentials();
                const newOptions = {
                  ...options,
                  credentials: this.callCredential,
                };
                const newCall = nextCall(newOptions);
                newCall.start(metadata, {
                  onReceiveMessage: (message) => {
                    savedMessageContent = message;
                  },
                  onReceiveStatus: (status) => {
                    if (savedMessageNext) {
                      savedMessageNext(savedMessageContent);
                    }
                    next(status);
                  },
                });
                newCall.sendMessage(originalMessage);
                newCall.halfClose();
              } else {
                if (savedMessageNext) {
                  savedMessageNext(savedMessageContent);
                }
                next(status);
              }
            },
          });
        },
        sendMessage: (message, next) => {
          originalMessage = message;
          next(message);
        },
      });
    };
  }

  private async refreshCallCredentials() {
    this.callCredential = await this.getNewCallCredential();
  }

  static async createIdentityInstance(
    c: ClientConstructor,
    identityToken: string,
    endpoint: string,
  ): Promise<SdkClient> {
    const createCallCredential = async () => {
      return SdkClient.newCallCredentials(identityToken);
    };

    return new SdkClient(
      c,
      endpoint,
      this.newChannelCredentials(),
      await createCallCredential(),
      createCallCredential,
    );
  }

  static async createServiceInstance(
    c: ClientConstructor,
    appCredential?: string | unknown,
  ): Promise<SdkClient> {
    const createCallCredential = async () => {
      const builtCredential = await applicationCredential.buildToken();
      return SdkClient.newCallCredentials(builtCredential.token);
    };

    const applicationCredential = SdkClient.getApplicationCredential(appCredential);
    return new SdkClient(
      c,
      applicationCredential.getEndpoint(),
      this.newChannelCredentials(),
      await createCallCredential(),
      createCallCredential,
    );
  }
}
