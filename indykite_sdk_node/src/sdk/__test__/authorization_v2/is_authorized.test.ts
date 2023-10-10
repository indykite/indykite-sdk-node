import { AuthorizationClientV2 } from '../../authorization_v2';
import { ServiceError, SurfaceCall } from '@grpc/grpc-js/build/src/call';
import {
  IsAuthorizedRequest_Resource,
  IsAuthorizedResponse,
  IsAuthorizedRequest as grpcIsAuthorizedRequest,
  IsAuthorizedResponse as grpcIsAuthorizedResponse,
} from '../../../grpc/indykite/authorization/v1beta1/authorization_service';
import { CallOptions, Metadata } from '@grpc/grpc-js';
import { Utils } from '../../utils/utils';
import { applicationTokenMock } from '../../utils/test_utils';
import { DigitalTwinCore } from '../../model';
import { DigitalTwinKind, DigitalTwinState } from '../../../grpc/indykite/identity/v1beta2/model';
import { InputParam } from '../../../grpc/indykite/authorization/v1beta1/model';
import { PropertyFilter } from '../../../grpc/indykite/identity/v1beta2/attributes';
import { Value } from '../../../grpc/indykite/objects/v1beta1/struct';

let sdk: AuthorizationClientV2;

beforeAll(async () => {
  sdk = await AuthorizationClientV2.createInstance(applicationTokenMock);
});

afterEach(() => {
  jest.resetAllMocks();
});

describe('isAuthorized', () => {
  const subject = new DigitalTwinCore(
    'digitaltwin-id',
    'tenant-id',
    DigitalTwinKind.PERSON,
    DigitalTwinState.ACTIVE,
  );

  describe('when the response does not contain an error', () => {
    const resources: IsAuthorizedRequest_Resource[] = [
      {
        type: 'ParkingLot',
        id: 'parking-lot-id1',
        actions: ['HAS_FREE_PARKING'],
      },
      {
        type: 'ParkingLot',
        id: 'parking-lot-id2',
        actions: ['HAS_FREE_PARKING'],
      },
    ];
    const decisionsResult: grpcIsAuthorizedResponse = {
      decisions: {
        ParkingLot: {
          resources: {
            'parking-lot-id1': {
              actions: {
                HAS_FREE_PARKING: {
                  allow: true,
                },
              },
            },
            'parking-lot-id2': {
              actions: {
                HAS_FREE_PARKING: {
                  allow: false,
                },
              },
            },
          },
        },
      },
      decisionTime: Utils.dateToTimestamp(new Date()),
    };
    let result: IsAuthorizedResponse;

    beforeEach(async () => {
      const mockFunc = jest.fn(
        (
          request: grpcIsAuthorizedRequest,
          callback:
            | Metadata
            | CallOptions
            | ((error: ServiceError | null, response?: grpcIsAuthorizedResponse) => void),
        ): SurfaceCall => {
          if (typeof callback === 'function') callback(null, decisionsResult);
          return {} as SurfaceCall;
        },
      );

      jest.spyOn(sdk['client'], 'isAuthorized').mockImplementation(mockFunc);

      result = await sdk.isAuthorized(subject, resources);
    });

    it('sends a correct request', () => {
      expect(sdk['client'].isAuthorized).toBeCalledTimes(1);
      expect(sdk['client'].isAuthorized).toBeCalledWith(
        {
          inputParams: {},
          policyTags: [],
          subject: {
            subject: {
              oneofKind: 'digitalTwinId',
              digitalTwinId: {
                id: 'digitaltwin-id',
              }
            },
          },
          resources: [
            {
              id: 'parking-lot-id1',
              type: 'ParkingLot',
              actions: ['HAS_FREE_PARKING'],
            },
            {
              id: 'parking-lot-id2',
              type: 'ParkingLot',
              actions: ['HAS_FREE_PARKING'],
            },
          ],
        },
        expect.any(Function),
      );
    });

    it('returns a correct response', () => {
      expect(result.decisionTime).toEqual(decisionsResult.decisionTime);
      expect(result.decisions).toEqual({
        ParkingLot: {
          resources: {
            'parking-lot-id1': {
              actions: {
                HAS_FREE_PARKING: {
                  allow: true,
                },
              },
            },
            'parking-lot-id2': {
              actions: {
                HAS_FREE_PARKING: {
                  allow: false,
                },
              },
            },
          },
        },
      });
    });
  });

  describe('when the response does not contain any value', () => {
    const resources: IsAuthorizedRequest_Resource[] = [
      {
        type: 'ParkingLot',
        id: 'parking-lot-id1',
        actions: ['HAS_FREE_PARKING'],
      },
      {
        type: 'ParkingLot',
        id: 'parking-lot-id2',
        actions: ['HAS_FREE_PARKING'],
      },
    ];
    let caughtError: unknown;

    beforeEach(async () => {
      const mockFunc = jest.fn(
        (
          request: grpcIsAuthorizedRequest,
          callback:
            | Metadata
            | CallOptions
            | ((error: ServiceError | null, response?: grpcIsAuthorizedResponse) => void),
        ): SurfaceCall => {
          if (typeof callback === 'function') callback(null);
          return {} as SurfaceCall;
        },
      );

      jest.spyOn(sdk['client'], 'isAuthorized').mockImplementation(mockFunc);

      try {
        caughtError = undefined;
        await sdk.isAuthorized(subject, resources);
      } catch (err) {
        caughtError = err;
      }
    });

    it('throws an error', () => {
      expect((caughtError as Error).message).toEqual('No data in isAuthorized response');
    });
  });

  describe('when the response returns an error', () => {
    const resources: IsAuthorizedRequest_Resource[] = [
      {
        type: 'ParkingLot',
        id: 'parking-lot-id1',
        actions: ['HAS_FREE_PARKING'],
      },
      {
        type: 'ParkingLot',
        id: 'parking-lot-id2',
        actions: ['HAS_FREE_PARKING'],
      },
    ];
    const error = new Error('Error mock') as ServiceError;
    let caughtError: unknown;

    beforeEach(async () => {
      const mockFunc = jest.fn(
        (
          request: grpcIsAuthorizedRequest,
          callback:
            | Metadata
            | CallOptions
            | ((error: ServiceError | null, response?: grpcIsAuthorizedResponse) => void),
        ): SurfaceCall => {
          if (typeof callback === 'function') callback(error);
          return {} as SurfaceCall;
        },
      );

      jest.spyOn(sdk['client'], 'isAuthorized').mockImplementation(mockFunc);

      try {
        await sdk.isAuthorized(subject, resources);
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
    const resources: IsAuthorizedRequest_Resource[] = [
      {
        type: 'ParkingLot',
        id: 'parking-lot-id1',
        actions: ['HAS_FREE_PARKING'],
      },
      {
        type: 'ParkingLot',
        id: 'parking-lot-id2',
        actions: ['HAS_FREE_PARKING'],
      },
    ];
    const decisionsResult: grpcIsAuthorizedResponse = {
      decisions: {
        ParkingLot: {
          resources: {
            'parking-lot-id1': {
              actions: {
                HAS_FREE_PARKING: {
                  allow: true,
                },
              },
            },
            'parking-lot-id2': {
              actions: {
                HAS_FREE_PARKING: {
                  allow: false,
                },
              },
            },
          },
        },
      },
      decisionTime: Utils.dateToTimestamp(new Date()),
    };
    let result: IsAuthorizedResponse;

    beforeEach(async () => {
      const mockFunc = jest.fn(
        (
          request: grpcIsAuthorizedRequest,
          callback:
            | Metadata
            | CallOptions
            | ((error: ServiceError | null, response?: grpcIsAuthorizedResponse) => void),
        ): SurfaceCall => {
          if (typeof callback === 'function') callback(null, decisionsResult);
          return {} as SurfaceCall;
        },
      );

      jest.spyOn(sdk['client'], 'isAuthorized').mockImplementation(mockFunc);

      result = await sdk.isAuthorizedByToken(
        subject,
        resources,
        {
          someInputParam: InputParam.fromJson(Utils.objectToJsonValue('Some value')),
        },
        ['some-tag'],
      );
    });

    it('sends a correct request', () => {
      expect(sdk['client'].isAuthorized).toBeCalledTimes(1);
      expect(sdk['client'].isAuthorized).toBeCalledWith(
        {
          inputParams: {
            someInputParam: {
              value: {
                oneofKind: 'stringValue',
                stringValue: 'Some value',
              },
            },
          },
          policyTags: ['some-tag'],
          subject: {
            subject: {
              oneofKind: 'indykiteAccessToken',
              indykiteAccessToken:  'access-token',
            },
          },
          resources: [
            {
              id: 'parking-lot-id1',
              type: 'ParkingLot',
              actions: ['HAS_FREE_PARKING'],
            },
            {
              id: 'parking-lot-id2',
              type: 'ParkingLot',
              actions: ['HAS_FREE_PARKING'],
            },
          ],
        },
        expect.any(Function),
      );
    });

    it('returns a correct response', () => {
      expect(result.decisionTime).toEqual(decisionsResult.decisionTime);
      expect(result.decisions).toEqual({
        ParkingLot: {
          resources: {
            'parking-lot-id1': {
              actions: {
                HAS_FREE_PARKING: {
                  allow: true,
                },
              },
            },
            'parking-lot-id2': {
              actions: {
                HAS_FREE_PARKING: {
                  allow: false,
                },
              },
            },
          },
        },
      });
    });
  });

  describe('when the response does not contain any value', () => {
    const resources: IsAuthorizedRequest_Resource[] = [
      {
        type: 'ParkingLot',
        id: 'parking-lot-id1',
        actions: ['HAS_FREE_PARKING'],
      },
      {
        type: 'ParkingLot',
        id: 'parking-lot-id2',
        actions: ['HAS_FREE_PARKING'],
      },
    ];
    let caughtError: unknown;

    beforeEach(async () => {
      const mockFunc = jest.fn(
        (
          request: grpcIsAuthorizedRequest,
          callback:
            | Metadata
            | CallOptions
            | ((error: ServiceError | null, response?: grpcIsAuthorizedResponse) => void),
        ): SurfaceCall => {
          if (typeof callback === 'function') callback(null);
          return {} as SurfaceCall;
        },
      );

      jest.spyOn(sdk['client'], 'isAuthorized').mockImplementation(mockFunc);

      try {
        caughtError = undefined;
        await sdk.isAuthorizedByToken(subject, resources);
      } catch (err) {
        caughtError = err;
      }
    });

    it('throws an error', () => {
      expect((caughtError as Error).message).toEqual('No data in isAuthorized response');
    });
  });

  describe('when the response returns an error', () => {
    const resources: IsAuthorizedRequest_Resource[] = [
      {
        type: 'ParkingLot',
        id: 'parking-lot-id1',
        actions: ['HAS_FREE_PARKING'],
      },
      {
        type: 'ParkingLot',
        id: 'parking-lot-id2',
        actions: ['HAS_FREE_PARKING'],
      },
    ];
    const error = new Error('Error mock') as ServiceError;
    let caughtError: unknown;

    beforeEach(async () => {
      const mockFunc = jest.fn(
        (
          request: grpcIsAuthorizedRequest,
          callback:
            | Metadata
            | CallOptions
            | ((error: ServiceError | null, response?: grpcIsAuthorizedResponse) => void),
        ): SurfaceCall => {
          if (typeof callback === 'function') callback(error);
          return {} as SurfaceCall;
        },
      );

      jest.spyOn(sdk['client'], 'isAuthorized').mockImplementation(mockFunc);

      try {
        await sdk.isAuthorizedByToken(subject, resources);
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
  // let x :Value;
  const subject: PropertyFilter = {
    tenantId: 'tenant-id',
    type: 'email',
    value: Value.fromJson(Utils.objectToJsonValue('user@example.com')),
  } as PropertyFilter;

  describe('when the response does not contain an error', () => {
    const resources: IsAuthorizedRequest_Resource[] = [
      {
        type: 'ParkingLot',
        id: 'parking-lot-id1',
        actions: ['HAS_FREE_PARKING'],
      },
      {
        type: 'ParkingLot',
        id: 'parking-lot-id2',
        actions: ['HAS_FREE_PARKING'],
      },
    ];
    const decisionsResult: grpcIsAuthorizedResponse = {
      decisions: {
        ParkingLot: {
          resources: {
            'parking-lot-id1': {
              actions: {
                HAS_FREE_PARKING: {
                  allow: true,
                },
              },
            },
            'parking-lot-id2': {
              actions: {
                HAS_FREE_PARKING: {
                  allow: false,
                },
              },
            },
          },
        },
      },
      decisionTime: Utils.dateToTimestamp(new Date()),
    };
    let result: IsAuthorizedResponse;

    beforeEach(async () => {
      const mockFunc = jest.fn(
        (
          request: grpcIsAuthorizedRequest,
          callback:
            | Metadata
            | CallOptions
            | ((error: ServiceError | null, response?: grpcIsAuthorizedResponse) => void),
        ): SurfaceCall => {
          if (typeof callback === 'function') callback(null, decisionsResult);
          return {} as SurfaceCall;
        },
      );

      jest.spyOn(sdk['client'], 'isAuthorized').mockImplementation(mockFunc);

      result = await sdk.isAuthorizedByProperty(subject, resources);
    });

    it('sends a correct request', () => {
      expect(sdk['client'].isAuthorized).toBeCalledTimes(1);
      expect(sdk['client'].isAuthorized).toBeCalledWith(
        {
          inputParams: {},
          policyTags: [],
          subject: {
            subject: {
              oneofKind: 'digitalTwinProperty',
              digitalTwinProperty: {
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
          resources: [
            {
              id: 'parking-lot-id1',
              type: 'ParkingLot',
              actions: ['HAS_FREE_PARKING'],
            },
            {
              id: 'parking-lot-id2',
              type: 'ParkingLot',
              actions: ['HAS_FREE_PARKING'],
            },
          ],
        },
        expect.any(Function),
      );
    });

    it('returns a correct response', () => {
      expect(result.decisionTime).toEqual(decisionsResult.decisionTime);
      expect(result.decisions).toEqual({
        ParkingLot: {
          resources: {
            'parking-lot-id1': {
              actions: {
                HAS_FREE_PARKING: {
                  allow: true,
                },
              },
            },
            'parking-lot-id2': {
              actions: {
                HAS_FREE_PARKING: {
                  allow: false,
                },
              },
            },
          },
        },
      });
    });
  });

  describe('when the response does not contain any value', () => {
    const resources: IsAuthorizedRequest_Resource[] = [
      {
        type: 'ParkingLot',
        id: 'parking-lot-id1',
        actions: ['HAS_FREE_PARKING'],
      },
      {
        type: 'ParkingLot',
        id: 'parking-lot-id2',
        actions: ['HAS_FREE_PARKING'],
      },
    ];
    let caughtError: unknown;

    beforeEach(async () => {
      const mockFunc = jest.fn(
        (
          request: grpcIsAuthorizedRequest,
          callback:
            | Metadata
            | CallOptions
            | ((error: ServiceError | null, response?: grpcIsAuthorizedResponse) => void),
        ): SurfaceCall => {
          if (typeof callback === 'function') callback(null);
          return {} as SurfaceCall;
        },
      );
      mockFunc.mockName('isAuthorized');
      jest.spyOn(sdk['client'], 'isAuthorized').mockImplementation(mockFunc);

      try {
        caughtError = undefined;
        await sdk.isAuthorizedByProperty(subject, resources);
      } catch (err) {
        caughtError = err;
      }
    });

    it('throws an error', () => {
      expect((caughtError as Error).message).toEqual('No data in isAuthorized response');
    });
  });

  describe('when the response returns an error', () => {
    const resources: IsAuthorizedRequest_Resource[] = [
      {
        type: 'ParkingLot',
        id: 'parking-lot-id1',
        actions: ['HAS_FREE_PARKING'],
      },
      {
        type: 'ParkingLot',
        id: 'parking-lot-id2',
        actions: ['HAS_FREE_PARKING'],
      },
    ];
    const error = new Error('Error mock') as ServiceError;
    let caughtError: unknown;

    beforeEach(async () => {
      const mockFunc = jest.fn(
        (
          request: grpcIsAuthorizedRequest,
          callback:
            | Metadata
            | CallOptions
            | ((error: ServiceError | null, response?: grpcIsAuthorizedResponse) => void),
        ): SurfaceCall => {
          if (typeof callback === 'function') callback(error);
          return {} as SurfaceCall;
        },
      );

      jest.spyOn(sdk['client'], 'isAuthorized').mockImplementation(mockFunc);

      try {
        await sdk.isAuthorizedByProperty(subject, resources);
      } catch (err) {
        caughtError = err;
      }
    });

    it('returns an empty response', () => {
      expect(caughtError).toBe(error);
    });
  });
});
