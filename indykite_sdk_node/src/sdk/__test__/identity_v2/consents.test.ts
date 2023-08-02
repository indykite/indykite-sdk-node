import { CallOptions, Metadata } from '@grpc/grpc-js';
import { ClientReadableStream, ServiceError, SurfaceCall } from '@grpc/grpc-js/build/src/call';
import { Status } from '@grpc/grpc-js/build/src/constants';
import {
  CreateConsentResponse,
  ListConsentsResponse,
  RevokeConsentResponse,
} from '../../../grpc/indykite/identity/v1beta2/identity_management_api';
import { IdentityClientV2 } from '../../identity_v2';
import { applicationTokenMock } from '../../utils/test_utils';
import { Readable } from 'stream';

describe('createConsent', () => {
  describe('when no error is returned', () => {
    const createConsentResponse: CreateConsentResponse = {
      consentId: 'consent-id',
    };
    let createConsentSpy: jest.SpyInstance;
    let sdk: IdentityClientV2;
    let response: CreateConsentResponse;

    beforeEach(async () => {
      sdk = await IdentityClientV2.createInstance(JSON.stringify(applicationTokenMock));
      createConsentSpy = jest
        .spyOn(sdk['client'], 'createConsent')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response: CreateConsentResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(null, createConsentResponse);
            }
            return {} as SurfaceCall;
          },
        );
      response = await sdk.createConsent({
        piiPrincipalId: 'principal-id',
        piiProcessorId: 'processor-id',
        properties: ['property'],
      });
    });

    it('sends correct request', () => {
      expect(createConsentSpy).toBeCalledWith(
        {
          piiPrincipalId: 'principal-id',
          piiProcessorId: 'processor-id',
          properties: ['property'],
        },
        expect.any(Function),
      );
    });

    it('gets correct response', () => {
      expect(response).toEqual(createConsentResponse);
    });
  });

  describe('when an error is returned', () => {
    const error = {
      code: Status.NOT_FOUND,
      details: 'DETAILS',
      metadata: {},
    } as ServiceError;
    let thrownError: Error;

    beforeEach(async () => {
      const sdk = await IdentityClientV2.createInstance(JSON.stringify(applicationTokenMock));
      jest
        .spyOn(sdk['client'], 'createConsent')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response?: CreateConsentResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(error);
            }
            return {} as SurfaceCall;
          },
        );
      sdk
        .createConsent({
          piiPrincipalId: 'principal-id',
          piiProcessorId: 'processor-id',
          properties: ['property'],
        })
        .catch((err) => {
          thrownError = err;
        });
    });

    it('throws an error', () => {
      expect(thrownError).toBe(error);
    });
  });

  describe('when no response is returned', () => {
    let thrownError: Error;

    beforeEach(async () => {
      const sdk = await IdentityClientV2.createInstance(JSON.stringify(applicationTokenMock));
      jest
        .spyOn(sdk['client'], 'createConsent')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response?: CreateConsentResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(null);
            }
            return {} as SurfaceCall;
          },
        );
      sdk
        .createConsent({
          piiPrincipalId: 'principal-id',
          piiProcessorId: 'processor-id',
          properties: ['property'],
        })
        .catch((err) => {
          thrownError = err;
        });
    });

    it('throws an error', () => {
      expect(thrownError.message).toBe('Missing create consent response');
    });
  });
});

describe('revokeConsent', () => {
  describe('when no error is returned', () => {
    const revokeConsentResponse: RevokeConsentResponse = {
      consentId: 'consent-id',
    };
    let revokeConsentSpy: jest.SpyInstance;
    let sdk: IdentityClientV2;
    let response: RevokeConsentResponse;

    beforeEach(async () => {
      sdk = await IdentityClientV2.createInstance(JSON.stringify(applicationTokenMock));
      revokeConsentSpy = jest
        .spyOn(sdk['client'], 'revokeConsent')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response: RevokeConsentResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(null, revokeConsentResponse);
            }
            return {} as SurfaceCall;
          },
        );
      response = await sdk.revokeConsent({
        piiPrincipalId: 'principal-od',
        consentIds: ['consent-id'],
      });
    });

    it('sends correct request', () => {
      expect(revokeConsentSpy).toBeCalledWith(
        {
          piiPrincipalId: 'principal-od',
          consentIds: ['consent-id'],
        },
        expect.any(Function),
      );
    });

    it('gets correct response', () => {
      expect(response).toEqual(revokeConsentResponse);
    });
  });

  describe('when an error is returned', () => {
    const error = {
      code: Status.NOT_FOUND,
      details: 'DETAILS',
      metadata: {},
    } as ServiceError;
    let thrownError: Error;

    beforeEach(async () => {
      const sdk = await IdentityClientV2.createInstance(JSON.stringify(applicationTokenMock));
      jest
        .spyOn(sdk['client'], 'revokeConsent')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response?: RevokeConsentResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(error);
            }
            return {} as SurfaceCall;
          },
        );
      sdk
        .revokeConsent({
          piiPrincipalId: 'principal-od',
          consentIds: ['consent-id'],
        })
        .catch((err) => {
          thrownError = err;
        });
    });

    it('throws an error', () => {
      expect(thrownError).toBe(error);
    });
  });

  describe('when no response is returned', () => {
    let thrownError: Error;

    beforeEach(async () => {
      const sdk = await IdentityClientV2.createInstance(JSON.stringify(applicationTokenMock));
      jest
        .spyOn(sdk['client'], 'revokeConsent')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response?: RevokeConsentResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(null);
            }
            return {} as SurfaceCall;
          },
        );
      sdk
        .revokeConsent({
          piiPrincipalId: 'principal-od',
          consentIds: ['consent-id'],
        })
        .catch((err) => {
          thrownError = err;
        });
    });

    it('throws an error', () => {
      expect(thrownError.message).toBe('Missing revoke consent response');
    });
  });
});

describe('listConsents', () => {
  describe('when no error is returned', () => {
    const listConsentsResponse: ListConsentsResponse = {
      consentReceipt: {
        piiPrincipalId: 'principal-id',
        items: [
          {
            consentId: 'consent-id',
            properties: ['property'],
          },
        ],
      },
    };
    let listConsentsSpy: jest.SpyInstance;
    let sdk: IdentityClientV2;
    let response: ListConsentsResponse[];

    beforeEach(async () => {
      sdk = await IdentityClientV2.createInstance(JSON.stringify(applicationTokenMock));
      listConsentsSpy = jest
        .spyOn(sdk['client'], 'listConsents')
        .mockImplementation((): ClientReadableStream<ListConsentsResponse> => {
          const result = new Readable({
            read: () => {
              // Nothing needed to be done here
            },
            objectMode: true,
          });

          result.push(listConsentsResponse);
          result.push(null);

          return result as ClientReadableStream<ListConsentsResponse>;
        });

      response = [];
      return new Promise<void>((resolve, reject) => {
        const stream = sdk.listConsents({
          piiPrincipalId: 'principal-id',
        });
        stream.on('data', (data) => {
          response.push(data);
        });
        stream.on('end', resolve);
        stream.on('error', reject);
      });
    });

    it('sends correct request', () => {
      expect(listConsentsSpy).toBeCalledWith({
        piiPrincipalId: 'principal-id',
      });
    });

    it('gets correct response', () => {
      expect(response).toEqual([listConsentsResponse]);
    });
  });

  describe('when incorrect value is returned', () => {
    const listConsentsResponse = {
      unexpectedValue: 11,
    };
    let listConsentsSpy: jest.SpyInstance;
    let sdk: IdentityClientV2;
    let response: ListConsentsResponse[];

    beforeEach(async () => {
      sdk = await IdentityClientV2.createInstance(JSON.stringify(applicationTokenMock));
      listConsentsSpy = jest
        .spyOn(sdk['client'], 'listConsents')
        .mockImplementation((): ClientReadableStream<ListConsentsResponse> => {
          const result = new Readable({
            read: () => {
              // Nothing needed to be done here
            },
            objectMode: true,
          });

          result.push(listConsentsResponse);
          result.push(null);

          return result as ClientReadableStream<ListConsentsResponse>;
        });

      response = [];
      return new Promise<void>((resolve, reject) => {
        const stream = sdk.listConsents({
          piiPrincipalId: 'principal-id',
        });
        stream.on('data', (data) => {
          response.push(data);
        });
        stream.on('end', resolve);
        stream.on('error', reject);
      });
    });

    it('sends correct request', () => {
      expect(listConsentsSpy).toBeCalledWith({
        piiPrincipalId: 'principal-id',
      });
    });

    it('gets empty response', () => {
      expect(response).toEqual([]);
    });
  });

  describe('when an error is returned', () => {
    const error = {
      code: Status.NOT_FOUND,
      details: 'DETAILS',
      metadata: {},
    } as ServiceError;
    let thrownError: Error;

    beforeEach(async () => {
      const sdk = await IdentityClientV2.createInstance(JSON.stringify(applicationTokenMock));
      jest
        .spyOn(sdk['client'], 'listConsents')
        .mockImplementation((): ClientReadableStream<ListConsentsResponse> => {
          const result = new Readable({
            read: () => {
              // Nothing needed to be done here
            },
            objectMode: true,
          });

          result.destroy(error);

          return result as ClientReadableStream<ListConsentsResponse>;
        });

      return new Promise<void>((resolve) => {
        const stream = sdk.listConsents({
          piiPrincipalId: 'principal-id',
        });
        stream.on('error', (err) => {
          thrownError = err;
          resolve();
        });
      });
    });

    it('throws an error', () => {
      expect(thrownError).toBe(error);
    });
  });
});
