import { ServiceError, SurfaceCall } from '@grpc/grpc-js/build/src/call';
import { v4 } from 'uuid';
import {
  IsAuthorizedRequest,
  IsAuthorizedResponse,
} from '../../../grpc/indykite/identity/v1beta1/identity_management_api';
import { IdentityClient } from '../../identity';
import { CallOptions, Metadata } from '@grpc/grpc-js';
import { Utils } from '../../utils/utils';
import { applicationTokenMock } from '../../utils/test_utils';
import { DigitalTwinCore, Property } from '../../model';
import { DigitalTwinKind, DigitalTwinState } from '../../../grpc/indykite/identity/v1beta1/model';
import { AuthorizationDecisions } from '../../model/authorization_decisions';

let sdk: IdentityClient;

beforeAll(async () => {
  sdk = await IdentityClient.createInstance(applicationTokenMock);
});

afterEach(() => {
  jest.resetAllMocks();
});

describe('isAuthorized', () => {
  describe('when the subject is a digital twin', () => {
    describe('when the response does not contain an error', () => {
      const subject: DigitalTwinCore = new DigitalTwinCore(
        v4(),
        v4(),
        DigitalTwinKind.PERSON,
        DigitalTwinState.ACTIVE,
        [],
      );
      const resources = [
        { id: 'resource1Id', label: 'Label' },
        { id: 'resource2Id', label: 'Label' },
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
              filter: {
                oneofKind: 'digitalTwin',
                digitalTwin: subject.marshal(),
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
      const subject: DigitalTwinCore = new DigitalTwinCore(
        v4(),
        v4(),
        DigitalTwinKind.PERSON,
        DigitalTwinState.ACTIVE,
        [],
      );
      const resources = [
        { id: 'resource1Id', label: 'Label' },
        { id: 'resource2Id', label: 'Label' },
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
      const subject: DigitalTwinCore = new DigitalTwinCore(
        v4(),
        v4(),
        DigitalTwinKind.PERSON,
        DigitalTwinState.ACTIVE,
        [],
      );
      const resources = [
        { id: 'resource1Id', label: 'Label' },
        { id: 'resource2Id', label: 'Label' },
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

  describe('when the subject is a property', () => {
    const subject: Property = new Property('email', 'propertyId').withValue('user@example.com');
    const resources = [
      { id: 'resource1Id', label: 'Label' },
      { id: 'resource2Id', label: 'Label' },
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
            filter: {
              oneofKind: 'property',
              property: subject.marshal(),
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

  describe('when the subject is an access token', () => {
    const subject = 'access-token';
    const resources = [
      { id: 'resource1Id', label: 'Label' },
      { id: 'resource2Id', label: 'Label' },
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
            filter: {
              oneofKind: 'accessToken',
              accessToken: subject,
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

  describe('when the subject is an access token and resources and actions are not defined', () => {
    const subject = 'access-token';
    const decisionsResult = {
      decisions: {},
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

      result = await sdk.isAuthorized(subject);
    });

    it('sends a correct request', () => {
      expect(sdk['client'].isAuthorized).toBeCalledTimes(1);
      expect(sdk['client'].isAuthorized).toBeCalledWith(
        {
          subject: {
            filter: {
              oneofKind: 'accessToken',
              accessToken: subject,
            },
          },
          resources: [],
          actions: [],
        },
        expect.any(Function),
      );
    });

    it('returns a correct response', () => {
      expect(result).toBeInstanceOf(AuthorizationDecisions);
      const adResult = result as AuthorizationDecisions;
      expect(adResult.decisionTime).toEqual(Utils.timestampToDate(decisionsResult.decisionTime));
      expect(adResult.resources).toEqual({});
      expect(adResult.isAuthorized('resource1Id', 'READ')).toBe(false);
      expect(adResult.isAuthorized('resource2Id', 'READ')).toBe(false);
    });
  });
});
