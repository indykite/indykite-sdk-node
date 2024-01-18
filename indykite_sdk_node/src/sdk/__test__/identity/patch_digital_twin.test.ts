import { CallOptions, Metadata } from '@grpc/grpc-js';
import { ServiceError, SurfaceCall } from '@grpc/grpc-js/build/src/call';
import { Status } from '@grpc/grpc-js/build/src/constants';
import { PatchDigitalTwinResponse } from '../../../grpc/indykite/identity/v1beta2/identity_management_api';
import { IdentityClient } from '../../identity';
import { applicationTokenMock } from '../../utils/test_utils';
import { DigitalTwinKind, DigitalTwinState } from '../../../grpc/indykite/identity/v1beta2/model';
import { BatchOperationResult } from '../../../grpc/indykite/identity/v1beta2/attributes';

describe('patchDigitalTwin', () => {
  describe('when no error is returned', () => {
    const patchDigitalTwinResponse: PatchDigitalTwinResponse = {
      result: [
        {
          index: '0',
          result: {
            oneofKind: 'success',
            success: {
              propertyId: 'property-id',
            },
          },
        },
      ],
    };
    let patchDigitalTwinSpy: jest.SpyInstance;
    let sdk: IdentityClient;
    let response: BatchOperationResult;

    beforeEach(async () => {
      sdk = await IdentityClient.createInstance(JSON.stringify(applicationTokenMock));
      patchDigitalTwinSpy = jest
        .spyOn(sdk['client'], 'patchDigitalTwin')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response: PatchDigitalTwinResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(null, patchDigitalTwinResponse);
            }
            return {} as SurfaceCall;
          },
        );
      response = await sdk.patchDigitalTwin(
        {
          id: 'digital-twin-id',
          tenantId: 'tenant-id',
          kind: DigitalTwinKind.PERSON,
          state: DigitalTwinState.ACTIVE,
          tags: [],
        },
        [
          {
            operation: {
              oneofKind: 'add',
              add: {
                id: 'email-property-id',
                value: {
                  oneofKind: 'objectValue',
                  objectValue: {
                    value: {
                      oneofKind: 'stringValue',
                      stringValue: 'user@example.com',
                    },
                  },
                },
              },
            },
          },
        ],
      );
    });

    it('sends correct request', () => {
      expect(patchDigitalTwinSpy).toBeCalledWith(
        {
          adminToken: '',
          forceDelete: false,
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
          operations: [
            {
              operation: {
                oneofKind: 'add',
                add: {
                  id: 'email-property-id',
                  value: {
                    oneofKind: 'objectValue',
                    objectValue: {
                      value: {
                        oneofKind: 'stringValue',
                        stringValue: 'user@example.com',
                      },
                    },
                  },
                },
              },
            },
          ],
        },
        expect.any(Function),
      );
    });

    it('gets correct response', () => {
      expect(response).toEqual(patchDigitalTwinResponse.result[0]);
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
      const sdk = await IdentityClient.createInstance(JSON.stringify(applicationTokenMock));
      jest
        .spyOn(sdk['client'], 'patchDigitalTwin')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response?: PatchDigitalTwinResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(error);
            }
            return {} as SurfaceCall;
          },
        );
      sdk
        .patchDigitalTwin(
          {
            id: 'digital-twin-id',
            tenantId: 'tenant-id',
            kind: DigitalTwinKind.PERSON,
            state: DigitalTwinState.ACTIVE,
            tags: [],
          },
          [
            {
              operation: {
                oneofKind: 'add',
                add: {
                  id: 'email-property-id',
                  value: {
                    oneofKind: 'objectValue',
                    objectValue: {
                      value: {
                        oneofKind: 'stringValue',
                        stringValue: 'user@example.com',
                      },
                    },
                  },
                },
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
      const sdk = await IdentityClient.createInstance(JSON.stringify(applicationTokenMock));
      jest
        .spyOn(sdk['client'], 'patchDigitalTwin')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response?: PatchDigitalTwinResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(null);
            }
            return {} as SurfaceCall;
          },
        );
      sdk
        .patchDigitalTwin(
          {
            id: 'digital-twin-id',
            tenantId: 'tenant-id',
            kind: DigitalTwinKind.PERSON,
            state: DigitalTwinState.ACTIVE,
            tags: [],
          },
          [
            {
              operation: {
                oneofKind: 'add',
                add: {
                  id: 'email-property-id',
                  value: {
                    oneofKind: 'objectValue',
                    objectValue: {
                      value: {
                        oneofKind: 'stringValue',
                        stringValue: 'user@example.com',
                      },
                    },
                  },
                },
              },
            },
          ],
        )
        .catch((err) => {
          thrownError = err;
        });
    });

    it('throws an error', () => {
      expect(thrownError.message).toBe('No patch operation result response');
    });
  });
});

describe('patchDigitalTwinByToken', () => {
  describe('when no error is returned', () => {
    const patchDigitalTwinResponse: PatchDigitalTwinResponse = {
      result: [
        {
          index: '0',
          result: {
            oneofKind: 'success',
            success: {
              propertyId: 'property-id',
            },
          },
        },
      ],
    };
    let patchDigitalTwinSpy: jest.SpyInstance;
    let sdk: IdentityClient;
    let response: BatchOperationResult;

    beforeEach(async () => {
      sdk = await IdentityClient.createInstance(JSON.stringify(applicationTokenMock));
      patchDigitalTwinSpy = jest
        .spyOn(sdk['client'], 'patchDigitalTwin')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response: PatchDigitalTwinResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(null, patchDigitalTwinResponse);
            }
            return {} as SurfaceCall;
          },
        );
      response = await sdk.patchDigitalTwinByToken('access-token', [
        {
          operation: {
            oneofKind: 'add',
            add: {
              id: 'email-property-id',
              value: {
                oneofKind: 'objectValue',
                objectValue: {
                  value: {
                    oneofKind: 'stringValue',
                    stringValue: 'user@example.com',
                  },
                },
              },
            },
          },
        },
      ]);
    });

    it('sends correct request', () => {
      expect(patchDigitalTwinSpy).toBeCalledWith(
        {
          adminToken: '',
          forceDelete: false,
          id: {
            filter: {
              oneofKind: 'accessToken',
              accessToken: 'access-token',
            },
          },
          operations: [
            {
              operation: {
                oneofKind: 'add',
                add: {
                  id: 'email-property-id',
                  value: {
                    oneofKind: 'objectValue',
                    objectValue: {
                      value: {
                        oneofKind: 'stringValue',
                        stringValue: 'user@example.com',
                      },
                    },
                  },
                },
              },
            },
          ],
        },
        expect.any(Function),
      );
    });

    it('gets correct response', () => {
      expect(response).toEqual(patchDigitalTwinResponse.result[0]);
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
      const sdk = await IdentityClient.createInstance(JSON.stringify(applicationTokenMock));
      jest
        .spyOn(sdk['client'], 'patchDigitalTwin')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response?: PatchDigitalTwinResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(error);
            }
            return {} as SurfaceCall;
          },
        );
      sdk
        .patchDigitalTwinByToken('access-token', [
          {
            operation: {
              oneofKind: 'add',
              add: {
                id: 'email-property-id',
                value: {
                  oneofKind: 'objectValue',
                  objectValue: {
                    value: {
                      oneofKind: 'stringValue',
                      stringValue: 'user@example.com',
                    },
                  },
                },
              },
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
      const sdk = await IdentityClient.createInstance(JSON.stringify(applicationTokenMock));
      jest
        .spyOn(sdk['client'], 'patchDigitalTwin')
        .mockImplementation(
          (
            req,
            res:
              | Metadata
              | CallOptions
              | ((err: ServiceError | null, response?: PatchDigitalTwinResponse) => void),
          ) => {
            if (typeof res === 'function') {
              res(null);
            }
            return {} as SurfaceCall;
          },
        );
      sdk
        .patchDigitalTwinByToken('access-token', [
          {
            operation: {
              oneofKind: 'add',
              add: {
                id: 'email-property-id',
                value: {
                  oneofKind: 'objectValue',
                  objectValue: {
                    value: {
                      oneofKind: 'stringValue',
                      stringValue: 'user@example.com',
                    },
                  },
                },
              },
            },
          },
        ])
        .catch((err) => {
          thrownError = err;
        });
    });

    it('throws an error', () => {
      expect(thrownError.message).toBe('No patch operation result response');
    });
  });
});
