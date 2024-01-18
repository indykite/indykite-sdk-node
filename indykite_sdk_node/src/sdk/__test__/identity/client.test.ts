import { IdentityManagementAPIClient } from '../../../grpc/indykite/identity/v1beta2/identity_management_api.grpc-client';
import { SdkClient } from '../../client/client';
import { IdentityClient } from '../../identity';
import { applicationTokenMock } from '../../utils/test_utils';

afterEach(() => {
  jest.restoreAllMocks();
});

describe('when a new client is created', () => {
  describe('when no error is thrown', () => {
    let returnedValue: IdentityClient;

    beforeEach(async () => {
      jest
        .spyOn(SdkClient, 'createIdentityInstance')
        .mockImplementation(() => Promise.resolve({ client: {} } as SdkClient));

      returnedValue = await IdentityClient.createInstance(JSON.stringify(applicationTokenMock));
    });

    it('creates a new instance', () => {
      expect(SdkClient.createIdentityInstance).toBeCalledWith(
        IdentityManagementAPIClient,
        JSON.stringify(applicationTokenMock),
      );
      expect(returnedValue).toBeInstanceOf(IdentityClient);
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
        await IdentityClient.createInstance(JSON.stringify(applicationTokenMock));
      } catch (err) {
        caughtError = err as Error;
      }
    });

    it('throws an error', () => {
      expect(SdkClient.createIdentityInstance).toBeCalledWith(
        IdentityManagementAPIClient,
        JSON.stringify(applicationTokenMock),
      );
      expect(caughtError).toBe(error);
    });
  });
});
