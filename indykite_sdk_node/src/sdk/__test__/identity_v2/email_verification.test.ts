import { CallOptions, Metadata } from '@grpc/grpc-js';
import { ServiceError, SurfaceCall } from '@grpc/grpc-js/build/src/call';
import { Status } from '@grpc/grpc-js/build/src/constants';
import {
  StartDigitalTwinEmailVerificationResponse,
  VerifyDigitalTwinEmailResponse,
} from '../../../grpc/indykite/identity/v1beta2/identity_management_api';
import { IdentityClientV2 } from '../../identity_v2';
import { applicationTokenMock } from '../../utils/test_utils';
import {
  DigitalTwin,
  DigitalTwinKind,
  DigitalTwinState,
} from '../../../grpc/indykite/identity/v1beta2/model';

describe('startEmailVerification', () => {
  describe('when no error is returned', () => {
    let startDigitalTwinEmailVerificationSpy: jest.SpyInstance;
    let sdk: IdentityClientV2;

    beforeEach(async () => {
      sdk = await IdentityClientV2.createInstance(JSON.stringify(applicationTokenMock));
      startDigitalTwinEmailVerificationSpy = jest
        .spyOn(sdk['client'], 'startDigitalTwinEmailVerification')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((
                  err: ServiceError | null,
                  response?: StartDigitalTwinEmailVerificationResponse,
                ) => void),
          ) => {
            if (typeof res === 'function') {
              res(null);
            }
            return {} as SurfaceCall;
          },
        );
      await sdk.startEmailVerification(
        {
          id: 'digital-twin-id',
          tenantId: 'tenant-id',
          kind: DigitalTwinKind.PERSON,
          state: DigitalTwinState.ACTIVE,
          tags: [],
        },
        'user@example.com',
        {
          kind: 'Customer',
        },
      );
    });

    it('sends correct request', () => {
      expect(startDigitalTwinEmailVerificationSpy).toBeCalledWith(
        {
          digitalTwin: {
            id: 'digital-twin-id',
            tenantId: 'tenant-id',
            kind: DigitalTwinKind.PERSON,
            state: DigitalTwinState.ACTIVE,
            tags: [],
          },
          email: 'user@example.com',
          attributes: {
            fields: {
              kind: {
                value: {
                  oneofKind: 'stringValue',
                  stringValue: 'Customer',
                },
              },
            },
          },
        },
        expect.any(Function),
      );
    });
  });

  describe('when attributes have an incorrect format', () => {
    let startDigitalTwinEmailVerificationSpy: jest.SpyInstance;
    let sdk: IdentityClientV2;
    let thrownError: Error;

    beforeEach(async () => {
      sdk = await IdentityClientV2.createInstance(JSON.stringify(applicationTokenMock));
      startDigitalTwinEmailVerificationSpy = jest
        .spyOn(sdk['client'], 'startDigitalTwinEmailVerification')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((
                  err: ServiceError | null,
                  response?: StartDigitalTwinEmailVerificationResponse,
                ) => void),
          ) => {
            if (typeof res === 'function') {
              res(null);
            }
            return {} as SurfaceCall;
          },
        );
      sdk
        .startEmailVerification(
          {
            id: 'digital-twin-id',
            tenantId: 'tenant-id',
            kind: DigitalTwinKind.PERSON,
            state: DigitalTwinState.ACTIVE,
            tags: [],
          },
          'user@example.com',
          'custom-attribute' as unknown as Record<string, unknown>,
        )
        .catch((err) => {
          thrownError = err;
        });
    });

    it('does not send any request', () => {
      expect(startDigitalTwinEmailVerificationSpy).toBeCalledTimes(0);
    });

    it('throws an error', () => {
      expect(thrownError.message).toBe('Message attributes property needs to be an object value');
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
      const sdk = await IdentityClientV2.createInstance(JSON.stringify(applicationTokenMock));
      jest
        .spyOn(sdk['client'], 'startDigitalTwinEmailVerification')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((
                  err: ServiceError | null,
                  response?: StartDigitalTwinEmailVerificationResponse,
                ) => void),
          ) => {
            if (typeof res === 'function') {
              res(error);
            }
            return {} as SurfaceCall;
          },
        );
      sdk
        .startEmailVerification(
          {
            id: 'digital-twin-id',
            tenantId: 'tenant-id',
            kind: DigitalTwinKind.PERSON,
            state: DigitalTwinState.ACTIVE,
            tags: [],
          },
          'user@exmaple.com',
        )
        .catch((err) => {
          thrownError = err;
        });
    });

    it('throws an error', () => {
      expect(thrownError).toBe(error);
    });
  });
});

describe('verifyDigitalTwinEmail', () => {
  describe('when no error is returned', () => {
    const digitalTwin: DigitalTwin = {
      id: 'digital-twin-id',
      tenantId: 'tenant-id',
      kind: DigitalTwinKind.PERSON,
      state: DigitalTwinState.ACTIVE,
      tags: [],
    };
    let verifyDigitalTwinEmailSpy: jest.SpyInstance;
    let sdk: IdentityClientV2;
    let response: DigitalTwin | undefined;

    beforeEach(async () => {
      sdk = await IdentityClientV2.createInstance(JSON.stringify(applicationTokenMock));
      verifyDigitalTwinEmailSpy = jest
        .spyOn(sdk['client'], 'verifyDigitalTwinEmail')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response?: VerifyDigitalTwinEmailResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(null, { digitalTwin });
            }
            return {} as SurfaceCall;
          },
        );
      response = await sdk.verifyDigitalTwinEmail('email-token');
    });

    it('sends correct request', () => {
      expect(verifyDigitalTwinEmailSpy).toBeCalledWith(
        {
          token: 'email-token',
        },
        expect.any(Function),
      );
    });

    it('gets correct response', () => {
      expect(response).toEqual(digitalTwin);
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
      const sdk = await IdentityClientV2.createInstance(JSON.stringify(applicationTokenMock));
      jest
        .spyOn(sdk['client'], 'verifyDigitalTwinEmail')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response?: VerifyDigitalTwinEmailResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(error);
            }
            return {} as SurfaceCall;
          },
        );
      sdk.verifyDigitalTwinEmail('email-token').catch((err) => {
        thrownError = err;
      });
    });

    it('throws an error', () => {
      expect(thrownError).toBe(error);
    });
  });
});
