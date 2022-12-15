import { CallOptions, Metadata, ServiceError } from '@grpc/grpc-js';
import { SurfaceCall } from '@grpc/grpc-js/build/src/call';
import { Struct } from '../../../grpc/google/protobuf/struct';
import { SessionIntrospectResponse } from '../../../grpc/indykite/identity/v1beta2/identity_management_api';
import { Status } from '@grpc/grpc-js/build/src/constants';
import {
  DigitalTwinKind,
  DigitalTwinState,
  ProviderType,
} from '../../../grpc/indykite/identity/v1beta2/model';
import { IdentityClient } from '../../identity';
import { ProviderInfo, TokenInfo } from '../../model';
import { applicationTokenMock, generateRandomGID } from '../../utils/test_utils';
import { Utils } from '../../utils/utils';

describe('sessionIntrospect', () => {
  const tenantId = generateRandomGID();
  const token = 'access-token';
  const customerId = generateRandomGID();
  const appSpaceId = generateRandomGID();
  const applicationId = generateRandomGID();
  const dtId = generateRandomGID();
  const dtTenantId = generateRandomGID();
  const issueTime = new Date();

  describe('when a response is returned', () => {
    let sessionIntrospectSpy: jest.SpyInstance;
    let sdk: IdentityClient;
    let introspectResult: { tokenInfo: TokenInfo; providers: string[] };

    beforeEach(async () => {
      sdk = await IdentityClient.createInstance(JSON.stringify(applicationTokenMock));
      sessionIntrospectSpy = jest
        .spyOn(sdk['client'], 'sessionIntrospect')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response: SessionIntrospectResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(null, {
                active: true,
                providerData: ['provider-data-1', 'provider-data-2'],
                tokenInfo: {
                  customerId,
                  appSpaceId,
                  applicationId,
                  subject: {
                    id: dtId,
                    tenantId: dtTenantId,
                    kind: DigitalTwinKind.PERSON,
                    state: DigitalTwinState.ACTIVE,
                    tags: [],
                  },
                  issueTime: Utils.dateToTimestamp(issueTime),
                  providerInfo: [
                    {
                      type: ProviderType.EMAIL,
                      issuer: 'https://google.com',
                    },
                  ],
                  sessionClaims: Struct.fromJson({
                    claim1: 'value1',
                    claim2: 'value2',
                  }),
                  tokenClaims: Struct.fromJson({
                    claim1: 'value1',
                    claim2: 'value2',
                  }),
                },
              });
            }
            return {} as SurfaceCall;
          },
        );

      introspectResult = await sdk.sessionIntrospect(tenantId, token);
    });

    it('sends correct request', () => {
      expect(sessionIntrospectSpy).toBeCalledWith(
        {
          tenantId,
          token,
        },
        expect.any(Function),
      );
    });

    it('returns a correct response', () => {
      expect(introspectResult.tokenInfo).toEqual({
        active: true,
        appSpaceId,
        applicationId,
        customerId,
        issueTime,
        providerInfo: [new ProviderInfo('email', 'https://google.com')],
        subject: {
          id: dtId,
          tenantId: dtTenantId,
          state: DigitalTwinState.ACTIVE,
          tags: [],
          kind: DigitalTwinKind.PERSON,
        },
      });
      expect(introspectResult.providers).toEqual(['provider-data-1', 'provider-data-2']);
    });
  });

  describe('when an empty response is returned', () => {
    let sdk: IdentityClient;
    let caughtError: unknown;

    beforeEach(async () => {
      sdk = await IdentityClient.createInstance(JSON.stringify(applicationTokenMock));
      jest
        .spyOn(sdk['client'], 'sessionIntrospect')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response?: SessionIntrospectResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(null);
            }
            return {} as SurfaceCall;
          },
        );

      try {
        await sdk.sessionIntrospect(tenantId, token);
      } catch (err) {
        caughtError = err;
      }
    });

    it('throws an error', () => {
      expect(caughtError).toEqual(new Error('Missing session introspect response'));
    });
  });

  describe('when an error is returned', () => {
    const error = {
      code: Status.NOT_FOUND,
      details: 'DETAILS',
      metadata: {},
    } as ServiceError;
    let sdk: IdentityClient;
    let caughtError: unknown;

    beforeEach(async () => {
      sdk = await IdentityClient.createInstance(JSON.stringify(applicationTokenMock));
      jest
        .spyOn(sdk['client'], 'sessionIntrospect')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response?: SessionIntrospectResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(error);
            }
            return {} as SurfaceCall;
          },
        );

      try {
        await sdk.sessionIntrospect(tenantId, token);
      } catch (err) {
        caughtError = err;
      }
    });

    it('throws an error', () => {
      expect(caughtError).toEqual(error);
    });
  });
});
