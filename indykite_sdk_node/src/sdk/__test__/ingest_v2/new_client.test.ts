import { IngestAPIClient } from '../../../grpc/indykite/ingest/v1beta2/ingest_api.grpc-client';
import { SdkClient } from '../../client/client';
import { IngestV2Client } from '../../ingest_v2';
import { applicationTokenMock } from '../../utils/test_utils';

afterEach(() => {
  jest.restoreAllMocks();
});

describe('when a new client is created', () => {
  describe('when no error is thrown', () => {
    let returnedValue: IngestV2Client;

    beforeEach(async () => {
      jest
        .spyOn(SdkClient, 'createIdentityInstance')
        .mockImplementation(() => Promise.resolve({ client: {} } as SdkClient));

      returnedValue = await IngestV2Client.createInstance(JSON.stringify(applicationTokenMock));
    });

    it('creates a new instance', () => {
      expect(SdkClient.createIdentityInstance).toBeCalledWith(
        IngestAPIClient,
        JSON.stringify(applicationTokenMock),
      );
      expect(returnedValue).toBeInstanceOf(IngestV2Client);
    });
  });

  describe('when an error is thrown', () => {
    const error = new Error('Error mock');
    let caughtError: Error;

    beforeEach(async () => {
      jest
        .spyOn(SdkClient, 'createIdentityInstance')
        .mockImplementation(() => Promise.reject(error));
      try {
        await IngestV2Client.createInstance(JSON.stringify(applicationTokenMock));
      } catch (err) {
        caughtError = err as Error;
      }
    });

    it('throws an error', () => {
      expect(SdkClient.createIdentityInstance).toBeCalledWith(
        IngestAPIClient,
        JSON.stringify(applicationTokenMock),
      );
      expect(caughtError).toBe(error);
    });
  });
});