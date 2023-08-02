import { CallOptions, Metadata } from '@grpc/grpc-js';
import { ServiceError, SurfaceCall } from '@grpc/grpc-js/build/src/call';
import { Status } from '@grpc/grpc-js/build/src/constants';
import {
  CheckInvitationStateResponse,
  CreateInvitationResponse,
  ResendInvitationResponse,
} from '../../../grpc/indykite/identity/v1beta2/identity_management_api';
import { IdentityClientV2 } from '../../identity_v2';
import { applicationTokenMock } from '../../utils/test_utils';
import { Utils } from '../../utils/utils';
import { InvitationState } from '../../../grpc/indykite/identity/v1beta2/model';

describe('createEmailInvitation', () => {
  describe('when no error is returned', () => {
    describe('when only required arguments are used', () => {
      let createInvitationSpy: jest.SpyInstance;
      let sdk: IdentityClientV2;

      beforeEach(async () => {
        sdk = await IdentityClientV2.createInstance(JSON.stringify(applicationTokenMock));
        createInvitationSpy = jest
          .spyOn(sdk['client'], 'createInvitation')
          .mockImplementation(
            (
              req,
              res:
                | Metadata
                | CallOptions
                | ((err: ServiceError | null, response?: CreateInvitationResponse) => void),
            ) => {
              if (typeof res === 'function') {
                res(null);
              }
              return {} as SurfaceCall;
            },
          );
        await sdk.createEmailInvitation('new-user@example.com', 'tenant-id', 'custom-reference-id');
      });

      it('sends correct request', () => {
        expect(createInvitationSpy).toBeCalledWith(
          {
            referenceId: 'custom-reference-id',
            tenantId: 'tenant-id',
            invitee: {
              oneofKind: 'email',
              email: 'new-user@example.com',
            },
          },
          expect.any(Function),
        );
      });
    });

    describe('when all arguments are used', () => {
      const expirationDate = new Date(Date.UTC(2023, 7, 31, 23, 59));
      const invitationDate = new Date(Date.UTC(2023, 7, 1, 13, 27));
      let createInvitationSpy: jest.SpyInstance;
      let sdk: IdentityClientV2;

      beforeEach(async () => {
        sdk = await IdentityClientV2.createInstance(JSON.stringify(applicationTokenMock));
        createInvitationSpy = jest
          .spyOn(sdk['client'], 'createInvitation')
          .mockImplementation(
            (
              req,
              res:
                | Metadata
                | CallOptions
                | ((err: ServiceError | null, response?: CreateInvitationResponse) => void),
            ) => {
              if (typeof res === 'function') {
                res(null);
              }
              return {} as SurfaceCall;
            },
          );
        await sdk.createEmailInvitation(
          'new-user@example.com',
          'tenant-id',
          'custom-reference-id',
          expirationDate,
          invitationDate,
          {
            customAttribute: 'attribute-value',
          },
        );
      });

      it('sends correct request', () => {
        expect(createInvitationSpy).toBeCalledWith(
          {
            referenceId: 'custom-reference-id',
            tenantId: 'tenant-id',
            invitee: {
              oneofKind: 'email',
              email: 'new-user@example.com',
            },
            expireTime: Utils.dateToTimestamp(expirationDate),
            inviteAtTime: Utils.dateToTimestamp(invitationDate),
            messageAttributes: {
              fields: {
                customAttribute: {
                  value: {
                    oneofKind: 'stringValue',
                    stringValue: 'attribute-value',
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
      const expirationDate = new Date(Date.UTC(2023, 7, 31, 23, 59));
      const invitationDate = new Date(Date.UTC(2023, 7, 1, 13, 27));
      let createInvitationSpy: jest.SpyInstance;
      let sdk: IdentityClientV2;
      let thrownError: Error;

      beforeEach(async () => {
        sdk = await IdentityClientV2.createInstance(JSON.stringify(applicationTokenMock));
        createInvitationSpy = jest
          .spyOn(sdk['client'], 'createInvitation')
          .mockImplementation(
            (
              req,
              res:
                | Metadata
                | CallOptions
                | ((err: ServiceError | null, response?: CreateInvitationResponse) => void),
            ) => {
              if (typeof res === 'function') {
                res(null);
              }
              return {} as SurfaceCall;
            },
          );
        sdk
          .createEmailInvitation(
            'new-user@example.com',
            'tenant-id',
            'custom-reference-id',
            expirationDate,
            invitationDate,
            'custom-attribute' as unknown as Record<string, unknown>,
          )
          .catch((err) => {
            thrownError = err;
          });
      });

      it('does not send any request', () => {
        expect(createInvitationSpy).toBeCalledTimes(0);
      });

      it('throws an error', () => {
        expect(thrownError.message).toBe('Message attributes property needs to be an object value');
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
      const sdk = await IdentityClientV2.createInstance(JSON.stringify(applicationTokenMock));
      jest
        .spyOn(sdk['client'], 'createInvitation')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response?: CreateInvitationResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(error);
            }
            return {} as SurfaceCall;
          },
        );
      sdk
        .createEmailInvitation('new-user@example.com', 'tenant-id', 'custom-reference-id')
        .catch((err) => {
          thrownError = err;
        });
    });

    it('throws an error', () => {
      expect(thrownError).toBe(error);
    });
  });
});

describe('checkInvitationState', () => {
  describe('when no error is returned', () => {
    const checkInvitationStateResponse: CheckInvitationStateResponse = {
      invitation: {
        referenceId: 'custom-reference-id',
        tenantId: 'tenant-id',
        invitee: {
          oneofKind: 'email',
          email: 'new-user@example.com',
        },
        state: InvitationState.PENDING,
      },
    };
    let checkInvitationStateSpy: jest.SpyInstance;
    let sdk: IdentityClientV2;
    let response: CheckInvitationStateResponse;

    beforeEach(async () => {
      sdk = await IdentityClientV2.createInstance(JSON.stringify(applicationTokenMock));
      checkInvitationStateSpy = jest
        .spyOn(sdk['client'], 'checkInvitationState')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response: CheckInvitationStateResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(null, checkInvitationStateResponse);
            }
            return {} as SurfaceCall;
          },
        );
      response = await sdk.checkInvitationState('custom-reference-id');
    });

    it('sends correct request', () => {
      expect(checkInvitationStateSpy).toBeCalledWith(
        {
          identifier: {
            oneofKind: 'referenceId',
            referenceId: 'custom-reference-id',
          },
        },
        expect.any(Function),
      );
    });

    it('gets correct response', () => {
      expect(response).toEqual(checkInvitationStateResponse);
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
        .spyOn(sdk['client'], 'checkInvitationState')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response?: CheckInvitationStateResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(error);
            }
            return {} as SurfaceCall;
          },
        );
      sdk.checkInvitationState('custom-reference-id').catch((err) => {
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
        .spyOn(sdk['client'], 'checkInvitationState')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response?: CheckInvitationStateResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(null);
            }
            return {} as SurfaceCall;
          },
        );
      sdk.checkInvitationState('custom-reference-id').catch((err) => {
        thrownError = err;
      });
    });

    it('throws an error', () => {
      expect(thrownError.message).toBe('Missing check invitation response');
    });
  });
});

describe('checkInvitationToken', () => {
  describe('when no error is returned', () => {
    const checkInvitationStateResponse: CheckInvitationStateResponse = {
      invitation: {
        referenceId: 'custom-reference-id',
        tenantId: 'tenant-id',
        invitee: {
          oneofKind: 'email',
          email: 'new-user@example.com',
        },
        state: InvitationState.PENDING,
      },
    };
    let checkInvitationStateSpy: jest.SpyInstance;
    let sdk: IdentityClientV2;
    let response: CheckInvitationStateResponse;

    beforeEach(async () => {
      sdk = await IdentityClientV2.createInstance(JSON.stringify(applicationTokenMock));
      checkInvitationStateSpy = jest
        .spyOn(sdk['client'], 'checkInvitationState')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response: CheckInvitationStateResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(null, checkInvitationStateResponse);
            }
            return {} as SurfaceCall;
          },
        );
      response = await sdk.checkInvitationToken('invitation-token');
    });

    it('sends correct request', () => {
      expect(checkInvitationStateSpy).toBeCalledWith(
        {
          identifier: {
            oneofKind: 'invitationToken',
            invitationToken: 'invitation-token',
          },
        },
        expect.any(Function),
      );
    });

    it('gets correct response', () => {
      expect(response).toEqual(checkInvitationStateResponse);
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
        .spyOn(sdk['client'], 'checkInvitationState')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response?: CheckInvitationStateResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(error);
            }
            return {} as SurfaceCall;
          },
        );
      sdk.checkInvitationToken('invitation-token').catch((err) => {
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
        .spyOn(sdk['client'], 'checkInvitationState')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response?: CheckInvitationStateResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(null);
            }
            return {} as SurfaceCall;
          },
        );
      sdk.checkInvitationToken('invitation-token').catch((err) => {
        thrownError = err;
      });
    });

    it('throws an error', () => {
      expect(thrownError.message).toBe('Missing check invitation response');
    });
  });
});

describe('resendInvitation', () => {
  describe('when no error is returned', () => {
    let resendInvitationSpy: jest.SpyInstance;
    let sdk: IdentityClientV2;

    beforeEach(async () => {
      sdk = await IdentityClientV2.createInstance(JSON.stringify(applicationTokenMock));
      resendInvitationSpy = jest
        .spyOn(sdk['client'], 'resendInvitation')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response?: ResendInvitationResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(null);
            }
            return {} as SurfaceCall;
          },
        );
      await sdk.resendInvitation('custom-reference-id');
    });

    it('sends correct request', () => {
      expect(resendInvitationSpy).toBeCalledWith(
        {
          referenceId: 'custom-reference-id',
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
      const sdk = await IdentityClientV2.createInstance(JSON.stringify(applicationTokenMock));
      jest
        .spyOn(sdk['client'], 'resendInvitation')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response?: ResendInvitationResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(error);
            }
            return {} as SurfaceCall;
          },
        );
      sdk.resendInvitation('custom-reference-id').catch((err) => {
        thrownError = err;
      });
    });

    it('throws an error', () => {
      expect(thrownError).toBe(error);
    });
  });
});

describe('cancelInvitation', () => {
  describe('when no error is returned', () => {
    let resendInvitationSpy: jest.SpyInstance;
    let sdk: IdentityClientV2;

    beforeEach(async () => {
      sdk = await IdentityClientV2.createInstance(JSON.stringify(applicationTokenMock));
      resendInvitationSpy = jest
        .spyOn(sdk['client'], 'cancelInvitation')
        .mockImplementation(
          (req, res: Metadata | CallOptions | ((err: ServiceError | null) => void)) => {
            if (typeof res === 'function') {
              res(null);
            }
            return {} as SurfaceCall;
          },
        );
      await sdk.cancelInvitation('custom-reference-id');
    });

    it('sends correct request', () => {
      expect(resendInvitationSpy).toBeCalledWith(
        {
          referenceId: 'custom-reference-id',
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
      const sdk = await IdentityClientV2.createInstance(JSON.stringify(applicationTokenMock));
      jest
        .spyOn(sdk['client'], 'cancelInvitation')
        .mockImplementation(
          (req, res: Metadata | CallOptions | ((err: ServiceError | null) => void)) => {
            if (typeof res === 'function') {
              res(error);
            }
            return {} as SurfaceCall;
          },
        );
      sdk.cancelInvitation('custom-reference-id').catch((err) => {
        thrownError = err;
      });
    });

    it('throws an error', () => {
      expect(thrownError).toBe(error);
    });
  });
});
