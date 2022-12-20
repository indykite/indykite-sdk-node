import {
  CreateConsentRequest,
  CreateConsentResponse,
} from '../../../grpc/indykite/identity/v1beta2/identity_management_api';
import { IdentityClient } from '../../identity';
import { applicationTokenMock, generateRandomGID } from '../../utils/test_utils';
import { CallOptions, Metadata, ServiceError } from '@grpc/grpc-js';
import { SurfaceCall } from '@grpc/grpc-js/build/src/call';
import { Status } from '@grpc/grpc-js/build/src/constants';
import { SdkError, SdkErrorCode } from '../../error';

let sdk: IdentityClient;

beforeAll(async () => {
  sdk = await IdentityClient.createInstance(applicationTokenMock);
});

afterEach(() => {
  jest.resetAllMocks();
});

describe('createConsent', () => {
  const piiProcessorId = generateRandomGID();
  const piiPrincipalId = generateRandomGID();
  const properties = ['ice_cream'];

  describe('when the response is successful', () => {
    const consentId = 'consent-123';

    beforeEach(async () => {
      const mockFunc = jest.fn(
        (
          request: CreateConsentRequest,
          callback:
            | Metadata
            | CallOptions
            | ((error: ServiceError | null, response?: CreateConsentResponse) => void),
        ): SurfaceCall => {
          if (typeof callback === 'function') callback(null, { consentId });
          return {} as SurfaceCall;
        },
      );

      jest.spyOn(sdk['client'], 'createConsent').mockImplementation(mockFunc);
    });

    it('should create a consent', async () => {
      const result = await sdk.createConsent(piiProcessorId, piiPrincipalId, properties);
      expect(result).toEqual({ consentId });
    });
  });

  describe('when the response contains an error', () => {
    const error = {
      code: Status.NOT_FOUND,
      details: 'no details',
      metadata: {},
    } as ServiceError;

    beforeEach(async () => {
      const mockFunc = jest.fn(
        (
          request: CreateConsentRequest,
          callback:
            | Metadata
            | CallOptions
            | ((error: ServiceError | null, response?: CreateConsentResponse) => void),
        ): SurfaceCall => {
          if (typeof callback === 'function') callback(error);
          return {} as SurfaceCall;
        },
      );

      jest.spyOn(sdk['client'], 'createConsent').mockImplementation(mockFunc);
    });

    it('throws an error', async () => {
      let caughtError;
      try {
        await sdk.createConsent(piiProcessorId, piiPrincipalId, properties);
      } catch (err) {
        caughtError = err;
      }
      expect(caughtError).toBe(error);
    });
  });

  describe('when the response does not containt any value', () => {
    let caughtError: SdkError;

    beforeEach(() => {
      const mockFunc = jest.fn(
        (
          request: CreateConsentRequest,
          callback:
            | Metadata
            | CallOptions
            | ((error: ServiceError | null, response?: CreateConsentResponse) => void),
        ): SurfaceCall => {
          if (typeof callback === 'function') callback(null);
          return {} as SurfaceCall;
        },
      );

      jest.spyOn(sdk['client'], 'createConsent').mockImplementation(mockFunc);
    });

    it('throws an error', async () => {
      try {
        await sdk.createConsent(piiProcessorId, piiPrincipalId, properties);
      } catch (err) {
        caughtError = err as SdkError;
      }
      expect(caughtError.code).toEqual(SdkErrorCode.SDK_CODE_1);
      expect(caughtError.message).toEqual('Missing create consent response');
    });
  });
});
