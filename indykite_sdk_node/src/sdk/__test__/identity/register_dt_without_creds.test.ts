import {
  RegisterDigitalTwinWithoutCredentialRequest,
  RegisterDigitalTwinWithoutCredentialResponse,
} from '../../../grpc/indykite/identity/v1beta2/identity_management_api';
import { IdentityClient } from '../../identity';
import { applicationTokenMock, generateRandomGID } from '../../utils/test_utils';
import { CallOptions, Metadata, ServiceError } from '@grpc/grpc-js';
import { SurfaceCall } from '@grpc/grpc-js/build/src/call';
import { Status } from '@grpc/grpc-js/build/src/constants';
import { SdkError, SdkErrorCode } from '../../error';
import { DigitalTwinKind, DigitalTwinState } from '../../../grpc/indykite/identity/v1beta2/model';
import { DigitalTwinCore, PatchResult, Property } from '../../model';

const tenantId = generateRandomGID();
const dtKind = DigitalTwinKind.THING;

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
  jest.restoreAllMocks();
});

describe('registerDigitalTwinWithoutCredential', () => {
  describe('when the response is successful', () => {
    const mockFunc = jest.fn(
      (
        request: RegisterDigitalTwinWithoutCredentialRequest,
        callback:
          | Metadata
          | CallOptions
          | ((
              error: ServiceError | null,
              response?: RegisterDigitalTwinWithoutCredentialResponse,
            ) => void),
      ): SurfaceCall => {
        if (typeof callback === 'function')
          callback(null, {
            digitalTwin: returnedDt.marshal(),
            results: returnedPatchResults,
            bookmark: '',
          });
        return {} as SurfaceCall;
      },
    );

    const returnedDt = new DigitalTwinCore(
      generateRandomGID(),
      tenantId,
      dtKind,
      DigitalTwinState.ACTIVE,
      [],
    );
    const returnedPatchResults: RegisterDigitalTwinWithoutCredentialResponse['results'] = [
      {
        index: '0',
        result: {
          oneofKind: 'success',
          success: {
            propertyId: '25d037812d984ef0',
          },
        },
      },
    ];

    beforeEach(async () => {
      mockFunc.mockClear();
      jest
        .spyOn(sdk['client'], 'registerDigitalTwinWithoutCredential')
        .mockImplementation(mockFunc);
    });

    describe('when tags and bookmarks are not used', () => {
      let result: Awaited<ReturnType<typeof sdk.registerDigitalTwinWithoutCredential>>;

      beforeEach(async () => {
        result = await sdk.registerDigitalTwinWithoutCredential(tenantId, dtKind, [
          new Property('extid').withValue('42'),
        ]);
      });

      it('sends a correct request', async () => {
        expect(mockFunc).toBeCalledTimes(1);
        expect(mockFunc).toBeCalledWith(
          {
            bookmarks: [],
            digitalTwinKind: dtKind,
            digitalTwinTags: [],
            properties: [
              {
                definition: { context: '', property: 'extid', type: '' },
                id: '',
                value: {
                  objectValue: { value: { oneofKind: 'stringValue', stringValue: '42' } },
                  oneofKind: 'objectValue',
                },
              },
            ],
            tenantId,
          },
          expect.any(Function),
        );
      });

      it('registers a new digital twin', async () => {
        expect(result).toEqual({
          digitalTwin: returnedDt,
          patchResults: returnedPatchResults.map(PatchResult.deserialize),
        });
      });
    });

    describe('when tags and bookmarks are used', () => {
      let result: Awaited<ReturnType<typeof sdk.registerDigitalTwinWithoutCredential>>;

      beforeEach(async () => {
        result = await sdk.registerDigitalTwinWithoutCredential(
          tenantId,
          dtKind,
          [new Property('extid').withValue('42')],
          ['tag-1', 'tag-2'],
          ['bookmark-1', 'bookmark-2'],
        );
      });

      it('sends a correct request', async () => {
        expect(mockFunc).toBeCalledTimes(1);
        expect(mockFunc).toBeCalledWith(
          {
            bookmarks: ['bookmark-1', 'bookmark-2'],
            digitalTwinKind: dtKind,
            digitalTwinTags: ['tag-1', 'tag-2'],
            properties: [
              {
                definition: { context: '', property: 'extid', type: '' },
                id: '',
                value: {
                  objectValue: { value: { oneofKind: 'stringValue', stringValue: '42' } },
                  oneofKind: 'objectValue',
                },
              },
            ],
            tenantId,
          },
          expect.any(Function),
        );
      });

      it('registers a new digital twin', async () => {
        expect(result).toEqual({
          digitalTwin: returnedDt,
          patchResults: returnedPatchResults.map(PatchResult.deserialize),
        });
      });
    });
  });

  describe('when the response is successful with an error', () => {
    const mockFunc = jest.fn(
      (
        request: RegisterDigitalTwinWithoutCredentialRequest,
        callback:
          | Metadata
          | CallOptions
          | ((
              error: ServiceError | null,
              response?: RegisterDigitalTwinWithoutCredentialResponse,
            ) => void),
      ): SurfaceCall => {
        if (typeof callback === 'function')
          callback(null, {
            results: [
              {
                index: '0',
                result: {
                  oneofKind: 'error',
                  error: {
                    message: ['Mocked error'],
                  },
                },
              },
            ],
            bookmark: '',
          });
        return {} as SurfaceCall;
      },
    );

    const returnedPatchResults: RegisterDigitalTwinWithoutCredentialResponse['results'] = [
      {
        index: '0',
        result: {
          oneofKind: 'error',
          error: {
            message: ['Mocked error'],
          },
        },
      },
    ];

    let result: Awaited<ReturnType<typeof sdk.registerDigitalTwinWithoutCredential>>;

    beforeEach(async () => {
      mockFunc.mockClear();
      jest
        .spyOn(sdk['client'], 'registerDigitalTwinWithoutCredential')
        .mockImplementation(mockFunc);

      result = await sdk.registerDigitalTwinWithoutCredential(tenantId, dtKind, [
        new Property('extid').withValue('42'),
      ]);
    });

    it('sends a correct request', async () => {
      expect(mockFunc).toBeCalledTimes(1);
      expect(mockFunc).toBeCalledWith(
        {
          bookmarks: [],
          digitalTwinKind: dtKind,
          digitalTwinTags: [],
          properties: [
            {
              definition: { context: '', property: 'extid', type: '' },
              id: '',
              value: {
                objectValue: { value: { oneofKind: 'stringValue', stringValue: '42' } },
                oneofKind: 'objectValue',
              },
            },
          ],
          tenantId,
        },
        expect.any(Function),
      );
    });

    it('returns the error', async () => {
      expect(result).toEqual({
        patchResults: returnedPatchResults.map(PatchResult.deserialize),
      });
    });
  });

  describe('when the response contains an error', () => {
    beforeEach(async () => {
      const mockFunc = jest.fn(
        (
          request: RegisterDigitalTwinWithoutCredentialRequest,
          callback:
            | Metadata
            | CallOptions
            | ((
                error: ServiceError | null,
                response?: RegisterDigitalTwinWithoutCredentialResponse,
              ) => void),
        ): SurfaceCall => {
          if (typeof callback === 'function') callback(error);
          return {} as SurfaceCall;
        },
      );

      jest
        .spyOn(sdk['client'], 'registerDigitalTwinWithoutCredential')
        .mockImplementation(mockFunc);
    });

    it('throws an error', async () => {
      let caughtError;
      try {
        await sdk.registerDigitalTwinWithoutCredential(
          tenantId,
          dtKind,
          [new Property('extid').withValue('42')],
          ['tag-1', 'tag-2'],
          ['bookmark-1', 'bookmark-2'],
        );
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
          request: RegisterDigitalTwinWithoutCredentialRequest,
          callback:
            | Metadata
            | CallOptions
            | ((
                error: ServiceError | null,
                response?: RegisterDigitalTwinWithoutCredentialResponse,
              ) => void),
        ): SurfaceCall => {
          if (typeof callback === 'function') callback(null);
          return {} as SurfaceCall;
        },
      );

      jest
        .spyOn(sdk['client'], 'registerDigitalTwinWithoutCredential')
        .mockImplementation(mockFunc);
    });

    it('throws an error', async () => {
      try {
        await sdk.registerDigitalTwinWithoutCredential(
          tenantId,
          dtKind,
          [new Property('extid').withValue('42')],
          ['tag-1', 'tag-2'],
          ['bookmark-1', 'bookmark-2'],
        );
      } catch (err) {
        caughtError = err as SdkError;
      }
      expect(caughtError.code).toEqual(SdkErrorCode.SDK_CODE_1);
      expect(caughtError.message).toEqual('Missing register digital twin response');
    });
  });
});
