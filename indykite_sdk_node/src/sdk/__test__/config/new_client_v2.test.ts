import { ConfigManagementAPIClient } from '../../../grpc/indykite/config/v1beta1/config_management_api.grpc-client';
import { SdkClient } from '../../client/client';
import { ConfigClientV2 } from '../../config_v2';
import { serviceAccountTokenMock } from '../../utils/test_utils';

const userToken = 'user-token';

afterEach(() => {
  jest.clearAllMocks();
});

describe('New client', () => {
  beforeEach(() => {
    jest
      .spyOn(SdkClient, 'createServiceInstance')
      .mockImplementation(() => Promise.resolve({ client: {} } as SdkClient));
  });

  describe('when custom endpoint is not specified', () => {
    beforeEach(() => {
      return ConfigClientV2.createInstance(userToken);
    });

    it('New instance creation', () => {
      expect(SdkClient.createServiceInstance).toBeCalledWith(ConfigManagementAPIClient, userToken);
    });
  });

  describe('when custom endpoint is specified', () => {
    beforeEach(async () => {
      // we need to reload all tested modules so that the new environment variable is used
      jest.resetModules();
      const { ConfigClientV2 } = await import('../../config_v2');
      const { SdkClient } = await import('../../client/client');
      jest
        .spyOn(SdkClient, 'createServiceInstance')
        .mockImplementation(() => Promise.resolve({} as SdkClient));

      return ConfigClientV2.createInstance(userToken);
    });

    it('New instance creation', async () => {
      const { SdkClient } = await import('../../client/client');
      const { ConfigManagementAPIClient } = await import(
        '../../../grpc/indykite/config/v1beta1/config_management_api.grpc-client'
      );
      expect(SdkClient.createServiceInstance).toBeCalledWith(ConfigManagementAPIClient, userToken);
    });
  });

  describe('when an error is returned', () => {
    let thrownError: Error;

    beforeEach(async () => {
      jest
        .spyOn(ConfigClientV2, 'createInstance')
        .mockImplementation(() => Promise.reject(new Error('Error')));
      return await ConfigClientV2.createInstance({}).catch((err) => {
        thrownError = err;
      });
    });

    it('throws an error', () => {
      expect(thrownError.message).toBe('Error');
    });
  });

  describe('close not implemented', () => {
    let sdk: SdkClient;
    let configInstance: ConfigClientV2;
    let configClientV2Mock: jest.SpyInstance;
    let caughtError: Error;

    beforeEach(async () => {
      sdk = await SdkClient.createServiceInstance(
        ConfigManagementAPIClient,
        JSON.stringify(serviceAccountTokenMock),
      );
      configInstance = new ConfigClientV2(sdk);
      configClientV2Mock = jest.spyOn(configInstance, 'close').mockImplementation(() => {
        throw new Error('Not implemented');
      });

      try {
        return configInstance.close();
      } catch {
        // Nothing to do here
      }
    });

    it('throws an error', () => {
      try {
        configInstance.close();
      } catch (err) {
        caughtError = err as Error;
      }
      expect(caughtError?.message).toBe('Not implemented');
    });

    it('close method call', () => {
      expect(configClientV2Mock).toHaveBeenCalled();
    });
  });
});
