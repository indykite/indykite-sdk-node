import { AuthorizationAPIClient } from '../../../grpc/indykite/authorization/v1beta1/authorization_service.grpc-client';
import { SdkClient } from '../../client/client';
import { AuthorizationClientV2, InputParameters } from '../../authorization_v2';
import { applicationTokenMock } from '../../utils/test_utils';

afterEach(() => {
  jest.restoreAllMocks();
});

describe('when a new client is created', () => {
  describe('when no error is thrown', () => {
    let returnedValue: AuthorizationClientV2;

    beforeEach(async () => {
      jest
        .spyOn(SdkClient, 'createIdentityInstance')
        .mockImplementation(() => Promise.resolve({ client: {} } as SdkClient));

      returnedValue = await AuthorizationClientV2.createInstance(
        JSON.stringify(applicationTokenMock),
      );
      AuthorizationClientV2.getInputParams({
        key1: 'value1',
        key2: 'value2',
      } as Record<string, InputParameters>);
    });

    it('creates a new instance', () => {
      expect(SdkClient.createIdentityInstance).toBeCalledWith(
        AuthorizationAPIClient,
        JSON.stringify(applicationTokenMock),
      );
      expect(returnedValue).toBeInstanceOf(AuthorizationClientV2);
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
        await AuthorizationClientV2.createInstance(JSON.stringify(applicationTokenMock));
      } catch (err) {
        caughtError = err as Error;
      }
    });

    it('throws an error', () => {
      expect(SdkClient.createIdentityInstance).toBeCalledWith(
        AuthorizationAPIClient,
        JSON.stringify(applicationTokenMock),
      );
      expect(caughtError).toBe(error);
    });
  });
});
