import { AuthorizationClientV2 } from '../../authorization_v2';
import { ServiceError, SurfaceCall } from '@grpc/grpc-js/build/src/call';
import {
  WhatAuthorizedRequest_ResourceType,
  WhatAuthorizedResponse,
  WhatAuthorizedRequest as grpcWhatAuthorizedRequest,
  WhatAuthorizedResponse as grpcWhatAuthorizedResponse,
} from '../../../grpc/indykite/authorization/v1beta1/authorization_service';
import { CallOptions, Metadata } from '@grpc/grpc-js';
import { Utils } from '../../utils/utils';
import { applicationTokenMock } from '../../utils/test_utils';
import { DigitalTwinCore } from '../../model';
import { DigitalTwinKind, DigitalTwinState } from '../../../grpc/indykite/identity/v1beta2/model';
import { Value } from '../../../grpc/indykite/objects/v1beta1/struct';
import { InputParam } from '../../../grpc/indykite/authorization/v1beta1/model';
import { PropertyFilter } from '../../../grpc/indykite/identity/v1beta2/attributes';

let sdk: AuthorizationClientV2;

beforeAll(async () => {
  sdk = await AuthorizationClientV2.createInstance(applicationTokenMock);
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
    const resources: WhatAuthorizedRequest_ResourceType[] = [
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
          inputParams: {},
          policyTags: [],
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
      expect(result.decisionTime).toEqual(decisionsResult.decisionTime);
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
    const resources: WhatAuthorizedRequest_ResourceType[] = [
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
    const resources: WhatAuthorizedRequest_ResourceType[] = [
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
    const resources: WhatAuthorizedRequest_ResourceType[] = [
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

      result = await sdk.whatAuthorizedByToken(
        subject,
        resources,
        {
          someInputParam: InputParam.fromJson(Utils.objectToJsonValue('Some value')),
        },
        ['some-tag'],
      );
    });

    it('sends a correct request', () => {
      expect(sdk['client'].whatAuthorized).toBeCalledTimes(1);
      expect(sdk['client'].whatAuthorized).toBeCalledWith(
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
      expect(result.decisionTime).toEqual(decisionsResult.decisionTime);
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
    const resources: WhatAuthorizedRequest_ResourceType[] = [
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
      expect((caughtError as Error).message).toEqual('No data in whatAuthorized response');
    });
  });

  describe('when the response returns an error', () => {
    const resources: WhatAuthorizedRequest_ResourceType[] = [
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
    value: Value.fromJson(Utils.objectToJsonValue('user@example.com')),
  } as PropertyFilter;

  describe('when the response does not contain an error', () => {
    const resources: WhatAuthorizedRequest_ResourceType[] = [
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
          inputParams: {},
          policyTags: [],
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
      expect(result.decisionTime).toEqual(decisionsResult.decisionTime);
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
    const resources: WhatAuthorizedRequest_ResourceType[] = [
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
      expect((caughtError as Error).message).toEqual('No data in whatAuthorized response');
    });
  });

  describe('when the response returns an error', () => {
    const resources: WhatAuthorizedRequest_ResourceType[] = [
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
