import {
  CreateApplicationAgentRequest,
  CreateApplicationRequest,
  CreateApplicationSpaceRequest,
  CreateConfigNodeRequest,
  CreateOAuth2ApplicationRequest,
  CreateOAuth2ProviderRequest,
  CreateServiceAccountRequest,
  CreateTenantRequest,
  DeleteApplicationAgentCredentialRequest,
  DeleteApplicationAgentRequest,
  DeleteApplicationSpaceRequest,
  DeleteConfigNodeRequest,
  DeleteOAuth2ApplicationRequest,
  DeleteOAuth2ProviderRequest,
  DeleteServiceAccountRequest,
  ReadApplicationAgentCredentialRequest,
  RegisterApplicationAgentCredentialRequest,
  UpdateApplicationAgentRequest,
  UpdateApplicationRequest,
  UpdateApplicationSpaceRequest,
  UpdateConfigNodeRequest,
  UpdateOAuth2ApplicationRequest,
  UpdateOAuth2ProviderRequest,
  UpdateServiceAccountRequest,
  UpdateTenantRequest,
} from '../grpc/indykite/config/v1beta1/config_management_api';
import { SdkClient } from './client/client';
import { SdkErrorCode, SdkError } from './error';
import { AuthFlow } from './model/config/authflow/flow';
import { EmailProviderType } from './model/config/email/factory';
import { ConfigurationFactory } from './model/config/factory';
import { Customer } from './model/config/customer';
import { ApplicationSpace } from './model/config/application_space';
import { ConfigManagementAPIClient } from '../grpc/indykite/config/v1beta1/config_management_api.grpc-client';
import { StringValue } from '../grpc/google/protobuf/wrappers';
import { Utils } from './utils/utils';
import { Tenant } from './model/config/tenant';
import { Application } from './model/config/application';
import { ApplicationAgent } from './model/config/application_agent';
import { ApplicationAgentCredential } from './model/config/application_agent_credential';
import { OAuth2ApplicationConfig } from './model/config/oauth2_application_config';
import { OAuth2Application } from './model/config/oauth2_application';
import { OAuth2Client } from './model/config/oauth2_client/oauth2_client';
import { OAuth2ProviderConfig } from './model/config/oauth2_provider_config';
import { OAuth2Provider } from './model/config/oauth2_provider';
import { ServiceAccount } from './model/config/service_account';
export class ConfigClient {
  private client: ConfigManagementAPIClient;

  constructor(sdk: SdkClient) {
    this.client = sdk.client as ConfigManagementAPIClient;
  }

  static createInstance(appCredential?: string): Promise<ConfigClient> {
    return new Promise<ConfigClient>((resolve, reject) => {
      SdkClient.createServiceInstance(ConfigManagementAPIClient, appCredential)
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
            if (response && response.configNode) {
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
    if (config.displayName !== undefined)
      req.displayName = StringValue.create({ value: config.displayName });
    if (config.description !== undefined)
      req.description = StringValue.create({ value: config.description });
    req.config = {
      oneofKind: 'emailServiceConfig',
      emailServiceConfig: config.marshal(),
    };

    return new Promise<EmailProviderType>((resolve, reject) => {
      this.client.updateConfigNode(req, (err, response) => {
        if (err) reject(err);
        else
          try {
            if (response && response.id === config.id) {
              config.etag = response.etag;
              config.updateTime = Utils.timestampToDate(response.updateTime);
              resolve(config);
            } else {
              reject(
                new SdkError(
                  SdkErrorCode.SDK_CODE_1,
                  `Update returned with different id: req.iq=${config.id}, res.id=${
                    response ? response.id : 'undefined'
                  }`,
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
    if (config.etag !== undefined) req.etag = StringValue.create({ value: config.etag });

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
        else {
          if (!response) {
            reject(new SdkError(SdkErrorCode.SDK_CODE_1, 'No auth flow response'));
            return;
          }

          try {
            config.id = response.id;
            config.etag = response.etag;
            config.createTime = Utils.timestampToDate(response.createTime);
            config.updateTime = Utils.timestampToDate(response.updateTime);
            resolve(config);
          } catch (err) {
            reject(err);
          }
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
            if (response && response.configNode) {
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
    if (config.etag !== undefined) req.etag = StringValue.create({ value: config.etag });
    if (config.displayName !== undefined)
      req.displayName = StringValue.create({ value: config.displayName });
    if (config.description !== undefined)
      req.description = StringValue.create({ value: config.description });
    req.config = {
      oneofKind: 'authFlowConfig',
      authFlowConfig: config.marshal(),
    };

    return new Promise<AuthFlow>((resolve, reject) => {
      this.client.updateConfigNode(req, (err, response) => {
        if (err) reject(err);
        else
          try {
            if (response && response.id === config.id) {
              config.etag = response.etag;
              config.updateTime = Utils.timestampToDate(response.updateTime);
              resolve(config);
            } else {
              reject(
                new SdkError(
                  SdkErrorCode.SDK_CODE_1,
                  `Update returned with different id: req.iq=${config.id}, res.id=${
                    response ? response.id : 'undefined'
                  }`,
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
    if (config.etag !== undefined) req.etag = StringValue.create({ value: config.etag });

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
  ): Promise<ApplicationSpace> {
    return new Promise((resolve, reject) => {
      const req: CreateApplicationSpaceRequest = {
        customerId,
        name,
      };

      if (displayName !== undefined) req.displayName = StringValue.create({ value: displayName });
      if (description !== undefined) req.description = StringValue.create({ value: description });

      this.client.createApplicationSpace(req, (err, response) => {
        if (err) reject(err);
        else if (!response)
          reject(new SdkError(SdkErrorCode.SDK_CODE_1, 'No application space response'));
        else
          resolve(
            ApplicationSpace.deserialize(response, customerId, name, displayName, description),
          );
      });
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
      };

      if (appSpace.etag !== undefined) req.etag = StringValue.create({ value: appSpace.etag });
      if (appSpace.displayName !== undefined)
        req.displayName = StringValue.create({ value: appSpace.displayName });
      if (appSpace.description !== undefined)
        req.description = StringValue.create({ value: appSpace.description });

      this.client.updateApplicationSpace(req, (err, response) => {
        if (err) reject(err);
        else {
          try {
            if (response && response.id === appSpace.id) {
              appSpace.etag = response.etag;
              appSpace.updateTime = Utils.timestampToDate(response.updateTime);
              resolve(appSpace);
            } else {
              reject(
                new SdkError(
                  SdkErrorCode.SDK_CODE_1,
                  `Update returned with different id: req.iq=${appSpace.id}, res.id=${
                    response ? response.id : 'undefined'
                  }`,
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
    } as DeleteApplicationSpaceRequest;

    if (appSpace.etag !== undefined) req.etag = StringValue.create({ value: appSpace.etag });

    return new Promise<boolean>((resolve, reject) => {
      this.client.deleteApplicationSpace(req, (err) => {
        if (err) reject(err);
        else resolve(true);
      });
    });
  }

  createTenant(
    issuerId: string,
    name: string,
    displayName?: string,
    description?: string,
  ): Promise<Tenant> {
    return new Promise((resolve, reject) => {
      const req: CreateTenantRequest = {
        issuerId,
        name,
      };

      if (displayName !== undefined) req.displayName = StringValue.create({ value: displayName });
      if (description !== undefined) req.description = StringValue.create({ value: description });

      this.client.createTenant(req, (err, response) => {
        if (err) reject(err);
        else if (!response) reject(new SdkError(SdkErrorCode.SDK_CODE_1, 'No tenant response'));
        else resolve(Tenant.deserialize(response, issuerId, name, displayName, description));
      });
    });
  }

  readTenantById(id: string): Promise<Tenant> {
    return new Promise((resolve, reject) => {
      this.client.readTenant(
        {
          identifier: {
            oneofKind: 'id',
            id,
          },
        },
        (err, response) => {
          if (err) reject(err);
          else if (!response) {
            reject(new SdkError(SdkErrorCode.SDK_CODE_1, 'No tenant response'));
          } else {
            resolve(Tenant.deserialize(response));
          }
        },
      );
    });
  }

  readTenantByName(location: string, name: string): Promise<Tenant> {
    return new Promise((resolve, reject) => {
      this.client.readTenant(
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
            reject(new SdkError(SdkErrorCode.SDK_CODE_1, 'No tenant response'));
          } else {
            resolve(Tenant.deserialize(response));
          }
        },
      );
    });
  }

  updateTenant(tenant: Tenant): Promise<Tenant> {
    return new Promise((resolve, reject) => {
      const req: UpdateTenantRequest = {
        id: tenant.id,
      };

      if (tenant.etag !== undefined) req.etag = StringValue.create({ value: tenant.etag });
      if (tenant.displayName !== undefined)
        req.displayName = StringValue.create({ value: tenant.displayName });
      if (tenant.description !== undefined)
        req.description = StringValue.create({ value: tenant.description });

      this.client.updateTenant(req, (err, response) => {
        if (err) reject(err);
        else {
          try {
            if (response && response.id === tenant.id) {
              tenant.etag = response.etag;
              tenant.updateTime = Utils.timestampToDate(response.updateTime);
              resolve(tenant);
            } else {
              reject(
                new SdkError(
                  SdkErrorCode.SDK_CODE_1,
                  `Update returned with different id: req.iq=${tenant.id}, res.id=${
                    response ? response.id : 'undefined'
                  }`,
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

  readTenantList(appSpaceId: string, tenantIds: string[]): Promise<Tenant[]> {
    return new Promise((resolve, reject) => {
      const list: Tenant[] = [];
      this.client
        .listTenants({
          appSpaceId,
          match: tenantIds,
        })
        .on('error', (err) => {
          reject(err);
        })
        .on('data', (data) => {
          if (data && data.tenant) {
            list.push(Tenant.deserialize(data));
          }
        })
        .on('end', () => {
          resolve(list);
        });
    });
  }

  createApplication(
    appSpaceId: string,
    name: string,
    displayName?: string,
    description?: string,
  ): Promise<Application> {
    return new Promise((resolve, reject) => {
      const req: CreateApplicationRequest = {
        appSpaceId,
        name,
      };

      if (displayName !== undefined) req.displayName = StringValue.create({ value: displayName });
      if (description !== undefined) req.description = StringValue.create({ value: description });

      this.client.createApplication(req, (err, response) => {
        if (err) reject(err);
        else if (!response)
          reject(new SdkError(SdkErrorCode.SDK_CODE_1, 'No application response'));
        else resolve(Application.deserialize(response, appSpaceId, name, displayName, description));
      });
    });
  }

  readApplicationById(applicationId: string): Promise<Application> {
    return new Promise((resolve, reject) => {
      this.client.readApplication(
        {
          identifier: {
            oneofKind: 'id',
            id: applicationId,
          },
        },
        (err, response) => {
          if (err) reject(err);
          else if (!response) {
            reject(new SdkError(SdkErrorCode.SDK_CODE_1, 'No application response'));
          } else {
            resolve(Application.deserialize(response));
          }
        },
      );
    });
  }

  readApplicationByName(appSpaceId: string, name: string): Promise<Application> {
    return new Promise((resolve, reject) => {
      this.client.readApplication(
        {
          identifier: {
            oneofKind: 'name',
            name: {
              location: appSpaceId,
              name,
            },
          },
        },
        (err, response) => {
          if (err) reject(err);
          else if (!response) {
            reject(new SdkError(SdkErrorCode.SDK_CODE_1, 'No application response'));
          } else {
            resolve(Application.deserialize(response));
          }
        },
      );
    });
  }

  updateApplication(application: Application): Promise<Application> {
    return new Promise((resolve, reject) => {
      const req: UpdateApplicationRequest = {
        id: application.id,
      };

      if (application.etag !== undefined)
        req.etag = StringValue.create({ value: application.etag });
      if (application.displayName !== undefined)
        req.displayName = StringValue.create({ value: application.displayName });
      if (application.description !== undefined)
        req.description = StringValue.create({ value: application.description });

      this.client.updateApplication(req, (err, response) => {
        if (err) reject(err);
        else {
          try {
            if (response && response.id === application.id) {
              application.etag = response.etag;
              application.updateTime = Utils.timestampToDate(response.updateTime);
              resolve(application);
            } else {
              reject(
                new SdkError(
                  SdkErrorCode.SDK_CODE_1,
                  `Update returned with different id: req.iq=${application.id}, res.id=${
                    response ? response.id : 'undefined'
                  }`,
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

  readApplicationList(appSpaceId: string, applicationIds: string[]): Promise<Application[]> {
    return new Promise((resolve, reject) => {
      const list: Application[] = [];
      this.client
        .listApplications({
          appSpaceId,
          match: applicationIds,
        })
        .on('error', (err) => {
          reject(err);
        })
        .on('data', (data) => {
          if (data && data.application) {
            list.push(Application.deserialize(data));
          }
        })
        .on('end', () => {
          resolve(list);
        });
    });
  }

  createApplicationAgent(
    applicationId: string,
    name: string,
    displayName?: string,
    description?: string,
  ): Promise<ApplicationAgent> {
    return new Promise((resolve, reject) => {
      const req: CreateApplicationAgentRequest = {
        applicationId,
        name,
      };

      if (displayName !== undefined) req.displayName = StringValue.create({ value: displayName });
      if (description !== undefined) req.description = StringValue.create({ value: description });

      this.client.createApplicationAgent(req, (err, response) => {
        if (err) reject(err);
        else if (!response)
          reject(new SdkError(SdkErrorCode.SDK_CODE_1, 'No application agent response'));
        else
          resolve(
            ApplicationAgent.deserialize(response, applicationId, name, displayName, description),
          );
      });
    });
  }

  readApplicationAgentById(applicationAgentId: string): Promise<ApplicationAgent> {
    return new Promise((resolve, reject) => {
      this.client.readApplicationAgent(
        {
          identifier: {
            oneofKind: 'id',
            id: applicationAgentId,
          },
        },
        (err, response) => {
          if (err) reject(err);
          else if (!response) {
            reject(new SdkError(SdkErrorCode.SDK_CODE_1, 'No application agent response'));
          } else {
            resolve(ApplicationAgent.deserialize(response));
          }
        },
      );
    });
  }

  readApplicationAgentByName(appSpaceId: string, name: string): Promise<ApplicationAgent> {
    return new Promise((resolve, reject) => {
      this.client.readApplicationAgent(
        {
          identifier: {
            oneofKind: 'name',
            name: {
              location: appSpaceId,
              name,
            },
          },
        },
        (err, response) => {
          if (err) reject(err);
          else if (!response) {
            reject(new SdkError(SdkErrorCode.SDK_CODE_1, 'No application agent response'));
          } else {
            resolve(ApplicationAgent.deserialize(response));
          }
        },
      );
    });
  }

  updateApplicationAgent(applicationAgent: ApplicationAgent): Promise<ApplicationAgent> {
    return new Promise((resolve, reject) => {
      const req: UpdateApplicationAgentRequest = {
        id: applicationAgent.id,
      };

      if (applicationAgent.etag !== undefined)
        req.etag = StringValue.create({ value: applicationAgent.etag });
      if (applicationAgent.displayName !== undefined)
        req.displayName = StringValue.create({ value: applicationAgent.displayName });
      if (applicationAgent.description !== undefined)
        req.description = StringValue.create({ value: applicationAgent.description });

      this.client.updateApplicationAgent(req, (err, response) => {
        if (err) reject(err);
        else {
          try {
            if (response && response.id === applicationAgent.id) {
              applicationAgent.etag = response.etag;
              applicationAgent.updateTime = Utils.timestampToDate(response.updateTime);
              resolve(applicationAgent);
            } else {
              reject(
                new SdkError(
                  SdkErrorCode.SDK_CODE_1,
                  `Update returned with different id: req.iq=${applicationAgent.id}, res.id=${
                    response ? response.id : 'undefined'
                  }`,
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

  readApplicationAgentList(
    appSpaceId: string,
    applicationAgentIds: string[],
  ): Promise<ApplicationAgent[]> {
    return new Promise((resolve, reject) => {
      const list: ApplicationAgent[] = [];
      this.client
        .listApplicationAgents({
          appSpaceId,
          match: applicationAgentIds,
        })
        .on('error', (err) => {
          reject(err);
        })
        .on('data', (data) => {
          if (data && data.applicationAgent) {
            list.push(ApplicationAgent.deserialize(data));
          }
        })
        .on('end', () => {
          resolve(list);
        });
    });
  }

  deleteApplicationAgent(appAgentId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const req: DeleteApplicationAgentRequest = {
        id: appAgentId,
      };

      this.client.deleteApplicationAgent(req, (err, response) => {
        if (err) reject(err);
        else if (!response)
          reject(new SdkError(SdkErrorCode.SDK_CODE_1, 'No application agent response'));
        else resolve();
      });
    });
  }

  registerApplicationCredential(
    appAgentId: string,
    displayName: string,
    defaultTenantId: string,
    publicKeyType?: 'jwk' | 'pem',
    publicKey?: Buffer,
    expireTime?: Date,
  ): Promise<ApplicationAgentCredential> {
    return new Promise((resolve, reject) => {
      let publicKeyObject = {
        oneofKind: undefined,
      } as RegisterApplicationAgentCredentialRequest['publicKey'];
      if (publicKeyType !== undefined && publicKey !== undefined) {
        switch (publicKeyType) {
          case 'jwk':
            publicKeyObject = { oneofKind: 'jwk', jwk: publicKey };
            break;
          case 'pem':
            publicKeyObject = { oneofKind: 'pem', pem: publicKey };
            break;
        }
      }

      const req: RegisterApplicationAgentCredentialRequest = {
        applicationAgentId: appAgentId,
        displayName,
        defaultTenantId,
        publicKey: publicKeyObject,
      };

      if (expireTime !== undefined) req.expireTime = Utils.dateToTimestamp(expireTime);

      this.client.registerApplicationAgentCredential(req, (err, response) => {
        if (err) reject(err);
        else if (!response)
          reject(new SdkError(SdkErrorCode.SDK_CODE_1, 'No application agent credential response'));
        else resolve(ApplicationAgentCredential.deserialize(response, displayName, appAgentId));
      });
    });
  }

  readApplicationAgentCredential(appCredentialId: string): Promise<ApplicationAgentCredential> {
    return new Promise((resolve, reject) => {
      const req: ReadApplicationAgentCredentialRequest = {
        id: appCredentialId,
      };

      this.client.readApplicationAgentCredential(req, (err, response) => {
        if (err) reject(err);
        else if (!response)
          reject(new SdkError(SdkErrorCode.SDK_CODE_1, 'No application agent credential response'));
        else resolve(ApplicationAgentCredential.deserialize(response));
      });
    });
  }

  deleteApplicationAgentCredential(appCredentialId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const req: DeleteApplicationAgentCredentialRequest = {
        id: appCredentialId,
      };

      this.client.deleteApplicationAgentCredential(req, (err, response) => {
        if (err) reject(err);
        else if (!response)
          reject(new SdkError(SdkErrorCode.SDK_CODE_1, 'No application agent credential response'));
        else resolve();
      });
    });
  }

  createOAuth2Provider(
    appSpaceId: string,
    name: string,
    config: OAuth2ProviderConfig,
    displayName?: string,
    description?: string,
  ): Promise<OAuth2Provider> {
    return new Promise((resolve, reject) => {
      const req: CreateOAuth2ProviderRequest = {
        appSpaceId,
        name,
        config: {
          ...config,
          responseTypes: config.responseTypes ?? [],
          scopes: config.scopes ?? [],
          tokenEndpointAuthMethod: config.tokenEndpointAuthMethod ?? [],
          tokenEndpointAuthSigningAlg: config.tokenEndpointAuthSigningAlg ?? [],
          requestUris: config.requestUris ?? [],
          requestObjectSigningAlg: config.requestObjectSigningAlg ?? '',
          frontChannelConsentUri: config.frontChannelConsentUri ?? {},
          frontChannelLoginUri: config.frontChannelLoginUri ?? {},
        },
      };

      if (displayName !== undefined) req.displayName = StringValue.create({ value: displayName });
      if (description !== undefined) req.description = StringValue.create({ value: description });

      this.client.createOAuth2Provider(req, (err, response) => {
        if (err) reject(err);
        else if (!response)
          reject(new SdkError(SdkErrorCode.SDK_CODE_1, 'No OAuth2 provider response'));
        else
          resolve(
            OAuth2Provider.deserialize(
              response,
              name,
              appSpaceId,
              config,
              displayName,
              description,
            ),
          );
      });
    });
  }

  readOAuth2Provider(id: string): Promise<OAuth2Provider> {
    return new Promise((resolve, reject) => {
      this.client.readOAuth2Provider({ id }, (err, response) => {
        if (err) reject(err);
        else if (!response) {
          reject(new SdkError(SdkErrorCode.SDK_CODE_1, 'No OAuth2 provider response'));
        } else {
          resolve(OAuth2Provider.deserialize(response));
        }
      });
    });
  }

  updateOAuth2Provider(oauth2Provider: OAuth2Provider): Promise<OAuth2Provider> {
    return new Promise((resolve, reject) => {
      const req: UpdateOAuth2ProviderRequest = {
        id: oauth2Provider.id,
      };

      if (oauth2Provider.etag !== undefined)
        req.etag = StringValue.create({ value: oauth2Provider.etag });
      if (oauth2Provider.displayName !== undefined)
        req.displayName = StringValue.create({ value: oauth2Provider.displayName });
      if (oauth2Provider.description !== undefined)
        req.description = StringValue.create({ value: oauth2Provider.description });

      const config = oauth2Provider.config?.marshal();
      if (config) req.config = config;

      this.client.updateOAuth2Provider(req, (err, response) => {
        if (err) reject(err);
        else {
          try {
            if (response && response.id === oauth2Provider.id) {
              oauth2Provider.etag = response.etag;
              oauth2Provider.updateTime = Utils.timestampToDate(response.updateTime);
              resolve(oauth2Provider);
            } else {
              reject(
                new SdkError(
                  SdkErrorCode.SDK_CODE_1,
                  `Update returned with different id: req.iq=${oauth2Provider.id}, res.id=${
                    response ? response.id : 'undefined'
                  }`,
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

  deleteOAuth2Provider(id: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const req: DeleteOAuth2ProviderRequest = {
        id,
      };

      this.client.deleteOAuth2Provider(req, (err, response) => {
        if (err) reject(err);
        else if (!response)
          reject(new SdkError(SdkErrorCode.SDK_CODE_1, 'No OAuth2 provider response'));
        else resolve();
      });
    });
  }

  createOAuth2Application(
    oauth2ProviderId: string,
    name: string,
    config: OAuth2ApplicationConfig,
    displayName?: string,
    description?: string,
  ): Promise<OAuth2Application> {
    return new Promise((resolve, reject) => {
      const req: CreateOAuth2ApplicationRequest = {
        oauth2ProviderId,
        name,
        config: {
          ...config,
          audiences: config.audiences ?? [],
          description: config.description ?? '',
          allowedCorsOrigins: config.allowedCorsOrigins ?? [],
          additionalContacts: config.additionalContacts ?? [],
          sectorIdentifierUri: config.sectorIdentifierUri ?? '',
          grantTypes: config.grantTypes ?? [],
          responseTypes: config.responseTypes ?? [],
          userinfoSignedResponseAlg: config.userinfoSignedResponseAlg ?? '',
        },
      };

      if (displayName !== undefined) req.displayName = StringValue.create({ value: displayName });
      if (description !== undefined) req.description = StringValue.create({ value: description });

      this.client.createOAuth2Application(req, (err, response) => {
        if (err) reject(err);
        else if (!response)
          reject(new SdkError(SdkErrorCode.SDK_CODE_1, 'No OAuth2 client response'));
        else
          resolve(OAuth2Application.deserialize(response, name, config, displayName, description));
      });
    });
  }

  readOAuth2Application(id: string): Promise<OAuth2Application> {
    return new Promise((resolve, reject) => {
      this.client.readOAuth2Application({ id }, (err, response) => {
        if (err) reject(err);
        else if (!response) {
          reject(new SdkError(SdkErrorCode.SDK_CODE_1, 'No OAuth2 client response'));
        } else {
          resolve(OAuth2Application.deserialize(response));
        }
      });
    });
  }

  updateOAuth2Application(oauth2Client: OAuth2Application): Promise<OAuth2Application> {
    return new Promise((resolve, reject) => {
      const req: UpdateOAuth2ApplicationRequest = {
        id: oauth2Client.id,
      };

      if (oauth2Client.etag !== undefined)
        req.etag = StringValue.create({ value: oauth2Client.etag });
      if (oauth2Client.displayName !== undefined)
        req.displayName = StringValue.create({ value: oauth2Client.displayName });
      if (oauth2Client.description !== undefined)
        req.description = StringValue.create({ value: oauth2Client.description });

      const config = oauth2Client.config?.marshal();
      if (config) req.config = config;

      this.client.updateOAuth2Application(req, (err, response) => {
        if (err) reject(err);
        else {
          try {
            if (response && response.id === oauth2Client.id) {
              oauth2Client.etag = response.etag;
              oauth2Client.updateTime = Utils.timestampToDate(response.updateTime);
              resolve(oauth2Client);
            } else {
              reject(
                new SdkError(
                  SdkErrorCode.SDK_CODE_1,
                  `Update returned with different id: req.iq=${oauth2Client.id}, res.id=${
                    response ? response.id : 'undefined'
                  }`,
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

  deleteOAuth2Application(id: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const req: DeleteOAuth2ApplicationRequest = {
        id: id,
      };

      this.client.deleteOAuth2Application(req, (err, response) => {
        if (err) reject(err);
        else if (!response)
          reject(new SdkError(SdkErrorCode.SDK_CODE_1, 'No OAuth2 application response'));
        else resolve();
      });
    });
  }

  createOAuth2Client(location: string, oauth2Client: OAuth2Client): Promise<OAuth2Client> {
    const req = CreateConfigNodeRequest.fromJson({
      location,
      name: oauth2Client.name,
    });
    if (oauth2Client.displayName !== undefined) {
      req.displayName = StringValue.fromJson(oauth2Client.displayName);
    }
    if (oauth2Client.description !== undefined) {
      req.description = StringValue.fromJson(oauth2Client.description);
    }
    req.config = {
      oneofKind: 'oauth2ClientConfig',
      oauth2ClientConfig: oauth2Client.marshal(),
    };

    return new Promise((resolve, reject) => {
      this.client.createConfigNode(req, (err, response) => {
        if (err) reject(err);
        else {
          if (!response) {
            reject(new SdkError(SdkErrorCode.SDK_CODE_1, 'No OAuth2 client response'));
            return;
          }

          try {
            oauth2Client.id = response.id;
            oauth2Client.etag = response.etag;
            oauth2Client.createTime = Utils.timestampToDate(response.createTime);
            oauth2Client.updateTime = Utils.timestampToDate(response.updateTime);
            resolve(oauth2Client);
          } catch (err) {
            reject(err);
          }
        }
      });
    });
  }

  readOAuth2Client(id: string): Promise<OAuth2Client> {
    return new Promise((resolve, reject) => {
      this.client.readConfigNode({ id }, (err, response) => {
        if (err) reject(err);
        else
          try {
            if (response && response.configNode) {
              const ret = ConfigurationFactory.createInstance(response.configNode) as OAuth2Client;
              resolve(ret);
            } else {
              reject(new SdkError(SdkErrorCode.SDK_CODE_1, 'config_error_read_oauth2client'));
            }
          } catch (err) {
            reject(err);
          }
      });
    });
  }

  updateOAuth2Client(config: OAuth2Client): Promise<OAuth2Client> {
    const req = {
      id: config.id,
    } as UpdateConfigNodeRequest;
    if (config.etag !== undefined) req.etag = StringValue.create({ value: config.etag });
    if (config.displayName !== undefined)
      req.displayName = StringValue.create({ value: config.displayName });
    if (config.description !== undefined)
      req.description = StringValue.create({ value: config.description });
    req.config = {
      oneofKind: 'oauth2ClientConfig',
      oauth2ClientConfig: config.marshal(),
    };

    return new Promise<OAuth2Client>((resolve, reject) => {
      this.client.updateConfigNode(req, (err, response) => {
        if (err) reject(err);
        else
          try {
            if (response && response.id === config.id) {
              config.etag = response.etag;
              config.updateTime = Utils.timestampToDate(response.updateTime);
              resolve(config);
            } else {
              reject(
                new SdkError(
                  SdkErrorCode.SDK_CODE_1,
                  `Update returned with different id: req.iq=${config.id}, res.id=${
                    response ? response.id : 'undefined'
                  }`,
                ),
              );
            }
          } catch (err) {
            reject(err);
          }
      });
    });
  }

  deleteOAuth2Client(config: OAuth2Client): Promise<void> {
    const req = {
      id: config.id,
    } as DeleteConfigNodeRequest;
    if (config.etag !== undefined) req.etag = StringValue.create({ value: config.etag });

    return new Promise((resolve, reject) => {
      this.client.deleteConfigNode(req, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  createServiceAccount(
    location: string,
    name: string,
    role: string,
    displayName?: string,
    description?: string,
  ): Promise<ServiceAccount> {
    return new Promise((resolve, reject) => {
      const req: CreateServiceAccountRequest = {
        location,
        name,
        role,
      };

      if (displayName !== undefined) req.displayName = StringValue.create({ value: displayName });
      if (description !== undefined) req.description = StringValue.create({ value: description });

      this.client.createServiceAccount(req, (err, response) => {
        if (err) reject(err);
        else if (!response)
          reject(new SdkError(SdkErrorCode.SDK_CODE_1, 'No service account response'));
        else resolve(ServiceAccount.deserialize(response, name, displayName, description));
      });
    });
  }

  readServiceAccountById(id: string): Promise<ServiceAccount> {
    return new Promise((resolve, reject) => {
      this.client.readServiceAccount(
        {
          identifier: {
            oneofKind: 'id',
            id,
          },
        },
        (err, response) => {
          if (err) reject(err);
          else if (!response) {
            reject(new SdkError(SdkErrorCode.SDK_CODE_1, 'No service account response'));
          } else {
            resolve(ServiceAccount.deserialize(response));
          }
        },
      );
    });
  }

  readServiceAccountByName(location: string, name: string): Promise<ServiceAccount> {
    return new Promise((resolve, reject) => {
      this.client.readServiceAccount(
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
            reject(new SdkError(SdkErrorCode.SDK_CODE_1, 'No service account response'));
          } else {
            resolve(ServiceAccount.deserialize(response));
          }
        },
      );
    });
  }

  updateServiceAccount(serviceAccount: ServiceAccount): Promise<ServiceAccount> {
    return new Promise((resolve, reject) => {
      const req: UpdateServiceAccountRequest = {
        id: serviceAccount.id,
      };

      if (serviceAccount.etag !== undefined)
        req.etag = StringValue.create({ value: serviceAccount.etag });
      if (serviceAccount.displayName !== undefined)
        req.displayName = StringValue.create({ value: serviceAccount.displayName });
      if (serviceAccount.description !== undefined)
        req.description = StringValue.create({ value: serviceAccount.description });

      this.client.updateServiceAccount(req, (err, response) => {
        if (err) reject(err);
        else {
          if (response && response.id === serviceAccount.id) {
            serviceAccount.etag = response.etag;
            serviceAccount.updateTime = Utils.timestampToDate(response.updateTime);
            resolve(serviceAccount);
          } else {
            reject(
              new SdkError(
                SdkErrorCode.SDK_CODE_1,
                `Update returned with different id: req.iq=${serviceAccount.id}, res.id=${
                  response ? response.id : 'undefined'
                }`,
              ),
            );
          }
        }
      });
    });
  }

  deleteServiceAccount(id: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const req: DeleteServiceAccountRequest = {
        id,
      };

      this.client.deleteServiceAccount(req, (err, response) => {
        if (err) reject(err);
        else if (!response)
          reject(new SdkError(SdkErrorCode.SDK_CODE_1, 'No service account response'));
        else resolve();
      });
    });
  }
}
