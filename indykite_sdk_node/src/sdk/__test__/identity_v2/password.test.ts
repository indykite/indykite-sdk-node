import { CallOptions, Metadata } from '@grpc/grpc-js';
import { ServiceError, SurfaceCall } from '@grpc/grpc-js/build/src/call';
import { Status } from '@grpc/grpc-js/build/src/constants';
import {
  ChangePasswordResponse,
  Error as IdentityManagementError,
  StartForgottenPasswordFlowResponse,
} from '../../../grpc/indykite/identity/v1beta2/identity_management_api';
import { IdentityClientV2 } from '../../identity_v2';
import { applicationTokenMock } from '../../utils/test_utils';
import { DigitalTwinKind, DigitalTwinState } from '../../../grpc/indykite/identity/v1beta2/model';

describe('startForgottenPasswordFlow', () => {
  describe('when no error is returned', () => {
    let startForgottenPasswordFlowSpy: jest.SpyInstance;
    let sdk: IdentityClientV2;

    beforeEach(async () => {
      sdk = await IdentityClientV2.createInstance(JSON.stringify(applicationTokenMock));
      startForgottenPasswordFlowSpy = jest
        .spyOn(sdk['client'], 'startForgottenPasswordFlow')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response: StartForgottenPasswordFlowResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(null, { active: true });
            }
            return {} as SurfaceCall;
          },
        );
      await sdk.startForgottenPasswordFlow({
        id: 'digital-twin-id',
        tenantId: 'tenant-id',
        kind: DigitalTwinKind.PERSON,
        state: DigitalTwinState.ACTIVE,
        tags: [],
      });
    });

    it('sends correct request', () => {
      expect(startForgottenPasswordFlowSpy).toBeCalledWith(
        {
          digitalTwin: {
            id: 'digital-twin-id',
            tenantId: 'tenant-id',
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
    let thrownError: IdentityManagementError;

    beforeEach(async () => {
      const sdk = await IdentityClientV2.createInstance(JSON.stringify(applicationTokenMock));
      jest
        .spyOn(sdk['client'], 'startForgottenPasswordFlow')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response?: StartForgottenPasswordFlowResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(error);
            }
            return {} as SurfaceCall;
          },
        );
      sdk
        .startForgottenPasswordFlow({
          id: 'digital-twin-id',
          tenantId: 'tenant-id',
          kind: DigitalTwinKind.PERSON,
          state: DigitalTwinState.ACTIVE,
          tags: [],
        })
        .catch((err) => {
          thrownError = err;
        });
    });

    it('throws an error', () => {
      expect(thrownError).toBe(error);
    });
  });
});

describe('changeMyPassword', () => {
  describe('when no error is returned', () => {
    const changePasswordResponse: ChangePasswordResponse = {
      error: undefined,
    };
    let changePasswordSpy: jest.SpyInstance;
    let sdk: IdentityClientV2;

    beforeEach(async () => {
      sdk = await IdentityClientV2.createInstance(JSON.stringify(applicationTokenMock));
      changePasswordSpy = jest
        .spyOn(sdk['client'], 'changePassword')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response: ChangePasswordResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(null, changePasswordResponse);
            }
            return {} as SurfaceCall;
          },
        );
      await sdk.changeMyPassword('access-token', 'new-p4ssw0rd');
    });

    it('sends correct request', () => {
      expect(changePasswordSpy).toBeCalledWith(
        {
          ignorePolicy: false,
          password: 'new-p4ssw0rd',
          uid: {
            oneofKind: 'token',
            token: 'access-token',
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
    let thrownError: IdentityManagementError;

    beforeEach(async () => {
      const sdk = await IdentityClientV2.createInstance(JSON.stringify(applicationTokenMock));
      jest
        .spyOn(sdk['client'], 'changePassword')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response?: ChangePasswordResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(error);
            }
            return {} as SurfaceCall;
          },
        );
      sdk.changeMyPassword('access-token', 'new-p4ssw0rd').catch((err) => {
        thrownError = err;
      });
    });

    it('throws an error', () => {
      expect(thrownError).toBe(error);
    });
  });

  describe('when an error in the response is returned', () => {
    const error = {
      code: 'NOT_FOUND',
    } as IdentityManagementError;
    let thrownError: IdentityManagementError;

    beforeEach(async () => {
      const sdk = await IdentityClientV2.createInstance(JSON.stringify(applicationTokenMock));
      jest
        .spyOn(sdk['client'], 'changePassword')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response?: ChangePasswordResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(null, { error });
            }
            return {} as SurfaceCall;
          },
        );
      sdk.changeMyPassword('access-token', 'new-p4ssw0rd').catch((err) => {
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
      const sdk = await IdentityClientV2.createInstance(JSON.stringify(applicationTokenMock));
      jest
        .spyOn(sdk['client'], 'changePassword')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response?: ChangePasswordResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(null);
            }
            return {} as SurfaceCall;
          },
        );
      sdk.changeMyPassword('access-token', 'new-p4ssw0rd').catch((err) => {
        thrownError = err;
      });
    });

    it('throws an error', () => {
      expect(thrownError.message).toBe('No change password response');
    });
  });
});

describe('changePasswordOfDigitalTwin', () => {
  describe('when no error is returned', () => {
    const changePasswordResponse: ChangePasswordResponse = {
      error: undefined,
    };
    let changePasswordSpy: jest.SpyInstance;
    let sdk: IdentityClientV2;
    let response: ChangePasswordResponse;

    beforeEach(async () => {
      sdk = await IdentityClientV2.createInstance(JSON.stringify(applicationTokenMock));
      changePasswordSpy = jest
        .spyOn(sdk['client'], 'changePassword')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response: ChangePasswordResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(null, changePasswordResponse);
            }
            return {} as SurfaceCall;
          },
        );
      response = await sdk.changePasswordOfDigitalTwin(
        {
          id: 'digital-twin-id',
          tenantId: 'tenant-id',
          kind: DigitalTwinKind.PERSON,
          state: DigitalTwinState.ACTIVE,
          tags: [],
        },
        'new-p4ssw0rd',
      );
    });

    it('sends correct request', () => {
      expect(changePasswordSpy).toBeCalledWith(
        {
          ignorePolicy: false,
          password: 'new-p4ssw0rd',
          uid: {
            oneofKind: 'digitalTwin',
            digitalTwin: {
              id: 'digital-twin-id',
              tenantId: 'tenant-id',
              kind: DigitalTwinKind.PERSON,
              state: DigitalTwinState.ACTIVE,
              tags: [],
            },
          },
        },
        expect.any(Function),
      );
    });

    it('gets correct response', () => {
      expect(response).toEqual(changePasswordResponse);
    });
  });

  describe('when an error is returned', () => {
    const error = {
      code: Status.NOT_FOUND,
      details: 'DETAILS',
      metadata: {},
    } as ServiceError;
    let thrownError: IdentityManagementError;

    beforeEach(async () => {
      const sdk = await IdentityClientV2.createInstance(JSON.stringify(applicationTokenMock));
      jest
        .spyOn(sdk['client'], 'changePassword')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response?: ChangePasswordResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(error);
            }
            return {} as SurfaceCall;
          },
        );
      sdk
        .changePasswordOfDigitalTwin(
          {
            id: 'digital-twin-id',
            tenantId: 'tenant-id',
            kind: DigitalTwinKind.PERSON,
            state: DigitalTwinState.ACTIVE,
            tags: [],
          },
          'new-p4ssw0rd',
        )
        .catch((err) => {
          thrownError = err;
        });
    });

    it('throws an error', () => {
      expect(thrownError).toBe(error);
    });
  });

  describe('when an error in the response is returned', () => {
    const error = {
      code: 'NOT_FOUND',
    } as IdentityManagementError;
    let thrownError: IdentityManagementError;

    beforeEach(async () => {
      const sdk = await IdentityClientV2.createInstance(JSON.stringify(applicationTokenMock));
      jest
        .spyOn(sdk['client'], 'changePassword')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response?: ChangePasswordResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(null, { error });
            }
            return {} as SurfaceCall;
          },
        );
      sdk
        .changePasswordOfDigitalTwin(
          {
            id: 'digital-twin-id',
            tenantId: 'tenant-id',
            kind: DigitalTwinKind.PERSON,
            state: DigitalTwinState.ACTIVE,
            tags: [],
          },
          'new-p4ssw0rd',
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
      const sdk = await IdentityClientV2.createInstance(JSON.stringify(applicationTokenMock));
      jest
        .spyOn(sdk['client'], 'changePassword')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response?: ChangePasswordResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(null);
            }
            return {} as SurfaceCall;
          },
        );
      sdk.changeMyPassword('access-token', 'new-p4ssw0rd').catch((err) => {
        thrownError = err;
      });
    });

    it('throws an error', () => {
      expect(thrownError.message).toBe('No change password response');
    });
  });
});
