import { ServiceError, SurfaceCall } from '@grpc/grpc-js/build/src/call';
import { IdentityClient } from '../../identity';
import { Status } from '@grpc/grpc-js/build/src/constants';
import { CallOptions, Metadata } from '@grpc/grpc-js';
import {
  ImportDigitalTwinsRequest,
  ImportDigitalTwinsResponse,
} from '../../../grpc/indykite/identity/v1beta1/import';
import { HashAlgorithmFactory } from '../../model/hash_algorithm';
import { ImportDigitalTwin, ImportResult } from '../../model/import_digitaltwin';
import { DigitalTwinKind, DigitalTwinState } from '../../../grpc/indykite/identity/v1beta1/model';
import { v4 } from 'uuid';
import { Utils } from '../../utils/utils';
import { applicationTokenMock } from '../../utils/test_utils';

let sdk: IdentityClient;

const tenantId = v4();

const importDts = [
  new ImportDigitalTwin(tenantId, DigitalTwinKind.PERSON, DigitalTwinState.ACTIVE, []),
];

beforeAll(async () => {
  sdk = await IdentityClient.createInstance(applicationTokenMock);
});

afterEach(() => {
  jest.resetAllMocks();
});

describe('when the response is successful', () => {
  describe('when the result type is "success"', () => {
    const newDtId = v4();
    let results: ImportResult[];

    beforeEach(async () => {
      const mockFunc = jest.fn(
        (
          request: ImportDigitalTwinsRequest,
          callback:
            | Metadata
            | CallOptions
            | ((error: ServiceError | null, response?: ImportDigitalTwinsResponse) => void),
        ): SurfaceCall => {
          if (typeof callback === 'function')
            callback(null, {
              results: [
                {
                  index: '0',
                  result: {
                    oneofKind: 'success',
                    success: {
                      digitalTwin: {
                        id: Utils.uuidToBuffer(newDtId),
                        tenantId: Utils.uuidToBuffer(tenantId),
                        kind: 0,
                        state: 0,
                        tags: [],
                      },
                      results: [
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
                    },
                  },
                },
              ],
            });
          return {} as SurfaceCall;
        },
      );

      jest.spyOn(sdk['client'], 'importDigitalTwins').mockImplementation(mockFunc);

      results = await sdk.importDigitalTwins(importDts, HashAlgorithmFactory.createBcrypt());
    });

    it('sends correct request', () => {
      expect(sdk['client'].importDigitalTwins).toBeCalledTimes(1);
      expect(sdk['client'].importDigitalTwins).toBeCalledWith(
        {
          entities: [
            {
              id: Buffer.from(''),
              tenantId: Utils.uuidToBuffer(tenantId),
              kind: DigitalTwinKind.PERSON,
              state: DigitalTwinState.ACTIVE,
              tags: [],
              properties: {
                forceDelete: false,
                operations: [],
              },
              providerUserInfo: [],
            },
          ],
          hashAlgorithm: {
            oneofKind: 'bcrypt',
            bcrypt: {},
          },
        },
        expect.any(Function),
      );
    });

    it('returns a successful response', () => {
      expect(results).toHaveLength(1);
      expect(results[0].index).toEqual('0');
      expect(results[0].isSuccess()).toBeTruthy();
      if (results[0].isSuccess()) {
        expect(results[0].digitalTwin?.id).toEqual(newDtId);
        expect(results[0].digitalTwin?.kind).toEqual(0);
        expect(results[0].digitalTwin?.state).toEqual(0);
        expect(results[0].digitalTwin?.tenantId).toEqual(tenantId);
        expect(results[0].propertiesResult?.length).toEqual(1);
        expect(results[0].propertiesResult?.[0].index).toEqual('0');
        expect(results[0].propertiesResult?.[0].propertyId).toEqual('property-id');
        expect(results[0].propertiesResult?.[0].status).toEqual('success');
      }
    });
  });

  describe('when the result type is "error"', () => {
    let results: ImportResult[];

    beforeEach(async () => {
      const mockFunc = jest.fn(
        (
          request: ImportDigitalTwinsRequest,
          callback:
            | Metadata
            | CallOptions
            | ((error: ServiceError | null, response?: ImportDigitalTwinsResponse) => void),
        ): SurfaceCall => {
          if (typeof callback === 'function')
            callback(null, {
              results: [
                {
                  index: '0',
                  result: {
                    oneofKind: 'error',
                    error: {
                      message: ['Error description'],
                    },
                  },
                },
              ],
            });
          return {} as SurfaceCall;
        },
      );

      jest.spyOn(sdk['client'], 'importDigitalTwins').mockImplementation(mockFunc);

      results = await sdk.importDigitalTwins(importDts, HashAlgorithmFactory.createBcrypt());
    });

    it('returns an error response', () => {
      expect(results).toHaveLength(1);
      expect(results[0].index).toEqual('0');
      expect(results[0].isError()).toBeTruthy();
      if (results[0].isError()) {
        expect(results[0].message).toEqual(['Error description']);
      }
    });
  });
});

describe('when the response is missing', () => {
  let results: ImportResult[];

  beforeEach(async () => {
    const mockFunc = jest.fn(
      (
        request: ImportDigitalTwinsRequest,
        callback:
          | Metadata
          | CallOptions
          | ((error: ServiceError | null, response?: ImportDigitalTwinsResponse) => void),
      ): SurfaceCall => {
        if (typeof callback === 'function') callback(null);
        return {} as SurfaceCall;
      },
    );

    jest.spyOn(sdk['client'], 'importDigitalTwins').mockImplementation(mockFunc);

    results = await sdk.importDigitalTwins(importDts, HashAlgorithmFactory.createBcrypt());
  });

  it('sends correct request', () => {
    expect(sdk['client'].importDigitalTwins).toBeCalledTimes(1);
    expect(sdk['client'].importDigitalTwins).toBeCalledWith(
      {
        entities: [
          {
            id: Buffer.from(''),
            tenantId: Utils.uuidToBuffer(tenantId),
            kind: DigitalTwinKind.PERSON,
            state: DigitalTwinState.ACTIVE,
            tags: [],
            properties: {
              forceDelete: false,
              operations: [],
            },
            providerUserInfo: [],
          },
        ],
        hashAlgorithm: {
          oneofKind: 'bcrypt',
          bcrypt: {},
        },
      },
      expect.any(Function),
    );
  });

  it('returns an empty array', () => {
    expect(results).toEqual([]);
  });
});

describe('when the response contains an error', () => {
  const error = {
    code: Status.NOT_FOUND,
    details: 'no details',
    metadata: {},
  } as ServiceError;
  let caughtError: unknown;

  beforeEach(async () => {
    const mockFunc = jest.fn(
      (
        request: ImportDigitalTwinsRequest,
        callback:
          | Metadata
          | CallOptions
          | ((error: ServiceError | null, response?: ImportDigitalTwinsResponse) => void),
      ): SurfaceCall => {
        if (typeof callback === 'function') callback(error);
        return {} as SurfaceCall;
      },
    );

    jest.spyOn(sdk['client'], 'importDigitalTwins').mockImplementation(mockFunc);

    try {
      await sdk.importDigitalTwins(importDts, HashAlgorithmFactory.createBcrypt());
    } catch (err) {
      caughtError = err;
    }
  });

  it('throws the error', () => {
    expect(caughtError).toBe(error);
  });
});
