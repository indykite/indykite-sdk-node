/* eslint-disable */
import { util, configure, Writer, Reader } from "protobufjs/minimal";
import * as Long from "long";
import {
  makeGenericClientConstructor,
  ChannelCredentials,
  ChannelOptions,
  UntypedServiceImplementation,
  handleUnaryCall,
  handleServerStreamingCall,
  Client,
  ClientUnaryCall,
  Metadata,
  CallOptions,
  ClientReadableStream,
  ServiceError,
} from "@grpc/grpc-js";
import {
  IdentityTokenInfo,
  DigitalTwin,
  DigitalEntity,
  Invitation,
  OAuth2TokenResponse,
} from "../../../indykite/identity/v1beta1/model";
import { MapValue, Value } from "../../../indykite/objects/v1beta1/struct";
import {
  DocumentMask,
  Document,
  Write,
  WriteResult,
} from "../../../indykite/identity/v1beta1/document";
import { Timestamp } from "../../../google/protobuf/timestamp";
import {
  PropertyMask,
  Property,
  PropertyBatchOperation,
  BatchOperationResult,
} from "../../../indykite/identity/v1beta1/attributes";
import { BoolValue } from "../../../google/protobuf/wrappers";

export const protobufPackage = "indykite.identity.v1beta1";

/** Identity Management Service Description. */

export enum CredentialControl {
  CREDENTIAL_CONTROL_INVALID = 0,
  CREDENTIAL_CONTROL_DISABLE = 1,
  CREDENTIAL_CONTROL_ENABLE = 2,
  CREDENTIAL_CONTROL_LOCKOUT = 3,
  /** CREDENTIAL_CONTROL_PASSWORD_CANT_CHANGE - The user can't change the password. */
  CREDENTIAL_CONTROL_PASSWORD_CANT_CHANGE = 4,
  /** CREDENTIAL_CONTROL_NORMAL_ACCOUNT - It's a default account type that represents a typical user. */
  CREDENTIAL_CONTROL_NORMAL_ACCOUNT = 5,
  /** CREDENTIAL_CONTROL_DONT_EXPIRE_PASSWORD - Represents the password, which should never expire on the account. */
  CREDENTIAL_CONTROL_DONT_EXPIRE_PASSWORD = 6,
  /** CREDENTIAL_CONTROL_PASSWORD_EXPIRED - The user's password has expired. */
  CREDENTIAL_CONTROL_PASSWORD_EXPIRED = 7,
  UNRECOGNIZED = -1,
}

export function credentialControlFromJSON(object: any): CredentialControl {
  switch (object) {
    case 0:
    case "CREDENTIAL_CONTROL_INVALID":
      return CredentialControl.CREDENTIAL_CONTROL_INVALID;
    case 1:
    case "CREDENTIAL_CONTROL_DISABLE":
      return CredentialControl.CREDENTIAL_CONTROL_DISABLE;
    case 2:
    case "CREDENTIAL_CONTROL_ENABLE":
      return CredentialControl.CREDENTIAL_CONTROL_ENABLE;
    case 3:
    case "CREDENTIAL_CONTROL_LOCKOUT":
      return CredentialControl.CREDENTIAL_CONTROL_LOCKOUT;
    case 4:
    case "CREDENTIAL_CONTROL_PASSWORD_CANT_CHANGE":
      return CredentialControl.CREDENTIAL_CONTROL_PASSWORD_CANT_CHANGE;
    case 5:
    case "CREDENTIAL_CONTROL_NORMAL_ACCOUNT":
      return CredentialControl.CREDENTIAL_CONTROL_NORMAL_ACCOUNT;
    case 6:
    case "CREDENTIAL_CONTROL_DONT_EXPIRE_PASSWORD":
      return CredentialControl.CREDENTIAL_CONTROL_DONT_EXPIRE_PASSWORD;
    case 7:
    case "CREDENTIAL_CONTROL_PASSWORD_EXPIRED":
      return CredentialControl.CREDENTIAL_CONTROL_PASSWORD_EXPIRED;
    case -1:
    case "UNRECOGNIZED":
    default:
      return CredentialControl.UNRECOGNIZED;
  }
}

export function credentialControlToJSON(object: CredentialControl): string {
  switch (object) {
    case CredentialControl.CREDENTIAL_CONTROL_INVALID:
      return "CREDENTIAL_CONTROL_INVALID";
    case CredentialControl.CREDENTIAL_CONTROL_DISABLE:
      return "CREDENTIAL_CONTROL_DISABLE";
    case CredentialControl.CREDENTIAL_CONTROL_ENABLE:
      return "CREDENTIAL_CONTROL_ENABLE";
    case CredentialControl.CREDENTIAL_CONTROL_LOCKOUT:
      return "CREDENTIAL_CONTROL_LOCKOUT";
    case CredentialControl.CREDENTIAL_CONTROL_PASSWORD_CANT_CHANGE:
      return "CREDENTIAL_CONTROL_PASSWORD_CANT_CHANGE";
    case CredentialControl.CREDENTIAL_CONTROL_NORMAL_ACCOUNT:
      return "CREDENTIAL_CONTROL_NORMAL_ACCOUNT";
    case CredentialControl.CREDENTIAL_CONTROL_DONT_EXPIRE_PASSWORD:
      return "CREDENTIAL_CONTROL_DONT_EXPIRE_PASSWORD";
    case CredentialControl.CREDENTIAL_CONTROL_PASSWORD_EXPIRED:
      return "CREDENTIAL_CONTROL_PASSWORD_EXPIRED";
    default:
      return "UNKNOWN";
  }
}

/** TokenIntrospectRequest ... */
export interface TokenIntrospectRequest {
  tenantId: Buffer;
  /**
   * The string value of the token. For access tokens, this
   * is the "access_token" value returned from the token endpoint
   * defined in OAuth 2.0. For refresh tokens, this is the "refresh_token"
   * value returned.
   */
  token: string;
}

/** TokenIntrospectResponse ... */
export interface TokenIntrospectResponse {
  active: boolean;
  /** UserInfoResponsePayload payload = 2; */
  tokenInfo?: IdentityTokenInfo;
}

export interface StartForgottenPasswordFlowRequest {
  digitalTwin?: DigitalTwin;
}

/** Empty response ?= Success */
export interface StartForgottenPasswordFlowResponse {}

/** ChangePasswordRequest ... */
export interface ChangePasswordRequest {
  uid?:
    | { $case: "token"; token: string }
    | { $case: "digitalTwin"; digitalTwin: DigitalTwin };
  password: string;
  ignorePolicy: boolean;
}

/** ChangePasswordResponse ... */
export interface ChangePasswordResponse {
  error?: Error;
}

export interface StartDigitalTwinEmailVerificationRequest {
  digitalTwin?: DigitalTwin;
  email: string;
  attributes?: MapValue;
}

export interface StartDigitalTwinEmailVerificationResponse {}

export interface VerifyDigitalTwinEmailRequest {
  token: string;
}

export interface VerifyDigitalTwinEmailResponse {
  digitalTwin?: DigitalTwin;
}

/** Once protoc-gen-grpc-gateway plugin supports enable it */
export interface SelfServiceTerminateSessionRequest {
  /** optional */
  refreshToken: string;
}

/** Empty response ?= Success */
export interface SelfServiceTerminateSessionResponse {}

export interface DigitalTwinIdentifier {
  filter?:
    | { $case: "digitalTwin"; digitalTwin: DigitalTwin }
    | { $case: "property"; property: Property }
    | { $case: "accessToken"; accessToken: string };
}

export interface GetDigitalTwinRequest {
  id?: DigitalTwinIdentifier;
  /** Properties defines the list of requested properties to get. */
  properties: PropertyMask[];
}

export interface GetDigitalTwinResponse {
  digitalTwin?: DigitalEntity;
  tokenInfo?: IdentityTokenInfo;
}

export interface ListDigitalTwinsRequest {
  tenantId: Buffer;
  /**
   * CollectionId, relative to `parent`, to list.
   * Required.
   */
  collectionId: string;
  /** PageSize is the maximum number of documents to return. */
  pageSize: number;
  /** PageToken is the `next_page_token` value returned from a previous List request. */
  pageToken: string;
  /** OrderBy to sort results by. For example: `priority desc, name`. */
  orderBy: string;
  /** Properties contains the requested property values. */
  properties: Property[];
}

export interface ListDigitalTwinsResponse {
  digitalTwin: DigitalEntity[];
  /** NextPageToken is `page_token` value for the next ListDocumentsRequest. */
  nextPageToken: string;
}

export interface PatchDigitalTwinRequest {
  id?: DigitalTwinIdentifier;
  operations: PropertyBatchOperation[];
  /** AdminToken must be set when id contains only the DigitalTwin. */
  adminToken: string;
  /** ForceDelete must be set to true to delete primary property */
  forceDelete: boolean;
}

export interface PatchDigitalTwinResponse {
  result: BatchOperationResult[];
}

export interface DeleteDigitalTwinRequest {
  id?: DigitalTwinIdentifier;
  /** AdminToken must be set when id contains only the DigitalTwin. */
  adminToken: string;
}

export interface DeleteDigitalTwinResponse {
  digitalTwin?: DigitalTwin;
}

/** GetDocumentRequest ... */
export interface GetDocumentRequest {
  /**
   * Name of the document resource.
   * Format: `databases/{application_id}/documents/{document_path}`.
   * Format: `databases/{application_id}/documents/plans/free`.
   */
  name: string;
  /** Mask is the fields to return. If not set, returns all fields. */
  mask?: DocumentMask;
}

/** GetDocumentResponse ... */
export interface GetDocumentResponse {
  /** Document is the result of the get. */
  document?: Document;
}

/** BatchGetDocumentsRequest ... */
export interface BatchGetDocumentsRequest {
  /**
   * Database is the name of the database.
   * Format: `databases/{application_id}`.
   */
  database: string;
  /**
   * Documents is the names of the documents to retrieve.
   * Format: `databases/{application_id}/documents/{document_path}`.
   */
  documents: string[];
  /** Mask is the fields to return. If not set, returns all fields. */
  mask?: DocumentMask;
}

/** BatchGetDocumentsResponse ... */
export interface BatchGetDocumentsResponse {
  result?:
    | { $case: "found"; found: Document }
    | { $case: "missing"; missing: string };
}

/** ListDocumentsRequest .. */
export interface ListDocumentsRequest {
  /**
   * Parent resource name to resolve the collection.
   * Format: `databases/{application_id}/documents/{document_path}`.
   * Required.
   */
  parent: string;
  /**
   * CollectionId, relative to `parent`, to list.
   * Required.
   */
  collectionId: string;
  /** PageSize is the maximum number of documents to return. */
  pageSize: number;
  /** PageToken is the `next_page_token` value returned from a previous List request. */
  pageToken: string;
  /** OrderBy to sort results by. For example: `priority desc, name`. */
  orderBy: string;
  /** Mask is the fields to return. If not set, returns all fields. */
  mask?: DocumentMask;
}

/** ListDocumentsResponse ... */
export interface ListDocumentsResponse {
  /** The Documents found. */
  documents: Document[];
  /** NextPageToken is `page_token` value for the next ListDocumentsRequest. */
  nextPageToken: string;
}

/** MutateDocumentsRequest ... */
export interface MutateDocumentsRequest {
  /**
   * The database name.
   * Format: `databases/{application_id}`.
   * Required.
   */
  database: string;
  /** The writes to apply. */
  writes: Write[];
}

/** MutateDocumentsResponse ... */
export interface MutateDocumentsResponse {
  /**
   * WriteResults is the result of applying the writes.
   *
   * This i-th write result corresponds to the i-th write in the
   * request.
   */
  writeResults: WriteResult[];
}

/** RunQueryRequest ... NOT YET SUPPORTED! */
export interface RunQueryRequest {
  /**
   * Parent resource name to resolve the collection.
   * Format: `databases/{application_id}/documents/{document_path}`.
   * Required.
   */
  parent: string;
  queryType?: { $case: "structuredQuery"; structuredQuery: Value };
}

/** RunQueryResponse ... NOT YET SUPPORTED! */
export interface RunQueryResponse {
  /** A query result. */
  document?: Document;
  /**
   * SkippedResults is the number of results that have been skipped due to an offset between
   * the last response and the current response.
   */
  skippedResults: number;
}

export interface GetPasswordCredentialRequest {
  digitalTwin?: DigitalTwin;
}

export interface GetPasswordCredentialResponse {}

export interface PasswordCredentialOld {
  tenant: string;
  uuid: string;
  expiresAt: string;
  /** 8 bit flags */
  flagBit1: boolean;
  /** 8 bit flags; */
  flagBit2: boolean;
  /** 8 bit flags; */
  flagBit3: boolean;
  /** 8 bit flags; */
  flagBit4: boolean;
  /** 8 bit flags; */
  flagBit5: boolean;
  /** 8 bit flags; */
  flagBit6: boolean;
  /** 8 bit flags; */
  flagBit7: boolean;
  /** 8 bit flags; */
  flagBit8: boolean;
  controls: CredentialControl[];
}

/** UpdatePasswordCredentialRequest used to change the Password Credential meta-data. */
export interface UpdatePasswordCredentialRequest {
  /**
   * The username used to login.
   * google.protobuf.StringValue login = 1;
   */
  loginProperties: Buffer[];
  mustChange?: boolean;
  locked?: boolean;
  primary?:
    | { $case: "email"; email: string }
    | { $case: "mobile"; mobile: string };
}

export interface UpdatePasswordCredentialResponse {}

export interface Error {
  /**
   * Invalid Authorization
   * Password Policy Violation
   * Password Can't be changed
   * Unknown UID
   * UID has no Password Credential
   */
  code: string;
}

export interface SelfServiceChangePasswordRequest {
  password: string;
}

export interface SelfServiceChangePasswordResponse {
  success: boolean;
  /** Password policy violation */
  error: string;
}

/** CreateInvitationRequest ... */
export interface CreateInvitationRequest {
  tenantId: Buffer;
  /** External reference identifier to correlate the lifecycle events with. */
  referenceId: string;
  /** Human readable name of invitee. */
  displayName: string;
  attributes?: MapValue;
  createTime?: Date;
  expireTime?: Date;
  invitee?:
    | { $case: "email"; email: string }
    | { $case: "mobile"; mobile: string };
}

/** CreateInvitationResponse ... */
export interface CreateInvitationResponse {
  invitation?: Invitation;
  invitationKey: string;
}

export interface CheckConsentChallengeRequest {
  challenge: string;
}

export interface CheckConsentChallengeResponse {
  clientId: string;
  appSpaceId: Buffer;
  audiences: AudienceItem[];
  scopes: ScopeItem[];
  /**
   * ACR represents the Authentication AuthorizationContext Class Reference value for this authentication session. You can use it
   * to express that, for example, a user authenticated using two factor authentication.
   */
  acrs: string[];
  /**
   * RequestURL is the original OAuth 2.0 Authorization URL requested by the OAuth 2.0 client. It is the URL which
   * initiates the OAuth 2.0 Authorization Code or OAuth 2.0 Implicit flow. This URL is typically not needed, but
   * might come in handy if you want to deal with additional request parameters.
   */
  requestUrl: string;
  /**
   * Skip, if true, implies that the client has requested the same scopes from the same user previously.
   * If true, you must not ask the user to grant the requested scopes. You must however either allow or deny the
   * consent request using the usual API call.
   */
  skip: boolean;
  digitalTwin?: DigitalTwin;
  /** SubjectIdentifier is pairwise identifier as the sub claims in the token */
  subjectIdentifier: string;
  authenticatedAt?: Date;
  requestedAt?: Date;
  /**
   * Context is an optional object which can hold arbitrary data. The data will be made available when fetching the
   * consent request under the "context" field. This is useful in scenarios where login and consent endpoints share
   * data.
   */
  context?: MapValue;
}

export interface ScopeItem {
  name: string;
  displayName: string;
  description: string;
  required: boolean;
}

export interface AudienceItem {
  userSupportEmailAddress: string;
  clientId: string;
  displayName: string;
  description: string;
  logoUrl: string;
  homepageUrl: string;
  privacyPolicyUrl: string;
  tosUrl: string;
}

export interface CreateConsentVerifierRequest {
  challenge: string;
  result?:
    | { $case: "approval"; approval: ConsentApproval }
    | { $case: "denial"; denial: DenialResponse };
}

export interface CreateConsentVerifierResponse {
  verifier: string;
  authorizationEndpoint: string;
}

export interface ConsentApproval {
  /** GrantScopes sets the scope the user authorized the client to use. Should be a subset of `requested_scope`. */
  grantScopes: string[];
  /** GrantedAudiences sets the audience the user authorized the client to use. Should be a subset of `audiences`. */
  grantedAudiences: string[];
  /** Session allows you to set (optional) session data for access and ID tokens. */
  session?: ConsentRequestSessionData;
  /**
   * Remember, if set to true, tells ORY Hydra to remember this consent authorization and reuse it if the same
   * client asks the same user for the same, or a subset of, scope.
   */
  remember: boolean;
  /**
   * RememberFor sets how long the consent authorization should be remembered for in seconds. If set to `0`, the
   * authorization will be remembered indefinitely.
   */
  rememberFor: string;
}

/** Used to pass session data to a consent request. */
export interface ConsentRequestSessionData {
  /**
   * AccessToken sets session data for the access and refresh token, as well as any future tokens issued by the
   * refresh grant. Keep in mind that this data will be available to anyone performing OAuth 2.0 Challenge Introspection.
   * If only your services can perform OAuth 2.0 Challenge Introspection, this is usually fine. But if third parties
   * can access that endpoint as well, sensitive data from the session might be exposed to them. Use with care!
   */
  accessToken?: MapValue;
  /**
   * IDToken sets session data for the OpenID Connect ID token. Keep in mind that the session'id payloads are readable
   * by anyone that has access to the ID Challenge. Use with care!
   */
  idToken?: MapValue;
  userinfo?: MapValue;
}

/** The request payload used to accept a login or consent request. */
export interface DenialResponse {
  /**
   * The error should follow the OAuth2 error format (e.g. `invalid_request`, `login_required`).
   * See [https://datatracker.ietf.org/doc/html/rfc6749#section-4.1.2.1](full specification)
   * Defaults to `access_denied`.
   */
  error: string;
  /** Description of the error in a human readable format. */
  errorDescription: string;
  /** Hint to help resolve the error. */
  errorHint: string;
  /**
   * Represents the HTTP status code of the error (e.g. 401 or 403)
   *
   * Defaults to 403
   */
  statusCode: string;
}

/** ExternalAccessTokenRequest ... */
export interface GetAccessTokenRequest {
  /** Client Application Identifier. Set by the server from the authenticated client. */
  appId: string;
  /** Identity Provider configuration unique id - overrules type + name. */
  providerId: string;
  /**
   * Identity Provider type.
   * id.indykite.jarvis.services.configuration.OAuth2ProviderType provider = 3;
   * Identity Provider configuration  name.
   */
  providerName: string;
  /** Digital Twin / Subject ID (Optional). If not provided authentication flow triggered. */
  subjectId: string;
  /** Requested scopes */
  scopes: string[];
  /** If true a refresh_token is requested and stored so next time authentication is not requested. */
  offlineAccess: boolean;
}

/** ExternalAccessTokenResponse ... */
export interface GetAccessTokenResponse {
  /** The active access token */
  token?: OAuth2TokenResponse;
}

/** TokenIntrospectRequest ... */
export interface SessionIntrospectRequest {
  tenantId: Buffer;
  /**
   * The string value of the token. For access tokens, this
   * is the "access_token" value returned from the token endpoint
   * defined in OAuth 2.0. For refresh tokens, this is the "refresh_token"
   * value returned.
   */
  token: string;
}

/** TokenIntrospectResponse ... */
export interface SessionIntrospectResponse {
  active: boolean;
  /** UserInfoResponsePayload payload = 2; */
  tokenInfo?: IdentityTokenInfo;
  providerData: string[];
}

const baseTokenIntrospectRequest: object = { token: "" };

export const TokenIntrospectRequest = {
  encode(
    message: TokenIntrospectRequest,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.tenantId.length !== 0) {
      writer.uint32(10).bytes(message.tenantId);
    }
    if (message.token !== "") {
      writer.uint32(18).string(message.token);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): TokenIntrospectRequest {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseTokenIntrospectRequest } as TokenIntrospectRequest;
    message.tenantId = Buffer.alloc(0);
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.tenantId = reader.bytes() as Buffer;
          break;
        case 2:
          message.token = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): TokenIntrospectRequest {
    const message = { ...baseTokenIntrospectRequest } as TokenIntrospectRequest;
    message.tenantId = Buffer.alloc(0);
    if (object.tenantId !== undefined && object.tenantId !== null) {
      message.tenantId = Buffer.from(bytesFromBase64(object.tenantId));
    }
    if (object.token !== undefined && object.token !== null) {
      message.token = String(object.token);
    }
    return message;
  },

  toJSON(message: TokenIntrospectRequest): unknown {
    const obj: any = {};
    message.tenantId !== undefined &&
      (obj.tenantId = base64FromBytes(
        message.tenantId !== undefined ? message.tenantId : Buffer.alloc(0)
      ));
    message.token !== undefined && (obj.token = message.token);
    return obj;
  },

  fromPartial(
    object: DeepPartial<TokenIntrospectRequest>
  ): TokenIntrospectRequest {
    const message = { ...baseTokenIntrospectRequest } as TokenIntrospectRequest;
    if (object.tenantId !== undefined && object.tenantId !== null) {
      message.tenantId = object.tenantId;
    }
    if (object.token !== undefined && object.token !== null) {
      message.token = object.token;
    }
    return message;
  },
};

const baseTokenIntrospectResponse: object = { active: false };

export const TokenIntrospectResponse = {
  encode(
    message: TokenIntrospectResponse,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.active === true) {
      writer.uint32(8).bool(message.active);
    }
    if (message.tokenInfo !== undefined) {
      IdentityTokenInfo.encode(
        message.tokenInfo,
        writer.uint32(18).fork()
      ).ldelim();
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): TokenIntrospectResponse {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseTokenIntrospectResponse,
    } as TokenIntrospectResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.active = reader.bool();
          break;
        case 2:
          message.tokenInfo = IdentityTokenInfo.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): TokenIntrospectResponse {
    const message = {
      ...baseTokenIntrospectResponse,
    } as TokenIntrospectResponse;
    if (object.active !== undefined && object.active !== null) {
      message.active = Boolean(object.active);
    }
    if (object.tokenInfo !== undefined && object.tokenInfo !== null) {
      message.tokenInfo = IdentityTokenInfo.fromJSON(object.tokenInfo);
    }
    return message;
  },

  toJSON(message: TokenIntrospectResponse): unknown {
    const obj: any = {};
    message.active !== undefined && (obj.active = message.active);
    message.tokenInfo !== undefined &&
      (obj.tokenInfo = message.tokenInfo
        ? IdentityTokenInfo.toJSON(message.tokenInfo)
        : undefined);
    return obj;
  },

  fromPartial(
    object: DeepPartial<TokenIntrospectResponse>
  ): TokenIntrospectResponse {
    const message = {
      ...baseTokenIntrospectResponse,
    } as TokenIntrospectResponse;
    if (object.active !== undefined && object.active !== null) {
      message.active = object.active;
    }
    if (object.tokenInfo !== undefined && object.tokenInfo !== null) {
      message.tokenInfo = IdentityTokenInfo.fromPartial(object.tokenInfo);
    }
    return message;
  },
};

const baseStartForgottenPasswordFlowRequest: object = {};

export const StartForgottenPasswordFlowRequest = {
  encode(
    message: StartForgottenPasswordFlowRequest,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.digitalTwin !== undefined) {
      DigitalTwin.encode(
        message.digitalTwin,
        writer.uint32(10).fork()
      ).ldelim();
    }
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): StartForgottenPasswordFlowRequest {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseStartForgottenPasswordFlowRequest,
    } as StartForgottenPasswordFlowRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.digitalTwin = DigitalTwin.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): StartForgottenPasswordFlowRequest {
    const message = {
      ...baseStartForgottenPasswordFlowRequest,
    } as StartForgottenPasswordFlowRequest;
    if (object.digitalTwin !== undefined && object.digitalTwin !== null) {
      message.digitalTwin = DigitalTwin.fromJSON(object.digitalTwin);
    }
    return message;
  },

  toJSON(message: StartForgottenPasswordFlowRequest): unknown {
    const obj: any = {};
    message.digitalTwin !== undefined &&
      (obj.digitalTwin = message.digitalTwin
        ? DigitalTwin.toJSON(message.digitalTwin)
        : undefined);
    return obj;
  },

  fromPartial(
    object: DeepPartial<StartForgottenPasswordFlowRequest>
  ): StartForgottenPasswordFlowRequest {
    const message = {
      ...baseStartForgottenPasswordFlowRequest,
    } as StartForgottenPasswordFlowRequest;
    if (object.digitalTwin !== undefined && object.digitalTwin !== null) {
      message.digitalTwin = DigitalTwin.fromPartial(object.digitalTwin);
    }
    return message;
  },
};

const baseStartForgottenPasswordFlowResponse: object = {};

export const StartForgottenPasswordFlowResponse = {
  encode(
    _: StartForgottenPasswordFlowResponse,
    writer: Writer = Writer.create()
  ): Writer {
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): StartForgottenPasswordFlowResponse {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseStartForgottenPasswordFlowResponse,
    } as StartForgottenPasswordFlowResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(_: any): StartForgottenPasswordFlowResponse {
    const message = {
      ...baseStartForgottenPasswordFlowResponse,
    } as StartForgottenPasswordFlowResponse;
    return message;
  },

  toJSON(_: StartForgottenPasswordFlowResponse): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial(
    _: DeepPartial<StartForgottenPasswordFlowResponse>
  ): StartForgottenPasswordFlowResponse {
    const message = {
      ...baseStartForgottenPasswordFlowResponse,
    } as StartForgottenPasswordFlowResponse;
    return message;
  },
};

const baseChangePasswordRequest: object = { password: "", ignorePolicy: false };

export const ChangePasswordRequest = {
  encode(
    message: ChangePasswordRequest,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.uid?.$case === "token") {
      writer.uint32(10).string(message.uid.token);
    }
    if (message.uid?.$case === "digitalTwin") {
      DigitalTwin.encode(
        message.uid.digitalTwin,
        writer.uint32(18).fork()
      ).ldelim();
    }
    if (message.password !== "") {
      writer.uint32(26).string(message.password);
    }
    if (message.ignorePolicy === true) {
      writer.uint32(32).bool(message.ignorePolicy);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): ChangePasswordRequest {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseChangePasswordRequest } as ChangePasswordRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.uid = { $case: "token", token: reader.string() };
          break;
        case 2:
          message.uid = {
            $case: "digitalTwin",
            digitalTwin: DigitalTwin.decode(reader, reader.uint32()),
          };
          break;
        case 3:
          message.password = reader.string();
          break;
        case 4:
          message.ignorePolicy = reader.bool();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ChangePasswordRequest {
    const message = { ...baseChangePasswordRequest } as ChangePasswordRequest;
    if (object.token !== undefined && object.token !== null) {
      message.uid = { $case: "token", token: String(object.token) };
    }
    if (object.digitalTwin !== undefined && object.digitalTwin !== null) {
      message.uid = {
        $case: "digitalTwin",
        digitalTwin: DigitalTwin.fromJSON(object.digitalTwin),
      };
    }
    if (object.password !== undefined && object.password !== null) {
      message.password = String(object.password);
    }
    if (object.ignorePolicy !== undefined && object.ignorePolicy !== null) {
      message.ignorePolicy = Boolean(object.ignorePolicy);
    }
    return message;
  },

  toJSON(message: ChangePasswordRequest): unknown {
    const obj: any = {};
    message.uid?.$case === "token" && (obj.token = message.uid?.token);
    message.uid?.$case === "digitalTwin" &&
      (obj.digitalTwin = message.uid?.digitalTwin
        ? DigitalTwin.toJSON(message.uid?.digitalTwin)
        : undefined);
    message.password !== undefined && (obj.password = message.password);
    message.ignorePolicy !== undefined &&
      (obj.ignorePolicy = message.ignorePolicy);
    return obj;
  },

  fromPartial(
    object: DeepPartial<ChangePasswordRequest>
  ): ChangePasswordRequest {
    const message = { ...baseChangePasswordRequest } as ChangePasswordRequest;
    if (
      object.uid?.$case === "token" &&
      object.uid?.token !== undefined &&
      object.uid?.token !== null
    ) {
      message.uid = { $case: "token", token: object.uid.token };
    }
    if (
      object.uid?.$case === "digitalTwin" &&
      object.uid?.digitalTwin !== undefined &&
      object.uid?.digitalTwin !== null
    ) {
      message.uid = {
        $case: "digitalTwin",
        digitalTwin: DigitalTwin.fromPartial(object.uid.digitalTwin),
      };
    }
    if (object.password !== undefined && object.password !== null) {
      message.password = object.password;
    }
    if (object.ignorePolicy !== undefined && object.ignorePolicy !== null) {
      message.ignorePolicy = object.ignorePolicy;
    }
    return message;
  },
};

const baseChangePasswordResponse: object = {};

export const ChangePasswordResponse = {
  encode(
    message: ChangePasswordResponse,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.error !== undefined) {
      Error.encode(message.error, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): ChangePasswordResponse {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseChangePasswordResponse } as ChangePasswordResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.error = Error.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ChangePasswordResponse {
    const message = { ...baseChangePasswordResponse } as ChangePasswordResponse;
    if (object.error !== undefined && object.error !== null) {
      message.error = Error.fromJSON(object.error);
    }
    return message;
  },

  toJSON(message: ChangePasswordResponse): unknown {
    const obj: any = {};
    message.error !== undefined &&
      (obj.error = message.error ? Error.toJSON(message.error) : undefined);
    return obj;
  },

  fromPartial(
    object: DeepPartial<ChangePasswordResponse>
  ): ChangePasswordResponse {
    const message = { ...baseChangePasswordResponse } as ChangePasswordResponse;
    if (object.error !== undefined && object.error !== null) {
      message.error = Error.fromPartial(object.error);
    }
    return message;
  },
};

const baseStartDigitalTwinEmailVerificationRequest: object = { email: "" };

export const StartDigitalTwinEmailVerificationRequest = {
  encode(
    message: StartDigitalTwinEmailVerificationRequest,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.digitalTwin !== undefined) {
      DigitalTwin.encode(
        message.digitalTwin,
        writer.uint32(10).fork()
      ).ldelim();
    }
    if (message.email !== "") {
      writer.uint32(18).string(message.email);
    }
    if (message.attributes !== undefined) {
      MapValue.encode(message.attributes, writer.uint32(58).fork()).ldelim();
    }
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): StartDigitalTwinEmailVerificationRequest {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseStartDigitalTwinEmailVerificationRequest,
    } as StartDigitalTwinEmailVerificationRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.digitalTwin = DigitalTwin.decode(reader, reader.uint32());
          break;
        case 2:
          message.email = reader.string();
          break;
        case 7:
          message.attributes = MapValue.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): StartDigitalTwinEmailVerificationRequest {
    const message = {
      ...baseStartDigitalTwinEmailVerificationRequest,
    } as StartDigitalTwinEmailVerificationRequest;
    if (object.digitalTwin !== undefined && object.digitalTwin !== null) {
      message.digitalTwin = DigitalTwin.fromJSON(object.digitalTwin);
    }
    if (object.email !== undefined && object.email !== null) {
      message.email = String(object.email);
    }
    if (object.attributes !== undefined && object.attributes !== null) {
      message.attributes = MapValue.fromJSON(object.attributes);
    }
    return message;
  },

  toJSON(message: StartDigitalTwinEmailVerificationRequest): unknown {
    const obj: any = {};
    message.digitalTwin !== undefined &&
      (obj.digitalTwin = message.digitalTwin
        ? DigitalTwin.toJSON(message.digitalTwin)
        : undefined);
    message.email !== undefined && (obj.email = message.email);
    message.attributes !== undefined &&
      (obj.attributes = message.attributes
        ? MapValue.toJSON(message.attributes)
        : undefined);
    return obj;
  },

  fromPartial(
    object: DeepPartial<StartDigitalTwinEmailVerificationRequest>
  ): StartDigitalTwinEmailVerificationRequest {
    const message = {
      ...baseStartDigitalTwinEmailVerificationRequest,
    } as StartDigitalTwinEmailVerificationRequest;
    if (object.digitalTwin !== undefined && object.digitalTwin !== null) {
      message.digitalTwin = DigitalTwin.fromPartial(object.digitalTwin);
    }
    if (object.email !== undefined && object.email !== null) {
      message.email = object.email;
    }
    if (object.attributes !== undefined && object.attributes !== null) {
      message.attributes = MapValue.fromPartial(object.attributes);
    }
    return message;
  },
};

const baseStartDigitalTwinEmailVerificationResponse: object = {};

export const StartDigitalTwinEmailVerificationResponse = {
  encode(
    _: StartDigitalTwinEmailVerificationResponse,
    writer: Writer = Writer.create()
  ): Writer {
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): StartDigitalTwinEmailVerificationResponse {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseStartDigitalTwinEmailVerificationResponse,
    } as StartDigitalTwinEmailVerificationResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(_: any): StartDigitalTwinEmailVerificationResponse {
    const message = {
      ...baseStartDigitalTwinEmailVerificationResponse,
    } as StartDigitalTwinEmailVerificationResponse;
    return message;
  },

  toJSON(_: StartDigitalTwinEmailVerificationResponse): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial(
    _: DeepPartial<StartDigitalTwinEmailVerificationResponse>
  ): StartDigitalTwinEmailVerificationResponse {
    const message = {
      ...baseStartDigitalTwinEmailVerificationResponse,
    } as StartDigitalTwinEmailVerificationResponse;
    return message;
  },
};

const baseVerifyDigitalTwinEmailRequest: object = { token: "" };

export const VerifyDigitalTwinEmailRequest = {
  encode(
    message: VerifyDigitalTwinEmailRequest,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.token !== "") {
      writer.uint32(10).string(message.token);
    }
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): VerifyDigitalTwinEmailRequest {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseVerifyDigitalTwinEmailRequest,
    } as VerifyDigitalTwinEmailRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.token = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): VerifyDigitalTwinEmailRequest {
    const message = {
      ...baseVerifyDigitalTwinEmailRequest,
    } as VerifyDigitalTwinEmailRequest;
    if (object.token !== undefined && object.token !== null) {
      message.token = String(object.token);
    }
    return message;
  },

  toJSON(message: VerifyDigitalTwinEmailRequest): unknown {
    const obj: any = {};
    message.token !== undefined && (obj.token = message.token);
    return obj;
  },

  fromPartial(
    object: DeepPartial<VerifyDigitalTwinEmailRequest>
  ): VerifyDigitalTwinEmailRequest {
    const message = {
      ...baseVerifyDigitalTwinEmailRequest,
    } as VerifyDigitalTwinEmailRequest;
    if (object.token !== undefined && object.token !== null) {
      message.token = object.token;
    }
    return message;
  },
};

const baseVerifyDigitalTwinEmailResponse: object = {};

export const VerifyDigitalTwinEmailResponse = {
  encode(
    message: VerifyDigitalTwinEmailResponse,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.digitalTwin !== undefined) {
      DigitalTwin.encode(
        message.digitalTwin,
        writer.uint32(10).fork()
      ).ldelim();
    }
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): VerifyDigitalTwinEmailResponse {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseVerifyDigitalTwinEmailResponse,
    } as VerifyDigitalTwinEmailResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.digitalTwin = DigitalTwin.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): VerifyDigitalTwinEmailResponse {
    const message = {
      ...baseVerifyDigitalTwinEmailResponse,
    } as VerifyDigitalTwinEmailResponse;
    if (object.digitalTwin !== undefined && object.digitalTwin !== null) {
      message.digitalTwin = DigitalTwin.fromJSON(object.digitalTwin);
    }
    return message;
  },

  toJSON(message: VerifyDigitalTwinEmailResponse): unknown {
    const obj: any = {};
    message.digitalTwin !== undefined &&
      (obj.digitalTwin = message.digitalTwin
        ? DigitalTwin.toJSON(message.digitalTwin)
        : undefined);
    return obj;
  },

  fromPartial(
    object: DeepPartial<VerifyDigitalTwinEmailResponse>
  ): VerifyDigitalTwinEmailResponse {
    const message = {
      ...baseVerifyDigitalTwinEmailResponse,
    } as VerifyDigitalTwinEmailResponse;
    if (object.digitalTwin !== undefined && object.digitalTwin !== null) {
      message.digitalTwin = DigitalTwin.fromPartial(object.digitalTwin);
    }
    return message;
  },
};

const baseSelfServiceTerminateSessionRequest: object = { refreshToken: "" };

export const SelfServiceTerminateSessionRequest = {
  encode(
    message: SelfServiceTerminateSessionRequest,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.refreshToken !== "") {
      writer.uint32(10).string(message.refreshToken);
    }
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): SelfServiceTerminateSessionRequest {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseSelfServiceTerminateSessionRequest,
    } as SelfServiceTerminateSessionRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.refreshToken = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): SelfServiceTerminateSessionRequest {
    const message = {
      ...baseSelfServiceTerminateSessionRequest,
    } as SelfServiceTerminateSessionRequest;
    if (object.refreshToken !== undefined && object.refreshToken !== null) {
      message.refreshToken = String(object.refreshToken);
    }
    return message;
  },

  toJSON(message: SelfServiceTerminateSessionRequest): unknown {
    const obj: any = {};
    message.refreshToken !== undefined &&
      (obj.refreshToken = message.refreshToken);
    return obj;
  },

  fromPartial(
    object: DeepPartial<SelfServiceTerminateSessionRequest>
  ): SelfServiceTerminateSessionRequest {
    const message = {
      ...baseSelfServiceTerminateSessionRequest,
    } as SelfServiceTerminateSessionRequest;
    if (object.refreshToken !== undefined && object.refreshToken !== null) {
      message.refreshToken = object.refreshToken;
    }
    return message;
  },
};

const baseSelfServiceTerminateSessionResponse: object = {};

export const SelfServiceTerminateSessionResponse = {
  encode(
    _: SelfServiceTerminateSessionResponse,
    writer: Writer = Writer.create()
  ): Writer {
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): SelfServiceTerminateSessionResponse {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseSelfServiceTerminateSessionResponse,
    } as SelfServiceTerminateSessionResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(_: any): SelfServiceTerminateSessionResponse {
    const message = {
      ...baseSelfServiceTerminateSessionResponse,
    } as SelfServiceTerminateSessionResponse;
    return message;
  },

  toJSON(_: SelfServiceTerminateSessionResponse): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial(
    _: DeepPartial<SelfServiceTerminateSessionResponse>
  ): SelfServiceTerminateSessionResponse {
    const message = {
      ...baseSelfServiceTerminateSessionResponse,
    } as SelfServiceTerminateSessionResponse;
    return message;
  },
};

const baseDigitalTwinIdentifier: object = {};

export const DigitalTwinIdentifier = {
  encode(
    message: DigitalTwinIdentifier,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.filter?.$case === "digitalTwin") {
      DigitalTwin.encode(
        message.filter.digitalTwin,
        writer.uint32(10).fork()
      ).ldelim();
    }
    if (message.filter?.$case === "property") {
      Property.encode(
        message.filter.property,
        writer.uint32(18).fork()
      ).ldelim();
    }
    if (message.filter?.$case === "accessToken") {
      writer.uint32(26).string(message.filter.accessToken);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): DigitalTwinIdentifier {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseDigitalTwinIdentifier } as DigitalTwinIdentifier;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.filter = {
            $case: "digitalTwin",
            digitalTwin: DigitalTwin.decode(reader, reader.uint32()),
          };
          break;
        case 2:
          message.filter = {
            $case: "property",
            property: Property.decode(reader, reader.uint32()),
          };
          break;
        case 3:
          message.filter = {
            $case: "accessToken",
            accessToken: reader.string(),
          };
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): DigitalTwinIdentifier {
    const message = { ...baseDigitalTwinIdentifier } as DigitalTwinIdentifier;
    if (object.digitalTwin !== undefined && object.digitalTwin !== null) {
      message.filter = {
        $case: "digitalTwin",
        digitalTwin: DigitalTwin.fromJSON(object.digitalTwin),
      };
    }
    if (object.property !== undefined && object.property !== null) {
      message.filter = {
        $case: "property",
        property: Property.fromJSON(object.property),
      };
    }
    if (object.accessToken !== undefined && object.accessToken !== null) {
      message.filter = {
        $case: "accessToken",
        accessToken: String(object.accessToken),
      };
    }
    return message;
  },

  toJSON(message: DigitalTwinIdentifier): unknown {
    const obj: any = {};
    message.filter?.$case === "digitalTwin" &&
      (obj.digitalTwin = message.filter?.digitalTwin
        ? DigitalTwin.toJSON(message.filter?.digitalTwin)
        : undefined);
    message.filter?.$case === "property" &&
      (obj.property = message.filter?.property
        ? Property.toJSON(message.filter?.property)
        : undefined);
    message.filter?.$case === "accessToken" &&
      (obj.accessToken = message.filter?.accessToken);
    return obj;
  },

  fromPartial(
    object: DeepPartial<DigitalTwinIdentifier>
  ): DigitalTwinIdentifier {
    const message = { ...baseDigitalTwinIdentifier } as DigitalTwinIdentifier;
    if (
      object.filter?.$case === "digitalTwin" &&
      object.filter?.digitalTwin !== undefined &&
      object.filter?.digitalTwin !== null
    ) {
      message.filter = {
        $case: "digitalTwin",
        digitalTwin: DigitalTwin.fromPartial(object.filter.digitalTwin),
      };
    }
    if (
      object.filter?.$case === "property" &&
      object.filter?.property !== undefined &&
      object.filter?.property !== null
    ) {
      message.filter = {
        $case: "property",
        property: Property.fromPartial(object.filter.property),
      };
    }
    if (
      object.filter?.$case === "accessToken" &&
      object.filter?.accessToken !== undefined &&
      object.filter?.accessToken !== null
    ) {
      message.filter = {
        $case: "accessToken",
        accessToken: object.filter.accessToken,
      };
    }
    return message;
  },
};

const baseGetDigitalTwinRequest: object = {};

export const GetDigitalTwinRequest = {
  encode(
    message: GetDigitalTwinRequest,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.id !== undefined) {
      DigitalTwinIdentifier.encode(
        message.id,
        writer.uint32(10).fork()
      ).ldelim();
    }
    for (const v of message.properties) {
      PropertyMask.encode(v!, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): GetDigitalTwinRequest {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseGetDigitalTwinRequest } as GetDigitalTwinRequest;
    message.properties = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = DigitalTwinIdentifier.decode(reader, reader.uint32());
          break;
        case 2:
          message.properties.push(PropertyMask.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetDigitalTwinRequest {
    const message = { ...baseGetDigitalTwinRequest } as GetDigitalTwinRequest;
    message.properties = [];
    if (object.id !== undefined && object.id !== null) {
      message.id = DigitalTwinIdentifier.fromJSON(object.id);
    }
    if (object.properties !== undefined && object.properties !== null) {
      for (const e of object.properties) {
        message.properties.push(PropertyMask.fromJSON(e));
      }
    }
    return message;
  },

  toJSON(message: GetDigitalTwinRequest): unknown {
    const obj: any = {};
    message.id !== undefined &&
      (obj.id = message.id
        ? DigitalTwinIdentifier.toJSON(message.id)
        : undefined);
    if (message.properties) {
      obj.properties = message.properties.map((e) =>
        e ? PropertyMask.toJSON(e) : undefined
      );
    } else {
      obj.properties = [];
    }
    return obj;
  },

  fromPartial(
    object: DeepPartial<GetDigitalTwinRequest>
  ): GetDigitalTwinRequest {
    const message = { ...baseGetDigitalTwinRequest } as GetDigitalTwinRequest;
    message.properties = [];
    if (object.id !== undefined && object.id !== null) {
      message.id = DigitalTwinIdentifier.fromPartial(object.id);
    }
    if (object.properties !== undefined && object.properties !== null) {
      for (const e of object.properties) {
        message.properties.push(PropertyMask.fromPartial(e));
      }
    }
    return message;
  },
};

const baseGetDigitalTwinResponse: object = {};

export const GetDigitalTwinResponse = {
  encode(
    message: GetDigitalTwinResponse,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.digitalTwin !== undefined) {
      DigitalEntity.encode(
        message.digitalTwin,
        writer.uint32(10).fork()
      ).ldelim();
    }
    if (message.tokenInfo !== undefined) {
      IdentityTokenInfo.encode(
        message.tokenInfo,
        writer.uint32(18).fork()
      ).ldelim();
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): GetDigitalTwinResponse {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseGetDigitalTwinResponse } as GetDigitalTwinResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.digitalTwin = DigitalEntity.decode(reader, reader.uint32());
          break;
        case 2:
          message.tokenInfo = IdentityTokenInfo.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetDigitalTwinResponse {
    const message = { ...baseGetDigitalTwinResponse } as GetDigitalTwinResponse;
    if (object.digitalTwin !== undefined && object.digitalTwin !== null) {
      message.digitalTwin = DigitalEntity.fromJSON(object.digitalTwin);
    }
    if (object.tokenInfo !== undefined && object.tokenInfo !== null) {
      message.tokenInfo = IdentityTokenInfo.fromJSON(object.tokenInfo);
    }
    return message;
  },

  toJSON(message: GetDigitalTwinResponse): unknown {
    const obj: any = {};
    message.digitalTwin !== undefined &&
      (obj.digitalTwin = message.digitalTwin
        ? DigitalEntity.toJSON(message.digitalTwin)
        : undefined);
    message.tokenInfo !== undefined &&
      (obj.tokenInfo = message.tokenInfo
        ? IdentityTokenInfo.toJSON(message.tokenInfo)
        : undefined);
    return obj;
  },

  fromPartial(
    object: DeepPartial<GetDigitalTwinResponse>
  ): GetDigitalTwinResponse {
    const message = { ...baseGetDigitalTwinResponse } as GetDigitalTwinResponse;
    if (object.digitalTwin !== undefined && object.digitalTwin !== null) {
      message.digitalTwin = DigitalEntity.fromPartial(object.digitalTwin);
    }
    if (object.tokenInfo !== undefined && object.tokenInfo !== null) {
      message.tokenInfo = IdentityTokenInfo.fromPartial(object.tokenInfo);
    }
    return message;
  },
};

const baseListDigitalTwinsRequest: object = {
  collectionId: "",
  pageSize: 0,
  pageToken: "",
  orderBy: "",
};

export const ListDigitalTwinsRequest = {
  encode(
    message: ListDigitalTwinsRequest,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.tenantId.length !== 0) {
      writer.uint32(10).bytes(message.tenantId);
    }
    if (message.collectionId !== "") {
      writer.uint32(18).string(message.collectionId);
    }
    if (message.pageSize !== 0) {
      writer.uint32(24).int32(message.pageSize);
    }
    if (message.pageToken !== "") {
      writer.uint32(34).string(message.pageToken);
    }
    if (message.orderBy !== "") {
      writer.uint32(42).string(message.orderBy);
    }
    for (const v of message.properties) {
      Property.encode(v!, writer.uint32(50).fork()).ldelim();
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): ListDigitalTwinsRequest {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseListDigitalTwinsRequest,
    } as ListDigitalTwinsRequest;
    message.properties = [];
    message.tenantId = Buffer.alloc(0);
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.tenantId = reader.bytes() as Buffer;
          break;
        case 2:
          message.collectionId = reader.string();
          break;
        case 3:
          message.pageSize = reader.int32();
          break;
        case 4:
          message.pageToken = reader.string();
          break;
        case 5:
          message.orderBy = reader.string();
          break;
        case 6:
          message.properties.push(Property.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ListDigitalTwinsRequest {
    const message = {
      ...baseListDigitalTwinsRequest,
    } as ListDigitalTwinsRequest;
    message.properties = [];
    message.tenantId = Buffer.alloc(0);
    if (object.tenantId !== undefined && object.tenantId !== null) {
      message.tenantId = Buffer.from(bytesFromBase64(object.tenantId));
    }
    if (object.collectionId !== undefined && object.collectionId !== null) {
      message.collectionId = String(object.collectionId);
    }
    if (object.pageSize !== undefined && object.pageSize !== null) {
      message.pageSize = Number(object.pageSize);
    }
    if (object.pageToken !== undefined && object.pageToken !== null) {
      message.pageToken = String(object.pageToken);
    }
    if (object.orderBy !== undefined && object.orderBy !== null) {
      message.orderBy = String(object.orderBy);
    }
    if (object.properties !== undefined && object.properties !== null) {
      for (const e of object.properties) {
        message.properties.push(Property.fromJSON(e));
      }
    }
    return message;
  },

  toJSON(message: ListDigitalTwinsRequest): unknown {
    const obj: any = {};
    message.tenantId !== undefined &&
      (obj.tenantId = base64FromBytes(
        message.tenantId !== undefined ? message.tenantId : Buffer.alloc(0)
      ));
    message.collectionId !== undefined &&
      (obj.collectionId = message.collectionId);
    message.pageSize !== undefined && (obj.pageSize = message.pageSize);
    message.pageToken !== undefined && (obj.pageToken = message.pageToken);
    message.orderBy !== undefined && (obj.orderBy = message.orderBy);
    if (message.properties) {
      obj.properties = message.properties.map((e) =>
        e ? Property.toJSON(e) : undefined
      );
    } else {
      obj.properties = [];
    }
    return obj;
  },

  fromPartial(
    object: DeepPartial<ListDigitalTwinsRequest>
  ): ListDigitalTwinsRequest {
    const message = {
      ...baseListDigitalTwinsRequest,
    } as ListDigitalTwinsRequest;
    message.properties = [];
    if (object.tenantId !== undefined && object.tenantId !== null) {
      message.tenantId = object.tenantId;
    }
    if (object.collectionId !== undefined && object.collectionId !== null) {
      message.collectionId = object.collectionId;
    }
    if (object.pageSize !== undefined && object.pageSize !== null) {
      message.pageSize = object.pageSize;
    }
    if (object.pageToken !== undefined && object.pageToken !== null) {
      message.pageToken = object.pageToken;
    }
    if (object.orderBy !== undefined && object.orderBy !== null) {
      message.orderBy = object.orderBy;
    }
    if (object.properties !== undefined && object.properties !== null) {
      for (const e of object.properties) {
        message.properties.push(Property.fromPartial(e));
      }
    }
    return message;
  },
};

const baseListDigitalTwinsResponse: object = { nextPageToken: "" };

export const ListDigitalTwinsResponse = {
  encode(
    message: ListDigitalTwinsResponse,
    writer: Writer = Writer.create()
  ): Writer {
    for (const v of message.digitalTwin) {
      DigitalEntity.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    if (message.nextPageToken !== "") {
      writer.uint32(18).string(message.nextPageToken);
    }
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): ListDigitalTwinsResponse {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseListDigitalTwinsResponse,
    } as ListDigitalTwinsResponse;
    message.digitalTwin = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.digitalTwin.push(
            DigitalEntity.decode(reader, reader.uint32())
          );
          break;
        case 2:
          message.nextPageToken = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ListDigitalTwinsResponse {
    const message = {
      ...baseListDigitalTwinsResponse,
    } as ListDigitalTwinsResponse;
    message.digitalTwin = [];
    if (object.digitalTwin !== undefined && object.digitalTwin !== null) {
      for (const e of object.digitalTwin) {
        message.digitalTwin.push(DigitalEntity.fromJSON(e));
      }
    }
    if (object.nextPageToken !== undefined && object.nextPageToken !== null) {
      message.nextPageToken = String(object.nextPageToken);
    }
    return message;
  },

  toJSON(message: ListDigitalTwinsResponse): unknown {
    const obj: any = {};
    if (message.digitalTwin) {
      obj.digitalTwin = message.digitalTwin.map((e) =>
        e ? DigitalEntity.toJSON(e) : undefined
      );
    } else {
      obj.digitalTwin = [];
    }
    message.nextPageToken !== undefined &&
      (obj.nextPageToken = message.nextPageToken);
    return obj;
  },

  fromPartial(
    object: DeepPartial<ListDigitalTwinsResponse>
  ): ListDigitalTwinsResponse {
    const message = {
      ...baseListDigitalTwinsResponse,
    } as ListDigitalTwinsResponse;
    message.digitalTwin = [];
    if (object.digitalTwin !== undefined && object.digitalTwin !== null) {
      for (const e of object.digitalTwin) {
        message.digitalTwin.push(DigitalEntity.fromPartial(e));
      }
    }
    if (object.nextPageToken !== undefined && object.nextPageToken !== null) {
      message.nextPageToken = object.nextPageToken;
    }
    return message;
  },
};

const basePatchDigitalTwinRequest: object = {
  adminToken: "",
  forceDelete: false,
};

export const PatchDigitalTwinRequest = {
  encode(
    message: PatchDigitalTwinRequest,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.id !== undefined) {
      DigitalTwinIdentifier.encode(
        message.id,
        writer.uint32(10).fork()
      ).ldelim();
    }
    for (const v of message.operations) {
      PropertyBatchOperation.encode(v!, writer.uint32(18).fork()).ldelim();
    }
    if (message.adminToken !== "") {
      writer.uint32(26).string(message.adminToken);
    }
    if (message.forceDelete === true) {
      writer.uint32(32).bool(message.forceDelete);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): PatchDigitalTwinRequest {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...basePatchDigitalTwinRequest,
    } as PatchDigitalTwinRequest;
    message.operations = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = DigitalTwinIdentifier.decode(reader, reader.uint32());
          break;
        case 2:
          message.operations.push(
            PropertyBatchOperation.decode(reader, reader.uint32())
          );
          break;
        case 3:
          message.adminToken = reader.string();
          break;
        case 4:
          message.forceDelete = reader.bool();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): PatchDigitalTwinRequest {
    const message = {
      ...basePatchDigitalTwinRequest,
    } as PatchDigitalTwinRequest;
    message.operations = [];
    if (object.id !== undefined && object.id !== null) {
      message.id = DigitalTwinIdentifier.fromJSON(object.id);
    }
    if (object.operations !== undefined && object.operations !== null) {
      for (const e of object.operations) {
        message.operations.push(PropertyBatchOperation.fromJSON(e));
      }
    }
    if (object.adminToken !== undefined && object.adminToken !== null) {
      message.adminToken = String(object.adminToken);
    }
    if (object.forceDelete !== undefined && object.forceDelete !== null) {
      message.forceDelete = Boolean(object.forceDelete);
    }
    return message;
  },

  toJSON(message: PatchDigitalTwinRequest): unknown {
    const obj: any = {};
    message.id !== undefined &&
      (obj.id = message.id
        ? DigitalTwinIdentifier.toJSON(message.id)
        : undefined);
    if (message.operations) {
      obj.operations = message.operations.map((e) =>
        e ? PropertyBatchOperation.toJSON(e) : undefined
      );
    } else {
      obj.operations = [];
    }
    message.adminToken !== undefined && (obj.adminToken = message.adminToken);
    message.forceDelete !== undefined &&
      (obj.forceDelete = message.forceDelete);
    return obj;
  },

  fromPartial(
    object: DeepPartial<PatchDigitalTwinRequest>
  ): PatchDigitalTwinRequest {
    const message = {
      ...basePatchDigitalTwinRequest,
    } as PatchDigitalTwinRequest;
    message.operations = [];
    if (object.id !== undefined && object.id !== null) {
      message.id = DigitalTwinIdentifier.fromPartial(object.id);
    }
    if (object.operations !== undefined && object.operations !== null) {
      for (const e of object.operations) {
        message.operations.push(PropertyBatchOperation.fromPartial(e));
      }
    }
    if (object.adminToken !== undefined && object.adminToken !== null) {
      message.adminToken = object.adminToken;
    }
    if (object.forceDelete !== undefined && object.forceDelete !== null) {
      message.forceDelete = object.forceDelete;
    }
    return message;
  },
};

const basePatchDigitalTwinResponse: object = {};

export const PatchDigitalTwinResponse = {
  encode(
    message: PatchDigitalTwinResponse,
    writer: Writer = Writer.create()
  ): Writer {
    for (const v of message.result) {
      BatchOperationResult.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): PatchDigitalTwinResponse {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...basePatchDigitalTwinResponse,
    } as PatchDigitalTwinResponse;
    message.result = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.result.push(
            BatchOperationResult.decode(reader, reader.uint32())
          );
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): PatchDigitalTwinResponse {
    const message = {
      ...basePatchDigitalTwinResponse,
    } as PatchDigitalTwinResponse;
    message.result = [];
    if (object.result !== undefined && object.result !== null) {
      for (const e of object.result) {
        message.result.push(BatchOperationResult.fromJSON(e));
      }
    }
    return message;
  },

  toJSON(message: PatchDigitalTwinResponse): unknown {
    const obj: any = {};
    if (message.result) {
      obj.result = message.result.map((e) =>
        e ? BatchOperationResult.toJSON(e) : undefined
      );
    } else {
      obj.result = [];
    }
    return obj;
  },

  fromPartial(
    object: DeepPartial<PatchDigitalTwinResponse>
  ): PatchDigitalTwinResponse {
    const message = {
      ...basePatchDigitalTwinResponse,
    } as PatchDigitalTwinResponse;
    message.result = [];
    if (object.result !== undefined && object.result !== null) {
      for (const e of object.result) {
        message.result.push(BatchOperationResult.fromPartial(e));
      }
    }
    return message;
  },
};

const baseDeleteDigitalTwinRequest: object = { adminToken: "" };

export const DeleteDigitalTwinRequest = {
  encode(
    message: DeleteDigitalTwinRequest,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.id !== undefined) {
      DigitalTwinIdentifier.encode(
        message.id,
        writer.uint32(10).fork()
      ).ldelim();
    }
    if (message.adminToken !== "") {
      writer.uint32(18).string(message.adminToken);
    }
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): DeleteDigitalTwinRequest {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseDeleteDigitalTwinRequest,
    } as DeleteDigitalTwinRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = DigitalTwinIdentifier.decode(reader, reader.uint32());
          break;
        case 2:
          message.adminToken = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): DeleteDigitalTwinRequest {
    const message = {
      ...baseDeleteDigitalTwinRequest,
    } as DeleteDigitalTwinRequest;
    if (object.id !== undefined && object.id !== null) {
      message.id = DigitalTwinIdentifier.fromJSON(object.id);
    }
    if (object.adminToken !== undefined && object.adminToken !== null) {
      message.adminToken = String(object.adminToken);
    }
    return message;
  },

  toJSON(message: DeleteDigitalTwinRequest): unknown {
    const obj: any = {};
    message.id !== undefined &&
      (obj.id = message.id
        ? DigitalTwinIdentifier.toJSON(message.id)
        : undefined);
    message.adminToken !== undefined && (obj.adminToken = message.adminToken);
    return obj;
  },

  fromPartial(
    object: DeepPartial<DeleteDigitalTwinRequest>
  ): DeleteDigitalTwinRequest {
    const message = {
      ...baseDeleteDigitalTwinRequest,
    } as DeleteDigitalTwinRequest;
    if (object.id !== undefined && object.id !== null) {
      message.id = DigitalTwinIdentifier.fromPartial(object.id);
    }
    if (object.adminToken !== undefined && object.adminToken !== null) {
      message.adminToken = object.adminToken;
    }
    return message;
  },
};

const baseDeleteDigitalTwinResponse: object = {};

export const DeleteDigitalTwinResponse = {
  encode(
    message: DeleteDigitalTwinResponse,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.digitalTwin !== undefined) {
      DigitalTwin.encode(
        message.digitalTwin,
        writer.uint32(10).fork()
      ).ldelim();
    }
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): DeleteDigitalTwinResponse {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseDeleteDigitalTwinResponse,
    } as DeleteDigitalTwinResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.digitalTwin = DigitalTwin.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): DeleteDigitalTwinResponse {
    const message = {
      ...baseDeleteDigitalTwinResponse,
    } as DeleteDigitalTwinResponse;
    if (object.digitalTwin !== undefined && object.digitalTwin !== null) {
      message.digitalTwin = DigitalTwin.fromJSON(object.digitalTwin);
    }
    return message;
  },

  toJSON(message: DeleteDigitalTwinResponse): unknown {
    const obj: any = {};
    message.digitalTwin !== undefined &&
      (obj.digitalTwin = message.digitalTwin
        ? DigitalTwin.toJSON(message.digitalTwin)
        : undefined);
    return obj;
  },

  fromPartial(
    object: DeepPartial<DeleteDigitalTwinResponse>
  ): DeleteDigitalTwinResponse {
    const message = {
      ...baseDeleteDigitalTwinResponse,
    } as DeleteDigitalTwinResponse;
    if (object.digitalTwin !== undefined && object.digitalTwin !== null) {
      message.digitalTwin = DigitalTwin.fromPartial(object.digitalTwin);
    }
    return message;
  },
};

const baseGetDocumentRequest: object = { name: "" };

export const GetDocumentRequest = {
  encode(
    message: GetDocumentRequest,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.name !== "") {
      writer.uint32(10).string(message.name);
    }
    if (message.mask !== undefined) {
      DocumentMask.encode(message.mask, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): GetDocumentRequest {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseGetDocumentRequest } as GetDocumentRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.name = reader.string();
          break;
        case 2:
          message.mask = DocumentMask.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetDocumentRequest {
    const message = { ...baseGetDocumentRequest } as GetDocumentRequest;
    if (object.name !== undefined && object.name !== null) {
      message.name = String(object.name);
    }
    if (object.mask !== undefined && object.mask !== null) {
      message.mask = DocumentMask.fromJSON(object.mask);
    }
    return message;
  },

  toJSON(message: GetDocumentRequest): unknown {
    const obj: any = {};
    message.name !== undefined && (obj.name = message.name);
    message.mask !== undefined &&
      (obj.mask = message.mask ? DocumentMask.toJSON(message.mask) : undefined);
    return obj;
  },

  fromPartial(object: DeepPartial<GetDocumentRequest>): GetDocumentRequest {
    const message = { ...baseGetDocumentRequest } as GetDocumentRequest;
    if (object.name !== undefined && object.name !== null) {
      message.name = object.name;
    }
    if (object.mask !== undefined && object.mask !== null) {
      message.mask = DocumentMask.fromPartial(object.mask);
    }
    return message;
  },
};

const baseGetDocumentResponse: object = {};

export const GetDocumentResponse = {
  encode(
    message: GetDocumentResponse,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.document !== undefined) {
      Document.encode(message.document, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): GetDocumentResponse {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseGetDocumentResponse } as GetDocumentResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.document = Document.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetDocumentResponse {
    const message = { ...baseGetDocumentResponse } as GetDocumentResponse;
    if (object.document !== undefined && object.document !== null) {
      message.document = Document.fromJSON(object.document);
    }
    return message;
  },

  toJSON(message: GetDocumentResponse): unknown {
    const obj: any = {};
    message.document !== undefined &&
      (obj.document = message.document
        ? Document.toJSON(message.document)
        : undefined);
    return obj;
  },

  fromPartial(object: DeepPartial<GetDocumentResponse>): GetDocumentResponse {
    const message = { ...baseGetDocumentResponse } as GetDocumentResponse;
    if (object.document !== undefined && object.document !== null) {
      message.document = Document.fromPartial(object.document);
    }
    return message;
  },
};

const baseBatchGetDocumentsRequest: object = { database: "", documents: "" };

export const BatchGetDocumentsRequest = {
  encode(
    message: BatchGetDocumentsRequest,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.database !== "") {
      writer.uint32(10).string(message.database);
    }
    for (const v of message.documents) {
      writer.uint32(18).string(v!);
    }
    if (message.mask !== undefined) {
      DocumentMask.encode(message.mask, writer.uint32(26).fork()).ldelim();
    }
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): BatchGetDocumentsRequest {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseBatchGetDocumentsRequest,
    } as BatchGetDocumentsRequest;
    message.documents = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.database = reader.string();
          break;
        case 2:
          message.documents.push(reader.string());
          break;
        case 3:
          message.mask = DocumentMask.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): BatchGetDocumentsRequest {
    const message = {
      ...baseBatchGetDocumentsRequest,
    } as BatchGetDocumentsRequest;
    message.documents = [];
    if (object.database !== undefined && object.database !== null) {
      message.database = String(object.database);
    }
    if (object.documents !== undefined && object.documents !== null) {
      for (const e of object.documents) {
        message.documents.push(String(e));
      }
    }
    if (object.mask !== undefined && object.mask !== null) {
      message.mask = DocumentMask.fromJSON(object.mask);
    }
    return message;
  },

  toJSON(message: BatchGetDocumentsRequest): unknown {
    const obj: any = {};
    message.database !== undefined && (obj.database = message.database);
    if (message.documents) {
      obj.documents = message.documents.map((e) => e);
    } else {
      obj.documents = [];
    }
    message.mask !== undefined &&
      (obj.mask = message.mask ? DocumentMask.toJSON(message.mask) : undefined);
    return obj;
  },

  fromPartial(
    object: DeepPartial<BatchGetDocumentsRequest>
  ): BatchGetDocumentsRequest {
    const message = {
      ...baseBatchGetDocumentsRequest,
    } as BatchGetDocumentsRequest;
    message.documents = [];
    if (object.database !== undefined && object.database !== null) {
      message.database = object.database;
    }
    if (object.documents !== undefined && object.documents !== null) {
      for (const e of object.documents) {
        message.documents.push(e);
      }
    }
    if (object.mask !== undefined && object.mask !== null) {
      message.mask = DocumentMask.fromPartial(object.mask);
    }
    return message;
  },
};

const baseBatchGetDocumentsResponse: object = {};

export const BatchGetDocumentsResponse = {
  encode(
    message: BatchGetDocumentsResponse,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.result?.$case === "found") {
      Document.encode(message.result.found, writer.uint32(10).fork()).ldelim();
    }
    if (message.result?.$case === "missing") {
      writer.uint32(18).string(message.result.missing);
    }
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): BatchGetDocumentsResponse {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseBatchGetDocumentsResponse,
    } as BatchGetDocumentsResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.result = {
            $case: "found",
            found: Document.decode(reader, reader.uint32()),
          };
          break;
        case 2:
          message.result = { $case: "missing", missing: reader.string() };
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): BatchGetDocumentsResponse {
    const message = {
      ...baseBatchGetDocumentsResponse,
    } as BatchGetDocumentsResponse;
    if (object.found !== undefined && object.found !== null) {
      message.result = {
        $case: "found",
        found: Document.fromJSON(object.found),
      };
    }
    if (object.missing !== undefined && object.missing !== null) {
      message.result = { $case: "missing", missing: String(object.missing) };
    }
    return message;
  },

  toJSON(message: BatchGetDocumentsResponse): unknown {
    const obj: any = {};
    message.result?.$case === "found" &&
      (obj.found = message.result?.found
        ? Document.toJSON(message.result?.found)
        : undefined);
    message.result?.$case === "missing" &&
      (obj.missing = message.result?.missing);
    return obj;
  },

  fromPartial(
    object: DeepPartial<BatchGetDocumentsResponse>
  ): BatchGetDocumentsResponse {
    const message = {
      ...baseBatchGetDocumentsResponse,
    } as BatchGetDocumentsResponse;
    if (
      object.result?.$case === "found" &&
      object.result?.found !== undefined &&
      object.result?.found !== null
    ) {
      message.result = {
        $case: "found",
        found: Document.fromPartial(object.result.found),
      };
    }
    if (
      object.result?.$case === "missing" &&
      object.result?.missing !== undefined &&
      object.result?.missing !== null
    ) {
      message.result = { $case: "missing", missing: object.result.missing };
    }
    return message;
  },
};

const baseListDocumentsRequest: object = {
  parent: "",
  collectionId: "",
  pageSize: 0,
  pageToken: "",
  orderBy: "",
};

export const ListDocumentsRequest = {
  encode(
    message: ListDocumentsRequest,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.parent !== "") {
      writer.uint32(10).string(message.parent);
    }
    if (message.collectionId !== "") {
      writer.uint32(18).string(message.collectionId);
    }
    if (message.pageSize !== 0) {
      writer.uint32(24).int32(message.pageSize);
    }
    if (message.pageToken !== "") {
      writer.uint32(34).string(message.pageToken);
    }
    if (message.orderBy !== "") {
      writer.uint32(50).string(message.orderBy);
    }
    if (message.mask !== undefined) {
      DocumentMask.encode(message.mask, writer.uint32(58).fork()).ldelim();
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): ListDocumentsRequest {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseListDocumentsRequest } as ListDocumentsRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.parent = reader.string();
          break;
        case 2:
          message.collectionId = reader.string();
          break;
        case 3:
          message.pageSize = reader.int32();
          break;
        case 4:
          message.pageToken = reader.string();
          break;
        case 6:
          message.orderBy = reader.string();
          break;
        case 7:
          message.mask = DocumentMask.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ListDocumentsRequest {
    const message = { ...baseListDocumentsRequest } as ListDocumentsRequest;
    if (object.parent !== undefined && object.parent !== null) {
      message.parent = String(object.parent);
    }
    if (object.collectionId !== undefined && object.collectionId !== null) {
      message.collectionId = String(object.collectionId);
    }
    if (object.pageSize !== undefined && object.pageSize !== null) {
      message.pageSize = Number(object.pageSize);
    }
    if (object.pageToken !== undefined && object.pageToken !== null) {
      message.pageToken = String(object.pageToken);
    }
    if (object.orderBy !== undefined && object.orderBy !== null) {
      message.orderBy = String(object.orderBy);
    }
    if (object.mask !== undefined && object.mask !== null) {
      message.mask = DocumentMask.fromJSON(object.mask);
    }
    return message;
  },

  toJSON(message: ListDocumentsRequest): unknown {
    const obj: any = {};
    message.parent !== undefined && (obj.parent = message.parent);
    message.collectionId !== undefined &&
      (obj.collectionId = message.collectionId);
    message.pageSize !== undefined && (obj.pageSize = message.pageSize);
    message.pageToken !== undefined && (obj.pageToken = message.pageToken);
    message.orderBy !== undefined && (obj.orderBy = message.orderBy);
    message.mask !== undefined &&
      (obj.mask = message.mask ? DocumentMask.toJSON(message.mask) : undefined);
    return obj;
  },

  fromPartial(object: DeepPartial<ListDocumentsRequest>): ListDocumentsRequest {
    const message = { ...baseListDocumentsRequest } as ListDocumentsRequest;
    if (object.parent !== undefined && object.parent !== null) {
      message.parent = object.parent;
    }
    if (object.collectionId !== undefined && object.collectionId !== null) {
      message.collectionId = object.collectionId;
    }
    if (object.pageSize !== undefined && object.pageSize !== null) {
      message.pageSize = object.pageSize;
    }
    if (object.pageToken !== undefined && object.pageToken !== null) {
      message.pageToken = object.pageToken;
    }
    if (object.orderBy !== undefined && object.orderBy !== null) {
      message.orderBy = object.orderBy;
    }
    if (object.mask !== undefined && object.mask !== null) {
      message.mask = DocumentMask.fromPartial(object.mask);
    }
    return message;
  },
};

const baseListDocumentsResponse: object = { nextPageToken: "" };

export const ListDocumentsResponse = {
  encode(
    message: ListDocumentsResponse,
    writer: Writer = Writer.create()
  ): Writer {
    for (const v of message.documents) {
      Document.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    if (message.nextPageToken !== "") {
      writer.uint32(18).string(message.nextPageToken);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): ListDocumentsResponse {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseListDocumentsResponse } as ListDocumentsResponse;
    message.documents = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.documents.push(Document.decode(reader, reader.uint32()));
          break;
        case 2:
          message.nextPageToken = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ListDocumentsResponse {
    const message = { ...baseListDocumentsResponse } as ListDocumentsResponse;
    message.documents = [];
    if (object.documents !== undefined && object.documents !== null) {
      for (const e of object.documents) {
        message.documents.push(Document.fromJSON(e));
      }
    }
    if (object.nextPageToken !== undefined && object.nextPageToken !== null) {
      message.nextPageToken = String(object.nextPageToken);
    }
    return message;
  },

  toJSON(message: ListDocumentsResponse): unknown {
    const obj: any = {};
    if (message.documents) {
      obj.documents = message.documents.map((e) =>
        e ? Document.toJSON(e) : undefined
      );
    } else {
      obj.documents = [];
    }
    message.nextPageToken !== undefined &&
      (obj.nextPageToken = message.nextPageToken);
    return obj;
  },

  fromPartial(
    object: DeepPartial<ListDocumentsResponse>
  ): ListDocumentsResponse {
    const message = { ...baseListDocumentsResponse } as ListDocumentsResponse;
    message.documents = [];
    if (object.documents !== undefined && object.documents !== null) {
      for (const e of object.documents) {
        message.documents.push(Document.fromPartial(e));
      }
    }
    if (object.nextPageToken !== undefined && object.nextPageToken !== null) {
      message.nextPageToken = object.nextPageToken;
    }
    return message;
  },
};

const baseMutateDocumentsRequest: object = { database: "" };

export const MutateDocumentsRequest = {
  encode(
    message: MutateDocumentsRequest,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.database !== "") {
      writer.uint32(10).string(message.database);
    }
    for (const v of message.writes) {
      Write.encode(v!, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): MutateDocumentsRequest {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseMutateDocumentsRequest } as MutateDocumentsRequest;
    message.writes = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.database = reader.string();
          break;
        case 2:
          message.writes.push(Write.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): MutateDocumentsRequest {
    const message = { ...baseMutateDocumentsRequest } as MutateDocumentsRequest;
    message.writes = [];
    if (object.database !== undefined && object.database !== null) {
      message.database = String(object.database);
    }
    if (object.writes !== undefined && object.writes !== null) {
      for (const e of object.writes) {
        message.writes.push(Write.fromJSON(e));
      }
    }
    return message;
  },

  toJSON(message: MutateDocumentsRequest): unknown {
    const obj: any = {};
    message.database !== undefined && (obj.database = message.database);
    if (message.writes) {
      obj.writes = message.writes.map((e) => (e ? Write.toJSON(e) : undefined));
    } else {
      obj.writes = [];
    }
    return obj;
  },

  fromPartial(
    object: DeepPartial<MutateDocumentsRequest>
  ): MutateDocumentsRequest {
    const message = { ...baseMutateDocumentsRequest } as MutateDocumentsRequest;
    message.writes = [];
    if (object.database !== undefined && object.database !== null) {
      message.database = object.database;
    }
    if (object.writes !== undefined && object.writes !== null) {
      for (const e of object.writes) {
        message.writes.push(Write.fromPartial(e));
      }
    }
    return message;
  },
};

const baseMutateDocumentsResponse: object = {};

export const MutateDocumentsResponse = {
  encode(
    message: MutateDocumentsResponse,
    writer: Writer = Writer.create()
  ): Writer {
    for (const v of message.writeResults) {
      WriteResult.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): MutateDocumentsResponse {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseMutateDocumentsResponse,
    } as MutateDocumentsResponse;
    message.writeResults = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.writeResults.push(
            WriteResult.decode(reader, reader.uint32())
          );
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): MutateDocumentsResponse {
    const message = {
      ...baseMutateDocumentsResponse,
    } as MutateDocumentsResponse;
    message.writeResults = [];
    if (object.writeResults !== undefined && object.writeResults !== null) {
      for (const e of object.writeResults) {
        message.writeResults.push(WriteResult.fromJSON(e));
      }
    }
    return message;
  },

  toJSON(message: MutateDocumentsResponse): unknown {
    const obj: any = {};
    if (message.writeResults) {
      obj.writeResults = message.writeResults.map((e) =>
        e ? WriteResult.toJSON(e) : undefined
      );
    } else {
      obj.writeResults = [];
    }
    return obj;
  },

  fromPartial(
    object: DeepPartial<MutateDocumentsResponse>
  ): MutateDocumentsResponse {
    const message = {
      ...baseMutateDocumentsResponse,
    } as MutateDocumentsResponse;
    message.writeResults = [];
    if (object.writeResults !== undefined && object.writeResults !== null) {
      for (const e of object.writeResults) {
        message.writeResults.push(WriteResult.fromPartial(e));
      }
    }
    return message;
  },
};

const baseRunQueryRequest: object = { parent: "" };

export const RunQueryRequest = {
  encode(message: RunQueryRequest, writer: Writer = Writer.create()): Writer {
    if (message.parent !== "") {
      writer.uint32(10).string(message.parent);
    }
    if (message.queryType?.$case === "structuredQuery") {
      Value.encode(
        message.queryType.structuredQuery,
        writer.uint32(18).fork()
      ).ldelim();
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): RunQueryRequest {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseRunQueryRequest } as RunQueryRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.parent = reader.string();
          break;
        case 2:
          message.queryType = {
            $case: "structuredQuery",
            structuredQuery: Value.decode(reader, reader.uint32()),
          };
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): RunQueryRequest {
    const message = { ...baseRunQueryRequest } as RunQueryRequest;
    if (object.parent !== undefined && object.parent !== null) {
      message.parent = String(object.parent);
    }
    if (
      object.structuredQuery !== undefined &&
      object.structuredQuery !== null
    ) {
      message.queryType = {
        $case: "structuredQuery",
        structuredQuery: Value.fromJSON(object.structuredQuery),
      };
    }
    return message;
  },

  toJSON(message: RunQueryRequest): unknown {
    const obj: any = {};
    message.parent !== undefined && (obj.parent = message.parent);
    message.queryType?.$case === "structuredQuery" &&
      (obj.structuredQuery = message.queryType?.structuredQuery
        ? Value.toJSON(message.queryType?.structuredQuery)
        : undefined);
    return obj;
  },

  fromPartial(object: DeepPartial<RunQueryRequest>): RunQueryRequest {
    const message = { ...baseRunQueryRequest } as RunQueryRequest;
    if (object.parent !== undefined && object.parent !== null) {
      message.parent = object.parent;
    }
    if (
      object.queryType?.$case === "structuredQuery" &&
      object.queryType?.structuredQuery !== undefined &&
      object.queryType?.structuredQuery !== null
    ) {
      message.queryType = {
        $case: "structuredQuery",
        structuredQuery: Value.fromPartial(object.queryType.structuredQuery),
      };
    }
    return message;
  },
};

const baseRunQueryResponse: object = { skippedResults: 0 };

export const RunQueryResponse = {
  encode(message: RunQueryResponse, writer: Writer = Writer.create()): Writer {
    if (message.document !== undefined) {
      Document.encode(message.document, writer.uint32(10).fork()).ldelim();
    }
    if (message.skippedResults !== 0) {
      writer.uint32(32).int32(message.skippedResults);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): RunQueryResponse {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseRunQueryResponse } as RunQueryResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.document = Document.decode(reader, reader.uint32());
          break;
        case 4:
          message.skippedResults = reader.int32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): RunQueryResponse {
    const message = { ...baseRunQueryResponse } as RunQueryResponse;
    if (object.document !== undefined && object.document !== null) {
      message.document = Document.fromJSON(object.document);
    }
    if (object.skippedResults !== undefined && object.skippedResults !== null) {
      message.skippedResults = Number(object.skippedResults);
    }
    return message;
  },

  toJSON(message: RunQueryResponse): unknown {
    const obj: any = {};
    message.document !== undefined &&
      (obj.document = message.document
        ? Document.toJSON(message.document)
        : undefined);
    message.skippedResults !== undefined &&
      (obj.skippedResults = message.skippedResults);
    return obj;
  },

  fromPartial(object: DeepPartial<RunQueryResponse>): RunQueryResponse {
    const message = { ...baseRunQueryResponse } as RunQueryResponse;
    if (object.document !== undefined && object.document !== null) {
      message.document = Document.fromPartial(object.document);
    }
    if (object.skippedResults !== undefined && object.skippedResults !== null) {
      message.skippedResults = object.skippedResults;
    }
    return message;
  },
};

const baseGetPasswordCredentialRequest: object = {};

export const GetPasswordCredentialRequest = {
  encode(
    message: GetPasswordCredentialRequest,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.digitalTwin !== undefined) {
      DigitalTwin.encode(
        message.digitalTwin,
        writer.uint32(10).fork()
      ).ldelim();
    }
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): GetPasswordCredentialRequest {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseGetPasswordCredentialRequest,
    } as GetPasswordCredentialRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.digitalTwin = DigitalTwin.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetPasswordCredentialRequest {
    const message = {
      ...baseGetPasswordCredentialRequest,
    } as GetPasswordCredentialRequest;
    if (object.digitalTwin !== undefined && object.digitalTwin !== null) {
      message.digitalTwin = DigitalTwin.fromJSON(object.digitalTwin);
    }
    return message;
  },

  toJSON(message: GetPasswordCredentialRequest): unknown {
    const obj: any = {};
    message.digitalTwin !== undefined &&
      (obj.digitalTwin = message.digitalTwin
        ? DigitalTwin.toJSON(message.digitalTwin)
        : undefined);
    return obj;
  },

  fromPartial(
    object: DeepPartial<GetPasswordCredentialRequest>
  ): GetPasswordCredentialRequest {
    const message = {
      ...baseGetPasswordCredentialRequest,
    } as GetPasswordCredentialRequest;
    if (object.digitalTwin !== undefined && object.digitalTwin !== null) {
      message.digitalTwin = DigitalTwin.fromPartial(object.digitalTwin);
    }
    return message;
  },
};

const baseGetPasswordCredentialResponse: object = {};

export const GetPasswordCredentialResponse = {
  encode(
    _: GetPasswordCredentialResponse,
    writer: Writer = Writer.create()
  ): Writer {
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): GetPasswordCredentialResponse {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseGetPasswordCredentialResponse,
    } as GetPasswordCredentialResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(_: any): GetPasswordCredentialResponse {
    const message = {
      ...baseGetPasswordCredentialResponse,
    } as GetPasswordCredentialResponse;
    return message;
  },

  toJSON(_: GetPasswordCredentialResponse): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial(
    _: DeepPartial<GetPasswordCredentialResponse>
  ): GetPasswordCredentialResponse {
    const message = {
      ...baseGetPasswordCredentialResponse,
    } as GetPasswordCredentialResponse;
    return message;
  },
};

const basePasswordCredentialOld: object = {
  tenant: "",
  uuid: "",
  expiresAt: "0",
  flagBit1: false,
  flagBit2: false,
  flagBit3: false,
  flagBit4: false,
  flagBit5: false,
  flagBit6: false,
  flagBit7: false,
  flagBit8: false,
  controls: 0,
};

export const PasswordCredentialOld = {
  encode(
    message: PasswordCredentialOld,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.tenant !== "") {
      writer.uint32(10).string(message.tenant);
    }
    if (message.uuid !== "") {
      writer.uint32(26).string(message.uuid);
    }
    if (message.expiresAt !== "0") {
      writer.uint32(32).int64(message.expiresAt);
    }
    if (message.flagBit1 === true) {
      writer.uint32(40).bool(message.flagBit1);
    }
    if (message.flagBit2 === true) {
      writer.uint32(48).bool(message.flagBit2);
    }
    if (message.flagBit3 === true) {
      writer.uint32(56).bool(message.flagBit3);
    }
    if (message.flagBit4 === true) {
      writer.uint32(64).bool(message.flagBit4);
    }
    if (message.flagBit5 === true) {
      writer.uint32(72).bool(message.flagBit5);
    }
    if (message.flagBit6 === true) {
      writer.uint32(80).bool(message.flagBit6);
    }
    if (message.flagBit7 === true) {
      writer.uint32(88).bool(message.flagBit7);
    }
    if (message.flagBit8 === true) {
      writer.uint32(96).bool(message.flagBit8);
    }
    writer.uint32(106).fork();
    for (const v of message.controls) {
      writer.int32(v);
    }
    writer.ldelim();
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): PasswordCredentialOld {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...basePasswordCredentialOld } as PasswordCredentialOld;
    message.controls = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.tenant = reader.string();
          break;
        case 3:
          message.uuid = reader.string();
          break;
        case 4:
          message.expiresAt = longToString(reader.int64() as Long);
          break;
        case 5:
          message.flagBit1 = reader.bool();
          break;
        case 6:
          message.flagBit2 = reader.bool();
          break;
        case 7:
          message.flagBit3 = reader.bool();
          break;
        case 8:
          message.flagBit4 = reader.bool();
          break;
        case 9:
          message.flagBit5 = reader.bool();
          break;
        case 10:
          message.flagBit6 = reader.bool();
          break;
        case 11:
          message.flagBit7 = reader.bool();
          break;
        case 12:
          message.flagBit8 = reader.bool();
          break;
        case 13:
          if ((tag & 7) === 2) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.controls.push(reader.int32() as any);
            }
          } else {
            message.controls.push(reader.int32() as any);
          }
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): PasswordCredentialOld {
    const message = { ...basePasswordCredentialOld } as PasswordCredentialOld;
    message.controls = [];
    if (object.tenant !== undefined && object.tenant !== null) {
      message.tenant = String(object.tenant);
    }
    if (object.uuid !== undefined && object.uuid !== null) {
      message.uuid = String(object.uuid);
    }
    if (object.expiresAt !== undefined && object.expiresAt !== null) {
      message.expiresAt = String(object.expiresAt);
    }
    if (object.flagBit1 !== undefined && object.flagBit1 !== null) {
      message.flagBit1 = Boolean(object.flagBit1);
    }
    if (object.flagBit2 !== undefined && object.flagBit2 !== null) {
      message.flagBit2 = Boolean(object.flagBit2);
    }
    if (object.flagBit3 !== undefined && object.flagBit3 !== null) {
      message.flagBit3 = Boolean(object.flagBit3);
    }
    if (object.flagBit4 !== undefined && object.flagBit4 !== null) {
      message.flagBit4 = Boolean(object.flagBit4);
    }
    if (object.flagBit5 !== undefined && object.flagBit5 !== null) {
      message.flagBit5 = Boolean(object.flagBit5);
    }
    if (object.flagBit6 !== undefined && object.flagBit6 !== null) {
      message.flagBit6 = Boolean(object.flagBit6);
    }
    if (object.flagBit7 !== undefined && object.flagBit7 !== null) {
      message.flagBit7 = Boolean(object.flagBit7);
    }
    if (object.flagBit8 !== undefined && object.flagBit8 !== null) {
      message.flagBit8 = Boolean(object.flagBit8);
    }
    if (object.controls !== undefined && object.controls !== null) {
      for (const e of object.controls) {
        message.controls.push(credentialControlFromJSON(e));
      }
    }
    return message;
  },

  toJSON(message: PasswordCredentialOld): unknown {
    const obj: any = {};
    message.tenant !== undefined && (obj.tenant = message.tenant);
    message.uuid !== undefined && (obj.uuid = message.uuid);
    message.expiresAt !== undefined && (obj.expiresAt = message.expiresAt);
    message.flagBit1 !== undefined && (obj.flagBit1 = message.flagBit1);
    message.flagBit2 !== undefined && (obj.flagBit2 = message.flagBit2);
    message.flagBit3 !== undefined && (obj.flagBit3 = message.flagBit3);
    message.flagBit4 !== undefined && (obj.flagBit4 = message.flagBit4);
    message.flagBit5 !== undefined && (obj.flagBit5 = message.flagBit5);
    message.flagBit6 !== undefined && (obj.flagBit6 = message.flagBit6);
    message.flagBit7 !== undefined && (obj.flagBit7 = message.flagBit7);
    message.flagBit8 !== undefined && (obj.flagBit8 = message.flagBit8);
    if (message.controls) {
      obj.controls = message.controls.map((e) => credentialControlToJSON(e));
    } else {
      obj.controls = [];
    }
    return obj;
  },

  fromPartial(
    object: DeepPartial<PasswordCredentialOld>
  ): PasswordCredentialOld {
    const message = { ...basePasswordCredentialOld } as PasswordCredentialOld;
    message.controls = [];
    if (object.tenant !== undefined && object.tenant !== null) {
      message.tenant = object.tenant;
    }
    if (object.uuid !== undefined && object.uuid !== null) {
      message.uuid = object.uuid;
    }
    if (object.expiresAt !== undefined && object.expiresAt !== null) {
      message.expiresAt = object.expiresAt;
    }
    if (object.flagBit1 !== undefined && object.flagBit1 !== null) {
      message.flagBit1 = object.flagBit1;
    }
    if (object.flagBit2 !== undefined && object.flagBit2 !== null) {
      message.flagBit2 = object.flagBit2;
    }
    if (object.flagBit3 !== undefined && object.flagBit3 !== null) {
      message.flagBit3 = object.flagBit3;
    }
    if (object.flagBit4 !== undefined && object.flagBit4 !== null) {
      message.flagBit4 = object.flagBit4;
    }
    if (object.flagBit5 !== undefined && object.flagBit5 !== null) {
      message.flagBit5 = object.flagBit5;
    }
    if (object.flagBit6 !== undefined && object.flagBit6 !== null) {
      message.flagBit6 = object.flagBit6;
    }
    if (object.flagBit7 !== undefined && object.flagBit7 !== null) {
      message.flagBit7 = object.flagBit7;
    }
    if (object.flagBit8 !== undefined && object.flagBit8 !== null) {
      message.flagBit8 = object.flagBit8;
    }
    if (object.controls !== undefined && object.controls !== null) {
      for (const e of object.controls) {
        message.controls.push(e);
      }
    }
    return message;
  },
};

const baseUpdatePasswordCredentialRequest: object = {};

export const UpdatePasswordCredentialRequest = {
  encode(
    message: UpdatePasswordCredentialRequest,
    writer: Writer = Writer.create()
  ): Writer {
    for (const v of message.loginProperties) {
      writer.uint32(10).bytes(v!);
    }
    if (message.mustChange !== undefined) {
      BoolValue.encode(
        { value: message.mustChange! },
        writer.uint32(18).fork()
      ).ldelim();
    }
    if (message.locked !== undefined) {
      BoolValue.encode(
        { value: message.locked! },
        writer.uint32(42).fork()
      ).ldelim();
    }
    if (message.primary?.$case === "email") {
      writer.uint32(26).string(message.primary.email);
    }
    if (message.primary?.$case === "mobile") {
      writer.uint32(34).string(message.primary.mobile);
    }
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): UpdatePasswordCredentialRequest {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseUpdatePasswordCredentialRequest,
    } as UpdatePasswordCredentialRequest;
    message.loginProperties = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.loginProperties.push(reader.bytes() as Buffer);
          break;
        case 2:
          message.mustChange = BoolValue.decode(reader, reader.uint32()).value;
          break;
        case 5:
          message.locked = BoolValue.decode(reader, reader.uint32()).value;
          break;
        case 3:
          message.primary = { $case: "email", email: reader.string() };
          break;
        case 4:
          message.primary = { $case: "mobile", mobile: reader.string() };
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): UpdatePasswordCredentialRequest {
    const message = {
      ...baseUpdatePasswordCredentialRequest,
    } as UpdatePasswordCredentialRequest;
    message.loginProperties = [];
    if (
      object.loginProperties !== undefined &&
      object.loginProperties !== null
    ) {
      for (const e of object.loginProperties) {
        message.loginProperties.push(Buffer.from(bytesFromBase64(e)));
      }
    }
    if (object.mustChange !== undefined && object.mustChange !== null) {
      message.mustChange = Boolean(object.mustChange);
    }
    if (object.locked !== undefined && object.locked !== null) {
      message.locked = Boolean(object.locked);
    }
    if (object.email !== undefined && object.email !== null) {
      message.primary = { $case: "email", email: String(object.email) };
    }
    if (object.mobile !== undefined && object.mobile !== null) {
      message.primary = { $case: "mobile", mobile: String(object.mobile) };
    }
    return message;
  },

  toJSON(message: UpdatePasswordCredentialRequest): unknown {
    const obj: any = {};
    if (message.loginProperties) {
      obj.loginProperties = message.loginProperties.map((e) =>
        base64FromBytes(e !== undefined ? e : Buffer.alloc(0))
      );
    } else {
      obj.loginProperties = [];
    }
    message.mustChange !== undefined && (obj.mustChange = message.mustChange);
    message.locked !== undefined && (obj.locked = message.locked);
    message.primary?.$case === "email" && (obj.email = message.primary?.email);
    message.primary?.$case === "mobile" &&
      (obj.mobile = message.primary?.mobile);
    return obj;
  },

  fromPartial(
    object: DeepPartial<UpdatePasswordCredentialRequest>
  ): UpdatePasswordCredentialRequest {
    const message = {
      ...baseUpdatePasswordCredentialRequest,
    } as UpdatePasswordCredentialRequest;
    message.loginProperties = [];
    if (
      object.loginProperties !== undefined &&
      object.loginProperties !== null
    ) {
      for (const e of object.loginProperties) {
        message.loginProperties.push(e);
      }
    }
    if (object.mustChange !== undefined && object.mustChange !== null) {
      message.mustChange = object.mustChange;
    }
    if (object.locked !== undefined && object.locked !== null) {
      message.locked = object.locked;
    }
    if (
      object.primary?.$case === "email" &&
      object.primary?.email !== undefined &&
      object.primary?.email !== null
    ) {
      message.primary = { $case: "email", email: object.primary.email };
    }
    if (
      object.primary?.$case === "mobile" &&
      object.primary?.mobile !== undefined &&
      object.primary?.mobile !== null
    ) {
      message.primary = { $case: "mobile", mobile: object.primary.mobile };
    }
    return message;
  },
};

const baseUpdatePasswordCredentialResponse: object = {};

export const UpdatePasswordCredentialResponse = {
  encode(
    _: UpdatePasswordCredentialResponse,
    writer: Writer = Writer.create()
  ): Writer {
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): UpdatePasswordCredentialResponse {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseUpdatePasswordCredentialResponse,
    } as UpdatePasswordCredentialResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(_: any): UpdatePasswordCredentialResponse {
    const message = {
      ...baseUpdatePasswordCredentialResponse,
    } as UpdatePasswordCredentialResponse;
    return message;
  },

  toJSON(_: UpdatePasswordCredentialResponse): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial(
    _: DeepPartial<UpdatePasswordCredentialResponse>
  ): UpdatePasswordCredentialResponse {
    const message = {
      ...baseUpdatePasswordCredentialResponse,
    } as UpdatePasswordCredentialResponse;
    return message;
  },
};

const baseError: object = { code: "" };

export const Error = {
  encode(message: Error, writer: Writer = Writer.create()): Writer {
    if (message.code !== "") {
      writer.uint32(10).string(message.code);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): Error {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseError } as Error;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.code = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Error {
    const message = { ...baseError } as Error;
    if (object.code !== undefined && object.code !== null) {
      message.code = String(object.code);
    }
    return message;
  },

  toJSON(message: Error): unknown {
    const obj: any = {};
    message.code !== undefined && (obj.code = message.code);
    return obj;
  },

  fromPartial(object: DeepPartial<Error>): Error {
    const message = { ...baseError } as Error;
    if (object.code !== undefined && object.code !== null) {
      message.code = object.code;
    }
    return message;
  },
};

const baseSelfServiceChangePasswordRequest: object = { password: "" };

export const SelfServiceChangePasswordRequest = {
  encode(
    message: SelfServiceChangePasswordRequest,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.password !== "") {
      writer.uint32(10).string(message.password);
    }
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): SelfServiceChangePasswordRequest {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseSelfServiceChangePasswordRequest,
    } as SelfServiceChangePasswordRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.password = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): SelfServiceChangePasswordRequest {
    const message = {
      ...baseSelfServiceChangePasswordRequest,
    } as SelfServiceChangePasswordRequest;
    if (object.password !== undefined && object.password !== null) {
      message.password = String(object.password);
    }
    return message;
  },

  toJSON(message: SelfServiceChangePasswordRequest): unknown {
    const obj: any = {};
    message.password !== undefined && (obj.password = message.password);
    return obj;
  },

  fromPartial(
    object: DeepPartial<SelfServiceChangePasswordRequest>
  ): SelfServiceChangePasswordRequest {
    const message = {
      ...baseSelfServiceChangePasswordRequest,
    } as SelfServiceChangePasswordRequest;
    if (object.password !== undefined && object.password !== null) {
      message.password = object.password;
    }
    return message;
  },
};

const baseSelfServiceChangePasswordResponse: object = {
  success: false,
  error: "",
};

export const SelfServiceChangePasswordResponse = {
  encode(
    message: SelfServiceChangePasswordResponse,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.success === true) {
      writer.uint32(8).bool(message.success);
    }
    if (message.error !== "") {
      writer.uint32(18).string(message.error);
    }
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): SelfServiceChangePasswordResponse {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseSelfServiceChangePasswordResponse,
    } as SelfServiceChangePasswordResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.success = reader.bool();
          break;
        case 2:
          message.error = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): SelfServiceChangePasswordResponse {
    const message = {
      ...baseSelfServiceChangePasswordResponse,
    } as SelfServiceChangePasswordResponse;
    if (object.success !== undefined && object.success !== null) {
      message.success = Boolean(object.success);
    }
    if (object.error !== undefined && object.error !== null) {
      message.error = String(object.error);
    }
    return message;
  },

  toJSON(message: SelfServiceChangePasswordResponse): unknown {
    const obj: any = {};
    message.success !== undefined && (obj.success = message.success);
    message.error !== undefined && (obj.error = message.error);
    return obj;
  },

  fromPartial(
    object: DeepPartial<SelfServiceChangePasswordResponse>
  ): SelfServiceChangePasswordResponse {
    const message = {
      ...baseSelfServiceChangePasswordResponse,
    } as SelfServiceChangePasswordResponse;
    if (object.success !== undefined && object.success !== null) {
      message.success = object.success;
    }
    if (object.error !== undefined && object.error !== null) {
      message.error = object.error;
    }
    return message;
  },
};

const baseCreateInvitationRequest: object = {
  referenceId: "",
  displayName: "",
};

export const CreateInvitationRequest = {
  encode(
    message: CreateInvitationRequest,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.tenantId.length !== 0) {
      writer.uint32(10).bytes(message.tenantId);
    }
    if (message.referenceId !== "") {
      writer.uint32(18).string(message.referenceId);
    }
    if (message.displayName !== "") {
      writer.uint32(26).string(message.displayName);
    }
    if (message.attributes !== undefined) {
      MapValue.encode(message.attributes, writer.uint32(34).fork()).ldelim();
    }
    if (message.createTime !== undefined) {
      Timestamp.encode(
        toTimestamp(message.createTime),
        writer.uint32(42).fork()
      ).ldelim();
    }
    if (message.expireTime !== undefined) {
      Timestamp.encode(
        toTimestamp(message.expireTime),
        writer.uint32(50).fork()
      ).ldelim();
    }
    if (message.invitee?.$case === "email") {
      writer.uint32(58).string(message.invitee.email);
    }
    if (message.invitee?.$case === "mobile") {
      writer.uint32(66).string(message.invitee.mobile);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): CreateInvitationRequest {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseCreateInvitationRequest,
    } as CreateInvitationRequest;
    message.tenantId = Buffer.alloc(0);
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.tenantId = reader.bytes() as Buffer;
          break;
        case 2:
          message.referenceId = reader.string();
          break;
        case 3:
          message.displayName = reader.string();
          break;
        case 4:
          message.attributes = MapValue.decode(reader, reader.uint32());
          break;
        case 5:
          message.createTime = fromTimestamp(
            Timestamp.decode(reader, reader.uint32())
          );
          break;
        case 6:
          message.expireTime = fromTimestamp(
            Timestamp.decode(reader, reader.uint32())
          );
          break;
        case 7:
          message.invitee = { $case: "email", email: reader.string() };
          break;
        case 8:
          message.invitee = { $case: "mobile", mobile: reader.string() };
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): CreateInvitationRequest {
    const message = {
      ...baseCreateInvitationRequest,
    } as CreateInvitationRequest;
    message.tenantId = Buffer.alloc(0);
    if (object.tenantId !== undefined && object.tenantId !== null) {
      message.tenantId = Buffer.from(bytesFromBase64(object.tenantId));
    }
    if (object.referenceId !== undefined && object.referenceId !== null) {
      message.referenceId = String(object.referenceId);
    }
    if (object.displayName !== undefined && object.displayName !== null) {
      message.displayName = String(object.displayName);
    }
    if (object.attributes !== undefined && object.attributes !== null) {
      message.attributes = MapValue.fromJSON(object.attributes);
    }
    if (object.createTime !== undefined && object.createTime !== null) {
      message.createTime = fromJsonTimestamp(object.createTime);
    }
    if (object.expireTime !== undefined && object.expireTime !== null) {
      message.expireTime = fromJsonTimestamp(object.expireTime);
    }
    if (object.email !== undefined && object.email !== null) {
      message.invitee = { $case: "email", email: String(object.email) };
    }
    if (object.mobile !== undefined && object.mobile !== null) {
      message.invitee = { $case: "mobile", mobile: String(object.mobile) };
    }
    return message;
  },

  toJSON(message: CreateInvitationRequest): unknown {
    const obj: any = {};
    message.tenantId !== undefined &&
      (obj.tenantId = base64FromBytes(
        message.tenantId !== undefined ? message.tenantId : Buffer.alloc(0)
      ));
    message.referenceId !== undefined &&
      (obj.referenceId = message.referenceId);
    message.displayName !== undefined &&
      (obj.displayName = message.displayName);
    message.attributes !== undefined &&
      (obj.attributes = message.attributes
        ? MapValue.toJSON(message.attributes)
        : undefined);
    message.createTime !== undefined &&
      (obj.createTime = message.createTime.toISOString());
    message.expireTime !== undefined &&
      (obj.expireTime = message.expireTime.toISOString());
    message.invitee?.$case === "email" && (obj.email = message.invitee?.email);
    message.invitee?.$case === "mobile" &&
      (obj.mobile = message.invitee?.mobile);
    return obj;
  },

  fromPartial(
    object: DeepPartial<CreateInvitationRequest>
  ): CreateInvitationRequest {
    const message = {
      ...baseCreateInvitationRequest,
    } as CreateInvitationRequest;
    if (object.tenantId !== undefined && object.tenantId !== null) {
      message.tenantId = object.tenantId;
    }
    if (object.referenceId !== undefined && object.referenceId !== null) {
      message.referenceId = object.referenceId;
    }
    if (object.displayName !== undefined && object.displayName !== null) {
      message.displayName = object.displayName;
    }
    if (object.attributes !== undefined && object.attributes !== null) {
      message.attributes = MapValue.fromPartial(object.attributes);
    }
    if (object.createTime !== undefined && object.createTime !== null) {
      message.createTime = object.createTime;
    }
    if (object.expireTime !== undefined && object.expireTime !== null) {
      message.expireTime = object.expireTime;
    }
    if (
      object.invitee?.$case === "email" &&
      object.invitee?.email !== undefined &&
      object.invitee?.email !== null
    ) {
      message.invitee = { $case: "email", email: object.invitee.email };
    }
    if (
      object.invitee?.$case === "mobile" &&
      object.invitee?.mobile !== undefined &&
      object.invitee?.mobile !== null
    ) {
      message.invitee = { $case: "mobile", mobile: object.invitee.mobile };
    }
    return message;
  },
};

const baseCreateInvitationResponse: object = { invitationKey: "" };

export const CreateInvitationResponse = {
  encode(
    message: CreateInvitationResponse,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.invitation !== undefined) {
      Invitation.encode(message.invitation, writer.uint32(10).fork()).ldelim();
    }
    if (message.invitationKey !== "") {
      writer.uint32(18).string(message.invitationKey);
    }
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): CreateInvitationResponse {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseCreateInvitationResponse,
    } as CreateInvitationResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.invitation = Invitation.decode(reader, reader.uint32());
          break;
        case 2:
          message.invitationKey = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): CreateInvitationResponse {
    const message = {
      ...baseCreateInvitationResponse,
    } as CreateInvitationResponse;
    if (object.invitation !== undefined && object.invitation !== null) {
      message.invitation = Invitation.fromJSON(object.invitation);
    }
    if (object.invitationKey !== undefined && object.invitationKey !== null) {
      message.invitationKey = String(object.invitationKey);
    }
    return message;
  },

  toJSON(message: CreateInvitationResponse): unknown {
    const obj: any = {};
    message.invitation !== undefined &&
      (obj.invitation = message.invitation
        ? Invitation.toJSON(message.invitation)
        : undefined);
    message.invitationKey !== undefined &&
      (obj.invitationKey = message.invitationKey);
    return obj;
  },

  fromPartial(
    object: DeepPartial<CreateInvitationResponse>
  ): CreateInvitationResponse {
    const message = {
      ...baseCreateInvitationResponse,
    } as CreateInvitationResponse;
    if (object.invitation !== undefined && object.invitation !== null) {
      message.invitation = Invitation.fromPartial(object.invitation);
    }
    if (object.invitationKey !== undefined && object.invitationKey !== null) {
      message.invitationKey = object.invitationKey;
    }
    return message;
  },
};

const baseCheckConsentChallengeRequest: object = { challenge: "" };

export const CheckConsentChallengeRequest = {
  encode(
    message: CheckConsentChallengeRequest,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.challenge !== "") {
      writer.uint32(10).string(message.challenge);
    }
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): CheckConsentChallengeRequest {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseCheckConsentChallengeRequest,
    } as CheckConsentChallengeRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.challenge = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): CheckConsentChallengeRequest {
    const message = {
      ...baseCheckConsentChallengeRequest,
    } as CheckConsentChallengeRequest;
    if (object.challenge !== undefined && object.challenge !== null) {
      message.challenge = String(object.challenge);
    }
    return message;
  },

  toJSON(message: CheckConsentChallengeRequest): unknown {
    const obj: any = {};
    message.challenge !== undefined && (obj.challenge = message.challenge);
    return obj;
  },

  fromPartial(
    object: DeepPartial<CheckConsentChallengeRequest>
  ): CheckConsentChallengeRequest {
    const message = {
      ...baseCheckConsentChallengeRequest,
    } as CheckConsentChallengeRequest;
    if (object.challenge !== undefined && object.challenge !== null) {
      message.challenge = object.challenge;
    }
    return message;
  },
};

const baseCheckConsentChallengeResponse: object = {
  clientId: "",
  acrs: "",
  requestUrl: "",
  skip: false,
  subjectIdentifier: "",
};

export const CheckConsentChallengeResponse = {
  encode(
    message: CheckConsentChallengeResponse,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.clientId !== "") {
      writer.uint32(10).string(message.clientId);
    }
    if (message.appSpaceId.length !== 0) {
      writer.uint32(18).bytes(message.appSpaceId);
    }
    for (const v of message.audiences) {
      AudienceItem.encode(v!, writer.uint32(26).fork()).ldelim();
    }
    for (const v of message.scopes) {
      ScopeItem.encode(v!, writer.uint32(34).fork()).ldelim();
    }
    for (const v of message.acrs) {
      writer.uint32(42).string(v!);
    }
    if (message.requestUrl !== "") {
      writer.uint32(50).string(message.requestUrl);
    }
    if (message.skip === true) {
      writer.uint32(56).bool(message.skip);
    }
    if (message.digitalTwin !== undefined) {
      DigitalTwin.encode(
        message.digitalTwin,
        writer.uint32(66).fork()
      ).ldelim();
    }
    if (message.subjectIdentifier !== "") {
      writer.uint32(74).string(message.subjectIdentifier);
    }
    if (message.authenticatedAt !== undefined) {
      Timestamp.encode(
        toTimestamp(message.authenticatedAt),
        writer.uint32(82).fork()
      ).ldelim();
    }
    if (message.requestedAt !== undefined) {
      Timestamp.encode(
        toTimestamp(message.requestedAt),
        writer.uint32(90).fork()
      ).ldelim();
    }
    if (message.context !== undefined) {
      MapValue.encode(message.context, writer.uint32(98).fork()).ldelim();
    }
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): CheckConsentChallengeResponse {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseCheckConsentChallengeResponse,
    } as CheckConsentChallengeResponse;
    message.audiences = [];
    message.scopes = [];
    message.acrs = [];
    message.appSpaceId = Buffer.alloc(0);
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.clientId = reader.string();
          break;
        case 2:
          message.appSpaceId = reader.bytes() as Buffer;
          break;
        case 3:
          message.audiences.push(AudienceItem.decode(reader, reader.uint32()));
          break;
        case 4:
          message.scopes.push(ScopeItem.decode(reader, reader.uint32()));
          break;
        case 5:
          message.acrs.push(reader.string());
          break;
        case 6:
          message.requestUrl = reader.string();
          break;
        case 7:
          message.skip = reader.bool();
          break;
        case 8:
          message.digitalTwin = DigitalTwin.decode(reader, reader.uint32());
          break;
        case 9:
          message.subjectIdentifier = reader.string();
          break;
        case 10:
          message.authenticatedAt = fromTimestamp(
            Timestamp.decode(reader, reader.uint32())
          );
          break;
        case 11:
          message.requestedAt = fromTimestamp(
            Timestamp.decode(reader, reader.uint32())
          );
          break;
        case 12:
          message.context = MapValue.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): CheckConsentChallengeResponse {
    const message = {
      ...baseCheckConsentChallengeResponse,
    } as CheckConsentChallengeResponse;
    message.audiences = [];
    message.scopes = [];
    message.acrs = [];
    message.appSpaceId = Buffer.alloc(0);
    if (object.clientId !== undefined && object.clientId !== null) {
      message.clientId = String(object.clientId);
    }
    if (object.appSpaceId !== undefined && object.appSpaceId !== null) {
      message.appSpaceId = Buffer.from(bytesFromBase64(object.appSpaceId));
    }
    if (object.audiences !== undefined && object.audiences !== null) {
      for (const e of object.audiences) {
        message.audiences.push(AudienceItem.fromJSON(e));
      }
    }
    if (object.scopes !== undefined && object.scopes !== null) {
      for (const e of object.scopes) {
        message.scopes.push(ScopeItem.fromJSON(e));
      }
    }
    if (object.acrs !== undefined && object.acrs !== null) {
      for (const e of object.acrs) {
        message.acrs.push(String(e));
      }
    }
    if (object.requestUrl !== undefined && object.requestUrl !== null) {
      message.requestUrl = String(object.requestUrl);
    }
    if (object.skip !== undefined && object.skip !== null) {
      message.skip = Boolean(object.skip);
    }
    if (object.digitalTwin !== undefined && object.digitalTwin !== null) {
      message.digitalTwin = DigitalTwin.fromJSON(object.digitalTwin);
    }
    if (
      object.subjectIdentifier !== undefined &&
      object.subjectIdentifier !== null
    ) {
      message.subjectIdentifier = String(object.subjectIdentifier);
    }
    if (
      object.authenticatedAt !== undefined &&
      object.authenticatedAt !== null
    ) {
      message.authenticatedAt = fromJsonTimestamp(object.authenticatedAt);
    }
    if (object.requestedAt !== undefined && object.requestedAt !== null) {
      message.requestedAt = fromJsonTimestamp(object.requestedAt);
    }
    if (object.context !== undefined && object.context !== null) {
      message.context = MapValue.fromJSON(object.context);
    }
    return message;
  },

  toJSON(message: CheckConsentChallengeResponse): unknown {
    const obj: any = {};
    message.clientId !== undefined && (obj.clientId = message.clientId);
    message.appSpaceId !== undefined &&
      (obj.appSpaceId = base64FromBytes(
        message.appSpaceId !== undefined ? message.appSpaceId : Buffer.alloc(0)
      ));
    if (message.audiences) {
      obj.audiences = message.audiences.map((e) =>
        e ? AudienceItem.toJSON(e) : undefined
      );
    } else {
      obj.audiences = [];
    }
    if (message.scopes) {
      obj.scopes = message.scopes.map((e) =>
        e ? ScopeItem.toJSON(e) : undefined
      );
    } else {
      obj.scopes = [];
    }
    if (message.acrs) {
      obj.acrs = message.acrs.map((e) => e);
    } else {
      obj.acrs = [];
    }
    message.requestUrl !== undefined && (obj.requestUrl = message.requestUrl);
    message.skip !== undefined && (obj.skip = message.skip);
    message.digitalTwin !== undefined &&
      (obj.digitalTwin = message.digitalTwin
        ? DigitalTwin.toJSON(message.digitalTwin)
        : undefined);
    message.subjectIdentifier !== undefined &&
      (obj.subjectIdentifier = message.subjectIdentifier);
    message.authenticatedAt !== undefined &&
      (obj.authenticatedAt = message.authenticatedAt.toISOString());
    message.requestedAt !== undefined &&
      (obj.requestedAt = message.requestedAt.toISOString());
    message.context !== undefined &&
      (obj.context = message.context
        ? MapValue.toJSON(message.context)
        : undefined);
    return obj;
  },

  fromPartial(
    object: DeepPartial<CheckConsentChallengeResponse>
  ): CheckConsentChallengeResponse {
    const message = {
      ...baseCheckConsentChallengeResponse,
    } as CheckConsentChallengeResponse;
    message.audiences = [];
    message.scopes = [];
    message.acrs = [];
    if (object.clientId !== undefined && object.clientId !== null) {
      message.clientId = object.clientId;
    }
    if (object.appSpaceId !== undefined && object.appSpaceId !== null) {
      message.appSpaceId = object.appSpaceId;
    }
    if (object.audiences !== undefined && object.audiences !== null) {
      for (const e of object.audiences) {
        message.audiences.push(AudienceItem.fromPartial(e));
      }
    }
    if (object.scopes !== undefined && object.scopes !== null) {
      for (const e of object.scopes) {
        message.scopes.push(ScopeItem.fromPartial(e));
      }
    }
    if (object.acrs !== undefined && object.acrs !== null) {
      for (const e of object.acrs) {
        message.acrs.push(e);
      }
    }
    if (object.requestUrl !== undefined && object.requestUrl !== null) {
      message.requestUrl = object.requestUrl;
    }
    if (object.skip !== undefined && object.skip !== null) {
      message.skip = object.skip;
    }
    if (object.digitalTwin !== undefined && object.digitalTwin !== null) {
      message.digitalTwin = DigitalTwin.fromPartial(object.digitalTwin);
    }
    if (
      object.subjectIdentifier !== undefined &&
      object.subjectIdentifier !== null
    ) {
      message.subjectIdentifier = object.subjectIdentifier;
    }
    if (
      object.authenticatedAt !== undefined &&
      object.authenticatedAt !== null
    ) {
      message.authenticatedAt = object.authenticatedAt;
    }
    if (object.requestedAt !== undefined && object.requestedAt !== null) {
      message.requestedAt = object.requestedAt;
    }
    if (object.context !== undefined && object.context !== null) {
      message.context = MapValue.fromPartial(object.context);
    }
    return message;
  },
};

const baseScopeItem: object = {
  name: "",
  displayName: "",
  description: "",
  required: false,
};

export const ScopeItem = {
  encode(message: ScopeItem, writer: Writer = Writer.create()): Writer {
    if (message.name !== "") {
      writer.uint32(10).string(message.name);
    }
    if (message.displayName !== "") {
      writer.uint32(18).string(message.displayName);
    }
    if (message.description !== "") {
      writer.uint32(26).string(message.description);
    }
    if (message.required === true) {
      writer.uint32(32).bool(message.required);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): ScopeItem {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseScopeItem } as ScopeItem;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.name = reader.string();
          break;
        case 2:
          message.displayName = reader.string();
          break;
        case 3:
          message.description = reader.string();
          break;
        case 4:
          message.required = reader.bool();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ScopeItem {
    const message = { ...baseScopeItem } as ScopeItem;
    if (object.name !== undefined && object.name !== null) {
      message.name = String(object.name);
    }
    if (object.displayName !== undefined && object.displayName !== null) {
      message.displayName = String(object.displayName);
    }
    if (object.description !== undefined && object.description !== null) {
      message.description = String(object.description);
    }
    if (object.required !== undefined && object.required !== null) {
      message.required = Boolean(object.required);
    }
    return message;
  },

  toJSON(message: ScopeItem): unknown {
    const obj: any = {};
    message.name !== undefined && (obj.name = message.name);
    message.displayName !== undefined &&
      (obj.displayName = message.displayName);
    message.description !== undefined &&
      (obj.description = message.description);
    message.required !== undefined && (obj.required = message.required);
    return obj;
  },

  fromPartial(object: DeepPartial<ScopeItem>): ScopeItem {
    const message = { ...baseScopeItem } as ScopeItem;
    if (object.name !== undefined && object.name !== null) {
      message.name = object.name;
    }
    if (object.displayName !== undefined && object.displayName !== null) {
      message.displayName = object.displayName;
    }
    if (object.description !== undefined && object.description !== null) {
      message.description = object.description;
    }
    if (object.required !== undefined && object.required !== null) {
      message.required = object.required;
    }
    return message;
  },
};

const baseAudienceItem: object = {
  userSupportEmailAddress: "",
  clientId: "",
  displayName: "",
  description: "",
  logoUrl: "",
  homepageUrl: "",
  privacyPolicyUrl: "",
  tosUrl: "",
};

export const AudienceItem = {
  encode(message: AudienceItem, writer: Writer = Writer.create()): Writer {
    if (message.userSupportEmailAddress !== "") {
      writer.uint32(10).string(message.userSupportEmailAddress);
    }
    if (message.clientId !== "") {
      writer.uint32(18).string(message.clientId);
    }
    if (message.displayName !== "") {
      writer.uint32(26).string(message.displayName);
    }
    if (message.description !== "") {
      writer.uint32(34).string(message.description);
    }
    if (message.logoUrl !== "") {
      writer.uint32(42).string(message.logoUrl);
    }
    if (message.homepageUrl !== "") {
      writer.uint32(50).string(message.homepageUrl);
    }
    if (message.privacyPolicyUrl !== "") {
      writer.uint32(58).string(message.privacyPolicyUrl);
    }
    if (message.tosUrl !== "") {
      writer.uint32(66).string(message.tosUrl);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): AudienceItem {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseAudienceItem } as AudienceItem;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.userSupportEmailAddress = reader.string();
          break;
        case 2:
          message.clientId = reader.string();
          break;
        case 3:
          message.displayName = reader.string();
          break;
        case 4:
          message.description = reader.string();
          break;
        case 5:
          message.logoUrl = reader.string();
          break;
        case 6:
          message.homepageUrl = reader.string();
          break;
        case 7:
          message.privacyPolicyUrl = reader.string();
          break;
        case 8:
          message.tosUrl = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): AudienceItem {
    const message = { ...baseAudienceItem } as AudienceItem;
    if (
      object.userSupportEmailAddress !== undefined &&
      object.userSupportEmailAddress !== null
    ) {
      message.userSupportEmailAddress = String(object.userSupportEmailAddress);
    }
    if (object.clientId !== undefined && object.clientId !== null) {
      message.clientId = String(object.clientId);
    }
    if (object.displayName !== undefined && object.displayName !== null) {
      message.displayName = String(object.displayName);
    }
    if (object.description !== undefined && object.description !== null) {
      message.description = String(object.description);
    }
    if (object.logoUrl !== undefined && object.logoUrl !== null) {
      message.logoUrl = String(object.logoUrl);
    }
    if (object.homepageUrl !== undefined && object.homepageUrl !== null) {
      message.homepageUrl = String(object.homepageUrl);
    }
    if (
      object.privacyPolicyUrl !== undefined &&
      object.privacyPolicyUrl !== null
    ) {
      message.privacyPolicyUrl = String(object.privacyPolicyUrl);
    }
    if (object.tosUrl !== undefined && object.tosUrl !== null) {
      message.tosUrl = String(object.tosUrl);
    }
    return message;
  },

  toJSON(message: AudienceItem): unknown {
    const obj: any = {};
    message.userSupportEmailAddress !== undefined &&
      (obj.userSupportEmailAddress = message.userSupportEmailAddress);
    message.clientId !== undefined && (obj.clientId = message.clientId);
    message.displayName !== undefined &&
      (obj.displayName = message.displayName);
    message.description !== undefined &&
      (obj.description = message.description);
    message.logoUrl !== undefined && (obj.logoUrl = message.logoUrl);
    message.homepageUrl !== undefined &&
      (obj.homepageUrl = message.homepageUrl);
    message.privacyPolicyUrl !== undefined &&
      (obj.privacyPolicyUrl = message.privacyPolicyUrl);
    message.tosUrl !== undefined && (obj.tosUrl = message.tosUrl);
    return obj;
  },

  fromPartial(object: DeepPartial<AudienceItem>): AudienceItem {
    const message = { ...baseAudienceItem } as AudienceItem;
    if (
      object.userSupportEmailAddress !== undefined &&
      object.userSupportEmailAddress !== null
    ) {
      message.userSupportEmailAddress = object.userSupportEmailAddress;
    }
    if (object.clientId !== undefined && object.clientId !== null) {
      message.clientId = object.clientId;
    }
    if (object.displayName !== undefined && object.displayName !== null) {
      message.displayName = object.displayName;
    }
    if (object.description !== undefined && object.description !== null) {
      message.description = object.description;
    }
    if (object.logoUrl !== undefined && object.logoUrl !== null) {
      message.logoUrl = object.logoUrl;
    }
    if (object.homepageUrl !== undefined && object.homepageUrl !== null) {
      message.homepageUrl = object.homepageUrl;
    }
    if (
      object.privacyPolicyUrl !== undefined &&
      object.privacyPolicyUrl !== null
    ) {
      message.privacyPolicyUrl = object.privacyPolicyUrl;
    }
    if (object.tosUrl !== undefined && object.tosUrl !== null) {
      message.tosUrl = object.tosUrl;
    }
    return message;
  },
};

const baseCreateConsentVerifierRequest: object = { challenge: "" };

export const CreateConsentVerifierRequest = {
  encode(
    message: CreateConsentVerifierRequest,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.challenge !== "") {
      writer.uint32(10).string(message.challenge);
    }
    if (message.result?.$case === "approval") {
      ConsentApproval.encode(
        message.result.approval,
        writer.uint32(18).fork()
      ).ldelim();
    }
    if (message.result?.$case === "denial") {
      DenialResponse.encode(
        message.result.denial,
        writer.uint32(26).fork()
      ).ldelim();
    }
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): CreateConsentVerifierRequest {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseCreateConsentVerifierRequest,
    } as CreateConsentVerifierRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.challenge = reader.string();
          break;
        case 2:
          message.result = {
            $case: "approval",
            approval: ConsentApproval.decode(reader, reader.uint32()),
          };
          break;
        case 3:
          message.result = {
            $case: "denial",
            denial: DenialResponse.decode(reader, reader.uint32()),
          };
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): CreateConsentVerifierRequest {
    const message = {
      ...baseCreateConsentVerifierRequest,
    } as CreateConsentVerifierRequest;
    if (object.challenge !== undefined && object.challenge !== null) {
      message.challenge = String(object.challenge);
    }
    if (object.approval !== undefined && object.approval !== null) {
      message.result = {
        $case: "approval",
        approval: ConsentApproval.fromJSON(object.approval),
      };
    }
    if (object.denial !== undefined && object.denial !== null) {
      message.result = {
        $case: "denial",
        denial: DenialResponse.fromJSON(object.denial),
      };
    }
    return message;
  },

  toJSON(message: CreateConsentVerifierRequest): unknown {
    const obj: any = {};
    message.challenge !== undefined && (obj.challenge = message.challenge);
    message.result?.$case === "approval" &&
      (obj.approval = message.result?.approval
        ? ConsentApproval.toJSON(message.result?.approval)
        : undefined);
    message.result?.$case === "denial" &&
      (obj.denial = message.result?.denial
        ? DenialResponse.toJSON(message.result?.denial)
        : undefined);
    return obj;
  },

  fromPartial(
    object: DeepPartial<CreateConsentVerifierRequest>
  ): CreateConsentVerifierRequest {
    const message = {
      ...baseCreateConsentVerifierRequest,
    } as CreateConsentVerifierRequest;
    if (object.challenge !== undefined && object.challenge !== null) {
      message.challenge = object.challenge;
    }
    if (
      object.result?.$case === "approval" &&
      object.result?.approval !== undefined &&
      object.result?.approval !== null
    ) {
      message.result = {
        $case: "approval",
        approval: ConsentApproval.fromPartial(object.result.approval),
      };
    }
    if (
      object.result?.$case === "denial" &&
      object.result?.denial !== undefined &&
      object.result?.denial !== null
    ) {
      message.result = {
        $case: "denial",
        denial: DenialResponse.fromPartial(object.result.denial),
      };
    }
    return message;
  },
};

const baseCreateConsentVerifierResponse: object = {
  verifier: "",
  authorizationEndpoint: "",
};

export const CreateConsentVerifierResponse = {
  encode(
    message: CreateConsentVerifierResponse,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.verifier !== "") {
      writer.uint32(10).string(message.verifier);
    }
    if (message.authorizationEndpoint !== "") {
      writer.uint32(18).string(message.authorizationEndpoint);
    }
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): CreateConsentVerifierResponse {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseCreateConsentVerifierResponse,
    } as CreateConsentVerifierResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.verifier = reader.string();
          break;
        case 2:
          message.authorizationEndpoint = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): CreateConsentVerifierResponse {
    const message = {
      ...baseCreateConsentVerifierResponse,
    } as CreateConsentVerifierResponse;
    if (object.verifier !== undefined && object.verifier !== null) {
      message.verifier = String(object.verifier);
    }
    if (
      object.authorizationEndpoint !== undefined &&
      object.authorizationEndpoint !== null
    ) {
      message.authorizationEndpoint = String(object.authorizationEndpoint);
    }
    return message;
  },

  toJSON(message: CreateConsentVerifierResponse): unknown {
    const obj: any = {};
    message.verifier !== undefined && (obj.verifier = message.verifier);
    message.authorizationEndpoint !== undefined &&
      (obj.authorizationEndpoint = message.authorizationEndpoint);
    return obj;
  },

  fromPartial(
    object: DeepPartial<CreateConsentVerifierResponse>
  ): CreateConsentVerifierResponse {
    const message = {
      ...baseCreateConsentVerifierResponse,
    } as CreateConsentVerifierResponse;
    if (object.verifier !== undefined && object.verifier !== null) {
      message.verifier = object.verifier;
    }
    if (
      object.authorizationEndpoint !== undefined &&
      object.authorizationEndpoint !== null
    ) {
      message.authorizationEndpoint = object.authorizationEndpoint;
    }
    return message;
  },
};

const baseConsentApproval: object = {
  grantScopes: "",
  grantedAudiences: "",
  remember: false,
  rememberFor: "0",
};

export const ConsentApproval = {
  encode(message: ConsentApproval, writer: Writer = Writer.create()): Writer {
    for (const v of message.grantScopes) {
      writer.uint32(10).string(v!);
    }
    for (const v of message.grantedAudiences) {
      writer.uint32(18).string(v!);
    }
    if (message.session !== undefined) {
      ConsentRequestSessionData.encode(
        message.session,
        writer.uint32(26).fork()
      ).ldelim();
    }
    if (message.remember === true) {
      writer.uint32(32).bool(message.remember);
    }
    if (message.rememberFor !== "0") {
      writer.uint32(40).int64(message.rememberFor);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): ConsentApproval {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseConsentApproval } as ConsentApproval;
    message.grantScopes = [];
    message.grantedAudiences = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.grantScopes.push(reader.string());
          break;
        case 2:
          message.grantedAudiences.push(reader.string());
          break;
        case 3:
          message.session = ConsentRequestSessionData.decode(
            reader,
            reader.uint32()
          );
          break;
        case 4:
          message.remember = reader.bool();
          break;
        case 5:
          message.rememberFor = longToString(reader.int64() as Long);
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ConsentApproval {
    const message = { ...baseConsentApproval } as ConsentApproval;
    message.grantScopes = [];
    message.grantedAudiences = [];
    if (object.grantScopes !== undefined && object.grantScopes !== null) {
      for (const e of object.grantScopes) {
        message.grantScopes.push(String(e));
      }
    }
    if (
      object.grantedAudiences !== undefined &&
      object.grantedAudiences !== null
    ) {
      for (const e of object.grantedAudiences) {
        message.grantedAudiences.push(String(e));
      }
    }
    if (object.session !== undefined && object.session !== null) {
      message.session = ConsentRequestSessionData.fromJSON(object.session);
    }
    if (object.remember !== undefined && object.remember !== null) {
      message.remember = Boolean(object.remember);
    }
    if (object.rememberFor !== undefined && object.rememberFor !== null) {
      message.rememberFor = String(object.rememberFor);
    }
    return message;
  },

  toJSON(message: ConsentApproval): unknown {
    const obj: any = {};
    if (message.grantScopes) {
      obj.grantScopes = message.grantScopes.map((e) => e);
    } else {
      obj.grantScopes = [];
    }
    if (message.grantedAudiences) {
      obj.grantedAudiences = message.grantedAudiences.map((e) => e);
    } else {
      obj.grantedAudiences = [];
    }
    message.session !== undefined &&
      (obj.session = message.session
        ? ConsentRequestSessionData.toJSON(message.session)
        : undefined);
    message.remember !== undefined && (obj.remember = message.remember);
    message.rememberFor !== undefined &&
      (obj.rememberFor = message.rememberFor);
    return obj;
  },

  fromPartial(object: DeepPartial<ConsentApproval>): ConsentApproval {
    const message = { ...baseConsentApproval } as ConsentApproval;
    message.grantScopes = [];
    message.grantedAudiences = [];
    if (object.grantScopes !== undefined && object.grantScopes !== null) {
      for (const e of object.grantScopes) {
        message.grantScopes.push(e);
      }
    }
    if (
      object.grantedAudiences !== undefined &&
      object.grantedAudiences !== null
    ) {
      for (const e of object.grantedAudiences) {
        message.grantedAudiences.push(e);
      }
    }
    if (object.session !== undefined && object.session !== null) {
      message.session = ConsentRequestSessionData.fromPartial(object.session);
    }
    if (object.remember !== undefined && object.remember !== null) {
      message.remember = object.remember;
    }
    if (object.rememberFor !== undefined && object.rememberFor !== null) {
      message.rememberFor = object.rememberFor;
    }
    return message;
  },
};

const baseConsentRequestSessionData: object = {};

export const ConsentRequestSessionData = {
  encode(
    message: ConsentRequestSessionData,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.accessToken !== undefined) {
      MapValue.encode(message.accessToken, writer.uint32(10).fork()).ldelim();
    }
    if (message.idToken !== undefined) {
      MapValue.encode(message.idToken, writer.uint32(18).fork()).ldelim();
    }
    if (message.userinfo !== undefined) {
      MapValue.encode(message.userinfo, writer.uint32(26).fork()).ldelim();
    }
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): ConsentRequestSessionData {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseConsentRequestSessionData,
    } as ConsentRequestSessionData;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.accessToken = MapValue.decode(reader, reader.uint32());
          break;
        case 2:
          message.idToken = MapValue.decode(reader, reader.uint32());
          break;
        case 3:
          message.userinfo = MapValue.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ConsentRequestSessionData {
    const message = {
      ...baseConsentRequestSessionData,
    } as ConsentRequestSessionData;
    if (object.accessToken !== undefined && object.accessToken !== null) {
      message.accessToken = MapValue.fromJSON(object.accessToken);
    }
    if (object.idToken !== undefined && object.idToken !== null) {
      message.idToken = MapValue.fromJSON(object.idToken);
    }
    if (object.userinfo !== undefined && object.userinfo !== null) {
      message.userinfo = MapValue.fromJSON(object.userinfo);
    }
    return message;
  },

  toJSON(message: ConsentRequestSessionData): unknown {
    const obj: any = {};
    message.accessToken !== undefined &&
      (obj.accessToken = message.accessToken
        ? MapValue.toJSON(message.accessToken)
        : undefined);
    message.idToken !== undefined &&
      (obj.idToken = message.idToken
        ? MapValue.toJSON(message.idToken)
        : undefined);
    message.userinfo !== undefined &&
      (obj.userinfo = message.userinfo
        ? MapValue.toJSON(message.userinfo)
        : undefined);
    return obj;
  },

  fromPartial(
    object: DeepPartial<ConsentRequestSessionData>
  ): ConsentRequestSessionData {
    const message = {
      ...baseConsentRequestSessionData,
    } as ConsentRequestSessionData;
    if (object.accessToken !== undefined && object.accessToken !== null) {
      message.accessToken = MapValue.fromPartial(object.accessToken);
    }
    if (object.idToken !== undefined && object.idToken !== null) {
      message.idToken = MapValue.fromPartial(object.idToken);
    }
    if (object.userinfo !== undefined && object.userinfo !== null) {
      message.userinfo = MapValue.fromPartial(object.userinfo);
    }
    return message;
  },
};

const baseDenialResponse: object = {
  error: "",
  errorDescription: "",
  errorHint: "",
  statusCode: "0",
};

export const DenialResponse = {
  encode(message: DenialResponse, writer: Writer = Writer.create()): Writer {
    if (message.error !== "") {
      writer.uint32(10).string(message.error);
    }
    if (message.errorDescription !== "") {
      writer.uint32(18).string(message.errorDescription);
    }
    if (message.errorHint !== "") {
      writer.uint32(26).string(message.errorHint);
    }
    if (message.statusCode !== "0") {
      writer.uint32(32).int64(message.statusCode);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): DenialResponse {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseDenialResponse } as DenialResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.error = reader.string();
          break;
        case 2:
          message.errorDescription = reader.string();
          break;
        case 3:
          message.errorHint = reader.string();
          break;
        case 4:
          message.statusCode = longToString(reader.int64() as Long);
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): DenialResponse {
    const message = { ...baseDenialResponse } as DenialResponse;
    if (object.error !== undefined && object.error !== null) {
      message.error = String(object.error);
    }
    if (
      object.errorDescription !== undefined &&
      object.errorDescription !== null
    ) {
      message.errorDescription = String(object.errorDescription);
    }
    if (object.errorHint !== undefined && object.errorHint !== null) {
      message.errorHint = String(object.errorHint);
    }
    if (object.statusCode !== undefined && object.statusCode !== null) {
      message.statusCode = String(object.statusCode);
    }
    return message;
  },

  toJSON(message: DenialResponse): unknown {
    const obj: any = {};
    message.error !== undefined && (obj.error = message.error);
    message.errorDescription !== undefined &&
      (obj.errorDescription = message.errorDescription);
    message.errorHint !== undefined && (obj.errorHint = message.errorHint);
    message.statusCode !== undefined && (obj.statusCode = message.statusCode);
    return obj;
  },

  fromPartial(object: DeepPartial<DenialResponse>): DenialResponse {
    const message = { ...baseDenialResponse } as DenialResponse;
    if (object.error !== undefined && object.error !== null) {
      message.error = object.error;
    }
    if (
      object.errorDescription !== undefined &&
      object.errorDescription !== null
    ) {
      message.errorDescription = object.errorDescription;
    }
    if (object.errorHint !== undefined && object.errorHint !== null) {
      message.errorHint = object.errorHint;
    }
    if (object.statusCode !== undefined && object.statusCode !== null) {
      message.statusCode = object.statusCode;
    }
    return message;
  },
};

const baseGetAccessTokenRequest: object = {
  appId: "",
  providerId: "",
  providerName: "",
  subjectId: "",
  scopes: "",
  offlineAccess: false,
};

export const GetAccessTokenRequest = {
  encode(
    message: GetAccessTokenRequest,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.appId !== "") {
      writer.uint32(10).string(message.appId);
    }
    if (message.providerId !== "") {
      writer.uint32(18).string(message.providerId);
    }
    if (message.providerName !== "") {
      writer.uint32(34).string(message.providerName);
    }
    if (message.subjectId !== "") {
      writer.uint32(42).string(message.subjectId);
    }
    for (const v of message.scopes) {
      writer.uint32(50).string(v!);
    }
    if (message.offlineAccess === true) {
      writer.uint32(56).bool(message.offlineAccess);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): GetAccessTokenRequest {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseGetAccessTokenRequest } as GetAccessTokenRequest;
    message.scopes = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.appId = reader.string();
          break;
        case 2:
          message.providerId = reader.string();
          break;
        case 4:
          message.providerName = reader.string();
          break;
        case 5:
          message.subjectId = reader.string();
          break;
        case 6:
          message.scopes.push(reader.string());
          break;
        case 7:
          message.offlineAccess = reader.bool();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetAccessTokenRequest {
    const message = { ...baseGetAccessTokenRequest } as GetAccessTokenRequest;
    message.scopes = [];
    if (object.appId !== undefined && object.appId !== null) {
      message.appId = String(object.appId);
    }
    if (object.providerId !== undefined && object.providerId !== null) {
      message.providerId = String(object.providerId);
    }
    if (object.providerName !== undefined && object.providerName !== null) {
      message.providerName = String(object.providerName);
    }
    if (object.subjectId !== undefined && object.subjectId !== null) {
      message.subjectId = String(object.subjectId);
    }
    if (object.scopes !== undefined && object.scopes !== null) {
      for (const e of object.scopes) {
        message.scopes.push(String(e));
      }
    }
    if (object.offlineAccess !== undefined && object.offlineAccess !== null) {
      message.offlineAccess = Boolean(object.offlineAccess);
    }
    return message;
  },

  toJSON(message: GetAccessTokenRequest): unknown {
    const obj: any = {};
    message.appId !== undefined && (obj.appId = message.appId);
    message.providerId !== undefined && (obj.providerId = message.providerId);
    message.providerName !== undefined &&
      (obj.providerName = message.providerName);
    message.subjectId !== undefined && (obj.subjectId = message.subjectId);
    if (message.scopes) {
      obj.scopes = message.scopes.map((e) => e);
    } else {
      obj.scopes = [];
    }
    message.offlineAccess !== undefined &&
      (obj.offlineAccess = message.offlineAccess);
    return obj;
  },

  fromPartial(
    object: DeepPartial<GetAccessTokenRequest>
  ): GetAccessTokenRequest {
    const message = { ...baseGetAccessTokenRequest } as GetAccessTokenRequest;
    message.scopes = [];
    if (object.appId !== undefined && object.appId !== null) {
      message.appId = object.appId;
    }
    if (object.providerId !== undefined && object.providerId !== null) {
      message.providerId = object.providerId;
    }
    if (object.providerName !== undefined && object.providerName !== null) {
      message.providerName = object.providerName;
    }
    if (object.subjectId !== undefined && object.subjectId !== null) {
      message.subjectId = object.subjectId;
    }
    if (object.scopes !== undefined && object.scopes !== null) {
      for (const e of object.scopes) {
        message.scopes.push(e);
      }
    }
    if (object.offlineAccess !== undefined && object.offlineAccess !== null) {
      message.offlineAccess = object.offlineAccess;
    }
    return message;
  },
};

const baseGetAccessTokenResponse: object = {};

export const GetAccessTokenResponse = {
  encode(
    message: GetAccessTokenResponse,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.token !== undefined) {
      OAuth2TokenResponse.encode(
        message.token,
        writer.uint32(10).fork()
      ).ldelim();
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): GetAccessTokenResponse {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseGetAccessTokenResponse } as GetAccessTokenResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.token = OAuth2TokenResponse.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetAccessTokenResponse {
    const message = { ...baseGetAccessTokenResponse } as GetAccessTokenResponse;
    if (object.token !== undefined && object.token !== null) {
      message.token = OAuth2TokenResponse.fromJSON(object.token);
    }
    return message;
  },

  toJSON(message: GetAccessTokenResponse): unknown {
    const obj: any = {};
    message.token !== undefined &&
      (obj.token = message.token
        ? OAuth2TokenResponse.toJSON(message.token)
        : undefined);
    return obj;
  },

  fromPartial(
    object: DeepPartial<GetAccessTokenResponse>
  ): GetAccessTokenResponse {
    const message = { ...baseGetAccessTokenResponse } as GetAccessTokenResponse;
    if (object.token !== undefined && object.token !== null) {
      message.token = OAuth2TokenResponse.fromPartial(object.token);
    }
    return message;
  },
};

const baseSessionIntrospectRequest: object = { token: "" };

export const SessionIntrospectRequest = {
  encode(
    message: SessionIntrospectRequest,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.tenantId.length !== 0) {
      writer.uint32(10).bytes(message.tenantId);
    }
    if (message.token !== "") {
      writer.uint32(18).string(message.token);
    }
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): SessionIntrospectRequest {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseSessionIntrospectRequest,
    } as SessionIntrospectRequest;
    message.tenantId = Buffer.alloc(0);
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.tenantId = reader.bytes() as Buffer;
          break;
        case 2:
          message.token = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): SessionIntrospectRequest {
    const message = {
      ...baseSessionIntrospectRequest,
    } as SessionIntrospectRequest;
    message.tenantId = Buffer.alloc(0);
    if (object.tenantId !== undefined && object.tenantId !== null) {
      message.tenantId = Buffer.from(bytesFromBase64(object.tenantId));
    }
    if (object.token !== undefined && object.token !== null) {
      message.token = String(object.token);
    }
    return message;
  },

  toJSON(message: SessionIntrospectRequest): unknown {
    const obj: any = {};
    message.tenantId !== undefined &&
      (obj.tenantId = base64FromBytes(
        message.tenantId !== undefined ? message.tenantId : Buffer.alloc(0)
      ));
    message.token !== undefined && (obj.token = message.token);
    return obj;
  },

  fromPartial(
    object: DeepPartial<SessionIntrospectRequest>
  ): SessionIntrospectRequest {
    const message = {
      ...baseSessionIntrospectRequest,
    } as SessionIntrospectRequest;
    if (object.tenantId !== undefined && object.tenantId !== null) {
      message.tenantId = object.tenantId;
    }
    if (object.token !== undefined && object.token !== null) {
      message.token = object.token;
    }
    return message;
  },
};

const baseSessionIntrospectResponse: object = {
  active: false,
  providerData: "",
};

export const SessionIntrospectResponse = {
  encode(
    message: SessionIntrospectResponse,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.active === true) {
      writer.uint32(8).bool(message.active);
    }
    if (message.tokenInfo !== undefined) {
      IdentityTokenInfo.encode(
        message.tokenInfo,
        writer.uint32(18).fork()
      ).ldelim();
    }
    for (const v of message.providerData) {
      writer.uint32(26).string(v!);
    }
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): SessionIntrospectResponse {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseSessionIntrospectResponse,
    } as SessionIntrospectResponse;
    message.providerData = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.active = reader.bool();
          break;
        case 2:
          message.tokenInfo = IdentityTokenInfo.decode(reader, reader.uint32());
          break;
        case 3:
          message.providerData.push(reader.string());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): SessionIntrospectResponse {
    const message = {
      ...baseSessionIntrospectResponse,
    } as SessionIntrospectResponse;
    message.providerData = [];
    if (object.active !== undefined && object.active !== null) {
      message.active = Boolean(object.active);
    }
    if (object.tokenInfo !== undefined && object.tokenInfo !== null) {
      message.tokenInfo = IdentityTokenInfo.fromJSON(object.tokenInfo);
    }
    if (object.providerData !== undefined && object.providerData !== null) {
      for (const e of object.providerData) {
        message.providerData.push(String(e));
      }
    }
    return message;
  },

  toJSON(message: SessionIntrospectResponse): unknown {
    const obj: any = {};
    message.active !== undefined && (obj.active = message.active);
    message.tokenInfo !== undefined &&
      (obj.tokenInfo = message.tokenInfo
        ? IdentityTokenInfo.toJSON(message.tokenInfo)
        : undefined);
    if (message.providerData) {
      obj.providerData = message.providerData.map((e) => e);
    } else {
      obj.providerData = [];
    }
    return obj;
  },

  fromPartial(
    object: DeepPartial<SessionIntrospectResponse>
  ): SessionIntrospectResponse {
    const message = {
      ...baseSessionIntrospectResponse,
    } as SessionIntrospectResponse;
    message.providerData = [];
    if (object.active !== undefined && object.active !== null) {
      message.active = object.active;
    }
    if (object.tokenInfo !== undefined && object.tokenInfo !== null) {
      message.tokenInfo = IdentityTokenInfo.fromPartial(object.tokenInfo);
    }
    if (object.providerData !== undefined && object.providerData !== null) {
      for (const e of object.providerData) {
        message.providerData.push(e);
      }
    }
    return message;
  },
};

/** IdentityManagementAPI represents the service interface to manage the Identities and their data. */
export const IdentityManagementAPIService = {
  /**
   * TokenIntrospect function validates the token and returns information about it.
   *
   * This is a protected operation and it can be accessed only with valid agent credentials!
   */
  tokenIntrospect: {
    path: "/indykite.identity.v1beta1.IdentityManagementAPI/TokenIntrospect",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: TokenIntrospectRequest) =>
      Buffer.from(TokenIntrospectRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => TokenIntrospectRequest.decode(value),
    responseSerialize: (value: TokenIntrospectResponse) =>
      Buffer.from(TokenIntrospectResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) =>
      TokenIntrospectResponse.decode(value),
  },
  /**
   * StartForgottenPasswordFlow function initiates the flow where systems sends a notification to DigitalTwin
   * with a link to set the new password.
   *
   * The flow checks if the DigitalTwin has primary contact information and if so it sends a message with a link.
   * By opening the link the UI SDK guides the User-Agent through the Authentication Flow where the user is
   * allowed to set a new Password credential.
   *
   * This is a protected operation and it can be accessed only with valid agent credentials!
   */
  startForgottenPasswordFlow: {
    path: "/indykite.identity.v1beta1.IdentityManagementAPI/StartForgottenPasswordFlow",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: StartForgottenPasswordFlowRequest) =>
      Buffer.from(StartForgottenPasswordFlowRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) =>
      StartForgottenPasswordFlowRequest.decode(value),
    responseSerialize: (value: StartForgottenPasswordFlowResponse) =>
      Buffer.from(StartForgottenPasswordFlowResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) =>
      StartForgottenPasswordFlowResponse.decode(value),
  },
  /**
   * ChangePassword function allows the Application to replace the Password credential of a DigitalTwin.
   *
   * This is a protected operation and it can be accessed only with valid agent credentials!
   */
  changePassword: {
    path: "/indykite.identity.v1beta1.IdentityManagementAPI/ChangePassword",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: ChangePasswordRequest) =>
      Buffer.from(ChangePasswordRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => ChangePasswordRequest.decode(value),
    responseSerialize: (value: ChangePasswordResponse) =>
      Buffer.from(ChangePasswordResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) =>
      ChangePasswordResponse.decode(value),
  },
  /**
   * StartDigitalTwinEmailVerification function initiates the flow where Indykite systems sends a
   * notification to DigitalTwin with a link to verify the control over
   * the notification channel (email only for now).
   *
   * This is a protected operation and it can be accessed only with valid agent credentials!
   */
  startDigitalTwinEmailVerification: {
    path: "/indykite.identity.v1beta1.IdentityManagementAPI/StartDigitalTwinEmailVerification",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: StartDigitalTwinEmailVerificationRequest) =>
      Buffer.from(
        StartDigitalTwinEmailVerificationRequest.encode(value).finish()
      ),
    requestDeserialize: (value: Buffer) =>
      StartDigitalTwinEmailVerificationRequest.decode(value),
    responseSerialize: (value: StartDigitalTwinEmailVerificationResponse) =>
      Buffer.from(
        StartDigitalTwinEmailVerificationResponse.encode(value).finish()
      ),
    responseDeserialize: (value: Buffer) =>
      StartDigitalTwinEmailVerificationResponse.decode(value),
  },
  /**
   * VerifyDigitalTwinEmail function confirms to IndyKite system that the message from
   * StartDigitalTwinEmailVerification function was sent and user visited the link.
   *
   * This is a protected operation and it can be accessed only with valid agent credentials!
   */
  verifyDigitalTwinEmail: {
    path: "/indykite.identity.v1beta1.IdentityManagementAPI/VerifyDigitalTwinEmail",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: VerifyDigitalTwinEmailRequest) =>
      Buffer.from(VerifyDigitalTwinEmailRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) =>
      VerifyDigitalTwinEmailRequest.decode(value),
    responseSerialize: (value: VerifyDigitalTwinEmailResponse) =>
      Buffer.from(VerifyDigitalTwinEmailResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) =>
      VerifyDigitalTwinEmailResponse.decode(value),
  },
  /**
   * SelfServiceTerminateSession function terminates and invalidates a login session.
   *
   * This is a protected operation and it can be accessed by both credentials,
   * with valid agent or DigitalTwin credential.
   */
  selfServiceTerminateSession: {
    path: "/indykite.identity.v1beta1.IdentityManagementAPI/SelfServiceTerminateSession",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: SelfServiceTerminateSessionRequest) =>
      Buffer.from(SelfServiceTerminateSessionRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) =>
      SelfServiceTerminateSessionRequest.decode(value),
    responseSerialize: (value: SelfServiceTerminateSessionResponse) =>
      Buffer.from(SelfServiceTerminateSessionResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) =>
      SelfServiceTerminateSessionResponse.decode(value),
  },
  /**
   * GetDigitalTwin gets a DigitalTwin and requested properties.
   *
   * This is a protected operation and it can be accessed only with valid agent credentials!
   */
  getDigitalTwin: {
    path: "/indykite.identity.v1beta1.IdentityManagementAPI/GetDigitalTwin",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: GetDigitalTwinRequest) =>
      Buffer.from(GetDigitalTwinRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => GetDigitalTwinRequest.decode(value),
    responseSerialize: (value: GetDigitalTwinResponse) =>
      Buffer.from(GetDigitalTwinResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) =>
      GetDigitalTwinResponse.decode(value),
  },
  /**
   * ListDigitalTwins lists DigitalTwins matching the filter.
   *
   * This is a protected operation and it can be accessed only with valid agent credentials!
   */
  listDigitalTwins: {
    path: "/indykite.identity.v1beta1.IdentityManagementAPI/ListDigitalTwins",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: ListDigitalTwinsRequest) =>
      Buffer.from(ListDigitalTwinsRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) =>
      ListDigitalTwinsRequest.decode(value),
    responseSerialize: (value: ListDigitalTwinsResponse) =>
      Buffer.from(ListDigitalTwinsResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) =>
      ListDigitalTwinsResponse.decode(value),
  },
  /**
   * PatchDigitalTwin updates the properties of a DigitalTwin.
   *
   * This is a protected operation and it can be accessed only with valid agent credentials!
   */
  patchDigitalTwin: {
    path: "/indykite.identity.v1beta1.IdentityManagementAPI/PatchDigitalTwin",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: PatchDigitalTwinRequest) =>
      Buffer.from(PatchDigitalTwinRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) =>
      PatchDigitalTwinRequest.decode(value),
    responseSerialize: (value: PatchDigitalTwinResponse) =>
      Buffer.from(PatchDigitalTwinResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) =>
      PatchDigitalTwinResponse.decode(value),
  },
  /**
   * DeleteDigitalTwin deletes the given DigitalTwin entirely from the system.
   *
   * This operation can't be restored.
   *
   * This is a protected operation and it can be accessed only with valid agent credentials!
   */
  deleteDigitalTwin: {
    path: "/indykite.identity.v1beta1.IdentityManagementAPI/DeleteDigitalTwin",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: DeleteDigitalTwinRequest) =>
      Buffer.from(DeleteDigitalTwinRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) =>
      DeleteDigitalTwinRequest.decode(value),
    responseSerialize: (value: DeleteDigitalTwinResponse) =>
      Buffer.from(DeleteDigitalTwinResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) =>
      DeleteDigitalTwinResponse.decode(value),
  },
  /**
   * GetDocument gets a single document.
   *
   * This is a protected operation and it can be accessed only with valid agent credentials!
   */
  getDocument: {
    path: "/indykite.identity.v1beta1.IdentityManagementAPI/GetDocument",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: GetDocumentRequest) =>
      Buffer.from(GetDocumentRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => GetDocumentRequest.decode(value),
    responseSerialize: (value: GetDocumentResponse) =>
      Buffer.from(GetDocumentResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) => GetDocumentResponse.decode(value),
  },
  /**
   * BatchGetDocuments gets multiple documents.
   *
   * This is a protected operation and it can be accessed only with valid agent credentials!
   */
  batchGetDocuments: {
    path: "/indykite.identity.v1beta1.IdentityManagementAPI/BatchGetDocuments",
    requestStream: false,
    responseStream: true,
    requestSerialize: (value: BatchGetDocumentsRequest) =>
      Buffer.from(BatchGetDocumentsRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) =>
      BatchGetDocumentsRequest.decode(value),
    responseSerialize: (value: BatchGetDocumentsResponse) =>
      Buffer.from(BatchGetDocumentsResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) =>
      BatchGetDocumentsResponse.decode(value),
  },
  /**
   * ListDocuments lists documents.
   *
   * This is a protected operation and it can be accessed only with valid agent credentials!
   */
  listDocuments: {
    path: "/indykite.identity.v1beta1.IdentityManagementAPI/ListDocuments",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: ListDocumentsRequest) =>
      Buffer.from(ListDocumentsRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => ListDocumentsRequest.decode(value),
    responseSerialize: (value: ListDocumentsResponse) =>
      Buffer.from(ListDocumentsResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) => ListDocumentsResponse.decode(value),
  },
  /**
   * MutateDocuments in single transaction creates, updates and deletes the requested documents.
   *
   * This is a protected operation and it can be accessed only with valid agent credentials!
   */
  mutateDocuments: {
    path: "/indykite.identity.v1beta1.IdentityManagementAPI/MutateDocuments",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: MutateDocumentsRequest) =>
      Buffer.from(MutateDocumentsRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => MutateDocumentsRequest.decode(value),
    responseSerialize: (value: MutateDocumentsResponse) =>
      Buffer.from(MutateDocumentsResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) =>
      MutateDocumentsResponse.decode(value),
  },
  /**
   * RunQuery runs a query. NOT YET SUPPORTED!
   *
   * This is a protected operation and it can be accessed only with valid agent credentials!
   */
  runQuery: {
    path: "/indykite.identity.v1beta1.IdentityManagementAPI/RunQuery",
    requestStream: false,
    responseStream: true,
    requestSerialize: (value: RunQueryRequest) =>
      Buffer.from(RunQueryRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => RunQueryRequest.decode(value),
    responseSerialize: (value: RunQueryResponse) =>
      Buffer.from(RunQueryResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) => RunQueryResponse.decode(value),
  },
  /** CheckConsentChallenge read the Consent Challenge from DB. */
  checkConsentChallenge: {
    path: "/indykite.identity.v1beta1.IdentityManagementAPI/CheckConsentChallenge",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: CheckConsentChallengeRequest) =>
      Buffer.from(CheckConsentChallengeRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) =>
      CheckConsentChallengeRequest.decode(value),
    responseSerialize: (value: CheckConsentChallengeResponse) =>
      Buffer.from(CheckConsentChallengeResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) =>
      CheckConsentChallengeResponse.decode(value),
  },
  /** CreateConsentVerifier invalidates the Consent Challenge and creates a new Consent Verifier. */
  createConsentVerifier: {
    path: "/indykite.identity.v1beta1.IdentityManagementAPI/CreateConsentVerifier",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: CreateConsentVerifierRequest) =>
      Buffer.from(CreateConsentVerifierRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) =>
      CreateConsentVerifierRequest.decode(value),
    responseSerialize: (value: CreateConsentVerifierResponse) =>
      Buffer.from(CreateConsentVerifierResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) =>
      CreateConsentVerifierResponse.decode(value),
  },
  /** TODO Password Management */
  getPasswordCredential: {
    path: "/indykite.identity.v1beta1.IdentityManagementAPI/GetPasswordCredential",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: GetPasswordCredentialRequest) =>
      Buffer.from(GetPasswordCredentialRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) =>
      GetPasswordCredentialRequest.decode(value),
    responseSerialize: (value: GetPasswordCredentialResponse) =>
      Buffer.from(GetPasswordCredentialResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) =>
      GetPasswordCredentialResponse.decode(value),
  },
  updatePasswordCredential: {
    path: "/indykite.identity.v1beta1.IdentityManagementAPI/UpdatePasswordCredential",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: UpdatePasswordCredentialRequest) =>
      Buffer.from(UpdatePasswordCredentialRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) =>
      UpdatePasswordCredentialRequest.decode(value),
    responseSerialize: (value: UpdatePasswordCredentialResponse) =>
      Buffer.from(UpdatePasswordCredentialResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) =>
      UpdatePasswordCredentialResponse.decode(value),
  },
  /** CreateInvitation. */
  createInvitation: {
    path: "/indykite.identity.v1beta1.IdentityManagementAPI/CreateInvitation",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: CreateInvitationRequest) =>
      Buffer.from(CreateInvitationRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) =>
      CreateInvitationRequest.decode(value),
    responseSerialize: (value: CreateInvitationResponse) =>
      Buffer.from(CreateInvitationResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) =>
      CreateInvitationResponse.decode(value),
  },
  /**
   * rpc CreateInvitation (UpdateInvitationRequest) returns (UpdateInvitationResponse) {
   *    }
   *    rpc ListInvitation (ListInvitationRequest) returns (stream ListInvitationResponse) {
   *    }
   *    rpc DeleteInvitation (DeleteInvitationRequest) returns (DeleteInvitationResponse) {
   *    }
   * GetAccessToken get a new active access_token for requested provider.
   */
  getAccessToken: {
    path: "/indykite.identity.v1beta1.IdentityManagementAPI/GetAccessToken",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: GetAccessTokenRequest) =>
      Buffer.from(GetAccessTokenRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => GetAccessTokenRequest.decode(value),
    responseSerialize: (value: GetAccessTokenResponse) =>
      Buffer.from(GetAccessTokenResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) =>
      GetAccessTokenResponse.decode(value),
  },
  /** SessionIntrospect ... */
  sessionIntrospect: {
    path: "/indykite.identity.v1beta1.IdentityManagementAPI/SessionIntrospect",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: SessionIntrospectRequest) =>
      Buffer.from(SessionIntrospectRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) =>
      SessionIntrospectRequest.decode(value),
    responseSerialize: (value: SessionIntrospectResponse) =>
      Buffer.from(SessionIntrospectResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) =>
      SessionIntrospectResponse.decode(value),
  },
} as const;

export interface IdentityManagementAPIServer
  extends UntypedServiceImplementation {
  /**
   * TokenIntrospect function validates the token and returns information about it.
   *
   * This is a protected operation and it can be accessed only with valid agent credentials!
   */
  tokenIntrospect: handleUnaryCall<
    TokenIntrospectRequest,
    TokenIntrospectResponse
  >;
  /**
   * StartForgottenPasswordFlow function initiates the flow where systems sends a notification to DigitalTwin
   * with a link to set the new password.
   *
   * The flow checks if the DigitalTwin has primary contact information and if so it sends a message with a link.
   * By opening the link the UI SDK guides the User-Agent through the Authentication Flow where the user is
   * allowed to set a new Password credential.
   *
   * This is a protected operation and it can be accessed only with valid agent credentials!
   */
  startForgottenPasswordFlow: handleUnaryCall<
    StartForgottenPasswordFlowRequest,
    StartForgottenPasswordFlowResponse
  >;
  /**
   * ChangePassword function allows the Application to replace the Password credential of a DigitalTwin.
   *
   * This is a protected operation and it can be accessed only with valid agent credentials!
   */
  changePassword: handleUnaryCall<
    ChangePasswordRequest,
    ChangePasswordResponse
  >;
  /**
   * StartDigitalTwinEmailVerification function initiates the flow where Indykite systems sends a
   * notification to DigitalTwin with a link to verify the control over
   * the notification channel (email only for now).
   *
   * This is a protected operation and it can be accessed only with valid agent credentials!
   */
  startDigitalTwinEmailVerification: handleUnaryCall<
    StartDigitalTwinEmailVerificationRequest,
    StartDigitalTwinEmailVerificationResponse
  >;
  /**
   * VerifyDigitalTwinEmail function confirms to IndyKite system that the message from
   * StartDigitalTwinEmailVerification function was sent and user visited the link.
   *
   * This is a protected operation and it can be accessed only with valid agent credentials!
   */
  verifyDigitalTwinEmail: handleUnaryCall<
    VerifyDigitalTwinEmailRequest,
    VerifyDigitalTwinEmailResponse
  >;
  /**
   * SelfServiceTerminateSession function terminates and invalidates a login session.
   *
   * This is a protected operation and it can be accessed by both credentials,
   * with valid agent or DigitalTwin credential.
   */
  selfServiceTerminateSession: handleUnaryCall<
    SelfServiceTerminateSessionRequest,
    SelfServiceTerminateSessionResponse
  >;
  /**
   * GetDigitalTwin gets a DigitalTwin and requested properties.
   *
   * This is a protected operation and it can be accessed only with valid agent credentials!
   */
  getDigitalTwin: handleUnaryCall<
    GetDigitalTwinRequest,
    GetDigitalTwinResponse
  >;
  /**
   * ListDigitalTwins lists DigitalTwins matching the filter.
   *
   * This is a protected operation and it can be accessed only with valid agent credentials!
   */
  listDigitalTwins: handleUnaryCall<
    ListDigitalTwinsRequest,
    ListDigitalTwinsResponse
  >;
  /**
   * PatchDigitalTwin updates the properties of a DigitalTwin.
   *
   * This is a protected operation and it can be accessed only with valid agent credentials!
   */
  patchDigitalTwin: handleUnaryCall<
    PatchDigitalTwinRequest,
    PatchDigitalTwinResponse
  >;
  /**
   * DeleteDigitalTwin deletes the given DigitalTwin entirely from the system.
   *
   * This operation can't be restored.
   *
   * This is a protected operation and it can be accessed only with valid agent credentials!
   */
  deleteDigitalTwin: handleUnaryCall<
    DeleteDigitalTwinRequest,
    DeleteDigitalTwinResponse
  >;
  /**
   * GetDocument gets a single document.
   *
   * This is a protected operation and it can be accessed only with valid agent credentials!
   */
  getDocument: handleUnaryCall<GetDocumentRequest, GetDocumentResponse>;
  /**
   * BatchGetDocuments gets multiple documents.
   *
   * This is a protected operation and it can be accessed only with valid agent credentials!
   */
  batchGetDocuments: handleServerStreamingCall<
    BatchGetDocumentsRequest,
    BatchGetDocumentsResponse
  >;
  /**
   * ListDocuments lists documents.
   *
   * This is a protected operation and it can be accessed only with valid agent credentials!
   */
  listDocuments: handleUnaryCall<ListDocumentsRequest, ListDocumentsResponse>;
  /**
   * MutateDocuments in single transaction creates, updates and deletes the requested documents.
   *
   * This is a protected operation and it can be accessed only with valid agent credentials!
   */
  mutateDocuments: handleUnaryCall<
    MutateDocumentsRequest,
    MutateDocumentsResponse
  >;
  /**
   * RunQuery runs a query. NOT YET SUPPORTED!
   *
   * This is a protected operation and it can be accessed only with valid agent credentials!
   */
  runQuery: handleServerStreamingCall<RunQueryRequest, RunQueryResponse>;
  /** CheckConsentChallenge read the Consent Challenge from DB. */
  checkConsentChallenge: handleUnaryCall<
    CheckConsentChallengeRequest,
    CheckConsentChallengeResponse
  >;
  /** CreateConsentVerifier invalidates the Consent Challenge and creates a new Consent Verifier. */
  createConsentVerifier: handleUnaryCall<
    CreateConsentVerifierRequest,
    CreateConsentVerifierResponse
  >;
  /** TODO Password Management */
  getPasswordCredential: handleUnaryCall<
    GetPasswordCredentialRequest,
    GetPasswordCredentialResponse
  >;
  updatePasswordCredential: handleUnaryCall<
    UpdatePasswordCredentialRequest,
    UpdatePasswordCredentialResponse
  >;
  /** CreateInvitation. */
  createInvitation: handleUnaryCall<
    CreateInvitationRequest,
    CreateInvitationResponse
  >;
  /**
   * rpc CreateInvitation (UpdateInvitationRequest) returns (UpdateInvitationResponse) {
   *    }
   *    rpc ListInvitation (ListInvitationRequest) returns (stream ListInvitationResponse) {
   *    }
   *    rpc DeleteInvitation (DeleteInvitationRequest) returns (DeleteInvitationResponse) {
   *    }
   * GetAccessToken get a new active access_token for requested provider.
   */
  getAccessToken: handleUnaryCall<
    GetAccessTokenRequest,
    GetAccessTokenResponse
  >;
  /** SessionIntrospect ... */
  sessionIntrospect: handleUnaryCall<
    SessionIntrospectRequest,
    SessionIntrospectResponse
  >;
}

export interface IdentityManagementAPIClient extends Client {
  /**
   * TokenIntrospect function validates the token and returns information about it.
   *
   * This is a protected operation and it can be accessed only with valid agent credentials!
   */
  tokenIntrospect(
    request: TokenIntrospectRequest,
    callback: (
      error: ServiceError | null,
      response: TokenIntrospectResponse
    ) => void
  ): ClientUnaryCall;
  tokenIntrospect(
    request: TokenIntrospectRequest,
    metadata: Metadata,
    callback: (
      error: ServiceError | null,
      response: TokenIntrospectResponse
    ) => void
  ): ClientUnaryCall;
  tokenIntrospect(
    request: TokenIntrospectRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (
      error: ServiceError | null,
      response: TokenIntrospectResponse
    ) => void
  ): ClientUnaryCall;
  /**
   * StartForgottenPasswordFlow function initiates the flow where systems sends a notification to DigitalTwin
   * with a link to set the new password.
   *
   * The flow checks if the DigitalTwin has primary contact information and if so it sends a message with a link.
   * By opening the link the UI SDK guides the User-Agent through the Authentication Flow where the user is
   * allowed to set a new Password credential.
   *
   * This is a protected operation and it can be accessed only with valid agent credentials!
   */
  startForgottenPasswordFlow(
    request: StartForgottenPasswordFlowRequest,
    callback: (
      error: ServiceError | null,
      response: StartForgottenPasswordFlowResponse
    ) => void
  ): ClientUnaryCall;
  startForgottenPasswordFlow(
    request: StartForgottenPasswordFlowRequest,
    metadata: Metadata,
    callback: (
      error: ServiceError | null,
      response: StartForgottenPasswordFlowResponse
    ) => void
  ): ClientUnaryCall;
  startForgottenPasswordFlow(
    request: StartForgottenPasswordFlowRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (
      error: ServiceError | null,
      response: StartForgottenPasswordFlowResponse
    ) => void
  ): ClientUnaryCall;
  /**
   * ChangePassword function allows the Application to replace the Password credential of a DigitalTwin.
   *
   * This is a protected operation and it can be accessed only with valid agent credentials!
   */
  changePassword(
    request: ChangePasswordRequest,
    callback: (
      error: ServiceError | null,
      response: ChangePasswordResponse
    ) => void
  ): ClientUnaryCall;
  changePassword(
    request: ChangePasswordRequest,
    metadata: Metadata,
    callback: (
      error: ServiceError | null,
      response: ChangePasswordResponse
    ) => void
  ): ClientUnaryCall;
  changePassword(
    request: ChangePasswordRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (
      error: ServiceError | null,
      response: ChangePasswordResponse
    ) => void
  ): ClientUnaryCall;
  /**
   * StartDigitalTwinEmailVerification function initiates the flow where Indykite systems sends a
   * notification to DigitalTwin with a link to verify the control over
   * the notification channel (email only for now).
   *
   * This is a protected operation and it can be accessed only with valid agent credentials!
   */
  startDigitalTwinEmailVerification(
    request: StartDigitalTwinEmailVerificationRequest,
    callback: (
      error: ServiceError | null,
      response: StartDigitalTwinEmailVerificationResponse
    ) => void
  ): ClientUnaryCall;
  startDigitalTwinEmailVerification(
    request: StartDigitalTwinEmailVerificationRequest,
    metadata: Metadata,
    callback: (
      error: ServiceError | null,
      response: StartDigitalTwinEmailVerificationResponse
    ) => void
  ): ClientUnaryCall;
  startDigitalTwinEmailVerification(
    request: StartDigitalTwinEmailVerificationRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (
      error: ServiceError | null,
      response: StartDigitalTwinEmailVerificationResponse
    ) => void
  ): ClientUnaryCall;
  /**
   * VerifyDigitalTwinEmail function confirms to IndyKite system that the message from
   * StartDigitalTwinEmailVerification function was sent and user visited the link.
   *
   * This is a protected operation and it can be accessed only with valid agent credentials!
   */
  verifyDigitalTwinEmail(
    request: VerifyDigitalTwinEmailRequest,
    callback: (
      error: ServiceError | null,
      response: VerifyDigitalTwinEmailResponse
    ) => void
  ): ClientUnaryCall;
  verifyDigitalTwinEmail(
    request: VerifyDigitalTwinEmailRequest,
    metadata: Metadata,
    callback: (
      error: ServiceError | null,
      response: VerifyDigitalTwinEmailResponse
    ) => void
  ): ClientUnaryCall;
  verifyDigitalTwinEmail(
    request: VerifyDigitalTwinEmailRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (
      error: ServiceError | null,
      response: VerifyDigitalTwinEmailResponse
    ) => void
  ): ClientUnaryCall;
  /**
   * SelfServiceTerminateSession function terminates and invalidates a login session.
   *
   * This is a protected operation and it can be accessed by both credentials,
   * with valid agent or DigitalTwin credential.
   */
  selfServiceTerminateSession(
    request: SelfServiceTerminateSessionRequest,
    callback: (
      error: ServiceError | null,
      response: SelfServiceTerminateSessionResponse
    ) => void
  ): ClientUnaryCall;
  selfServiceTerminateSession(
    request: SelfServiceTerminateSessionRequest,
    metadata: Metadata,
    callback: (
      error: ServiceError | null,
      response: SelfServiceTerminateSessionResponse
    ) => void
  ): ClientUnaryCall;
  selfServiceTerminateSession(
    request: SelfServiceTerminateSessionRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (
      error: ServiceError | null,
      response: SelfServiceTerminateSessionResponse
    ) => void
  ): ClientUnaryCall;
  /**
   * GetDigitalTwin gets a DigitalTwin and requested properties.
   *
   * This is a protected operation and it can be accessed only with valid agent credentials!
   */
  getDigitalTwin(
    request: GetDigitalTwinRequest,
    callback: (
      error: ServiceError | null,
      response: GetDigitalTwinResponse
    ) => void
  ): ClientUnaryCall;
  getDigitalTwin(
    request: GetDigitalTwinRequest,
    metadata: Metadata,
    callback: (
      error: ServiceError | null,
      response: GetDigitalTwinResponse
    ) => void
  ): ClientUnaryCall;
  getDigitalTwin(
    request: GetDigitalTwinRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (
      error: ServiceError | null,
      response: GetDigitalTwinResponse
    ) => void
  ): ClientUnaryCall;
  /**
   * ListDigitalTwins lists DigitalTwins matching the filter.
   *
   * This is a protected operation and it can be accessed only with valid agent credentials!
   */
  listDigitalTwins(
    request: ListDigitalTwinsRequest,
    callback: (
      error: ServiceError | null,
      response: ListDigitalTwinsResponse
    ) => void
  ): ClientUnaryCall;
  listDigitalTwins(
    request: ListDigitalTwinsRequest,
    metadata: Metadata,
    callback: (
      error: ServiceError | null,
      response: ListDigitalTwinsResponse
    ) => void
  ): ClientUnaryCall;
  listDigitalTwins(
    request: ListDigitalTwinsRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (
      error: ServiceError | null,
      response: ListDigitalTwinsResponse
    ) => void
  ): ClientUnaryCall;
  /**
   * PatchDigitalTwin updates the properties of a DigitalTwin.
   *
   * This is a protected operation and it can be accessed only with valid agent credentials!
   */
  patchDigitalTwin(
    request: PatchDigitalTwinRequest,
    callback: (
      error: ServiceError | null,
      response: PatchDigitalTwinResponse
    ) => void
  ): ClientUnaryCall;
  patchDigitalTwin(
    request: PatchDigitalTwinRequest,
    metadata: Metadata,
    callback: (
      error: ServiceError | null,
      response: PatchDigitalTwinResponse
    ) => void
  ): ClientUnaryCall;
  patchDigitalTwin(
    request: PatchDigitalTwinRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (
      error: ServiceError | null,
      response: PatchDigitalTwinResponse
    ) => void
  ): ClientUnaryCall;
  /**
   * DeleteDigitalTwin deletes the given DigitalTwin entirely from the system.
   *
   * This operation can't be restored.
   *
   * This is a protected operation and it can be accessed only with valid agent credentials!
   */
  deleteDigitalTwin(
    request: DeleteDigitalTwinRequest,
    callback: (
      error: ServiceError | null,
      response: DeleteDigitalTwinResponse
    ) => void
  ): ClientUnaryCall;
  deleteDigitalTwin(
    request: DeleteDigitalTwinRequest,
    metadata: Metadata,
    callback: (
      error: ServiceError | null,
      response: DeleteDigitalTwinResponse
    ) => void
  ): ClientUnaryCall;
  deleteDigitalTwin(
    request: DeleteDigitalTwinRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (
      error: ServiceError | null,
      response: DeleteDigitalTwinResponse
    ) => void
  ): ClientUnaryCall;
  /**
   * GetDocument gets a single document.
   *
   * This is a protected operation and it can be accessed only with valid agent credentials!
   */
  getDocument(
    request: GetDocumentRequest,
    callback: (
      error: ServiceError | null,
      response: GetDocumentResponse
    ) => void
  ): ClientUnaryCall;
  getDocument(
    request: GetDocumentRequest,
    metadata: Metadata,
    callback: (
      error: ServiceError | null,
      response: GetDocumentResponse
    ) => void
  ): ClientUnaryCall;
  getDocument(
    request: GetDocumentRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (
      error: ServiceError | null,
      response: GetDocumentResponse
    ) => void
  ): ClientUnaryCall;
  /**
   * BatchGetDocuments gets multiple documents.
   *
   * This is a protected operation and it can be accessed only with valid agent credentials!
   */
  batchGetDocuments(
    request: BatchGetDocumentsRequest,
    options?: Partial<CallOptions>
  ): ClientReadableStream<BatchGetDocumentsResponse>;
  batchGetDocuments(
    request: BatchGetDocumentsRequest,
    metadata?: Metadata,
    options?: Partial<CallOptions>
  ): ClientReadableStream<BatchGetDocumentsResponse>;
  /**
   * ListDocuments lists documents.
   *
   * This is a protected operation and it can be accessed only with valid agent credentials!
   */
  listDocuments(
    request: ListDocumentsRequest,
    callback: (
      error: ServiceError | null,
      response: ListDocumentsResponse
    ) => void
  ): ClientUnaryCall;
  listDocuments(
    request: ListDocumentsRequest,
    metadata: Metadata,
    callback: (
      error: ServiceError | null,
      response: ListDocumentsResponse
    ) => void
  ): ClientUnaryCall;
  listDocuments(
    request: ListDocumentsRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (
      error: ServiceError | null,
      response: ListDocumentsResponse
    ) => void
  ): ClientUnaryCall;
  /**
   * MutateDocuments in single transaction creates, updates and deletes the requested documents.
   *
   * This is a protected operation and it can be accessed only with valid agent credentials!
   */
  mutateDocuments(
    request: MutateDocumentsRequest,
    callback: (
      error: ServiceError | null,
      response: MutateDocumentsResponse
    ) => void
  ): ClientUnaryCall;
  mutateDocuments(
    request: MutateDocumentsRequest,
    metadata: Metadata,
    callback: (
      error: ServiceError | null,
      response: MutateDocumentsResponse
    ) => void
  ): ClientUnaryCall;
  mutateDocuments(
    request: MutateDocumentsRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (
      error: ServiceError | null,
      response: MutateDocumentsResponse
    ) => void
  ): ClientUnaryCall;
  /**
   * RunQuery runs a query. NOT YET SUPPORTED!
   *
   * This is a protected operation and it can be accessed only with valid agent credentials!
   */
  runQuery(
    request: RunQueryRequest,
    options?: Partial<CallOptions>
  ): ClientReadableStream<RunQueryResponse>;
  runQuery(
    request: RunQueryRequest,
    metadata?: Metadata,
    options?: Partial<CallOptions>
  ): ClientReadableStream<RunQueryResponse>;
  /** CheckConsentChallenge read the Consent Challenge from DB. */
  checkConsentChallenge(
    request: CheckConsentChallengeRequest,
    callback: (
      error: ServiceError | null,
      response: CheckConsentChallengeResponse
    ) => void
  ): ClientUnaryCall;
  checkConsentChallenge(
    request: CheckConsentChallengeRequest,
    metadata: Metadata,
    callback: (
      error: ServiceError | null,
      response: CheckConsentChallengeResponse
    ) => void
  ): ClientUnaryCall;
  checkConsentChallenge(
    request: CheckConsentChallengeRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (
      error: ServiceError | null,
      response: CheckConsentChallengeResponse
    ) => void
  ): ClientUnaryCall;
  /** CreateConsentVerifier invalidates the Consent Challenge and creates a new Consent Verifier. */
  createConsentVerifier(
    request: CreateConsentVerifierRequest,
    callback: (
      error: ServiceError | null,
      response: CreateConsentVerifierResponse
    ) => void
  ): ClientUnaryCall;
  createConsentVerifier(
    request: CreateConsentVerifierRequest,
    metadata: Metadata,
    callback: (
      error: ServiceError | null,
      response: CreateConsentVerifierResponse
    ) => void
  ): ClientUnaryCall;
  createConsentVerifier(
    request: CreateConsentVerifierRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (
      error: ServiceError | null,
      response: CreateConsentVerifierResponse
    ) => void
  ): ClientUnaryCall;
  /** TODO Password Management */
  getPasswordCredential(
    request: GetPasswordCredentialRequest,
    callback: (
      error: ServiceError | null,
      response: GetPasswordCredentialResponse
    ) => void
  ): ClientUnaryCall;
  getPasswordCredential(
    request: GetPasswordCredentialRequest,
    metadata: Metadata,
    callback: (
      error: ServiceError | null,
      response: GetPasswordCredentialResponse
    ) => void
  ): ClientUnaryCall;
  getPasswordCredential(
    request: GetPasswordCredentialRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (
      error: ServiceError | null,
      response: GetPasswordCredentialResponse
    ) => void
  ): ClientUnaryCall;
  updatePasswordCredential(
    request: UpdatePasswordCredentialRequest,
    callback: (
      error: ServiceError | null,
      response: UpdatePasswordCredentialResponse
    ) => void
  ): ClientUnaryCall;
  updatePasswordCredential(
    request: UpdatePasswordCredentialRequest,
    metadata: Metadata,
    callback: (
      error: ServiceError | null,
      response: UpdatePasswordCredentialResponse
    ) => void
  ): ClientUnaryCall;
  updatePasswordCredential(
    request: UpdatePasswordCredentialRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (
      error: ServiceError | null,
      response: UpdatePasswordCredentialResponse
    ) => void
  ): ClientUnaryCall;
  /** CreateInvitation. */
  createInvitation(
    request: CreateInvitationRequest,
    callback: (
      error: ServiceError | null,
      response: CreateInvitationResponse
    ) => void
  ): ClientUnaryCall;
  createInvitation(
    request: CreateInvitationRequest,
    metadata: Metadata,
    callback: (
      error: ServiceError | null,
      response: CreateInvitationResponse
    ) => void
  ): ClientUnaryCall;
  createInvitation(
    request: CreateInvitationRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (
      error: ServiceError | null,
      response: CreateInvitationResponse
    ) => void
  ): ClientUnaryCall;
  /**
   * rpc CreateInvitation (UpdateInvitationRequest) returns (UpdateInvitationResponse) {
   *    }
   *    rpc ListInvitation (ListInvitationRequest) returns (stream ListInvitationResponse) {
   *    }
   *    rpc DeleteInvitation (DeleteInvitationRequest) returns (DeleteInvitationResponse) {
   *    }
   * GetAccessToken get a new active access_token for requested provider.
   */
  getAccessToken(
    request: GetAccessTokenRequest,
    callback: (
      error: ServiceError | null,
      response: GetAccessTokenResponse
    ) => void
  ): ClientUnaryCall;
  getAccessToken(
    request: GetAccessTokenRequest,
    metadata: Metadata,
    callback: (
      error: ServiceError | null,
      response: GetAccessTokenResponse
    ) => void
  ): ClientUnaryCall;
  getAccessToken(
    request: GetAccessTokenRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (
      error: ServiceError | null,
      response: GetAccessTokenResponse
    ) => void
  ): ClientUnaryCall;
  /** SessionIntrospect ... */
  sessionIntrospect(
    request: SessionIntrospectRequest,
    callback: (
      error: ServiceError | null,
      response: SessionIntrospectResponse
    ) => void
  ): ClientUnaryCall;
  sessionIntrospect(
    request: SessionIntrospectRequest,
    metadata: Metadata,
    callback: (
      error: ServiceError | null,
      response: SessionIntrospectResponse
    ) => void
  ): ClientUnaryCall;
  sessionIntrospect(
    request: SessionIntrospectRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (
      error: ServiceError | null,
      response: SessionIntrospectResponse
    ) => void
  ): ClientUnaryCall;
}

export const IdentityManagementAPIClient = makeGenericClientConstructor(
  IdentityManagementAPIService,
  "indykite.identity.v1beta1.IdentityManagementAPI"
) as unknown as {
  new (
    address: string,
    credentials: ChannelCredentials,
    options?: Partial<ChannelOptions>
  ): IdentityManagementAPIClient;
};

declare var self: any | undefined;
declare var window: any | undefined;
declare var global: any | undefined;
var globalThis: any = (() => {
  if (typeof globalThis !== "undefined") return globalThis;
  if (typeof self !== "undefined") return self;
  if (typeof window !== "undefined") return window;
  if (typeof global !== "undefined") return global;
  throw "Unable to locate global object";
})();

const atob: (b64: string) => string =
  globalThis.atob ||
  ((b64) => globalThis.Buffer.from(b64, "base64").toString("binary"));
function bytesFromBase64(b64: string): Uint8Array {
  const bin = atob(b64);
  const arr = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; ++i) {
    arr[i] = bin.charCodeAt(i);
  }
  return arr;
}

const btoa: (bin: string) => string =
  globalThis.btoa ||
  ((bin) => globalThis.Buffer.from(bin, "binary").toString("base64"));
function base64FromBytes(arr: Uint8Array): string {
  const bin: string[] = [];
  for (const byte of arr) {
    bin.push(String.fromCharCode(byte));
  }
  return btoa(bin.join(""));
}

type Builtin =
  | Date
  | Function
  | Uint8Array
  | string
  | number
  | boolean
  | undefined;
export type DeepPartial<T> = T extends Builtin
  ? T
  : T extends Array<infer U>
  ? Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U>
  ? ReadonlyArray<DeepPartial<U>>
  : T extends { $case: string }
  ? { [K in keyof Omit<T, "$case">]?: DeepPartial<T[K]> } & {
      $case: T["$case"];
    }
  : T extends {}
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

function toTimestamp(date: Date): Timestamp {
  const seconds = Math.trunc(date.getTime() / 1_000).toString();
  const nanos = (date.getTime() % 1_000) * 1_000_000;
  return { seconds, nanos };
}

function fromTimestamp(t: Timestamp): Date {
  let millis = Number(t.seconds) * 1_000;
  millis += t.nanos / 1_000_000;
  return new Date(millis);
}

function fromJsonTimestamp(o: any): Date {
  if (o instanceof Date) {
    return o;
  } else if (typeof o === "string") {
    return new Date(o);
  } else {
    return fromTimestamp(Timestamp.fromJSON(o));
  }
}

function longToString(long: Long) {
  return long.toString();
}

// If you get a compile-error about 'Constructor<Long> and ... have no overlap',
// add '--ts_proto_opt=esModuleInterop=true' as a flag when calling 'protoc'.
if (util.Long !== Long) {
  util.Long = Long as any;
  configure();
}
