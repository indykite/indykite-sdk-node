import { ListPermissionsResponse } from '../../../../grpc/indykite/config/v1beta1/config_management_api';
import { PermissionsList } from '../permissions';

const listPermissionsResponse: ListPermissionsResponse = {
  users: [
    {
      id: 'user-id',
      roles: [
        {
          id: 'user-role-id',
          displayName: 'Edit',
        },
      ],
    },
  ],
  serviceAccounts: [
    {
      id: 'service-account-id',
      name: 'service-account-name',
      roles: [
        {
          id: 'service-account-role-id',
          displayName: 'View',
        },
      ],
    },
  ],
  invitations: [
    {
      id: 'invitation-id',
      invitee: 'user@example.com',
      roles: [
        {
          id: 'invitation-id',
          displayName: 'Edit',
        },
      ],
    },
  ],
};

describe('deserialize', () => {
  let permissionsList: PermissionsList;

  beforeEach(() => {
    permissionsList = PermissionsList.deserialize(listPermissionsResponse);
  });

  it('creates a correct instance', () => {
    expect(permissionsList).toEqual({
      users: [
        {
          id: 'user-id',
          roles: [
            {
              id: 'user-role-id',
              displayName: 'Edit',
            },
          ],
        },
      ],
      serviceAccounts: [
        {
          id: 'service-account-id',
          name: 'service-account-name',
          roles: [
            {
              id: 'service-account-role-id',
              displayName: 'View',
            },
          ],
        },
      ],
      invitations: [
        {
          id: 'invitation-id',
          invitee: 'user@example.com',
          roles: [
            {
              id: 'invitation-id',
              displayName: 'Edit',
            },
          ],
        },
      ],
    });
  });
});
