import { CallOptions, Metadata } from '@grpc/grpc-js';
import { ServiceError, SurfaceCall } from '@grpc/grpc-js/build/src/call';
import { Status } from '@grpc/grpc-js/build/src/constants';
import {
  GetPasswordCredentialResponse,
  UpdatePasswordCredentialResponse,
} from '../../../grpc/indykite/identity/v1beta1/identity_management_api';
import { IdentityClient } from '../../identity';
import { Utils } from '../../utils/utils';
import { applicationTokenMock } from '../../utils/test_utils';
import { DigitalTwinCore } from '../../model';
import { DigitalTwinKind, DigitalTwinState } from '../../../grpc/indykite/identity/v1beta1/model';
import { v4 } from 'uuid';
import { BoolValue } from '../../../grpc/google/protobuf/wrappers';

describe('getPasswordCredential', () => {
  const dtId = v4();
  const tenantId = v4();
  const digitalTwin = new DigitalTwinCore(
    dtId,
    tenantId,
    DigitalTwinKind.PERSON,
    DigitalTwinState.ACTIVE,
    [],
  );

  describe('when no error is returned', () => {
    let getPasswordCredentialSpy: jest.SpyInstance;
    let sdk: IdentityClient;

    beforeEach(async () => {
      sdk = await IdentityClient.createInstance(JSON.stringify(applicationTokenMock));
      getPasswordCredentialSpy = jest
        .spyOn(sdk['client'], 'getPasswordCredential')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response: GetPasswordCredentialResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(null, {});
            }
            return {} as SurfaceCall;
          },
        );
      return sdk.getPasswordCredential(digitalTwin);
    });

    it('sends correct request', () => {
      expect(getPasswordCredentialSpy).toBeCalledWith(
        {
          digitalTwin: {
            id: Uint8Array.from(Utils.uuidToBuffer(dtId)),
            tenantId: Uint8Array.from(Utils.uuidToBuffer(tenantId)),
            kind: DigitalTwinKind.PERSON,
            state: DigitalTwinState.ACTIVE,
            tags: [],
          },
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
      const sdk = await IdentityClient.createInstance(JSON.stringify(applicationTokenMock));
      jest
        .spyOn(sdk['client'], 'getPasswordCredential')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response?: GetPasswordCredentialResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(error);
            }
            return {} as SurfaceCall;
          },
        );
      sdk.getPasswordCredential(digitalTwin).catch((err) => {
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
      const sdk = await IdentityClient.createInstance(JSON.stringify(applicationTokenMock));
      jest
        .spyOn(sdk['client'], 'getPasswordCredential')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response?: GetPasswordCredentialResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(null);
            }
            return {} as SurfaceCall;
          },
        );
      sdk.getPasswordCredential(digitalTwin).catch((err) => {
        thrownError = err;
      });
    });

    it('throws an error', () => {
      expect(thrownError.message).toBe('Missing get password credential response');
    });
  });
});

describe('updateEmailPasswordCredential', () => {
  const loginProperties: Buffer[] = [Buffer.from('login-property-value')];

  describe('when no error is returned', () => {
    describe('when all configurable values are set', () => {
      let updatePasswordCredentialSpy: jest.SpyInstance;
      let sdk: IdentityClient;

      beforeEach(async () => {
        sdk = await IdentityClient.createInstance(JSON.stringify(applicationTokenMock));
        updatePasswordCredentialSpy = jest
          .spyOn(sdk['client'], 'updatePasswordCredential')
          .mockImplementation(
            (
              req,
              res:
                | Metadata
                | CallOptions
                | ((err: ServiceError | null, response: UpdatePasswordCredentialResponse) => void),
            ) => {
              if (typeof res === 'function') {
                res(null, {});
              }
              return {} as SurfaceCall;
            },
          );
        return sdk.updateEmailPasswordCredential('user@example.com', loginProperties, true, true);
      });

      it('sends correct request', () => {
        expect(updatePasswordCredentialSpy).toBeCalledWith(
          {
            loginProperties: [Uint8Array.from(loginProperties[0])],
            locked: BoolValue.create({ value: true }),
            mustChange: BoolValue.create({ value: true }),
            primary: {
              oneofKind: 'email',
              email: 'user@example.com',
            },
          },
          expect.any(Function),
        );
      });
    });

    describe('when only necessary configurable values are set', () => {
      let updatePasswordCredentialSpy: jest.SpyInstance;
      let sdk: IdentityClient;

      beforeEach(async () => {
        sdk = await IdentityClient.createInstance(JSON.stringify(applicationTokenMock));
        updatePasswordCredentialSpy = jest
          .spyOn(sdk['client'], 'updatePasswordCredential')
          .mockImplementation(
            (
              req,
              res:
                | Metadata
                | CallOptions
                | ((err: ServiceError | null, response: UpdatePasswordCredentialResponse) => void),
            ) => {
              if (typeof res === 'function') {
                res(null, {});
              }
              return {} as SurfaceCall;
            },
          );
        return sdk.updateEmailPasswordCredential('user@example.com', loginProperties);
      });

      it('sends correct request', () => {
        expect(updatePasswordCredentialSpy).toBeCalledWith(
          {
            loginProperties: [Uint8Array.from(loginProperties[0])],
            primary: {
              oneofKind: 'email',
              email: 'user@example.com',
            },
          },
          expect.any(Function),
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
      const sdk = await IdentityClient.createInstance(JSON.stringify(applicationTokenMock));
      jest
        .spyOn(sdk['client'], 'updatePasswordCredential')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response?: UpdatePasswordCredentialResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(error);
            }
            return {} as SurfaceCall;
          },
        );
      sdk
        .updateEmailPasswordCredential('user@example.com', loginProperties, true, true)
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
      const sdk = await IdentityClient.createInstance(JSON.stringify(applicationTokenMock));
      jest
        .spyOn(sdk['client'], 'updatePasswordCredential')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response?: UpdatePasswordCredentialResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(null);
            }
            return {} as SurfaceCall;
          },
        );
      sdk
        .updateEmailPasswordCredential('user@example.com', loginProperties, true, true)
        .catch((err) => {
          thrownError = err;
        });
    });

    it('throws an error', () => {
      expect(thrownError.message).toBe('Missing update password credential response');
    });
  });
});

describe('updateMobilePasswordCredential', () => {
  const loginProperties: Buffer[] = [Buffer.from('login-property-value')];

  describe('when no error is returned', () => {
    describe('when all configurable values are set', () => {
      let updatePasswordCredentialSpy: jest.SpyInstance;
      let sdk: IdentityClient;

      beforeEach(async () => {
        sdk = await IdentityClient.createInstance(JSON.stringify(applicationTokenMock));
        updatePasswordCredentialSpy = jest
          .spyOn(sdk['client'], 'updatePasswordCredential')
          .mockImplementation(
            (
              req,
              res:
                | Metadata
                | CallOptions
                | ((err: ServiceError | null, response: UpdatePasswordCredentialResponse) => void),
            ) => {
              if (typeof res === 'function') {
                res(null, {});
              }
              return {} as SurfaceCall;
            },
          );
        return sdk.updateMobilePasswordCredential('+421949949949', loginProperties, true, true);
      });

      it('sends correct request', () => {
        expect(updatePasswordCredentialSpy).toBeCalledWith(
          {
            loginProperties: [Uint8Array.from(loginProperties[0])],
            locked: BoolValue.create({ value: true }),
            mustChange: BoolValue.create({ value: true }),
            primary: {
              oneofKind: 'mobile',
              mobile: '+421949949949',
            },
          },
          expect.any(Function),
        );
      });
    });

    describe('when only necessary configurable values are set', () => {
      let updatePasswordCredentialSpy: jest.SpyInstance;
      let sdk: IdentityClient;

      beforeEach(async () => {
        sdk = await IdentityClient.createInstance(JSON.stringify(applicationTokenMock));
        updatePasswordCredentialSpy = jest
          .spyOn(sdk['client'], 'updatePasswordCredential')
          .mockImplementation(
            (
              req,
              res:
                | Metadata
                | CallOptions
                | ((err: ServiceError | null, response: UpdatePasswordCredentialResponse) => void),
            ) => {
              if (typeof res === 'function') {
                res(null, {});
              }
              return {} as SurfaceCall;
            },
          );
        return sdk.updateMobilePasswordCredential('+421949949949', loginProperties);
      });

      it('sends correct request', () => {
        expect(updatePasswordCredentialSpy).toBeCalledWith(
          {
            loginProperties: [Uint8Array.from(loginProperties[0])],
            primary: {
              oneofKind: 'mobile',
              mobile: '+421949949949',
            },
          },
          expect.any(Function),
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
      const sdk = await IdentityClient.createInstance(JSON.stringify(applicationTokenMock));
      jest
        .spyOn(sdk['client'], 'updatePasswordCredential')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response?: UpdatePasswordCredentialResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(error);
            }
            return {} as SurfaceCall;
          },
        );
      sdk
        .updateMobilePasswordCredential('+421949949949', loginProperties, true, true)
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
      const sdk = await IdentityClient.createInstance(JSON.stringify(applicationTokenMock));
      jest
        .spyOn(sdk['client'], 'updatePasswordCredential')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response?: UpdatePasswordCredentialResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(null);
            }
            return {} as SurfaceCall;
          },
        );
      sdk
        .updateMobilePasswordCredential('+421949949949', loginProperties, true, true)
        .catch((err) => {
          thrownError = err;
        });
    });

    it('throws an error', () => {
      expect(thrownError.message).toBe('Missing update password credential response');
    });
  });
});
