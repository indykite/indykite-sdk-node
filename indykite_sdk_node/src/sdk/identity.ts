import {
  CancelInvitationRequest,
  ChangePasswordRequest,
  CheckOAuth2ConsentChallengeRequest,
  CheckInvitationStateRequest,
  ConsentRequestSessionData,
  CreateOAuth2ConsentVerifierRequest,
  CreateInvitationRequest,
  DeleteDigitalTwinRequest,
  DigitalTwinIdentifier,
  EnrichTokenRequest,
  GetDigitalTwinRequest,
  GetPasswordCredentialRequest,
  IsAuthorizedRequest,
  ListDigitalTwinsRequest,
  PatchDigitalTwinRequest,
  ResendInvitationRequest,
  SessionIntrospectRequest,
  StartDigitalTwinEmailVerificationRequest,
  StartForgottenPasswordFlowRequest,
  TokenIntrospectRequest,
  UpdatePasswordCredentialRequest,
  VerifyDigitalTwinEmailRequest,
} from '../grpc/indykite/identity/v1beta2/identity_management_api';
import { DigitalTwin, IdentityTokenInfo } from '../grpc/indykite/identity/v1beta2/model';
import * as sdkTypes from './model';

import { SdkErrorCode, SdkError } from './error';
import { Utils } from './utils/utils';
import {
  ConsentChallenge,
  ConsentChallengeDenial,
  DigitalTwinCore,
  PatchResult,
  Property,
} from './model';
import { SdkClient } from './client/client';
import { IdentityManagementAPIClient } from '../grpc/indykite/identity/v1beta2/identity_management_api.grpc-client';
import { Invitation } from './model/invitation';
import { JsonValue } from '@protobuf-ts/runtime';
import {
  ImportDigitalTwinsRequest,
  ImportDigitalTwinsResponse,
} from '../grpc/indykite/identity/v1beta2/import';
import { HashAlgorithm } from './model/hash_algorithm';
import { ImportDigitalTwin, ImportResult } from './model/import_digitaltwin';
import { AuthorizationDecisions } from './model/authorization_decisions';
import { BoolValue } from '../grpc/google/protobuf/wrappers';
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

  /**
   * @decrecated Use createInstance instead
   * @param appCredential
   * @returns
   */
  static newClient(appCredential?: string | unknown): Promise<IdentityClient> {
    return this.createInstance(appCredential);
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
   * This function is experimental and not implemented yet
   * @experimental
   * @param token The string value of the token. For access tokens, this
   * is the "access_token" value returned from the token endpoint
   * defined in OAuth 2.0. For refresh tokens, this is the "refresh_token"
   * value returned.
   */
  sessionIntrospect(
    tenantId: string,
    token: string,
  ): Promise<{ tokenInfo: sdkTypes.TokenInfo; providers: string[] }> {
    return new Promise((resolve, reject) => {
      const request = SessionIntrospectRequest.create({
        tenantId,
        token,
      });

      this.client.sessionIntrospect(request, (err, res) => {
        if (err) reject(err);
        if (!res) {
          reject(new SdkError(SdkErrorCode.SDK_CODE_1, 'Missing session introspect response'));
          return;
        }
        resolve({
          tokenInfo: sdkTypes.TokenInfo.deserialize(res),
          providers: res.providerData,
        });
      });
    });
  }

  getDigitalTwin(
    digitalTwinId: string,
    tenantId: string,
    properties: string[],
  ): Promise<{ digitalTwin?: sdkTypes.DigitalTwin; tokenInfo?: sdkTypes.TokenInfo }> {
    const dtId = digitalTwinId;
    const tId = tenantId;
    const request = GetDigitalTwinRequest.fromJson({
      id: Utils.createDigitalTwinId(dtId, tId),
      properties: Property.fromPropertiesList(properties),
    });

    return new Promise((resolve, reject) => {
      this.client.getDigitalTwin(request, (err, response) => {
        if (err) reject(err);
        else {
          try {
            const dtResponse: {
              digitalTwin?: sdkTypes.DigitalTwin;
              tokenInfo?: sdkTypes.TokenInfo;
            } = {};
            if (response && response.digitalTwin) {
              dtResponse.digitalTwin = sdkTypes.DigitalTwin.deserialize(response);
            }

            if (response && response.tokenInfo) {
              dtResponse.tokenInfo = sdkTypes.TokenInfo.deserialize(
                response.tokenInfo as IdentityTokenInfo,
              );
            }
            resolve(dtResponse);
          } catch (err) {
            reject(err);
          }
        }
      });
    });
  }

  getDigitalTwinByToken(
    token: string,
    properties: string[],
  ): Promise<{ digitalTwin?: sdkTypes.DigitalTwin; tokenInfo?: sdkTypes.TokenInfo }> {
    if (token.length < 32) {
      throw new Error('Token must be 32 chars or more.');
    }
    const request = GetDigitalTwinRequest.fromJson({
      id: Utils.createDigitalTwinIdFromToken(token),
      properties: Property.fromPropertiesList(properties),
    });

    return new Promise((resolve, reject) => {
      this.client.getDigitalTwin(request, (err, response) => {
        if (err) reject(err);
        else {
          try {
            const dtResponse: {
              digitalTwin?: sdkTypes.DigitalTwin;
              tokenInfo?: sdkTypes.TokenInfo;
            } = {};
            if (!response) {
              reject(new SdkError(SdkErrorCode.SDK_CODE_1, 'Missing digital twin response'));
              return;
            }
            if (response.digitalTwin) {
              dtResponse.digitalTwin = sdkTypes.DigitalTwin.deserialize(response);
            }

            if (response.tokenInfo) {
              dtResponse.tokenInfo = sdkTypes.TokenInfo.deserialize(
                response.tokenInfo as IdentityTokenInfo,
              );
            }
            resolve(dtResponse);
          } catch (err) {
            reject(err);
          }
        }
      });
    });
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

  startEmailVerification(
    digitalTwinId: string,
    tenantId: string,
    email: string,
    attributes?: unknown,
  ): Promise<boolean> {
    const { digitalTwin } = Utils.createDigitalTwinId(digitalTwinId, tenantId);
    const request = StartDigitalTwinEmailVerificationRequest.fromJson({
      digitalTwin,
      email,
    });
    if (attributes) {
      const attributesValue = Utils.objectToValue(attributes);
      if (attributesValue.value.oneofKind !== 'mapValue') {
        throw new SdkError(
          SdkErrorCode.SDK_CODE_1,
          'Message attributes property needs to be an object value',
        );
      }
      request.attributes = attributesValue.value.mapValue;
    }

    return new Promise<boolean>((resolve, reject) => {
      this.client.startDigitalTwinEmailVerification(request, (err) => {
        if (err) reject(err);
        else resolve(true);
      });
    });
  }

  verifyDigitalTwinEmail(token: string): Promise<sdkTypes.DigitalTwin> {
    if (token.length < 32) {
      throw new Error('Token must be 32 chars or more.');
    }

    const request = VerifyDigitalTwinEmailRequest.fromJson({
      token,
    });

    return new Promise<sdkTypes.DigitalTwin>((resolve, reject) => {
      this.client.verifyDigitalTwinEmail(request, (err, response) => {
        if (err) reject(err);
        else {
          if (response && response.digitalTwin) {
            const dt = response.digitalTwin;
            resolve(new sdkTypes.DigitalTwin(dt.id, dt.tenantId, dt.kind, dt.state, dt.tags));
          } else {
            reject(new SdkError(SdkErrorCode.SDK_CODE_1, 'Missing verify email response'));
          }
        }
      });
    });
  }

  startForgottenPasswordFlow(digitalTwinId: string, tenantId: string): Promise<boolean> {
    const digitalTwin = Utils.createDigitalTwinId(digitalTwinId, tenantId);
    const request = StartForgottenPasswordFlowRequest.fromJson(digitalTwin);

    return new Promise<boolean>((resolve, reject) => {
      this.client.startForgottenPasswordFlow(request, (err) => {
        if (err) reject(err);
        else resolve(true);
      });
    });
  }

  changePasswordByToken(token: string, password: string): Promise<boolean> {
    if (token.length < 32) {
      throw new Error('Token must be 32 chars or more.');
    }
    const request = ChangePasswordRequest.fromJson({
      token,
      password,
    });

    return new Promise<boolean>((resolve, reject) => {
      this.client.changePassword(request, (err, response) => {
        if (err) reject(err);
        else if (response && response.error) reject(response.error);
        else resolve(true);
      });
    });
  }

  /**
   * @deprecated sine 0.1.6, use changePasswordByToken instead
   */
  changeMyPassword(token: string, password: string): Promise<boolean> {
    if (token.length < 32) {
      throw new Error('Token must be 32 chars or more.');
    }
    const request = ChangePasswordRequest.fromJson({
      token,
      password,
    });

    return new Promise<boolean>((resolve, reject) => {
      this.client.changePassword(request, (err) => {
        if (err) reject(err);
        else resolve(true);
      });
    });
  }

  changePassword(digitalTwinId: string, tenantId: string, password: string): Promise<boolean> {
    const { digitalTwin } = Utils.createDigitalTwinId(digitalTwinId, tenantId);
    const request = ChangePasswordRequest.fromJson({
      digitalTwin,
      password,
    });

    return new Promise<boolean>((resolve, reject) => {
      this.client.changePassword(request, (err, response) => {
        if (err) reject(err);
        else if (response && response.error) reject(response.error);
        else resolve(true);
      });
    });
  }

  /**
   * @deprecated sience 0.1.6, use changePassword instead
   */
  changePasswordOfDigitalTwin(
    digitalTwinId: string,
    tenantId: string,
    password: string,
  ): Promise<boolean> {
    const { digitalTwin } = Utils.createDigitalTwinId(digitalTwinId, tenantId);
    const request = ChangePasswordRequest.fromJson({
      digitalTwin,
      password,
    });

    return new Promise<boolean>((resolve, reject) => {
      this.client.changePassword(request, (err) => {
        if (err) reject(err);
        else resolve(true);
      });
    });
  }

  deleteDigitalTwin(digitalTwinId: string, tenantId: string): Promise<sdkTypes.DigitalTwin> {
    const digitalTwin = Utils.createDigitalTwinId(digitalTwinId, tenantId);
    const request = DeleteDigitalTwinRequest.fromJson({
      id: digitalTwin,
    });

    return new Promise<sdkTypes.DigitalTwin>((resolve, reject) => {
      this.client.deleteDigitalTwin(request, (err, response) => {
        if (err) reject(err);
        else {
          if (response && response.digitalTwin) {
            const dt = response.digitalTwin;
            resolve(new sdkTypes.DigitalTwin(dt.id, dt.tenantId, dt.kind, dt.state, dt.tags));
          } else {
            reject(new SdkError(SdkErrorCode.SDK_CODE_1, 'Missing delete response'));
          }
        }
      });
    });
  }

  deleteDigitalTwinByToken(token: string): Promise<sdkTypes.DigitalTwin> {
    if (token.length < 32) {
      throw new Error('Token must be 32 chars or more.');
    }
    const request = DeleteDigitalTwinRequest.fromJson({
      id: Utils.createDigitalTwinIdFromToken(token),
    });

    return new Promise<sdkTypes.DigitalTwin>((resolve, reject) => {
      this.client.deleteDigitalTwin(request, (err, response) => {
        if (err) reject(err);
        else {
          if (response && response.digitalTwin) {
            const dt = response.digitalTwin;
            resolve(new sdkTypes.DigitalTwin(dt.id, dt.tenantId, dt.kind, dt.state, dt.tags));
          } else {
            reject(new SdkError(SdkErrorCode.SDK_CODE_1, 'Missing delete response'));
          }
        }
      });
    });
  }

  checkConsentChallenge(challenge: string): Promise<ConsentChallenge> {
    const request = CheckOAuth2ConsentChallengeRequest.fromJson({
      challenge,
    });

    return new Promise((resolve, reject) => {
      this.client.checkOAuth2ConsentChallenge(request, (err, response) => {
        if (err) reject(err);
        else if (!response) {
          reject(new SdkError(SdkErrorCode.SDK_CODE_1, 'Missing check consent challenge response'));
        } else {
          resolve(ConsentChallenge.deserialize(response, challenge));
        }
      });
    });
  }

  createConsentVerifier(consentChallenge: ConsentChallenge): Promise<{
    authorizationEndpoint: string;
    verifier: string;
  }>;

  createConsentVerifier(
    consentChallenge: string,
    denialReason?: ConsentChallengeDenial,
  ): Promise<{
    authorizationEndpoint: string;
    verifier: string;
  }>;

  createConsentVerifier(
    consentChallenge: string,
    scopes?: string[],
    audiences?: string[],
    session?: ConsentRequestSessionData,
    remember?: boolean,
    rememberFor?: string,
  ): Promise<{
    authorizationEndpoint: string;
    verifier: string;
  }>;

  createConsentVerifier(
    consentChallenge: string | ConsentChallenge,
    scopesOrDenialReason?: ConsentChallengeDenial | string[],
    audiences?: string[],
    session?: ConsentRequestSessionData,
    remember?: boolean,
    rememberFor?: string,
  ): Promise<{
    authorizationEndpoint: string;
    verifier: string;
  }> {
    if (typeof consentChallenge !== 'string') {
      return this.createConsentVerifierFromInstance(consentChallenge);
    }

    if (scopesOrDenialReason !== undefined && !Array.isArray(scopesOrDenialReason)) {
      return this.createDeniedConsentVerifier(consentChallenge, scopesOrDenialReason);
    }

    return this.createApprovedConsentVerifier(
      consentChallenge,
      scopesOrDenialReason,
      audiences,
      session,
      remember,
      rememberFor,
    );
  }

  createEmailInvitation(
    invitee: string,
    tenantId: string,
    referenceId: string,
    expireTime?: Date,
    inviteAtTime?: Date,
    messageAttributes?: Record<string, unknown>,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = CreateInvitationRequest.fromJson({
        tenantId: tenantId,
        referenceId,
        email: invitee,
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

  checkInvitationState({
    referenceId,
    invitationToken,
  }: {
    referenceId?: string;
    invitationToken?: string;
  }): Promise<Invitation> {
    return new Promise((resolve, reject) => {
      const request = CheckInvitationStateRequest.create();

      if (!referenceId && !invitationToken) {
        reject(
          new SdkError(
            SdkErrorCode.SDK_CODE_1,
            'You have not specified neither reference ID nor invitation token',
          ),
        );
        return;
      }

      if (referenceId && invitationToken) {
        reject(
          new SdkError(
            SdkErrorCode.SDK_CODE_1,
            'You can not specify both the reference ID and the invitation token',
          ),
        );
        return;
      }

      if (referenceId) {
        request.identifier = {
          oneofKind: 'referenceId',
          referenceId,
        };
      }

      if (invitationToken) {
        request.identifier = {
          oneofKind: 'invitationToken',
          invitationToken,
        };
      }

      this.client.checkInvitationState(request, (err, response) => {
        if (err) reject(err);
        else if (!response)
          reject(new SdkError(SdkErrorCode.SDK_CODE_1, 'Missing check invitation response'));
        else {
          resolve(Invitation.deserialize(response));
        }
      });
    });
  }

  resendInvitation(referenceId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = ResendInvitationRequest.fromJson({
        referenceId,
      });

      this.client.resendInvitation(request, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  cancelInvitation(referenceId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = CancelInvitationRequest.fromJson({
        referenceId,
      });

      this.client.cancelInvitation(request, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  enrichToken(
    accessToken: string,
    tokenClaims?: Record<string, unknown>,
    sessionClaims?: Record<string, unknown>,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const jsonValue: JsonValue = { accessToken };

      if (tokenClaims) {
        jsonValue.tokenClaims = tokenClaims as JsonValue;
      }

      if (sessionClaims) {
        jsonValue.sessionClaims = sessionClaims as JsonValue;
      }

      const request = EnrichTokenRequest.fromJson(jsonValue);
      this.client.enrichToken(request, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  importDigitalTwins(
    digitalTwins: ImportDigitalTwin[] | Readable,
    hashAlgorithm: HashAlgorithm,
  ): Promise<ImportResult[]> {
    if (!Array.isArray(digitalTwins)) {
      return this.importStreamedDigitalTwins(digitalTwins, hashAlgorithm);
    }

    return this.importStreamedDigitalTwins(Readable.from(digitalTwins), hashAlgorithm);
  }

  private importStreamedDigitalTwins(
    digitalTwinStream: Readable,
    hashAlgorithm: HashAlgorithm,
  ): Promise<ImportResult[]> {
    return new Promise((resolve, reject) => {
      const results: ImportResult[] = [];

      const output = streamSplitter(
        digitalTwinStream,
        this.client.importDigitalTwins.bind(this.client),
        1000,
        (chunks: unknown[]) => {
          return ImportDigitalTwinsRequest.create({
            hashAlgorithm: hashAlgorithm.marshal(),
            entities: chunks.map((chunk) => {
              if (!(chunk instanceof ImportDigitalTwin)) {
                throw new SdkError(SdkErrorCode.SDK_CODE_1, 'Incorrect stream object');
              }

              return chunk.marshal();
            }),
          });
        },
        [new IndexFixer('results.index')],
      );

      output.on('data', (res: ImportDigitalTwinsResponse) => {
        results.push(
          ...res.results
            .map((result) => ImportResult.deserialize(result))
            .filter((result): result is ImportResult => result !== null),
        );
      });

      output.on('end', () => {
        resolve(results);
      });

      output.on('error', (err) => {
        reject(err);
      });
    });
  }

  isAuthorized(
    subject: DigitalTwinCore | Property | string,
    resources: Record<'id' | 'label', string>[] = [],
    actions: string[] = [],
  ): Promise<AuthorizationDecisions> {
    return new Promise((resolve, reject) => {
      let request = IsAuthorizedRequest.create({
        subject: {
          filter: {
            oneofKind: undefined,
          },
        },
      });
      if (subject instanceof DigitalTwinCore) {
        request = IsAuthorizedRequest.create({
          subject: {
            filter: {
              oneofKind: 'digitalTwin',
              digitalTwin: subject.marshal(),
            },
          },
        });
      } else if (subject instanceof Property) {
        request = IsAuthorizedRequest.create({
          subject: {
            filter: {
              oneofKind: 'property',
              property: subject.marshal(),
            },
          },
        });
      } else {
        request = IsAuthorizedRequest.create({
          subject: {
            filter: {
              oneofKind: 'accessToken',
              accessToken: subject,
            },
          },
        });
      }
      request.resources = resources;
      request.actions = actions;

      this.client.isAuthorized(request, (err, res) => {
        if (err) reject(err);
        else if (!res) resolve(new AuthorizationDecisions({}));
        else resolve(AuthorizationDecisions.deserialize(res));
      });
    });
  }

  /**
   * This function is experimental and not implemented yet
   * @experimental
   */
  getPasswordCredential(digitalTwin: DigitalTwinCore): Promise<void> {
    const request = GetPasswordCredentialRequest.create({
      digitalTwin: digitalTwin.marshal(),
    });

    return new Promise((resolve, reject) => {
      this.client.getPasswordCredential(request, (err, response) => {
        if (err) reject(err);
        else if (!response) {
          reject(new SdkError(SdkErrorCode.SDK_CODE_1, 'Missing get password credential response'));
        } else {
          resolve();
        }
      });
    });
  }

  /**
   * This function is experimental and not implemented yet
   * @experimental
   */
  updateEmailPasswordCredential(
    email: string,
    loginProperties: Buffer[],
    locked?: boolean,
    mustChange?: boolean,
  ): Promise<void> {
    const request = UpdatePasswordCredentialRequest.create({
      loginProperties: loginProperties.map((property) => Uint8Array.from(property)),
      primary: {
        oneofKind: 'email',
        email,
      },
    });

    if (locked !== undefined) {
      request.locked = BoolValue.create({ value: locked });
    }

    if (mustChange !== undefined) {
      request.mustChange = BoolValue.create({ value: mustChange });
    }

    return new Promise((resolve, reject) => {
      this.client.updatePasswordCredential(request, (err, response) => {
        if (err) reject(err);
        else if (!response) {
          reject(
            new SdkError(SdkErrorCode.SDK_CODE_1, 'Missing update password credential response'),
          );
        } else {
          resolve();
        }
      });
    });
  }

  /**
   * This function is experimental and not implemented yet
   * @experimental
   */
  updateMobilePasswordCredential(
    mobile: string,
    loginProperties: Buffer[],
    locked?: boolean,
    mustChange?: boolean,
  ): Promise<void> {
    const request = UpdatePasswordCredentialRequest.create({
      loginProperties: loginProperties.map((property) => Uint8Array.from(property)),
      primary: {
        oneofKind: 'mobile',
        mobile,
      },
    });

    if (locked !== undefined) {
      request.locked = BoolValue.create({ value: locked });
    }

    if (mustChange !== undefined) {
      request.mustChange = BoolValue.create({ value: mustChange });
    }

    return new Promise((resolve, reject) => {
      this.client.updatePasswordCredential(request, (err, response) => {
        if (err) reject(err);
        else if (!response) {
          reject(
            new SdkError(SdkErrorCode.SDK_CODE_1, 'Missing update password credential response'),
          );
        } else {
          resolve();
        }
      });
    });
  }

  private createConsentVerifierFromInstance(consentChallenge: ConsentChallenge): Promise<{
    authorizationEndpoint: string;
    verifier: string;
  }> {
    if (consentChallenge.isDenied()) {
      const denialReason = consentChallenge.getDenialReason();
      if (denialReason) {
        return this.createConsentVerifier(consentChallenge.challenge, denialReason);
      }
    }

    return this.createConsentVerifier(
      consentChallenge.challenge,
      consentChallenge.getApprovedScopeNames(),
      consentChallenge.getApprovedAudiences(),
      consentChallenge.getSession(),
      consentChallenge.getRemember(),
      consentChallenge.getRememberFor(),
    );
  }

  private createDeniedConsentVerifier(
    consentChallenge: string,
    denialReason: ConsentChallengeDenial,
  ): Promise<{
    authorizationEndpoint: string;
    verifier: string;
  }> {
    const request = CreateOAuth2ConsentVerifierRequest.fromJson({
      consentChallenge,
    });

    request.result = {
      oneofKind: 'denial',
      denial: {
        ...denialReason,
        statusCode: denialReason.statusCode.toString(),
      },
    };

    return new Promise((resolve, reject) => {
      this.client.createOAuth2ConsentVerifier(request, (err, response) => {
        if (err) reject(err);
        else if (!response) {
          reject(new SdkError(SdkErrorCode.SDK_CODE_1, 'Missing denied consent verifier response'));
        } else {
          resolve(response);
        }
      });
    });
  }

  private createApprovedConsentVerifier(
    consentChallenge: string,
    scopes?: string[],
    audiences?: string[],
    session?: ConsentRequestSessionData,
    remember = false,
    rememberFor = '0',
  ): Promise<{
    authorizationEndpoint: string;
    verifier: string;
  }> {
    const request = CreateOAuth2ConsentVerifierRequest.fromJson({
      consentChallenge,
    });

    request.result = {
      oneofKind: 'approval',
      approval: {
        session,
        grantedAudiences: audiences ?? [],
        grantScopes: scopes ?? [],
        remember,
        rememberFor,
      },
    };

    return new Promise((resolve, reject) => {
      this.client.createOAuth2ConsentVerifier(request, (err, response) => {
        if (err) reject(err);
        else if (!response) {
          reject(
            new SdkError(SdkErrorCode.SDK_CODE_1, 'Missing approved consent verifier response'),
          );
        } else {
          resolve(response);
        }
      });
    });
  }
}
