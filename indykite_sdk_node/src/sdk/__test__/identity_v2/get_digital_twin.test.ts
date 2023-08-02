import { CallOptions, Metadata } from '@grpc/grpc-js';
import { ServiceError, SurfaceCall } from '@grpc/grpc-js/build/src/call';
import { Status } from '@grpc/grpc-js/build/src/constants';
import { GetDigitalTwinResponse } from '../../../grpc/indykite/identity/v1beta2/identity_management_api';
import { IdentityClientV2 } from '../../identity_v2';
import { applicationTokenMock } from '../../utils/test_utils';
import { DigitalTwinKind, DigitalTwinState } from '../../../grpc/indykite/identity/v1beta2/model';

describe('getDigitalTwin', () => {
  describe('when no error is returned', () => {
    const getDigitalTwinResponse: GetDigitalTwinResponse = {
      digitalTwin: {
        properties: [
          {
            id: 'property-id',
            value: {
              oneofKind: 'objectValue',
              objectValue: {
                value: {
                  oneofKind: 'stringValue',
                  stringValue: 'user@example.com',
                },
              },
            },
            definition: {
              property: 'email',
              context: '',
              type: '',
            },
          },
        ],
      },
    };
    let getDigitalTwinSpy: jest.SpyInstance;
    let sdk: IdentityClientV2;
    let response: GetDigitalTwinResponse;

    beforeEach(async () => {
      sdk = await IdentityClientV2.createInstance(JSON.stringify(applicationTokenMock));
      getDigitalTwinSpy = jest
        .spyOn(sdk['client'], 'getDigitalTwin')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response: GetDigitalTwinResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(null, getDigitalTwinResponse);
            }
            return {} as SurfaceCall;
          },
        );
      response = await sdk.getDigitalTwin(
        {
          id: 'digital-twin-id',
          tenantId: 'tenant-id',
          kind: DigitalTwinKind.PERSON,
          state: DigitalTwinState.ACTIVE,
          tags: [],
        },
        [
          {
            definition: {
              property: 'email',
              context: '',
              type: '',
            },
          },
        ],
      );
    });

    it('sends correct request', () => {
      expect(getDigitalTwinSpy).toBeCalledWith(
        {
          id: {
            filter: {
              oneofKind: 'digitalTwin',
              digitalTwin: {
                id: 'digital-twin-id',
                tenantId: 'tenant-id',
                kind: DigitalTwinKind.PERSON,
                state: DigitalTwinState.ACTIVE,
                tags: [],
              },
            },
          },
          properties: [
            {
              definition: {
                property: 'email',
                context: '',
                type: '',
              },
            },
          ],
        },
        expect.any(Function),
      );
    });

    it('gets correct response', () => {
      expect(response).toEqual(getDigitalTwinResponse);
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
        .spyOn(sdk['client'], 'getDigitalTwin')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response?: GetDigitalTwinResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(error);
            }
            return {} as SurfaceCall;
          },
        );
      sdk
        .getDigitalTwin(
          {
            id: 'digital-twin-id',
            tenantId: 'tenant-id',
            kind: DigitalTwinKind.PERSON,
            state: DigitalTwinState.ACTIVE,
            tags: [],
          },
          [
            {
              definition: {
                property: 'email',
                context: '',
                type: '',
              },
            },
          ],
        )
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
        .spyOn(sdk['client'], 'getDigitalTwin')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response?: GetDigitalTwinResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(null);
            }
            return {} as SurfaceCall;
          },
        );
      sdk
        .getDigitalTwin(
          {
            id: 'digital-twin-id',
            tenantId: 'tenant-id',
            kind: DigitalTwinKind.PERSON,
            state: DigitalTwinState.ACTIVE,
            tags: [],
          },
          [
            {
              definition: {
                property: 'email',
                context: '',
                type: '',
              },
            },
          ],
        )
        .catch((err) => {
          thrownError = err;
        });
    });

    it('throws an error', () => {
      expect(thrownError.message).toBe('No Digital Twin response');
    });
  });
});

describe('getDigitalTwinByToken', () => {
  describe('when no error is returned', () => {
    const getDigitalTwinResponse: GetDigitalTwinResponse = {
      digitalTwin: {
        properties: [
          {
            id: 'property-id',
            value: {
              oneofKind: 'objectValue',
              objectValue: {
                value: {
                  oneofKind: 'stringValue',
                  stringValue: 'user@example.com',
                },
              },
            },
            definition: {
              property: 'email',
              context: '',
              type: '',
            },
          },
        ],
      },
    };
    let getDigitalTwinSpy: jest.SpyInstance;
    let sdk: IdentityClientV2;
    let response: GetDigitalTwinResponse;

    beforeEach(async () => {
      sdk = await IdentityClientV2.createInstance(JSON.stringify(applicationTokenMock));
      getDigitalTwinSpy = jest
        .spyOn(sdk['client'], 'getDigitalTwin')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response: GetDigitalTwinResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(null, getDigitalTwinResponse);
            }
            return {} as SurfaceCall;
          },
        );
      response = await sdk.getDigitalTwinByToken('access-token', [
        {
          definition: {
            property: 'email',
            context: '',
            type: '',
          },
        },
      ]);
    });

    it('sends correct request', () => {
      expect(getDigitalTwinSpy).toBeCalledWith(
        {
          id: {
            filter: {
              oneofKind: 'accessToken',
              accessToken: 'access-token',
            },
          },
          properties: [
            {
              definition: {
                property: 'email',
                context: '',
                type: '',
              },
            },
          ],
        },
        expect.any(Function),
      );
    });

    it('gets correct response', () => {
      expect(response).toEqual(getDigitalTwinResponse);
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
        .spyOn(sdk['client'], 'getDigitalTwin')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response?: GetDigitalTwinResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(error);
            }
            return {} as SurfaceCall;
          },
        );
      sdk
        .getDigitalTwinByToken('access-token', [
          {
            definition: {
              property: 'email',
              context: '',
              type: '',
            },
          },
        ])
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
        .spyOn(sdk['client'], 'getDigitalTwin')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response?: GetDigitalTwinResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(null);
            }
            return {} as SurfaceCall;
          },
        );
      sdk
        .getDigitalTwinByToken('access-token', [
          {
            definition: {
              property: 'email',
              context: '',
              type: '',
            },
          },
        ])
        .catch((err) => {
          thrownError = err;
        });
    });

    it('throws an error', () => {
      expect(thrownError.message).toBe('No Digital Twin response');
    });
  });
});

describe('getDigitalTwinByProperty', () => {
  describe('when no error is returned', () => {
    const getDigitalTwinResponse: GetDigitalTwinResponse = {
      digitalTwin: {
        properties: [
          {
            id: 'property-id',
            value: {
              oneofKind: 'objectValue',
              objectValue: {
                value: {
                  oneofKind: 'stringValue',
                  stringValue: 'user@example.com',
                },
              },
            },
            definition: {
              property: 'email',
              context: '',
              type: '',
            },
          },
        ],
      },
    };
    let getDigitalTwinSpy: jest.SpyInstance;
    let sdk: IdentityClientV2;
    let response: GetDigitalTwinResponse;

    beforeEach(async () => {
      sdk = await IdentityClientV2.createInstance(JSON.stringify(applicationTokenMock));
      getDigitalTwinSpy = jest
        .spyOn(sdk['client'], 'getDigitalTwin')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response: GetDigitalTwinResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(null, getDigitalTwinResponse);
            }
            return {} as SurfaceCall;
          },
        );
      response = await sdk.getDigitalTwinByProperty(
        {
          tenantId: 'tenant-id',
          type: 'email',
          value: {
            value: {
              oneofKind: 'stringValue',
              stringValue: 'user@example.com',
            },
          },
        },
        [
          {
            definition: {
              property: 'email',
              context: '',
              type: '',
            },
          },
        ],
      );
    });

    it('sends correct request', () => {
      expect(getDigitalTwinSpy).toBeCalledWith(
        {
          id: {
            filter: {
              oneofKind: 'propertyFilter',
              propertyFilter: {
                tenantId: 'tenant-id',
                type: 'email',
                value: {
                  value: {
                    oneofKind: 'stringValue',
                    stringValue: 'user@example.com',
                  },
                },
              },
            },
          },
          properties: [
            {
              definition: {
                property: 'email',
                context: '',
                type: '',
              },
            },
          ],
        },
        expect.any(Function),
      );
    });

    it('gets correct response', () => {
      expect(response).toEqual(getDigitalTwinResponse);
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
        .spyOn(sdk['client'], 'getDigitalTwin')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response?: GetDigitalTwinResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(error);
            }
            return {} as SurfaceCall;
          },
        );
      sdk
        .getDigitalTwinByProperty(
          {
            tenantId: 'tenant-id',
            type: 'email',
            value: {
              value: {
                oneofKind: 'stringValue',
                stringValue: 'user@example.com',
              },
            },
          },
          [
            {
              definition: {
                property: 'email',
                context: '',
                type: '',
              },
            },
          ],
        )
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
        .spyOn(sdk['client'], 'getDigitalTwin')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response?: GetDigitalTwinResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(null);
            }
            return {} as SurfaceCall;
          },
        );
      sdk
        .getDigitalTwinByProperty(
          {
            tenantId: 'tenant-id',
            type: 'email',
            value: {
              value: {
                oneofKind: 'stringValue',
                stringValue: 'user@example.com',
              },
            },
          },
          [
            {
              definition: {
                property: 'email',
                context: '',
                type: '',
              },
            },
          ],
        )
        .catch((err) => {
          thrownError = err;
        });
    });

    it('throws an error', () => {
      expect(thrownError.message).toBe('No Digital Twin response');
    });
  });
});
