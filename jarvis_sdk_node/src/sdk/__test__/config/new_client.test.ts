import { ConfigManagementAPIClient } from '../../../grpc/indykite/config/v1beta1/config_management_api.grpc-client';
import { SdkClient } from '../../client/client';
import { ConfigClient } from '../../config';

const userToken = 'user-token';

afterEach(() => {
  jest.restoreAllMocks();
});

describe('New client', () => {
  beforeEach(() => {
    jest
      .spyOn(SdkClient, 'createIdentityInstance')
      .mockImplementation(() => Promise.resolve({ client: {} } as SdkClient));
  });

  describe('when custom endpoint is not specified', () => {
    beforeEach(() => {
      return ConfigClient.createInstance(userToken);
    });

    it('New instance creation', () => {
      expect(SdkClient.createIdentityInstance).toBeCalledWith(
        ConfigManagementAPIClient,
        userToken,
        'jarvis.indykite.com',
      );
    });
  });

  describe('when custom endpoint is specified', () => {
    beforeEach(async () => {
      process.env.JARVIS_ENDPOINT = 'example.com';
      // we need to reload all tested modules so that the new environment variable is used
      jest.resetModules();
      const { ConfigClient } = await import('../../config');
      const { SdkClient } = await import('../../client/client');
      jest
        .spyOn(SdkClient, 'createIdentityInstance')
        .mockImplementation(() => Promise.resolve({} as SdkClient));

      return ConfigClient.createInstance(userToken);
    });

    afterEach(() => {
      process.env.JARVIS_ENDPOINT = '';
    });

    it('New instance creation', async () => {
      const { SdkClient } = await import('../../client/client');
      const { ConfigManagementAPIClient } = await import(
        '../../../grpc/indykite/config/v1beta1/config_management_api.grpc-client'
      );
      expect(SdkClient.createIdentityInstance).toBeCalledWith(
        ConfigManagementAPIClient,
        userToken,
        'example.com',
      );
    });
  });
});
