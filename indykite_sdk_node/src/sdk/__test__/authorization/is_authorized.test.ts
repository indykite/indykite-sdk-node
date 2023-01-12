import { ServiceError, SurfaceCall } from '@grpc/grpc-js/build/src/call';
import {
  IsAuthorizedRequest,
  IsAuthorizedResponse,
} from '../../../grpc/indykite/authorization/v1beta1/authorization_service';
import { AuthorizationClient } from '../../authorization';
import { CallOptions, Metadata } from '@grpc/grpc-js';
import { Utils } from '../../utils/utils';
import { applicationTokenMock } from '../../utils/test_utils';
import { AuthorizationResource, DigitalTwinIdentifier } from '../../model';
import { AuthorizationDecisions } from '../../model/authorization_decisions';

let sdk: AuthorizationClient;

beforeAll(async () => {
  sdk = await AuthorizationClient.createInstance(applicationTokenMock);
});

afterEach(() => {
  jest.resetAllMocks();
});

describe('isAuthorized', () => {
  const subject = DigitalTwinIdentifier.fromToken('mocked-access-token');

  describe('when the response does not contain an error', () => {
    const resources = [
      new AuthorizationResource('resource1Id', 'Label'),
      new AuthorizationResource('resource2Id', 'Label'),
    ];
    const actions = ['READ'];
    const decisionsResult = {
      decisions: {
        resource1Id: {
          allowAction: {
            READ: false,
          },
        },
        resource2Id: {
          allowAction: {
            READ: true,
          },
        },
      },
      decisionTime: Utils.dateToTimestamp(new Date()),
    };
    let result: unknown;

    beforeEach(async () => {
      const mockFunc = jest.fn(
        (
          request: IsAuthorizedRequest,
          callback:
            | Metadata
            | CallOptions
            | ((error: ServiceError | null, response?: IsAuthorizedResponse) => void),
        ): SurfaceCall => {
          if (typeof callback === 'function') callback(null, decisionsResult);
          return {} as SurfaceCall;
        },
      );

      jest.spyOn(sdk['client'], 'isAuthorized').mockImplementation(mockFunc);

      result = await sdk.isAuthorized(subject, resources, actions);
    });

    it('sends a correct request', () => {
      expect(sdk['client'].isAuthorized).toBeCalledTimes(1);
      expect(sdk['client'].isAuthorized).toBeCalledWith(
        {
          subject: {
            oneofKind: 'digitalTwinIdentifier',
            digitalTwinIdentifier: {
              filter: {
                oneofKind: 'accessToken',
                accessToken: 'mocked-access-token',
              },
            },
          },
          resources: [
            {
              id: 'resource1Id',
              label: 'Label',
            },
            {
              id: 'resource2Id',
              label: 'Label',
            },
          ],
          actions: ['READ'],
        },
        expect.any(Function),
      );
    });

    it('returns a correct response', () => {
      expect(result).toBeInstanceOf(AuthorizationDecisions);
      const adResult = result as AuthorizationDecisions;
      expect(adResult.decisionTime).toEqual(Utils.timestampToDate(decisionsResult.decisionTime));
      expect(adResult.resources).toEqual({
        resource1Id: {
          READ: false,
        },
        resource2Id: {
          READ: true,
        },
      });
      expect(adResult.isAuthorized('resource1Id', 'READ')).toBe(false);
      expect(adResult.isAuthorized('resource2Id', 'READ')).toBe(true);
    });
  });

  describe('when the response does not contain any value', () => {
    const resources = [
      new AuthorizationResource('resource1Id', 'Label'),
      new AuthorizationResource('resource2Id', 'Label'),
    ];
    const actions = ['READ'];
    let result: unknown;

    beforeEach(async () => {
      const mockFunc = jest.fn(
        (
          request: IsAuthorizedRequest,
          callback:
            | Metadata
            | CallOptions
            | ((error: ServiceError | null, response?: IsAuthorizedResponse) => void),
        ): SurfaceCall => {
          if (typeof callback === 'function') callback(null);
          return {} as SurfaceCall;
        },
      );

      jest.spyOn(sdk['client'], 'isAuthorized').mockImplementation(mockFunc);

      result = await sdk.isAuthorized(subject, resources, actions);
    });

    it('returns an empty response', () => {
      expect(result).toBeInstanceOf(AuthorizationDecisions);
      const adResult = result as AuthorizationDecisions;
      expect(adResult.decisionTime).toBeUndefined();
      expect(adResult.resources).toEqual({});
      expect(adResult.isAuthorized('resource1Id', 'READ')).toBe(false);
      expect(adResult.isAuthorized('resource2Id', 'READ')).toBe(false);
    });
  });

  describe('when the response returns an error', () => {
    const resources = [
      new AuthorizationResource('resource1Id', 'Label'),
      new AuthorizationResource('resource2Id', 'Label'),
    ];
    const actions = ['READ'];
    const error = new Error('Error mock') as ServiceError;
    let caughtError: unknown;

    beforeEach(async () => {
      const mockFunc = jest.fn(
        (
          request: IsAuthorizedRequest,
          callback:
            | Metadata
            | CallOptions
            | ((error: ServiceError | null, response?: IsAuthorizedResponse) => void),
        ): SurfaceCall => {
          if (typeof callback === 'function') callback(error);
          return {} as SurfaceCall;
        },
      );

      jest.spyOn(sdk['client'], 'isAuthorized').mockImplementation(mockFunc);

      try {
        await sdk.isAuthorized(subject, resources, actions);
      } catch (err) {
        caughtError = err;
      }
    });

    it('returns an empty response', () => {
      expect(caughtError).toBe(error);
    });
  });
});
