import { CallOptions, Metadata } from '@grpc/grpc-js';
import { ServiceError, SurfaceCall } from '@grpc/grpc-js/build/src/call';
import { Status } from '@grpc/grpc-js/build/src/constants';
import { DeleteDigitalTwinResponse } from '../../../grpc/indykite/identity/v1beta2/identity_management_api';
import { IdentityClientV2 } from '../../identity_v2';
import { applicationTokenMock } from '../../utils/test_utils';
import {
  DigitalTwin,
  DigitalTwinKind,
  DigitalTwinState,
} from '../../../grpc/indykite/identity/v1beta2/model';

describe('deleteDigitalTwin', () => {
  describe('when no error is returned', () => {
    const deleteDigitalTwinResponse: DeleteDigitalTwinResponse = {
      digitalTwin: {
        id: 'digital-twin-id',
        tenantId: 'tenant-id',
        kind: DigitalTwinKind.PERSON,
        state: DigitalTwinState.ACTIVE,
        tags: [],
      },
    };
    let deleteDigitalTwinSpy: jest.SpyInstance;
    let sdk: IdentityClientV2;
    let response: DigitalTwin;

    beforeEach(async () => {
      sdk = await IdentityClientV2.createInstance(JSON.stringify(applicationTokenMock));
      deleteDigitalTwinSpy = jest
        .spyOn(sdk['client'], 'deleteDigitalTwin')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response: DeleteDigitalTwinResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(null, deleteDigitalTwinResponse);
            }
            return {} as SurfaceCall;
          },
        );
      response = await sdk.deleteDigitalTwin({
        id: 'digital-twin-id',
        tenantId: 'tenant-id',
        kind: DigitalTwinKind.PERSON,
        state: DigitalTwinState.ACTIVE,
        tags: [],
      });
    });

    it('sends correct request', () => {
      expect(deleteDigitalTwinSpy).toBeCalledWith(
        {
          adminToken: '',
          id: {
            filter: {
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
        },
        expect.any(Function),
      );
    });

    it('gets correct response', () => {
      expect(response).toEqual(deleteDigitalTwinResponse.digitalTwin);
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
        .spyOn(sdk['client'], 'deleteDigitalTwin')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response?: DeleteDigitalTwinResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(error);
            }
            return {} as SurfaceCall;
          },
        );
      sdk
        .deleteDigitalTwin({
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

  describe('when no response is returned', () => {
    let thrownError: Error;

    beforeEach(async () => {
      const sdk = await IdentityClientV2.createInstance(JSON.stringify(applicationTokenMock));
      jest
        .spyOn(sdk['client'], 'deleteDigitalTwin')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response?: DeleteDigitalTwinResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(null);
            }
            return {} as SurfaceCall;
          },
        );
      sdk
        .deleteDigitalTwin({
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
      expect(thrownError.message).toBe('Missing delete response');
    });
  });
});

describe('deleteDigitalTwinByToken', () => {
  describe('when no error is returned', () => {
    const deleteDigitalTwinResponse: DeleteDigitalTwinResponse = {
      digitalTwin: {
        id: 'digital-twin-id',
        tenantId: 'tenant-id',
        kind: DigitalTwinKind.PERSON,
        state: DigitalTwinState.ACTIVE,
        tags: [],
      },
    };
    let deleteDigitalTwinSpy: jest.SpyInstance;
    let sdk: IdentityClientV2;
    let response: DigitalTwin;

    beforeEach(async () => {
      sdk = await IdentityClientV2.createInstance(JSON.stringify(applicationTokenMock));
      deleteDigitalTwinSpy = jest
        .spyOn(sdk['client'], 'deleteDigitalTwin')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response: DeleteDigitalTwinResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(null, deleteDigitalTwinResponse);
            }
            return {} as SurfaceCall;
          },
        );
      response = await sdk.deleteDigitalTwinByToken('access-token');
    });

    it('sends correct request', () => {
      expect(deleteDigitalTwinSpy).toBeCalledWith(
        {
          adminToken: '',
          id: {
            filter: {
              oneofKind: 'accessToken',
              accessToken: 'access-token',
            },
          },
        },
        expect.any(Function),
      );
    });

    it('gets correct response', () => {
      expect(response).toEqual(deleteDigitalTwinResponse.digitalTwin);
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
        .spyOn(sdk['client'], 'deleteDigitalTwin')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response?: DeleteDigitalTwinResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(error);
            }
            return {} as SurfaceCall;
          },
        );
      sdk.deleteDigitalTwinByToken('access-token').catch((err) => {
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
        .spyOn(sdk['client'], 'deleteDigitalTwin')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response?: DeleteDigitalTwinResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(null);
            }
            return {} as SurfaceCall;
          },
        );
      sdk.deleteDigitalTwinByToken('access-token').catch((err) => {
        thrownError = err;
      });
    });

    it('throws an error', () => {
      expect(thrownError.message).toBe('Missing delete response');
    });
  });
});
