import { DigitalTwin } from '.';
import * as grpcId from '../../grpc/indykite/identity/v1beta2/identity_management_api';
import { MapValue, Value } from '../../grpc/indykite/objects/v1beta1/struct';
import { SdkError, SdkErrorCode } from '../error';
import { Utils } from '../utils/utils';

export enum InvitationState {
  INVALID = 0,
  IN_FUTURE = 1,
  PENDING = 2,
  ACCEPTED = 3,
  EXPIRED = 4,
  CANCELLED = 5,
}

export class Invitation {
  acceptedBy?: DigitalTwin;
  expireDate?: Date;
  inviteDate?: Date;
  messageAttributes?: unknown;

  constructor(
    public tenantId: string,
    public referenceId: string,
    public state: InvitationState,
    public invitee: string,
  ) {}

  static deserialize(invitationResponse: grpcId.CheckInvitationStateResponse): Invitation {
    if (!invitationResponse.invitation) {
      throw new SdkError(SdkErrorCode.SDK_CODE_1, "Can't deserialize invitation");
    }

    let invitee = '';
    switch (invitationResponse.invitation.invitee.oneofKind) {
      case 'email':
        invitee = invitationResponse.invitation.invitee.email;
        break;
      case 'mobile':
        invitee = invitationResponse.invitation.invitee.mobile;
        break;
    }

    const invitation = new Invitation(
      invitationResponse.invitation.tenantId,
      invitationResponse.invitation.referenceId,
      invitationResponse.invitation.state,
      invitee,
    );

    if (invitationResponse.invitation.expireTime) {
      invitation.expireDate = Utils.timestampToDate(invitationResponse.invitation.expireTime);
    }

    if (invitationResponse.invitation.inviteAtTime) {
      invitation.inviteDate = Utils.timestampToDate(invitationResponse.invitation.inviteAtTime);
    }

    if (invitationResponse.invitation.acceptedBy) {
      const acceptedBy = invitationResponse.invitation.acceptedBy;
      invitation.acceptedBy = new DigitalTwin(
        acceptedBy.id,
        acceptedBy.tenantId,
        acceptedBy.kind,
        acceptedBy.state,
        acceptedBy.tags,
      );
    }

    if (
      invitationResponse.invitation.messageAttributes &&
      MapValue.is(invitationResponse.invitation.messageAttributes)
    ) {
      invitation.messageAttributes = Utils.deserializeValue(
        Value.create({
          value: {
            oneofKind: 'mapValue',
            mapValue: invitationResponse.invitation.messageAttributes,
          },
        }),
      );
    }

    return invitation;
  }
}
