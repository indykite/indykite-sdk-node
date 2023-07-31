import { CallOptions, Metadata } from '@grpc/grpc-js';
import { ServiceError, SurfaceCall } from '@grpc/grpc-js/build/src/call';
import { Status } from '@grpc/grpc-js/build/src/constants';
import {
  CreateConfigNodeResponse,
  DeleteConfigNodeResponse,
  ReadConfigNodeResponse,
  UpdateConfigNodeResponse,
} from '../../../grpc/indykite/config/v1beta1/config_management_api';
import { ConfigClient } from '../../config';
import { SdkError, SdkErrorCode } from '../../error';
import { Utils } from '../../utils/utils';
import { StringValue } from '../../../grpc/google/protobuf/wrappers';
import { serviceAccountTokenMock } from '../../utils/test_utils';
import {
  AuthenticatorAttachment,
  ConveyancePreference,
  UserVerificationRequirement,
  WebAuthnProvider,
} from '../../model';

let configExample: WebAuthnProvider;

beforeEach(() => {
  configExample = new WebAuthnProvider({
    name: 'webauthn-provider',
    attestationPreference: ConveyancePreference.DIRECT,
    authenticatorAttachment: AuthenticatorAttachment.CROSS_PLATFORM,
    relyingParties: {
      'http://localhost:3000': 'default',
    },
    requireResidentKey: true,
    userVerification: UserVerificationRequirement.REQUIRED,
    authenticationTimeout: 60,
    registrationTimeout: 120,
  });
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('createWebAuthnProviderConfiguration', () => {
  describe('when no error is returned', () => {
    let webauthnProvider: WebAuthnProvider;
    let createConfigNodeSpy: jest.SpyInstance;
    let sdk: ConfigClient;

    beforeEach(async () => {
      sdk = await ConfigClient.createInstance(JSON.stringify(serviceAccountTokenMock));
      createConfigNodeSpy = jest
        .spyOn(sdk['client'], 'createConfigNode')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response: CreateConfigNodeResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(null, {
                id: 'new-webauthn-provider-id',
                etag: 'etag-token',
                createdBy: 'Lorem ipsum - creator',
                updatedBy: 'Lorem ipsum - updater',
                createTime: Utils.dateToTimestamp(new Date(Date.UTC(2022, 6, 21, 13, 5))),
                updateTime: Utils.dateToTimestamp(new Date(Date.UTC(2022, 6, 21, 13, 6))),
                bookmark: 'bookmark-token',
                locationId: 'location-id-1',
              });
            }
            return {} as SurfaceCall;
          },
        );
    });

    describe('when necessary values are sent only', () => {
      beforeEach(async () => {
        webauthnProvider = await sdk.createWebAuthnProviderConfiguration(
          'location-id',
          configExample,
        );
      });

      it('sends correct request', () => {
        expect(createConfigNodeSpy).toBeCalledWith(
          {
            name: 'webauthn-provider',
            location: 'location-id',
            bookmarks: [],
            config: {
              oneofKind: 'webauthnProviderConfig',
              webauthnProviderConfig: {
                attestationPreference: ConveyancePreference.DIRECT,
                authenticationTimeout: {
                  nanos: 0,
                  seconds: '60',
                },
                authenticatorAttachment: AuthenticatorAttachment.CROSS_PLATFORM,
                registrationTimeout: {
                  nanos: 0,
                  seconds: '120',
                },
                relyingParties: {
                  'http://localhost:3000': 'default',
                },
                requireResidentKey: true,
                userVerification: UserVerificationRequirement.REQUIRED,
              },
            },
          },
          expect.any(Function),
        );
      });

      it('returns a correct instance', () => {
        expect(webauthnProvider.id).toBe('new-webauthn-provider-id');
        expect(webauthnProvider.etag).toBe('etag-token');
        expect(webauthnProvider.name).toBe('webauthn-provider');
        expect(webauthnProvider.displayName).toBeUndefined();
        expect(webauthnProvider.description).toBeUndefined();
      });
    });

    describe('when all possible values are sent', () => {
      beforeEach(async () => {
        configExample.displayName = 'Webauthn Provider Name';
        configExample.description = StringValue.fromJson('Webauthn Provider description');
        webauthnProvider = await sdk.createWebAuthnProviderConfiguration(
          'location-id',
          configExample,
        );
      });

      it('sends correct request', () => {
        expect(createConfigNodeSpy).toBeCalledWith(
          {
            name: 'webauthn-provider',
            location: 'location-id',
            bookmarks: [],
            config: {
              oneofKind: 'webauthnProviderConfig',
              webauthnProviderConfig: {
                attestationPreference: ConveyancePreference.DIRECT,
                authenticationTimeout: {
                  nanos: 0,
                  seconds: '60',
                },
                authenticatorAttachment: AuthenticatorAttachment.CROSS_PLATFORM,
                registrationTimeout: {
                  nanos: 0,
                  seconds: '120',
                },
                relyingParties: {
                  'http://localhost:3000': 'default',
                },
                requireResidentKey: true,
                userVerification: UserVerificationRequirement.REQUIRED,
              },
            },
            description: {
              value: 'Webauthn Provider description',
            },
            displayName: {
              value: 'Webauthn Provider Name',
            },
          },
          expect.any(Function),
        );
      });

      it('returns a correct instance', () => {
        expect(webauthnProvider.id).toBe('new-webauthn-provider-id');
        expect(webauthnProvider.etag).toBe('etag-token');
        expect(webauthnProvider.name).toBe('webauthn-provider');
        expect(webauthnProvider.displayName).toBe('Webauthn Provider Name');
        expect(webauthnProvider.description?.value).toBe('Webauthn Provider description');
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
        .spyOn(sdk['client'], 'createConfigNode')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response?: CreateConfigNodeResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(error);
            }
            return {} as SurfaceCall;
          },
        );
      return sdk.createWebAuthnProviderConfiguration('location-id', configExample).catch((err) => {
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
        .spyOn(sdk['client'], 'createConfigNode')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response?: CreateConfigNodeResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(null);
            }
            return {} as SurfaceCall;
          },
        );
      return sdk.createWebAuthnProviderConfiguration('location-id', configExample).catch((err) => {
        thrownError = err;
      });
    });

    it('throws an error', () => {
      expect(thrownError.message).toBe('No webauthn provider response');
    });
  });
});

describe('readWebAuthnProviderConfiguration', () => {
  describe('when no error is returned', () => {
    let webauthnProvider: WebAuthnProvider;
    let readConfigNodeSpy: jest.SpyInstance;

    beforeEach(async () => {
      const sdk = await ConfigClient.createInstance(JSON.stringify(serviceAccountTokenMock));
      readConfigNodeSpy = jest
        .spyOn(sdk['client'], 'readConfigNode')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response: ReadConfigNodeResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(null, {
                configNode: {
                  displayName: 'Instance Name',
                  description: StringValue.fromJson('Instance description'),
                  etag: 'etag-token',
                  id: 'webauthn-provider-id',
                  createdBy: 'Lorem ipsum - creator',
                  updatedBy: 'Lorem ipsum - updater',
                  createTime: Utils.dateToTimestamp(new Date(Date.UTC(2022, 6, 21, 11, 13))),
                  updateTime: Utils.dateToTimestamp(new Date(Date.UTC(2022, 6, 21, 11, 14))),
                  customerId: 'customer-id',
                  appSpaceId: 'app-space-id',
                  tenantId: 'tenant-id',
                  name: 'instance-name',
                  config: {
                    oneofKind: 'webauthnProviderConfig',
                    webauthnProviderConfig: {
                      attestationPreference: ConveyancePreference.DIRECT,
                      authenticatorAttachment: AuthenticatorAttachment.CROSS_PLATFORM,
                      relyingParties: {
                        'http://localhost:3000': 'default',
                      },
                      requireResidentKey: true,
                      userVerification: UserVerificationRequirement.REQUIRED,
                      authenticationTimeout: { seconds: '60', nanos: 0 },
                      registrationTimeout: { seconds: '2', nanos: 500000 },
                    },
                  },
                },
              });
            }
            return {} as SurfaceCall;
          },
        );
      webauthnProvider = await sdk.readWebAuthnProviderConfiguration(
        'webauthn-provider-id-request',
      );
    });

    it('sends correct request', () => {
      expect(readConfigNodeSpy).toBeCalledWith(
        {
          id: 'webauthn-provider-id-request',
          bookmarks: [],
        },
        expect.any(Function),
      );
    });

    it('returns a correct instance', () => {
      expect(webauthnProvider).toEqual(
        Object.assign(
          new WebAuthnProvider({
            name: 'instance-name',
            attestationPreference: ConveyancePreference.DIRECT,
            authenticatorAttachment: AuthenticatorAttachment.CROSS_PLATFORM,
            relyingParties: {
              'http://localhost:3000': 'default',
            },
            requireResidentKey: true,
            userVerification: UserVerificationRequirement.REQUIRED,
            authenticationTimeout: 60,
            registrationTimeout: 2.5,
          }),
          {
            displayName: 'Instance Name',
            description: { value: 'Instance description' },
            etag: 'etag-token',
            id: 'webauthn-provider-id',
            createTime: new Date(Date.UTC(2022, 6, 21, 11, 13)),
            updateTime: new Date(Date.UTC(2022, 6, 21, 11, 14)),
            customerId: 'customer-id',
            appSpaceId: 'app-space-id',
            tenantId: 'tenant-id',
            createdBy: 'Lorem ipsum - creator',
            updatedBy: 'Lorem ipsum - updater',
          },
        ),
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
        .spyOn(sdk['client'], 'readConfigNode')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response?: ReadConfigNodeResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(error);
            }
            return {} as SurfaceCall;
          },
        );
      return sdk.readWebAuthnProviderConfiguration('webauthn-provider-id-request').catch((err) => {
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
        .spyOn(sdk['client'], 'readConfigNode')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response?: ReadConfigNodeResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(null);
            }
            return {} as SurfaceCall;
          },
        );
      return sdk.readWebAuthnProviderConfiguration('webauthn-provider-id-request').catch((err) => {
        thrownError = err;
      });
    });

    it('throws an error', () => {
      expect(thrownError.message).toBe('config_error_read_webauthnproviderconfiguration');
    });
  });
});

describe('updateWebAuthnProviderConfiguration', () => {
  describe('when no error is returned', () => {
    let webauthnProvider: WebAuthnProvider;
    let updateConfigNodeSpy: jest.SpyInstance;
    let sdk: ConfigClient;

    beforeEach(async () => {
      sdk = await ConfigClient.createInstance(JSON.stringify(serviceAccountTokenMock));
      updateConfigNodeSpy = jest
        .spyOn(sdk['client'], 'updateConfigNode')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response: UpdateConfigNodeResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(null, {
                etag: 'new-etag-token',
                id: 'webauthn-provider-id',
                updateTime: Utils.dateToTimestamp(new Date(Date.UTC(2022, 6, 21, 14, 56))),
                bookmark: 'bookmark-token',
                createdBy: 'Lorem ipsum - creator',
                updatedBy: 'Lorem ipsum - updater',
                locationId: 'location-id',
              });
            }
            return {} as SurfaceCall;
          },
        );
    });

    describe('when necessary values are sent only', () => {
      beforeEach(async () => {
        configExample.id = 'webauthn-provider-id';
        webauthnProvider = await sdk.updateWebAuthnProviderConfiguration(configExample);
      });

      it('sends correct request', () => {
        expect(updateConfigNodeSpy).toBeCalledWith(
          {
            id: 'webauthn-provider-id',
            config: {
              oneofKind: 'webauthnProviderConfig',
              webauthnProviderConfig: {
                attestationPreference: ConveyancePreference.DIRECT,
                authenticatorAttachment: AuthenticatorAttachment.CROSS_PLATFORM,
                relyingParties: {
                  'http://localhost:3000': 'default',
                },
                requireResidentKey: true,
                userVerification: UserVerificationRequirement.REQUIRED,
                authenticationTimeout: { seconds: '60', nanos: 0 },
                registrationTimeout: { seconds: '120', nanos: 0 },
              },
            },
            bookmarks: [],
          },
          expect.any(Function),
        );
      });

      it('returns a correct instance', () => {
        expect(webauthnProvider).toEqual(
          Object.assign(
            new WebAuthnProvider({
              name: 'webauthn-provider',
              attestationPreference: ConveyancePreference.DIRECT,
              authenticatorAttachment: AuthenticatorAttachment.CROSS_PLATFORM,
              relyingParties: {
                'http://localhost:3000': 'default',
              },
              requireResidentKey: true,
              userVerification: UserVerificationRequirement.REQUIRED,
              authenticationTimeout: 60,
              registrationTimeout: 120,
            }),
            {
              etag: 'new-etag-token',
              id: 'webauthn-provider-id',
              updateTime: new Date(Date.UTC(2022, 6, 21, 14, 56)),
            },
          ),
        );
      });
    });

    describe('when all possible values are sent', () => {
      beforeEach(async () => {
        configExample.displayName = 'WebAuthn Provider name';
        configExample.description = StringValue.fromJson('WebAuthn Provider description');
        configExample.etag = 'etag-token';
        configExample.id = 'webauthn-provider-id';
        webauthnProvider = await sdk.updateWebAuthnProviderConfiguration(configExample);
      });

      it('sends correct request', () => {
        expect(updateConfigNodeSpy).toBeCalledWith(
          {
            id: 'webauthn-provider-id',
            config: {
              oneofKind: 'webauthnProviderConfig',
              webauthnProviderConfig: {
                attestationPreference: ConveyancePreference.DIRECT,
                authenticatorAttachment: AuthenticatorAttachment.CROSS_PLATFORM,
                relyingParties: {
                  'http://localhost:3000': 'default',
                },
                requireResidentKey: true,
                userVerification: UserVerificationRequirement.REQUIRED,
                authenticationTimeout: { seconds: '60', nanos: 0 },
                registrationTimeout: { seconds: '120', nanos: 0 },
              },
            },
            description: {
              value: 'WebAuthn Provider description',
            },
            displayName: {
              value: 'WebAuthn Provider name',
            },
            etag: {
              value: 'etag-token',
            },
            bookmarks: [],
          },
          expect.any(Function),
        );
      });

      it('returns a correct instance', () => {
        expect(webauthnProvider).toEqual(
          Object.assign(
            new WebAuthnProvider({
              name: 'webauthn-provider',
              attestationPreference: ConveyancePreference.DIRECT,
              authenticatorAttachment: AuthenticatorAttachment.CROSS_PLATFORM,
              relyingParties: {
                'http://localhost:3000': 'default',
              },
              requireResidentKey: true,
              userVerification: UserVerificationRequirement.REQUIRED,
              authenticationTimeout: 60,
              registrationTimeout: 120,
            }),
            {
              displayName: 'WebAuthn Provider name',
              description: StringValue.fromJson('WebAuthn Provider description'),
              etag: 'new-etag-token',
              id: 'webauthn-provider-id',
              updateTime: new Date(Date.UTC(2022, 6, 21, 14, 56)),
            },
          ),
        );
      });
    });
  });

  describe('when a different webauthn provider is returned', () => {
    let thrownError: SdkError;

    beforeEach(async () => {
      const sdk = await ConfigClient.createInstance(JSON.stringify(serviceAccountTokenMock));
      jest
        .spyOn(sdk['client'], 'updateConfigNode')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response: UpdateConfigNodeResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(null, {
                etag: 'new-etag-token',
                id: 'different-webauthn-provider-id',
                updateTime: Utils.dateToTimestamp(new Date(Date.UTC(2022, 6, 21, 14, 56))),
                bookmark: 'bookmark-token',
                createdBy: 'Lorem ipsum - creator',
                updatedBy: 'Lorem ipsum - updater',
                locationId: 'location-id',
              });
            }
            return {} as SurfaceCall;
          },
        );
      configExample.id = 'webauthn-provider-id';
      return sdk
        .updateWebAuthnProviderConfiguration(configExample)
        .catch((err) => (thrownError = err));
    });

    it('throws an error', () => {
      expect(thrownError.code).toEqual(SdkErrorCode.SDK_CODE_1);
      expect(thrownError.description).toBe(
        'Update returned with different id: req.iq=webauthn-provider-id, res.id=different-webauthn-provider-id',
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
        .spyOn(sdk['client'], 'updateConfigNode')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response?: UpdateConfigNodeResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(error);
            }
            return {} as SurfaceCall;
          },
        );
      configExample.id = 'webauthn-provider-id';
      return sdk.updateWebAuthnProviderConfiguration(configExample).catch((err) => {
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
        .spyOn(sdk['client'], 'updateConfigNode')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response?: UpdateConfigNodeResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(null);
            }
            return {} as SurfaceCall;
          },
        );
      configExample.id = 'webauthn-provider-id';
      return sdk.updateWebAuthnProviderConfiguration(configExample).catch((err) => {
        thrownError = err;
      });
    });

    it('throws an error', () => {
      expect(thrownError.message).toBe(
        'Update returned with different id: req.iq=webauthn-provider-id, res.id=undefined',
      );
    });
  });
});

describe('deleteWebAuthnProviderConfiguration', () => {
  describe('when no error is returned', () => {
    let deleteConfigNodeSpy: jest.SpyInstance;
    let sdk: ConfigClient;
    let returnedValue: boolean;

    describe('when necessary values are sent only', () => {
      beforeEach(async () => {
        sdk = await ConfigClient.createInstance(JSON.stringify(serviceAccountTokenMock));
        deleteConfigNodeSpy = jest
          .spyOn(sdk['client'], 'deleteConfigNode')
          .mockImplementation(
            (
              req,
              res:
                | Metadata
                | CallOptions
                | ((err: ServiceError | null, response: DeleteConfigNodeResponse) => void),
            ) => {
              if (typeof res === 'function') {
                res(null, {
                  bookmark: 'bookmark-token',
                });
              }
              return {} as SurfaceCall;
            },
          );
        configExample.id = 'webauthn-provider-id';
        returnedValue = await sdk.deleteWebAuthnProviderConfiguration(configExample);
      });

      it('sends correct request', () => {
        expect(deleteConfigNodeSpy).toBeCalledWith(
          {
            id: 'webauthn-provider-id',
            bookmarks: [],
          },
          expect.any(Function),
        );
      });

      it('returns a correct value', () => {
        expect(returnedValue).toBe(true);
      });
    });

    describe('when all possible values are sent', () => {
      beforeEach(async () => {
        sdk = await ConfigClient.createInstance(JSON.stringify(serviceAccountTokenMock));
        deleteConfigNodeSpy = jest
          .spyOn(sdk['client'], 'deleteConfigNode')
          .mockImplementation(
            (
              req,
              res:
                | Metadata
                | CallOptions
                | ((err: ServiceError | null, response: DeleteConfigNodeResponse) => void),
            ) => {
              if (typeof res === 'function') {
                res(null, {
                  bookmark: 'bookmark-token',
                });
              }
              return {} as SurfaceCall;
            },
          );
        configExample.id = 'webauthn-provider-id';
        configExample.etag = 'etag-token';
        returnedValue = await sdk.deleteWebAuthnProviderConfiguration(configExample);
      });

      it('sends correct request', () => {
        expect(deleteConfigNodeSpy).toBeCalledWith(
          {
            id: 'webauthn-provider-id',
            etag: StringValue.fromJson('etag-token'),
            bookmarks: [],
          },
          expect.any(Function),
        );
      });

      it('returns a correct value', () => {
        expect(returnedValue).toBe(true);
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
        .spyOn(sdk['client'], 'deleteConfigNode')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response?: DeleteConfigNodeResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(error);
            }
            return {} as SurfaceCall;
          },
        );
      configExample.id = 'webauthn-provider-id';
      return sdk.deleteWebAuthnProviderConfiguration(configExample).catch((err) => {
        thrownError = err;
      });
    });

    it('throws an error', () => {
      expect(thrownError).toBe(error);
    });
  });
});
