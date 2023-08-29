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
import { ConfigManagementAPIClient } from '../grpc/indykite/config/v1beta1/config_management_api.grpc-client';
import { StringValue } from '../grpc/google/protobuf/wrappers';
import { Utils } from './utils/utils';
import {
  Application,
  ApplicationAgent,
  ApplicationAgentCredential,
  ApplicationSpace,
  AuthFlow,
  AuthorizationPolicy,
  ConfigNodeFactory,
  Customer,
  EmailServiceConfigType,
  OAuth2Application,
  OAuth2ApplicationConfig,
  OAuth2Client,
  OAuth2Provider,
  OAuth2ProviderConfig,
  PermissionsList,
  ServiceAccount,
  ServiceAccountCredential,
  ServiceAccountRole,
  Tenant,
  WebAuthnProvider,
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

  /**
   * @since 0.1.0
   * @example
   * const sendgrid = new SendgridEmailService(
   *   'default-email-provider',
   *   '963843b5-983e-4d73-b666-069a98f1ef57',
   *   true,
   * );
   * await sdk.createEmailServiceConfiguration(
   *   APPLICATION_SPACE_ID,
   *   sendgrid,
   * );
   */
  createEmailServiceConfiguration(
    location: string,
    config: EmailServiceConfigType,
    bookmarks: string[] = [],
  ): Promise<EmailServiceConfigType> {
    const req = CreateConfigNodeRequest.fromJson({
      location,
      name: config.name,
      bookmarks,
    });
    req.config = {
      oneofKind: 'emailServiceConfig',
      emailServiceConfig: config.marshal(),
    };
    return new Promise<EmailServiceConfigType>((resolve, reject) => {
      this.client.createConfigNode(req, (err, response) => {
        if (err) reject(err);
        else if (!response) new SdkError(SdkErrorCode.SDK_CODE_1, 'No email config response');
        else
          try {
            this.saveReturnedBookmark(response.bookmark);
            resolve(response as unknown as EmailServiceConfigType);
          } catch (err) {
            reject(err);
          }
      });
    });
  }

  /**
   * @since 0.1.0
   * @example
   * const config = await sdk.readEmailServiceConfiguration(EMAIL_SERVICE_CONFIG_ID);
   * config.displayName = 'My new name';
   * await sdk.updateEmailServiceConfiguration(config);
   */
  readEmailServiceConfiguration(
    id: string,
    bookmarks: string[] = [],
    version: string = "",
  ): Promise<EmailServiceConfigType> {
    return new Promise((resolve, reject) => {
      this.client.readConfigNode({ id, bookmarks, version }, (err, response) => {
        if (err) reject(err);
        else
          try {
            if (response && response.configNode) {
              const ret = ConfigNodeFactory.createInstance(
                response.configNode,
              ) as EmailServiceConfigType;
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

  /**
   * @since 0.1.0
   * @example
   * const config = await sdk.readEmailServiceConfiguration(EMAIL_SERVICE_CONFIG_ID);
   * config.displayName = 'My new name';
   * await sdk.updateEmailServiceConfiguration(config);
   */
  updateEmailServiceConfiguration(
    config: EmailServiceConfigType,
    bookmarks: string[] = [],
  ): Promise<EmailServiceConfigType> {
    const req = {
      id: config.id,
      bookmarks,
    } as UpdateConfigNodeRequest;
    if (config.etag) req.etag = StringValue.fromJson(config.etag);
    if (config.displayName !== undefined)
      req.displayName = StringValue.fromJson(config.displayName);
    if (config.description !== undefined) req.description = StringValue.create(config.description);
    req.config = {
      oneofKind: 'emailServiceConfig',
      emailServiceConfig: config.marshal(),
    };

    return new Promise<EmailServiceConfigType>((resolve, reject) => {
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

  /**
   * @since 0.1.0
   * @example
   * const config = await sdk.readEmailServiceConfiguration(EMAIL_SERVICE_CONFIG_ID);
   * await sdk.deleteEmailServiceConfiguration(config);
   */
  deleteEmailServiceConfiguration(
    config: EmailServiceConfigType,
    bookmarks: string[] = [],
  ): Promise<boolean> {
    const req = {
      id: config.id,
      bookmarks,
    } as DeleteConfigNodeRequest;
    if (config.etag !== undefined) req.etag = StringValue.fromJson(config.etag);

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

  /**
   * @since 0.1.0
   * @example
   * // auth-flow.yaml file
   * // configuration:
   * //     activities:
   * //         '00000000':
   * //             '@type': input
   * //         '00000034':
   * //             '@type': password
   * //             nodeConfig:
   * //                 minPassword: 5
   * //         000000F0:
   * //             '@type': success
   * //         '00000020':
   * //             '@type': router
   * //             nodeConfig:
   * //                 orders:
   * //                     - '00000034' # Password
   * //                     - '00000036'
   * //         '00000036':
   * //             '@type': action
   * //             nodeConfig:
   * //                 actions:
   * //                     register:
   * //                         order: 0
   * //                         locale_key: I18N_REGISTER
   * //                         icon: register
   * //         '00000054':
   * //             '@type': passwordCreate
   * //     sequences:
   * //         - sourceRef: '00000000' # Input -> Router
   * //           targetRef: '00000020'
   * //         - sourceRef: '00000020' # Router -> Password
   * //           targetRef: '00000034'
   * //         - sourceRef: '00000020' # Router -> Action
   * //           targetRef: '00000036'
   * //         - sourceRef: '00000034' # Password -> Success
   * //           targetRef: 000000F0
   * //           condition: success
   * //         - sourceRef: '00000036' # Action -> Create password
   * //           targetRef: '00000054'
   * //           condition: register
   * //         - sourceRef: '00000054' # Create password -> Success
   * //           targetRef: 000000F0
   * //           condition: success
   *
   * const afData = await fs.readFile('./auth-flow.yaml');
   * await sdk.createAuthflowConfiguration(
   *   APPLICATION_SPACE_ID,
   *   new AuthFlow('my-authflow', AuthFlowConfig_Format.BARE_YAML, afData, true),
   * );
   */
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
            config.createdBy = response.createdBy;
            config.updatedBy = response.updatedBy;
            this.saveReturnedBookmark(response.bookmark);
            resolve(config);
          } catch (err) {
            reject(err);
          }
        }
      });
    });
  }

  /**
   * @since 0.1.0
   * @example
   * const config = await sdk.readAuthflowConfiguration(AUTH_FLOW_CONFIG_ID);
   * config.displayName = 'My new name';
   * await sdk.updateAuthflowConfiguration(config);
   */
  readAuthflowConfiguration(id: string, bookmarks: string[] = [], version: string = ""): Promise<AuthFlow> {
    return new Promise((resolve, reject) => {
      this.client.readConfigNode({ id, bookmarks, version }, (err, response) => {
        if (err) reject(err);
        else
          try {
            if (response && response.configNode) {
              const ret = ConfigNodeFactory.createInstance(response.configNode) as AuthFlow;
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

  /**
   * @since 0.1.0
   * @example
   * const config = await sdk.readAuthflowConfiguration(AUTH_FLOW_CONFIG_ID);
   * config.displayName = 'My new name';
   * await sdk.updateAuthflowConfiguration(config);
   */
  updateAuthflowConfiguration(config: AuthFlow, bookmarks: string[] = []): Promise<AuthFlow> {
    const req = {
      id: config.id,
      bookmarks,
    } as UpdateConfigNodeRequest;
    if (config.etag !== undefined) req.etag = StringValue.fromJson(config.etag);
    if (config.displayName !== undefined)
      req.displayName = StringValue.fromJson(config.displayName);
    if (config.description !== undefined) req.description = StringValue.create(config.description);
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

  /**
   * @since 0.1.0
   * @example
   * const config = await sdk.readAuthflowConfiguration(AUTH_FLOW_CONFIG_ID);
   * await sdk.deleteAuthflowConfiguration(config);
   */
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

  /**
   * @since 0.2.3
   * @example
   * async function example(sdk: ConfigClient) {
   *   await sdk.createWebAuthnProviderConfiguration(
   *     APPLICATION_SPACE_ID,
   *     new WebAuthnProvider({
   *       attestationPreference: ConveyancePreference.NONE,
   *       authenticatorAttachment: AuthenticatorAttachment.DEFAULT,
   *       name: 'my-webauthn-provider',
   *       displayName: 'My WebAuthn Provider',
   *       relyingParties: {
   *         'http://localhost:3000': 'default',
   *       },
   *       requireResidentKey: false,
   *       userVerification: UserVerificationRequirement.PREFERRED,
   *     }),
   *   );
   * }
   */
  createWebAuthnProviderConfiguration(
    location: string,
    config: WebAuthnProvider,
    bookmarks: string[] = [],
  ): Promise<WebAuthnProvider> {
    const req = CreateConfigNodeRequest.fromJson({
      location,
      name: config.name,
      bookmarks,
    });
    req.config = {
      oneofKind: 'webauthnProviderConfig',
      webauthnProviderConfig: config.marshal(),
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
            reject(new SdkError(SdkErrorCode.SDK_CODE_1, 'No webauthn provider response'));
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

  /**
   * @since 0.2.3
   * @example
   * async function example(sdk: ConfigClient) {
   *   const createdWp = await sdk.createWebAuthnProviderConfiguration(
   *     APPLICATION_SPACE_ID,
   *     new WebAuthnProvider({
   *       attestationPreference: ConveyancePreference.NONE,
   *       authenticatorAttachment: AuthenticatorAttachment.DEFAULT,
   *       name: 'my-webauthn-provider',
   *       displayName: 'My WebAuthn Provider',
   *       relyingParties: {
   *         'http://localhost:3000': 'default',
   *       },
   *       requireResidentKey: false,
   *       userVerification: UserVerificationRequirement.PREFERRED,
   *     }),
   *   );
   *
   *   // Store the WebAuthn provider ID somewhere (createdWp.id) so that you can use the ID later.
   *
   *   const wp = await sdk.readWebAuthnProviderConfiguration(createdWp.id);
   *   console.log(JSON.stringify(wp, null, 2));
   * }
   */
  readWebAuthnProviderConfiguration(
    id: string,
    bookmarks: string[] = [],
    version: string = ""
  ): Promise<WebAuthnProvider> {
    return new Promise((resolve, reject) => {
      this.client.readConfigNode({ id, bookmarks, version }, (err, response) => {
        if (err) reject(err);
        else if (response && response.configNode) {
          const ret = ConfigNodeFactory.createInstance(response.configNode) as WebAuthnProvider;
          resolve(ret);
        } else {
          reject(
            new SdkError(
              SdkErrorCode.SDK_CODE_1,
              'config_error_read_webauthnproviderconfiguration',
            ),
          );
        }
      });
    });
  }

  /**
   * @since 0.2.3
   * @example
   * async function example(sdk: ConfigClient, webAuthnProviderId: string) {
   *   const wp = await sdk.readWebAuthnProviderConfiguration(webAuthnProviderId);
   *   wp.displayName = 'New Display name';
   *   await sdk.updateWebAuthnProviderConfiguration(wp);
   * }
   */
  updateWebAuthnProviderConfiguration(
    config: WebAuthnProvider,
    bookmarks: string[] = [],
  ): Promise<WebAuthnProvider> {
    const req = {
      id: config.id,
      bookmarks,
    } as UpdateConfigNodeRequest;
    if (config.etag !== undefined) req.etag = StringValue.create({ value: config.etag });
    if (config.displayName !== undefined)
      req.displayName = StringValue.create({ value: config.displayName });
    if (config.description !== undefined) req.description = StringValue.create(config.description);
    req.config = {
      oneofKind: 'webauthnProviderConfig',
      webauthnProviderConfig: config.marshal(),
    };

    return new Promise<WebAuthnProvider>((resolve, reject) => {
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

  /**
   * @since 0.2.3
   * @example
   * async function example(sdk: ConfigClient, webAuthnProviderId: string) {
   *   const wp = await sdk.readWebAuthnProviderConfiguration(webAuthnProviderId);
   *   await sdk.deleteWebAuthnProviderConfiguration(wp);
   * }
   */
  deleteWebAuthnProviderConfiguration(
    config: WebAuthnProvider,
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

  /**
   * @since 0.3.2
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

  /**
   * @since 0.3.2
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
    version: string = ""
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

  /**
   * @since 0.3.2
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

  /**
   * @since 0.3.2
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

  /**
   * @since 0.1.6
   * @example
   * const customer = await sdk.readCustomerById(CUSTOMER_ID);
   */
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

  /**
   * @since 0.1.6
   * @example
   * const customer = await sdk.readCustomerByName('customer-name');
   */
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

  /**
   * @since 0.1.6
   * @example
   * await sdk.createApplicationSpace(
   *   CUSTOMER_ID,
   *   'app-space-name',
   *   "My Application Space",
   * );
   */
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

  /**
   * @since 0.1.6
   * @example
   * const appSpace = await sdk.readApplicationSpaceById(APPLICATION_SPACE_ID);
   */
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

  /**
   * @since 0.1.6
   * @example
   * const appSpace = await sdk.readApplicationSpaceByName(
   *   CUSTOMER_ID,
   *   'app-space-name',
   * );
   */
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

  /**
   * @since 0.1.6
   * @example
   * const appSpaces = await sdk.readApplicationSpaceList(
   *   CUSTOMER_ID,
   *   ['appspace-name1', 'appspace-name2'],
   * );
   */
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

  /**
   * @since 0.1.6
   * @example
   * const appSpace = await sdk.readApplicationSpaceByName(
   *   CUSTOMER_ID,
   *   'app-space-name',
   * );
   * appSpace.displayName = 'New Name';
   * await sdk.updateApplicationSpace(appSpace);
   */
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

  /**
   * @since 0.1.6
   * @example
   * const appSpace = await sdk.readApplicationSpaceByName(
   *   CUSTOMER_ID,
   *   'app-space-name',
   * );
   * await sdk.deleteApplicationSpace(appSpace);
   */
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

  /**
   * @since 0.1.10
   * @example
   * const appSpace = await sdk.readApplicationSpaceByName(
   *   CUSTOMER_ID,
   *   'app-space-name',
   * );
   * await sdk.createTenant(
   *   appSpace.issuerId,
   *   'tenant-name',
   *   "Default tenant",
   * );
   */
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

  /**
   * @since 0.1.10
   * @example
   * const tenant = await sdk.readTenantById(TENANT_ID);
   */
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

  /**
   * @since 0.1.10
   * @example
   * const tenant = await sdk.readTenantByName(
   *   APPLICATION_SPACE_ID,
   *   'tenant-name',
   * );
   */
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

  /**
   * @since 0.1.10
   * @example
   * const tenant = await sdk.readTenantByName(
   *   APPLICATION_SPACE_ID,
   *   'tenant-name',
   * );
   * tenant.displayName = 'New Name';
   * await sdk.updateTenant(tenant);
   */
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

  /**
   * @since 0.1.10
   * @example
   * const tenants = await sdk.readTenantList(
   *   APPLICATION_SPACE_ID,
   *   ['tenant-name1', 'tenant-name2'],
   * );
   */
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

  /**
   * @since 0.1.10
   * @example
   * const tenant = await sdk.readTenantByName(
   *   APPLICATION_SPACE_ID,
   *   'tenant-name',
   * );
   * await sdk.deleteTenant(tenant);
   */
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

  /**
   * @since 0.1.10
   * @example
   * const application = await sdk.createApplication(
   *   APPLICATION_SPACE_ID,
   *   'application-name',
   * );
   */
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

  /**
   * @since 0.1.10
   * @example
   * const application = await sdk.readApplicationById(APPLICATION_ID);
   */
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

  /**
   * @since 0.1.10
   * @example
   * const application = await sdk.readApplicationByName(
   *   APPLICATION_SPACE_ID,
   *   'application-name'
   * );
   */
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

  /**
   * @since 0.1.10
   * @example
   * const application = await sdk.readApplicationByName(
   *   APPLICATION_SPACE_ID,
   *   'application-name'
   * );
   * application.displayName = 'New Name';
   * await sdk.updateApplication(application);
   */
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

  /**
   * @since 0.1.10
   * @example
   * const applications = await sdk.readApplicationList(
   *   APPLICATION_SPACE_ID,
   *   ['app-name1', 'app-name2'],
   * );
   */
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

  /**
   * @since 0.1.10
   * @example
   * const application = await sdk.readApplicationByName(
   *   APPLICATION_SPACE_ID,
   *   'application-name'
   * );
   * await sdk.deleteApplication(application);
   */
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

  /**
   * @since 0.1.10
   * @example
   * const agent = await sdk.createApplicationAgent(
   *   APPLICATION_ID,
   *   'application-agent-name',
   * );
   */
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

  /**
   * @since 0.1.10
   * @example
   * const agent = await sdk.readApplicationAgentById(APPLICATION_AGENT_ID);
   */
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

  /**
   * @since 0.1.10
   * @example
   * const agent = await sdk.readApplicationAgentByName(
   *   APPLICATION_SPACE_ID,
   *   'application-agent-name',
   * );
   */
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

  /**
   * @since 0.1.10
   * @example
   * const agent = await sdk.readApplicationAgentByName(
   *   APPLICATION_SPACE_ID,
   *   'application-agent-name',
   * );
   * agent.displayName = 'New Name';
   * await sdk.updateApplicationAgent(agent);
   */
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

  /**
   * @since 0.1.10
   * @example
   * const agents = await sdk.readApplicationAgentList(
   *   APPLICATION_SPACE_ID,
   *   ['app-agent-name1', 'app-agent-name2'],
   * );
   */
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

  /**
   * @since 0.1.10
   * @example
   * const agent = await sdk.readApplicationAgentByName(
   *   APPLICATION_SPACE_ID,
   *   'application-agent-name',
   * );
   * await sdk.deleteApplicationAgent(agent);
   */
  deleteApplicationAgent(
    appAgentId: string,
    bookmarks: string[] = [],
    etag?: string,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const req: DeleteApplicationAgentRequest = {
        id: appAgentId,
        bookmarks,
      };

      if (etag !== undefined) req.etag = StringValue.create({ value: etag });

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

  /**
   * @since 0.1.10
   * @example
   * const appCredentials = await sdk.registerApplicationCredential(
   *   APPLICATION_AGENT_ID,
   *   'Credential Name',
   *   TENANT_ID,
   * );
   * // Credentials are stored in `appCredentials.agentConfig` property
   * // and are returned after the creation only
   */
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

  /**
   * @since 0.1.10
   * @example
   * const credentials = await sdk.readApplicationAgentCredential(APPLICATION_AGENT_CREDENTIAL_ID);
   * // Credentials in `appCredentials.agentConfig` property are not accessible
   */
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

  /**
   * @since 0.1.10
   * @example
   * await sdk.deleteApplicationAgentCredential(APPLICATION_AGENT_CREDENTIAL_ID);
   */
  deleteApplicationAgentCredential(
    appCredentialId: string,
    bookmarks: string[] = [],
    etag?: string,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const req: DeleteApplicationAgentCredentialRequest = {
        id: appCredentialId,
        bookmarks,
      };

      if (etag !== undefined) req.etag = StringValue.create({ value: etag });

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

  /**
   * Create application, application agent and application agent credentials in one step.
   * @since 0.3.3
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
  ) {
    let error: unknown;
    let application: Application | undefined = undefined;
    try {
      application = await this.createApplication(appSpaceId, applicationName);
    } catch (err) {
      error = err;
    }

    let applicationAgent: ApplicationAgent | undefined = undefined;
    if (application) {
      try {
        applicationAgent = await this.createApplicationAgent(application.id, applicationAgentName);
      } catch (err) {
        error = err;
      }
    }

    let applicationAgentCredentials: ApplicationAgentCredential | undefined = undefined;
    if (applicationAgent) {
      try {
        applicationAgentCredentials = await this.registerApplicationCredential(
          applicationAgent.id,
          applicationAgentCredentialsName,
          defaultTenantId,
          publicKeyType,
          publicKey,
          expireTime,
        );
      } catch (err) {
        error = err;
      }
    }

    return {
      application,
      applicationAgent,
      applicationAgentCredentials,
      error,
    };
  }

  /**
   * @since 0.1.17
   * @example
   * const provider = await sdk.createOAuth2Provider(
   *   appSpace.id,
   *   'default-oauth2-provider',
   *   new OAuth2ProviderConfig({
   *     frontChannelConsentUri: { default: 'http://localhost:3000/consent' },
   *     frontChannelLoginUri: { default: 'http://localhost:3000/login' },
   *     grantTypes: [GrantType.AUTHORIZATION_CODE],
   *     responseTypes: [ResponseType.CODE],
   *     scopes: ['openid'],
   *     tokenEndpointAuthMethod: [TokenEndpointAuthMethod.CLIENT_SECRET_BASIC],
   *     tokenEndpointAuthSigningAlg: ['RS256'],
   *   })
   * );
   */
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

  /**
   * @since 0.1.17
   * @example
   * const provider = await sdk.readOAuth2Provider(OAUTH2_PROVIDER_ID);
   */
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

  /**
   * @since 0.1.17
   * @example
   * const provider = await sdk.readOAuth2Provider(OAUTH2_PROVIDER_ID);
   * provider.displayName = 'New Name';
   * await sdk.updateOAuth2Provider(provider);
   */
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

  /**
   * @since 0.1.17
   * @example
   * const provider = await sdk.deleteOAuth2Provider(OAUTH2_PROVIDER_ID);
   */
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

  /**
   * @since 0.1.10
   * @example
   * const oauth2App = await sdk.createOAuth2Application(
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
   *   })
   * );
   */
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

  /**
   * @since 0.1.10
   * @example
   * const oauth2App = await sdk.readOAuth2Application(OAUTH2_APPLICATION_ID);
   */
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

  /**
   * @since 0.1.10
   * @example
   * const oauth2App = await sdk.readOAuth2Application(OAUTH2_APPLICATION_ID);
   * oauth2App.displayName = 'New Name';
   * await sdk.updateOAuth2Application(oauth2App);
   */
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

  /**
   * @since 0.1.10
   * @example
   * const oauth2App = await sdk.deleteOAuth2Application(OAUTH2_APPLICATION_ID);
   */
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

  /**
   * @since 0.1.13
   * @example
   * const oauth2Client = await sdk.createOAuth2Client(
   *   APPLICATION_SPACE_ID,
   *   new OAuth2Client({
   *     name: 'default-oauth2-client-tmp',
   *     allowedScopes: ['openid', 'email', 'profile'],
   *     clientId: 'client-id-123456789123456789',
   *     clientSecret: 'client-secret-123456789123456789',
   *     defaultScopes: ['openid', 'email', 'profile'],
   *     providerType: OAuth2ProviderType.GOOGLE_COM,
   *     redirectUri: ['http://localhost:3000/callback'],
   *   }),
   * );
   */
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
      req.description = StringValue.create(oauth2Client.description);
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

  /**
   * @since 0.1.13
   * @example
   * const oauth2Client = await sdk.readOAuth2Client(OAUTH2_CLIENT_ID);
   */
  readOAuth2Client(id: string, bookmarks: string[] = [], version: string = ""): Promise<OAuth2Client> {
    return new Promise((resolve, reject) => {
      this.client.readConfigNode({ id, bookmarks, version }, (err, response) => {
        if (err) reject(err);
        else
          try {
            if (response && response.configNode) {
              const ret = ConfigNodeFactory.createInstance(response.configNode) as OAuth2Client;
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

  /**
   * @since 0.1.13
   * @example
   * const oauth2Client = await sdk.readOAuth2Client(OAUTH2_CLIENT_ID);
   * oauth2Client.displayName = 'New Name';
   * await sdk.updateOAuth2Client(oauth2Client);
   */
  updateOAuth2Client(config: OAuth2Client, bookmarks: string[] = []): Promise<OAuth2Client> {
    const req = {
      id: config.id,
      bookmarks,
    } as UpdateConfigNodeRequest;
    if (config.etag !== undefined) req.etag = StringValue.create({ value: config.etag });
    if (config.displayName !== undefined)
      req.displayName = StringValue.create({ value: config.displayName });
    if (config.description !== undefined) req.description = StringValue.create(config.description);
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

  /**
   * @since 0.1.13
   * @example
   * const oauth2Client = await sdk.deleteOAuth2Client(OAUTH2_CLIENT_ID);
   */
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

  /**
   * @since 0.1.17
   * @example
   * const serviceAccount = await sdk.createServiceAccount(
   *   CUSTOMER_ID,
   *   'service-account-name',
   *   ServiceAccountRole.ALL_EDITOR,
   * );
   */
  createServiceAccount(
    location: string,
    name: string,
    role: ServiceAccountRole | 'all_editor' | 'all_viewer',
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

  /**
   * @since 0.1.17
   * @example
   * const serviceAccount = await sdk.readServiceAccountById(SERVICE_ACCOUNT_ID);
   */
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

  /**
   * @since 0.1.17
   * @example
   * const serviceAccount = await sdk.readServiceAccountByName(
   *   CUSTOMER_ID,
   *   'service-account-name',
   * );
   */
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

  /**
   * @since 0.1.17
   * @example
   * const serviceAccount = await sdk.readServiceAccountByName(
   *   CUSTOMER_ID,
   *   'service-account-name',
   * );
   * serviceAccount.displayName = 'New Name';
   * await sdk.updateServiceAccount(serviceAccount);
   */
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

  /**
   * @since 0.1.17
   * @example
   * await sdk.deleteServiceAccount(SERVICE_ACCOUNT_ID);
   */
  deleteServiceAccount(id: string, bookmarks?: string[]): Promise<void>;

  /**
   * @since 0.1.17
   * @example
   * const serviceAccount = await sdk.readServiceAccountByName(
   *   CUSTOMER_ID,
   *   'service-account-name',
   * );
   * await sdk.deleteServiceAccount(serviceAccount);
   */
  deleteServiceAccount(serviceAccount: ServiceAccount, bookmarks?: string[]): Promise<void>;
  deleteServiceAccount(
    idOrServiceAccount: string | ServiceAccount,
    bookmarks: string[] = [],
  ): Promise<void> {
    const id = typeof idOrServiceAccount === 'string' ? idOrServiceAccount : idOrServiceAccount.id;

    return new Promise((resolve, reject) => {
      const req: DeleteServiceAccountRequest = {
        id,
        bookmarks,
      };

      if (idOrServiceAccount instanceof ServiceAccount && idOrServiceAccount.etag !== undefined) {
        req.etag = StringValue.create({ value: idOrServiceAccount.etag });
      }

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
          this.saveReturnedBookmark(response.bookmark);
          resolve(ServiceAccountCredential.deserialize(response, displayName, serviceAccountId));
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
