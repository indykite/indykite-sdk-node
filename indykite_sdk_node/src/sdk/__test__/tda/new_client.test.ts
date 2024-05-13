import { TrustedDataAccessAPIClient } from '../../../grpc/indykite/tda/v1beta1/trusted_data_access_api.grpc-client';
import { SdkClient } from '../../client/client';
import { TrustedDataAccessClient } from '../../tda';
import { applicationTokenMock } from '../../utils/test_utils';

afterEach(() => {
  jest.restoreAllMocks();
});

describe('when a new client is created', () => {
  describe('when no error is thrown', () => {
    let returnedValue: TrustedDataAccessClient;

    beforeEach(async () => {
      jest
        .spyOn(SdkClient, 'createIdentityInstance')
        .mockImplementation(() => Promise.resolve({ client: {} } as SdkClient));

      returnedValue = await TrustedDataAccessClient.createInstance(
        JSON.stringify(applicationTokenMock),
      );
    });

    it('creates a new instance', () => {
      expect(SdkClient.createIdentityInstance).toHaveBeenCalledWith(
        TrustedDataAccessAPIClient,
        JSON.stringify(applicationTokenMock),
      );
      expect(returnedValue).toBeInstanceOf(TrustedDataAccessClient);
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
        await TrustedDataAccessClient.createInstance(JSON.stringify(applicationTokenMock));
      } catch (err) {
        caughtError = err as Error;
      }
    });

    it('throws an error', () => {
      expect(SdkClient.createIdentityInstance).toHaveBeenCalledWith(
        TrustedDataAccessAPIClient,
        JSON.stringify(applicationTokenMock),
      );
      expect(caughtError).toBe(error);
    });
  });
});
