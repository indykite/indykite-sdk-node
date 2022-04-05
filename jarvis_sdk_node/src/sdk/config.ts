import {
  CreateConfigNodeRequest,
  DeleteApplicationSpaceRequest,
  DeleteConfigNodeRequest,
  UpdateApplicationSpaceRequest,
  UpdateConfigNodeRequest,
} from '../grpc/indykite/config/v1beta1/config_management_api';
import { SdkClient } from './client/client';
import { SdkErrorCode, SdkError } from './error';
import { AuthFlow } from './model/config/authflow/flow';
import { EmailProviderType } from './model/config/email/factory';
import { ConfigurationFactory } from './model/config/factory';
import { Customer } from './model/customer';
import { ApplicationSpace } from './model/application_space';
import { ConfigManagementAPIClient } from '../grpc/indykite/config/v1beta1/config_management_api.grpc-client';
import { StringValue } from '../grpc/google/protobuf/wrappers';
import { Utils } from './utils/utils';

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
    const req = CreateConfigNodeRequest.fromJson({
      location,
      name: config.name,
    });
    req.config = {
      oneofKind: 'emailServiceConfig',
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
            if (response?.configNode) {
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
    if (config.etag) req.etag = StringValue.create({ value: config.etag });
    if (config.displayName) req.displayName = StringValue.create({ value: config.displayName });
    if (config.description) req.description = StringValue.create({ value: config.description });
    req.config = {
      oneofKind: 'emailServiceConfig',
      emailServiceConfig: config.marshal(),
    };

    return new Promise<EmailProviderType>((resolve, reject) => {
      this.client.updateConfigNode(req, (err, response) => {
        if (err) reject(err);
        else
          try {
            if (response?.id === config.id) {
              config.etag = response?.etag;
              config.updateTime = Utils.timestampToDate(response?.updateTime);
              resolve(config);
            } else {
              reject(
                new SdkError(
                  SdkErrorCode.SDK_CODE_1,
                  `Update returned with different id: req.iq=${config.id}, res.id=${response?.id}`,
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
    if (config.etag) req.etag = StringValue.create({ value: config.etag });

    return new Promise<boolean>((resolve, reject) => {
      this.client.deleteConfigNode(req, (err) => {
        if (err) reject(false);
        else resolve(true);
      });
    });
  }

  createAuthflowConfiguration(location: string, config: AuthFlow): Promise<AuthFlow> {
    const req = CreateConfigNodeRequest.fromJson({
      location,
      name: config.name,
    });
    req.config = {
      oneofKind: 'authFlowConfig',
      authFlowConfig: config.marshal(),
    };
    // console.log(JSON.stringify(nr, null, 2));
    return new Promise((resolve, reject) => {
      this.client.createConfigNode(req, (err, response) => {
        if (err) reject(err);
        else
          try {
            config.id = response?.id;
            config.etag = response?.etag;
            config.createTime = Utils.timestampToDate(response?.createTime);
            config.updateTime = Utils.timestampToDate(response?.updateTime);
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
            if (response?.configNode) {
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
    if (config.etag) req.etag = StringValue.create({ value: config.etag });
    if (config.displayName) req.displayName = StringValue.create({ value: config.displayName });
    if (config.description) req.description = StringValue.create({ value: config.description });
    req.config = {
      oneofKind: 'authFlowConfig',
      authFlowConfig: config.marshal(),
    };

    return new Promise<AuthFlow>((resolve, reject) => {
      this.client.updateConfigNode(req, (err, response) => {
        if (err) reject(err);
        else
          try {
            if (response?.id === config.id) {
              config.etag = response?.etag;
              config.updateTime = Utils.timestampToDate(response?.updateTime);
              resolve(config);
            } else {
              reject(
                new SdkError(
                  SdkErrorCode.SDK_CODE_1,
                  `Update returned with different id: req.iq=${config.id}, res.id=${response?.id}`,
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
    if (config.etag) req.etag = StringValue.create({ value: config.etag });

    return new Promise<boolean>((resolve, reject) => {
      this.client.deleteConfigNode(req, (err) => {
        if (err) reject(false);
        else resolve(true);
      });
    });
  }

  readCustomerById(id: string): Promise<Customer> {
    return new Promise((resolve, reject) => {
      this.client.readCustomer(
        {
          identifier: {
            oneofKind: 'id',
            id,
          },
        },
        (err, response) => {
          if (err) reject(err);
          else if (!response) reject(new SdkError(SdkErrorCode.SDK_CODE_1, 'No customer response'));
          else resolve(Customer.deserialize(response));
        },
      );
    });
  }

  readCustomerByName(name: string): Promise<Customer> {
    return new Promise((resolve, reject) => {
      this.client.readCustomer(
        {
          identifier: {
            oneofKind: 'name',
            name,
          },
        },
        (err, response) => {
          if (err) reject(err);
          else if (!response) reject(new SdkError(SdkErrorCode.SDK_CODE_1, 'No customer response'));
          else resolve(Customer.deserialize(response));
        },
      );
    });
  }

  createApplicationSpace(
    customerId: string,
    name: string,
    displayName?: string,
    description?: string,
  ): Promise<string | undefined> {
    return new Promise((resolve, reject) => {
      this.client.createApplicationSpace(
        {
          customerId,
          name,
          displayName: StringValue.create({ value: displayName }),
          description: StringValue.create({ value: description }),
        },
        (err, response) => {
          if (err) reject(err);
          else resolve(response?.id);
        },
      );
    });
  }

  readApplicationSpaceById(id: string): Promise<ApplicationSpace> {
    return new Promise((resolve, reject) => {
      this.client.readApplicationSpace(
        {
          identifier: {
            oneofKind: 'id',
            id,
          },
        },
        (err, response) => {
          if (err) reject(err);
          else if (!response) {
            reject(new SdkError(SdkErrorCode.SDK_CODE_1, 'No application space response'));
          } else {
            resolve(ApplicationSpace.deserialize(response));
          }
        },
      );
    });
  }

  readApplicationSpaceByName(location: string, name: string): Promise<ApplicationSpace> {
    return new Promise((resolve, reject) => {
      this.client.readApplicationSpace(
        {
          identifier: {
            oneofKind: 'name',
            name: {
              location,
              name,
            },
          },
        },
        (err, response) => {
          if (err) reject(err);
          else if (!response) {
            reject(new SdkError(SdkErrorCode.SDK_CODE_1, 'No application space response'));
          } else {
            resolve(ApplicationSpace.deserialize(response));
          }
        },
      );
    });
  }

  readApplicationSpaceList(
    customerId: string,
    appSpaceNames: string[],
  ): Promise<ApplicationSpace[]> {
    return new Promise((resolve, reject) => {
      const list: ApplicationSpace[] = [];
      const stream = this.client
        .listApplicationSpaces({
          customerId,
          match: appSpaceNames,
        })
        .on('readable', () => {
          const value = stream.read();
          if (value && value.appSpace) {
            list.push(ApplicationSpace.deserialize(value));
          }
        })
        .on('close', () => {
          resolve(list);
        })
        .on('error', (err) => {
          reject(err);
        });
    });
  }

  updateApplicationSpace(appSpace: ApplicationSpace): Promise<ApplicationSpace> {
    return new Promise((resolve, reject) => {
      const req: UpdateApplicationSpaceRequest = {
        id: appSpace.id,
        etag: StringValue.create({ value: appSpace.etag }),
        displayName: StringValue.create({ value: appSpace.displayName }),
        description: StringValue.create({ value: appSpace.description }),
      };

      this.client.updateApplicationSpace(req, (err, response) => {
        if (err) reject(err);
        else {
          try {
            if (response?.id === appSpace.id) {
              appSpace.etag = response.etag;
              appSpace.updateTime = Utils.timestampToDate(response.updateTime);
              resolve(appSpace);
            } else {
              reject(
                new SdkError(
                  SdkErrorCode.SDK_CODE_1,
                  `Update returned with different id: req.iq=${appSpace.id}, res.id=${response?.id}`,
                ),
              );
            }
          } catch (err) {
            reject(err);
          }
        }
      });
    });
  }

  deleteApplicationSpace(appSpace: ApplicationSpace): Promise<boolean> {
    const req = {
      id: appSpace.id,
      etag: StringValue.create({ value: appSpace.etag }),
    } as DeleteApplicationSpaceRequest;
    return new Promise<boolean>((resolve, reject) => {
      this.client.deleteApplicationSpace(req, (err) => {
        if (err) reject(err);
        else resolve(true);
      });
    });
  }
}
