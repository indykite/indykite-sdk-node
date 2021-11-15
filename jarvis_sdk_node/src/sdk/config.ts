import {
  ConfigManagementAPIClient,
  CreateConfigNodeRequest,
  DeleteConfigNodeRequest,
  UpdateConfigNodeRequest,
} from '../grpc/indykite/config/v1beta1/config_management_api';
import { SdkClient } from './client/client';
import { SdkErrorCode, SdkError } from './error';
import { AuthFlow } from './model/config/authflow/flow';
import { EmailProviderType } from './model/config/email/factory';
import { ConfigurationFactory } from './model/config/factory';

const endpoint = process.env.JARVIS_ENDPOINT || 'jarvis.indykite.com';
export class ConfigClient {
  private client: ConfigManagementAPIClient;

  constructor(sdk: SdkClient) {
    this.client = sdk.client as ConfigManagementAPIClient;
  }

  static createInstance(token: string): Promise<ConfigClient> {
    return new Promise<ConfigClient>((resolve, reject) => {
      SdkClient.createIdentityInstance(ConfigManagementAPIClient, token, endpoint)
        .then((sdk) => {
          resolve(new ConfigClient(sdk));
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  createEmailServiceConfiguration(
    location: string,
    config: EmailProviderType,
  ): Promise<EmailProviderType> {
    const req = CreateConfigNodeRequest.fromJSON({
      location,
      name: config.name,
    });
    req.config = {
      $case: 'emailServiceConfig',
      emailServiceConfig: config.marshal(),
    };
    // console.log(JSON.stringify(nr, null, 2));
    return new Promise<EmailProviderType>((resolve, reject) => {
      this.client.createConfigNode(req, (err, response) => {
        if (err) reject(err);
        else
          try {
            resolve(response as EmailProviderType);
          } catch (err) {
            reject(err);
          }
      });
    });
  }

  readEmailServiceConfiguration(id: string): Promise<EmailProviderType> {
    return new Promise((resolve, reject) => {
      this.client.readConfigNode({ id }, (err, response) => {
        if (err) reject(err);
        else
          try {
            if (response.configNode) {
              const ret = ConfigurationFactory.createInstance(
                response.configNode,
              ) as EmailProviderType;
              resolve(ret);
            } else {
              reject(new SdkError(SdkErrorCode.SDK_CODE_1, 'config_error_read_emailconfiguration'));
            }
          } catch (err) {
            reject(err);
          }
      });
    });
  }

  updateEmailServiceConfiguration(config: EmailProviderType): Promise<EmailProviderType> {
    const req = {
      id: config.id,
    } as UpdateConfigNodeRequest;
    if (config.etag) req.etag = config.etag;
    if (config.displayName) req.displayName = config.displayName;
    if (config.description) req.description = config.description;
    req.config = {
      $case: 'emailServiceConfig',
      emailServiceConfig: config.marshal(),
    };

    return new Promise<EmailProviderType>((resolve, reject) => {
      this.client.updateConfigNode(req, (err, response) => {
        if (err) reject(err);
        else
          try {
            if (response.id === config.id) {
              config.etag = response.etag;
              config.updateTime = response.updateTime;
              resolve(config);
            } else {
              reject(
                new SdkError(
                  SdkErrorCode.SDK_CODE_1,
                  `Update returned with different id: req.iq=${config.id}, res.id=${response.id}`,
                ),
              );
            }
          } catch (err) {
            reject(err);
          }
      });
    });
  }

  deleteEmailServiceConfiguration(config: EmailProviderType): Promise<boolean> {
    const req = {
      id: config.id,
    } as DeleteConfigNodeRequest;
    if (config.etag) req.etag = config.etag;

    return new Promise<boolean>((resolve, reject) => {
      this.client.deleteConfigNode(req, (err) => {
        if (err) reject(false);
        else resolve(true);
      });
    });
  }

  createAuthflowConfiguration(location: string, config: AuthFlow): Promise<AuthFlow> {
    const req = CreateConfigNodeRequest.fromJSON({
      location,
      name: config.name,
    });
    req.config = {
      $case: 'authFlowConfig',
      authFlowConfig: config.marshal(),
    };
    // console.log(JSON.stringify(nr, null, 2));
    return new Promise((resolve, reject) => {
      this.client.createConfigNode(req, (err, response) => {
        if (err) reject(err);
        else
          try {
            config.id = response.id;
            config.etag = response.etag;
            config.createTime = response.createTime;
            config.updateTime = response.updateTime;
            resolve(config);
          } catch (err) {
            reject(err);
          }
      });
    });
  }

  readAuthflowConfiguration(id: string): Promise<AuthFlow> {
    return new Promise((resolve, reject) => {
      this.client.readConfigNode({ id }, (err, response) => {
        if (err) reject(err);
        else
          try {
            if (response.configNode) {
              const ret = ConfigurationFactory.createInstance(response.configNode) as AuthFlow;
              resolve(ret);
            } else {
              reject(
                new SdkError(SdkErrorCode.SDK_CODE_1, 'config_error_read_authflowconfiguration'),
              );
            }
          } catch (err) {
            reject(err);
          }
      });
    });
  }

  updateAuthflowConfiguration(config: AuthFlow): Promise<AuthFlow> {
    const req = {
      id: config.id,
    } as UpdateConfigNodeRequest;
    if (config.etag) req.etag = config.etag;
    if (config.displayName) req.displayName = config.displayName;
    if (config.description) req.description = config.description;
    req.config = {
      $case: 'authFlowConfig',
      authFlowConfig: config.marshal(),
    };

    return new Promise<AuthFlow>((resolve, reject) => {
      this.client.updateConfigNode(req, (err, response) => {
        if (err) reject(err);
        else
          try {
            if (response.id === config.id) {
              config.etag = response.etag;
              config.updateTime = response.updateTime;
              resolve(config);
            } else {
              reject(
                new SdkError(
                  SdkErrorCode.SDK_CODE_1,
                  `Update returned with different id: req.iq=${config.id}, res.id=${response.id}`,
                ),
              );
            }
          } catch (err) {
            reject(err);
          }
      });
    });
  }

  deleteAuthflowConfiguration(config: AuthFlow): Promise<boolean> {
    const req = {
      id: config.id,
    } as DeleteConfigNodeRequest;
    if (config.etag) req.etag = config.etag;

    return new Promise<boolean>((resolve, reject) => {
      this.client.deleteConfigNode(req, (err) => {
        if (err) reject(false);
        else resolve(true);
      });
    });
  }
}
