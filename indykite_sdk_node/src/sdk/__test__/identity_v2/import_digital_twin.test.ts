import { ServiceError, SurfaceCall } from '@grpc/grpc-js/build/src/call';
import { IdentityClientV2 } from '../../identity_v2';
import { Status } from '@grpc/grpc-js/build/src/constants';
import { CallOptions, Metadata } from '@grpc/grpc-js';
import {
  ImportDigitalTwin,
  ImportDigitalTwinsRequest,
  ImportDigitalTwinsResponse,
} from '../../../grpc/indykite/identity/v1beta2/import';
import { DigitalTwinKind, DigitalTwinState } from '../../../grpc/indykite/identity/v1beta2/model';
import { applicationTokenMock, generateRandomGID } from '../../utils/test_utils';
import { Readable } from 'stream';

let sdk: IdentityClientV2;

const tenantId = generateRandomGID();

const importDts: ImportDigitalTwin[] = [
  {
    id: '',
    tenantId: tenantId,
    kind: DigitalTwinKind.PERSON,
    state: DigitalTwinState.ACTIVE,
    tags: [],
    providerUserInfo: [
      {
        uid: 'user-id',
        displayName: 'User Name',
        email: 'user@example.com',
        photoUrl: '',
        providerId: 'provider-id',
      },
    ],
  },
];

beforeAll(async () => {
  sdk = await IdentityClientV2.createInstance(applicationTokenMock);
});

afterEach(() => {
  jest.resetAllMocks();
});

describe('when the response is successful', () => {
  const newDtId = generateRandomGID();
  let result: ImportDigitalTwinsResponse;

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
                      id: newDtId,
                      tenantId,
                      kind: DigitalTwinKind.INVALID,
                      state: DigitalTwinState.INVALID,
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

    result = await sdk.importDigitalTwins(importDts, { oneofKind: 'bcrypt', bcrypt: {} });
  });

  it('sends correct request', () => {
    expect(sdk['client'].importDigitalTwins).toBeCalledTimes(1);
    expect(sdk['client'].importDigitalTwins).toBeCalledWith(
      {
        entities: [
          {
            id: '',
            tenantId,
            kind: DigitalTwinKind.PERSON,
            state: DigitalTwinState.ACTIVE,
            tags: [],
            providerUserInfo: [
              {
                uid: 'user-id',
                displayName: 'User Name',
                email: 'user@example.com',
                photoUrl: '',
                providerId: 'provider-id',
              },
            ],
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
    expect(result).toEqual({
      results: [
        {
          index: '0',
          result: {
            oneofKind: 'success',
            success: {
              digitalTwin: {
                id: newDtId,
                tenantId,
                kind: DigitalTwinKind.INVALID,
                state: DigitalTwinState.INVALID,
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
  });
});

describe('when a stream is used', () => {
  const newDtId = generateRandomGID();
  let result: ImportDigitalTwinsResponse;

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
                      id: newDtId,
                      tenantId,
                      kind: DigitalTwinKind.INVALID,
                      state: DigitalTwinState.INVALID,
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

    const stream = Readable.from(importDts);
    result = await sdk.importDigitalTwins(stream, { oneofKind: 'bcrypt', bcrypt: {} });
  });

  it('sends correct request', () => {
    expect(sdk['client'].importDigitalTwins).toBeCalledTimes(1);
    expect(sdk['client'].importDigitalTwins).toBeCalledWith(
      {
        entities: [
          {
            id: '',
            tenantId,
            kind: DigitalTwinKind.PERSON,
            state: DigitalTwinState.ACTIVE,
            tags: [],
            providerUserInfo: [
              {
                uid: 'user-id',
                displayName: 'User Name',
                email: 'user@example.com',
                photoUrl: '',
                providerId: 'provider-id',
              },
            ],
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
    expect(result).toEqual({
      results: [
        {
          index: '0',
          result: {
            oneofKind: 'success',
            success: {
              digitalTwin: {
                id: newDtId,
                tenantId,
                kind: DigitalTwinKind.INVALID,
                state: DigitalTwinState.INVALID,
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
  });
});

describe('when the response is missing', () => {
  let result: ImportDigitalTwinsResponse;

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

    result = await sdk.importDigitalTwins(importDts, { oneofKind: 'bcrypt', bcrypt: {} });
  });

  it('returns an empty array', () => {
    expect(result).toEqual({
      results: [],
    });
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
      await sdk.importDigitalTwins(importDts, { oneofKind: 'bcrypt', bcrypt: {} });
    } catch (err) {
      caughtError = err;
    }
  });

  it('throws the error', () => {
    expect(caughtError).toBe(error);
  });
});
