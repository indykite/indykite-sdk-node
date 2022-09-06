import { CallOptions, Metadata } from '@grpc/grpc-js';
import { ServiceError, SurfaceCall } from '@grpc/grpc-js/build/src/call';
import { Status } from '@grpc/grpc-js/build/src/constants';
import {
  DeleteApplicationAgentCredentialResponse,
  ReadApplicationAgentCredentialResponse,
  RegisterApplicationAgentCredentialResponse,
} from '../../../grpc/indykite/config/v1beta1/config_management_api';
import { ConfigClient } from '../../config';
import { Utils } from '../../utils/utils';
import { ApplicationAgentCredential } from '../../model/config/application_agent_credential';
import { serviceAccountTokenMock } from '../../utils/test_utils';

afterEach(() => {
  jest.clearAllMocks();
});

describe('registerApplicationCredential', () => {
  describe('when no error is returned', () => {
    let applicationAgentCredential: ApplicationAgentCredential;
    let registerApplicationAgentCredentialSpy: jest.SpyInstance;
    let sdk: ConfigClient;

    beforeEach(async () => {
      sdk = await ConfigClient.createInstance(JSON.stringify(serviceAccountTokenMock));
      registerApplicationAgentCredentialSpy = jest
        .spyOn(sdk['client'], 'registerApplicationAgentCredential')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((
                  err: ServiceError | null,
                  response: RegisterApplicationAgentCredentialResponse,
                ) => void),
          ) => {
            if (typeof res === 'function') {
              res(null, {
                id: 'new-app-agent-credentials-id',
                applicationAgentId: 'app-agent-id',
                kid: 'kid-id',
                agentConfig: new Uint8Array(
                  Buffer.from(
                    '{"baseUrl":"https://jarvis-dev.indykite.com","applicationId":"00112233-a551-4b82-8648-939def7e3607" /* SKIPPED REST VALUES */}',
                    'utf-8',
                  ),
                ),
                createTime: Utils.dateToTimestamp(new Date(2022, 5, 20, 11, 27)),
                expireTime: req.expireTime,
              });
            }
            return {} as SurfaceCall;
          },
        );
    });

    describe('when necessary values are sent only', () => {
      beforeEach(async () => {
        applicationAgentCredential = await sdk.registerApplicationCredential(
          'app-agent-id',
          'Agent Credentials',
          'default-tenant-id',
        );
      });

      it('sends correct request', () => {
        expect(registerApplicationAgentCredentialSpy).toBeCalledWith(
          {
            applicationAgentId: 'app-agent-id',
            displayName: 'Agent Credentials',
            defaultTenantId: 'default-tenant-id',
            publicKey: { oneofKind: undefined },
          },
          expect.any(Function),
        );
      });

      it('returns a correct instance', () => {
        expect(applicationAgentCredential.id).toBe('new-app-agent-credentials-id');
        expect(applicationAgentCredential.kid).toBe('kid-id');
        expect(applicationAgentCredential.applicationAgentId).toBe('app-agent-id');
        expect(applicationAgentCredential.agentConfig).toBe(
          '{"baseUrl":"https://jarvis-dev.indykite.com","applicationId":"00112233-a551-4b82-8648-939def7e3607" /* SKIPPED REST VALUES */}',
        );
        expect(applicationAgentCredential.appSpaceId).toBeUndefined();
        expect(applicationAgentCredential.applicationId).toBeUndefined();
        expect(applicationAgentCredential.createTime?.toString()).toBe(
          new Date(2022, 5, 20, 11, 27).toString(),
        );
        expect(applicationAgentCredential.customerId).toBeUndefined();
        expect(applicationAgentCredential.deleteTime).toBeUndefined();
        expect(applicationAgentCredential.destroyTime).toBeUndefined();
        expect(applicationAgentCredential.displayName).toBe('Agent Credentials');
        expect(applicationAgentCredential.expireTime).toBeUndefined();
      });
    });

    describe('when all possible values are sent (JWK variant)', () => {
      const publicKey = Buffer.from('mocked-jwk-key');
      const expireTime = new Date(2022, 11, 31, 23, 59, 59);

      beforeEach(async () => {
        applicationAgentCredential = await sdk.registerApplicationCredential(
          'app-agent-id',
          'Agent Credentials',
          'default-tenant-id',
          'jwk',
          publicKey,
          expireTime,
        );
      });

      it('sends correct request', () => {
        expect(registerApplicationAgentCredentialSpy).toBeCalledWith(
          {
            applicationAgentId: 'app-agent-id',
            displayName: 'Agent Credentials',
            defaultTenantId: 'default-tenant-id',
            publicKey: { oneofKind: 'jwk', jwk: publicKey },
            expireTime: Utils.dateToTimestamp(expireTime),
          },
          expect.any(Function),
        );
      });

      it('returns a correct instance', () => {
        expect(applicationAgentCredential.id).toBe('new-app-agent-credentials-id');
        expect(applicationAgentCredential.kid).toBe('kid-id');
        expect(applicationAgentCredential.applicationAgentId).toBe('app-agent-id');
        expect(applicationAgentCredential.agentConfig).toBe(
          '{"baseUrl":"https://jarvis-dev.indykite.com","applicationId":"00112233-a551-4b82-8648-939def7e3607" /* SKIPPED REST VALUES */}',
        );
        expect(applicationAgentCredential.appSpaceId).toBeUndefined();
        expect(applicationAgentCredential.applicationId).toBeUndefined();
        expect(applicationAgentCredential.createTime?.toString()).toBe(
          new Date(2022, 5, 20, 11, 27).toString(),
        );
        expect(applicationAgentCredential.customerId).toBeUndefined();
        expect(applicationAgentCredential.deleteTime).toBeUndefined();
        expect(applicationAgentCredential.destroyTime).toBeUndefined();
        expect(applicationAgentCredential.displayName).toBe('Agent Credentials');
        expect(applicationAgentCredential.expireTime?.toString()).toBe(
          new Date(2022, 11, 31, 23, 59, 59).toString(),
        );
      });
    });

    describe('when all possible values are sent (PEM variant)', () => {
      const publicKey = Buffer.from('mocked-pem-key');
      const expireTime = new Date(2022, 11, 31, 23, 59, 59);

      beforeEach(async () => {
        applicationAgentCredential = await sdk.registerApplicationCredential(
          'app-agent-id',
          'Agent Credentials',
          'default-tenant-id',
          'pem',
          publicKey,
          expireTime,
        );
      });

      it('sends correct request', () => {
        expect(registerApplicationAgentCredentialSpy).toBeCalledWith(
          {
            applicationAgentId: 'app-agent-id',
            displayName: 'Agent Credentials',
            defaultTenantId: 'default-tenant-id',
            publicKey: { oneofKind: 'pem', pem: publicKey },
            expireTime: Utils.dateToTimestamp(expireTime),
          },
          expect.any(Function),
        );
      });

      it('returns a correct instance', () => {
        expect(applicationAgentCredential.id).toBe('new-app-agent-credentials-id');
        expect(applicationAgentCredential.kid).toBe('kid-id');
        expect(applicationAgentCredential.applicationAgentId).toBe('app-agent-id');
        expect(applicationAgentCredential.agentConfig).toBe(
          '{"baseUrl":"https://jarvis-dev.indykite.com","applicationId":"00112233-a551-4b82-8648-939def7e3607" /* SKIPPED REST VALUES */}',
        );
        expect(applicationAgentCredential.appSpaceId).toBeUndefined();
        expect(applicationAgentCredential.applicationId).toBeUndefined();
        expect(applicationAgentCredential.createTime?.toString()).toBe(
          new Date(2022, 5, 20, 11, 27).toString(),
        );
        expect(applicationAgentCredential.customerId).toBeUndefined();
        expect(applicationAgentCredential.deleteTime).toBeUndefined();
        expect(applicationAgentCredential.destroyTime).toBeUndefined();
        expect(applicationAgentCredential.displayName).toBe('Agent Credentials');
        expect(applicationAgentCredential.expireTime?.toString()).toBe(
          new Date(2022, 11, 31, 23, 59, 59).toString(),
        );
      });
    });
  });

  describe('when an error is returned', () => {
    const error = {
      code: Status.NOT_FOUND,
      details: 'DETAILS',
      metadata: {},
    } as ServiceError;
    let thrownError: Error;

    beforeEach(async () => {
      const sdk = await ConfigClient.createInstance(JSON.stringify(serviceAccountTokenMock));
      jest
        .spyOn(sdk['client'], 'registerApplicationAgentCredential')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((
                  err: ServiceError | null,
                  response?: RegisterApplicationAgentCredentialResponse,
                ) => void),
          ) => {
            if (typeof res === 'function') {
              res(error);
            }
            return {} as SurfaceCall;
          },
        );
      sdk
        .registerApplicationCredential('app-agent-id', 'Agent Credentials', 'default-tenant-id')
        .catch((err) => {
          thrownError = err;
        });
    });

    it('throws an error', () => {
      expect(thrownError).toBe(error);
    });
  });

  describe('when no response is returned', () => {
    let thrownError: Error;

    beforeEach(async () => {
      const sdk = await ConfigClient.createInstance(JSON.stringify(serviceAccountTokenMock));
      jest
        .spyOn(sdk['client'], 'registerApplicationAgentCredential')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((
                  err: ServiceError | null,
                  response?: RegisterApplicationAgentCredentialResponse,
                ) => void),
          ) => {
            if (typeof res === 'function') {
              res(null);
            }
            return {} as SurfaceCall;
          },
        );
      sdk
        .registerApplicationCredential('app-agent-id', 'Agent Credentials', 'default-tenant-id')
        .catch((err) => {
          thrownError = err;
        });
    });

    it('throws an error', () => {
      expect(thrownError.message).toBe('No application agent credential response');
    });
  });
});

describe('readApplicationAgentCredential', () => {
  describe('when no error is returned', () => {
    let credential: ApplicationAgentCredential;
    let readApplicationAgentCredentialSpy: jest.SpyInstance;

    beforeEach(async () => {
      const sdk = await ConfigClient.createInstance(JSON.stringify(serviceAccountTokenMock));
      readApplicationAgentCredentialSpy = jest
        .spyOn(sdk['client'], 'readApplicationAgentCredential')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((
                  err: ServiceError | null,
                  response: ReadApplicationAgentCredentialResponse,
                ) => void),
          ) => {
            if (typeof res === 'function') {
              res(null, {
                applicationAgentCredential: {
                  id: 'app-agent-credential-id',
                  kid: 'kid-id',
                  appSpaceId: 'app-space-id',
                  applicationId: 'application-id',
                  applicationAgentId: 'app-agent-id',
                  customerId: 'customer-id',
                  displayName: 'Application Agent Credential',
                  createTime: Utils.dateToTimestamp(new Date(2022, 2, 15, 13, 13)),
                  deleteTime: Utils.dateToTimestamp(new Date(2022, 2, 15, 13, 14)),
                  destroyTime: Utils.dateToTimestamp(new Date(2022, 2, 15, 13, 15)),
                },
              });
            }
            return {} as SurfaceCall;
          },
        );
      credential = await sdk.readApplicationAgentCredential('app-agent-credential-id');
    });

    it('sends correct request', () => {
      expect(readApplicationAgentCredentialSpy).toBeCalledWith(
        {
          id: 'app-agent-credential-id',
        },
        expect.any(Function),
      );
    });

    it('returns a correct instance', () => {
      expect(credential.id).toBe('app-agent-credential-id');
      expect(credential.kid).toBe('kid-id');
      expect(credential.appSpaceId).toBe('app-space-id');
      expect(credential.applicationId).toBe('application-id');
      expect(credential.applicationAgentId).toBe('app-agent-id');
      expect(credential.customerId).toBe('customer-id');
      expect(credential.displayName).toBe('Application Agent Credential');
      expect(credential.createTime?.toString()).toBe(new Date(2022, 2, 15, 13, 13).toString());
      expect(credential.deleteTime?.toString()).toBe(new Date(2022, 2, 15, 13, 14).toString());
      expect(credential.destroyTime?.toString()).toBe(new Date(2022, 2, 15, 13, 15).toString());
    });
  });

  describe('when an error is returned', () => {
    const error = {
      code: Status.NOT_FOUND,
      details: 'DETAILS',
      metadata: {},
    } as ServiceError;
    let thrownError: Error;

    beforeEach(async () => {
      const sdk = await ConfigClient.createInstance(JSON.stringify(serviceAccountTokenMock));
      jest
        .spyOn(sdk['client'], 'readApplicationAgentCredential')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((
                  err: ServiceError | null,
                  response?: ReadApplicationAgentCredentialResponse,
                ) => void),
          ) => {
            if (typeof res === 'function') {
              res(error);
            }
            return {} as SurfaceCall;
          },
        );
      sdk.readApplicationAgentCredential('app-agent-credential-id').catch((err) => {
        thrownError = err;
      });
    });

    it('throws an error', () => {
      expect(thrownError).toBe(error);
    });
  });

  describe('when no response is returned', () => {
    let thrownError: Error;

    beforeEach(async () => {
      const sdk = await ConfigClient.createInstance(JSON.stringify(serviceAccountTokenMock));
      jest
        .spyOn(sdk['client'], 'readApplicationAgentCredential')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((
                  err: ServiceError | null,
                  response?: ReadApplicationAgentCredentialResponse,
                ) => void),
          ) => {
            if (typeof res === 'function') {
              res(null);
            }
            return {} as SurfaceCall;
          },
        );
      sdk.readApplicationAgentCredential('app-agent-credential-id').catch((err) => {
        thrownError = err;
      });
    });

    it('throws an error', () => {
      expect(thrownError.message).toBe('No application agent credential response');
    });
  });
});

describe('deleteApplicationAgentCredential', () => {
  describe('when no error is returned', () => {
    let deleteApplicationAgentCredentialSpy: jest.SpyInstance;
    let sdk: ConfigClient;

    beforeEach(async () => {
      sdk = await ConfigClient.createInstance(JSON.stringify(serviceAccountTokenMock));
      deleteApplicationAgentCredentialSpy = jest
        .spyOn(sdk['client'], 'deleteApplicationAgentCredential')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((
                  err: ServiceError | null,
                  response: DeleteApplicationAgentCredentialResponse,
                ) => void),
          ) => {
            if (typeof res === 'function') {
              res(null, {
                id: 'app-agent-id',
                etag: 'etag-id',
              });
            }
            return {} as SurfaceCall;
          },
        );
      return sdk.deleteApplicationAgentCredential('app-agent-credential-id');
    });

    it('sends correct request', () => {
      expect(deleteApplicationAgentCredentialSpy).toBeCalledWith(
        {
          id: 'app-agent-credential-id',
        },
        expect.any(Function),
      );
    });
  });

  describe('when an error is returned', () => {
    const error = {
      code: Status.NOT_FOUND,
      details: 'DETAILS',
      metadata: {},
    } as ServiceError;
    let thrownError: Error;

    beforeEach(async () => {
      const sdk = await ConfigClient.createInstance(JSON.stringify(serviceAccountTokenMock));
      jest
        .spyOn(sdk['client'], 'deleteApplicationAgentCredential')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((
                  err: ServiceError | null,
                  response?: DeleteApplicationAgentCredentialResponse,
                ) => void),
          ) => {
            if (typeof res === 'function') {
              res(error);
            }
            return {} as SurfaceCall;
          },
        );
      sdk.deleteApplicationAgentCredential('app-agent-credential-id').catch((err) => {
        thrownError = err;
      });
    });

    it('throws an error', () => {
      expect(thrownError).toBe(error);
    });
  });

  describe('when no response is returned', () => {
    let thrownError: Error;

    beforeEach(async () => {
      const sdk = await ConfigClient.createInstance(JSON.stringify(serviceAccountTokenMock));
      jest
        .spyOn(sdk['client'], 'deleteApplicationAgentCredential')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((
                  err: ServiceError | null,
                  response?: DeleteApplicationAgentCredentialResponse,
                ) => void),
          ) => {
            if (typeof res === 'function') {
              res(null);
            }
            return {} as SurfaceCall;
          },
        );
      sdk.deleteApplicationAgentCredential('app-agent-credential-id').catch((err) => {
        thrownError = err;
      });
    });

    it('throws an error', () => {
      expect(thrownError.message).toBe('No application agent credential response');
    });
  });
});
