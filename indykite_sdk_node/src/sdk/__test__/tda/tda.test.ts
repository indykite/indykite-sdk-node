import {
  DataAccessRequest,
  DataAccessResponse,
  GrantConsentRequest,
  GrantConsentResponse,
  ListConsentsRequest,
  ListConsentsResponse,
  RevokeConsentRequest,
  RevokeConsentResponse,
} from '../../../grpc/indykite/tda/v1beta1/trusted_data_access_api';
import { TrustedDataAccessClient } from '../../tda';
import { User } from '../../../grpc/indykite/knowledge/objects/v1beta1/ikg';
import { Consent, TrustedDataNode } from '../../../grpc/indykite/tda/v1beta1/model';
import { applicationTokenMock, generateRandomGID } from '../../utils/test_utils';
import { CallOptions, Metadata, ServiceError } from '@grpc/grpc-js';
import { SurfaceCall } from '@grpc/grpc-js/build/src/call';
import { Status } from '@grpc/grpc-js/build/src/constants';
import { SdkError, SdkErrorCode } from '../../error';

let sdk: TrustedDataAccessClient;
const error = {
  code: Status.NOT_FOUND,
  details: 'no details',
  metadata: {},
} as ServiceError;

beforeAll(async () => {
  sdk = await TrustedDataAccessClient.createInstance(applicationTokenMock);
});

afterEach(() => {
  jest.resetAllMocks();
});

describe('grantConsent', () => {
  const userId = generateRandomGID();
  const user = {
    user: {
      oneofKind: 'userId',
      userId: userId,
    },
  } as User;
  const consentId = generateRandomGID();
  const validityPeriod = '86400';

  describe('when the response is successful', () => {
    const propertiesGrantedCount = '3';

    beforeEach(async () => {
      const mockFunc = jest.fn(
        (
          request: GrantConsentRequest,
          callback:
            | Metadata
            | CallOptions
            | ((error: ServiceError | null, response?: GrantConsentResponse) => void),
        ): SurfaceCall => {
          if (typeof callback === 'function') callback(null, { propertiesGrantedCount });
          return {} as SurfaceCall;
        },
      );

      jest.spyOn(sdk['client'], 'grantConsent').mockImplementation(mockFunc);
    });

    it('should grant a consent', async () => {
      const result = await sdk.grantConsent(user, consentId, validityPeriod);
      expect(result).toEqual({ propertiesGrantedCount });
    });
  });

  describe('when the response contains an error', () => {
    beforeEach(async () => {
      const mockFunc = jest.fn(
        (
          request: GrantConsentRequest,
          callback:
            | Metadata
            | CallOptions
            | ((error: ServiceError | null, response?: GrantConsentResponse) => void),
        ): SurfaceCall => {
          if (typeof callback === 'function') callback(error);
          return {} as SurfaceCall;
        },
      );

      jest.spyOn(sdk['client'], 'grantConsent').mockImplementation(mockFunc);
    });

    it('throws an error', async () => {
      let caughtError;
      try {
        await sdk.grantConsent(user, consentId, validityPeriod);
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
          request: GrantConsentRequest,
          callback:
            | Metadata
            | CallOptions
            | ((error: ServiceError | null, response?: GrantConsentResponse) => void),
        ): SurfaceCall => {
          if (typeof callback === 'function') callback(null);
          return {} as SurfaceCall;
        },
      );

      jest.spyOn(sdk['client'], 'grantConsent').mockImplementation(mockFunc);
    });

    it('throws an error', async () => {
      try {
        await sdk.grantConsent(user, consentId, validityPeriod);
      } catch (err) {
        caughtError = err as SdkError;
      }
      expect(caughtError.code).toEqual(SdkErrorCode.SDK_CODE_1);
      expect(caughtError.message).toEqual('Missing grant consent response');
    });
  });
});

describe('revokeConsent', () => {
  const userId = generateRandomGID();
  const user = {
    user: {
      oneofKind: 'userId',
      userId: userId,
    },
  } as User;
  const consentId = generateRandomGID();

  describe('when the response is successful', () => {
    const consentId = 'consent-123';

    beforeEach(async () => {
      const mockFunc = jest.fn(
        (
          request: RevokeConsentRequest,
          callback:
            | Metadata
            | CallOptions
            | ((error: ServiceError | null, response?: RevokeConsentResponse) => void),
        ): SurfaceCall => {
          if (typeof callback === 'function') callback(null, { consentId });
          return {} as SurfaceCall;
        },
      );

      jest.spyOn(sdk['client'], 'revokeConsent').mockImplementation(mockFunc);
    });

    it('should revoke a consent', async () => {
      const result = await sdk.revokeConsent(user, consentId);
      expect(result).toEqual({ consentId });
    });
  });

  describe('when the response contains an error', () => {
    beforeEach(async () => {
      const mockFunc = jest.fn(
        (
          request: RevokeConsentRequest,
          callback:
            | Metadata
            | CallOptions
            | ((error: ServiceError | null, response?: RevokeConsentResponse) => void),
        ): SurfaceCall => {
          if (typeof callback === 'function') callback(error);
          return {} as SurfaceCall;
        },
      );

      jest.spyOn(sdk['client'], 'revokeConsent').mockImplementation(mockFunc);
    });

    it('throws an error', async () => {
      let caughtError;
      try {
        await sdk.revokeConsent(user, consentId);
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
          request: RevokeConsentRequest,
          callback:
            | Metadata
            | CallOptions
            | ((error: ServiceError | null, response?: RevokeConsentResponse) => void),
        ): SurfaceCall => {
          if (typeof callback === 'function') callback(null);
          return {} as SurfaceCall;
        },
      );

      jest.spyOn(sdk['client'], 'revokeConsent').mockImplementation(mockFunc);
    });

    it('throws an error', async () => {
      try {
        await sdk.revokeConsent(user, consentId);
      } catch (err) {
        caughtError = err as SdkError;
      }
      expect(caughtError.code).toEqual(SdkErrorCode.SDK_CODE_1);
      expect(caughtError.message).toEqual('Missing revoke consent response');
    });
  });
});

describe('listConsents', () => {
  const userId = generateRandomGID();
  const user = {
    user: {
      oneofKind: 'userId',
      userId: userId,
    },
  } as User;
  const applicationId = generateRandomGID();

  describe('when the response is successful', () => {
    const consents = [
      {
        id: 'consent-123',
        properties: ['email'],
      } as Consent,
    ];

    beforeEach(async () => {
      const mockFunc = jest.fn(
        (
          request: ListConsentsRequest,
          callback:
            | Metadata
            | CallOptions
            | ((error: ServiceError | null, response?: ListConsentsResponse) => void),
        ): SurfaceCall => {
          if (typeof callback === 'function') callback(null, { consents });
          return {} as SurfaceCall;
        },
      );

      jest.spyOn(sdk['client'], 'listConsents').mockImplementation(mockFunc);
    });

    it('should list consents', async () => {
      const result = await sdk.listConsents(user, applicationId);
      expect(result).toEqual(consents);
    });
  });

  describe('when the response contains an error', () => {
    beforeEach(async () => {
      const mockFunc = jest.fn(
        (
          request: ListConsentsRequest,
          callback:
            | Metadata
            | CallOptions
            | ((error: ServiceError | null, response?: ListConsentsResponse) => void),
        ): SurfaceCall => {
          if (typeof callback === 'function') callback(error);
          return {} as SurfaceCall;
        },
      );

      jest.spyOn(sdk['client'], 'listConsents').mockImplementation(mockFunc);
    });

    it('throws an error', async () => {
      let caughtError;
      try {
        await sdk.listConsents(user, applicationId);
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
          request: ListConsentsRequest,
          callback:
            | Metadata
            | CallOptions
            | ((error: ServiceError | null, response?: ListConsentsResponse) => void),
        ): SurfaceCall => {
          if (typeof callback === 'function') callback(null);
          return {} as SurfaceCall;
        },
      );

      jest.spyOn(sdk['client'], 'listConsents').mockImplementation(mockFunc);
    });

    it('throws an error', async () => {
      try {
        await sdk.listConsents(user, applicationId);
      } catch (err) {
        caughtError = err as SdkError;
      }
      expect(caughtError.code).toEqual(SdkErrorCode.SDK_CODE_1);
      expect(caughtError.message).toEqual('Missing list consents response');
    });
  });
});

describe('dataAccess', () => {
  const userId = generateRandomGID();
  const user = {
    user: {
      oneofKind: 'userId',
      userId: userId,
    },
  } as User;
  const applicationId = generateRandomGID();
  const consentId = generateRandomGID();

  describe('when the response is successful', () => {
    const response = {
      nodes: [
        {
          id: 'gid:node-123',
          externalId: 'sdfryeh',
          type: 'Person',
          isIdentity: true,
          nodes: [
            {
              id: 'gid:node-234',
              externalId: 'njmkiol',
              type: 'Car',
            } as TrustedDataNode,
          ],
        } as TrustedDataNode,
      ],
    } as DataAccessResponse;

    beforeEach(async () => {
      const mockFunc = jest.fn(
        (
          request: DataAccessRequest,
          callback:
            | Metadata
            | CallOptions
            | ((error: ServiceError | null, response?: DataAccessResponse) => void),
        ): SurfaceCall => {
          if (typeof callback === 'function') callback(null, response);
          return {} as SurfaceCall;
        },
      );

      jest.spyOn(sdk['client'], 'dataAccess').mockImplementation(mockFunc);
    });

    it('should access data', async () => {
      const result = await sdk.dataAccess(consentId, applicationId, user);
      expect(result).toEqual(response);
    });
  });

  describe('when the response contains an error', () => {
    beforeEach(async () => {
      const mockFunc = jest.fn(
        (
          request: DataAccessRequest,
          callback:
            | Metadata
            | CallOptions
            | ((error: ServiceError | null, response?: DataAccessResponse) => void),
        ): SurfaceCall => {
          if (typeof callback === 'function') callback(error);
          return {} as SurfaceCall;
        },
      );

      jest.spyOn(sdk['client'], 'dataAccess').mockImplementation(mockFunc);
    });

    it('throws an error', async () => {
      let caughtError;
      try {
        await sdk.dataAccess(consentId, applicationId, user);
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
          request: DataAccessRequest,
          callback:
            | Metadata
            | CallOptions
            | ((error: ServiceError | null, response?: DataAccessResponse) => void),
        ): SurfaceCall => {
          if (typeof callback === 'function') callback(null);
          return {} as SurfaceCall;
        },
      );

      jest.spyOn(sdk['client'], 'dataAccess').mockImplementation(mockFunc);
    });

    it('throws an error', async () => {
      try {
        await sdk.dataAccess(consentId, applicationId, user);
      } catch (err) {
        caughtError = err as SdkError;
      }
      expect(caughtError.code).toEqual(SdkErrorCode.SDK_CODE_1);
      expect(caughtError.message).toEqual('Missing data access response');
    });
  });
});
