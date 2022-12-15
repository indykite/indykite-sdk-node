import { ServiceError, SurfaceCall } from '@grpc/grpc-js/build/src/call';
import {
  CancelInvitationRequest,
  CancelInvitationResponse,
  CheckInvitationStateRequest,
  CheckInvitationStateResponse,
  CreateInvitationRequest,
  CreateInvitationResponse,
  ResendInvitationRequest,
  ResendInvitationResponse,
} from '../../../grpc/indykite/identity/v1beta2/identity_management_api';
import { IdentityClient } from '../../identity';
import { Status } from '@grpc/grpc-js/build/src/constants';
import { CallOptions, Metadata } from '@grpc/grpc-js';
import { Utils } from '../../utils/utils';
import { Invitation, InvitationState } from '../../model/invitation';
import { NullValue } from '../../../grpc/google/protobuf/struct';
import { applicationTokenMock, generateRandomGID } from '../../utils/test_utils';

let sdk: IdentityClient;

beforeAll(async () => {
  sdk = await IdentityClient.createInstance(applicationTokenMock);
});

afterEach(() => {
  jest.resetAllMocks();
});

describe('createEmailInvitation', () => {
  describe('when only necessary parameters are used', () => {
    describe('when the response is successful', () => {
      const invitee = 'user@exmaple.com';
      const tenantId = generateRandomGID();
      const referenceId = '123321';
      let result: unknown;

      beforeEach(async () => {
        const mockFunc = jest.fn(
          (
            request: CreateInvitationRequest,
            callback:
              | Metadata
              | CallOptions
              | ((error: ServiceError | null, response?: CreateInvitationResponse) => void),
          ): SurfaceCall => {
            if (typeof callback === 'function') callback(null, {});
            return {} as SurfaceCall;
          },
        );

        jest.spyOn(sdk['client'], 'createInvitation').mockImplementation(mockFunc);

        result = await sdk.createEmailInvitation(invitee, tenantId, referenceId);
      });

      it('sends correct request', () => {
        expect(sdk['client'].createInvitation).toBeCalledTimes(1);
        expect(sdk['client'].createInvitation).toBeCalledWith(
          {
            invitee: {
              email: invitee,
              oneofKind: 'email',
            },
            referenceId,
            tenantId,
          },
          expect.any(Function),
        );
      });

      it('returns nothing', () => {
        expect(result).toBeUndefined();
      });
    });

    describe('when the response contains an error', () => {
      const invitee = 'user@exmaple.com';
      const tenantId = generateRandomGID();
      const referenceId = '123321';
      const error = {
        code: Status.NOT_FOUND,
        details: 'no details',
        metadata: {},
      } as ServiceError;
      let caughtError: unknown;

      beforeEach(async () => {
        const mockFunc = jest.fn(
          (
            request: CreateInvitationRequest,
            callback:
              | Metadata
              | CallOptions
              | ((error: ServiceError | null, response?: CreateInvitationResponse) => void),
          ): SurfaceCall => {
            if (typeof callback === 'function') callback(error);
            return {} as SurfaceCall;
          },
        );

        jest.spyOn(sdk['client'], 'createInvitation').mockImplementation(mockFunc);

        try {
          await sdk.createEmailInvitation(invitee, tenantId, referenceId);
        } catch (err) {
          caughtError = err;
        }
      });

      it('throws the error', () => {
        expect(caughtError).toBe(error);
      });
    });
  });

  describe('when all parameters are used', () => {
    const invitee = 'user@exmaple.com';
    const tenantId = generateRandomGID();
    const referenceId = '123321';
    const expireTime = new Date('2022-05-19T08:38:31Z');
    const invitationTime = new Date('2022-04-19T08:38:31Z');
    const messageAttributes = {
      testNumber: 42,
      testNull: null,
      testArray: [44],
      testMap: { testNestedDate: new Date('2022-05-21T07:37:42Z') },
    };
    let result: unknown;

    beforeEach(async () => {
      const mockFunc = jest.fn(
        (
          request: CreateInvitationRequest,
          callback:
            | Metadata
            | CallOptions
            | ((error: ServiceError | null, response?: CreateInvitationResponse) => void),
        ): SurfaceCall => {
          if (typeof callback === 'function') callback(null, {});
          return {} as SurfaceCall;
        },
      );

      jest.spyOn(sdk['client'], 'createInvitation').mockImplementation(mockFunc);

      result = await sdk.createEmailInvitation(
        invitee,
        tenantId,
        referenceId,
        expireTime,
        invitationTime,
        messageAttributes,
      );
    });

    it('sends correct request', () => {
      expect(sdk['client'].createInvitation).toBeCalledTimes(1);
      expect(sdk['client'].createInvitation).toBeCalledWith(
        {
          invitee: {
            email: invitee,
            oneofKind: 'email',
          },
          referenceId,
          tenantId,
          expireTime: Utils.dateToTimestamp(expireTime),
          inviteAtTime: Utils.dateToTimestamp(invitationTime),
          messageAttributes: {
            fields: {
              testNumber: {
                value: {
                  oneofKind: 'doubleValue',
                  doubleValue: 42,
                },
              },
              testNull: {
                value: {
                  oneofKind: 'nullValue',
                  nullValue: NullValue.NULL_VALUE,
                },
              },
              testArray: {
                value: {
                  oneofKind: 'arrayValue',
                  arrayValue: {
                    values: [
                      {
                        value: {
                          oneofKind: 'doubleValue',
                          doubleValue: 44,
                        },
                      },
                    ],
                  },
                },
              },
              testMap: {
                value: {
                  oneofKind: 'mapValue',
                  mapValue: {
                    fields: {
                      testNestedDate: {
                        value: {
                          oneofKind: 'valueTime',
                          valueTime: {
                            nanos: 0,
                            seconds: '1653118662',
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        expect.any(Function),
      );
    });

    it('returns nothing', () => {
      expect(result).toBeUndefined();
    });
  });
});

describe('createMobileInvitation', () => {
  describe('when only necessary parameters are used', () => {
    describe('when the response is successful', () => {
      const invitee = '+421949949949';
      const tenantId = generateRandomGID();
      const referenceId = '123321';
      let result: unknown;

      beforeEach(async () => {
        const mockFunc = jest.fn(
          (
            request: CreateInvitationRequest,
            callback:
              | Metadata
              | CallOptions
              | ((error: ServiceError | null, response?: CreateInvitationResponse) => void),
          ): SurfaceCall => {
            if (typeof callback === 'function') callback(null, {});
            return {} as SurfaceCall;
          },
        );

        jest.spyOn(sdk['client'], 'createInvitation').mockImplementation(mockFunc);

        result = await sdk.createMobileInvitation(invitee, tenantId, referenceId);
      });

      it('sends correct request', () => {
        expect(sdk['client'].createInvitation).toBeCalledTimes(1);
        expect(sdk['client'].createInvitation).toBeCalledWith(
          {
            invitee: {
              mobile: invitee,
              oneofKind: 'mobile',
            },
            referenceId,
            tenantId,
          },
          expect.any(Function),
        );
      });

      it('returns nothing', () => {
        expect(result).toBeUndefined();
      });
    });

    describe('when the response contains an error', () => {
      const invitee = '+421949949949';
      const tenantId = generateRandomGID();
      const referenceId = '123321';
      const error = {
        code: Status.NOT_FOUND,
        details: 'no details',
        metadata: {},
      } as ServiceError;
      let caughtError: unknown;

      beforeEach(async () => {
        const mockFunc = jest.fn(
          (
            request: CreateInvitationRequest,
            callback:
              | Metadata
              | CallOptions
              | ((error: ServiceError | null, response?: CreateInvitationResponse) => void),
          ): SurfaceCall => {
            if (typeof callback === 'function') callback(error);
            return {} as SurfaceCall;
          },
        );

        jest.spyOn(sdk['client'], 'createInvitation').mockImplementation(mockFunc);

        try {
          await sdk.createEmailInvitation(invitee, tenantId, referenceId);
        } catch (err) {
          caughtError = err;
        }
      });

      it('throws the error', () => {
        expect(caughtError).toBe(error);
      });
    });
  });

  describe('when all parameters are used', () => {
    const invitee = '+421949949949';
    const tenantId = generateRandomGID();
    const referenceId = '123321';
    const expireTime = new Date('2022-05-19T08:38:31Z');
    const invitationTime = new Date('2022-04-19T08:38:31Z');
    const messageAttributes = {
      testNumber: 42,
    };
    let result: unknown;

    beforeEach(async () => {
      const mockFunc = jest.fn(
        (
          request: CreateInvitationRequest,
          callback:
            | Metadata
            | CallOptions
            | ((error: ServiceError | null, response?: CreateInvitationResponse) => void),
        ): SurfaceCall => {
          if (typeof callback === 'function') callback(null, {});
          return {} as SurfaceCall;
        },
      );

      jest.spyOn(sdk['client'], 'createInvitation').mockImplementation(mockFunc);

      result = await sdk.createMobileInvitation(
        invitee,
        tenantId,
        referenceId,
        expireTime,
        invitationTime,
        messageAttributes,
      );
    });

    it('sends correct request', () => {
      expect(sdk['client'].createInvitation).toBeCalledTimes(1);
      expect(sdk['client'].createInvitation).toBeCalledWith(
        {
          invitee: {
            mobile: invitee,
            oneofKind: 'mobile',
          },
          referenceId,
          tenantId,
          expireTime: Utils.dateToTimestamp(expireTime),
          inviteAtTime: Utils.dateToTimestamp(invitationTime),
          messageAttributes: {
            fields: {
              testNumber: {
                value: {
                  oneofKind: 'doubleValue',
                  doubleValue: 42,
                },
              },
            },
          },
        },
        expect.any(Function),
      );
    });

    it('returns nothing', () => {
      expect(result).toBeUndefined();
    });
  });
});

describe('checkInvitationState', () => {
  describe('when the response is successful', () => {
    describe('when a reference ID is used', () => {
      const referenceId = '123321';
      const tenantId = generateRandomGID();
      let result: Invitation;

      beforeEach(async () => {
        const mockFunc = jest.fn(
          (
            request: CheckInvitationStateRequest,
            callback:
              | Metadata
              | CallOptions
              | ((error: ServiceError | null, response?: CheckInvitationStateResponse) => void),
          ): SurfaceCall => {
            if (typeof callback === 'function')
              callback(null, {
                invitation: {
                  invitee: {
                    oneofKind: 'email',
                    email: 'user@example.com',
                  },
                  referenceId: '654321',
                  state: InvitationState.ACCEPTED,
                  tenantId,
                },
              });
            return {} as SurfaceCall;
          },
        );

        jest.spyOn(sdk['client'], 'checkInvitationState').mockImplementation(mockFunc);

        result = await sdk.checkInvitationState({ referenceId });
      });

      it('sends correct request', () => {
        expect(sdk['client'].checkInvitationState).toBeCalledTimes(1);
        expect(sdk['client'].checkInvitationState).toBeCalledWith(
          {
            identifier: {
              oneofKind: 'referenceId',
              referenceId,
            },
          },
          expect.any(Function),
        );
      });

      it('returns Invitation instance', () => {
        expect(result).toBeDefined();
        expect(result.invitee).toBe('user@example.com');
        expect(result.referenceId).toBe('654321');
        expect(result.state).toBe(InvitationState.ACCEPTED);
        expect(result.tenantId).toBe(tenantId);
      });
    });

    describe('when a invitation token is used', () => {
      const invitationToken = '789789';
      const tenantId = generateRandomGID();
      let result: Invitation;

      beforeEach(async () => {
        const mockFunc = jest.fn(
          (
            request: CheckInvitationStateRequest,
            callback:
              | Metadata
              | CallOptions
              | ((error: ServiceError | null, response?: CheckInvitationStateResponse) => void),
          ): SurfaceCall => {
            if (typeof callback === 'function')
              callback(null, {
                invitation: {
                  invitee: {
                    oneofKind: 'email',
                    email: 'user@example.com',
                  },
                  referenceId: '654321',
                  state: InvitationState.EXPIRED,
                  tenantId,
                },
              });
            return {} as SurfaceCall;
          },
        );

        jest.spyOn(sdk['client'], 'checkInvitationState').mockImplementation(mockFunc);

        result = await sdk.checkInvitationState({ invitationToken });
      });

      it('sends correct request', () => {
        expect(sdk['client'].checkInvitationState).toBeCalledTimes(1);
        expect(sdk['client'].checkInvitationState).toBeCalledWith(
          {
            identifier: {
              oneofKind: 'invitationToken',
              invitationToken,
            },
          },
          expect.any(Function),
        );
      });

      it('returns Invitation instance', () => {
        expect(result).toBeDefined();
        expect(result.invitee).toBe('user@example.com');
        expect(result.referenceId).toBe('654321');
        expect(result.state).toBe(InvitationState.EXPIRED);
        expect(result.tenantId).toBe(tenantId);
      });
    });

    describe('when no token is used', () => {
      const tenantId = generateRandomGID();
      let caughtError: unknown;

      beforeEach(async () => {
        const mockFunc = jest.fn(
          (
            request: CheckInvitationStateRequest,
            callback:
              | Metadata
              | CallOptions
              | ((error: ServiceError | null, response?: CheckInvitationStateResponse) => void),
          ): SurfaceCall => {
            if (typeof callback === 'function')
              callback(null, {
                invitation: {
                  invitee: {
                    oneofKind: 'email',
                    email: 'user@example.com',
                  },
                  referenceId: '654321',
                  state: InvitationState.EXPIRED,
                  tenantId,
                },
              });
            return {} as SurfaceCall;
          },
        );

        jest.spyOn(sdk['client'], 'checkInvitationState').mockImplementation(mockFunc);

        try {
          await sdk.checkInvitationState({});
        } catch (err) {
          caughtError = err;
        }
      });

      it('sends no request', () => {
        expect(sdk['client'].checkInvitationState).toBeCalledTimes(0);
      });

      it('throws an error', () => {
        expect(caughtError).toHaveProperty(
          'message',
          'You have not specified neither reference ID nor invitation token',
        );
      });
    });

    describe('when both tokens are used', () => {
      const tenantId = generateRandomGID();
      const invitationToken = '789789';
      const referenceId = '123321';
      let caughtError: unknown;

      beforeEach(async () => {
        const mockFunc = jest.fn(
          (
            request: CheckInvitationStateRequest,
            callback:
              | Metadata
              | CallOptions
              | ((error: ServiceError | null, response?: CheckInvitationStateResponse) => void),
          ): SurfaceCall => {
            if (typeof callback === 'function')
              callback(null, {
                invitation: {
                  invitee: {
                    oneofKind: 'email',
                    email: 'user@example.com',
                  },
                  referenceId: '654321',
                  state: InvitationState.EXPIRED,
                  tenantId,
                },
              });
            return {} as SurfaceCall;
          },
        );

        jest.spyOn(sdk['client'], 'checkInvitationState').mockImplementation(mockFunc);

        try {
          await sdk.checkInvitationState({ invitationToken, referenceId });
        } catch (err) {
          caughtError = err;
        }
      });

      it('sends no request', () => {
        expect(sdk['client'].checkInvitationState).toBeCalledTimes(0);
      });

      it('throws an error', () => {
        expect(caughtError).toHaveProperty(
          'message',
          'You can not specify both the reference ID and the invitation token',
        );
      });
    });
  });

  describe('when the response does not have any content', () => {
    const referenceId = '123321';
    let caughtError: unknown;

    beforeEach(async () => {
      const mockFunc = jest.fn(
        (
          request: CheckInvitationStateRequest,
          callback:
            | Metadata
            | CallOptions
            | ((error: ServiceError | null, response?: CheckInvitationStateResponse) => void),
        ): SurfaceCall => {
          if (typeof callback === 'function') callback(null);
          return {} as SurfaceCall;
        },
      );

      jest.spyOn(sdk['client'], 'checkInvitationState').mockImplementation(mockFunc);

      try {
        await sdk.checkInvitationState({ referenceId });
      } catch (err) {
        caughtError = err;
      }
    });

    it('throws the error', () => {
      expect(caughtError).toHaveProperty('message', 'Missing check invitation response');
    });
  });

  describe('when the response contains an error', () => {
    const referenceId = '123321';
    const error = {
      code: Status.NOT_FOUND,
      details: 'no details',
      metadata: {},
    } as ServiceError;
    let caughtError: unknown;

    beforeEach(async () => {
      const mockFunc = jest.fn(
        (
          request: CheckInvitationStateRequest,
          callback:
            | Metadata
            | CallOptions
            | ((error: ServiceError | null, response?: CheckInvitationStateResponse) => void),
        ): SurfaceCall => {
          if (typeof callback === 'function') callback(error);
          return {} as SurfaceCall;
        },
      );

      jest.spyOn(sdk['client'], 'checkInvitationState').mockImplementation(mockFunc);

      try {
        await sdk.checkInvitationState({ referenceId });
      } catch (err) {
        caughtError = err;
      }
    });

    it('throws the error', () => {
      expect(caughtError).toBe(error);
    });
  });
});

describe('resendInvitation', () => {
  describe('when the response is successful', () => {
    const referenceId = '123321';
    let result: unknown;

    beforeEach(async () => {
      const mockFunc = jest.fn(
        (
          request: ResendInvitationRequest,
          callback:
            | Metadata
            | CallOptions
            | ((error: ServiceError | null, response?: ResendInvitationResponse) => void),
        ): SurfaceCall => {
          if (typeof callback === 'function') callback(null, {});
          return {} as SurfaceCall;
        },
      );

      jest.spyOn(sdk['client'], 'resendInvitation').mockImplementation(mockFunc);

      result = await sdk.resendInvitation(referenceId);
    });

    it('sends correct request', () => {
      expect(sdk['client'].resendInvitation).toBeCalledTimes(1);
      expect(sdk['client'].resendInvitation).toBeCalledWith(
        {
          referenceId,
        },
        expect.any(Function),
      );
    });

    it('returns nothing', () => {
      expect(result).toBeUndefined();
    });
  });

  describe('when the response contains an error', () => {
    const referenceId = '123321';
    const error = {
      code: Status.NOT_FOUND,
      details: 'no details',
      metadata: {},
    } as ServiceError;
    let caughtError: unknown;

    beforeEach(async () => {
      const mockFunc = jest.fn(
        (
          request: ResendInvitationRequest,
          callback:
            | Metadata
            | CallOptions
            | ((error: ServiceError | null, response?: ResendInvitationResponse) => void),
        ): SurfaceCall => {
          if (typeof callback === 'function') callback(error);
          return {} as SurfaceCall;
        },
      );

      jest.spyOn(sdk['client'], 'resendInvitation').mockImplementation(mockFunc);

      try {
        await sdk.resendInvitation(referenceId);
      } catch (err) {
        caughtError = err;
      }
    });

    it('throws the error', () => {
      expect(caughtError).toBe(error);
    });
  });
});

describe('cancelInvitation', () => {
  describe('when the response is successful', () => {
    const referenceId = '123321';
    let result: unknown;

    beforeEach(async () => {
      const mockFunc = jest.fn(
        (
          request: CancelInvitationRequest,
          callback:
            | Metadata
            | CallOptions
            | ((error: ServiceError | null, response?: CancelInvitationResponse) => void),
        ): SurfaceCall => {
          if (typeof callback === 'function') callback(null, {});
          return {} as SurfaceCall;
        },
      );

      jest.spyOn(sdk['client'], 'cancelInvitation').mockImplementation(mockFunc);

      result = await sdk.cancelInvitation(referenceId);
    });

    it('sends correct request', () => {
      expect(sdk['client'].cancelInvitation).toBeCalledTimes(1);
      expect(sdk['client'].cancelInvitation).toBeCalledWith(
        {
          referenceId,
        },
        expect.any(Function),
      );
    });

    it('returns nothing', () => {
      expect(result).toBeUndefined();
    });
  });

  describe('when the response contains an error', () => {
    const referenceId = '123321';
    const error = {
      code: Status.NOT_FOUND,
      details: 'no details',
      metadata: {},
    } as ServiceError;
    let caughtError: unknown;

    beforeEach(async () => {
      const mockFunc = jest.fn(
        (
          request: CancelInvitationRequest,
          callback:
            | Metadata
            | CallOptions
            | ((error: ServiceError | null, response?: CancelInvitationResponse) => void),
        ): SurfaceCall => {
          if (typeof callback === 'function') callback(error);
          return {} as SurfaceCall;
        },
      );

      jest.spyOn(sdk['client'], 'cancelInvitation').mockImplementation(mockFunc);

      try {
        await sdk.cancelInvitation(referenceId);
      } catch (err) {
        caughtError = err;
      }
    });

    it('throws the error', () => {
      expect(caughtError).toBe(error);
    });
  });
});
