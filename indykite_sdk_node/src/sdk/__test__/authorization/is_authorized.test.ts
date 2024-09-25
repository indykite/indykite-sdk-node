import { AuthorizationClient } from '../../authorization';
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
import {
  DigitalTwin,
  InputParam,
  Property,
  ExternalID,
} from '../../../grpc/indykite/authorization/v1beta1/model';
import { Value } from '../../../grpc/indykite/objects/v1beta1/struct';

let sdk: AuthorizationClient;

beforeAll(async () => {
  sdk = await AuthorizationClient.createInstance(applicationTokenMock);
});

afterEach(() => {
  jest.resetAllMocks();
});

describe('isAuthorized', () => {
  const subject: DigitalTwin = {
    id: 'gid:digitaltwin-id',
  };

  describe('when the response does not contain an error', () => {
    const resources: IsAuthorizedRequest_Resource[] = [
      {
        type: 'ParkingLot',
        externalId: 'parking-lot-id1',
        actions: ['HAS_FREE_PARKING'],
      },
      {
        type: 'ParkingLot',
        externalId: 'parking-lot-id2',
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
                id: 'gid:digitaltwin-id',
              },
            },
          },
          resources: [
            {
              externalId: 'parking-lot-id1',
              type: 'ParkingLot',
              actions: ['HAS_FREE_PARKING'],
            },
            {
              externalId: 'parking-lot-id2',
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
        externalId: 'parking-lot-id1',
        actions: ['HAS_FREE_PARKING'],
      },
      {
        type: 'ParkingLot',
        externalId: 'parking-lot-id2',
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
        externalId: 'parking-lot-id1',
        actions: ['HAS_FREE_PARKING'],
      },
      {
        type: 'ParkingLot',
        externalId: 'parking-lot-id2',
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
        externalId: 'parking-lot-id1',
        actions: ['HAS_FREE_PARKING'],
      },
      {
        type: 'ParkingLot',
        externalId: 'parking-lot-id2',
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
      expect(sdk['client'].isAuthorized).toHaveBeenCalledTimes(1);
      expect(sdk['client'].isAuthorized).toHaveBeenCalledWith(
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
              oneofKind: 'accessToken',
              accessToken: 'access-token',
            },
          },
          resources: [
            {
              externalId: 'parking-lot-id1',
              type: 'ParkingLot',
              actions: ['HAS_FREE_PARKING'],
            },
            {
              externalId: 'parking-lot-id2',
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
        externalId: 'parking-lot-id1',
        actions: ['HAS_FREE_PARKING'],
      },
      {
        type: 'ParkingLot',
        externalId: 'parking-lot-id2',
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
        externalId: 'parking-lot-id1',
        actions: ['HAS_FREE_PARKING'],
      },
      {
        type: 'ParkingLot',
        externalId: 'parking-lot-id2',
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
  const subject: Property = {
    type: 'email',
    value: Value.fromJson(Utils.objectToJsonValue('user@example.com')),
  } as Property;

  describe('when the response does not contain an error', () => {
    const resources: IsAuthorizedRequest_Resource[] = [
      {
        type: 'ParkingLot',
        externalId: 'parking-lot-id1',
        actions: ['HAS_FREE_PARKING'],
      },
      {
        type: 'ParkingLot',
        externalId: 'parking-lot-id2',
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
              externalId: 'parking-lot-id1',
              type: 'ParkingLot',
              actions: ['HAS_FREE_PARKING'],
            },
            {
              externalId: 'parking-lot-id2',
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
        externalId: 'parking-lot-id1',
        actions: ['HAS_FREE_PARKING'],
      },
      {
        type: 'ParkingLot',
        externalId: 'parking-lot-id2',
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
        externalId: 'parking-lot-id1',
        actions: ['HAS_FREE_PARKING'],
      },
      {
        type: 'ParkingLot',
        externalId: 'parking-lot-id2',
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

describe('isAuthorizedByExternalID', () => {
  const subject: ExternalID = {
    type: 'Individual',
    externalId: 'Individual14',
  } as ExternalID;

  describe('when the response does not contain an error', () => {
    const resources: IsAuthorizedRequest_Resource[] = [
      {
        type: 'ParkingLot',
        externalId: 'parking-lot-id1',
        actions: ['HAS_FREE_PARKING'],
      },
      {
        type: 'ParkingLot',
        externalId: 'parking-lot-id2',
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

      result = await sdk.IsAuthorizedByExternalID(subject, resources);
    });

    it('sends a correct request', () => {
      expect(sdk['client'].isAuthorized).toBeCalledTimes(1);
      expect(sdk['client'].isAuthorized).toBeCalledWith(
        {
          inputParams: {},
          policyTags: [],
          subject: {
            subject: {
              oneofKind: 'externalId',
              externalId: {
                type: 'Individual',
                externalId: 'Individual14',
              },
            },
          },
          resources: [
            {
              externalId: 'parking-lot-id1',
              type: 'ParkingLot',
              actions: ['HAS_FREE_PARKING'],
            },
            {
              externalId: 'parking-lot-id2',
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
        externalId: 'parking-lot-id1',
        actions: ['HAS_FREE_PARKING'],
      },
      {
        type: 'ParkingLot',
        externalId: 'parking-lot-id2',
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
        await sdk.IsAuthorizedByExternalID(subject, resources);
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
        externalId: 'parking-lot-id1',
        actions: ['HAS_FREE_PARKING'],
      },
      {
        type: 'ParkingLot',
        externalId: 'parking-lot-id2',
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
        await sdk.IsAuthorizedByExternalID(subject, resources);
      } catch (err) {
        caughtError = err;
      }
    });

    it('returns an empty response', () => {
      expect(caughtError).toBe(error);
    });
  });
});
