// import { ConfigManagementAPIClient } from '../../grpc/indykite/config/v1beta1/inge';
import { IngestAPIClient } from '../../../grpc/indykite/ingest/v1beta1/ingest_api.grpc-client';
import { SdkClient } from '../../client/client';
import { IngestClient } from '../../ingest';

const userToken = 'user-token';

afterEach(() => {
  jest.restoreAllMocks();
});

describe('when a new client is created', () => {
  describe('when no error is thrown', () => {
    let returnedValue: IngestClient;

    beforeEach(async () => {
      jest
        .spyOn(SdkClient, 'createServiceInstance')
        .mockImplementation(() => Promise.resolve({ client: {} } as SdkClient));

      returnedValue = await IngestClient.createInstance(userToken);
    });

    it('creates a new instance', () => {
      expect(SdkClient.createServiceInstance).toBeCalledWith(IngestAPIClient, userToken);
      expect(returnedValue).toBeInstanceOf(IngestClient);
    });
  });

  describe('when an error is thrown', () => {
    const error = new Error('Error mock');
    let caughtError: Error;

    beforeEach(async () => {
      jest
        .spyOn(SdkClient, 'createServiceInstance')
        .mockImplementation(() => Promise.reject(error));
      try {
        await IngestClient.createInstance(userToken);
      } catch (err) {
        caughtError = err as Error;
      }
    });

    it('throws an error', () => {
      expect(SdkClient.createServiceInstance).toBeCalledWith(IngestAPIClient, userToken);
      expect(caughtError).toBe(error);
    });
  });
});
