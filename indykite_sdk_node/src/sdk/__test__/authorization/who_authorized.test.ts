import { AuthorizationClient } from '../../authorization';
import { ServiceError, SurfaceCall } from '@grpc/grpc-js/build/src/call';
import {
  WhoAuthorizedRequest,
  WhoAuthorizedRequest_Resource,
  WhoAuthorizedResponse,
} from '../../../grpc/indykite/authorization/v1beta1/authorization_service';
import { CallOptions, Metadata } from '@grpc/grpc-js';
import { Utils } from '../../utils/utils';
import { applicationTokenMock } from '../../utils/test_utils';

let sdk: AuthorizationClient;

beforeAll(async () => {
  sdk = await AuthorizationClient.createInstance(applicationTokenMock);
});

afterEach(() => {
  jest.resetAllMocks();
});

describe('whoAuthorized', () => {
  describe('when the response does not contain an error', () => {
    const resources: WhoAuthorizedRequest_Resource[] = [
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
    const decisionsResult: WhoAuthorizedResponse = {
      decisions: {
        ParkingLot: {
          resources: {
            'parking-lot-id1': {
              actions: {
                HAS_FREE_PARKING: {
                  subjects: [
                    {
                      externalId: 'subject-external-id',
                    },
                  ],
                },
              },
            },
            'parking-lot-id2': {
              actions: {
                HAS_FREE_PARKING: {
                  subjects: [],
                },
              },
            },
          },
        },
      },
      decisionTime: Utils.dateToTimestamp(new Date()),
    };
    let result: WhoAuthorizedResponse;

    beforeEach(async () => {
      const mockFunc = jest.fn(
        (
          request: WhoAuthorizedRequest,
          callback:
            | Metadata
            | CallOptions
            | ((error: ServiceError | null, response?: WhoAuthorizedResponse) => void),
        ): SurfaceCall => {
          if (typeof callback === 'function') callback(null, decisionsResult);
          return {} as SurfaceCall;
        },
      );

      jest.spyOn(sdk['client'], 'whoAuthorized').mockImplementation(mockFunc);

      result = await sdk.whoAuthorized(AuthorizationClient.newWhoAuthorizedRequest(resources));
    });

    it('sends a correct request', () => {
      expect(sdk['client'].whoAuthorized).toBeCalledTimes(1);
      expect(sdk['client'].whoAuthorized).toBeCalledWith(
        {
          inputParams: {},
          policyTags: [],
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
                  subjects: [
                    {
                      externalId: 'subject-external-id',
                    },
                  ],
                },
              },
            },
            'parking-lot-id2': {
              actions: {
                HAS_FREE_PARKING: {
                  subjects: [],
                },
              },
            },
          },
        },
      });
    });
  });

  describe('when the response does not contain any value', () => {
    const resources: WhoAuthorizedRequest_Resource[] = [
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
          request: WhoAuthorizedRequest,
          callback:
            | Metadata
            | CallOptions
            | ((error: ServiceError | null, response?: WhoAuthorizedResponse) => void),
        ): SurfaceCall => {
          if (typeof callback === 'function') callback(null);
          return {} as SurfaceCall;
        },
      );
      mockFunc.mockName('whoAuthorized');
      jest.spyOn(sdk['client'], 'whoAuthorized').mockImplementation(mockFunc);

      try {
        caughtError = undefined;
        await sdk.whoAuthorized(AuthorizationClient.newWhoAuthorizedRequest(resources));
      } catch (err) {
        caughtError = err;
      }
    });

    it('throws an error', () => {
      expect((caughtError as Error).message).toEqual('No data in whoAuthorized response');
    });
  });

  describe('when the response returns an error', () => {
    const resources: WhoAuthorizedRequest_Resource[] = [
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
          request: WhoAuthorizedRequest,
          callback:
            | Metadata
            | CallOptions
            | ((error: ServiceError | null, response?: WhoAuthorizedResponse) => void),
        ): SurfaceCall => {
          if (typeof callback === 'function') callback(error);
          return {} as SurfaceCall;
        },
      );

      jest.spyOn(sdk['client'], 'whoAuthorized').mockImplementation(mockFunc);

      try {
        await sdk.whoAuthorized(AuthorizationClient.newWhoAuthorizedRequest(resources));
      } catch (err) {
        caughtError = err;
      }
    });

    it('returns an empty response', () => {
      expect(caughtError).toBe(error);
    });
  });
});
