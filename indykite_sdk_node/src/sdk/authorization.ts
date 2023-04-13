import { SdkClient } from './client/client';
import {
  IsAuthorizedRequest,
  WhatAuthorizedRequest,
} from '../grpc/indykite/authorization/v1beta1/authorization_service';
import { AuthorizationAPIClient } from '../grpc/indykite/authorization/v1beta1/authorization_service.grpc-client';
import { Option } from '../grpc/indykite/authorization/v1beta1/model';
import { DigitalTwinCore } from './model';
import { SdkError, SdkErrorCode } from './error';
import { Utils } from './utils/utils';

export interface IsAuthorizedResponseAction {
  allow: boolean;
}

export interface IsAuthorizedResponseResource {
  actions: Record<string, IsAuthorizedResponseAction>;
}

export interface WhatAuthorizedResponseResource {
  externalId: string;
}

export interface WhatAuthorizedResponseAction {
  resources: WhatAuthorizedResponseResource[];
}

export interface IsAuthorizedResponseResourceType {
  resources: Record<string, IsAuthorizedResponseResource>;
}

export interface WhatAuthorizedResponseResourceType {
  actions: Record<string, WhatAuthorizedResponseAction>;
}

export interface IsAuthorizedResponse {
  /**
   * Time the decision was made.
   * @since 0.3.0
   */
  decisionTime?: Date;
  /**
   * Map with resource type as key.
   * @since 0.3.0
   */
  decisions: Record<string, IsAuthorizedResponseResourceType>;
}

export interface WhatAuthorizedResponse {
  /**
   * Time the decision was made.
   * @since 0.3.0
   */
  decisionTime?: Date;
  /**
   * Map with resource type as key.
   * @since 0.3.0
   */
  decisions: Record<string, WhatAuthorizedResponseResourceType>;
}

export interface AuthorizationResource {
  /**
   * Resource id.
   * @since 0.3.0
   */
  id: string;
  /**
   * Resource type.
   * @since 0.3.0
   */
  type: string;
  /**
   * A list of actions the subject want to perform.
   * @since 0.3.0
   */
  actions: string[];
}

export interface AuthorizationResourceType {
  /**
   * Resource type.
   * @since 0.3.0
   */
  type: string;
  /**
   * A list of actions the subject want to perform.
   * @since 0.3.0
   */
  actions: string[];
}

export type AuthorizationOptions = string | boolean | number;

export interface PropertyFilter {
  type: string;
  tenantId: string;
  value: unknown;
}

/**
 * @category Clients
 * @since 0.2.2
 * @example
 * // Example how to create a new authorization client
 * const sdk = await AuthorizationClient.createInstance();
 */
export class AuthorizationClient {
  private client: AuthorizationAPIClient;

  /**
   * @since 0.2.2
   */
  constructor(sdk: SdkClient) {
    this.client = sdk.client as AuthorizationAPIClient;
  }

  /**
   * @since 0.2.2
   */
  static createInstance(appCredential?: string | unknown): Promise<AuthorizationClient> {
    return new Promise<AuthorizationClient>((resolve, reject) => {
      SdkClient.createIdentityInstance(AuthorizationAPIClient, appCredential)
        .then((sdk) => {
          resolve(new AuthorizationClient(sdk));
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  /**
   * Check whether the actions are allowed in the specified resources for the selected subject
   * @since 0.3.0
   * @param subject Subject to check if is authorized to perform given actions.
   * @param resources A list of resources to authorize against.
   * @param options Authorization options
   * @example
   * function printAuthorization(token: string) {
   *   AuthorizationClient.createInstance()
   *     .then(async (sdk) => {
   *       const resp = await sdk.isAuthorized(
   *         new DigitalTwinCore(
   *           'digitaltwin-id',
   *           'tenant-id',
   *           DigitalTwinKind.PERSON,
   *           DigitalTwinState.ACTIVE,
   *         ),
   *         [
   *           {
   *             id: 'lotA',
   *             type: 'ParkingLot',
   *             actions: ['HAS_FREE_PARKING'],
   *           },
   *         ],
   *       );
   *       console.log(
   *         'Action:',
   *         resp.decisions['ParkingLot'].resources['lotA'].actions['HAS_FREE_PARKING'].allow,
   *       );
   *     })
   *     .catch((err) => {
   *       console.error(err);
   *     });
   * }
   */
  isAuthorized(
    digitalTwin: DigitalTwinCore,
    resources: AuthorizationResource[],
    options: Record<string, AuthorizationOptions> = {},
  ): Promise<IsAuthorizedResponse> {
    return new Promise((resolve, reject) => {
      const request = IsAuthorizedRequest.create({
        resources,
        subject: {
          subject: {
            oneofKind: 'digitalTwinIdentifier',
            digitalTwinIdentifier: {
              filter: {
                oneofKind: 'digitalTwin',
                digitalTwin: digitalTwin.marshal(),
              },
            },
          },
        },
        options: this.marshalAuthorizationOptions(options),
      });

      this.client.isAuthorized(request, (err, res) => {
        if (err) reject(err);
        else if (!res) {
          throw new SdkError(SdkErrorCode.SDK_CODE_1, 'No data in isAuthorized response');
        } else {
          resolve({
            decisionTime: Utils.timestampToDate(res.decisionTime),
            decisions: res.decisions,
          });
        }
      });
    });
  }

  /**
   * Check whether the actions are allowed in the specified resources for the selected subject
   * @since 0.3.0
   * @param subjectToken Subject to check if is authorized to perform given actions.
   * @param resources A list of resources to authorize against.
   * @param options Authorization options
   * @example
   * function printAuthorization(token: string) {
   *   AuthorizationClient.createInstance()
   *     .then(async (sdk) => {
   *       const resp = await sdk.isAuthorizedByToken('access-token', [
   *         {
   *           id: 'lotA',
   *           type: 'ParkingLot',
   *           actions: ['HAS_FREE_PARKING'],
   *         },
   *       ]);
   *       console.log(
   *         'Action:',
   *         resp.decisions['ParkingLot'].resources['lotA'].actions['HAS_FREE_PARKING'].allow,
   *       );
   *     })
   *     .catch((err) => {
   *       console.error(err);
   *     });
   * }
   */
  isAuthorizedByToken(
    subjectToken: string,
    resources: AuthorizationResource[],
    options: Record<string, AuthorizationOptions> = {},
  ): Promise<IsAuthorizedResponse> {
    return new Promise((resolve, reject) => {
      const request = IsAuthorizedRequest.create({
        resources,
        subject: {
          subject: {
            oneofKind: 'digitalTwinIdentifier',
            digitalTwinIdentifier: {
              filter: {
                oneofKind: 'accessToken',
                accessToken: subjectToken,
              },
            },
          },
        },
        options: this.marshalAuthorizationOptions(options),
      });

      this.client.isAuthorized(request, (err, res) => {
        if (err) reject(err);
        else if (!res) {
          throw new SdkError(SdkErrorCode.SDK_CODE_1, 'No data in isAuthorized response');
        } else {
          resolve({
            decisionTime: Utils.timestampToDate(res.decisionTime),
            decisions: res.decisions,
          });
        }
      });
    });
  }

  /**
   * Check whether the actions are allowed in the specified resources for the selected subject
   * @since 0.3.0
   * @param subjectProperty Subject to check if is authorized to perform given actions.
   * @param resources A list of resources to authorize against.
   * @param options Authorization options
   * @example
   * function printAuthorization(token: string) {
   *   AuthorizationClient.createInstance()
   *     .then(async (sdk) => {
   *       const resp = await this.isAuthorizedByProperty(
   *         {
   *           tenantId: 'tenant-id',
   *           type: 'email',
   *           value: 'user@example.com',
   *         },
   *         [
   *           {
   *             id: 'lotA',
   *             type: 'ParkingLot',
   *             actions: ['HAS_FREE_PARKING'],
   *           },
   *         ],
   *       );
   *       console.log('Action:', resp.decisions['ParkingLot'].resources['lotA'].actions['HAS_FREE_PARKING'].allow);
   *     })
   *     .catch((err) => {
   *       console.error(err);
   *     });
   * }
   */
  isAuthorizedByProperty(
    subjectProperty: PropertyFilter,
    resources: AuthorizationResource[],
    options: Record<string, AuthorizationOptions> = {},
  ): Promise<IsAuthorizedResponse> {
    return new Promise((resolve, reject) => {
      const request = IsAuthorizedRequest.create({
        resources,
        subject: {
          subject: {
            oneofKind: 'digitalTwinIdentifier',
            digitalTwinIdentifier: {
              filter: {
                oneofKind: 'propertyFilter',
                propertyFilter: {
                  ...subjectProperty,
                  value: ([undefined, null] as unknown[]).includes(subjectProperty.value)
                    ? undefined
                    : Utils.objectToValue(subjectProperty.value),
                },
              },
            },
          },
        },
        options: this.marshalAuthorizationOptions(options),
      });

      this.client.isAuthorized(request, (err, res) => {
        if (err) reject(err);
        else if (!res) {
          throw new SdkError(SdkErrorCode.SDK_CODE_1, 'No data in isAuthorized response');
        } else {
          resolve({
            decisionTime: Utils.timestampToDate(res.decisionTime),
            decisions: res.decisions,
          });
        }
      });
    });
  }

  /**
   * Get list of resources where the selected actions are allowed by the selected subject
   * @since 0.3.0
   * @param subject Subject to check if is authorized to perform given actions.
   * @param resourceTypes A list of resources types that should be checked against.
   * @param options Authorization options
   * @example
   * function getAuthorizedResources(token: string) {
   *   AuthorizationClient.createInstance()
   *     .then(async (sdk) => {
   *       const resp = await sdk.whatAuthorized(
   *         new DigitalTwinCore(
   *           'digitaltwin-id',
   *           'tenant-id',
   *           DigitalTwinKind.PERSON,
   *           DigitalTwinState.ACTIVE,
   *         ),
   *         [
   *           {
   *             type: 'ParkingLot',
   *             actions: ['HAS_FREE_PARKING'],
   *           },
   *         ],
   *       );
   *
   *       console.log('Resources:', resp.decisions['ParkingLot'].actions['HAS_FREE_PARKING'].resources);
   *     })
   *     .catch((err) => {
   *       console.error(err);
   *     });
   * }
   */
  whatAuthorized(
    digitalTwin: DigitalTwinCore,
    resourceTypes: AuthorizationResourceType[],
    options: Record<string, AuthorizationOptions> = {},
  ): Promise<WhatAuthorizedResponse> {
    return new Promise((resolve, reject) => {
      const request = WhatAuthorizedRequest.create({
        resourceTypes,
        subject: {
          subject: {
            oneofKind: 'digitalTwinIdentifier',
            digitalTwinIdentifier: {
              filter: {
                oneofKind: 'digitalTwin',
                digitalTwin: digitalTwin.marshal(),
              },
            },
          },
        },
        options: this.marshalAuthorizationOptions(options),
      });

      this.client.whatAuthorized(request, (err, res) => {
        if (err) reject(err);
        else if (!res) {
          throw new SdkError(SdkErrorCode.SDK_CODE_1, 'No data in whatAuthorized response');
        } else {
          resolve({
            decisionTime: Utils.timestampToDate(res.decisionTime),
            decisions: res.decisions,
          });
        }
      });
    });
  }

  /**
   * Get list of resources where the selected actions are allowed by the selected subject
   * @since 0.3.0
   * @param subjectToken Subject to check if is authorized to perform given actions.
   * @param resourceTypes A list of resources types that should be checked against.
   * @param options Authorization options
   * @example
   * function getAuthorizedResources(token: string) {
   *   AuthorizationClient.createInstance()
   *     .then(async (sdk) => {
   *       const resp = await sdk.whatAuthorizedByToken('access-token', [
   *         {
   *           type: 'ParkingLot',
   *           actions: ['HAS_FREE_PARKING'],
   *         },
   *       ]);
   *
   *       console.log('Resources:', resp.decisions['ParkingLot'].actions['HAS_FREE_PARKING'].resources);
   *     })
   *     .catch((err) => {
   *       console.error(err);
   *     });
   * }
   */
  whatAuthorizedByToken(
    subjectToken: string,
    resourceTypes: AuthorizationResourceType[],
    options: Record<string, AuthorizationOptions> = {},
  ): Promise<WhatAuthorizedResponse> {
    return new Promise((resolve, reject) => {
      const request = WhatAuthorizedRequest.create({
        resourceTypes,
        subject: {
          subject: {
            oneofKind: 'digitalTwinIdentifier',
            digitalTwinIdentifier: {
              filter: {
                oneofKind: 'accessToken',
                accessToken: subjectToken,
              },
            },
          },
        },
        options: this.marshalAuthorizationOptions(options),
      });

      this.client.whatAuthorized(request, (err, res) => {
        if (err) reject(err);
        else if (!res) {
          throw new SdkError(SdkErrorCode.SDK_CODE_1, 'No data in whatAuthorizedByToken response');
        } else {
          resolve({
            decisionTime: Utils.timestampToDate(res.decisionTime),
            decisions: res.decisions,
          });
        }
      });
    });
  }

  /**
   * Get list of resources where the selected actions are allowed by the selected subject
   * @since 0.3.0
   * @param subjectProperty Subject to check if is authorized to perform given actions.
   * @param resourceTypes A list of resources types that should be checked against.
   * @param options Authorization options
   * @example
   * function getAuthorizedResources(token: string) {
   *   AuthorizationClient.createInstance()
   *     .then(async (sdk) => {
   *       const resp = await sdk.whatAuthorizedByProperty(
   *         {
   *           tenantId: 'tenant-id',
   *           type: 'email',
   *           value: 'user@example.com',
   *         },
   *         [
   *           {
   *             type: 'ParkingLot',
   *             actions: ['HAS_FREE_PARKING'],
   *           },
   *         ],
   *       );
   *
   *       console.log('Resources:', resp.decisions['ParkingLot'].actions['HAS_FREE_PARKING'].resources);
   *     })
   *     .catch((err) => {
   *       console.error(err);
   *     });
   * }
   */
  whatAuthorizedByProperty(
    subjectProperty: PropertyFilter,
    resourceTypes: AuthorizationResourceType[],
    options: Record<string, AuthorizationOptions> = {},
  ): Promise<WhatAuthorizedResponse> {
    return new Promise((resolve, reject) => {
      const request = WhatAuthorizedRequest.create({
        resourceTypes,
        subject: {
          subject: {
            oneofKind: 'digitalTwinIdentifier',
            digitalTwinIdentifier: {
              filter: {
                oneofKind: 'propertyFilter',
                propertyFilter: {
                  ...subjectProperty,
                  value: ([undefined, null] as unknown[]).includes(subjectProperty.value)
                    ? undefined
                    : Utils.objectToValue(subjectProperty.value),
                },
              },
            },
          },
        },
        options: this.marshalAuthorizationOptions(options),
      });

      this.client.whatAuthorized(request, (err, res) => {
        if (err) reject(err);
        else if (!res) {
          throw new SdkError(
            SdkErrorCode.SDK_CODE_1,
            'No data in whatAuthorizedByProperty response',
          );
        } else {
          resolve({
            decisionTime: Utils.timestampToDate(res.decisionTime),
            decisions: res.decisions,
          });
        }
      });
    });
  }

  private marshalAuthorizationOptions(
    options: Record<string, AuthorizationOptions>,
  ): Record<string, Option> {
    return Object.keys(options).reduce((newOptions, optionKey) => {
      newOptions[optionKey] = Option.fromJson(Utils.objectToJsonValue(options[optionKey]));
      return newOptions;
    }, {} as Record<string, Option>);
  }
}
