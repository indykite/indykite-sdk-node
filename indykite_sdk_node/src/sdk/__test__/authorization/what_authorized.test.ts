import {
  AuthorizationClient,
  AuthorizationResourceType,
  WhatAuthorizedResponse,
} from '../../authorization';
import { ServiceError, SurfaceCall } from '@grpc/grpc-js/build/src/call';
import {
  WhatAuthorizedRequest as grpcWhatAuthorizedRequest,
  WhatAuthorizedResponse as grpcWhatAuthorizedResponse,
} from '../../../grpc/indykite/authorization/v1beta1/authorization_service';
import { CallOptions, Metadata } from '@grpc/grpc-js';
import { Utils } from '../../utils/utils';
import { applicationTokenMock } from '../../utils/test_utils';
import { DigitalTwinCore } from '../../model';
import { DigitalTwinKind, DigitalTwinState } from '../../../grpc/indykite/identity/v1beta2/model';
import { PropertyFilter } from '../../authorization';

let sdk: AuthorizationClient;

beforeAll(async () => {
  sdk = await AuthorizationClient.createInstance(applicationTokenMock);
});

afterEach(() => {
  jest.resetAllMocks();
});

describe('whatAuthorized', () => {
  const subject = new DigitalTwinCore(
    'digitaltwin-id',
    'tenant-id',
    DigitalTwinKind.PERSON,
    DigitalTwinState.ACTIVE,
  );

  describe('when the response does not contain an error', () => {
    const resources: AuthorizationResourceType[] = [
      {
        type: 'ParkingLot',
        actions: ['HAS_FREE_PARKING'],
      },
      {
        type: 'ParkingLot',
        actions: ['HAS_FREE_PARKING'],
      },
    ];
    const decisionsResult: grpcWhatAuthorizedResponse = {
      decisions: {
        ParkingLot: {
          actions: {
            HAS_FREE_PARKING: {
              resources: [
                {
                  externalId: 'parking-lot-id1',
                },
              ],
            },
          },
        },
      },
      decisionTime: Utils.dateToTimestamp(new Date()),
    };
    let result: WhatAuthorizedResponse;

    beforeEach(async () => {
      const mockFunc = jest.fn(
        (
          request: grpcWhatAuthorizedRequest,
          callback:
            | Metadata
            | CallOptions
            | ((error: ServiceError | null, response?: grpcWhatAuthorizedResponse) => void),
        ): SurfaceCall => {
          if (typeof callback === 'function') callback(null, decisionsResult);
          return {} as SurfaceCall;
        },
      );

      jest.spyOn(sdk['client'], 'whatAuthorized').mockImplementation(mockFunc);

      result = await sdk.whatAuthorized(subject, resources);
    });

    it('sends a correct request', () => {
      expect(sdk['client'].whatAuthorized).toBeCalledTimes(1);
      expect(sdk['client'].whatAuthorized).toBeCalledWith(
        {
          options: {},
          subject: {
            subject: {
              oneofKind: 'digitalTwinIdentifier',
              digitalTwinIdentifier: {
                filter: {
                  oneofKind: 'digitalTwin',
                  digitalTwin: {
                    id: 'digitaltwin-id',
                    tenantId: 'tenant-id',
                    kind: DigitalTwinKind.PERSON,
                    state: DigitalTwinState.ACTIVE,
                    tags: [],
                  },
                },
              },
            },
          },
          resourceTypes: [
            {
              type: 'ParkingLot',
              actions: ['HAS_FREE_PARKING'],
            },
            {
              type: 'ParkingLot',
              actions: ['HAS_FREE_PARKING'],
            },
          ],
        },
        expect.any(Function),
      );
    });

    it('returns a correct response', () => {
      expect(result.decisionTime).toEqual(Utils.timestampToDate(decisionsResult.decisionTime));
      expect(result.decisions).toEqual({
        ParkingLot: {
          actions: {
            HAS_FREE_PARKING: {
              resources: [
                {
                  externalId: 'parking-lot-id1',
                },
              ],
            },
          },
        },
      });
    });
  });

  describe('when the response does not contain any value', () => {
    const resources: AuthorizationResourceType[] = [
      {
        type: 'ParkingLot',
        actions: ['HAS_FREE_PARKING'],
      },
      {
        type: 'ParkingLot',
        actions: ['HAS_FREE_PARKING'],
      },
    ];
    let caughtError: unknown;

    beforeEach(async () => {
      const mockFunc = jest.fn(
        (
          request: grpcWhatAuthorizedRequest,
          callback:
            | Metadata
            | CallOptions
            | ((error: ServiceError | null, response?: grpcWhatAuthorizedResponse) => void),
        ): SurfaceCall => {
          if (typeof callback === 'function') callback(null);
          return {} as SurfaceCall;
        },
      );

      jest.spyOn(sdk['client'], 'whatAuthorized').mockImplementation(mockFunc);

      try {
        caughtError = undefined;
        await sdk.whatAuthorized(subject, resources);
      } catch (err) {
        caughtError = err;
      }
    });

    it('throws an error', () => {
      expect((caughtError as Error).message).toEqual('No data in whatAuthorized response');
    });
  });

  describe('when the response returns an error', () => {
    const resources: AuthorizationResourceType[] = [
      {
        type: 'ParkingLot',
        actions: ['HAS_FREE_PARKING'],
      },
      {
        type: 'ParkingLot',
        actions: ['HAS_FREE_PARKING'],
      },
    ];
    const error = new Error('Error mock') as ServiceError;
    let caughtError: unknown;

    beforeEach(async () => {
      const mockFunc = jest.fn(
        (
          request: grpcWhatAuthorizedRequest,
          callback:
            | Metadata
            | CallOptions
            | ((error: ServiceError | null, response?: grpcWhatAuthorizedResponse) => void),
        ): SurfaceCall => {
          if (typeof callback === 'function') callback(error);
          return {} as SurfaceCall;
        },
      );

      jest.spyOn(sdk['client'], 'whatAuthorized').mockImplementation(mockFunc);

      try {
        await sdk.whatAuthorized(subject, resources);
      } catch (err) {
        caughtError = err;
      }
    });

    it('returns an empty response', () => {
      expect(caughtError).toBe(error);
    });
  });
});

describe('isAuthorizedByToken', () => {
  const subject = 'access-token';

  describe('when the response does not contain an error', () => {
    const resources: AuthorizationResourceType[] = [
      {
        type: 'ParkingLot',
        actions: ['HAS_FREE_PARKING'],
      },
      {
        type: 'ParkingLot',
        actions: ['HAS_FREE_PARKING'],
      },
    ];
    const decisionsResult: grpcWhatAuthorizedResponse = {
      decisions: {
        ParkingLot: {
          actions: {
            HAS_FREE_PARKING: {
              resources: [
                {
                  externalId: 'parking-lot-id1',
                },
              ],
            },
          },
        },
      },
      decisionTime: Utils.dateToTimestamp(new Date()),
    };
    let result: WhatAuthorizedResponse;

    beforeEach(async () => {
      const mockFunc = jest.fn(
        (
          request: grpcWhatAuthorizedRequest,
          callback:
            | Metadata
            | CallOptions
            | ((error: ServiceError | null, response?: grpcWhatAuthorizedResponse) => void),
        ): SurfaceCall => {
          if (typeof callback === 'function') callback(null, decisionsResult);
          return {} as SurfaceCall;
        },
      );

      jest.spyOn(sdk['client'], 'whatAuthorized').mockImplementation(mockFunc);

      result = await sdk.whatAuthorizedByToken(subject, resources, {
        someOption: 'Some value',
      });
    });

    it('sends a correct request', () => {
      expect(sdk['client'].whatAuthorized).toBeCalledTimes(1);
      expect(sdk['client'].whatAuthorized).toBeCalledWith(
        {
          options: {
            someOption: {
              value: {
                oneofKind: 'stringValue',
                stringValue: 'Some value',
              },
            },
          },
          subject: {
            subject: {
              oneofKind: 'digitalTwinIdentifier',
              digitalTwinIdentifier: {
                filter: {
                  oneofKind: 'accessToken',
                  accessToken: 'access-token',
                },
              },
            },
          },
          resourceTypes: [
            {
              type: 'ParkingLot',
              actions: ['HAS_FREE_PARKING'],
            },
            {
              type: 'ParkingLot',
              actions: ['HAS_FREE_PARKING'],
            },
          ],
        },
        expect.any(Function),
      );
    });

    it('returns a correct response', () => {
      expect(result.decisionTime).toEqual(Utils.timestampToDate(decisionsResult.decisionTime));
      expect(result.decisions).toEqual({
        ParkingLot: {
          actions: {
            HAS_FREE_PARKING: {
              resources: [
                {
                  externalId: 'parking-lot-id1',
                },
              ],
            },
          },
        },
      });
    });
  });

  describe('when the response does not contain any value', () => {
    const resources: AuthorizationResourceType[] = [
      {
        type: 'ParkingLot',
        actions: ['HAS_FREE_PARKING'],
      },
      {
        type: 'ParkingLot',
        actions: ['HAS_FREE_PARKING'],
      },
    ];
    let caughtError: unknown;

    beforeEach(async () => {
      const mockFunc = jest.fn(
        (
          request: grpcWhatAuthorizedRequest,
          callback:
            | Metadata
            | CallOptions
            | ((error: ServiceError | null, response?: grpcWhatAuthorizedResponse) => void),
        ): SurfaceCall => {
          if (typeof callback === 'function') callback(null);
          return {} as SurfaceCall;
        },
      );

      jest.spyOn(sdk['client'], 'whatAuthorized').mockImplementation(mockFunc);

      try {
        caughtError = undefined;
        await sdk.whatAuthorizedByToken(subject, resources);
      } catch (err) {
        caughtError = err;
      }
    });

    it('throws an error', () => {
      expect((caughtError as Error).message).toEqual('No data in whatAuthorizedByToken response');
    });
  });

  describe('when the response returns an error', () => {
    const resources: AuthorizationResourceType[] = [
      {
        type: 'ParkingLot',
        actions: ['HAS_FREE_PARKING'],
      },
      {
        type: 'ParkingLot',
        actions: ['HAS_FREE_PARKING'],
      },
    ];
    const error = new Error('Error mock') as ServiceError;
    let caughtError: unknown;

    beforeEach(async () => {
      const mockFunc = jest.fn(
        (
          request: grpcWhatAuthorizedRequest,
          callback:
            | Metadata
            | CallOptions
            | ((error: ServiceError | null, response?: grpcWhatAuthorizedResponse) => void),
        ): SurfaceCall => {
          if (typeof callback === 'function') callback(error);
          return {} as SurfaceCall;
        },
      );

      jest.spyOn(sdk['client'], 'whatAuthorized').mockImplementation(mockFunc);

      try {
        await sdk.whatAuthorizedByToken(subject, resources);
      } catch (err) {
        caughtError = err;
      }
    });

    it('returns an empty response', () => {
      expect(caughtError).toBe(error);
    });
  });
});

describe('isAuthorizedByProperty', () => {
  const subject: PropertyFilter = {
    tenantId: 'tenant-id',
    type: 'email',
    value: 'user@example.com',
  };

  describe('when the response does not contain an error', () => {
    const resources: AuthorizationResourceType[] = [
      {
        type: 'ParkingLot',
        actions: ['HAS_FREE_PARKING'],
      },
      {
        type: 'ParkingLot',
        actions: ['HAS_FREE_PARKING'],
      },
    ];
    const decisionsResult: grpcWhatAuthorizedResponse = {
      decisions: {
        ParkingLot: {
          actions: {
            HAS_FREE_PARKING: {
              resources: [
                {
                  externalId: 'parking-lot-id1',
                },
              ],
            },
          },
        },
      },
      decisionTime: Utils.dateToTimestamp(new Date()),
    };
    let result: WhatAuthorizedResponse;

    beforeEach(async () => {
      const mockFunc = jest.fn(
        (
          request: grpcWhatAuthorizedRequest,
          callback:
            | Metadata
            | CallOptions
            | ((error: ServiceError | null, response?: grpcWhatAuthorizedResponse) => void),
        ): SurfaceCall => {
          if (typeof callback === 'function') callback(null, decisionsResult);
          return {} as SurfaceCall;
        },
      );

      jest.spyOn(sdk['client'], 'whatAuthorized').mockImplementation(mockFunc);

      result = await sdk.whatAuthorizedByProperty(subject, resources);
    });

    it('sends a correct request', () => {
      expect(sdk['client'].whatAuthorized).toBeCalledTimes(1);
      expect(sdk['client'].whatAuthorized).toBeCalledWith(
        {
          options: {},
          subject: {
            subject: {
              oneofKind: 'digitalTwinIdentifier',
              digitalTwinIdentifier: {
                filter: {
                  oneofKind: 'propertyFilter',
                  propertyFilter: {
                    tenantId: 'tenant-id',
                    type: 'email',
                    value: {
                      value: {
                        oneofKind: 'stringValue',
                        stringValue: 'user@example.com',
                      },
                    },
                  },
                },
              },
            },
          },
          resourceTypes: [
            {
              type: 'ParkingLot',
              actions: ['HAS_FREE_PARKING'],
            },
            {
              type: 'ParkingLot',
              actions: ['HAS_FREE_PARKING'],
            },
          ],
        },
        expect.any(Function),
      );
    });

    it('returns a correct response', () => {
      expect(result.decisionTime).toEqual(Utils.timestampToDate(decisionsResult.decisionTime));
      expect(result.decisions).toEqual({
        ParkingLot: {
          actions: {
            HAS_FREE_PARKING: {
              resources: [
                {
                  externalId: 'parking-lot-id1',
                },
              ],
            },
          },
        },
      });
    });
  });

  describe('when the response does not contain any value', () => {
    const resources: AuthorizationResourceType[] = [
      {
        type: 'ParkingLot',
        actions: ['HAS_FREE_PARKING'],
      },
      {
        type: 'ParkingLot',
        actions: ['HAS_FREE_PARKING'],
      },
    ];
    let caughtError: unknown;

    beforeEach(async () => {
      const mockFunc = jest.fn(
        (
          request: grpcWhatAuthorizedRequest,
          callback:
            | Metadata
            | CallOptions
            | ((error: ServiceError | null, response?: grpcWhatAuthorizedResponse) => void),
        ): SurfaceCall => {
          if (typeof callback === 'function') callback(null);
          return {} as SurfaceCall;
        },
      );

      jest.spyOn(sdk['client'], 'whatAuthorized').mockImplementation(mockFunc);

      try {
        caughtError = undefined;
        await sdk.whatAuthorizedByProperty(subject, resources);
      } catch (err) {
        caughtError = err;
      }
    });

    it('throws an error', () => {
      expect((caughtError as Error).message).toEqual(
        'No data in whatAuthorizedByProperty response',
      );
    });
  });

  describe('when the response returns an error', () => {
    const resources: AuthorizationResourceType[] = [
      {
        type: 'ParkingLot',
        actions: ['HAS_FREE_PARKING'],
      },
      {
        type: 'ParkingLot',
        actions: ['HAS_FREE_PARKING'],
      },
    ];
    const error = new Error('Error mock') as ServiceError;
    let caughtError: unknown;

    beforeEach(async () => {
      const mockFunc = jest.fn(
        (
          request: grpcWhatAuthorizedRequest,
          callback:
            | Metadata
            | CallOptions
            | ((error: ServiceError | null, response?: grpcWhatAuthorizedResponse) => void),
        ): SurfaceCall => {
          if (typeof callback === 'function') callback(error);
          return {} as SurfaceCall;
        },
      );

      jest.spyOn(sdk['client'], 'whatAuthorized').mockImplementation(mockFunc);

      try {
        await sdk.whatAuthorizedByProperty(subject, resources);
      } catch (err) {
        caughtError = err;
      }
    });

    it('returns an empty response', () => {
      expect(caughtError).toBe(error);
    });
  });
});
