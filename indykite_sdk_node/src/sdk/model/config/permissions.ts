import {
  ListPermissionsResponse,
  ListPermissionsResponse_PermissionRole,
} from '../../../grpc/indykite/config/v1beta1/config_management_api';

export class PermissionRole {
  constructor(
    public id: string,
    public displayName: string,
  ) {}

  static deserialize(role: ListPermissionsResponse_PermissionRole): PermissionRole {
    return new PermissionRole(role.id, role.displayName);
  }
}

export class Permission {
  constructor(
    public id: string,
    public roles: PermissionRole[],
  ) {}
}

export class UserPermission extends Permission {
  static deserialize(user: ListPermissionsResponse['users'][number]): UserPermission {
    return new UserPermission(user.id, user.roles.map(PermissionRole.deserialize));
  }
}

export class ServiceAccountPermission extends Permission {
  constructor(
    id: string,
    public name: string,
    roles: PermissionRole[],
  ) {
    super(id, roles);
  }

  static deserialize(
    serviceAccount: ListPermissionsResponse['serviceAccounts'][number],
  ): ServiceAccountPermission {
    return new ServiceAccountPermission(
      serviceAccount.id,
      serviceAccount.name,
      serviceAccount.roles.map(PermissionRole.deserialize),
    );
  }
}

export class InvitationPermission extends Permission {
  constructor(
    id: string,
    public invitee: string,
    roles: PermissionRole[],
  ) {
    super(id, roles);
  }

  static deserialize(
    invitation: ListPermissionsResponse['invitations'][number],
  ): InvitationPermission {
    return new InvitationPermission(
      invitation.id,
      invitation.invitee,
      invitation.roles.map(PermissionRole.deserialize),
    );
  }
}

export class PermissionsList {
  constructor(
    public users: UserPermission[],
    public serviceAccounts: ServiceAccountPermission[],
    public invitations: InvitationPermission[],
  ) {}

  static deserialize(response: ListPermissionsResponse): PermissionsList {
    return new PermissionsList(
      response.users.map(UserPermission.deserialize),
      response.serviceAccounts.map(ServiceAccountPermission.deserialize),
      response.invitations.map(InvitationPermission.deserialize),
    );
  }
}
