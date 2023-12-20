import {
  CreateApplicationAgentRequest,
  CreateApplicationAgentResponse,
  CreateApplicationRequest,
  CreateApplicationResponse,
  CreateApplicationSpaceRequest,
  CreateApplicationSpaceResponse,
  CreateConfigNodeRequest,
  CreateConfigNodeResponse,
  CreateOAuth2ApplicationRequest,
  CreateOAuth2ApplicationResponse,
  CreateOAuth2ProviderRequest,
  CreateOAuth2ProviderResponse,
  CreateServiceAccountRequest,
  CreateServiceAccountResponse,
  CreateTenantRequest,
  CreateTenantResponse,
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
  DeleteOAuth2ApplicationRequest,
  DeleteOAuth2ApplicationResponse,
  DeleteOAuth2ProviderRequest,
  DeleteOAuth2ProviderResponse,
  DeleteServiceAccountRequest,
  DeleteServiceAccountResponse,
  DeleteTenantRequest,
  DeleteTenantResponse,
  ListApplicationAgentsRequest,
  ListApplicationSpacesRequest,
  ListApplicationsRequest,
  ListConfigNodeVersionsRequest,
  ListConfigNodeVersionsResponse,
  ListTenantsRequest,
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
  ReadOAuth2ApplicationRequest,
  ReadOAuth2ApplicationResponse,
  ReadOAuth2ProviderRequest,
  ReadOAuth2ProviderResponse,
  ReadServiceAccountRequest,
  ReadServiceAccountResponse,
  ReadTenantRequest,
  ReadTenantResponse,
  RegisterApplicationAgentCredentialRequest,
  RegisterApplicationAgentCredentialResponse,
  UpdateApplicationAgentRequest,
  UpdateApplicationAgentResponse,
  UpdateApplicationRequest,
  UpdateApplicationResponse,
  UpdateApplicationSpaceRequest,
  UpdateApplicationSpaceResponse,
  UpdateConfigNodeRequest,
  UpdateConfigNodeResponse,
  UpdateOAuth2ApplicationRequest,
  UpdateOAuth2ApplicationResponse,
  UpdateOAuth2ProviderRequest,
  UpdateOAuth2ProviderResponse,
  UpdateServiceAccountRequest,
  UpdateServiceAccountResponse,
  UpdateTenantRequest,
  UpdateTenantResponse,
} from '../grpc/indykite/config/v1beta1/config_management_api';
import { SdkClient } from './client/client';
import { SdkErrorCode, SdkError, SkdErrorText } from './error';
import { ConfigManagementAPIClient } from '../grpc/indykite/config/v1beta1/config_management_api.grpc-client';
import { StringValue } from '../grpc/google/protobuf/wrappers';
import { Utils } from './utils/utils';
import {
  AUTHORIZATION_POLICY_CONFIG,
  AUTH_FLOW_CONFIG,
  Application,
  ApplicationAgent,
  ApplicationAgentCredential,
  ApplicationSpace,
  AuthFlow,
  AuthorizationPolicy,
  ConfigNode,
  ConfigNodeType,
  Customer,
  EmailServiceConfigType,
  OAUTH2_CLIENT_CONFIG,
  OAuth2Application,
  OAuth2ApplicationConfig,
  OAuth2Client,
  OAuth2Provider,
  OAuth2ProviderConfig,
  ServiceAccount,
  ServiceAccountRole,
  Tenant,
  WEBAUTHN_PROVIDER_CONFIG,
  WebAuthnProvider,
} from './model';
import { EMAIL_SERVICE_CONFIG } from './model/config/email/factory';
import { Readable } from 'stream';

export class ConfigClientV2 {
  private client: ConfigManagementAPIClient;

  constructor(sdk: SdkClient) {
    this.client = sdk.client as ConfigManagementAPIClient;
  }

  static createInstance(appCredential?: string | unknown): Promise<ConfigClientV2> {
    return new Promise<ConfigClientV2>((resolve, reject) => {
      SdkClient.createServiceInstance(ConfigManagementAPIClient, appCredential)
        .then((sdk) => {
          resolve(new ConfigClientV2(sdk));
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
   *    ConfigClientV2.newCreateApplicationRequest(
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
   *    ConfigClientV2.newCreateApplicationAgentRequest(
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
  ): CreateApplicationSpaceRequest {
    return {
      customerId,
      name,
      bookmarks,
      displayName: displayName ? StringValue.create({ value: displayName }) : undefined,
      description: description ? StringValue.create({ value: description }) : undefined,
    } as CreateApplicationSpaceRequest;
  }

  /**
   * https://pkg.go.dev/github.com/indykite/jarvis-sdk-go@v0.11.0/config#Client.CreateApplicationSpace
   * @since 0.4.1
   * @example
   * const appSpace = await sdk.createApplicationSpace(
   *    ConfigClientV2.newCreateApplicationSpaceRequest(
   *      CUSTOMER_ID,
   *      'app-space-name',
   *      "My Application Space",
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
   *     'default-tenant-id',
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
    defaultTenantId: string,
    expireTime?: Date,
  ): Promise<object> {
    let application: CreateApplicationResponse | undefined;
    let applicationAgent: CreateApplicationAgentResponse | undefined;
    let applicationAgentCredentials: RegisterApplicationAgentCredentialResponse | undefined;
    try {
      application = await this.createApplication(
        ConfigClientV2.newCreateApplicationRequest(appSpaceId, applicationName),
      );
    } catch (err) {
      return {
        error: err,
      };
    }
    try {
      applicationAgent = await this.createApplicationAgent(
        ConfigClientV2.newCreateApplicationAgentRequest(application.id, applicationAgentName),
      );
    } catch (err) {
      return {
        application,
        error: err,
      };
    }
    try {
      applicationAgentCredentials = await this.registerApplicationAgentCredential(
        ConfigClientV2.newRegisterApplicationAgentCredentialRequest(
          applicationAgent.id,
          applicationAgentCredentialsName,
          defaultTenantId,
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

  static newCreateOAuth2ApplicationRequest(
    oauth2ProviderId: string,
    name: string,
    config: OAuth2ApplicationConfig,
    displayName?: string,
    description?: string,
    bookmarks: string[] = [],
  ): CreateOAuth2ApplicationRequest {
    return {
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
      displayName: displayName ? StringValue.create({ value: displayName }) : undefined,
      description: description ? StringValue.create({ value: description }) : undefined,
    } as CreateOAuth2ApplicationRequest;
  }

  /**
   * https://pkg.go.dev/github.com/indykite/jarvis-sdk-go@v0.11.0/config#Client.CreateOAuth2Application
   * @since 0.4.1
   * @example
   * const oauth2App = await sdk.createOAuth2Application(ConfigClientV2.newCreateOAuth2ApplicationRequest(
   *   OAUTH2_PROVIDER_ID,
   *   'default-oauth2-application',
   *   new OAuth2ApplicationConfig({
   *     clientId: 'client-id-123456789123456789',
   *     displayName: 'OAuth2 Application Name',
   *     owner: 'Owner Name',
   *     redirectUris: ['http://localhost:3000/callback'],
   *     scopes: ['openid'],
   *     subjectType: ClientSubjectType.PUBLIC,
   *     tokenEndpointAuthMethod: TokenEndpointAuthMethod.CLIENT_SECRET_BASIC,
   *     tokenEndpointAuthSigningAlg: 'RS256',
   *     clientUri: 'http://localhost:3000',
   *     logoUri: 'http://localhost:3000/logo.png',
   *     policyUri: 'http://localhost:3000/policy',
   *     termsOfServiceUri: 'http://localhost:3000/tos',
   *     userSupportEmailAddress: 'user@example.com',
   *   }))
   * );
   */
  createOAuth2Application(
    oAuth2ApplicationRequest: CreateOAuth2ApplicationRequest,
  ): Promise<CreateOAuth2ApplicationResponse> {
    return new Promise((resolve, reject) => {
      this.client.createOAuth2Application(oAuth2ApplicationRequest, (err, response) => {
        if (err) {
          reject(err);
        } else {
          if (!response)
            reject(
              new SdkError(
                SdkErrorCode.SDK_CODE_3,
                SkdErrorText.SDK_CODE_3(OAuth2Application.name),
              ),
            );
          else {
            resolve(response);
          }
        }
      });
    });
  }

  static newCreateOAuth2ProviderRequest(
    appSpaceId: string,
    name: string,
    config: OAuth2ProviderConfig,
    displayName?: string,
    description?: string,
    bookmarks: string[] = [],
  ): CreateOAuth2ProviderRequest {
    return {
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
      displayName: displayName ? StringValue.create({ value: displayName }) : undefined,
      description: description ? StringValue.create({ value: description }) : undefined,
    } as CreateOAuth2ProviderRequest;
  }

  /**
   * https://pkg.go.dev/github.com/indykite/jarvis-sdk-go@v0.11.0/config#Client.CreateOAuth2Provider
   * @since 0.4.1
   * @example
   * const provider = await sdk.createOAuth2Provider(
   *   ConfigClientV2.newCreateOAuth2ProviderRequest(
   *    appSpace.id,
   *    'default-oauth2-provider',
   *    new OAuth2ProviderConfig({
   *      frontChannelConsentUri: { default: 'http://localhost:3000/consent' },
   *      frontChannelLoginUri: { default: 'http://localhost:3000/login' },
   *      grantTypes: [GrantType.AUTHORIZATION_CODE],
   *      responseTypes: [ResponseType.CODE],
   *      scopes: ['openid'],
   *      tokenEndpointAuthMethod: [TokenEndpointAuthMethod.CLIENT_SECRET_BASIC],
   *      tokenEndpointAuthSigningAlg: ['RS256'],
   *   })
   *  )
   * );
   */
  createOAuth2Provider(
    oAuth2ProviderRequest: CreateOAuth2ProviderRequest,
  ): Promise<CreateOAuth2ProviderResponse> {
    return new Promise((resolve, reject) => {
      this.client.createOAuth2Provider(oAuth2ProviderRequest, (err, response) => {
        if (err) {
          reject(err);
        } else {
          if (!response) {
            reject(
              new SdkError(SdkErrorCode.SDK_CODE_3, SkdErrorText.SDK_CODE_3(OAuth2Provider.name)),
            );
          } else {
            resolve(response);
          }
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
   *   ConfigClientV2.newCreateServiceAccountRequest(
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

  static newCreateTenantRequest(
    issuerId: string,
    name: string,
    displayName?: string,
    description?: string,
    bookmarks: string[] = [],
  ): CreateTenantRequest {
    return {
      issuerId,
      name,
      bookmarks,
      displayName: displayName ? StringValue.create({ value: displayName }) : undefined,
      description: description ? StringValue.create({ value: description }) : undefined,
    } as CreateTenantRequest;
  }

  /**
   * https://pkg.go.dev/github.com/indykite/jarvis-sdk-go@v0.11.0/config#Client.CreateTenant
   * @since 0.4.1
   * @example
   * await sdk.createTenant(
   *  ConfigClientV2.newCreateTenantRequest(
   *     CUSTOMER_ID,,
   *     'tenant-name',
   *     "Default tenant",
   *  )
   * );
   */
  createTenant(tenantRequest: CreateTenantRequest): Promise<CreateTenantResponse> {
    return new Promise((resolve, reject) => {
      this.client.createTenant(tenantRequest, (err, response) => {
        if (err) {
          reject(err);
        } else {
          if (!response) {
            reject(new SdkError(SdkErrorCode.SDK_CODE_3, SkdErrorText.SDK_CODE_3(Tenant.name)));
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
   * await sdk.deleteApplication(ConfigClientV2.newDeleteApplicationRequest(application));
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
   * const request = ConfigClientV2.newDeleteApplicationAgentRequest(agent.id)
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
   * const request = ConfigClientV2.newDeleteApplicationAgentCredentialRequest(APPLICATION_AGENT_CREDENTIAL_ID);
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
   * await sdk.deleteApplicationSpace(ConfigClientV2.newDeleteApplicationSpaceRequest(appSpace));
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

  static newDeleteOAuth2ApplicationRequest(
    id: string,
    bookmarks: string[] = [],
  ): DeleteOAuth2ApplicationRequest {
    return {
      id: id,
      bookmarks,
    } as DeleteOAuth2ApplicationRequest;
  }

  /**
   * https://pkg.go.dev/github.com/indykite/jarvis-sdk-go@v0.11.0/config#Client.DeleteOAuth2Application
   * @since 0.4.1
   * @example
   * const request = ConfigClientV2.newDeleteOAuth2ApplicationRequest(OAUTH2_APPLICATION_ID);
   * const oauth2App = await sdk.deleteOAuth2Application(request);
   */
  deleteOAuth2Application(
    oAuth2ApplicationRequest: DeleteOAuth2ApplicationRequest,
  ): Promise<DeleteOAuth2ApplicationResponse> {
    return new Promise((resolve, reject) => {
      this.client.deleteOAuth2Application(oAuth2ApplicationRequest, (err, response) => {
        if (err) {
          reject(err);
        } else {
          if (!response) {
            reject(
              new SdkError(
                SdkErrorCode.SDK_CODE_3,
                SkdErrorText.SDK_CODE_3(OAuth2Application.name),
              ),
            );
          } else {
            resolve(response);
          }
        }
      });
    });
  }

  static newDeleteOAuth2ProviderRequest(
    id: string,
    bookmarks: string[] = [],
  ): DeleteOAuth2ProviderRequest {
    return {
      id: id,
      bookmarks,
    } as DeleteOAuth2ProviderRequest;
  }

  /**
   * https://pkg.go.dev/github.com/indykite/jarvis-sdk-go@v0.11.0/config#Client.DeleteOAuth2Provider
   * @since 0.4.1
   * @example
   * const request = ConfigClientV2.newDeleteOAuth2ProviderRequest(OAUTH2_PROVIDER_ID);
   * const provider = await sdk.deleteOAuth2Provider(request);
   */
  deleteOAuth2Provider(
    oAuth2ProviderRequest: DeleteOAuth2ProviderRequest,
  ): Promise<DeleteOAuth2ProviderResponse> {
    return new Promise((resolve, reject) => {
      this.client.deleteOAuth2Provider(oAuth2ProviderRequest, (err, response) => {
        if (err) {
          reject(err);
        } else {
          if (!response) {
            reject(
              new SdkError(
                SdkErrorCode.SDK_CODE_3,
                SkdErrorText.SDK_CODE_3(OAuth2Application.name),
              ),
            );
          } else {
            resolve(response);
          }
        }
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
   * const request = ConfigClientV2.newDeleteServiceAccountRequest(serviceAccount);
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

  static newDeleteTenantRequest(tenant: Tenant, bookmarks: string[] = []): DeleteTenantRequest {
    return {
      id: tenant.id,
      bookmarks,
      etag: tenant.etag ? StringValue.create({ value: tenant.etag }) : undefined,
    } as DeleteTenantRequest;
  }

  /**
   * https://pkg.go.dev/github.com/indykite/jarvis-sdk-go@v0.11.0/config#Client.DeleteTenant
   * @since 0.4.1
   * @example
   * const tenant = await sdk.readTenantByName(
   *   APPLICATION_SPACE_ID,
   *   'tenant-name',
   * );
   * await sdk.deleteTenant(ConfigClientV2.newDeleteTenantRequest(tenant));
   */
  deleteTenant(tenantRequest: DeleteTenantRequest): Promise<DeleteTenantResponse> {
    return new Promise((resolve, reject) => {
      this.client.deleteTenant(tenantRequest, (err, response) => {
        if (err) {
          reject(err);
        } else {
          if (!response) {
            reject(new SdkError(SdkErrorCode.SDK_CODE_3, SkdErrorText.SDK_CODE_3(Tenant.name)));
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
   * const request = ConfigClientV2.newListApplicationAgentsRequest(APPLICATION_SPACE_ID,['app-agent-name1', 'app-agent-name2']);
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
   * const request = ConfigClientV2.newListApplicationSpacesRequest(CUSTOMER_ID,['appspace-name1', 'appspace-name2']);
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
   * const request = ConfigClientV2.newListApplicationsRequest(APPLICATION_SPACE_ID,['app-name1', 'app-name2']);
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

  static newListTenantsRequest(
    appSpaceId: string,
    tenantIds: string[],
    bookmarks: string[] = [],
  ): ListTenantsRequest {
    return {
      appSpaceId,
      match: tenantIds,
      bookmarks,
    } as ListTenantsRequest;
  }

  /**
   * https://pkg.go.dev/github.com/indykite/jarvis-sdk-go@v0.11.0/config#Client.ListTenants
   * @since 0.4.1
   * @example
   * const request = ConfigClientV2.newListTenantsRequest(APPLICATION_SPACE_ID,['tenant-name1', 'tenant-name2']);
   * const tenants = await sdk.listTenants(request);
   */
  listTenants(tenantsRequest: ListTenantsRequest): Readable {
    const result = new Readable({
      read: () => {
        // Nothing needed to be done here
      },
      objectMode: true,
    });
    const stream = this.client
      .listTenants(tenantsRequest)
      .on('readable', () => {
        const value = stream.read();
        if (value && value.tenant) {
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
   * const request = ConfigClientV2.newReadApplicationRequest('id', APPLICATION_ID);
   * const request = ConfigClientV2.newReadApplicationRequest('name', APPLICATION_SPACE_ID, 'application-name');
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
   * const request = ConfigClientV2.newReadApplicationAgentRequest('id', APPLICATION_AGENT_ID);
   * const request = ConfigClientV2.newReadApplicationRequest('name', APPLICATION_SPACE_ID, 'application-agent-name');
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
   * const request = ConfigClientV2.newReadApplicationAgentCredentialRequest(APPLICATION_AGENT_CREDENTIAL_ID);
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
   * const request = ConfigClientV2.newReadApplicationAgentRequest('id', APPLICATION_SPACE_ID);
   * const request = ConfigClientV2.newReadApplicationRequest('name', CUSTOMER_ID, 'app-space-name');
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
   * const request = ConfigClientV2.newReadConfigNodeRequest(EMAIL_SERVICE_CONFIG_ID);
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
   * const request = ConfigClientV2.newReadCustomerRequest('id',CUSTOMER_ID)
   * const request = ConfigClientV2.newReadCustomerRequest('name','customer-name')
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

  static newReadOAuth2ApplicationRequest(
    id: string,
    bookmarks: string[] = [],
  ): ReadOAuth2ApplicationRequest {
    return {
      id,
      bookmarks,
    } as ReadOAuth2ApplicationRequest;
  }

  /**
   * https://pkg.go.dev/github.com/indykite/jarvis-sdk-go@v0.11.0/config#Client.ReadOAuth2Application
   * @since 0.4.1
   * @example
   * const request = ConfigClientV2.newReadOAuth2ApplicationRequest(OAUTH2_APPLICATION_ID);
   * const oauth2App = await sdk.readOAuth2Application(request);
   */
  readOAuth2Application(
    oAuth2ApplicationRequest: ReadOAuth2ApplicationRequest,
  ): Promise<ReadOAuth2ApplicationResponse> {
    return new Promise((resolve, reject) => {
      this.client.readOAuth2Application(oAuth2ApplicationRequest, (err, response) => {
        if (err) {
          reject(err);
        } else {
          if (!response) {
            reject(
              new SdkError(
                SdkErrorCode.SDK_CODE_3,
                SkdErrorText.SDK_CODE_3(OAuth2Application.name),
              ),
            );
          } else {
            resolve(response);
          }
        }
      });
    });
  }

  static newReadOAuth2ProviderRequest(
    id: string,
    bookmarks: string[] = [],
  ): ReadOAuth2ProviderRequest {
    return {
      id,
      bookmarks,
    } as ReadOAuth2ProviderRequest;
  }

  /**
   * https://pkg.go.dev/github.com/indykite/jarvis-sdk-go@v0.11.0/config#Client.ReadOAuth2Provider
   * @since 0.4.1
   * @example
   * const request = ConfigClientV2.newReadOAuth2ProviderRequest(OAUTH2_PROVIDER_ID);
   * const provider = await sdk.readOAuth2Provider(request);
   */
  readOAuth2Provider(
    oAuth2ProviderRequest: ReadOAuth2ProviderRequest,
  ): Promise<ReadOAuth2ProviderResponse> {
    return new Promise((resolve, reject) => {
      this.client.readOAuth2Provider(oAuth2ProviderRequest, (err, response) => {
        if (err) {
          reject(err);
        } else {
          if (!response) {
            reject(
              new SdkError(SdkErrorCode.SDK_CODE_3, SkdErrorText.SDK_CODE_3(OAuth2Provider.name)),
            );
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
   * const request = ConfigClientV2.newReadServiceAccountRequest('id',SERVICE_ACCOUNT_ID);
   * const request = ConfigClientV2.newReadServiceAccountRequest('name',CUSTOMER_ID,'service-account-name');
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

  static newReadTenantRequest(
    kind = 'id',
    id: string,
    name = '',
    bookmarks: string[] = [],
  ): ReadTenantRequest {
    switch (kind) {
      case 'id':
      default:
        return {
          identifier: {
            oneofKind: kind,
            id, //SERVICE_ACCOUNT_ID
          },
          bookmarks,
        } as ReadTenantRequest;
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
        } as ReadTenantRequest;
    }
  }

  /**
   * https://pkg.go.dev/github.com/indykite/jarvis-sdk-go@v0.11.0/config#Client.ReadTenant
   * @since 0.4.1
   * @example
   * const request = ConfigClientV2.newReadTenantRequest('id',TENANT_ID);
   * const request = ConfigClientV2.newReadTenantRequest('name',APPLICATION_SPACE_ID,'tenant-name');
   * const tenant = await sdk.readTenant(request);
   */
  readTenant(tenantRequest: ReadTenantRequest): Promise<ReadTenantResponse> {
    return new Promise((resolve, reject) => {
      this.client.readTenant(tenantRequest, (err, response) => {
        if (err) {
          reject(err);
        } else {
          if (!response) {
            reject(new SdkError(SdkErrorCode.SDK_CODE_3, SkdErrorText.SDK_CODE_3(Tenant.name)));
          } else {
            resolve(response);
          }
        }
      });
    });
  }

  static newRegisterApplicationAgentCredentialRequest(
    applicationAgentId: string,
    displayName: string,
    defaultTenantId: string,
    publicKeyType?: 'jwk' | 'pem',
    publicKey?: Buffer,
    expireTime?: Date,
    bookmarks: string[] = [],
  ): RegisterApplicationAgentCredentialRequest {
    return {
      applicationAgentId,
      displayName,
      defaultTenantId,
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
   * const request = ConfigClientV2.newRegisterApplicationAgentCredentialRequest(
   *   APPLICATION_AGENT_ID,
   *   'Credential Name',
   *   TENANT_ID,
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
   * const requestReadApp = ConfigClientV2.newReadApplicationRequest('name', APPLICATION_SPACE_ID, 'application-name');
   * let application = await sdk.readApplication(request);
   * application.displayName = 'New Name';
   * const requestUpdateApp = ConfigClientV2.newUpdateApplicationRequest(application);
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
   * const requestReadApp = ConfigClientV2.newReadApplicationAgentRequest('name', APPLICATION_SPACE_ID, 'application-agent-name');
   * let agent = await sdk.readApplicationAgent(request);
   * agent.displayName = 'New Name';
   * const requestUpdateApp = ConfigClientV2.newUpdateApplicationAgentRequest(agent);
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
   * const requestReadApp = ConfigClientV2.newReadApplicationSpaceRequest('name', CUSTOMER_ID, 'app-space-name');
   * let appSpace = await sdk.readApplicationSpace(request);
   * appSpace.displayName = 'New Name';
   * const requestUpdateSpace = ConfigClientV2.newUpdateApplicationSpaceRequest(appSpace);
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
    if (configNode instanceof AuthFlow) {
      request.config = {
        oneofKind: AUTH_FLOW_CONFIG,
        authFlowConfig: configNode.marshal(),
      };
    }
    if (configNode instanceof EmailServiceConfigType) {
      request.config = {
        oneofKind: EMAIL_SERVICE_CONFIG,
        emailServiceConfig: configNode.marshal(),
      };
    }
    if (configNode instanceof OAuth2Client) {
      request.config = {
        oneofKind: OAUTH2_CLIENT_CONFIG,
        oauth2ClientConfig: configNode.marshal(),
      };
    }
    if (configNode instanceof WebAuthnProvider) {
      request.config = {
        oneofKind: WEBAUTHN_PROVIDER_CONFIG,
        webauthnProviderConfig: configNode.marshal(),
      };
    }
    if (configNode instanceof AuthorizationPolicy) {
      request.config = {
        oneofKind: AUTHORIZATION_POLICY_CONFIG,
        authorizationPolicyConfig: configNode.marshal(),
      };
    }
    return request;
  }

  /**
   * https://pkg.go.dev/github.com/indykite/jarvis-sdk-go@v0.11.0/config#Client.UpdateConfigNode
   * @since 0.4.1
   * @example
   * const requestReadConfig = ConfigClientV2.newReadConfigNodeRequest(CONFIG_ID);
   * let configNode = await sdk.readConfigNode(request);
   * configNode.displayName = 'New Name';
   * const requestUpdateConfig = ConfigClientV2.newUpdateConfigNodeRequest(configNode);
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

  static newUpdateOAuth2ApplicationRequest(
    oauth2Client: OAuth2Application,
    bookmarks: string[] = [],
  ): UpdateOAuth2ApplicationRequest {
    return {
      id: oauth2Client.id,
      bookmarks,
      etag: oauth2Client.etag ? StringValue.create({ value: oauth2Client.etag }) : undefined,
      displayName: oauth2Client.displayName
        ? StringValue.create({ value: oauth2Client.displayName })
        : undefined,
      description: oauth2Client.description
        ? StringValue.create({ value: oauth2Client.description })
        : undefined,
      config: oauth2Client.config?.marshal() ?? undefined,
    } as UpdateOAuth2ApplicationRequest;
  }

  /**
   * https://pkg.go.dev/github.com/indykite/jarvis-sdk-go@v0.11.0/config#Client.UpdateOAuth2Application
   * @since 0.4.1
   * @example
   * const oauth2App = await sdk.readOAuth2Application(OAUTH2_APPLICATION_ID);
   * oauth2App.displayName = 'New Name';
   * const request = ConfigClientV2.newUpdateOAuth2ApplicationRequest(oauth2App);
   * await sdk.updateOAuth2Application(request);
   */
  updateOAuth2Application(
    oAuth2ApplicationRequest: UpdateOAuth2ApplicationRequest,
  ): Promise<UpdateOAuth2ApplicationResponse> {
    return new Promise((resolve, reject) => {
      this.client.updateOAuth2Application(oAuth2ApplicationRequest, (err, response) => {
        if (err) {
          reject(err);
        } else {
          if (response && response.id === oAuth2ApplicationRequest.id) {
            resolve(response);
          } else {
            reject(
              new SdkError(
                SdkErrorCode.SDK_CODE_4,
                SkdErrorText.SDK_CODE_4(oAuth2ApplicationRequest.id, response?.id),
              ),
            );
          }
        }
      });
    });
  }

  static newUpdateOAuth2ProviderRequest(
    oauth2Provider: OAuth2Provider,
    bookmarks: string[] = [],
  ): UpdateOAuth2ProviderRequest {
    return {
      id: oauth2Provider.id,
      bookmarks,
      etag: oauth2Provider.etag ? StringValue.create({ value: oauth2Provider.etag }) : undefined,
      displayName: oauth2Provider.displayName
        ? StringValue.create({ value: oauth2Provider.displayName })
        : undefined,
      description: oauth2Provider.description
        ? StringValue.create({ value: oauth2Provider.description })
        : undefined,
      config: oauth2Provider.config?.marshal() ?? undefined,
    } as UpdateOAuth2ProviderRequest;
  }

  /**
   * https://pkg.go.dev/github.com/indykite/jarvis-sdk-go@v0.11.0/config#Client.UpdateOAuth2Provider
   * @since 0.4.1
   * @example
   * const provider = await sdk.readOAuth2Provider(OAUTH2_PROVIDER_ID);
   * provider.displayName = 'New Name';
   * const request = ConfigClientV2.newUpdateOAuth2ProviderRequest(provider);
   * await sdk.updateOAuth2Provider(request);
   */
  updateOAuth2Provider(
    oAuth2ProviderRequest: UpdateOAuth2ProviderRequest,
  ): Promise<UpdateOAuth2ProviderResponse> {
    return new Promise((resolve, reject) => {
      this.client.updateOAuth2Provider(oAuth2ProviderRequest, (err, response) => {
        if (err) {
          reject(err);
        } else {
          if (response && response.id === oAuth2ProviderRequest.id) {
            resolve(response);
          } else {
            reject(
              new SdkError(
                SdkErrorCode.SDK_CODE_4,
                SkdErrorText.SDK_CODE_4(oAuth2ProviderRequest.id, response?.id),
              ),
            );
          }
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
   * const request = ConfigClientV2.newUpdateServiceAccountRequest(serviceAccount);
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

  static newUpdateTenantRequest(tenant: Tenant, bookmarks: string[] = []): UpdateTenantRequest {
    return {
      id: tenant.id,
      bookmarks,
      etag: tenant.etag ? StringValue.create({ value: tenant.etag }) : undefined,
      displayName: tenant.displayName
        ? StringValue.create({ value: tenant.displayName })
        : undefined,
      description: tenant.description
        ? StringValue.create({ value: tenant.description })
        : undefined,
    } as UpdateTenantRequest;
  }

  /**
   * https://pkg.go.dev/github.com/indykite/jarvis-sdk-go@v0.11.0/config#Client.UpdateTenant
   * @since 0.4.1
   * @example
   * const tenant = await sdk.readTenantByName(
   *   APPLICATION_SPACE_ID,
   *   'tenant-name',
   * );
   * tenant.displayName = 'New Name';
   * const request = ConfigClientV2.newUpdateTenantRequest(tenant);
   * await sdk.updateTenant(request);
   */
  updateTenant(tenantRequest: UpdateTenantRequest): Promise<UpdateTenantResponse> {
    return new Promise((resolve, reject) => {
      this.client.updateTenant(tenantRequest, (err, response) => {
        if (err) {
          reject(err);
        } else {
          if (response && response.id === tenantRequest.id) {
            resolve(response);
          } else {
            reject(
              new SdkError(
                SdkErrorCode.SDK_CODE_4,
                SkdErrorText.SDK_CODE_4(tenantRequest.id, response?.id),
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
