import { CallOptions, Metadata } from '@grpc/grpc-js';
import { ServiceError, SurfaceCall } from '@grpc/grpc-js/build/src/call';
import { Status } from '@grpc/grpc-js/build/src/constants';
import {
  AssignPermissionsResponse,
  ListPermissionsResponse,
  RevokePermissionsResponse,
} from '../../../grpc/indykite/config/v1beta1/config_management_api';
import { ConfigClient } from '../../config';
import { serviceAccountTokenMock } from '../../utils/test_utils';
import { PermissionsList } from '../../model';

describe('assignPermission', () => {
  describe('when no error is returned', () => {
    let assignPermissionSpy: jest.SpyInstance;
    let sdk: ConfigClient;
    let returnedValue: boolean;

    beforeEach(async () => {
      sdk = await ConfigClient.createInstance(JSON.stringify(serviceAccountTokenMock));
      assignPermissionSpy = jest
        .spyOn(sdk['client'], 'assignPermissions')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response: AssignPermissionsResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(null, {
                success: true,
              });
            }
            return {} as SurfaceCall;
          },
        );
      returnedValue = await sdk.assignPermission(
        'target-id',
        'role-name',
        'customer-id',
        'object-id',
      );
    });

    it('sends correct request', () => {
      expect(assignPermissionSpy).toBeCalledWith(
        {
          customerId: 'customer-id',
          objectId: 'object-id',
          role: 'role-name',
          targetIdentifier: 'target-id',
        },
        expect.any(Function),
      );
    });

    it('returns a correct value', () => {
      expect(returnedValue).toBe(true);
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
        .spyOn(sdk['client'], 'assignPermissions')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response?: AssignPermissionsResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(error);
            }
            return {} as SurfaceCall;
          },
        );
      sdk.assignPermission('target-id', 'role-name', 'customer-id', 'object-id').catch((err) => {
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
        .spyOn(sdk['client'], 'assignPermissions')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response?: AssignPermissionsResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(null);
            }
            return {} as SurfaceCall;
          },
        );
      sdk.assignPermission('target-id', 'role-name', 'customer-id', 'object-id').catch((err) => {
        thrownError = err;
      });
    });

    it('throws an error', () => {
      expect(thrownError.message).toBe('No assign permissions response');
    });
  });
});

describe('revokePermission', () => {
  describe('when no error is returned', () => {
    let revokePermissionSpy: jest.SpyInstance;
    let sdk: ConfigClient;
    let returnedValue: boolean;

    beforeEach(async () => {
      sdk = await ConfigClient.createInstance(JSON.stringify(serviceAccountTokenMock));
      revokePermissionSpy = jest
        .spyOn(sdk['client'], 'revokePermissions')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response: RevokePermissionsResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(null, {
                success: false,
              });
            }
            return {} as SurfaceCall;
          },
        );
      returnedValue = await sdk.revokePermission(
        'target-id',
        'role-name',
        'customer-id',
        'object-id',
      );
    });

    it('sends correct request', () => {
      expect(revokePermissionSpy).toBeCalledWith(
        {
          customerId: 'customer-id',
          objectId: 'object-id',
          role: 'role-name',
          targetIdentifier: 'target-id',
        },
        expect.any(Function),
      );
    });

    it('returns a correct value', () => {
      expect(returnedValue).toBe(false);
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
        .spyOn(sdk['client'], 'revokePermissions')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response?: RevokePermissionsResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(error);
            }
            return {} as SurfaceCall;
          },
        );
      sdk.revokePermission('target-id', 'role-name', 'customer-id', 'object-id').catch((err) => {
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
        .spyOn(sdk['client'], 'revokePermissions')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response?: RevokePermissionsResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(null);
            }
            return {} as SurfaceCall;
          },
        );
      sdk.revokePermission('target-id', 'role-name', 'customer-id', 'object-id').catch((err) => {
        thrownError = err;
      });
    });

    it('throws an error', () => {
      expect(thrownError.message).toBe('No revoke permissions response');
    });
  });
});

describe('listPermissions', () => {
  describe('when no error is returned', () => {
    let listPermissionsSpy: jest.SpyInstance;
    let sdk: ConfigClient;
    let returnedValue: PermissionsList;

    beforeEach(async () => {
      sdk = await ConfigClient.createInstance(JSON.stringify(serviceAccountTokenMock));
      listPermissionsSpy = jest
        .spyOn(sdk['client'], 'listPermissions')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response: ListPermissionsResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(null, {
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
            }
            return {} as SurfaceCall;
          },
        );
      returnedValue = await sdk.listPermissions('location-id');
    });

    it('sends correct request', () => {
      expect(listPermissionsSpy).toBeCalledWith(
        {
          location: 'location-id',
        },
        expect.any(Function),
      );
    });

    it('returns a correct value', () => {
      expect(returnedValue).toEqual({
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
        .spyOn(sdk['client'], 'listPermissions')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response?: ListPermissionsResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(error);
            }
            return {} as SurfaceCall;
          },
        );
      sdk.listPermissions('location-id').catch((err) => {
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
        .spyOn(sdk['client'], 'listPermissions')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response?: ListPermissionsResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(null);
            }
            return {} as SurfaceCall;
          },
        );
      sdk.listPermissions('location-id').catch((err) => {
        thrownError = err;
      });
    });

    it('throws an error', () => {
      expect(thrownError.message).toBe('No list permissions response');
    });
  });
});
