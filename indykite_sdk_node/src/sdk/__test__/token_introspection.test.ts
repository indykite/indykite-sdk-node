import { CallOptions, Metadata } from '@grpc/grpc-js';
import { ServiceError, SurfaceCall } from '@grpc/grpc-js/build/src/call';
import { v4 } from 'uuid';
import {
  TokenIntrospectRequest,
  TokenIntrospectResponse,
} from '../../grpc/indykite/identity/v1beta2/identity_management_api';
import {
  DigitalTwinKind,
  DigitalTwinState,
  ProviderType,
} from '../../grpc/indykite/identity/v1beta2/model';
import { IdentityClient } from '../identity';
import { IdentityTokenInfo } from '../model';
import { applicationTokenMock } from '../utils/test_utils';

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
    const mockResponse = TokenIntrospectResponse.fromJson({
      active: true,
      identityToken: {
        customerId: '',
        appSpaceId: '',
        applicationId: '',
        authenticationTime: new Date().toISOString(),
        expireTime: new Date(Date.now() + 1 * 3600 * 1000).toISOString(),
        issueTime: new Date().toISOString(),
        providerInfo: [{ type: ProviderType.PASSWORD, issuer: 'indykite.id' }],
      },
    });
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
    expect(resp.customerId).toBeUndefined();
  });

  it('Valid token', () => {
    const dt = {
      id: v4(),
      tenantId: v4(),
      kind: DigitalTwinKind.PERSON,
      state: DigitalTwinState.ACTIVE,
    };
    const expectedDt = {
      id: dt.id,
      tenantId: dt.tenantId,
      kind: DigitalTwinKind.PERSON,
      state: DigitalTwinState.ACTIVE,
      tags: [],
    };
    const appSpaceId = v4();
    const applicationId = v4();
    const customerId = v4();

    ['subject', 'impersonated'].forEach(async (dtType) => {
      const mockResponse = TokenIntrospectResponse.fromJson({
        active: true,
        identityToken: {
          customerId: customerId,
          appSpaceId: appSpaceId,
          applicationId: applicationId,
          authenticationTime: new Date().toISOString(),
          expireTime: new Date(Date.now() + 1 * 3600 * 1000).toISOString(),
          issueTime: new Date().toISOString(),
          providerInfo: [{ type: ProviderType.PASSWORD, issuer: 'indykite.id' }],
        },
      });

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
      const mockExt = mockResponse.tokenInfo.oneofKind;

      if (mockExt == 'identityToken') {
        let expected = {
          active: mockResponse.active,
          tokenInfo: {
            oneofKind: 'identityToken',
            identityToken: {
              customerId: mockResponse.tokenInfo.identityToken.customerId,
              appSpaceId: mockResponse.tokenInfo.identityToken.appSpaceId,
              applicationId: mockResponse.tokenInfo.identityToken.applicationId,
              authenticationTime: mockResponse.tokenInfo.identityToken.authenticationTime,
              expireTime: mockResponse.tokenInfo.identityToken.expireTime,
              issueTime: mockResponse.tokenInfo.identityToken.issueTime,
              providerInfo: mockResponse.tokenInfo.identityToken.providerInfo,
            },
          } as IdentityTokenInfo,
        };
        const ext: { [key: string]: unknown } = {};
        ext[dtType] = expectedDt;

        expected = Object.assign(expected, ext);
        const resp = await sdk.introspectToken(userToken);
        expect(mockFunc).toHaveBeenCalled();
        expect(resp.active).toEqual(expected.active);
        expect(resp.customerId).toEqual(expected.tokenInfo.tokenInfo?.identityToken.customerId);
        expect(resp.providerInfo).toEqual(expected.tokenInfo.tokenInfo?.identityToken.providerInfo);
        expect(resp.authenticationTime).toEqual(
          expected.tokenInfo.tokenInfo?.identityToken.authenticationTime,
        );
      }
    });
  });
});
