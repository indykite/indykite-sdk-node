import { CallOptions, Metadata } from '@grpc/grpc-js';
import { ServiceError, SurfaceCall } from '@grpc/grpc-js/build/src/call';
import { Status } from '@grpc/grpc-js/build/src/constants';
import { ReadCustomerResponse } from '../../../grpc/indykite/config/v1beta1/config_management_api';
import { ConfigClient } from '../../config';
import { Customer } from '../../model/config/customer';
import { serviceAccountTokenMock } from '../../utils/test_utils';

afterEach(() => {
  jest.restoreAllMocks();
});

describe('readCustomerById', () => {
  describe('when no error is returned', () => {
    let customer: Customer;
    let readCustomerSpy: jest.SpyInstance;

    beforeEach(async () => {
      const sdk = await ConfigClient.createInstance(JSON.stringify(serviceAccountTokenMock));
      readCustomerSpy = jest
        .spyOn(sdk['client'], 'readCustomer')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response: ReadCustomerResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(null, {
                customer: {
                  id: 'customer-id',
                  name: 'customer-name',
                  displayName: 'Customer Name',
                  etag: '123456',
                },
              });
            }
            return {} as SurfaceCall;
          },
        );
      customer = await sdk.readCustomerById('customer-id-request');
    });

    it('sends correct request', () => {
      expect(readCustomerSpy).toBeCalledWith(
        {
          identifier: {
            oneofKind: 'id',
            id: 'customer-id-request',
          },
          bookmarks: [],
        },
        expect.any(Function),
      );
    });

    it('returns a correct instance', () => {
      expect(customer.id).toBe('customer-id');
      expect(customer.name).toBe('customer-name');
      expect(customer.displayName).toBe('Customer Name');
      expect(customer.etag).toBe('123456');
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
      const sdk = await ConfigClient.createInstance(JSON.stringify(serviceAccountTokenMock));
      jest
        .spyOn(sdk['client'], 'readCustomer')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response: ReadCustomerResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(error, {});
            }
            return {} as SurfaceCall;
          },
        );
      sdk.readCustomerById('customer-id-request').catch((err) => {
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
      const sdk = await ConfigClient.createInstance(JSON.stringify(serviceAccountTokenMock));
      jest
        .spyOn(sdk['client'], 'readCustomer')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response?: ReadCustomerResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(null, undefined);
            }
            return {} as SurfaceCall;
          },
        );
      sdk.readCustomerById('customer-id-request').catch((err) => {
        thrownError = err;
      });
    });

    it('throws an error', () => {
      expect(thrownError.message).toBe('No customer response');
    });
  });
});

describe('readCustomerByName', () => {
  describe('when no error is returned', () => {
    let customer: Customer;
    let readCustomerSpy: jest.SpyInstance;

    beforeEach(async () => {
      const sdk = await ConfigClient.createInstance(JSON.stringify(serviceAccountTokenMock));
      readCustomerSpy = jest
        .spyOn(sdk['client'], 'readCustomer')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response: ReadCustomerResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(null, {
                customer: {
                  id: 'customer-id',
                  name: 'customer-name',
                  displayName: 'Customer Name',
                  etag: '123456',
                },
              });
            }
            return {} as SurfaceCall;
          },
        );
      customer = await sdk.readCustomerByName('customer-name-request');
    });

    it('sends correct request', () => {
      expect(readCustomerSpy).toBeCalledWith(
        {
          identifier: {
            oneofKind: 'name',
            name: 'customer-name-request',
          },
          bookmarks: [],
        },
        expect.any(Function),
      );
    });

    it('returns a correct instance', () => {
      expect(customer.id).toBe('customer-id');
      expect(customer.name).toBe('customer-name');
      expect(customer.displayName).toBe('Customer Name');
      expect(customer.etag).toBe('123456');
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
      const sdk = await ConfigClient.createInstance(JSON.stringify(serviceAccountTokenMock));
      jest
        .spyOn(sdk['client'], 'readCustomer')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response: ReadCustomerResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(error, {});
            }
            return {} as SurfaceCall;
          },
        );
      sdk.readCustomerByName('customer-name-request').catch((err) => {
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
      const sdk = await ConfigClient.createInstance(JSON.stringify(serviceAccountTokenMock));
      jest
        .spyOn(sdk['client'], 'readCustomer')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response?: ReadCustomerResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(null, undefined);
            }
            return {} as SurfaceCall;
          },
        );
      sdk.readCustomerByName('customer-name-request').catch((err) => {
        thrownError = err;
      });
    });

    it('throws an error', () => {
      expect(thrownError.message).toBe('No customer response');
    });
  });
});
