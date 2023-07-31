import { CallOptions, Metadata } from '@grpc/grpc-js';
import { ServiceError, SurfaceCall } from '@grpc/grpc-js/build/src/call';
import { Status } from '@grpc/grpc-js/build/src/constants';
import {
  CreateApplicationAgentResponse,
  CreateApplicationResponse,
  DeleteApplicationAgentCredentialResponse,
  ReadApplicationAgentCredentialResponse,
  RegisterApplicationAgentCredentialResponse,
} from '../../../grpc/indykite/config/v1beta1/config_management_api';
import { ConfigClientV2 } from '../../config_v2';
import { Utils } from '../../utils/utils';
import { ApplicationAgentCredential } from '../../model/config/application_agent_credential';
import { serviceAccountTokenMock } from '../../utils/test_utils';

afterEach(() => {
  jest.clearAllMocks();
});

describe('registerApplicationAgentCredential', () => {
  describe('when no error is returned', () => {
    let registerApplicationAgentCredentialResponse: RegisterApplicationAgentCredentialResponse;
    let registerApplicationAgentCredentialSpy: jest.SpyInstance;
    let sdk: ConfigClientV2;

    beforeEach(async () => {
      sdk = await ConfigClientV2.createInstance(JSON.stringify(serviceAccountTokenMock));
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
                displayName: 'Application Agent Credential',
                kid: 'kid-id',
                agentConfig: new Uint8Array(
                  Buffer.from(
                    '{"baseUrl":"https://jarvis-dev.indykite.com","applicationId":"00112233-a551-4b82-8648-939def7e3607" /* SKIPPED REST VALUES */}',
                    'utf-8',
                  ),
                ),
                createTime: Utils.dateToTimestamp(new Date(Date.UTC(2022, 5, 20, 11, 27))),
                expireTime: req.expireTime,
                bookmark: 'bookmark-token',
              });
            }
            return {} as SurfaceCall;
          },
        );
    });

    describe('when necessary values are sent only', () => {
      beforeEach(async () => {
        registerApplicationAgentCredentialResponse = await sdk.registerApplicationAgentCredential(
          ConfigClientV2.newRegisterApplicationAgentCredentialRequest(
            'app-agent-id',
            'Agent Credentials',
            'default-tenant-id',
          ),
        );
      });

      it('sends correct request', () => {
        expect(registerApplicationAgentCredentialSpy).toBeCalledWith(
          {
            applicationAgentId: 'app-agent-id',
            displayName: 'Agent Credentials',
            defaultTenantId: 'default-tenant-id',
            publicKey: { oneofKind: undefined },
            bookmarks: [],
          },
          expect.any(Function),
        );
      });

      it('returns a correct instance', () => {
        expect(registerApplicationAgentCredentialResponse.id).toBe('new-app-agent-credentials-id');
        expect(registerApplicationAgentCredentialResponse.applicationAgentId).toBe('app-agent-id');
        expect(registerApplicationAgentCredentialResponse.kid).toBe('kid-id');
        expect(
          new TextDecoder().decode(registerApplicationAgentCredentialResponse.agentConfig),
        ).toBe(
          '{"baseUrl":"https://jarvis-dev.indykite.com","applicationId":"00112233-a551-4b82-8648-939def7e3607" /* SKIPPED REST VALUES */}',
        );
        expect(registerApplicationAgentCredentialResponse.createTime?.toString()).toBe(
          Utils.dateToTimestamp(new Date(Date.UTC(2022, 5, 20, 11, 27))).toString(),
        );
        expect(registerApplicationAgentCredentialResponse.expireTime).toBeUndefined();
        expect(registerApplicationAgentCredentialResponse.displayName).toBe(
          'Application Agent Credential',
        );
        expect(registerApplicationAgentCredentialResponse.bookmark).toBe('bookmark-token');
      });
    });

    describe('when all possible values are sent (JWK variant)', () => {
      const publicKey = Buffer.from('mocked-jwk-key');
      const expireTime = new Date(Date.UTC(2022, 11, 31, 23, 59, 59));

      beforeEach(async () => {
        registerApplicationAgentCredentialResponse = await sdk.registerApplicationAgentCredential(
          ConfigClientV2.newRegisterApplicationAgentCredentialRequest(
            'app-agent-id',
            'Agent Credentials',
            'default-tenant-id',
            'jwk',
            publicKey,
            expireTime,
          ),
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
            bookmarks: [],
          },
          expect.any(Function),
        );
      });

      it('returns a correct instance', () => {
        expect(registerApplicationAgentCredentialResponse.id).toBe('new-app-agent-credentials-id');
        expect(registerApplicationAgentCredentialResponse.applicationAgentId).toBe('app-agent-id');
        expect(registerApplicationAgentCredentialResponse.kid).toBe('kid-id');
        expect(
          new TextDecoder().decode(registerApplicationAgentCredentialResponse.agentConfig),
        ).toBe(
          '{"baseUrl":"https://jarvis-dev.indykite.com","applicationId":"00112233-a551-4b82-8648-939def7e3607" /* SKIPPED REST VALUES */}',
        );
        expect(registerApplicationAgentCredentialResponse.createTime?.toString()).toBe(
          Utils.dateToTimestamp(new Date(Date.UTC(2022, 5, 20, 11, 27))).toString(),
        );
        expect(registerApplicationAgentCredentialResponse.expireTime?.toString()).toBe(
          Utils.dateToTimestamp(new Date(Date.UTC(2022, 11, 31, 23, 59, 59))).toString(),
        );
        expect(registerApplicationAgentCredentialResponse.displayName).toBe(
          'Application Agent Credential',
        );
        expect(registerApplicationAgentCredentialResponse.bookmark).toBe('bookmark-token');
      });
    });

    describe('when all possible values are sent (PEM variant)', () => {
      const publicKey = Buffer.from('mocked-pem-key');
      const expireTime = new Date(Date.UTC(2022, 11, 31, 23, 59, 59));

      beforeEach(async () => {
        registerApplicationAgentCredentialResponse = await sdk.registerApplicationAgentCredential(
          ConfigClientV2.newRegisterApplicationAgentCredentialRequest(
            'app-agent-id',
            'Agent Credentials',
            'default-tenant-id',
            'pem',
            publicKey,
            expireTime,
          ),
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
            bookmarks: [],
          },
          expect.any(Function),
        );
      });

      it('returns a correct instance', () => {
        expect(registerApplicationAgentCredentialResponse.id).toBe('new-app-agent-credentials-id');
        expect(registerApplicationAgentCredentialResponse.applicationAgentId).toBe('app-agent-id');
        expect(registerApplicationAgentCredentialResponse.kid).toBe('kid-id');
        expect(
          new TextDecoder().decode(registerApplicationAgentCredentialResponse.agentConfig),
        ).toBe(
          '{"baseUrl":"https://jarvis-dev.indykite.com","applicationId":"00112233-a551-4b82-8648-939def7e3607" /* SKIPPED REST VALUES */}',
        );
        expect(registerApplicationAgentCredentialResponse.createTime?.toString()).toBe(
          Utils.dateToTimestamp(new Date(Date.UTC(2022, 5, 20, 11, 27))).toString(),
        );
        expect(registerApplicationAgentCredentialResponse.expireTime?.toString()).toBe(
          Utils.dateToTimestamp(new Date(Date.UTC(2022, 11, 31, 23, 59, 59))).toString(),
        );
        expect(registerApplicationAgentCredentialResponse.displayName).toBe(
          'Application Agent Credential',
        );
        expect(registerApplicationAgentCredentialResponse.bookmark).toBe('bookmark-token');
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
      const sdk = await ConfigClientV2.createInstance(JSON.stringify(serviceAccountTokenMock));
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
        .registerApplicationAgentCredential(
          ConfigClientV2.newRegisterApplicationAgentCredentialRequest(
            'app-agent-id',
            'Agent Credentials',
            'default-tenant-id',
          ),
        )
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
      const sdk = await ConfigClientV2.createInstance(JSON.stringify(serviceAccountTokenMock));
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
        .registerApplicationAgentCredential(
          ConfigClientV2.newRegisterApplicationAgentCredentialRequest(
            'app-agent-id',
            'Agent Credentials',
            'default-tenant-id',
          ),
        )
        .catch((err) => {
          thrownError = err;
        });
    });

    it('throws an error', () => {
      expect(thrownError.message).toBe('No ApplicationAgentCredential response.');
    });
  });
});

describe('readApplicationAgentCredential', () => {
  describe('when no error is returned', () => {
    let credential: ApplicationAgentCredential;
    let readApplicationAgentCredentialSpy: jest.SpyInstance;

    beforeEach(async () => {
      const sdk = await ConfigClientV2.createInstance(JSON.stringify(serviceAccountTokenMock));
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
                  createdBy: 'Lorem ipsum - creator',
                  createTime: Utils.dateToTimestamp(new Date(Date.UTC(2022, 2, 15, 13, 13))),
                  deleteTime: Utils.dateToTimestamp(new Date(Date.UTC(2022, 2, 15, 13, 14))),
                  destroyTime: Utils.dateToTimestamp(new Date(Date.UTC(2022, 2, 15, 13, 15))),
                },
              });
            }
            return {} as SurfaceCall;
          },
        );
      credential = ApplicationAgentCredential.deserialize(
        await sdk.readApplicationAgentCredential(
          ConfigClientV2.newReadApplicationAgentCredentialRequest('app-agent-credential-id'),
        ),
      );
    });

    it('sends correct request', () => {
      expect(readApplicationAgentCredentialSpy).toBeCalledWith(
        {
          id: 'app-agent-credential-id',
          bookmarks: [],
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
      expect(credential.createTime?.toString()).toBe(
        new Date(Date.UTC(2022, 2, 15, 13, 13)).toString(),
      );
      expect(credential.deleteTime?.toString()).toBe(
        new Date(Date.UTC(2022, 2, 15, 13, 14)).toString(),
      );
      expect(credential.destroyTime?.toString()).toBe(
        new Date(Date.UTC(2022, 2, 15, 13, 15)).toString(),
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
      const sdk = await ConfigClientV2.createInstance(JSON.stringify(serviceAccountTokenMock));
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
      sdk
        .readApplicationAgentCredential(
          ConfigClientV2.newReadApplicationAgentCredentialRequest('app-agent-credential-id'),
        )
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
      const sdk = await ConfigClientV2.createInstance(JSON.stringify(serviceAccountTokenMock));
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
      sdk
        .readApplicationAgentCredential(
          ConfigClientV2.newReadApplicationAgentCredentialRequest('app-agent-credential-id'),
        )
        .catch((err) => {
          thrownError = err;
        });
    });

    it('throws an error', () => {
      expect(thrownError.message).toBe('No ApplicationAgentCredential response.');
    });
  });
});

describe('deleteApplicationAgentCredential', () => {
  describe('when no error is returned', () => {
    let deleteApplicationAgentCredentialSpy: jest.SpyInstance;
    let sdk: ConfigClientV2;

    beforeEach(async () => {
      sdk = await ConfigClientV2.createInstance(JSON.stringify(serviceAccountTokenMock));
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
                bookmark: 'bookmark-token',
              });
            }
            return {} as SurfaceCall;
          },
        );
      return sdk.deleteApplicationAgentCredential(
        ConfigClientV2.newDeleteApplicationAgentCredentialRequest('app-agent-credential-id'),
      );
    });

    it('sends correct request', () => {
      expect(deleteApplicationAgentCredentialSpy).toBeCalledWith(
        {
          id: 'app-agent-credential-id',
          bookmarks: [],
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
      const sdk = await ConfigClientV2.createInstance(JSON.stringify(serviceAccountTokenMock));
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
      sdk
        .deleteApplicationAgentCredential(
          ConfigClientV2.newDeleteApplicationAgentCredentialRequest('app-agent-credential-id'),
        )
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
      const sdk = await ConfigClientV2.createInstance(JSON.stringify(serviceAccountTokenMock));
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
      sdk
        .deleteApplicationAgentCredential(
          ConfigClientV2.newDeleteApplicationAgentCredentialRequest('app-agent-credential-id'),
        )
        .catch((err) => {
          thrownError = err;
        });
    });

    it('throws an error', () => {
      expect(thrownError.message).toBe('No ApplicationAgentCredential response.');
    });
  });
});

describe('createApplicationWithAgentCredentials', () => {
  let sdk: ConfigClientV2;
  let createApplicationMock: jest.SpyInstance;
  let createApplicationAgentMock: jest.SpyInstance;
  let registerApplicationCredentialMock: jest.SpyInstance;
  let returnedValue: Awaited<ReturnType<typeof sdk.createApplicationWithAgentCredentials>>;

  describe('when all of the instances are created', () => {
    beforeEach(async () => {
      sdk = await ConfigClientV2.createInstance(JSON.stringify(serviceAccountTokenMock));
      createApplicationMock = jest.spyOn(sdk, 'createApplication').mockImplementation(async () => {
        return {
          id: 'app-id',
          createTime: Utils.dateToTimestamp(new Date(Date.UTC(2022, 5, 20, 11, 27))),
          createdBy: 'Lorem ipsum - creator',
          updateTime: Utils.dateToTimestamp(new Date(Date.UTC(2022, 5, 20, 11, 27))),
          updatedBy: 'Lorem ipsum - updater',
          etag: '111',
          bookmark: 'bookmark-token',
        } as CreateApplicationResponse;
      });
      createApplicationAgentMock = jest
        .spyOn(sdk, 'createApplicationAgent')
        .mockImplementation(async () => {
          return {
            id: 'app-agent-id',
            createTime: Utils.dateToTimestamp(new Date(Date.UTC(2022, 5, 20, 11, 27))),
            createdBy: 'Lorem ipsum - creator',
            updateTime: Utils.dateToTimestamp(new Date(Date.UTC(2022, 5, 20, 11, 27))),
            updatedBy: 'Lorem ipsum - updater',
            etag: '111',
            bookmark: 'bookmark-token',
          } as CreateApplicationAgentResponse;
        });
      registerApplicationCredentialMock = jest
        .spyOn(sdk, 'registerApplicationAgentCredential')
        .mockImplementation(async () => {
          return {
            id: 'RegisterApplicationAgentCredentialResponse-1',
            applicationAgentId: 'app-agent-id',
            kid: 'kid-id',
            agentConfig: new Uint8Array(
              Buffer.from(
                '{"baseUrl":"https://jarvis-dev.indykite.com","applicationId":"00112233-a551-4b82-8648-939def7e3607" /* SKIPPED REST VALUES */}',
                'utf-8',
              ),
            ),
            createTime: Utils.dateToTimestamp(new Date(Date.UTC(2022, 5, 20, 11, 27))),
            expireTime: undefined,
            displayName: 'Agent Credentials',
            bookmark: 'bookmark-token',
          } as RegisterApplicationAgentCredentialResponse;
        });

      returnedValue = await sdk.createApplicationWithAgentCredentials(
        'app-space-id',
        'app-name',
        'app-agent-name',
        'app-agent-credential-name',
        undefined,
        undefined,
        'default-tenant-id',
      );
    });

    afterEach(() => {
      createApplicationMock.mockRestore();
      createApplicationAgentMock.mockRestore();
      registerApplicationCredentialMock.mockRestore();
    });

    it('returns correct values', async () => {
      expect(returnedValue).toHaveProperty('application');
      expect(returnedValue).toHaveProperty('application.id', 'app-id');
      expect(returnedValue).toHaveProperty('applicationAgent');
      expect(returnedValue).toHaveProperty('applicationAgent.id', 'app-agent-id');
      expect(returnedValue).toHaveProperty('applicationAgentCredentials');
      expect(returnedValue).toHaveProperty(
        'applicationAgentCredentials.id',
        'RegisterApplicationAgentCredentialResponse-1',
      );
      expect(returnedValue).not.toHaveProperty('error');
    });

    it('calls correct functions', async () => {
      expect(createApplicationMock).toBeCalledWith(
        ConfigClientV2.newCreateApplicationRequest('app-space-id', 'app-name'),
      );
      expect(createApplicationAgentMock).toBeCalledWith(
        ConfigClientV2.newCreateApplicationAgentRequest('app-id', 'app-agent-name'),
      );
      expect(registerApplicationCredentialMock).toBeCalledWith(
        ConfigClientV2.newRegisterApplicationAgentCredentialRequest(
          'app-agent-id',
          'app-agent-credential-name',
          'default-tenant-id',
          undefined,
          undefined,
          undefined,
        ),
      );
    });
  });

  describe('when credentials can not be created', () => {
    const error = new Error('Credentials mocked error');

    beforeEach(async () => {
      sdk = await ConfigClientV2.createInstance(JSON.stringify(serviceAccountTokenMock));
      createApplicationMock = jest.spyOn(sdk, 'createApplication').mockImplementation(async () => {
        return {
          id: 'app-id',
          createTime: Utils.dateToTimestamp(new Date(Date.UTC(2022, 5, 20, 11, 27))),
          createdBy: 'Lorem ipsum - creator',
          updateTime: Utils.dateToTimestamp(new Date(Date.UTC(2022, 5, 20, 11, 27))),
          updatedBy: 'Lorem ipsum - updater',
          etag: '111',
          bookmark: 'bookmark-token',
        } as CreateApplicationResponse;
      });
      createApplicationAgentMock = jest
        .spyOn(sdk, 'createApplicationAgent')
        .mockImplementation(async () => {
          return {
            id: 'app-agent-id',
            createTime: Utils.dateToTimestamp(new Date(Date.UTC(2022, 5, 20, 11, 27))),
            createdBy: 'Lorem ipsum - creator',
            updateTime: Utils.dateToTimestamp(new Date(Date.UTC(2022, 5, 20, 11, 27))),
            updatedBy: 'Lorem ipsum - updater',
            etag: '111',
            bookmark: 'bookmark-token',
          } as CreateApplicationAgentResponse;
        });
      registerApplicationCredentialMock = jest
        .spyOn(sdk, 'registerApplicationAgentCredential')
        .mockImplementation(async () => {
          throw error;
        });

      returnedValue = await sdk.createApplicationWithAgentCredentials(
        'app-space-id',
        'app-name',
        'app-agent-name',
        'app-agent-credential-name',
        undefined,
        undefined,
        'default-tenant-id',
      );
    });

    afterEach(() => {
      createApplicationMock.mockRestore();
      createApplicationAgentMock.mockRestore();
      registerApplicationCredentialMock.mockRestore();
    });

    it('returns correct values', async () => {
      expect(returnedValue).toHaveProperty('application');
      expect(returnedValue).toHaveProperty('application.id', 'app-id');
      expect(returnedValue).toHaveProperty('applicationAgent');
      expect(returnedValue).toHaveProperty('applicationAgent.id', 'app-agent-id');
      expect(returnedValue).not.toHaveProperty('applicationAgentCredentials');
      expect(returnedValue).toHaveProperty('error');
      expect(returnedValue).toHaveProperty('error', error);
    });

    it('calls correct functions', async () => {
      expect(createApplicationMock).toBeCalledWith(
        ConfigClientV2.newCreateApplicationRequest('app-space-id', 'app-name'),
      );
      expect(createApplicationAgentMock).toBeCalledWith(
        ConfigClientV2.newCreateApplicationAgentRequest('app-id', 'app-agent-name'),
      );
      expect(registerApplicationCredentialMock).toBeCalledWith(
        ConfigClientV2.newRegisterApplicationAgentCredentialRequest(
          'app-agent-id',
          'app-agent-credential-name',
          'default-tenant-id',
          undefined,
          undefined,
          undefined,
        ),
      );
    });
  });

  describe('when application agent can not be created', () => {
    const error = new Error('App agent mocked error');

    beforeEach(async () => {
      sdk = await ConfigClientV2.createInstance(JSON.stringify(serviceAccountTokenMock));
      createApplicationMock = jest.spyOn(sdk, 'createApplication').mockImplementation(async () => {
        return {
          id: 'app-id',
          createTime: Utils.dateToTimestamp(new Date(Date.UTC(2022, 5, 20, 11, 27))),
          createdBy: 'Lorem ipsum - creator',
          updateTime: Utils.dateToTimestamp(new Date(Date.UTC(2022, 5, 20, 11, 27))),
          updatedBy: 'Lorem ipsum - updater',
          etag: '111',
          bookmark: 'bookmark-token',
        } as CreateApplicationResponse;
      });
      createApplicationAgentMock = jest
        .spyOn(sdk, 'createApplicationAgent')
        .mockImplementation(async () => {
          throw error;
        });
      registerApplicationCredentialMock = jest
        .spyOn(sdk, 'registerApplicationAgentCredential')
        .mockImplementation(async () => {
          throw new Error('This should not be called');
        });

      returnedValue = await sdk.createApplicationWithAgentCredentials(
        'app-space-id',
        'app-name',
        'app-agent-name',
        'app-agent-credential-name',
        undefined,
        undefined,
        'default-tenant-id',
      );
    });

    afterEach(() => {
      createApplicationMock.mockRestore();
      createApplicationAgentMock.mockRestore();
      registerApplicationCredentialMock.mockRestore();
    });

    it('returns correct values', async () => {
      expect(returnedValue).toHaveProperty('application');
      expect(returnedValue).toHaveProperty('application.id', 'app-id');
      expect(returnedValue).not.toHaveProperty('applicationAgent');
      expect(returnedValue).not.toHaveProperty('applicationAgentCredentials');
      expect(returnedValue).toHaveProperty('error');
      expect(returnedValue).toHaveProperty('error', error);
    });

    it('calls correct functions', async () => {
      expect(createApplicationMock).toBeCalledWith(
        ConfigClientV2.newCreateApplicationRequest('app-space-id', 'app-name'),
      );
      expect(createApplicationAgentMock).toBeCalledWith(
        ConfigClientV2.newCreateApplicationAgentRequest('app-id', 'app-agent-name'),
      );
      expect(registerApplicationCredentialMock).toBeCalledTimes(0);
    });
  });

  describe('when application can not be created', () => {
    const error = new Error('App agent mocked error');

    beforeEach(async () => {
      sdk = await ConfigClientV2.createInstance(JSON.stringify(serviceAccountTokenMock));
      createApplicationMock = jest.spyOn(sdk, 'createApplication').mockImplementation(async () => {
        throw error;
      });
      createApplicationAgentMock = jest
        .spyOn(sdk, 'createApplicationAgent')
        .mockImplementation(async () => {
          throw new Error('This should not be called');
        });
      registerApplicationCredentialMock = jest
        .spyOn(sdk, 'registerApplicationAgentCredential')
        .mockImplementation(async () => {
          throw new Error('This should not be called');
        });

      returnedValue = await sdk.createApplicationWithAgentCredentials(
        'app-space-id',
        'app-name',
        'app-agent-name',
        'app-agent-credential-name',
        undefined,
        undefined,
        'default-tenant-id',
      );
    });

    afterEach(() => {
      createApplicationMock.mockRestore();
      createApplicationAgentMock.mockRestore();
      registerApplicationCredentialMock.mockRestore();
    });

    it('returns correct values', async () => {
      expect(returnedValue).not.toHaveProperty('application');
      expect(returnedValue).not.toHaveProperty('applicationAgent');
      expect(returnedValue).not.toHaveProperty('applicationAgentCredentials');
      expect(returnedValue).toHaveProperty('error');
      expect(returnedValue).toHaveProperty('error', error);
    });

    it('calls correct functions', async () => {
      expect(createApplicationMock).toBeCalledWith(
        ConfigClientV2.newCreateApplicationRequest('app-space-id', 'app-name'),
      );
      expect(createApplicationAgentMock).toBeCalledTimes(0);
      expect(registerApplicationCredentialMock).toBeCalledTimes(0);
    });
  });
});
