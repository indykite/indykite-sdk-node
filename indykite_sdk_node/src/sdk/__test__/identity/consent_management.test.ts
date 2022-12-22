import {
  CreateConsentRequest,
  CreateConsentResponse,
  ListConsentsResponse,
  RevokeConsentRequest,
  RevokeConsentResponse,
} from '../../../grpc/indykite/identity/v1beta2/identity_management_api';
import { IdentityClient } from '../../identity';
import { applicationTokenMock, generateRandomGID } from '../../utils/test_utils';
import { CallOptions, Metadata, ServiceError } from '@grpc/grpc-js';
import { ClientReadableStream, SurfaceCall } from '@grpc/grpc-js/build/src/call';
import { Status } from '@grpc/grpc-js/build/src/constants';
import { SdkError, SdkErrorCode } from '../../error';
import EventEmitter = require('events');
import * as sdkTypes from '../../model';
import { Utils } from '../../utils/utils';

let sdk: IdentityClient;
const error = {
  code: Status.NOT_FOUND,
  details: 'no details',
  metadata: {},
} as ServiceError;

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

describe('revokeConsent', () => {
  const piiPrincipalId = generateRandomGID();
  const consentIds = ['consent-123'];

  beforeEach(async () => {
    const mockFunc = jest.fn(
      (
        request: RevokeConsentRequest,
        callback:
          | Metadata
          | CallOptions
          | ((error: ServiceError | null, response?: RevokeConsentResponse) => void),
      ): SurfaceCall => {
        if (typeof callback === 'function') callback(null, {});
        return {} as SurfaceCall;
      },
    );

    jest.spyOn(sdk['client'], 'revokeConsent').mockImplementation(mockFunc);
  });

  it('should revoke a consent', async () => {
    const result = await sdk.revokeConsent(piiPrincipalId, consentIds);
    expect(result).toBeUndefined();
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
        await sdk.revokeConsent(piiPrincipalId, consentIds);
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
        await sdk.revokeConsent(piiPrincipalId, consentIds);
      } catch (err) {
        caughtError = err as SdkError;
      }
      expect(caughtError.code).toEqual(SdkErrorCode.SDK_CODE_1);
      expect(caughtError.message).toEqual('Missing revoke consent response');
    });
  });
});

describe('listConsents', () => {
  const piiPrincipalId = generateRandomGID();

  describe('when no error is returned', () => {
    let response: { consents: sdkTypes.Consent[] };
    let listConsentsSpy: jest.SpyInstance;

    beforeEach(async () => {
      const readMock = jest
        .fn()
        .mockImplementationOnce(() => ({
          consentReceipt: {
            piiPrincipalId,
            items: [
              {
                consentId: 'consent-123',
                properties: ['email'],
                consentedAtTime: Utils.dateToTimestamp(new Date(2022, 2, 15, 13, 12)),
                piiController: {
                  piiControllerId: 'pii-controller-123',
                  displayName: 'Pii Controller',
                },
              },
            ],
            piiProcessor: {
              piiProcessorId: 'pii-processor-123',
              displayName: 'Pii Processor',
              description: 'description',
              owner: 'owner',
              policyUri: 'policyUri',
              termsOfServiceUri: 'https://example.com/terms',
              clientUri: 'https;//example.com/client',
              logoUri: 'https://example.com/logo.png',
              userSupportEmailAddress: 'support@example.com',
              additionalContacts: ['contact@example.com'],
            },
          },
        }))
        .mockImplementationOnce(() => null);
      const eventEmitter = Object.assign(new EventEmitter(), { read: readMock });
      listConsentsSpy = jest.spyOn(sdk['client'], 'listConsents').mockImplementation(() => {
        setTimeout(() => eventEmitter.emit('readable'), 0);
        setTimeout(() => eventEmitter.emit('readable'), 0);
        setTimeout(() => eventEmitter.emit('close'), 0);
        return eventEmitter as unknown as ClientReadableStream<ListConsentsResponse>;
      });

      response = await sdk.listConsents(piiPrincipalId);
      console.log(response);
    });

    it('sends correct request', async () => {
      expect(listConsentsSpy).toBeCalledWith({
        piiPrincipalId,
      });
    });

    it('returs a correct response', async () => {
      const consents = response.consents;
      expect(consents.length).toBe(1);
      expect(consents[0].piiPrincipalId).toBe(piiPrincipalId);
      expect(consents[0].items.length).toBe(1);
      expect(consents[0].items[0].consentId).toBe('consent-123');
      expect(consents[0].items[0].properties).toEqual(['email']);
      expect(consents[0].items[0].consentedAt?.toString()).toBe(
        new Date(2022, 2, 15, 13, 12).toString(),
      );
      expect(consents[0].items[0].piiController?.piiControllerId).toBe('pii-controller-123');
      expect(consents[0].items[0].piiController?.displayName).toBe('Pii Controller');
      expect(consents[0].piiProcessor?.piiProcessorId).toBe('pii-processor-123');
      expect(consents[0].piiProcessor?.displayName).toBe('Pii Processor');
      expect(consents[0].piiProcessor?.description).toBe('description');
      expect(consents[0].piiProcessor?.owner).toBe('owner');
      expect(consents[0].piiProcessor?.policyUri).toBe('policyUri');
      expect(consents[0].piiProcessor?.termsOfServiceUri).toBe('https://example.com/terms');
      expect(consents[0].piiProcessor?.clientUri).toBe('https;//example.com/client');
      expect(consents[0].piiProcessor?.logoUri).toBe('https://example.com/logo.png');
      expect(consents[0].piiProcessor?.userSupportEmailAddress).toBe('support@example.com');
      expect(consents[0].piiProcessor?.additionalContacts.length).toEqual(1);
      expect(consents[0].piiProcessor?.additionalContacts[0]).toBe('contact@example.com');
    });
  });

  describe('when an error is returned', () => {
    let thrownError: Error;

    beforeEach(async () => {
      const eventEmitter = Object.assign(new EventEmitter(), { read: jest.fn() });
      jest.spyOn(sdk['client'], 'listConsents').mockImplementation(() => {
        setTimeout(() => eventEmitter.emit('error', error), 0);
        return eventEmitter as unknown as ClientReadableStream<ListConsentsResponse>;
      });

      return sdk.listConsents(piiPrincipalId).catch((err) => (thrownError = err));
    });

    it('throws an error', () => {
      expect(thrownError).toBe(error);
    });
  });
});
