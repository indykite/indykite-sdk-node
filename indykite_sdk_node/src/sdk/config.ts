import {
  CreateApplicationAgentRequest,
  CreateApplicationAgentResponse,
  CreateApplicationRequest,
  CreateApplicationResponse,
  CreateApplicationSpaceRequest,
  CreateApplicationSpaceResponse,
  CreateConfigNodeRequest,
  CreateConfigNodeResponse,
  CreateServiceAccountRequest,
  CreateServiceAccountResponse,
  DeleteApplicationAgentCredentialRequest,
  DeleteApplicationAgentCredentialResponse,
  DeleteApplicationAgentRequest,
  DeleteApplicationAgentResponse,
  DeleteApplicationRequest,
  DeleteApplicationResponse,
  DeleteApplicationSpaceRequest,
  DeleteApplicationSpaceResponse,
  DeleteConfigNodeRequest,
  DeleteConfigNodeResponse,
  DeleteServiceAccountCredentialRequest,
  DeleteServiceAccountRequest,
  DeleteServiceAccountResponse,
  ListApplicationAgentsRequest,
  ListApplicationSpacesRequest,
  ListApplicationsRequest,
  ListConfigNodeVersionsRequest,
  ListConfigNodeVersionsResponse,
  ReadApplicationAgentCredentialRequest,
  ReadApplicationAgentCredentialResponse,
  ReadApplicationAgentRequest,
  ReadApplicationAgentResponse,
  ReadApplicationRequest,
  ReadApplicationResponse,
  ReadApplicationSpaceRequest,
  ReadApplicationSpaceResponse,
  ReadConfigNodeRequest,
  ReadConfigNodeResponse,
  ReadCustomerRequest,
  ReadCustomerResponse,
  ReadServiceAccountCredentialRequest,
  ReadServiceAccountRequest,
  ReadServiceAccountResponse,
  RegisterApplicationAgentCredentialRequest,
  RegisterApplicationAgentCredentialResponse,
  RegisterServiceAccountCredentialRequest,
  UpdateApplicationAgentRequest,
  UpdateApplicationAgentResponse,
  UpdateApplicationRequest,
  UpdateApplicationResponse,
  UpdateApplicationSpaceRequest,
  UpdateApplicationSpaceResponse,
  UpdateConfigNodeRequest,
  UpdateConfigNodeResponse,
  UpdateServiceAccountRequest,
  UpdateServiceAccountResponse,
} from '../grpc/indykite/config/v1beta1/config_management_api';
import { SdkClient } from './client/client';
import { SdkErrorCode, SdkError, SkdErrorText } from './error';
import { ConfigManagementAPIClient } from '../grpc/indykite/config/v1beta1/config_management_api.grpc-client';
import { StringValue } from '../grpc/google/protobuf/wrappers';
import { Utils } from './utils/utils';
import {
  AUTHORIZATION_POLICY_CONFIG,
  Application,
  ApplicationAgent,
  ApplicationAgentCredential,
  ApplicationSpace,
  AuthorizationPolicy,
  ConfigNode,
  ConfigNodeFactory,
  ConfigNodeType,
  CONSENT_CONFIG,
  ConsentNode,
  TOKEN_INTROSPECT_CONFIG,
  TokenIntrospect,
  Customer,
  ServiceAccount,
  ServiceAccountCredential,
  ServiceAccountRole,
} from './model';
import { Readable } from 'stream';

export class ConfigClient {
  private client: ConfigManagementAPIClient;

  constructor(sdk: SdkClient) {
    this.client = sdk.client as ConfigManagementAPIClient;
  }

  static createInstance(appCredential?: string | unknown): Promise<ConfigClient> {
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

  close() {
    throw new Error('Not implemented');
  }

  static newCreateApplicationRequest(
    appSpaceId: string,
    name: string,
    displayName?: string,
    description?: string,
    bookmarks: string[] = [],
  ): CreateApplicationRequest {
    return {
      appSpaceId,
      name,
      bookmarks,
      displayName: displayName ? StringValue.create({ value: displayName }) : undefined,
      description: description ? StringValue.create({ value: description }) : undefined,
    } as CreateApplicationRequest;
  }

  /**
   * https://pkg.go.dev/github.com/indykite/jarvis-sdk-go@v0.11.0/config#Client.CreateApplication
   * @since 0.4.1
   * @example
   * const application = await sdk.createApplication(
   *    ConfigClient.newCreateApplicationRequest(
   *     APPLICATION_SPACE_ID,
   *     'application-name',
   *    )
   *  );
   * const application = await sdk.createApplication(applicationRequest);
   */
  createApplication(appRequest: CreateApplicationRequest): Promise<CreateApplicationResponse> {
    return new Promise((resolve, reject) => {
      this.client.createApplication(appRequest, (err, response) => {
        if (err) {
          reject(err);
        } else {
          if (!response)
            reject(
              new SdkError(SdkErrorCode.SDK_CODE_3, SkdErrorText.SDK_CODE_3(Application.name)),
            );
          else {
            resolve(response);
          }
        }
      });
    });
  }

  static newCreateApplicationAgentRequest(
    applicationId: string,
    name: string,
    displayName?: string,
    description?: string,
    bookmarks: string[] = [],
  ): CreateApplicationAgentRequest {
    return {
      applicationId,
      name,
      bookmarks,
      displayName: displayName ? StringValue.create({ value: displayName }) : undefined,
      description: description ? StringValue.create({ value: description }) : undefined,
    } as CreateApplicationAgentRequest;
  }

  /**
   * https://pkg.go.dev/github.com/indykite/jarvis-sdk-go@v0.11.0/config#Client.CreateApplicationAgent
   * @since 0.4.1
   * @example
   * const agent = await sdk.createApplicationAgent(
   *    ConfigClient.newCreateApplicationAgentRequest(
   *     APPLICATION_ID,
   *     'application-agent-name',
   *    )
   *  );
   * const agent = await sdk.createApplicationAgent(applicationAgentRequest);
   */
  createApplicationAgent(
    appAgentRequest: CreateApplicationAgentRequest,
  ): Promise<CreateApplicationAgentResponse> {
    return new Promise((resolve, reject) => {
      this.client.createApplicationAgent(appAgentRequest, (err, response) => {
        if (err) {
          reject(err);
        } else {
          if (!response) {
            reject(
              new SdkError(SdkErrorCode.SDK_CODE_3, SkdErrorText.SDK_CODE_3(ApplicationAgent.name)),
            );
          } else {
            resolve(response);
          }
        }
      });
    });
  }

  static newCreateApplicationSpaceRequest(
    customerId: string,
    name: string,
    displayName?: string,
    description?: string,
    bookmarks: string[] = [],
    region: string = 'europe-west1',
  ): CreateApplicationSpaceRequest {
    return {
      customerId,
      name,
      bookmarks,
      region,
      displayName: displayName ? StringValue.create({ value: displayName }) : undefined,
      description: description ? StringValue.create({ value: description }) : undefined,
    } as CreateApplicationSpaceRequest;
  }

  /**
   * https://pkg.go.dev/github.com/indykite/jarvis-sdk-go@v0.11.0/config#Client.CreateApplicationSpace
   * @since 0.4.1
   * @example
   * const appSpace = await sdk.createApplicationSpace(
   *    ConfigClient.newCreateApplicationSpaceRequest(
   *      CUSTOMER_ID,
   *      'app-space-name',
   *      "My Application Space",
   *      "Description",
   *      [],
   *      "europe-west1" | "us-east1"
   *    )
   *  );
   * const appSpace = await sdk.createApplicationSpace(appSpaceRequest);
   */
  createApplicationSpace(
    appSpaceRequest: CreateApplicationSpaceRequest,
  ): Promise<CreateApplicationSpaceResponse> {
    return new Promise((resolve, reject) => {
      this.client.createApplicationSpace(appSpaceRequest, (err, response) => {
        if (err) {
          reject(err);
        } else {
          if (!response) {
            reject(
              new SdkError(SdkErrorCode.SDK_CODE_3, SkdErrorText.SDK_CODE_3(ApplicationSpace.name)),
            );
          } else {
            resolve(response);
          }
        }
      });
    });
  }

  /**
   * Create application, application agent and application agent credentials in one step.
   * @since 0.4.1
   * @example
   *   const { applicationAgentCredentials: creds } = await sdk.createApplicationWithAgentCredentials(
   *     'application-space-id',
   *     'application-name',
   *     'application-agent-name',
   *     'Application agent credentials',
   *     undefined,
   *     undefined,
   *   );
   *   if (!creds.agentConfig) {
   *     throw new Error("Application agent credentials were not created");
   *   }
   */
  async createApplicationWithAgentCredentials(
    appSpaceId: string,
    applicationName: string,
    applicationAgentName: string,
    applicationAgentCredentialsName: string,
    publicKeyType: 'jwk' | 'pem' | undefined,
    publicKey: Buffer | undefined,
    expireTime?: Date,
  ): Promise<object> {
    let application: CreateApplicationResponse | undefined;
    let applicationAgent: CreateApplicationAgentResponse | undefined;
    let applicationAgentCredentials: RegisterApplicationAgentCredentialResponse | undefined;
    try {
      application = await this.createApplication(
        ConfigClient.newCreateApplicationRequest(appSpaceId, applicationName),
      );
    } catch (err) {
      return {
        error: err,
      };
    }
    try {
      applicationAgent = await this.createApplicationAgent(
        ConfigClient.newCreateApplicationAgentRequest(application.id, applicationAgentName),
      );
    } catch (err) {
      return {
        application,
        error: err,
      };
    }
    try {
      applicationAgentCredentials = await this.registerApplicationAgentCredential(
        ConfigClient.newRegisterApplicationAgentCredentialRequest(
          applicationAgent.id,
          applicationAgentCredentialsName,
          publicKeyType,
          publicKey,
          expireTime,
        ),
      );
    } catch (err) {
      return {
        application,
        applicationAgent,
        error: err,
      };
    }
    return {
      application,
      applicationAgent,
      applicationAgentCredentials,
    };
  }

  /**
   * https://pkg.go.dev/github.com/indykite/jarvis-sdk-go@v0.11.0/config#Client.CreateConfigNode
   * @since 0.4.1
   */
  createConfigNode(configNodeRequest: CreateConfigNodeRequest): Promise<CreateConfigNodeResponse> {
    return new Promise((resolve, reject) => {
      this.client.createConfigNode(configNodeRequest, (err, response) => {
        if (err) {
          reject(err);
        } else {
          if (response) {
            resolve(response);
          } else {
            reject(new SdkError(SdkErrorCode.SDK_CODE_3, SkdErrorText.SDK_CODE_3(ConfigNode.name)));
          }
        }
      });
    });
  }

  /**
   * @since 0.3.2
   * @deprecated since 0.4.1 Use createConfigNode
   * @example
   * async function example(sdk: ConfigClient) {
   *   await sdk.createAuthorizationPolicyConfiguration(
   *     APPLICATION_SPACE_ID,
   *     new AuthorizationPolicy({
   *       name: 'my-authorization-policy',
   *       policy: `
   *         {
   *           "meta": {
   *             "policyVersion": "1.0-indykite"
   *           },
   *           "subject": {
   *             "type": "DigitalTwin"
   *           },
   *           "actions": [
   *             "HAS_FREE_PARKING"
   *           ],
   *           "resource": {
   *             "type": "ParkingLot"
   *           },
   *           "condition": {
   *             "cypher": "MATCH (subject:DigitalTwin)-[:OWNS]->(:Vehicle)-[:HAS_FREE_PARKING]->(resource:ParkingLot)"
   *           }
   *         }
   *       `,
   *       status: AuthorizationPolicyConfig_Status.ACTIVE,
   *     }),
   *   );
   * }
   */
  createAuthorizationPolicyConfiguration(
    location: string,
    config: AuthorizationPolicy,
    bookmarks: string[] = [],
  ): Promise<AuthorizationPolicy> {
    const req = CreateConfigNodeRequest.fromJson({
      location,
      name: config.name,
      bookmarks,
    });
    req.config = {
      oneofKind: 'authorizationPolicyConfig',
      authorizationPolicyConfig: config.marshal(),
    };

    if (config.displayName !== undefined) {
      req.displayName = StringValue.fromJson(config.displayName);
    }
    if (config.description !== undefined) {
      req.description = StringValue.create(config.description);
    }

    return new Promise((resolve, reject) => {
      this.client.createConfigNode(req, (err, response) => {
        if (err) reject(err);
        else {
          if (!response) {
            reject(new SdkError(SdkErrorCode.SDK_CODE_1, 'No authorization policy response'));
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

  static newCreateServiceAccountRequest(
    location: string,
    name: string,
    role: ServiceAccountRole | ServiceAccountRole.ALL_EDITOR | ServiceAccountRole.ALL_VIEWER,
    displayName?: string,
    description?: string,
    bookmarks: string[] = [],
  ): CreateServiceAccountRequest {
    return {
      location,
      name,
      role,
      bookmarks,
      displayName: displayName ? StringValue.create({ value: displayName }) : undefined,
      description: description ? StringValue.create({ value: description }) : undefined,
    } as CreateServiceAccountRequest;
  }

  /**
   * https://pkg.go.dev/github.com/indykite/jarvis-sdk-go@v0.11.0/config#Client.CreateServiceAccount
   * @since 0.4.1
   * @example
   * const serviceAccount = await sdk.createServiceAccount(
   *   ConfigClient.newCreateServiceAccountRequest(
   *     CUSTOMER_ID,
   *     'service-account-name',
   *     ServiceAccountRole.ALL_EDITOR,
   *   )
   * );
   */
  createServiceAccount(
    serviceAccountRequest: CreateServiceAccountRequest,
  ): Promise<CreateServiceAccountResponse> {
    return new Promise((resolve, reject) => {
      this.client.createServiceAccount(serviceAccountRequest, (err, response) => {
        if (err) {
          reject(err);
        } else {
          if (!response) {
            reject(
              new SdkError(SdkErrorCode.SDK_CODE_3, SkdErrorText.SDK_CODE_3(ServiceAccount.name)),
            );
          } else {
            resolve(response);
          }
        }
      });
    });
  }

  static newDeleteApplicationRequest(
    application: Application,
    bookmarks: string[] = [],
  ): DeleteApplicationRequest {
    return {
      id: application.id,
      bookmarks,
      etag: application.etag ? StringValue.create({ value: application.etag }) : undefined,
    } as DeleteApplicationRequest;
  }

  /**
   * https://pkg.go.dev/github.com/indykite/jarvis-sdk-go@v0.11.0/config#Client.DeleteApplication
   * @since 0.4.1
   * @example
   * const application = await sdk.readApplicationByName(
   *   APPLICATION_SPACE_ID,
   *   'application-name'
   * );
   * await sdk.deleteApplication(ConfigClient.newDeleteApplicationRequest(application));
   */
  deleteApplication(appRequest: DeleteApplicationRequest): Promise<DeleteApplicationResponse> {
    return new Promise((resolve, reject) => {
      this.client.deleteApplication(appRequest, (err, response) => {
        if (err) {
          reject(err);
        } else {
          if (!response) {
            reject(
              new SdkError(SdkErrorCode.SDK_CODE_3, SkdErrorText.SDK_CODE_3(Application.name)),
            );
          } else {
            resolve(response);
          }
        }
      });
    });
  }

  static newDeleteApplicationAgentRequest(
    appAgentId: string,
    bookmarks: string[] = [],
    etag?: string,
  ): DeleteApplicationAgentRequest {
    return {
      id: appAgentId,
      bookmarks,
      etag: etag ? StringValue.create({ value: etag }) : undefined,
    } as DeleteApplicationAgentRequest;
  }

  /**
   * https://pkg.go.dev/github.com/indykite/jarvis-sdk-go@v0.11.0/config#Client.DeleteApplicationAgent
   * @since 0.4.1
   * @example
   * const agent = await sdk.readApplicationAgentByName(
   *   APPLICATION_SPACE_ID,
   *   'application-agent-name',
   * );
   * const request = ConfigClient.newDeleteApplicationAgentRequest(agent.id)
   * await sdk.deleteApplicationAgent(request);
   */
  deleteApplicationAgent(
    appAgentRequest: DeleteApplicationAgentRequest,
  ): Promise<DeleteApplicationAgentResponse> {
    return new Promise((resolve, reject) => {
      this.client.deleteApplicationAgent(appAgentRequest, (err, response) => {
        if (err) {
          reject(err);
        } else {
          if (!response) {
            reject(
              new SdkError(SdkErrorCode.SDK_CODE_3, SkdErrorText.SDK_CODE_3(ApplicationAgent.name)),
            );
          } else {
            resolve(response);
          }
        }
      });
    });
  }

  static newDeleteApplicationAgentCredentialRequest(
    appCredentialId: string,
    bookmarks: string[] = [],
    etag?: string,
  ): DeleteApplicationAgentCredentialRequest {
    return {
      id: appCredentialId,
      bookmarks,
      etag: etag ? StringValue.create({ value: etag }) : undefined,
    } as DeleteApplicationAgentCredentialRequest;
  }

  /**
   * https://pkg.go.dev/github.com/indykite/jarvis-sdk-go@v0.11.0/config#Client.DeleteApplicationAgentCredential
   * @since 0.4.1
   * @example
   * const request = ConfigClient.newDeleteApplicationAgentCredentialRequest(APPLICATION_AGENT_CREDENTIAL_ID);
   * await sdk.deleteApplicationAgentCredential(request);
   */
  deleteApplicationAgentCredential(
    appAgentCredentialRequest: DeleteApplicationAgentCredentialRequest,
  ): Promise<DeleteApplicationAgentCredentialResponse> {
    return new Promise((resolve, reject) => {
      this.client.deleteApplicationAgentCredential(appAgentCredentialRequest, (err, response) => {
        if (err) {
          reject(err);
        } else {
          if (!response) {
            reject(
              new SdkError(
                SdkErrorCode.SDK_CODE_3,
                SkdErrorText.SDK_CODE_3(ApplicationAgentCredential.name),
              ),
            );
          } else {
            resolve(response);
          }
        }
      });
    });
  }

  /**
   * @since 0.1.17
   * Delete service account credential by ID.
   * @param serviceAccountCredsId Id is the Globally unique identifier of object to delete.
   * @param bookmarks Database bookmarks to handle Read-after-Write consistency. Insert
   * one or multiple bookmarks returned from the previous Write operation if needed.
   * @example
   * await sdk.readServiceAccountCredential(SERVICE_ACCOUNT_CREDENTIALS_ID);
   */
  deleteServiceAccountCredential(
    serviceAccountCredsId: string,
    bookmarks: string[] = [],
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const req: DeleteServiceAccountCredentialRequest = {
        id: serviceAccountCredsId,
        bookmarks,
      };

      this.client.deleteServiceAccountCredential(req, (err, response) => {
        if (err) reject(err);
        else if (!response)
          reject(new SdkError(SdkErrorCode.SDK_CODE_1, 'No service account credential response'));
        else {
          resolve();
        }
      });
    });
  }

  static newDeleteApplicationSpaceRequest(
    appSpace: ApplicationSpace,
    bookmarks: string[] = [],
  ): DeleteApplicationSpaceRequest {
    return {
      id: appSpace.id,
      bookmarks,
      etag: appSpace.etag ? StringValue.create({ value: appSpace.etag }) : undefined,
    } as DeleteApplicationSpaceRequest;
  }

  /**
   * https://pkg.go.dev/github.com/indykite/jarvis-sdk-go@v0.11.0/config#Client.DeleteApplicationSpace
   * @since 0.4.1
   * @example
   * const appSpace = await sdk.readApplicationSpaceByName(
   *   CUSTOMER_ID,
   *   'app-space-name',
   * );
   * await sdk.deleteApplicationSpace(ConfigClient.newDeleteApplicationSpaceRequest(appSpace));
   */
  deleteApplicationSpace(
    appSpaceRequest: DeleteApplicationSpaceRequest,
  ): Promise<DeleteApplicationSpaceResponse> {
    return new Promise((resolve, reject) => {
      this.client.deleteApplicationSpace(appSpaceRequest, (err, response) => {
        if (err) {
          reject(err);
        } else {
          if (!response) {
            reject(
              new SdkError(SdkErrorCode.SDK_CODE_3, SkdErrorText.SDK_CODE_3(ApplicationSpace.name)),
            );
          } else {
            resolve(response);
          }
        }
      });
    });
  }

  static newDeleteConfigNodeRequest(
    config: ConfigNode,
    bookmarks: string[] = [],
  ): DeleteConfigNodeRequest {
    return {
      id: config.id,
      bookmarks,
      etag: config.etag ? StringValue.create({ value: config.etag }) : undefined,
    } as DeleteConfigNodeRequest;
  }

  /**
   * https://pkg.go.dev/github.com/indykite/jarvis-sdk-go@v0.11.0/config#Client.DeleteConfigNode
   * @since 0.4.1
   * @example
   * const configNodeRequest = newDeleteConfigNodeRequest(config);
   * await sdk.deleteConfigNode(configNodeRequest);
   */
  deleteConfigNode(configNodeRequest: DeleteConfigNodeRequest): Promise<DeleteConfigNodeResponse> {
    return new Promise((resolve, reject) => {
      this.client.deleteConfigNode(configNodeRequest, (err, response) => {
        if (err) {
          reject(err);
        } else {
          if (!response) {
            reject(new SdkError(SdkErrorCode.SDK_CODE_3, SkdErrorText.SDK_CODE_3(ConfigNode.name)));
          } else {
            resolve(response);
          }
        }
      });
    });
  }

  /**
   * @since 0.3.2
   * @deprecated since 0.4.1 Use deleteConfigNode
   * @example
   * async function example(sdk: ConfigClient, authorizationPolicyId: string) {
   *   const ap = await sdk.readAuthorizationPolicyConfiguration(authorizationPolicyId);
   *   await sdk.deleteAuthorizationPolicyConfiguration(ap);
   * }
   */
  deleteAuthorizationPolicyConfiguration(
    config: AuthorizationPolicy,
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

  static newDeleteServiceAccountRequest(
    id: string,
    bookmarks?: string[],
  ): DeleteServiceAccountRequest;
  static newDeleteServiceAccountRequest(
    serviceAccount: ServiceAccount,
    bookmarks?: string[],
  ): DeleteServiceAccountRequest;
  static newDeleteServiceAccountRequest(
    idOrServiceAccount: string | ServiceAccount,
    bookmarks: string[] = [],
  ): DeleteServiceAccountRequest {
    return {
      id: typeof idOrServiceAccount === 'string' ? idOrServiceAccount : idOrServiceAccount.id,
      bookmarks,
      etag:
        typeof idOrServiceAccount === 'string'
          ? undefined
          : idOrServiceAccount?.etag
            ? StringValue.create({ value: idOrServiceAccount?.etag })
            : undefined,
    } as DeleteServiceAccountRequest;
  }

  /**
   * https://pkg.go.dev/github.com/indykite/jarvis-sdk-go@v0.11.0/config#Client.DeleteServiceAccount
   * @since 0.4.1
   * @example
   * const serviceAccount = await sdk.readServiceAccountByName(
   *   CUSTOMER_ID,
   *   'service-account-name',
   * );
   * const request = ConfigClient.newDeleteServiceAccountRequest(serviceAccount);
   * await sdk.deleteServiceAccount(request);
   */
  deleteServiceAccount(
    serviceAccountRequest: DeleteServiceAccountRequest,
  ): Promise<DeleteServiceAccountResponse> {
    return new Promise((resolve, reject) => {
      this.client.deleteServiceAccount(serviceAccountRequest, (err, response) => {
        if (err) {
          reject(err);
        } else {
          if (!response) {
            reject(
              new SdkError(SdkErrorCode.SDK_CODE_3, SkdErrorText.SDK_CODE_3(ServiceAccount.name)),
            );
          } else {
            resolve(response);
          }
        }
      });
    });
  }

  static newListApplicationAgentsRequest(
    appSpaceId: string,
    applicationAgentIds: string[],
    bookmarks: string[] = [],
  ): ListApplicationAgentsRequest {
    return {
      appSpaceId,
      match: applicationAgentIds,
      bookmarks,
    } as ListApplicationAgentsRequest;
  }

  /**
   * https://pkg.go.dev/github.com/indykite/jarvis-sdk-go@v0.11.0/config#Client.ListApplicationAgents
   * @since 0.4.1
   * @example
   * const request = ConfigClient.newListApplicationAgentsRequest(APPLICATION_SPACE_ID,['app-agent-name1', 'app-agent-name2']);
   * const agents = await sdk.listApplicationAgents(request);
   */
  listApplicationAgents(appAgentsRequest: ListApplicationAgentsRequest): Readable {
    const result = new Readable({
      read: () => {
        // Nothing needed to be done here
      },
      objectMode: true,
    });
    const stream = this.client
      .listApplicationAgents(appAgentsRequest)
      .on('readable', () => {
        const value = stream.read();
        if (value && value.applicationAgent) {
          result.push(value);
        }
      })
      .on('close', () => {
        result.push(null);
      })
      .on('error', (err) => {
        result.destroy(err);
      });
    return result;
  }

  static newListApplicationSpacesRequest(
    customerId: string,
    appSpaceNames: string[],
    bookmarks: string[] = [],
  ): ListApplicationSpacesRequest {
    return {
      customerId,
      match: appSpaceNames,
      bookmarks,
    } as ListApplicationSpacesRequest;
  }

  /**
   * https://pkg.go.dev/github.com/indykite/jarvis-sdk-go@v0.11.0/config#Client.ListApplicationSpaces
   * @since 0.4.1
   * @example
   * const request = ConfigClient.newListApplicationSpacesRequest(CUSTOMER_ID,['appspace-name1', 'appspace-name2']);
   * const appSpaces = await sdk.listApplicationSpaces(request);
   */
  listApplicationSpaces(appSpacesRequest: ListApplicationSpacesRequest): Readable {
    const result = new Readable({
      read: () => {
        // Nothing needed to be done here
      },
      objectMode: true,
    });
    const stream = this.client
      .listApplicationSpaces(appSpacesRequest)
      .on('readable', () => {
        const value = stream.read();
        if (value && value.appSpace) {
          result.push(value);
        }
      })
      .on('close', () => {
        result.push(null);
      })
      .on('error', (err) => {
        result.destroy(err);
      });
    return result;
  }

  static newListApplicationsRequest(
    appSpaceId: string,
    applicationIds: string[],
    bookmarks: string[] = [],
  ): ListApplicationsRequest {
    return {
      appSpaceId,
      match: applicationIds,
      bookmarks,
    } as ListApplicationsRequest;
  }

  /**
   * https://pkg.go.dev/github.com/indykite/jarvis-sdk-go@v0.11.0/config#Client.ListApplications
   * @since 0.4.1
   * @example
   * const request = ConfigClient.newListApplicationsRequest(APPLICATION_SPACE_ID,['app-name1', 'app-name2']);
   * const applications = await sdk.listApplications(request);
   */
  listApplications(appRequest: ListApplicationsRequest): Readable {
    const result = new Readable({
      read: () => {
        // Nothing needed to be done here
      },
      objectMode: true,
    });
    const stream = this.client
      .listApplications(appRequest)
      .on('readable', () => {
        const value = stream.read();
        if (value && value.application) {
          result.push(value);
        }
      })
      .on('close', () => {
        result.push(null);
      })
      .on('error', (err) => {
        result.destroy(err);
      });
    return result;
  }

  static newReadApplicationRequest(
    kind = 'id',
    id: string,
    name = '',
    bookmarks: string[] = [],
  ): ReadApplicationRequest {
    switch (kind) {
      case 'id':
      default:
        return {
          identifier: {
            oneofKind: kind,
            id, //application id
          },
          bookmarks,
        } as ReadApplicationRequest;
      case 'name':
        return {
          identifier: {
            oneofKind: kind,
            name: {
              location: id, //app space id
              name,
            },
          },
          bookmarks,
        } as ReadApplicationRequest;
    }
  }

  /**
   * https://pkg.go.dev/github.com/indykite/jarvis-sdk-go@v0.11.0/config#Client.ReadApplication
   * @since 0.4.1
   * @example
   * const request = ConfigClient.newReadApplicationRequest('id', APPLICATION_ID);
   * const request = ConfigClient.newReadApplicationRequest('name', APPLICATION_SPACE_ID, 'application-name');
   * const application = await sdk.readApplication(request);
   */
  readApplication(appRequest: ReadApplicationRequest): Promise<ReadApplicationResponse> {
    return new Promise((resolve, reject) => {
      this.client.readApplication(appRequest, (err, response) => {
        if (err) {
          reject(err);
        } else {
          if (!response) {
            reject(
              new SdkError(SdkErrorCode.SDK_CODE_3, SkdErrorText.SDK_CODE_3(Application.name)),
            );
          } else {
            resolve(response);
          }
        }
      });
    });
  }

  static newReadApplicationAgentRequest(
    kind = 'id',
    id: string,
    name = '',
    bookmarks: string[] = [],
  ): ReadApplicationAgentRequest {
    switch (kind) {
      case 'id':
      default:
        return {
          identifier: {
            oneofKind: kind,
            id, //applicationAgentId
          },
          bookmarks,
        } as ReadApplicationAgentRequest;
      case 'name':
        return {
          identifier: {
            oneofKind: kind,
            name: {
              location: id, //app space id
              name,
            },
          },
          bookmarks,
        } as ReadApplicationAgentRequest;
    }
  }

  /**
   * https://pkg.go.dev/github.com/indykite/jarvis-sdk-go@v0.11.0/config#Client.ReadApplicationAgent
   * @since 0.4.1
   * @example
   * const request = ConfigClient.newReadApplicationAgentRequest('id', APPLICATION_AGENT_ID);
   * const request = ConfigClient.newReadApplicationRequest('name', APPLICATION_SPACE_ID, 'application-agent-name');
   * const agent = await sdk.readApplicationAgent(request);
   */
  readApplicationAgent(
    appAgentRequest: ReadApplicationAgentRequest,
  ): Promise<ReadApplicationAgentResponse> {
    return new Promise((resolve, reject) => {
      this.client.readApplicationAgent(appAgentRequest, (err, response) => {
        if (err) {
          reject(err);
        } else {
          if (!response) {
            reject(
              new SdkError(SdkErrorCode.SDK_CODE_3, SkdErrorText.SDK_CODE_3(ApplicationAgent.name)),
            );
          } else {
            resolve(response);
          }
        }
      });
    });
  }

  static newReadApplicationAgentCredentialRequest(
    appCredentialId: string,
    bookmarks: string[] = [],
  ): ReadApplicationAgentCredentialRequest {
    return {
      id: appCredentialId,
      bookmarks,
    } as ReadApplicationAgentCredentialRequest;
  }

  /**
   * https://pkg.go.dev/github.com/indykite/jarvis-sdk-go@v0.11.0/config#Client.ReadApplicationAgentCredential
   * @since 0.4.1
   * @example
   * const request = ConfigClient.newReadApplicationAgentCredentialRequest(APPLICATION_AGENT_CREDENTIAL_ID);
   * const credentials = await sdk.readApplicationAgentCredential(request);
   * // Credentials in `appCredentials.agentConfig` property are not accessible
   */
  readApplicationAgentCredential(
    appAgentCredentialRequest: ReadApplicationAgentCredentialRequest,
  ): Promise<ReadApplicationAgentCredentialResponse> {
    return new Promise((resolve, reject) => {
      this.client.readApplicationAgentCredential(appAgentCredentialRequest, (err, response) => {
        if (err) {
          reject(err);
        } else {
          if (!response) {
            reject(
              new SdkError(
                SdkErrorCode.SDK_CODE_3,
                SkdErrorText.SDK_CODE_3(ApplicationAgentCredential.name),
              ),
            );
          } else {
            resolve(response);
          }
        }
      });
    });
  }

  static newReadApplicationSpaceRequest(
    kind = 'id',
    id: string,
    name = '',
    bookmarks: string[] = [],
  ): ReadApplicationSpaceRequest {
    switch (kind) {
      case 'id':
      default:
        return {
          identifier: {
            oneofKind: kind,
            id, //APPLICATION_SPACE_ID
          },
          bookmarks,
        } as ReadApplicationSpaceRequest;
      case 'name':
        return {
          identifier: {
            oneofKind: kind,
            name: {
              location: id, //CUSTOMER_ID,
              name,
            },
          },
          bookmarks,
        } as ReadApplicationSpaceRequest;
    }
  }

  /**
   * https://pkg.go.dev/github.com/indykite/jarvis-sdk-go@v0.11.0/config#Client.ReadApplicationSpace
   * @since 0.4.1
   * @example
   * const request = ConfigClient.newReadApplicationAgentRequest('id', APPLICATION_SPACE_ID);
   * const request = ConfigClient.newReadApplicationRequest('name', CUSTOMER_ID, 'app-space-name');
   * const appSpace = await sdk.readApplicationSpace(request);
   */
  readApplicationSpace(
    appSpaceRequest: ReadApplicationSpaceRequest,
  ): Promise<ReadApplicationSpaceResponse> {
    return new Promise((resolve, reject) => {
      this.client.readApplicationSpace(appSpaceRequest, (err, response) => {
        if (err) {
          reject(err);
        } else {
          if (!response) {
            reject(
              new SdkError(SdkErrorCode.SDK_CODE_3, SkdErrorText.SDK_CODE_3(ApplicationSpace.name)),
            );
          } else {
            resolve(response);
          }
        }
      });
    });
  }

  static newReadConfigNodeRequest(
    id: string,
    bookmarks: string[] = [],
    version = '',
  ): ReadConfigNodeRequest {
    return {
      id,
      bookmarks,
      version,
    } as ReadConfigNodeRequest;
  }

  /**
   * https://pkg.go.dev/github.com/indykite/jarvis-sdk-go@v0.11.0/config#Client.ReadConfigNode
   * @since 0.4.1
   * @example
   * const request = ConfigClient.newReadConfigNodeRequest(EMAIL_SERVICE_CONFIG_ID);
   * const config = await sdk.readConfigNode(request);
   * config.displayName = 'My new name';
   * await sdk.updateConfigNode(config);
   */
  readConfigNode(configNodeRequest: ReadConfigNodeRequest): Promise<ReadConfigNodeResponse> {
    return new Promise((resolve, reject) => {
      this.client.readConfigNode(configNodeRequest, (err, response) => {
        if (err) {
          reject(err);
        } else {
          if (response && response.configNode) {
            resolve(response);
          } else {
            reject(new SdkError(SdkErrorCode.SDK_CODE_3, SkdErrorText.SDK_CODE_3(ConfigNode.name)));
          }
        }
      });
    });
  }

  /**
   * @since 0.3.2
   * @deprecated since 0.4.1 Use readConfigNode
   * @example
   * async function example(sdk: ConfigClient) {
   *   const createdAp = await sdk.createAuthorizationPolicyConfiguration(
   *     APPLICATION_SPACE_ID,
   *     new AuthorizationPolicy({
   *       name: 'my-authorization-policy',
   *       policy: `
   *         {
   *           "meta": {
   *             "policyVersion": "1.0-indykite"
   *           },
   *           "subject": {
   *             "type": "DigitalTwin"
   *           },
   *           "actions": [
   *             "HAS_FREE_PARKING"
   *           ],
   *           "resource": {
   *             "type": "ParkingLot"
   *           },
   *           "condition": {
   *             "cypher": "MATCH (subject:DigitalTwin)-[:OWNS]->(:Vehicle)-[:HAS_FREE_PARKING]->(resource:ParkingLot)"
   *           }
   *         }
   *       `,
   *       status: AuthorizationPolicyConfig_Status.ACTIVE,
   *     }),
   *   );
   *
   *   // Store the Authorization Policy config ID somewhere (createdAp.id) so that you can use the ID later.
   *
   *   const ap = await sdk.readAuthorizationPolicyConfiguration(createdAp.id);
   *   console.log(JSON.stringify(ap, null, 2));
   * }
   */
  readAuthorizationPolicyConfiguration(
    id: string,
    bookmarks: string[] = [],
    version = '',
  ): Promise<AuthorizationPolicy> {
    return new Promise((resolve, reject) => {
      this.client.readConfigNode({ id, bookmarks, version }, (err, response) => {
        if (err) reject(err);
        else if (response && response.configNode) {
          const ret = ConfigNodeFactory.createInstance(response.configNode) as AuthorizationPolicy;
          resolve(ret);
        } else {
          reject(
            new SdkError(
              SdkErrorCode.SDK_CODE_1,
              'config_error_read_authorizationpolicyconfiguration',
            ),
          );
        }
      });
    });
  }

  static newReadCustomerRequest(
    kind = 'id',
    idOrName: string,
    bookmarks: string[] = [],
  ): ReadCustomerRequest {
    switch (kind) {
      case 'id':
      default:
        return {
          identifier: {
            oneofKind: kind,
            id: idOrName,
          },
          bookmarks,
        } as ReadCustomerRequest;
      case 'name':
        return {
          identifier: {
            oneofKind: kind,
            name: idOrName,
          },
          bookmarks,
        } as ReadCustomerRequest;
    }
  }

  /**
   * https://pkg.go.dev/github.com/indykite/jarvis-sdk-go@v0.11.0/config#Client.ReadCustomer
   * @since 0.4.1
   * @example
   * const request = ConfigClient.newReadCustomerRequest('id',CUSTOMER_ID)
   * const request = ConfigClient.newReadCustomerRequest('name','customer-name')
   * const customer = await sdk.readCustomer(request);
   */
  readCustomer(customerRequest: ReadCustomerRequest): Promise<ReadCustomerResponse> {
    return new Promise((resolve, reject) => {
      this.client.readCustomer(customerRequest, (err, response) => {
        if (err) {
          reject(err);
        } else {
          if (!response) {
            reject(new SdkError(SdkErrorCode.SDK_CODE_3, SkdErrorText.SDK_CODE_3(Customer.name)));
          } else {
            resolve(response);
          }
        }
      });
    });
  }

  static newReadServiceAccountRequest(
    kind = 'id',
    id: string,
    name = '',
    bookmarks: string[] = [],
  ): ReadServiceAccountRequest {
    switch (kind) {
      case 'id':
      default:
        return {
          identifier: {
            oneofKind: kind,
            id, //SERVICE_ACCOUNT_ID
          },
          bookmarks,
        } as ReadServiceAccountRequest;
      case 'name':
        return {
          identifier: {
            oneofKind: kind,
            name: {
              location: id, //CUSTOMER_ID,
              name,
            },
          },
          bookmarks,
        } as ReadServiceAccountRequest;
    }
  }

  /**
   * https://pkg.go.dev/github.com/indykite/jarvis-sdk-go@v0.11.0/config#Client.ReadServiceAccount
   * @since 0.4.1
   * @example
   * const request = ConfigClient.newReadServiceAccountRequest('id',SERVICE_ACCOUNT_ID);
   * const request = ConfigClient.newReadServiceAccountRequest('name',CUSTOMER_ID,'service-account-name');
   * const serviceAccount = await sdk.readServiceAccount(request);
   */
  readServiceAccount(
    serviceAccountRequest: ReadServiceAccountRequest,
  ): Promise<ReadServiceAccountResponse> {
    return new Promise((resolve, reject) => {
      this.client.readServiceAccount(serviceAccountRequest, (err, response) => {
        if (err) {
          reject(err);
        } else {
          if (!response) {
            reject(
              new SdkError(SdkErrorCode.SDK_CODE_3, SkdErrorText.SDK_CODE_3(ServiceAccount.name)),
            );
          } else {
            resolve(response);
          }
        }
      });
    });
  }

  /**
   * @since 0.1.17
   * Read service account credential by ID and returns all attributes.
   * But not Private or Public key, so keep them saved.
   * @param serviceAccountId Id contains the Globally Unique Identifier of the object with server generated id.
   * @param bookmarks Database bookmarks to handle Read-after-Write consistency. Insert
   * one or multiple bookmarks returned from the previous Write operation if needed.
   * @example
   * const creds = await sdk.readServiceAccountCredential(SERVICE_ACCOUNT_CREDENTIALS_ID);
   * // Credentials in `creds.serviceAccountConfig` property are not accessible
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

  static newRegisterApplicationAgentCredentialRequest(
    applicationAgentId: string,
    displayName: string,
    publicKeyType?: 'jwk' | 'pem',
    publicKey?: Buffer,
    expireTime?: Date,
    bookmarks: string[] = [],
  ): RegisterApplicationAgentCredentialRequest {
    return {
      applicationAgentId,
      displayName,
      publicKey: {
        oneofKind: publicKeyType ? publicKeyType : undefined,
        [publicKeyType?.toString() ?? 'jwk']: publicKey ? publicKey : undefined,
      },
      bookmarks,
      expireTime: expireTime ? Utils.dateToTimestamp(expireTime) : undefined,
    } as RegisterApplicationAgentCredentialRequest;
  }

  /**
   * https://pkg.go.dev/github.com/indykite/jarvis-sdk-go@v0.11.0/config#Client.RegisterApplicationAgentCredential
   * @since 0.4.1
   * @example
   * const request = ConfigClient.newRegisterApplicationAgentCredentialRequest(
   *   APPLICATION_AGENT_ID,
   *   'Credential Name',
   * );
   * const appCredentials = await sdk.registerApplicationAgentCredential(request)
   * // Credentials are stored in `appCredentials.agentConfig` property
   * // and are returned after the creation only
   */
  registerApplicationAgentCredential(
    appAgentCredentialRequest: RegisterApplicationAgentCredentialRequest,
  ): Promise<RegisterApplicationAgentCredentialResponse> {
    return new Promise((resolve, reject) => {
      this.client.registerApplicationAgentCredential(appAgentCredentialRequest, (err, response) => {
        if (err) {
          reject(err);
        } else {
          if (!response) {
            reject(
              new SdkError(
                SdkErrorCode.SDK_CODE_3,
                SkdErrorText.SDK_CODE_3(ApplicationAgentCredential.name),
              ),
            );
          } else {
            resolve(response);
          }
        }
      });
    });
  }

  /**
   * @since 0.1.17
   * Create new credentials for given Service Account. Methods either accept Public key,
   * which is registered with credentials. Or will generate new Public-Private pair and
   * Private key is returned in Response. Be aware, that in this case, Private key is sent
   * back only once and cannot be retrieved ever again.
   * @param bookmarks Database bookmarks to handle Read-after-Write consistency. Insert
   * one or multiple bookmarks returned from the previous Write operation if needed.
   * @example
   * const account = await sdk.createServiceAccount(
   *   CUSTOMER_ID,
   *   'service-account-name',
   *   ServiceAccountRole.ALL_EDITOR,
   * );
   * const creds = await sdk.registerServiceAccountCredential(
   *   account.id,
   *   'Service Account Credentials'
   * );
   * // Credentials are stored in `creds.serviceAccountConfig` property
   * // and are returned after the creation only
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
          resolve(ServiceAccountCredential.deserialize(response, displayName, serviceAccountId));
        }
      });
    });
  }

  static newUpdateApplicationRequest(
    application: Application,
    bookmarks: string[] = [],
  ): UpdateApplicationRequest {
    return {
      id: application.id,
      bookmarks,
      etag: application.etag ? StringValue.create({ value: application.etag }) : undefined,
      displayName: application.displayName
        ? StringValue.create({ value: application.displayName })
        : undefined,
      description: application.description
        ? StringValue.create({ value: application.description })
        : undefined,
    } as UpdateApplicationRequest;
  }

  /**
   * https://pkg.go.dev/github.com/indykite/jarvis-sdk-go@v0.11.0/config#Client.UpdateApplication
   * @since 0.4.1
   * @example
   * const requestReadApp = ConfigClient.newReadApplicationRequest('name', APPLICATION_SPACE_ID, 'application-name');
   * let application = await sdk.readApplication(request);
   * application.displayName = 'New Name';
   * const requestUpdateApp = ConfigClient.newUpdateApplicationRequest(application);
   * await sdk.updateApplication(requestUpdateApp);
   */
  updateApplication(appRequest: UpdateApplicationRequest): Promise<UpdateApplicationResponse> {
    return new Promise((resolve, reject) => {
      this.client.updateApplication(appRequest, (err, response) => {
        if (err) {
          reject(err);
        } else {
          if (response && response.id === appRequest.id) {
            resolve(response);
          } else {
            reject(
              new SdkError(
                SdkErrorCode.SDK_CODE_4,
                SkdErrorText.SDK_CODE_4(appRequest.id, response?.id),
              ),
            );
          }
        }
      });
    });
  }

  static newUpdateApplicationAgentRequest(
    applicationAgent: ApplicationAgent,
    bookmarks: string[] = [],
  ): UpdateApplicationAgentRequest {
    return {
      id: applicationAgent.id,
      bookmarks,
      etag: applicationAgent.etag
        ? StringValue.create({ value: applicationAgent.etag })
        : undefined,
      displayName: applicationAgent.displayName
        ? StringValue.create({ value: applicationAgent.displayName })
        : undefined,
      description: applicationAgent.description
        ? StringValue.create({ value: applicationAgent.description })
        : undefined,
    } as UpdateApplicationAgentRequest;
  }

  /**
   * https://pkg.go.dev/github.com/indykite/jarvis-sdk-go@v0.11.0/config#Client.UpdateApplicationAgent
   * @since 0.4.1
   * @example
   * const requestReadApp = ConfigClient.newReadApplicationAgentRequest('name', APPLICATION_SPACE_ID, 'application-agent-name');
   * let agent = await sdk.readApplicationAgent(request);
   * agent.displayName = 'New Name';
   * const requestUpdateApp = ConfigClient.newUpdateApplicationAgentRequest(agent);
   * await sdk.updateApplicationAgent(requestUpdateApp);
   */
  updateApplicationAgent(
    appAgentRequest: UpdateApplicationAgentRequest,
  ): Promise<UpdateApplicationAgentResponse> {
    return new Promise((resolve, reject) => {
      this.client.updateApplicationAgent(appAgentRequest, (err, response) => {
        if (err) {
          reject(err);
        } else {
          if (response && response.id === appAgentRequest.id) {
            resolve(response);
          } else {
            reject(
              new SdkError(
                SdkErrorCode.SDK_CODE_4,
                SkdErrorText.SDK_CODE_4(appAgentRequest.id, response?.id),
              ),
            );
          }
        }
      });
    });
  }

  static newUpdateApplicationSpaceRequest(
    appSpace: ApplicationSpace,
    bookmarks: string[] = [],
  ): UpdateApplicationSpaceRequest {
    return {
      id: appSpace.id,
      bookmarks,
      etag: appSpace.etag ? StringValue.create({ value: appSpace.etag }) : undefined,
      displayName: appSpace.displayName
        ? StringValue.create({ value: appSpace.displayName })
        : undefined,
      description: appSpace.description
        ? StringValue.create({ value: appSpace.description })
        : undefined,
    } as UpdateApplicationSpaceRequest;
  }

  /**
   * https://pkg.go.dev/github.com/indykite/jarvis-sdk-go@v0.11.0/config#Client.UpdateApplicationSpace
   * @since 0.4.1
   * @example
   * const requestReadApp = ConfigClient.newReadApplicationSpaceRequest('name', CUSTOMER_ID, 'app-space-name');
   * let appSpace = await sdk.readApplicationSpace(request);
   * appSpace.displayName = 'New Name';
   * const requestUpdateSpace = ConfigClient.newUpdateApplicationSpaceRequest(appSpace);
   * await sdk.updateApplicationSpace(requestUpdateSpace);
   */
  updateApplicationSpace(
    appSpaceRequest: UpdateApplicationSpaceRequest,
  ): Promise<UpdateApplicationSpaceResponse> {
    return new Promise((resolve, reject) => {
      this.client.updateApplicationSpace(appSpaceRequest, (err, response) => {
        if (err) {
          reject(err);
        } else {
          if (response && response.id === appSpaceRequest.id) {
            resolve(response);
          } else {
            reject(
              new SdkError(
                SdkErrorCode.SDK_CODE_4,
                SkdErrorText.SDK_CODE_4(appSpaceRequest.id, response?.id),
              ),
            );
          }
        }
      });
    });
  }

  static newUpdateConfigNodeRequest(
    configNode: ConfigNodeType,
    bookmarks: string[] = [],
  ): UpdateConfigNodeRequest {
    const request: UpdateConfigNodeRequest = {
      id: configNode.id,
      bookmarks,
      etag: configNode.etag ? StringValue.create({ value: configNode.etag }) : undefined,
      displayName: configNode.displayName
        ? StringValue.fromJson(configNode.displayName)
        : undefined,
      description: configNode.description ? StringValue.create(configNode.description) : undefined,
    } as UpdateConfigNodeRequest;
    if (configNode instanceof AuthorizationPolicy) {
      request.config = {
        oneofKind: AUTHORIZATION_POLICY_CONFIG,
        authorizationPolicyConfig: configNode.marshal(),
      };
    }
    if (configNode instanceof ConsentNode) {
      request.config = {
        oneofKind: CONSENT_CONFIG,
        consentConfig: configNode.marshal(),
      };
    }
    if (configNode instanceof TokenIntrospect) {
      request.config = {
        oneofKind: TOKEN_INTROSPECT_CONFIG,
        tokenIntrospectConfig: configNode.marshal(),
      };
    }
    return request;
  }

  /**
   * https://pkg.go.dev/github.com/indykite/jarvis-sdk-go@v0.11.0/config#Client.UpdateConfigNode
   * @since 0.4.1
   * @example
   * const requestReadConfig = ConfigClient.newReadConfigNodeRequest(CONFIG_ID);
   * let configNode = await sdk.readConfigNode(request);
   * configNode.displayName = 'New Name';
   * const requestUpdateConfig = ConfigClient.newUpdateConfigNodeRequest(configNode);
   * await sdk.updateConfigNode(requestUpdateConfig);
   */
  updateConfigNode(configNodeRequest: UpdateConfigNodeRequest): Promise<UpdateConfigNodeResponse> {
    return new Promise((resolve, reject) => {
      this.client.updateConfigNode(configNodeRequest, (err, response) => {
        if (err) {
          reject(err);
        } else {
          if (response && response.id === configNodeRequest.id) {
            resolve(response);
          } else {
            reject(
              new SdkError(
                SdkErrorCode.SDK_CODE_4,
                SkdErrorText.SDK_CODE_4(configNodeRequest.id, response?.id),
              ),
            );
          }
        }
      });
    });
  }

  /**
   * @since 0.3.2
   * @deprecated since 0.4.1 Use updateConfigNode
   * @example
   * async function example(sdk: ConfigClient, authorizationPolicyId: string) {
   *   const ap = await sdk.readAuthorizationPolicyConfiguration(authorizationPolicyId);
   *   ap.displayName = 'New Display name';
   *   await sdk.updateAuthorizationPolicyConfiguration(ap);
   * }
   */
  updateAuthorizationPolicyConfiguration(
    config: AuthorizationPolicy,
    bookmarks: string[] = [],
  ): Promise<AuthorizationPolicy> {
    const req = {
      id: config.id,
      bookmarks,
    } as UpdateConfigNodeRequest;
    if (config.etag !== undefined) req.etag = StringValue.create({ value: config.etag });
    if (config.displayName !== undefined)
      req.displayName = StringValue.create({ value: config.displayName });
    if (config.description !== undefined) req.description = StringValue.create(config.description);
    req.config = {
      oneofKind: 'authorizationPolicyConfig',
      authorizationPolicyConfig: config.marshal(),
    };

    return new Promise<AuthorizationPolicy>((resolve, reject) => {
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

  static newUpdateServiceAccountRequest(
    serviceAccount: ServiceAccount,
    bookmarks: string[] = [],
  ): UpdateServiceAccountRequest {
    return {
      id: serviceAccount.id,
      bookmarks,
      etag: serviceAccount.etag ? StringValue.create({ value: serviceAccount.etag }) : undefined,
      displayName: serviceAccount.displayName
        ? StringValue.create({ value: serviceAccount.displayName })
        : undefined,
      description: serviceAccount.description
        ? StringValue.create({ value: serviceAccount.description })
        : undefined,
    } as UpdateServiceAccountRequest;
  }

  /**
   * https://pkg.go.dev/github.com/indykite/jarvis-sdk-go@v0.11.0/config#Client.UpdateServiceAccount
   * @since 0.4.1
   * @example
   * const serviceAccount = await sdk.readServiceAccountByName(
   *   CUSTOMER_ID,
   *   'service-account-name',
   * );
   * serviceAccount.displayName = 'New Name';
   * const request = ConfigClien.newUpdateServiceAccountRequest(serviceAccount);
   * await sdk.updateServiceAccount(request);
   */
  updateServiceAccount(
    serviceAccountRequest: UpdateServiceAccountRequest,
  ): Promise<UpdateServiceAccountResponse> {
    return new Promise((resolve, reject) => {
      this.client.updateServiceAccount(serviceAccountRequest, (err, response) => {
        if (err) {
          reject(err);
        } else {
          if (response && response.id === serviceAccountRequest.id) {
            resolve(response);
          } else {
            reject(
              new SdkError(
                SdkErrorCode.SDK_CODE_4,
                SkdErrorText.SDK_CODE_4(serviceAccountRequest.id, response?.id),
              ),
            );
          }
        }
      });
    });
  }

  /**
   *
   * @since 0.4.2
   * @param request
   */
  listConfigNodeVersions(
    request: ListConfigNodeVersionsRequest,
  ): Promise<ListConfigNodeVersionsResponse> {
    return new Promise((resolve, reject) => {
      this.client.listConfigNodeVersions(request, (err, response) => {
        if (err) {
          reject(err);
        } else {
          if (response?.configNodes) {
            resolve(response);
          } else {
            reject(new SdkError(SdkErrorCode.SDK_CODE_3, SkdErrorText.SDK_CODE_3(ConfigNode.name)));
          }
        }
      });
    });
  }
}
