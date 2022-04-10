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
import { Utils } from '../utils/utils';

let sdk: IdentityClient;
const applicationToken = {
  appSpaceId: '696e6479-6b69-4465-8000-010f00000000',
  appAgentId: '696e6479-6b69-4465-8000-050f00000000',
  endpoint: 'jarvis.local:8043',
  privateKeyJWK: {
    kty: 'EC',
    d: 'WNzV013IthOWgjef4eNVXzTQUYy6hb6DD5riu_5SZNI',
    use: 'sig',
    crv: 'P-256',
    kid: 'EfUEiFnOzA5PCp8SSksp7iXv7cHRehCsIGo6NAQ9H7w',
    x: 'sMeLa9xExlGkmo6tr2KSv4rqbYXdAM1RBkTNehZ_XfQ',
    y: 'FqBmruVIbVykGMWjVcv4VhN_XbMxW3rLqRcJ8mAUOdY',
    alg: 'ES256',
  },
};
const userToken =
  'eyJhbGciOiJFUzI1NiIsImN0eSI6IkpXVCIsImtpZCI6ImtRWnIyYUk1TUUwQ0o1ejR3U1AwQk9oNkRNOTI2QTVla2tfLUYtYmJBVnciLCJub25jZSI6IndiOHdnU0lTSlJ0ZFhUMDhXMU5NM3ciLCJ0eXAiOiJKV1QifQ.eyJhdWQiOlsiNjk2ZTY0NzktNmI2OS00NDY1LTgwMDAtMDIwMDAwMDAwMDAwIl0sImV4cCI6MTYyNTkwOTQ1MSwiaWF0IjoxNjI1OTA1ODUxLCJpc3MiOiJodHRwczovL2phcnZpcy1kZXYuaW5keWtpdGUuY29tL29hdXRoMi82OTZlNjQ3OS02YjY5LTQ0NjUtODAwMC0wMTAwMDAwMDAwMDAiLCJqdGkiOiI2ZmQ4NDI1NC1mODMwLTRiMzYtYWQ2YS1jZWQ4YWIxZGZmY2EjMCIsIm5iZiI6MTYyNTkwNTg1MSwic3ViIjoiNjk2ZTY0NzktNmI2OS00NDY1LTgwMDAtMDAwMDAwMDk5MDAyIn0.TPDZXU9peGYwBPrtwf-HfToIFsy1sbgjTHEXxJZqTFaOPWmlWPIyIDN6jMqNeuEI7BHG53JVAFzzh-65vi4R9Q';

beforeAll(async () => {
  sdk = await IdentityClient.createInstance(applicationToken);
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

    ['subject', 'impersonated'].forEach(async (dtType) => {
      const mockResponse = TokenIntrospectResponse.fromJson({
        active: true,
        tokenInfo: {
          appSpaceId: Utils.uuidToBase64(applicationToken.appSpaceId),
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
          appSpaceId: applicationToken.appSpaceId,
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
