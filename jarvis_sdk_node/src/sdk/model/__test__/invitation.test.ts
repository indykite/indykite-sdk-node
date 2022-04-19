import { Invitation, InvitationState } from '../invitation';
import * as grpcId from '../../../grpc/indykite/identity/v1beta1/identity_management_api';
import { v4 } from 'uuid';
import { Utils } from '../../utils/utils';
import {
  DigitalTwinKind,
  DigitalTwinState,
  InvitationState as ModelInvitationState,
} from '../../../grpc/indykite/identity/v1beta1/model';

describe('deserialize', () => {
  describe('when no property is present', () => {
    let caughtError: unknown;

    beforeEach(() => {
      try {
        Invitation.deserialize({});
      } catch (err) {
        caughtError = err;
      }
    });

    it('throws an error', () => {
      expect(caughtError).toHaveProperty('message', "Can't deserialize invitation");
    });
  });

  describe('when only necessary properties are present', () => {
    const tenantId = v4();
    let instance: Invitation;

    beforeEach(() => {
      const serverResponse: grpcId.CheckInvitationStateResponse = {
        invitation: {
          invitee: {
            oneofKind: 'mobile',
            mobile: '+421949949949',
          },
          referenceId: '654321',
          state: InvitationState.PENDING,
          tenantId: Uint8Array.from(Utils.uuidToBuffer(tenantId)),
        },
      };

      instance = Invitation.deserialize(serverResponse);
    });

    it('creates a correct instance', () => {
      expect(instance).toBeDefined();
      expect(instance.invitee).toBe('+421949949949');
      expect(instance.referenceId).toBe('654321');
      expect(instance.state).toBe(ModelInvitationState.PENDING);
      expect(instance.tenantId).toBe(tenantId);
      expect(instance.acceptedBy).toBe(undefined);
      expect(instance.expireDate).toBe(undefined);
      expect(instance.inviteDate).toBe(undefined);
      expect(instance.messageAttributes).toBe(undefined);
    });
  });

  describe('when all properties are present', () => {
    const tenantId = v4();
    const acceptedById = v4();
    const expireTime = new Date('2022-05-19T08:38:31Z');
    const inviteTime = new Date('2022-04-19T08:38:31Z');
    let instance: Invitation;

    beforeEach(() => {
      const serverResponse: grpcId.CheckInvitationStateResponse = {
        invitation: {
          invitee: {
            oneofKind: 'email',
            email: 'user@example.com',
          },
          referenceId: '654321',
          state: InvitationState.PENDING,
          tenantId: Uint8Array.from(Utils.uuidToBuffer(tenantId)),
          acceptedBy: {
            kind: DigitalTwinKind.PERSON,
            id: Uint8Array.from(Utils.uuidToBuffer(acceptedById)),
            state: DigitalTwinState.ACTIVE,
            tenantId: Uint8Array.from(Utils.uuidToBuffer(tenantId)),
          },
          expireTime: Utils.dateToTimestamp(expireTime),
          inviteAtTime: Utils.dateToTimestamp(inviteTime),
          messageAttributes: {
            fields: {
              custom: {
                value: {
                  oneofKind: 'stringValue',
                  stringValue: 'message',
                },
              },
            },
          },
        },
      };

      instance = Invitation.deserialize(serverResponse);
    });

    it('creates a correct instance', () => {
      expect(instance).toBeDefined();
      expect(instance.acceptedBy).toBeDefined();
      expect(instance.invitee).toBe('user@example.com');
      expect(instance.referenceId).toBe('654321');
      expect(instance.state).toBe(ModelInvitationState.PENDING);
      expect(instance.tenantId).toBe(tenantId);
      expect(instance.expireDate).toEqual(expireTime);
      expect(instance.inviteDate).toEqual(inviteTime);
      expect(instance.messageAttributes).toEqual({ custom: 'message' });
      expect(instance.acceptedBy?.id).toBe(acceptedById);
      expect(instance.acceptedBy?.kind).toBe(DigitalTwinKind.PERSON);
      expect(instance.acceptedBy?.state).toBe(DigitalTwinState.ACTIVE);
      expect(instance.acceptedBy?.tenantId).toBe(tenantId);
    });
  });
});
