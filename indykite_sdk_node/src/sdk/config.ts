import {
  AssignPermissionsRequest,
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
  DeleteApplicationRequest,
  DeleteApplicationSpaceRequest,
  DeleteConfigNodeRequest,
  DeleteOAuth2ApplicationRequest,
  DeleteOAuth2ProviderRequest,
  DeleteServiceAccountCredentialRequest,
  DeleteServiceAccountRequest,
  DeleteTenantRequest,
  ListPermissionsRequest,
  ReadApplicationAgentCredentialRequest,
  ReadServiceAccountCredentialRequest,
  RegisterApplicationAgentCredentialRequest,
  RegisterServiceAccountCredentialRequest,
  RevokePermissionsRequest,
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
import { IngestMapping } from './model/config/ingest_mapping/ingest_mapping';
import { ConfigManagementAPIClient } from '../grpc/indykite/config/v1beta1/config_management_api.grpc-client';
import { StringValue } from '../grpc/google/protobuf/wrappers';
import { Utils } from './utils/utils';
import {
  Application,
  ApplicationAgent,
  ApplicationAgentCredential,
  ApplicationSpace,
  AuthFlow,
  ConfigurationFactory,
  Customer,
  EmailProviderType,
  OAuth2Application,
  OAuth2ApplicationConfig,
  OAuth2Client,
  OAuth2Provider,
  OAuth2ProviderConfig,
  PermissionsList,
  ServiceAccount,
  ServiceAccountCredential,
  Tenant,
} from './model';

/**
 * @category Clients
 * @example
 * // Example how to create a new config client
 * const sdk = await ConfigClient.createInstance();
 */
export class ConfigClient {
  private client: ConfigManagementAPIClient;
  private lastBookmark = '';
  private bookmarkList: string[] | null = null;

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

  /**
   * Get a bookmark created after the last call changing the database state.
   * The returned value may be an empty string. This happens when no database changing
   * function was called.
   */
  getLastBookmark(): string {
    return this.lastBookmark;
  }

  /**
   * Create an empty list of bookmarks. Each function changing the database state which returns
   * a bookmark will store the bookmark into this array. Use `stopBookmarkRecording` function
   * to get the list of bookmarks.
   */
  startBookmarkRecording(): void {
    this.bookmarkList = [];
  }

  /**
   * Get a list of created bookmarks since the last `startBookmarkRecording` function call.
   */
  stopBookmarkRecording(): string[] {
    const bookmarkList = this.bookmarkList ?? [];
    this.bookmarkList = null;
    return bookmarkList;
  }

  createEmailServiceConfiguration(
    location: string,
    config: EmailProviderType,
    bookmarks: string[] = [],
  ): Promise<EmailProviderType> {
    const req = CreateConfigNodeRequest.fromJson({
      location,
      name: config.name,
      bookmarks,
    });
    req.config = {
      oneofKind: 'emailServiceConfig',
      emailServiceConfig: config.marshal(),
    };
    return new Promise<EmailProviderType>((resolve, reject) => {
      this.client.createConfigNode(req, (err, response) => {
        if (err) reject(err);
        else if (!response) new SdkError(SdkErrorCode.SDK_CODE_1, 'No email config response');
        else
          try {
            this.saveReturnedBookmark(response.bookmark);
            resolve(response as unknown as EmailProviderType);
          } catch (err) {
            reject(err);
          }
      });
    });
  }

  readEmailServiceConfiguration(id: string, bookmarks: string[] = []): Promise<EmailProviderType> {
    return new Promise((resolve, reject) => {
      this.client.readConfigNode({ id, bookmarks }, (err, response) => {
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

  updateEmailServiceConfiguration(
    config: EmailProviderType,
    bookmarks: string[] = [],
  ): Promise<EmailProviderType> {
    const req = {
      id: config.id,
      bookmarks,
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
              this.saveReturnedBookmark(response.bookmark);
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

  deleteEmailServiceConfiguration(
    config: EmailProviderType,
    bookmarks: string[] = [],
  ): Promise<boolean> {
    const req = {
      id: config.id,
      bookmarks,
    } as DeleteConfigNodeRequest;
    if (config.etag !== undefined) req.etag = StringValue.create({ value: config.etag });

    return new Promise<boolean>((resolve, reject) => {
      this.client.deleteConfigNode(req, (err, response) => {
        if (err) reject(false);
        else if (!response)
          reject(new SdkError(SdkErrorCode.SDK_CODE_1, 'No email config response'));
        else {
          this.saveReturnedBookmark(response.bookmark);
          resolve(true);
        }
      });
    });
  }

  createAuthflowConfiguration(
    location: string,
    config: AuthFlow,
    bookmarks: string[] = [],
  ): Promise<AuthFlow> {
    const req = CreateConfigNodeRequest.fromJson({
      location,
      name: config.name,
      bookmarks,
    });
    req.config = {
      oneofKind: 'authFlowConfig',
      authFlowConfig: config.marshal(),
    };

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
            this.saveReturnedBookmark(response.bookmark);
            resolve(config);
          } catch (err) {
            reject(err);
          }
        }
      });
    });
  }

  readAuthflowConfiguration(id: string, bookmarks: string[] = []): Promise<AuthFlow> {
    return new Promise((resolve, reject) => {
      this.client.readConfigNode({ id, bookmarks }, (err, response) => {
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

  updateAuthflowConfiguration(config: AuthFlow, bookmarks: string[] = []): Promise<AuthFlow> {
    const req = {
      id: config.id,
      bookmarks,
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
              this.saveReturnedBookmark(response.bookmark);
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

  deleteAuthflowConfiguration(config: AuthFlow, bookmarks: string[] = []): Promise<boolean> {
    const req = {
      id: config.id,
      bookmarks,
    } as DeleteConfigNodeRequest;
    if (config.etag !== undefined) req.etag = StringValue.create({ value: config.etag });

    return new Promise<boolean>((resolve, reject) => {
      this.client.deleteConfigNode(req, (err, response) => {
        if (err) reject(false);
        else if (!response)
          reject(new SdkError(SdkErrorCode.SDK_CODE_1, 'No auth flow config response'));
        else {
          this.saveReturnedBookmark(response.bookmark);
          resolve(true);
        }
      });
    });
  }

  createIngestMappingConfiguration(
    location: string,
    config: IngestMapping,
    bookmarks: string[] = [],
  ): Promise<IngestMapping> {
    const req = CreateConfigNodeRequest.fromJson({
      location,
      name: config.name,
      bookmarks,
    });
    req.config = {
      oneofKind: 'ingestMappingConfig',
      ingestMappingConfig: config.marshal(),
    };

    if (config.displayName !== undefined) {
      req.displayName = StringValue.fromJson(config.displayName);
    }
    if (config.description !== undefined) {
      req.description = StringValue.fromJson(config.description);
    }

    return new Promise((resolve, reject) => {
      this.client.createConfigNode(req, (err, response) => {
        if (err) reject(err);
        else {
          if (!response) {
            reject(new SdkError(SdkErrorCode.SDK_CODE_1, 'No ingest mapping response'));
            return;
          }

          config.id = response.id;
          config.etag = response.etag;
          config.createTime = Utils.timestampToDate(response.createTime);
          config.updateTime = Utils.timestampToDate(response.updateTime);
          resolve(config);
        }
      });
    });
  }

  readIngestMappingConfiguration(id: string, bookmarks: string[] = []): Promise<IngestMapping> {
    return new Promise((resolve, reject) => {
      this.client.readConfigNode({ id, bookmarks }, (err, response) => {
        if (err) reject(err);
        else if (response && response.configNode) {
          const ret = ConfigurationFactory.createInstance(response.configNode) as IngestMapping;
          resolve(ret);
        } else {
          reject(
            new SdkError(SdkErrorCode.SDK_CODE_1, 'config_error_read_ingestmappingconfiguration'),
          );
        }
      });
    });
  }

  updateIngestMappingConfiguration(
    config: IngestMapping,
    bookmarks: string[] = [],
  ): Promise<IngestMapping> {
    const req = {
      id: config.id,
      bookmarks,
    } as UpdateConfigNodeRequest;
    if (config.etag !== undefined) req.etag = StringValue.create({ value: config.etag });
    if (config.displayName !== undefined)
      req.displayName = StringValue.create({ value: config.displayName });
    if (config.description !== undefined)
      req.description = StringValue.create({ value: config.description });
    req.config = {
      oneofKind: 'ingestMappingConfig',
      ingestMappingConfig: config.marshal(),
    };

    return new Promise<IngestMapping>((resolve, reject) => {
      this.client.updateConfigNode(req, (err, response) => {
        if (err) reject(err);
        else if (response && response.id === config.id) {
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
      });
    });
  }

  deleteIngestMappingConfiguration(
    config: IngestMapping,
    bookmarks: string[] = [],
  ): Promise<boolean> {
    const req = {
      id: config.id,
      bookmarks,
    } as DeleteConfigNodeRequest;
    if (config.etag !== undefined) req.etag = StringValue.create({ value: config.etag });

    return new Promise<boolean>((resolve, reject) => {
      this.client.deleteConfigNode(req, (err) => {
        if (err) reject(err);
        else resolve(true);
      });
    });
  }

  readCustomerById(id: string, bookmarks: string[] = []): Promise<Customer> {
    return new Promise((resolve, reject) => {
      this.client.readCustomer(
        {
          identifier: {
            oneofKind: 'id',
            id,
          },
          bookmarks,
        },
        (err, response) => {
          if (err) reject(err);
          else if (!response) reject(new SdkError(SdkErrorCode.SDK_CODE_1, 'No customer response'));
          else resolve(Customer.deserialize(response));
        },
      );
    });
  }

  readCustomerByName(name: string, bookmarks: string[] = []): Promise<Customer> {
    return new Promise((resolve, reject) => {
      this.client.readCustomer(
        {
          identifier: {
            oneofKind: 'name',
            name,
          },
          bookmarks,
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
    bookmarks: string[] = [],
  ): Promise<ApplicationSpace> {
    return new Promise((resolve, reject) => {
      const req: CreateApplicationSpaceRequest = {
        customerId,
        name,
        bookmarks,
      };

      if (displayName !== undefined) req.displayName = StringValue.create({ value: displayName });
      if (description !== undefined) req.description = StringValue.create({ value: description });

      this.client.createApplicationSpace(req, (err, response) => {
        if (err) reject(err);
        else if (!response)
          reject(new SdkError(SdkErrorCode.SDK_CODE_1, 'No application space response'));
        else {
          this.saveReturnedBookmark(response.bookmark);
          resolve(
            ApplicationSpace.deserialize(response, customerId, name, displayName, description),
          );
        }
      });
    });
  }

  readApplicationSpaceById(id: string, bookmarks: string[] = []): Promise<ApplicationSpace> {
    return new Promise((resolve, reject) => {
      this.client.readApplicationSpace(
        {
          identifier: {
            oneofKind: 'id',
            id,
          },
          bookmarks,
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

  readApplicationSpaceByName(
    location: string,
    name: string,
    bookmarks: string[] = [],
  ): Promise<ApplicationSpace> {
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
          bookmarks,
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
    bookmarks: string[] = [],
  ): Promise<ApplicationSpace[]> {
    return new Promise((resolve, reject) => {
      const list: ApplicationSpace[] = [];
      const stream = this.client
        .listApplicationSpaces({
          customerId,
          match: appSpaceNames,
          bookmarks,
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

  updateApplicationSpace(
    appSpace: ApplicationSpace,
    bookmarks: string[] = [],
  ): Promise<ApplicationSpace> {
    return new Promise((resolve, reject) => {
      const req: UpdateApplicationSpaceRequest = {
        id: appSpace.id,
        bookmarks,
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
              this.saveReturnedBookmark(response.bookmark);
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

  deleteApplicationSpace(appSpace: ApplicationSpace, bookmarks: string[] = []): Promise<boolean> {
    const req = {
      id: appSpace.id,
      bookmarks,
    } as DeleteApplicationSpaceRequest;

    if (appSpace.etag !== undefined) req.etag = StringValue.create({ value: appSpace.etag });

    return new Promise<boolean>((resolve, reject) => {
      this.client.deleteApplicationSpace(req, (err, response) => {
        if (err) reject(err);
        else if (!response)
          reject(new SdkError(SdkErrorCode.SDK_CODE_1, 'No application space response'));
        else {
          this.saveReturnedBookmark(response.bookmark);
          resolve(true);
        }
      });
    });
  }

  createTenant(
    issuerId: string,
    name: string,
    displayName?: string,
    description?: string,
    bookmarks: string[] = [],
  ): Promise<Tenant> {
    return new Promise((resolve, reject) => {
      const req: CreateTenantRequest = {
        issuerId,
        name,
        bookmarks,
      };

      if (displayName !== undefined) req.displayName = StringValue.create({ value: displayName });
      if (description !== undefined) req.description = StringValue.create({ value: description });

      this.client.createTenant(req, (err, response) => {
        if (err) reject(err);
        else if (!response) reject(new SdkError(SdkErrorCode.SDK_CODE_1, 'No tenant response'));
        else {
          this.saveReturnedBookmark(response.bookmark);
          resolve(Tenant.deserialize(response, issuerId, name, displayName, description));
        }
      });
    });
  }

  readTenantById(id: string, bookmarks: string[] = []): Promise<Tenant> {
    return new Promise((resolve, reject) => {
      this.client.readTenant(
        {
          identifier: {
            oneofKind: 'id',
            id,
          },
          bookmarks,
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

  readTenantByName(location: string, name: string, bookmarks: string[] = []): Promise<Tenant> {
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
          bookmarks,
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

  updateTenant(tenant: Tenant, bookmarks: string[] = []): Promise<Tenant> {
    return new Promise((resolve, reject) => {
      const req: UpdateTenantRequest = {
        id: tenant.id,
        bookmarks,
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
              this.saveReturnedBookmark(response.bookmark);
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

  readTenantList(
    appSpaceId: string,
    tenantIds: string[],
    bookmarks: string[] = [],
  ): Promise<Tenant[]> {
    return new Promise((resolve, reject) => {
      const list: Tenant[] = [];
      this.client
        .listTenants({
          appSpaceId,
          match: tenantIds,
          bookmarks,
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

  deleteTenant(tenant: Tenant, bookmarks: string[] = []): Promise<boolean> {
    const req = {
      id: tenant.id,
      bookmarks,
    } as DeleteTenantRequest;

    if (tenant.etag !== undefined) req.etag = StringValue.create({ value: tenant.etag });

    return new Promise<boolean>((resolve, reject) => {
      this.client.deleteTenant(req, (err, response) => {
        if (err) reject(err);
        else if (!response) reject(new SdkError(SdkErrorCode.SDK_CODE_1, 'No tenant response'));
        else {
          this.saveReturnedBookmark(response.bookmark);
          resolve(true);
        }
      });
    });
  }

  createApplication(
    appSpaceId: string,
    name: string,
    displayName?: string,
    description?: string,
    bookmarks: string[] = [],
  ): Promise<Application> {
    return new Promise((resolve, reject) => {
      const req: CreateApplicationRequest = {
        appSpaceId,
        name,
        bookmarks,
      };

      if (displayName !== undefined) req.displayName = StringValue.create({ value: displayName });
      if (description !== undefined) req.description = StringValue.create({ value: description });

      this.client.createApplication(req, (err, response) => {
        if (err) reject(err);
        else if (!response)
          reject(new SdkError(SdkErrorCode.SDK_CODE_1, 'No application response'));
        else {
          this.saveReturnedBookmark(response.bookmark);
          resolve(Application.deserialize(response, appSpaceId, name, displayName, description));
        }
      });
    });
  }

  readApplicationById(applicationId: string, bookmarks: string[] = []): Promise<Application> {
    return new Promise((resolve, reject) => {
      this.client.readApplication(
        {
          identifier: {
            oneofKind: 'id',
            id: applicationId,
          },
          bookmarks,
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

  readApplicationByName(
    appSpaceId: string,
    name: string,
    bookmarks: string[] = [],
  ): Promise<Application> {
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
          bookmarks,
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

  updateApplication(application: Application, bookmarks: string[] = []): Promise<Application> {
    return new Promise((resolve, reject) => {
      const req: UpdateApplicationRequest = {
        id: application.id,
        bookmarks,
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
              this.saveReturnedBookmark(response.bookmark);
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

  readApplicationList(
    appSpaceId: string,
    applicationIds: string[],
    bookmarks: string[] = [],
  ): Promise<Application[]> {
    return new Promise((resolve, reject) => {
      const list: Application[] = [];
      this.client
        .listApplications({
          appSpaceId,
          match: applicationIds,
          bookmarks,
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

  deleteApplication(application: Application, bookmarks: string[] = []): Promise<boolean> {
    const req = {
      id: application.id,
      bookmarks,
    } as DeleteApplicationRequest;

    if (application.etag !== undefined) req.etag = StringValue.create({ value: application.etag });

    return new Promise<boolean>((resolve, reject) => {
      this.client.deleteApplication(req, (err, response) => {
        if (err) reject(err);
        else if (!response)
          reject(new SdkError(SdkErrorCode.SDK_CODE_1, 'No application response'));
        else {
          this.saveReturnedBookmark(response.bookmark);
          resolve(true);
        }
      });
    });
  }

  createApplicationAgent(
    applicationId: string,
    name: string,
    displayName?: string,
    description?: string,
    bookmarks: string[] = [],
  ): Promise<ApplicationAgent> {
    return new Promise((resolve, reject) => {
      const req: CreateApplicationAgentRequest = {
        applicationId,
        name,
        bookmarks,
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

  readApplicationAgentById(
    applicationAgentId: string,
    bookmarks: string[] = [],
  ): Promise<ApplicationAgent> {
    return new Promise((resolve, reject) => {
      this.client.readApplicationAgent(
        {
          identifier: {
            oneofKind: 'id',
            id: applicationAgentId,
          },
          bookmarks,
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

  readApplicationAgentByName(
    appSpaceId: string,
    name: string,
    bookmarks: string[] = [],
  ): Promise<ApplicationAgent> {
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
          bookmarks,
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

  updateApplicationAgent(
    applicationAgent: ApplicationAgent,
    bookmarks: string[] = [],
  ): Promise<ApplicationAgent> {
    return new Promise((resolve, reject) => {
      const req: UpdateApplicationAgentRequest = {
        id: applicationAgent.id,
        bookmarks,
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
              this.saveReturnedBookmark(response.bookmark);
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
    bookmarks: string[] = [],
  ): Promise<ApplicationAgent[]> {
    return new Promise((resolve, reject) => {
      const list: ApplicationAgent[] = [];
      this.client
        .listApplicationAgents({
          appSpaceId,
          match: applicationAgentIds,
          bookmarks,
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

  deleteApplicationAgent(appAgentId: string, bookmarks: string[] = []): Promise<void> {
    return new Promise((resolve, reject) => {
      const req: DeleteApplicationAgentRequest = {
        id: appAgentId,
        bookmarks,
      };

      this.client.deleteApplicationAgent(req, (err, response) => {
        if (err) reject(err);
        else if (!response)
          reject(new SdkError(SdkErrorCode.SDK_CODE_1, 'No application agent response'));
        else {
          this.saveReturnedBookmark(response.bookmark);
          resolve();
        }
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
    bookmarks: string[] = [],
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
        bookmarks,
      };

      if (expireTime !== undefined) req.expireTime = Utils.dateToTimestamp(expireTime);

      this.client.registerApplicationAgentCredential(req, (err, response) => {
        if (err) reject(err);
        else if (!response)
          reject(new SdkError(SdkErrorCode.SDK_CODE_1, 'No application agent credential response'));
        else {
          this.saveReturnedBookmark(response.bookmark);
          resolve(ApplicationAgentCredential.deserialize(response, displayName, appAgentId));
        }
      });
    });
  }

  readApplicationAgentCredential(
    appCredentialId: string,
    bookmarks: string[] = [],
  ): Promise<ApplicationAgentCredential> {
    return new Promise((resolve, reject) => {
      const req: ReadApplicationAgentCredentialRequest = {
        id: appCredentialId,
        bookmarks,
      };

      this.client.readApplicationAgentCredential(req, (err, response) => {
        if (err) reject(err);
        else if (!response)
          reject(new SdkError(SdkErrorCode.SDK_CODE_1, 'No application agent credential response'));
        else resolve(ApplicationAgentCredential.deserialize(response));
      });
    });
  }

  deleteApplicationAgentCredential(
    appCredentialId: string,
    bookmarks: string[] = [],
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const req: DeleteApplicationAgentCredentialRequest = {
        id: appCredentialId,
        bookmarks,
      };

      this.client.deleteApplicationAgentCredential(req, (err, response) => {
        if (err) reject(err);
        else if (!response)
          reject(new SdkError(SdkErrorCode.SDK_CODE_1, 'No application agent credential response'));
        else {
          this.saveReturnedBookmark(response.bookmark);
          resolve();
        }
      });
    });
  }

  createOAuth2Provider(
    appSpaceId: string,
    name: string,
    config: OAuth2ProviderConfig,
    displayName?: string,
    description?: string,
    bookmarks: string[] = [],
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
        bookmarks,
      };

      if (displayName !== undefined) req.displayName = StringValue.create({ value: displayName });
      if (description !== undefined) req.description = StringValue.create({ value: description });

      this.client.createOAuth2Provider(req, (err, response) => {
        if (err) reject(err);
        else if (!response)
          reject(new SdkError(SdkErrorCode.SDK_CODE_1, 'No OAuth2 provider response'));
        else {
          this.saveReturnedBookmark(response.bookmark);
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
        }
      });
    });
  }

  readOAuth2Provider(id: string, bookmarks: string[] = []): Promise<OAuth2Provider> {
    return new Promise((resolve, reject) => {
      this.client.readOAuth2Provider({ id, bookmarks }, (err, response) => {
        if (err) reject(err);
        else if (!response) {
          reject(new SdkError(SdkErrorCode.SDK_CODE_1, 'No OAuth2 provider response'));
        } else {
          resolve(OAuth2Provider.deserialize(response));
        }
      });
    });
  }

  updateOAuth2Provider(
    oauth2Provider: OAuth2Provider,
    bookmarks: string[] = [],
  ): Promise<OAuth2Provider> {
    return new Promise((resolve, reject) => {
      const req: UpdateOAuth2ProviderRequest = {
        id: oauth2Provider.id,
        bookmarks,
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
              this.saveReturnedBookmark(response.bookmark);
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

  deleteOAuth2Provider(id: string, bookmarks: string[] = []): Promise<void> {
    return new Promise((resolve, reject) => {
      const req: DeleteOAuth2ProviderRequest = {
        id,
        bookmarks,
      };

      this.client.deleteOAuth2Provider(req, (err, response) => {
        if (err) reject(err);
        else if (!response)
          reject(new SdkError(SdkErrorCode.SDK_CODE_1, 'No OAuth2 provider response'));
        else {
          this.saveReturnedBookmark(response.bookmark);
          resolve();
        }
      });
    });
  }

  createOAuth2Application(
    oauth2ProviderId: string,
    name: string,
    config: OAuth2ApplicationConfig,
    displayName?: string,
    description?: string,
    bookmarks: string[] = [],
  ): Promise<OAuth2Application> {
    return new Promise((resolve, reject) => {
      const req: CreateOAuth2ApplicationRequest = {
        oauth2ProviderId,
        name,
        bookmarks,
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
        else {
          this.saveReturnedBookmark(response.bookmark);
          resolve(OAuth2Application.deserialize(response, name, config, displayName, description));
        }
      });
    });
  }

  readOAuth2Application(id: string, bookmarks: string[] = []): Promise<OAuth2Application> {
    return new Promise((resolve, reject) => {
      this.client.readOAuth2Application({ id, bookmarks }, (err, response) => {
        if (err) reject(err);
        else if (!response) {
          reject(new SdkError(SdkErrorCode.SDK_CODE_1, 'No OAuth2 client response'));
        } else {
          resolve(OAuth2Application.deserialize(response));
        }
      });
    });
  }

  updateOAuth2Application(
    oauth2Client: OAuth2Application,
    bookmarks: string[] = [],
  ): Promise<OAuth2Application> {
    return new Promise((resolve, reject) => {
      const req: UpdateOAuth2ApplicationRequest = {
        id: oauth2Client.id,
        bookmarks,
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
              this.saveReturnedBookmark(response.bookmark);
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

  deleteOAuth2Application(id: string, bookmarks: string[] = []): Promise<void> {
    return new Promise((resolve, reject) => {
      const req: DeleteOAuth2ApplicationRequest = {
        id: id,
        bookmarks,
      };

      this.client.deleteOAuth2Application(req, (err, response) => {
        if (err) reject(err);
        else if (!response)
          reject(new SdkError(SdkErrorCode.SDK_CODE_1, 'No OAuth2 application response'));
        else {
          this.saveReturnedBookmark(response.bookmark);
          resolve();
        }
      });
    });
  }

  createOAuth2Client(
    location: string,
    oauth2Client: OAuth2Client,
    bookmarks: string[] = [],
  ): Promise<OAuth2Client> {
    const req = CreateConfigNodeRequest.fromJson({
      location,
      name: oauth2Client.name,
      bookmarks,
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
            this.saveReturnedBookmark(response.bookmark);
            resolve(oauth2Client);
          } catch (err) {
            reject(err);
          }
        }
      });
    });
  }

  readOAuth2Client(id: string, bookmarks: string[] = []): Promise<OAuth2Client> {
    return new Promise((resolve, reject) => {
      this.client.readConfigNode({ id, bookmarks }, (err, response) => {
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

  updateOAuth2Client(config: OAuth2Client, bookmarks: string[] = []): Promise<OAuth2Client> {
    const req = {
      id: config.id,
      bookmarks,
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
              this.saveReturnedBookmark(response.bookmark);
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

  deleteOAuth2Client(config: OAuth2Client, bookmarks: string[] = []): Promise<void> {
    const req = {
      id: config.id,
      bookmarks,
    } as DeleteConfigNodeRequest;
    if (config.etag !== undefined) req.etag = StringValue.create({ value: config.etag });

    return new Promise((resolve, reject) => {
      this.client.deleteConfigNode(req, (err, response) => {
        if (err) reject(err);
        else if (!response)
          reject(new SdkError(SdkErrorCode.SDK_CODE_1, 'No OAuth2 client response'));
        else {
          this.saveReturnedBookmark(response.bookmark);
          resolve();
        }
      });
    });
  }

  createServiceAccount(
    location: string,
    name: string,
    role: string,
    displayName?: string,
    description?: string,
    bookmarks: string[] = [],
  ): Promise<ServiceAccount> {
    return new Promise((resolve, reject) => {
      const req: CreateServiceAccountRequest = {
        location,
        name,
        role,
        bookmarks,
      };

      if (displayName !== undefined) req.displayName = StringValue.create({ value: displayName });
      if (description !== undefined) req.description = StringValue.create({ value: description });

      this.client.createServiceAccount(req, (err, response) => {
        if (err) reject(err);
        else if (!response)
          reject(new SdkError(SdkErrorCode.SDK_CODE_1, 'No service account response'));
        else {
          this.saveReturnedBookmark(response.bookmark);
          resolve(ServiceAccount.deserialize(response, name, displayName, description));
        }
      });
    });
  }

  readServiceAccountById(id: string, bookmarks: string[] = []): Promise<ServiceAccount> {
    return new Promise((resolve, reject) => {
      this.client.readServiceAccount(
        {
          identifier: {
            oneofKind: 'id',
            id,
          },
          bookmarks,
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

  readServiceAccountByName(
    location: string,
    name: string,
    bookmarks: string[] = [],
  ): Promise<ServiceAccount> {
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
          bookmarks,
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

  updateServiceAccount(
    serviceAccount: ServiceAccount,
    bookmarks: string[] = [],
  ): Promise<ServiceAccount> {
    return new Promise((resolve, reject) => {
      const req: UpdateServiceAccountRequest = {
        id: serviceAccount.id,
        bookmarks,
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
            this.saveReturnedBookmark(response.bookmark);
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

  deleteServiceAccount(id: string, bookmarks: string[] = []): Promise<void> {
    return new Promise((resolve, reject) => {
      const req: DeleteServiceAccountRequest = {
        id,
        bookmarks,
      };

      this.client.deleteServiceAccount(req, (err, response) => {
        if (err) reject(err);
        else if (!response)
          reject(new SdkError(SdkErrorCode.SDK_CODE_1, 'No service account response'));
        else {
          this.saveReturnedBookmark(response.bookmark);
          resolve();
        }
      });
    });
  }

  /**
   * Create new credentials for given Service Account. Methods either accept Public key,
   * which is registered with credentials. Or will generate new Public-Private pair and
   * Private key is returned in Response. Be aware, that in this case, Private key is sent
   * back only once and cannot be retrieved ever again.
   * @param bookmarks Database bookmarks to handle Read-after-Write consistency. Insert
   * one or multiple bookmarks returned from the previous Write operation if needed.
   */
  registerServiceAccountCredential(
    serviceAccountId: string,
    displayName: string,
    publicKeyType?: 'jwk' | 'pem',
    publicKey?: Buffer,
    expireTime?: Date,
    bookmarks: string[] = [],
  ): Promise<ServiceAccountCredential> {
    return new Promise((resolve, reject) => {
      let publicKeyObject = {
        oneofKind: undefined,
      } as RegisterServiceAccountCredentialRequest['publicKey'];
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

      const req: RegisterServiceAccountCredentialRequest = {
        serviceAccountId,
        displayName,
        publicKey: publicKeyObject,
        bookmarks,
      };

      if (expireTime !== undefined) req.expireTime = Utils.dateToTimestamp(expireTime);

      this.client.registerServiceAccountCredential(req, (err, response) => {
        if (err) reject(err);
        else if (!response)
          reject(new SdkError(SdkErrorCode.SDK_CODE_1, 'No service account credential response'));
        else {
          this.saveReturnedBookmark(response.bookmark);
          resolve(ServiceAccountCredential.deserialize(response, displayName, serviceAccountId));
        }
      });
    });
  }

  /**
   * Read service account credential by ID and returns all attributes.
   * But not Private or Public key, so keep them saved.
   * @param serviceAccountId Id contains the Globally Unique Identifier of the object with server generated id.
   * @param bookmarks Database bookmarks to handle Read-after-Write consistency. Insert
   * one or multiple bookmarks returned from the previous Write operation if needed.
   */
  readServiceAccountCredential(
    serviceAccountId: string,
    bookmarks: string[] = [],
  ): Promise<ServiceAccountCredential> {
    return new Promise((resolve, reject) => {
      const req: ReadServiceAccountCredentialRequest = {
        id: serviceAccountId,
        bookmarks,
      };

      this.client.readServiceAccountCredential(req, (err, response) => {
        if (err) reject(err);
        else if (!response)
          reject(new SdkError(SdkErrorCode.SDK_CODE_1, 'No service account credential response'));
        else resolve(ServiceAccountCredential.deserialize(response));
      });
    });
  }

  /**
   * Delete service account credential by ID.
   * @param serviceAccountId Id is the Globally unique identifier of object to delete.
   * @param bookmarks Database bookmarks to handle Read-after-Write consistency. Insert
   * one or multiple bookmarks returned from the previous Write operation if needed.
   */
  deleteServiceAccountCredential(
    serviceAccountId: string,
    bookmarks: string[] = [],
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const req: DeleteServiceAccountCredentialRequest = {
        id: serviceAccountId,
        bookmarks,
      };

      this.client.deleteServiceAccountCredential(req, (err, response) => {
        if (err) reject(err);
        else if (!response)
          reject(new SdkError(SdkErrorCode.SDK_CODE_1, 'No service account credential response'));
        else {
          this.saveReturnedBookmark(response.bookmark);
          resolve();
        }
      });
    });
  }

  /**
   * Assign permissions to a digital twin.
   * @param target The target is gid identifier of Service Account or DigitalTwin
   * @param role Permission role id to be assigned
   * @param customerId CustomerId under which to assign permissions
   * @param objectId Object to which Permission will be linked to. Can be Customer, AppSpace or Tenant
   * @param bookmarks Database bookmarks to handle Read-after-Write consistency. Insert
   * one or multiple bookmarks returned from the previous Write operation if needed.
   * @returns The success status
   */
  assignPermission(
    target: string,
    role: string,
    customerId: string,
    objectId: string,
    bookmarks: string[] = [],
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const req: AssignPermissionsRequest = {
        targetIdentifier: target,
        role,
        customerId,
        objectId,
        bookmarks,
      };

      this.client.assignPermissions(req, (err, response) => {
        if (err) reject(err);
        else if (!response)
          reject(new SdkError(SdkErrorCode.SDK_CODE_1, 'No assign permissions response'));
        else {
          this.saveReturnedBookmark(response.bookmark);
          resolve(response.success);
        }
      });
    });
  }

  /**
   * Revoke permissions for a digital twin.
   * @param target The target is gid identifier of Service Account or DigitalTwin
   * @param role Permission role id to be assigned
   * @param customerId CustomerId under which to assign permissions.
   * @param objectId Object to which Permission will be linked to. Can be Customer, AppSpace or Tenant
   * @param bookmarks Database bookmarks to handle Read-after-Write consistency. Insert
   * one or multiple bookmarks returned from the previous Write operation if needed.
   * @returns The success status
   */
  revokePermission(
    target: string,
    role: string,
    customerId: string,
    objectId: string,
    bookmarks: string[] = [],
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const req: RevokePermissionsRequest = {
        targetIdentifier: target,
        role,
        customerId,
        objectId,
        bookmarks,
      };

      this.client.revokePermissions(req, (err, response) => {
        if (err) reject(err);
        else if (!response)
          reject(new SdkError(SdkErrorCode.SDK_CODE_1, 'No revoke permissions response'));
        else {
          this.saveReturnedBookmark(response.bookmark);
          resolve(response.success);
        }
      });
    });
  }

  /**
   * List permissions of Digital twins and Invitations related to a customer.
   * @param location Location under which to retrieve permissions. Can be Customer.
   * @param bookmarks Database bookmarks to handle Read-after-Write consistency. Insert
   * one or multiple bookmarks returned from the previous Write operation if needed.
   */
  listPermissions(location: string, bookmarks: string[] = []): Promise<PermissionsList> {
    return new Promise((resolve, reject) => {
      const req: ListPermissionsRequest = {
        location,
        bookmarks,
      };

      this.client.listPermissions(req, (err, response) => {
        if (err) reject(err);
        else if (!response)
          reject(new SdkError(SdkErrorCode.SDK_CODE_1, 'No list permissions response'));
        else resolve(PermissionsList.deserialize(response));
      });
    });
  }

  private saveReturnedBookmark(bookmark: string): void {
    this.lastBookmark = bookmark;
    if (this.bookmarkList !== null) {
      this.bookmarkList.push(bookmark);
    }
  }
}
