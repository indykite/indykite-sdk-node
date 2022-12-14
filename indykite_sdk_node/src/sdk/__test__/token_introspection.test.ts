import { CallOptions, Metadata } from '@grpc/grpc-js';
import { ServiceError, SurfaceCall } from '@grpc/grpc-js/build/src/call';
import { parse, stringify, v4 } from 'uuid';
import {
  TokenIntrospectRequest,
  TokenIntrospectResponse,
} from '../../grpc/indykite/identity/v1beta1/identity_management_api';
import {
  DigitalTwinKind,
  DigitalTwinState,
  ProviderType,
} from '../../grpc/indykite/identity/v1beta1/model';
import { IdentityClient } from '../identity';
import { TokenInfo } from '../model';
import { applicationTokenMock } from '../utils/test_utils';
import { Utils } from '../utils/utils';

let sdk: IdentityClient;
const userToken = 'user-token-token-token-token-token';

beforeAll(async () => {
  sdk = await IdentityClient.createInstance(applicationTokenMock);
});

describe('Introspection', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('No response', async () => {
    const mockResponse = undefined;
    const mockFunc = jest.fn(
      (
        request: TokenIntrospectRequest,
        callback:
          | Metadata
          | CallOptions
          | ((error: ServiceError | null, response?: TokenIntrospectResponse) => void),
      ): SurfaceCall => {
        if (typeof callback === 'function') callback(null, mockResponse);
        return {} as SurfaceCall;
      },
    );

    jest.spyOn(sdk['client'], 'tokenIntrospect').mockImplementation(mockFunc);

    const resp = sdk.introspectToken('BAD_TOKEN');
    expect(mockFunc).toHaveBeenCalled();
    expect(resp).rejects.toHaveProperty('message', 'Missing token introspect response');
  });

  it('Invalid token', async () => {
    const mockResponse: TokenIntrospectResponse = {
      active: false,
    };
    const mockFunc = jest.fn(
      (
        request: TokenIntrospectRequest,
        callback:
          | Metadata
          | CallOptions
          | ((error: ServiceError | null, response: TokenIntrospectResponse) => void),
      ): SurfaceCall => {
        if (typeof callback === 'function') callback(null, mockResponse);
        return {} as SurfaceCall;
      },
    );

    jest.spyOn(sdk['client'], 'tokenIntrospect').mockImplementation(mockFunc);

    const resp = await sdk.introspectToken('BAD_TOKEN');
    expect(mockFunc).toHaveBeenCalled();
    expect(resp).toBeInstanceOf(TokenInfo);
  });

  it('Valid token', () => {
    const dt = {
      id: parse(v4()) as Buffer,
      tenantId: parse(v4()) as Buffer,
      kind: DigitalTwinKind.PERSON,
      state: DigitalTwinState.ACTIVE,
    };
    const expectedDt = {
      id: stringify(dt.id),
      tenantId: stringify(dt.tenantId),
      kind: DigitalTwinKind.PERSON,
      state: DigitalTwinState.ACTIVE,
    };
    const appSpaceId = v4();

    ['subject', 'impersonated'].forEach(async (dtType) => {
      const mockResponse = TokenIntrospectResponse.fromJson({
        active: true,
        tokenInfo: {
          appSpaceId: Utils.uuidToBase64(appSpaceId),
          applicationId: Utils.uuidToBase64(v4()),
          customerId: Utils.uuidToBase64(v4()),
          authenticationTime: new Date().toISOString(),
          expireTime: new Date(Date.now() + 1 * 3600 * 1000).toISOString(),
          issueTime: new Date().toISOString(),
          providerInfo: [{ type: ProviderType.PASSWORD, issuer: 'indykite.id' }],
        },
      });
      if (mockResponse.tokenInfo) {
        const ext: { [key: string]: unknown } = {};
        ext[dtType] = dt;
        mockResponse.tokenInfo = Object.assign(mockResponse.tokenInfo, ext);
      }

      const mockFunc = jest.fn(
        (
          request: TokenIntrospectRequest,
          callback:
            | Metadata
            | CallOptions
            | ((error: ServiceError | null, response: TokenIntrospectResponse) => void),
        ): SurfaceCall => {
          if (typeof callback === 'function') callback(null, mockResponse);
          return {} as SurfaceCall;
        },
      );
      jest.spyOn(sdk['client'], 'tokenIntrospect').mockImplementation(mockFunc);
      if (mockResponse.tokenInfo) {
        let expected = {
          active: mockResponse.active,
          appSpaceId,
          applicationId: stringify(mockResponse.tokenInfo.applicationId),
          customerId: stringify(mockResponse.tokenInfo.customerId),
          authenticationTime: Utils.timestampToDate(mockResponse.tokenInfo.authenticationTime),
          expireTime: Utils.timestampToDate(mockResponse.tokenInfo.expireTime),
          issueTime: Utils.timestampToDate(mockResponse.tokenInfo.issueTime),

          providerInfo: [{ type: 'password', issuer: 'indykite.id' }],
        } as TokenInfo;
        const ext: { [key: string]: unknown } = {};
        ext[dtType] = expectedDt;

        expected = Object.assign(expected, ext);

        const resp = await sdk.introspectToken(userToken);
        expect(mockFunc).toHaveBeenCalled();
        expect(resp).toBeInstanceOf(TokenInfo);
        expect(resp).toEqual(expected);
      }
    });
  });
});
