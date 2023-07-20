import { SdkClient } from './client/client';
import {
  IsAuthorizedRequest,
  IsAuthorizedRequest_Resource,
  IsAuthorizedResponse,
  WhatAuthorizedRequest,
  WhatAuthorizedRequest_ResourceType,
  WhatAuthorizedResponse,
  WhoAuthorizedRequest,
  WhoAuthorizedRequest_Resource,
  WhoAuthorizedResponse,
} from '../grpc/indykite/authorization/v1beta1/authorization_service';
import { AuthorizationAPIClient } from '../grpc/indykite/authorization/v1beta1/authorization_service.grpc-client';
import { DigitalTwin } from '../grpc/indykite/identity/v1beta2/model';
import { InputParam } from '../grpc/indykite/authorization/v1beta1/model';
import { PropertyFilter } from '../grpc/indykite/identity/v1beta2/attributes';
import { SdkError, SdkErrorCode } from './error';
import { Utils } from './utils/utils';

export type InputParameters = string | boolean | number;

export const DIGITAL_TWIN_IDENTIFIER = 'digitalTwinIdentifier';
export const DIGITAL_TWIN_IDENTIFIER_DIGITAL_TWIN = 'digitalTwin';
export const DIGITAL_TWIN_IDENTIFIER_PROPERTY_FILTER = 'propertyFilter';
export const DIGITAL_TWIN_IDENTIFIER_ACCESS_TOKEN = 'accessToken';

/**
 * @category Clients
 * @since 0.4.1
 * @example
 * // Example how to create a new authorization client
 * const sdk = await AuthorizationClientV2.createInstance();
 */
export class AuthorizationClientV2 {
  private client: AuthorizationAPIClient;

  /**
   * @since 0.4.1
   */
  constructor(sdk: SdkClient) {
    this.client = sdk.client as AuthorizationAPIClient;
  }

  /**
   * @since 0.4.1
   */
  static createInstance(appCredential?: string | unknown): Promise<AuthorizationClientV2> {
    return new Promise<AuthorizationClientV2>((resolve, reject) => {
      SdkClient.createIdentityInstance(AuthorizationAPIClient, appCredential)
        .then((sdk) => {
          resolve(new AuthorizationClientV2(sdk));
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  /**
   * Convert simple (string | boolean | number) map of parameters into `InputParam`
   * https://buf.build/indykite/indykiteapis/docs/main:indykite.authorization.v1beta1#indykite.authorization.v1beta1.InputParam
   * @since 0.4.1
   */
  static getInputParams(options: Record<string, InputParameters>): Record<string, InputParam> {
    return Object.keys(options).reduce(
      (newOptions, optionKey) => {
        newOptions[optionKey] = InputParam.fromJson(Utils.objectToJsonValue(options[optionKey]));
        return newOptions;
      },
      {} as Record<string, InputParam>,
    );
  }

  /**
   * https://pkg.go.dev/github.com/indykite/jarvis-sdk-go@v0.11.0/authorization#Client.IsAuthorized
   * Check whether the actions are allowed in the specified resources
   * @since 0.4.1
   * @param {DigitalTwin} digitalTwin
   * @param {IsAuthorizedRequest_Resource[]} resources A list of resources to authorize against.
   * @param {Record<string, InputParam>} inputParams Policy input params.
   * @param {string[]} policyTags Only evaluate polices containing provided tags.
   * @example
   * function printAuthorization(token: string) {
   *   AuthorizationClientV2.createInstance()
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
    digitalTwin: DigitalTwin,
    resources: IsAuthorizedRequest_Resource[],
    inputParams: Record<string, InputParam> = {},
    policyTags?: string[],
  ): Promise<IsAuthorizedResponse> {
    const request = IsAuthorizedRequest.create({
      resources,
      subject: {
        subject: {
          oneofKind: DIGITAL_TWIN_IDENTIFIER,
          digitalTwinIdentifier: {
            filter: {
              oneofKind: DIGITAL_TWIN_IDENTIFIER_DIGITAL_TWIN,
              digitalTwin: digitalTwin,
            },
          },
        },
      },
      inputParams,
      policyTags,
    });
    return this.isAuthorizedWithRawRequest(request);
  }

  /**
   * Check whether the actions are allowed in the specified resources for the selected property
   * https://pkg.go.dev/github.com/indykite/jarvis-sdk-go@v0.11.0/authorization#Client.IsAuthorizedByProperty
   * @since 0.4.1
   * @param {PropertyFilter} propertyFilter Property to check if is authorized to perform given actions.
   * @param {IsAuthorizedRequest_Resource[]} resources A list of resources to authorize against.
   * @param {Record<string, InputParam>} inputParams Policy input params.
   * @param {string[]} policyTags Only evaluate polices containing provided tags.
   * @example
   * function printAuthorization(token: string) {
   *   AuthorizationClientV2.createInstance()
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
    propertyFilter: PropertyFilter,
    resources: IsAuthorizedRequest_Resource[],
    inputParams: Record<string, InputParam> = {},
    policyTags?: string[],
  ): Promise<IsAuthorizedResponse> {
    const request = IsAuthorizedRequest.create({
      resources,
      subject: {
        subject: {
          oneofKind: DIGITAL_TWIN_IDENTIFIER,
          digitalTwinIdentifier: {
            filter: {
              oneofKind: DIGITAL_TWIN_IDENTIFIER_PROPERTY_FILTER,
              propertyFilter,
            },
          },
        },
      },
      inputParams,
      policyTags,
    });
    return this.isAuthorizedWithRawRequest(request);
  }

  /**
   * https://pkg.go.dev/github.com/indykite/jarvis-sdk-go@v0.11.0/authorization#Client.IsAuthorizedByToken
   * Check whether the actions are allowed in the specified resources for the token
   * @since 0.4.1
   * @param {string} token Token to check if is authorized to perform given actions.
   * @param {IsAuthorizedRequest_Resource[]} resources A list of resources to authorize against.
   * @param {Record<string, InputParam>} inputParams Policy input params.
   * @param {string[]} policyTags Only evaluate polices containing provided tags.
   * @example
   * function printAuthorization(token: string) {
   *   AuthorizationClientV2.createInstance()
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
    token: string,
    resources: IsAuthorizedRequest_Resource[],
    inputParams: Record<string, InputParam> = {},
    policyTags?: string[],
  ): Promise<IsAuthorizedResponse> {
    const request = IsAuthorizedRequest.create({
      resources,
      subject: {
        subject: {
          oneofKind: DIGITAL_TWIN_IDENTIFIER,
          digitalTwinIdentifier: {
            filter: {
              oneofKind: DIGITAL_TWIN_IDENTIFIER_ACCESS_TOKEN,
              accessToken: token,
            },
          },
        },
      },
      inputParams,
      policyTags,
    });
    return this.isAuthorizedWithRawRequest(request);
  }

  /**
   * https://pkg.go.dev/github.com/indykite/jarvis-sdk-go@v0.11.0/authorization#Client.IsAuthorizedWithRawRequest
   * Check whether the there is an authorization based on raw request
   * @since 0.4.1
   */
  isAuthorizedWithRawRequest(request: IsAuthorizedRequest): Promise<IsAuthorizedResponse> {
    return new Promise((resolve, reject) => {
      this.client.isAuthorized(request, (err, response) => {
        if (err) {
          reject(err);
        } else {
          if (!response) {
            // TODO: use constants
            throw new SdkError(SdkErrorCode.SDK_CODE_1, 'No data in isAuthorized response');
          } else {
            resolve(response);
          }
        }
      });
    });
  }

  /**
   * https://pkg.go.dev/github.com/indykite/jarvis-sdk-go@v0.11.0/authorization#Client.WhatAuthorized
   * Get list of resources where the selected actions are allowed by the digitalTwin
   * @since 0.4.1
   * @param {DigitalTwin} digitalTwin
   * @param {WhatAuthorizedRequest_ResourceType[]} resourceTypes A list of resources types that should be checked against.
   * @param {Record<string, InputParam>} inputParams Policy input params.
   * @param {string[]} policyTags Only evaluate polices containing provided tags.
   * @example
   * function getAuthorizedResources(token: string) {
   *   AuthorizationClientV2.createInstance()
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
    digitalTwin: DigitalTwin,
    resourceTypes: WhatAuthorizedRequest_ResourceType[],
    inputParams: Record<string, InputParam> = {},
    policyTags?: string[],
  ): Promise<WhatAuthorizedResponse> {
    const request = WhatAuthorizedRequest.create({
      resourceTypes,
      subject: {
        subject: {
          oneofKind: DIGITAL_TWIN_IDENTIFIER,
          digitalTwinIdentifier: {
            filter: {
              oneofKind: DIGITAL_TWIN_IDENTIFIER_DIGITAL_TWIN,
              digitalTwin,
            },
          },
        },
      },
      inputParams,
      policyTags,
    });
    return this.whatAuthorizedWithRawRequest(request);
  }

  /**
   * https://pkg.go.dev/github.com/indykite/jarvis-sdk-go@v0.11.0/authorization#Client.WhatAuthorizedByProperty
   * Get list of resources where the selected actions are allowed by provided property
   * @since 0.4.1
   * @param {PropertyFilter} propertyFilter Property to check if is authorized to perform given actions.
   * @param {WhatAuthorizedRequest_ResourceType[]} resourceTypes A list of resources types that should be checked against.
   * @param {Record<string, InputParam>} inputParams Policy input params.
   * @param {string[]} policyTags Only evaluate polices containing provided tags.
   * @example
   * function getAuthorizedResources(token: string) {
   *   AuthorizationClientV2.createInstance()
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
    propertyFilter: PropertyFilter,
    resourceTypes: WhatAuthorizedRequest_ResourceType[],
    inputParams: Record<string, InputParam> = {},
    policyTags?: string[],
  ): Promise<WhatAuthorizedResponse> {
    const request = WhatAuthorizedRequest.create({
      resourceTypes,
      subject: {
        subject: {
          oneofKind: DIGITAL_TWIN_IDENTIFIER,
          digitalTwinIdentifier: {
            filter: {
              oneofKind: DIGITAL_TWIN_IDENTIFIER_PROPERTY_FILTER,
              propertyFilter,
            },
          },
        },
      },
      inputParams,
      policyTags,
    });
    return this.whatAuthorizedWithRawRequest(request);
  }

  /**
   * https://pkg.go.dev/github.com/indykite/jarvis-sdk-go@v0.11.0/authorization#Client.WhatAuthorizedByToken
   * Get list of resources where the selected actions are allowed by the selected subject
   * @since 0.4.1
   * @param {string} token Token to check if is authorized to perform given actions.
   * @param {WhatAuthorizedRequest_ResourceType[]} resourceTypes A list of resources types that should be checked against.
   * @param {Record<string, InputParam>} inputParams Policy input params.
   * @param {string[]} policyTags Only evaluate polices containing provided tags.
   * @example
   * function getAuthorizedResources(token: string) {
   *   AuthorizationClientV2.createInstance()
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
    token: string,
    resourceTypes: WhatAuthorizedRequest_ResourceType[],
    inputParams: Record<string, InputParam> = {},
    policyTags?: string[],
  ): Promise<WhatAuthorizedResponse> {
    const request = WhatAuthorizedRequest.create({
      resourceTypes,
      subject: {
        subject: {
          oneofKind: DIGITAL_TWIN_IDENTIFIER,
          digitalTwinIdentifier: {
            filter: {
              oneofKind: DIGITAL_TWIN_IDENTIFIER_ACCESS_TOKEN,
              accessToken: token,
            },
          },
        },
      },
      inputParams,
      policyTags,
    });
    return this.whatAuthorizedWithRawRequest(request);
  }

  /**
   * https://pkg.go.dev/github.com/indykite/jarvis-sdk-go@v0.11.0/authorization#Client.WhatAuthorizedWithRawRequest
   * Get list of resources where the selected actions are allowed for the provided request
   * @since 0.4.1
   */
  whatAuthorizedWithRawRequest(request: WhatAuthorizedRequest): Promise<WhatAuthorizedResponse> {
    return new Promise<WhatAuthorizedResponse>((resolve, reject) => {
      this.client.whatAuthorized(request, (err, response) => {
        if (err) reject(err);
        else if (!response) {
          // TODO: use constants
          throw new SdkError(SdkErrorCode.SDK_CODE_1, 'No data in whatAuthorized response');
        } else {
          resolve(response);
        }
      });
    });
  }

  /**
   * Static methos used to create a new `WhoAuthorizedRequest`
   * @since 0.4.1
   * @param {WhoAuthorizedRequest_Resource[]} resources A list of resources to authorize against.
   * @param {Record<string, InputParam>} inputParams Policy input params.
   * @param {string[]} policyTags Only evaluate polices containing provided tags.
   * @returns {WhoAuthorizedRequest}
   * @example
   * const request = AuthorizationClientV2.newWhoAuthorizedRequest([{
   *   id: 'lotA',
   *   type: 'ParkingLot',
   *   actions: ['HAS_FREE_PARKING'],
   *  }]);
   */
  static newWhoAuthorizedRequest(
    resources: WhoAuthorizedRequest_Resource[],
    inputParams: Record<string, InputParam> = {},
    policyTags?: string[],
  ): WhoAuthorizedRequest {
    return WhoAuthorizedRequest.create({
      resources,
      inputParams,
      policyTags,
    });
  }

  /**
   * https://pkg.go.dev/github.com/indykite/jarvis-sdk-go@v0.11.0/authorization#Client.WhoAuthorized
   * Return a list of subjects and allowed actions for provided request.
   * @since 0.4.1
   * @example
   * function getAuthorizedSubjects() {
   *   AuthorizationClientV2.createInstance()
   *     .then(async (sdk) => {
   *       const request = AuthorizationClientV2.newWhoAuthorizedRequest([
   *         {
   *           id: 'lotA',
   *           type: 'ParkingLot',
   *           actions: ['HAS_FREE_PARKING'],
   *         },
   *       ]);
   *       const resp = await sdk.whoAuthorized(request);
   *       console.log(
   *         'Subjects:',
   *         resp.decisions['ParkingLot'].resources['lotA'].actions['HAS_FREE_PARKING'].subjects,
   *       );
   *     })
   *     .catch((err) => {
   *       console.error(err);
   *     });
   * }
   */
  whoAuthorized(request: WhoAuthorizedRequest): Promise<WhoAuthorizedResponse> {
    return new Promise((resolve, reject) => {
      this.client.whoAuthorized(request, (err, response) => {
        if (err) {
          reject(err);
        } else {
          if (!response) {
            // TODO: use constants
            throw new SdkError(SdkErrorCode.SDK_CODE_1, 'No data in whoAuthorized response');
          } else {
            resolve(response);
          }
        }
      });
    });
  }
}
