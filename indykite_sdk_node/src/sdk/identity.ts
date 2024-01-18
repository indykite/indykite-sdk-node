import {
  CheckInvitationStateRequest,
  CheckInvitationStateResponse,
  CheckOAuth2ConsentChallengeRequest,
  CheckOAuth2ConsentChallengeResponse,
  CreateConsentRequest,
  CreateConsentResponse,
  CreateInvitationRequest,
  CreateOAuth2ConsentVerifierRequest,
  CreateOAuth2ConsentVerifierResponse,
  DeleteDigitalTwinRequest,
  ListDigitalTwinsRequest,
  EnrichTokenRequest,
  GetDigitalTwinRequest,
  ListConsentsRequest,
  PatchDigitalTwinRequest,
  RegisterDigitalTwinWithoutCredentialRequest,
  RegisterDigitalTwinWithoutCredentialResponse,
  ResendInvitationRequest,
  RevokeConsentRequest,
  TokenIntrospectRequest,
} from '../grpc/indykite/identity/v1beta2/identity_management_api';
import { DigitalTwin, DigitalTwinIdentifier } from '../grpc/indykite/identity/v1beta2/model';
import * as sdkTypes from './model';
import type { GetDigitalTwinResponse } from '../grpc/indykite/identity/v1beta2/identity_management_api';

import { SdkErrorCode, SdkError } from './error';
import { SdkClient } from './client/client';
import { IdentityManagementAPIClient } from '../grpc/indykite/identity/v1beta2/identity_management_api.grpc-client';
import {
  BatchOperationResult,
  PropertyBatchOperation,
  PropertyFilter,
  PropertyMask,
} from '../grpc/indykite/identity/v1beta2/attributes';
import { Utils } from './utils/utils';
import { PatchResult, Property } from './model';
import {
  ImportDigitalTwin,
  ImportDigitalTwinsRequest,
  ImportDigitalTwinsResponse,
} from '../grpc/indykite/identity/v1beta2/import';
import { Readable } from 'stream';
import { IndexFixer, streamSplitter } from './utils/stream';

/**
 * @category Clients
 * @example
 * // Example how to create a new identity client
 * const sdk = await IdentityClient.createInstance();
 */
export class IdentityClient {
  private client: IdentityManagementAPIClient;

  constructor(sdk: SdkClient) {
    this.client = sdk.client as IdentityManagementAPIClient;
  }

  static createInstance(appCredential?: string | unknown): Promise<IdentityClient> {
    return new Promise<IdentityClient>((resolve, reject) => {
      SdkClient.createIdentityInstance(IdentityManagementAPIClient, appCredential)
        .then((sdk) => {
          resolve(new IdentityClient(sdk));
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  /**
   * Validate the token and return information about it.
   * @since 0.4.1
   * @example
   * async function example(sdk: IdentityClient) {
   *   const tokenInfo = await sdk.introspectToken(USER_ACCESS_TOKEN);
   *   if (!tokenInfo.active) {
   *     console.error('Invalid token');
   *     return;
   *   }
   *   const dtId = tokenInfo.tokenInfo?.subject?.id;
   *   const tenantId = tokenInfo.tokenInfo?.subject?.tenantId;
   *   if (!dtId || !tenantId) {
   *     console.error('Unknown subject');
   *     return;
   *   }
   *   const dt = await sdk.getDigitalTwin(new DigitalTwinBuilder(dtId, tenantId));
   * }
   */
  introspectToken(token: string): Promise<sdkTypes.TokenInfo> {
    // Build request message
    const request = TokenIntrospectRequest.fromJson({ token });

    // Invoke the RPC
    return new Promise<sdkTypes.TokenInfo>((resolve, reject) => {
      this.client.tokenIntrospect(request, (err, response) => {
        if (err) reject(err);
        try {
          if (!response) {
            reject(new SdkError(SdkErrorCode.SDK_CODE_1, 'Missing token introspect response'));
            return;
          }
          resolve(sdkTypes.TokenInfo.deserialize(response));
        } catch (err) {
          reject(err);
        }
      });
    });
  }

  /**
   * Receive all properties for given digital twin.
   * @since 0.4.1
   * @example
   * async function example(sdk: IdentityClient) {
   *   const dt = await sdk.getDigitalTwin(
   *     DigitalTwin.create({
   *       id: DIGITAL_TWIN_ID,
   *       tenantId: TENANT_ID,
   *     }),
   *     [
   *       grpcIdentityAttributes.PropertyMask.create({
   *         definition: {
   *           property: 'email',
   *         },
   *       }),
   *     ],
   *   );
   *   console.log(JSON.stringify(dt, null, 2));
   * }
   */
  getDigitalTwin(
    digitalTwin: DigitalTwin,
    properties?: PropertyMask[],
  ): Promise<GetDigitalTwinResponse> {
    return this.processGetDigitalTwinRequest(
      {
        filter: {
          oneofKind: 'digitalTwin',
          digitalTwin,
        },
      },
      properties,
    );
  }

  /**
   * Receive all properties for given digital twin.
   * @since O.4.1
   * @example
   * async function example(sdk: IdentityClient) {
   *   const dt = await sdk.getDigitalTwinByToken(
   *     USER_ACCESS_TOKEN,
   *     [
   *       grpcIdentityAttributes.PropertyMask.create({
   *         definition: {
   *           property: 'email',
   *         },
   *       }),
   *     ],
   *   );
   *   console.log(JSON.stringify(dt, null, 2));
   * }
   */
  getDigitalTwinByToken(
    token: string,
    properties?: PropertyMask[],
  ): Promise<GetDigitalTwinResponse> {
    return this.processGetDigitalTwinRequest(
      {
        filter: {
          oneofKind: 'accessToken',
          accessToken: token,
        },
      },
      properties,
    );
  }

  /**
   * **
   * Receive all properties for given digital twin.
   * @since 0.4.1
   * @example
   * async function example(sdk: IdentityClient) {
   *   const dt = await sdk.getDigitalTwinByProperty(
   *     grpcIdentityAttributes.PropertyFilter.create({
   *       tenantId: TENANT_ID,
   *       type: 'email',
   *       value: grpcStruct.Value.fromJson({ stringValue: 'user@example.com' }),
   *     }),
   *     [
   *       grpcIdentityAttributes.PropertyMask.create({
   *         definition: {
   *           property: 'email',
   *         },
   *       }),
   *     ],
   *   );
   *   console.log(JSON.stringify(dt, null, 2));
   * }
   */
  getDigitalTwinByProperty(
    propertyFilter: PropertyFilter,
    properties?: PropertyMask[],
  ): Promise<GetDigitalTwinResponse> {
    return this.processGetDigitalTwinRequest(
      {
        filter: {
          oneofKind: 'propertyFilter',
          propertyFilter,
        },
      },
      properties,
    );
  }

  /**
   * This function lists DigitalTwins matching the filter.
   * @param tenantId The Tenant ID.
   * @param collectionId CollectionId, relative to `parent`, to list.
   * @param properties The requested property values.
   * @param pageSize The maximum number of documents to return.
   * @param pageToken The `nextPageToken` value returned from a previous List request.
   * @param orderBy Expression to sort results by. For example: `priority desc, name`.
   */
  listDigitalTwins(
    tenantId: string,
    collectionId: string,
    properties: string[],
    pageSize?: number,
    pageToken?: string,
    orderBy?: string,
  ): Promise<{ digitalTwins: sdkTypes.DigitalTwin[]; nextPageToken?: string }> {
    return new Promise((resolve, reject) => {
      const request = ListDigitalTwinsRequest.create({
        tenantId,
        properties: Property.fromPropertiesList(properties),
        collectionId,
      });

      if (pageToken !== undefined) request.pageToken = pageToken;
      if (orderBy !== undefined) request.orderBy = orderBy;
      if (pageSize !== undefined) request.pageSize = pageSize;

      this.client.listDigitalTwins(request, (err, res) => {
        if (err) reject(err);
        else if (!res) resolve({ digitalTwins: [] });
        else
          resolve({
            digitalTwins: res.digitalTwin.map((result) =>
              sdkTypes.DigitalTwin.deserialize({ digitalTwin: result }),
            ),
            nextPageToken: res.nextPageToken,
          });
      });
    });
  }

  private patch(request: PatchDigitalTwinRequest): Promise<PatchResult[]> {
    return new Promise((resolve, reject) => {
      this.client.patchDigitalTwin(request, (err, response) => {
        if (err) reject(err);
        else {
          if (response && response.result) {
            resolve(response.result.map((result) => PatchResult.deserialize(result)));
          } else {
            reject(new SdkError(SdkErrorCode.SDK_CODE_1, 'Missing patch response'));
          }
        }
      });
    });
  }

  patchProperties(
    digitalTwinId: string,
    tenantId: string,
    dt: sdkTypes.DigitalTwin,
    forceDelete = false,
  ): Promise<PatchResult[]> {
    const patchdt = DigitalTwin.fromJson({});
    patchdt.id = digitalTwinId;
    patchdt.tenantId = tenantId;

    const dti = DigitalTwinIdentifier.fromJson({
      digitalTwin: DigitalTwin.toJson(patchdt),
    });

    const request = PatchDigitalTwinRequest.fromJson({
      id: DigitalTwinIdentifier.toJson(dti),
      forceDelete,
    });
    request.operations = dt.getPatchOperationsAndReset();
    return this.patch(request);
  }

  patchPropertiesByToken(
    token: string,
    dt: sdkTypes.DigitalTwin,
    forceDelete = false,
  ): Promise<PatchResult[]> {
    if (token.length < 32) {
      throw new Error('Token must be 32 chars or more.');
    }
    const request = PatchDigitalTwinRequest.fromJson({
      id: Utils.createDigitalTwinIdFromToken(token),
      forceDelete,
    });
    request.operations = dt.getPatchOperationsAndReset();
    return this.patch(request);
  }

  /**
   * @since 0.4.1
   * @example
   * // Add a new 'email' property with 'user@example.com' value
   * async function example(sdk: IdentityClient, dt: DigitalTwin) {
   *   const opResult = await sdk.patchDigitalTwin(dt, [
   *     {
   *       operation: {
   *         oneofKind: 'add',
   *         add: {
   *           id: '',
   *           definition: {
   *             property: 'email',
   *             context: '',
   *             type: '',
   *           },
   *           value: {
   *             oneofKind: 'objectValue',
   *             objectValue: {
   *               value: { oneofKind: 'stringValue', stringValue: 'user@example.com' },
   *             },
   *           },
   *         },
   *       },
   *     },
   *   ]);
   *   console.log(JSON.stringify(opResult, null, 2));
   * }
   */
  patchDigitalTwin(
    digitalTwin: DigitalTwin,
    operations: PropertyBatchOperation[],
    forceDelete = false,
  ): Promise<BatchOperationResult> {
    const request: PatchDigitalTwinRequest = {
      id: {
        filter: {
          oneofKind: 'digitalTwin',
          digitalTwin,
        },
      },
      adminToken: '',
      forceDelete,
      operations,
    };

    return new Promise((resolve, reject) => {
      this.client.patchDigitalTwin(request, (err, response) => {
        if (err) reject(err);
        else if (!response)
          reject(new SdkError(SdkErrorCode.SDK_CODE_1, 'No patch operation result response'));
        else {
          resolve(response.result[0]);
        }
      });
    });
  }

  /**
   * @since 0.4.1
   * @example
   * // Add a new 'email' property with 'user@example.com' value
   * async function example(sdk: IdentityClient, accessToken: string) {
   *   const opResult = await sdk.patchDigitalTwinByToken(accessToken, [
   *     {
   *       operation: {
   *         oneofKind: 'add',
   *         add: {
   *           id: '',
   *           definition: {
   *             property: 'email',
   *             context: '',
   *             type: '',
   *           },
   *           value: {
   *             oneofKind: 'objectValue',
   *             objectValue: {
   *               value: { oneofKind: 'stringValue', stringValue: 'user@example.com' },
   *             },
   *           },
   *         },
   *       },
   *     },
   *   ]);
   *   console.log(JSON.stringify(opResult, null, 2));
   * }
   */
  patchDigitalTwinByToken(
    token: string,
    operations: PropertyBatchOperation[],
    forceDelete = false,
  ): Promise<BatchOperationResult> {
    const request: PatchDigitalTwinRequest = {
      id: {
        filter: {
          oneofKind: 'accessToken',
          accessToken: token,
        },
      },
      adminToken: '',
      forceDelete,
      operations,
    };

    return new Promise((resolve, reject) => {
      this.client.patchDigitalTwin(request, (err, response) => {
        if (err) reject(err);
        else if (!response)
          reject(new SdkError(SdkErrorCode.SDK_CODE_1, 'No patch operation result response'));
        else {
          resolve(response.result[0]);
        }
      });
    });
  }

  /**
   * This function deletes the digital twin.
   * @since 0.4.1
   * @example
   * async function example(sdk: IdentityClient) {
   *   await sdk.deleteDigitalTwin({
   *     id: 'gid:digitaltwin-id',
   *     tenantId: 'gid:tenant-id',
   *     state: DigitalTwinState.ACTIVE,
   *     kind: DigitalTwinKind.PERSON,
   *     tags: [],
   *   });
   * }
   */
  deleteDigitalTwin(digitalTwin: DigitalTwin): Promise<DigitalTwin> {
    const request: DeleteDigitalTwinRequest = {
      id: {
        filter: {
          oneofKind: 'digitalTwin',
          digitalTwin,
        },
      },
      adminToken: '',
    };

    return new Promise<DigitalTwin>((resolve, reject) => {
      this.client.deleteDigitalTwin(request, (err, response) => {
        if (err) reject(err);
        else {
          if (response && response.digitalTwin) {
            resolve(response.digitalTwin);
          } else {
            reject(new SdkError(SdkErrorCode.SDK_CODE_1, 'Missing delete response'));
          }
        }
      });
    });
  }

  /**
   * This function deletes the digital twin.
   * @since 0.4.1
   * @example
   * async function example(sdk: IdentityClient) {
   *   await sdk.deleteDigitalTwinByToken('access-token');
   * }
   */
  deleteDigitalTwinByToken(token: string): Promise<DigitalTwin> {
    const request: DeleteDigitalTwinRequest = {
      id: {
        filter: {
          oneofKind: 'accessToken',
          accessToken: token,
        },
      },
      adminToken: '',
    };

    return new Promise<DigitalTwin>((resolve, reject) => {
      this.client.deleteDigitalTwin(request, (err, response) => {
        if (err) reject(err);
        else {
          if (response && response.digitalTwin) {
            resolve(response.digitalTwin);
          } else {
            reject(new SdkError(SdkErrorCode.SDK_CODE_1, 'Missing delete response'));
          }
        }
      });
    });
  }

  /**
   * This function sends invitation token to invitee.
   * @since 0.4.1
   * @example
   * async function example(sdk: IdentityClient) {
   *   await sdk.createEmailInvitation(
   *     'user@example.com',
   *     'gid:tenant-id',
   *     'custom-unique-reference-id',
   *   );
   * }
   */
  createEmailInvitation(
    invitee: string,
    tenantId: string,
    referenceId: string,
    expireTime?: Date,
    inviteAtTime?: Date,
    messageAttributes?: Record<string, unknown>,
  ): Promise<void> {
    const request: CreateInvitationRequest = {
      invitee: {
        oneofKind: 'email',
        email: invitee,
      },
      tenantId,
      referenceId,
    };

    if (inviteAtTime) request.inviteAtTime = Utils.dateToTimestamp(inviteAtTime);
    if (expireTime) request.expireTime = Utils.dateToTimestamp(expireTime);

    return new Promise<void>((resolve, reject) => {
      if (messageAttributes) {
        const attributesValue = Utils.objectToValue(messageAttributes);
        if (attributesValue.value.oneofKind !== 'mapValue') {
          reject(
            new SdkError(
              SdkErrorCode.SDK_CODE_1,
              'Message attributes property needs to be an object value',
            ),
          );
          return;
        }
        request.messageAttributes = attributesValue.value.mapValue;
      }

      this.client.createInvitation(request, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  createMobileInvitation(
    invitee: string,
    tenantId: string,
    referenceId: string,
    expireTime?: Date,
    inviteAtTime?: Date,
    messageAttributes?: Record<string, unknown>,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = CreateInvitationRequest.fromJson({
        tenantId,
        referenceId,
        mobile: invitee,
      });

      if (expireTime) {
        request.expireTime = Utils.dateToTimestamp(expireTime);
      }

      if (inviteAtTime) {
        request.inviteAtTime = Utils.dateToTimestamp(inviteAtTime);
      }

      if (messageAttributes) {
        const attributesValue = Utils.objectToValue(messageAttributes);
        if (attributesValue.value.oneofKind !== 'mapValue') {
          reject(
            new SdkError(
              SdkErrorCode.SDK_CODE_1,
              'Message attributes property needs to be an object value',
            ),
          );
          return;
        }
        request.messageAttributes = attributesValue.value.mapValue;
      }

      this.client.createInvitation(request, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  /**
   * This function checks the status of invitation.
   * @since 0.4.1
   * @example
   * async function example(sdk: IdentityClient) {
   *   await sdk.createEmailInvitation(
   *     'user@example.com',
   *     'gid:tenant-id',
   *     'custom-unique-reference-id',
   *   );
   *   const state = await sdk.checkInvitationState('custom-unique-reference-id');
   *   console.log(JSON.stringify(state, null, 2));
   * }
   */
  checkInvitationState(referenceId: string): Promise<CheckInvitationStateResponse> {
    return new Promise((resolve, reject) => {
      const request: CheckInvitationStateRequest = {
        identifier: {
          oneofKind: 'referenceId',
          referenceId,
        },
      };

      this.client.checkInvitationState(request, (err, response) => {
        if (err) reject(err);
        else if (!response)
          reject(new SdkError(SdkErrorCode.SDK_CODE_1, 'Missing check invitation response'));
        else {
          resolve(response);
        }
      });
    });
  }

  /**
   * This function checks the status of invitation.
   * @since 0.4.1
   * @example
   * async function example(sdk: IdentityClient) {
   *   const state = await sdk.checkInvitationState('token-sent-to-email');
   *   console.log(JSON.stringify(state, null, 2));
   * }
   */
  checkInvitationToken(invitationToken: string): Promise<CheckInvitationStateResponse> {
    return new Promise((resolve, reject) => {
      const request: CheckInvitationStateRequest = {
        identifier: {
          oneofKind: 'invitationToken',
          invitationToken,
        },
      };

      this.client.checkInvitationState(request, (err, response) => {
        if (err) reject(err);
        else if (!response)
          reject(new SdkError(SdkErrorCode.SDK_CODE_1, 'Missing check invitation response'));
        else {
          resolve(response);
        }
      });
    });
  }

  /**
   * This function sends invitation token to invitee.
   * @since 0.4.1
   * @example
   * async function example(sdk: IdentityClient) {
   *   await sdk.resendInvitation('custom-unique-reference-id');
   * }
   */
  resendInvitation(referenceId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const request: ResendInvitationRequest = {
        referenceId,
      };

      this.client.resendInvitation(request, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  /**
   * This function revokes a pending invitation identified by referenceID.
   * @since 0.4.1
   * @example
   * async function example(sdk: IdentityClient) {
   *   await sdk.cancelInvitation('custom-unique-reference-id');
   * }
   */
  cancelInvitation(referenceId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const request: ResendInvitationRequest = {
        referenceId,
      };

      this.client.cancelInvitation(request, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  /**
   * @since 0.4.1
   * @example
   * async function example(sdk: IdentityClient) {
   *   await sdk.enrichToken({
   *     accessToken: userToken,
   *     tokenClaims: {
   *       fields: {
   *         myTokenValue: {
   *           kind: {
   *             oneofKind: 'stringValue',
   *             stringValue: 'abc',
   *           },
   *         },
   *       },
   *     },
   *     sessionClaims: {
   *       fields: {
   *         mySessionValue: {
   *           kind: {
   *             oneofKind: 'numberValue',
   *             numberValue: 44,
   *           },
   *         },
   *       },
   *     },
   *   });
   * }
   */
  enrichToken(req: EnrichTokenRequest): Promise<void> {
    return new Promise((resolve, reject) => {
      const request: EnrichTokenRequest = {
        accessToken: req.accessToken,
      };
      if (req.tokenClaims) {
        request.tokenClaims = req.tokenClaims;
      }
      if (req.sessionClaims) {
        request.sessionClaims = req.sessionClaims;
      }

      this.client.enrichToken(request, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  /**
   * @since 0.4.1
   * @example
   * async function example(sdk: IdentityClient) {
   *   const consentChallengeInfo = await sdk.checkConsentChallenge({
   *     challenge: 'consent-challenge-token',
   *   });
   *   console.log(JSON.stringify(consentChallengeInfo, null, 2));
   * }
   */
  checkConsentChallenge(
    request: CheckOAuth2ConsentChallengeRequest,
  ): Promise<CheckOAuth2ConsentChallengeResponse | undefined> {
    return new Promise((resolve, reject) => {
      this.client.checkOAuth2ConsentChallenge(request, (err, response) => {
        if (err) reject(err);
        else resolve(response);
      });
    });
  }

  /**
   * @since 0.4.1
   * @example
   * async function example(sdk: IdentityClient) {
   *   const consentVerifier = await sdk.createConsentVerifier({
   *     consentChallenge: 'consent-challenge-token',
   *     result: {
   *       oneofKind: 'approval',
   *       approval: {
   *         grantedAudiences: [],
   *         grantScopes: ['openid', 'email'],
   *         remember: true,
   *         rememberFor: '0',
   *       },
   *     },
   *   });
   *   console.log(JSON.stringify(consentVerifier, null, 2));
   * }
   */
  createConsentVerifier(
    request: CreateOAuth2ConsentVerifierRequest,
  ): Promise<CreateOAuth2ConsentVerifierResponse | undefined> {
    return new Promise((resolve, reject) => {
      this.client.createOAuth2ConsentVerifier(request, (err, response) => {
        if (err) reject(err);
        else resolve(response);
      });
    });
  }

  /**
   * @since 0.4.1
   * @example
   * import * as bcrypt from 'bcrypt';
   *
   * async function example(sdk: IdentityClient) {
   *  const saltRounds = 10;
   *  const myPlaintextPassword = 'password-of-user';
   *
   *  const [salt, hash]: string[] = await new Promise((resolve, reject) => {
   *    bcrypt.genSalt(saltRounds, function (err, salt) {
   *      if (err) {
   *        reject(err);
   *        return;
   *      }
   *
   *      bcrypt.hash(myPlaintextPassword, salt, function (err, hash) {
   *        if (err) {
   *          reject(err);
   *          return;
   *        }
   *        resolve([salt, hash]);
   *      });
   *    });
   *  });
   *
   *  const password: PasswordCredential = {
   *    password: {
   *      hash: {
   *        passwordHash: Buffer.from(hash),
   *        salt: Buffer.from(salt),
   *      },
   *      oneofKind: 'hash',
   *    },
   *    uid: {
   *      oneofKind: 'email',
   *      email: {
   *        email: 'user@example.com',
   *        verified: true,
   *      },
   *    },
   *  };
   *
   *  const result = await sdk.importDigitalTwins(
   *    [
   *      {
   *        id: '',
   *        tenantId: 'gid:AAAAAxe5-tWaWUufnFqaMnFwsRk',
   *        kind: DigitalTwinKind.PERSON,
   *        state: DigitalTwinState.ACTIVE,
   *        providerUserInfo: [],
   *        tags: [],
   *        password,
   *      },
   *    ],
   *    {
   *      oneofKind: 'bcrypt',
   *      bcrypt: {},
   *    },
   *  );
   *  console.log(JSON.stringify(result, null, 2));
   *}
   */
  importDigitalTwins(
    digitalTwins: ImportDigitalTwin[] | Readable,
    hashAlgorithm: ImportDigitalTwinsRequest['hashAlgorithm'],
  ): Promise<ImportDigitalTwinsResponse> {
    if (!Array.isArray(digitalTwins)) {
      return this.importStreamedDigitalTwins(digitalTwins, hashAlgorithm);
    }

    return this.importStreamedDigitalTwins(Readable.from(digitalTwins), hashAlgorithm);
  }

  private importStreamedDigitalTwins(
    digitalTwinStream: Readable,
    hashAlgorithm: ImportDigitalTwinsRequest['hashAlgorithm'],
  ): Promise<ImportDigitalTwinsResponse> {
    return new Promise((resolve, reject) => {
      const results: ImportDigitalTwinsResponse['results'] = [];

      const output = streamSplitter(
        digitalTwinStream,
        this.client.importDigitalTwins.bind(this.client),
        1000,
        (chunks: unknown[]) => {
          return ImportDigitalTwinsRequest.create({
            hashAlgorithm,
            entities: chunks as ImportDigitalTwin[],
          });
        },
        [new IndexFixer('results.index')],
      );

      output.on('data', (res: ImportDigitalTwinsResponse) => {
        results.push(...res.results);
      });

      output.on('end', () => {
        resolve({ results });
      });

      output.on('error', (err) => {
        reject(err);
      });
    });
  }

  /**
   * RegisterDigitalTwinWithoutCredential creates a DigitalTwin without credentials, but with properties
   * This is a protected operation and it can be accessed only with valid agent credentials!
   * @since 0.4.1
   * @example
   * async function example(sdk: IdentityClient) {
   *   const result = sdk.registerDigitalTwinWithoutCredential({
   *     tenantId: 'gid:tenant-id',
   *     digitalTwinKind: grpcIdentityModel.DigitalTwinKind.PERSON,
   *     digitalTwinTags: ['Employer'],
   *     properties: [
   *       {
   *         definition: {
   *           property: 'email',
   *           context: '',
   *           type: '',
   *         },
   *         id: 'property-id',
   *         value: {
   *           oneofKind: 'objectValue',
   *           objectValue: {
   *             value: {
   *               oneofKind: 'stringValue',
   *               stringValue: 'employer@example.com',
   *             },
   *           },
   *         },
   *       },
   *     ],
   *     bookmarks: [],
   *   });
   *   console.log(JSON.stringify(result, null, 2));
   * }
   */
  registerDigitalTwinWithoutCredential(
    request: RegisterDigitalTwinWithoutCredentialRequest,
  ): Promise<RegisterDigitalTwinWithoutCredentialResponse> {
    return new Promise((resolve, reject) => {
      this.client.registerDigitalTwinWithoutCredential(request, (err, response) => {
        if (err) reject(err);
        else if (!response) {
          reject(new SdkError(SdkErrorCode.SDK_CODE_1, 'Missing register digital twin response'));
        } else {
          resolve(response);
        }
      });
    });
  }

  /**
   * @since 0.4.1
   * @example
   * async function example(sdk: IdentityClient) {
   *   const result = await sdk.createConsent({
   *     piiPrincipalId: 'gid:principal-id',
   *     piiProcessorId: 'gid:processor-id',
   *     properties: ['parking-lot'],
   *   });
   *   console.log(JSON.stringify(result, null, 2));
   * }
   */
  createConsent(
    piiProcessorId: string,
    piiPrincipalId: string,
    properties: string[],
  ): Promise<CreateConsentResponse> {
    const request = CreateConsentRequest.create({
      piiProcessorId,
      piiPrincipalId,
      properties,
    });

    return new Promise((resolve, reject) => {
      this.client.createConsent(request, (err, response) => {
        if (err) reject(err);
        else if (!response) {
          reject(new SdkError(SdkErrorCode.SDK_CODE_1, 'Missing create consent response'));
        } else {
          resolve(response);
        }
      });
    });
  }

  /**
   * @since 0.4.1
   * @example
   * async function example(sdk: IdentityClient) {
   *   const result = await sdk.revokeConsent({
   *     piiPrincipalId: 'gid:principal-id',
   *     consentIds: ['consent-id1', 'consent-id2'],
   *   });
   *   console.log(JSON.stringify(result, null, 2));
   * }
   */
  revokeConsent(piiPrincipalId: string, consentIds: string[]): Promise<void> {
    const request = RevokeConsentRequest.create({
      piiPrincipalId,
      consentIds,
    });

    return new Promise((resolve, reject) => {
      this.client.revokeConsent(request, (err, response) => {
        if (err) reject(err);
        else if (!response) {
          reject(new SdkError(SdkErrorCode.SDK_CODE_1, 'Missing revoke consent response'));
        } else {
          resolve();
        }
      });
    });
  }

  /**
   * @since 0.4.1
   * @example
   * async function example(sdk: IdentityClient) {
   *   const stream = sdk.listConsents({
   *     piiPrincipalId: 'gid:principal-id',
   *   });
   *   stream.on('data', (record: grpcIdentityAPI.ListConsentsResponse) => {
   *     console.log(JSON.stringify(record.consentReceipt, null, 2));
   *   });
   * }
   */
  listConsents(piiPrincipalId: string): Promise<{ consents: sdkTypes.Consent[] }> {
    const request = ListConsentsRequest.create({
      piiPrincipalId,
    });

    return new Promise((resolve, reject) => {
      const consentList: sdkTypes.Consent[] = [];
      const stream = this.client
        .listConsents(request)
        .on('readable', () => {
          const value = stream.read();
          if (value && value.consentReceipt) {
            consentList.push(sdkTypes.Consent.deserialize(value));
          }
        })
        .on('close', () => {
          resolve({ consents: consentList });
        })
        .on('error', (err) => {
          reject(err);
        });
    });
  }

  private async processGetDigitalTwinRequest(
    dtId: DigitalTwinIdentifier,
    properties?: PropertyMask[],
  ): Promise<GetDigitalTwinResponse> {
    const request: GetDigitalTwinRequest = {
      id: dtId,
      properties: properties ?? [],
    };

    return new Promise((resolve, reject) => {
      this.client.getDigitalTwin(request, (err, response) => {
        if (err) reject(err);
        else if (!response)
          reject(new SdkError(SdkErrorCode.SDK_CODE_1, 'No Digital Twin response'));
        else {
          resolve(response);
        }
      });
    });
  }
}
