/* eslint-disable */
import { util, configure, Writer, Reader } from "protobufjs/minimal";
import * as Long from "long";
import { Value } from "../../../google/protobuf/struct";
import { MapValue } from "../../../indykite/objects/v1beta1/struct";
import { Timestamp } from "../../../google/protobuf/timestamp";
import { Property } from "../../../indykite/identity/v1beta1/attributes";

export const protobufPackage = "indykite.identity.v1beta1";

/** Model contains the messages used in RPC. */

/** DigitalTwinState represents the state of an digital entity record. */
export enum DigitalTwinState {
  /** DIGITAL_TWIN_STATE_INVALID - Default unset state. */
  DIGITAL_TWIN_STATE_INVALID = 0,
  /** DIGITAL_TWIN_STATE_ACTIVE - Active entity state. */
  DIGITAL_TWIN_STATE_ACTIVE = 1,
  /** DIGITAL_TWIN_STATE_DISABLED - Temporarily suspended entity state. */
  DIGITAL_TWIN_STATE_DISABLED = 2,
  /** DIGITAL_TWIN_STATE_TOMBSTONE - Deleted entity state, left in the system for auditing purpose only. */
  DIGITAL_TWIN_STATE_TOMBSTONE = 4,
  UNRECOGNIZED = -1,
}

export function digitalTwinStateFromJSON(object: any): DigitalTwinState {
  switch (object) {
    case 0:
    case "DIGITAL_TWIN_STATE_INVALID":
      return DigitalTwinState.DIGITAL_TWIN_STATE_INVALID;
    case 1:
    case "DIGITAL_TWIN_STATE_ACTIVE":
      return DigitalTwinState.DIGITAL_TWIN_STATE_ACTIVE;
    case 2:
    case "DIGITAL_TWIN_STATE_DISABLED":
      return DigitalTwinState.DIGITAL_TWIN_STATE_DISABLED;
    case 4:
    case "DIGITAL_TWIN_STATE_TOMBSTONE":
      return DigitalTwinState.DIGITAL_TWIN_STATE_TOMBSTONE;
    case -1:
    case "UNRECOGNIZED":
    default:
      return DigitalTwinState.UNRECOGNIZED;
  }
}

export function digitalTwinStateToJSON(object: DigitalTwinState): string {
  switch (object) {
    case DigitalTwinState.DIGITAL_TWIN_STATE_INVALID:
      return "DIGITAL_TWIN_STATE_INVALID";
    case DigitalTwinState.DIGITAL_TWIN_STATE_ACTIVE:
      return "DIGITAL_TWIN_STATE_ACTIVE";
    case DigitalTwinState.DIGITAL_TWIN_STATE_DISABLED:
      return "DIGITAL_TWIN_STATE_DISABLED";
    case DigitalTwinState.DIGITAL_TWIN_STATE_TOMBSTONE:
      return "DIGITAL_TWIN_STATE_TOMBSTONE";
    default:
      return "UNKNOWN";
  }
}

/** DigitalTwinKind represents the kind of digital entity. */
export enum DigitalTwinKind {
  /** DIGITAL_TWIN_KIND_INVALID - Default unset value. */
  DIGITAL_TWIN_KIND_INVALID = 0,
  /** DIGITAL_TWIN_KIND_PERSON - This is a Person. */
  DIGITAL_TWIN_KIND_PERSON = 1,
  /** DIGITAL_TWIN_KIND_SERVICE - This is a Service Account. */
  DIGITAL_TWIN_KIND_SERVICE = 2,
  /** DIGITAL_TWIN_KIND_THING - This is a non living thing. */
  DIGITAL_TWIN_KIND_THING = 3,
  UNRECOGNIZED = -1,
}

export function digitalTwinKindFromJSON(object: any): DigitalTwinKind {
  switch (object) {
    case 0:
    case "DIGITAL_TWIN_KIND_INVALID":
      return DigitalTwinKind.DIGITAL_TWIN_KIND_INVALID;
    case 1:
    case "DIGITAL_TWIN_KIND_PERSON":
      return DigitalTwinKind.DIGITAL_TWIN_KIND_PERSON;
    case 2:
    case "DIGITAL_TWIN_KIND_SERVICE":
      return DigitalTwinKind.DIGITAL_TWIN_KIND_SERVICE;
    case 3:
    case "DIGITAL_TWIN_KIND_THING":
      return DigitalTwinKind.DIGITAL_TWIN_KIND_THING;
    case -1:
    case "UNRECOGNIZED":
    default:
      return DigitalTwinKind.UNRECOGNIZED;
  }
}

export function digitalTwinKindToJSON(object: DigitalTwinKind): string {
  switch (object) {
    case DigitalTwinKind.DIGITAL_TWIN_KIND_INVALID:
      return "DIGITAL_TWIN_KIND_INVALID";
    case DigitalTwinKind.DIGITAL_TWIN_KIND_PERSON:
      return "DIGITAL_TWIN_KIND_PERSON";
    case DigitalTwinKind.DIGITAL_TWIN_KIND_SERVICE:
      return "DIGITAL_TWIN_KIND_SERVICE";
    case DigitalTwinKind.DIGITAL_TWIN_KIND_THING:
      return "DIGITAL_TWIN_KIND_THING";
    default:
      return "UNKNOWN";
  }
}

/** ErrorCode ... */
export enum ErrorCode {
  ERROR_CODE_INVALID = 0,
  ERROR_CODE_INVALID_REQUEST = 1,
  ERROR_CODE_UNAUTHORIZED = 2,
  UNRECOGNIZED = -1,
}

export function errorCodeFromJSON(object: any): ErrorCode {
  switch (object) {
    case 0:
    case "ERROR_CODE_INVALID":
      return ErrorCode.ERROR_CODE_INVALID;
    case 1:
    case "ERROR_CODE_INVALID_REQUEST":
      return ErrorCode.ERROR_CODE_INVALID_REQUEST;
    case 2:
    case "ERROR_CODE_UNAUTHORIZED":
      return ErrorCode.ERROR_CODE_UNAUTHORIZED;
    case -1:
    case "UNRECOGNIZED":
    default:
      return ErrorCode.UNRECOGNIZED;
  }
}

export function errorCodeToJSON(object: ErrorCode): string {
  switch (object) {
    case ErrorCode.ERROR_CODE_INVALID:
      return "ERROR_CODE_INVALID";
    case ErrorCode.ERROR_CODE_INVALID_REQUEST:
      return "ERROR_CODE_INVALID_REQUEST";
    case ErrorCode.ERROR_CODE_UNAUTHORIZED:
      return "ERROR_CODE_UNAUTHORIZED";
    default:
      return "UNKNOWN";
  }
}

export enum ProviderType {
  PROVIDER_TYPE_INVALID = 0,
  PROVIDER_TYPE_PASSWORD = 1,
  PROVIDER_TYPE_OIDC = 2,
  PROVIDER_TYPE_WEBAUTHN = 3,
  PROVIDER_TYPE_EMAIL = 4,
  PROVIDER_TYPE_SMS = 5,
  UNRECOGNIZED = -1,
}

export function providerTypeFromJSON(object: any): ProviderType {
  switch (object) {
    case 0:
    case "PROVIDER_TYPE_INVALID":
      return ProviderType.PROVIDER_TYPE_INVALID;
    case 1:
    case "PROVIDER_TYPE_PASSWORD":
      return ProviderType.PROVIDER_TYPE_PASSWORD;
    case 2:
    case "PROVIDER_TYPE_OIDC":
      return ProviderType.PROVIDER_TYPE_OIDC;
    case 3:
    case "PROVIDER_TYPE_WEBAUTHN":
      return ProviderType.PROVIDER_TYPE_WEBAUTHN;
    case 4:
    case "PROVIDER_TYPE_EMAIL":
      return ProviderType.PROVIDER_TYPE_EMAIL;
    case 5:
    case "PROVIDER_TYPE_SMS":
      return ProviderType.PROVIDER_TYPE_SMS;
    case -1:
    case "UNRECOGNIZED":
    default:
      return ProviderType.UNRECOGNIZED;
  }
}

export function providerTypeToJSON(object: ProviderType): string {
  switch (object) {
    case ProviderType.PROVIDER_TYPE_INVALID:
      return "PROVIDER_TYPE_INVALID";
    case ProviderType.PROVIDER_TYPE_PASSWORD:
      return "PROVIDER_TYPE_PASSWORD";
    case ProviderType.PROVIDER_TYPE_OIDC:
      return "PROVIDER_TYPE_OIDC";
    case ProviderType.PROVIDER_TYPE_WEBAUTHN:
      return "PROVIDER_TYPE_WEBAUTHN";
    case ProviderType.PROVIDER_TYPE_EMAIL:
      return "PROVIDER_TYPE_EMAIL";
    case ProviderType.PROVIDER_TYPE_SMS:
      return "PROVIDER_TYPE_SMS";
    default:
      return "UNKNOWN";
  }
}

/** DigitalTwin represents a digital entity. */
export interface DigitalTwin {
  /** Id the unique credential identifier. */
  id: Buffer;
  /** TenantId the unique identifier of the tenant of Credential. */
  tenantId: Buffer;
  /** Kind .. */
  kind: DigitalTwinKind;
  /** State .. */
  state: DigitalTwinState;
}

export interface DigitalEntity {
  digitalTwin?: DigitalTwin;
  /** DigitalTwin created at property */
  createTime?: Date;
  /** Properties contains the requested property values. */
  properties: Property[];
}

/** ErrorMessage see [Problem Details for HTTP APIs](https://tools.ietf.org/html/rfc7807) ... */
export interface ErrorMessage {
  code: ErrorCode;
  message: string;
  detail?: Value;
}

/** Invitation represents a user invitation object. */
export interface Invitation {
  /** Globally unique identifier. */
  id: Buffer;
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

/**
 * WellKnown represents important OpenID Connect discovery metadata
 *
 * It includes links to several endpoints (e.g. /oauth2/token) and exposes information on supported signature algorithms
 * among others.
 */
export interface WellKnown {
  /**
   * URL using the https scheme with no query or fragment component that the OP asserts as its IssuerURL Identifier.
   * If IssuerURL discovery is supported , this value MUST be identical to the issuer value returned
   * by WebFinger. This also MUST be identical to the iss Claim value in ID Tokens issued from this IssuerURL.
   *
   * required: true
   */
  issuer: string;
  /**
   * URL of the OP's OAuth 2.0 Authorization Endpoint.
   *
   * required: true
   */
  authorizationEndpoint: string;
  /** URL of the OP's Dynamic Client Registration Endpoint. */
  registrationEndpoint: string;
  /**
   * URL of the OP's OAuth 2.0 Token Endpoint
   *
   * required: true
   */
  tokenEndpoint: string;
  /**
   * URL of the OP's JSON Web Key Set [JWK] document. This contains the signing key(s) the RP uses to validate
   * signatures from the OP. The JWK Set MAY also contain the Server's encryption key(s), which are used by RPs
   * to encrypt requests to the Server. When both signing and encryption keys are made available, a use (Key Use)
   * parameter value is REQUIRED for all keys in the referenced JWK Set to indicate each key's intended usage.
   * Although some algorithms allow the same key to be used for both signatures and encryption, doing so is
   * NOT RECOMMENDED, as it is less secure. The JWK x5c parameter MAY be used to provide X.509 representations of
   * keys provided. When used, the bare key values MUST still be present and MUST match those in the certificate.
   *
   * required: true
   */
  jwksUri: string;
  /**
   * JSON array containing a list of the Subject Identifier types that this OP supports. Valid types include
   * pairwise and public.
   *
   * required: true
   * example:
   *   - public
   *   - pairwise
   */
  subjectTypesSupported: string[];
  /**
   * JSON array containing a list of the OAuth 2.0 response_type values that this OP supports. Dynamic OpenID
   * Providers MUST support the code, id_token, and the token id_token Response Type values.
   *
   * required: true
   */
  responseTypesSupported: string[];
  /**
   * JSON array containing a list of the Claim Names of the Claims that the OpenID Provider MAY be able to supply
   * values for. Note that for privacy or other reasons, this might not be an exhaustive list.
   */
  claimsSupported: string[];
  /** JSON array containing a list of the OAuth 2.0 Grant Type values that this OP supports. */
  grantTypesSupported: string[];
  /** JSON array containing a list of the OAuth 2.0 response_mode values that this OP supports. */
  responseModesSupported: string[];
  /** URL of the OP's UserInfo Endpoint. */
  userinfoEndpoint: string;
  /**
   * SON array containing a list of the OAuth 2.0 [RFC6749] scope values that this server supports. The server MUST
   * support the openid scope value. Servers MAY choose not to advertise some supported scope values even when this parameter is used
   */
  scopesSupported: string[];
  /**
   * JSON array containing a list of Client Authentication methods supported by this Token Endpoint. The options are
   * client_secret_post, client_secret_basic, client_secret_jwt, and private_key_jwt, as described in Section 9 of OpenID Connect Core 1.0
   */
  tokenEndpointAuthMethodsSupported: string[];
  /** JSON array containing a list of the JWS [JWS] signing algorithms (alg values) [JWA] supported by the UserInfo Endpoint to encode the Claims in a JWT [JWT]. */
  userinfoSigningAlgValuesSupported: string[];
  /**
   * JSON array containing a list of the JWS signing algorithms (alg values) supported by the OP for the ID Token
   * to encode the Claims in a JWT.
   *
   * required: true
   */
  idTokenSigningAlgValuesSupported: string[];
  /** Boolean value specifying whether the OP supports use of the request parameter, with true indicating support. */
  requestParameterSupported: boolean;
  /** Boolean value specifying whether the OP supports use of the request_uri parameter, with true indicating support. */
  requestUriParameterSupported: boolean;
  /**
   * Boolean value specifying whether the OP requires any request_uri values used to be pre-registered
   * using the request_uris registration parameter.
   */
  requireRequestUriRegistration: boolean;
  /** Boolean value specifying whether the OP supports use of the claims parameter, with true indicating support. */
  claimsParameterSupported: boolean;
  /** URL of the authorization server's OAuth 2.0 revocation endpoint. */
  revocationEndpoint: string;
  /** Boolean value specifying whether the OP supports back-channel logout, with true indicating support. */
  backchannelLogoutSupported: boolean;
  /**
   * Boolean value specifying whether the OP can pass a sid (session ID) Claim in the Logout Token to identify the RP
   * session with the OP. If supported, the sid Claim is also included in ID Tokens issued by the OP
   */
  backchannelLogoutSessionSupported: boolean;
  /** Boolean value specifying whether the OP supports HTTP-based logout, with true indicating support. */
  frontchannelLogoutSupported: boolean;
  /**
   * Boolean value specifying whether the OP can pass iss (issuer) and sid (session ID) query parameters to identify
   * the RP session with the OP when the frontchannel_logout_uri is used. If supported, the sid Claim is also
   * included in ID Tokens issued by the OP.
   */
  frontchannelLogoutSessionSupported: boolean;
  /** URL at the OP to which an RP can perform a redirect to request that the End-User be logged out at the OP. */
  endSessionEndpoint: string;
}

/**
 * The token response
 * [Assertion Spec](https://mattrglobal.github.io/oidc-client-bound-assertions-spec/)
 */
export interface OAuth2TokenResponse {
  /**
   * The lifetime in seconds of the access token.  For
   *  example, the value "3600" denotes that the access token will
   * expire in one hour from the time the response was generated.
   */
  expiresIn: string;
  /** The scope of the access token */
  scope: string;
  /** To retrieve a refresh token request the id_token scope. */
  idToken: string;
  /** The access token issued by the authorization server. */
  accessToken: string;
  /**
   * The refresh token, which can be used to obtain new
   * access tokens. To retrieve it add the scope "offline" to your access token request.
   */
  refreshToken: string;
  /** The type of the token issued */
  tokenType: string;
}

/** FlushInactiveOAuth2TokensRequest ... */
export interface FlushInactiveOAuth2TokensRequest {
  /**
   * NotAfter sets after which point tokens should not be flushed. This is useful when you want to keep a history
   * of recently issued tokens for auditing.
   */
  notAfter: string;
}

/** IdentityTokenInfo ... */
export interface IdentityTokenInfo {
  /** UUID of the top level Customer. */
  customerId: Buffer;
  /** UUID of Application Space in Customer. */
  appSpaceId: Buffer;
  /** UUID of Application in Application Space. */
  applicationId: Buffer;
  /** UUID of the Subject in Application Space. */
  subject?: DigitalTwin;
  /** DigitalTwin of impersonated subject in Application Space. */
  impersonated?: DigitalTwin;
  /** IssueTime indicating when this token was originally issued. */
  issueTime?: Date;
  /** Expiration time of token */
  expireTime?: Date;
  /** AuthenticatedAtTime represents the time of authentication */
  authenticationTime?: Date;
  /** ProviderInfo is the collection of credential providers used to prove. */
  providerInfo: ProviderInfo[];
}

export interface ProviderInfo {
  /**
   * Type represent the Provider type:
   *
   * Example: ["password", "oidc", "webauthn", "email", "sms"]
   */
  type: ProviderType;
  /**
   * Issuer is the identifier if available of Provider who verified the possession of credentials and issued a grant.
   *
   * Example: ["indykite.id", "google.com"]
   *
   * [did registries](https://w3c.github.io/did-spec-registries/)
   */
  issuer: string;
}

/** UserInfoResponsePayload ... */
export interface UserInfoResponsePayload {
  /** Subject - Identifier for the End-User at the IssuerURL. */
  sub: string;
  /** End-User's full name in displayable form including all name parts, possibly including titles and suffixes, ordered according to the End-User's locale and preferences. */
  name: string;
  /** Given name(s) or first name(s) of the End-User. Note that in some cultures, people can have multiple given names; all can be present, with the names being separated by space characters. */
  givenName: string;
  /** Surname(s) or last name(s) of the End-User. Note that in some cultures, people can have multiple family names or no family name; all can be present, with the names being separated by space characters. */
  familyName: string;
  /** Middle name(s) of the End-User. Note that in some cultures, people can have multiple middle names; all can be present, with the names being separated by space characters. Also note that in some cultures, middle names are not used. */
  middleName: string;
  /** Casual name of the End-User that may or may not be the same as the given_name. For instance, a nickname value of Mike might be returned alongside a given_name value of Michael. */
  nickname: string;
  /** Non-unique shorthand name by which the End-User wishes to be referred to at the RP, such as janedoe or j.doe. This value MAY be any valid JSON string including special characters such as @, /, or whitespace. */
  preferredUsername: string;
  /** URL of the End-User's profile page. The contents of this Web page SHOULD be about the End-User. */
  profile: string;
  /** URL of the End-User's profile picture. This URL MUST refer to an image file (for example, a PNG, JPEG, or GIF image file), rather than to a Web page containing an image. Note that this URL SHOULD specifically reference a profile photo of the End-User suitable for displaying when describing the End-User, rather than an arbitrary photo taken by the End-User. */
  picture: string;
  /** URL of the End-User's Web page or blog. This Web page SHOULD contain information published by the End-User or an organization that the End-User is affiliated with. */
  website: string;
  /** End-User's preferred e-mail address. Its value MUST conform to the RFC 5322 [RFC5322] addr-spec syntax. The RP MUST NOT rely upon this value being unique, as discussed in Section 5.7. */
  email: string;
  /** True if the End-User's e-mail address has been verified; otherwise false. When this Claim Value is true, this means that the OP took affirmative steps to ensure that this e-mail address was controlled by the End-User at the time the verification was performed. The means by which an e-mail address is verified is context-specific, and dependent upon the trust framework or contractual agreements within which the parties are operating. */
  emailVerified: boolean;
  /** End-User's gender. Values defined by this specification are female and male. Other values MAY be used when neither of the defined values are applicable. */
  gender: string;
  /** End-User's birthday, represented as an ISO 8601:2004 [ISO8601‑2004] YYYY-MM-DD format. The year MAY be 0000, indicating that it is omitted. To represent only the year, YYYY format is allowed. Note that depending on the underlying platform's date related function, providing just year can result in varying month and day, so the implementers need to take this factor into account to correctly process the dates. */
  birthdate: string;
  /** String from zoneinfo [zoneinfo] time zone database representing the End-User's time zone. For example, Europe/Paris or America/Los_Angeles. */
  zoneinfo: string;
  /** End-User's locale, represented as a BCP47 [RFC5646] language tag. This is typically an ISO 639-1 Alpha-2 [ISO639‑1] language code in lowercase and an ISO 3166-1 Alpha-2 [ISO3166‑1] country code in uppercase, separated by a dash. For example, en-US or fr-CA. As a compatibility note, some implementations have used an underscore as the separator rather than a dash, for example, en_US; Relying Parties MAY choose to accept this locale syntax as well. */
  locale: string;
  /** End-User's preferred telephone number. E.164 [E.164] is RECOMMENDED as the format of this Claim, for example, +1 (425) 555-1212 or +56 (2) 687 2400. If the phone number contains an extension, it is RECOMMENDED that the extension be represented using the RFC 3966 [RFC3966] extension syntax, for example, +1 (604) 555-1234;ext=5678. */
  phoneNumber: string;
  /** True if the End-User's phone number has been verified; otherwise false. When this Claim Value is true, this means that the OP took affirmative steps to ensure that this phone number was controlled by the End-User at the time the verification was performed. The means by which a phone number is verified is context-specific, and dependent upon the trust framework or contractual agreements within which the parties are operating. When true, the phone_number Claim MUST be in E.164 format and any extensions MUST be represented in RFC 3966 format. */
  phoneNumberVerified: boolean;
  /** Time the End-User's information was last updated. Its value is a JSON number representing the number of seconds from 1970-01-01T0:0:0Z as measured in UTC until the date/time. */
  updatedAt: string;
}

const baseDigitalTwin: object = { kind: 0, state: 0 };

export const DigitalTwin = {
  encode(message: DigitalTwin, writer: Writer = Writer.create()): Writer {
    if (message.id.length !== 0) {
      writer.uint32(10).bytes(message.id);
    }
    if (message.tenantId.length !== 0) {
      writer.uint32(18).bytes(message.tenantId);
    }
    if (message.kind !== 0) {
      writer.uint32(24).int32(message.kind);
    }
    if (message.state !== 0) {
      writer.uint32(32).int32(message.state);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): DigitalTwin {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseDigitalTwin } as DigitalTwin;
    message.id = Buffer.alloc(0);
    message.tenantId = Buffer.alloc(0);
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.bytes() as Buffer;
          break;
        case 2:
          message.tenantId = reader.bytes() as Buffer;
          break;
        case 3:
          message.kind = reader.int32() as any;
          break;
        case 4:
          message.state = reader.int32() as any;
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): DigitalTwin {
    const message = { ...baseDigitalTwin } as DigitalTwin;
    message.id = Buffer.alloc(0);
    message.tenantId = Buffer.alloc(0);
    if (object.id !== undefined && object.id !== null) {
      message.id = Buffer.from(bytesFromBase64(object.id));
    }
    if (object.tenantId !== undefined && object.tenantId !== null) {
      message.tenantId = Buffer.from(bytesFromBase64(object.tenantId));
    }
    if (object.kind !== undefined && object.kind !== null) {
      message.kind = digitalTwinKindFromJSON(object.kind);
    }
    if (object.state !== undefined && object.state !== null) {
      message.state = digitalTwinStateFromJSON(object.state);
    }
    return message;
  },

  toJSON(message: DigitalTwin): unknown {
    const obj: any = {};
    message.id !== undefined &&
      (obj.id = base64FromBytes(
        message.id !== undefined ? message.id : Buffer.alloc(0)
      ));
    message.tenantId !== undefined &&
      (obj.tenantId = base64FromBytes(
        message.tenantId !== undefined ? message.tenantId : Buffer.alloc(0)
      ));
    message.kind !== undefined &&
      (obj.kind = digitalTwinKindToJSON(message.kind));
    message.state !== undefined &&
      (obj.state = digitalTwinStateToJSON(message.state));
    return obj;
  },

  fromPartial(object: DeepPartial<DigitalTwin>): DigitalTwin {
    const message = { ...baseDigitalTwin } as DigitalTwin;
    if (object.id !== undefined && object.id !== null) {
      message.id = object.id;
    }
    if (object.tenantId !== undefined && object.tenantId !== null) {
      message.tenantId = object.tenantId;
    }
    if (object.kind !== undefined && object.kind !== null) {
      message.kind = object.kind;
    }
    if (object.state !== undefined && object.state !== null) {
      message.state = object.state;
    }
    return message;
  },
};

const baseDigitalEntity: object = {};

export const DigitalEntity = {
  encode(message: DigitalEntity, writer: Writer = Writer.create()): Writer {
    if (message.digitalTwin !== undefined) {
      DigitalTwin.encode(
        message.digitalTwin,
        writer.uint32(10).fork()
      ).ldelim();
    }
    if (message.createTime !== undefined) {
      Timestamp.encode(
        toTimestamp(message.createTime),
        writer.uint32(18).fork()
      ).ldelim();
    }
    for (const v of message.properties) {
      Property.encode(v!, writer.uint32(26).fork()).ldelim();
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): DigitalEntity {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseDigitalEntity } as DigitalEntity;
    message.properties = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.digitalTwin = DigitalTwin.decode(reader, reader.uint32());
          break;
        case 2:
          message.createTime = fromTimestamp(
            Timestamp.decode(reader, reader.uint32())
          );
          break;
        case 3:
          message.properties.push(Property.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): DigitalEntity {
    const message = { ...baseDigitalEntity } as DigitalEntity;
    message.properties = [];
    if (object.digitalTwin !== undefined && object.digitalTwin !== null) {
      message.digitalTwin = DigitalTwin.fromJSON(object.digitalTwin);
    }
    if (object.createTime !== undefined && object.createTime !== null) {
      message.createTime = fromJsonTimestamp(object.createTime);
    }
    if (object.properties !== undefined && object.properties !== null) {
      for (const e of object.properties) {
        message.properties.push(Property.fromJSON(e));
      }
    }
    return message;
  },

  toJSON(message: DigitalEntity): unknown {
    const obj: any = {};
    message.digitalTwin !== undefined &&
      (obj.digitalTwin = message.digitalTwin
        ? DigitalTwin.toJSON(message.digitalTwin)
        : undefined);
    message.createTime !== undefined &&
      (obj.createTime = message.createTime.toISOString());
    if (message.properties) {
      obj.properties = message.properties.map((e) =>
        e ? Property.toJSON(e) : undefined
      );
    } else {
      obj.properties = [];
    }
    return obj;
  },

  fromPartial(object: DeepPartial<DigitalEntity>): DigitalEntity {
    const message = { ...baseDigitalEntity } as DigitalEntity;
    message.properties = [];
    if (object.digitalTwin !== undefined && object.digitalTwin !== null) {
      message.digitalTwin = DigitalTwin.fromPartial(object.digitalTwin);
    }
    if (object.createTime !== undefined && object.createTime !== null) {
      message.createTime = object.createTime;
    }
    if (object.properties !== undefined && object.properties !== null) {
      for (const e of object.properties) {
        message.properties.push(Property.fromPartial(e));
      }
    }
    return message;
  },
};

const baseErrorMessage: object = { code: 0, message: "" };

export const ErrorMessage = {
  encode(message: ErrorMessage, writer: Writer = Writer.create()): Writer {
    if (message.code !== 0) {
      writer.uint32(8).int32(message.code);
    }
    if (message.message !== "") {
      writer.uint32(18).string(message.message);
    }
    if (message.detail !== undefined) {
      Value.encode(message.detail, writer.uint32(26).fork()).ldelim();
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): ErrorMessage {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseErrorMessage } as ErrorMessage;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.code = reader.int32() as any;
          break;
        case 2:
          message.message = reader.string();
          break;
        case 3:
          message.detail = Value.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ErrorMessage {
    const message = { ...baseErrorMessage } as ErrorMessage;
    if (object.code !== undefined && object.code !== null) {
      message.code = errorCodeFromJSON(object.code);
    }
    if (object.message !== undefined && object.message !== null) {
      message.message = String(object.message);
    }
    if (object.detail !== undefined && object.detail !== null) {
      message.detail = Value.fromJSON(object.detail);
    }
    return message;
  },

  toJSON(message: ErrorMessage): unknown {
    const obj: any = {};
    message.code !== undefined && (obj.code = errorCodeToJSON(message.code));
    message.message !== undefined && (obj.message = message.message);
    message.detail !== undefined &&
      (obj.detail = message.detail ? Value.toJSON(message.detail) : undefined);
    return obj;
  },

  fromPartial(object: DeepPartial<ErrorMessage>): ErrorMessage {
    const message = { ...baseErrorMessage } as ErrorMessage;
    if (object.code !== undefined && object.code !== null) {
      message.code = object.code;
    }
    if (object.message !== undefined && object.message !== null) {
      message.message = object.message;
    }
    if (object.detail !== undefined && object.detail !== null) {
      message.detail = Value.fromPartial(object.detail);
    }
    return message;
  },
};

const baseInvitation: object = { referenceId: "", displayName: "" };

export const Invitation = {
  encode(message: Invitation, writer: Writer = Writer.create()): Writer {
    if (message.id.length !== 0) {
      writer.uint32(10).bytes(message.id);
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

  decode(input: Reader | Uint8Array, length?: number): Invitation {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseInvitation } as Invitation;
    message.id = Buffer.alloc(0);
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.bytes() as Buffer;
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

  fromJSON(object: any): Invitation {
    const message = { ...baseInvitation } as Invitation;
    message.id = Buffer.alloc(0);
    if (object.id !== undefined && object.id !== null) {
      message.id = Buffer.from(bytesFromBase64(object.id));
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

  toJSON(message: Invitation): unknown {
    const obj: any = {};
    message.id !== undefined &&
      (obj.id = base64FromBytes(
        message.id !== undefined ? message.id : Buffer.alloc(0)
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

  fromPartial(object: DeepPartial<Invitation>): Invitation {
    const message = { ...baseInvitation } as Invitation;
    if (object.id !== undefined && object.id !== null) {
      message.id = object.id;
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

const baseWellKnown: object = {
  issuer: "",
  authorizationEndpoint: "",
  registrationEndpoint: "",
  tokenEndpoint: "",
  jwksUri: "",
  subjectTypesSupported: "",
  responseTypesSupported: "",
  claimsSupported: "",
  grantTypesSupported: "",
  responseModesSupported: "",
  userinfoEndpoint: "",
  scopesSupported: "",
  tokenEndpointAuthMethodsSupported: "",
  userinfoSigningAlgValuesSupported: "",
  idTokenSigningAlgValuesSupported: "",
  requestParameterSupported: false,
  requestUriParameterSupported: false,
  requireRequestUriRegistration: false,
  claimsParameterSupported: false,
  revocationEndpoint: "",
  backchannelLogoutSupported: false,
  backchannelLogoutSessionSupported: false,
  frontchannelLogoutSupported: false,
  frontchannelLogoutSessionSupported: false,
  endSessionEndpoint: "",
};

export const WellKnown = {
  encode(message: WellKnown, writer: Writer = Writer.create()): Writer {
    if (message.issuer !== "") {
      writer.uint32(10).string(message.issuer);
    }
    if (message.authorizationEndpoint !== "") {
      writer.uint32(18).string(message.authorizationEndpoint);
    }
    if (message.registrationEndpoint !== "") {
      writer.uint32(26).string(message.registrationEndpoint);
    }
    if (message.tokenEndpoint !== "") {
      writer.uint32(34).string(message.tokenEndpoint);
    }
    if (message.jwksUri !== "") {
      writer.uint32(42).string(message.jwksUri);
    }
    for (const v of message.subjectTypesSupported) {
      writer.uint32(50).string(v!);
    }
    for (const v of message.responseTypesSupported) {
      writer.uint32(58).string(v!);
    }
    for (const v of message.claimsSupported) {
      writer.uint32(66).string(v!);
    }
    for (const v of message.grantTypesSupported) {
      writer.uint32(74).string(v!);
    }
    for (const v of message.responseModesSupported) {
      writer.uint32(82).string(v!);
    }
    if (message.userinfoEndpoint !== "") {
      writer.uint32(90).string(message.userinfoEndpoint);
    }
    for (const v of message.scopesSupported) {
      writer.uint32(98).string(v!);
    }
    for (const v of message.tokenEndpointAuthMethodsSupported) {
      writer.uint32(106).string(v!);
    }
    for (const v of message.userinfoSigningAlgValuesSupported) {
      writer.uint32(114).string(v!);
    }
    for (const v of message.idTokenSigningAlgValuesSupported) {
      writer.uint32(122).string(v!);
    }
    if (message.requestParameterSupported === true) {
      writer.uint32(128).bool(message.requestParameterSupported);
    }
    if (message.requestUriParameterSupported === true) {
      writer.uint32(136).bool(message.requestUriParameterSupported);
    }
    if (message.requireRequestUriRegistration === true) {
      writer.uint32(144).bool(message.requireRequestUriRegistration);
    }
    if (message.claimsParameterSupported === true) {
      writer.uint32(152).bool(message.claimsParameterSupported);
    }
    if (message.revocationEndpoint !== "") {
      writer.uint32(162).string(message.revocationEndpoint);
    }
    if (message.backchannelLogoutSupported === true) {
      writer.uint32(168).bool(message.backchannelLogoutSupported);
    }
    if (message.backchannelLogoutSessionSupported === true) {
      writer.uint32(176).bool(message.backchannelLogoutSessionSupported);
    }
    if (message.frontchannelLogoutSupported === true) {
      writer.uint32(184).bool(message.frontchannelLogoutSupported);
    }
    if (message.frontchannelLogoutSessionSupported === true) {
      writer.uint32(192).bool(message.frontchannelLogoutSessionSupported);
    }
    if (message.endSessionEndpoint !== "") {
      writer.uint32(202).string(message.endSessionEndpoint);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): WellKnown {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseWellKnown } as WellKnown;
    message.subjectTypesSupported = [];
    message.responseTypesSupported = [];
    message.claimsSupported = [];
    message.grantTypesSupported = [];
    message.responseModesSupported = [];
    message.scopesSupported = [];
    message.tokenEndpointAuthMethodsSupported = [];
    message.userinfoSigningAlgValuesSupported = [];
    message.idTokenSigningAlgValuesSupported = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.issuer = reader.string();
          break;
        case 2:
          message.authorizationEndpoint = reader.string();
          break;
        case 3:
          message.registrationEndpoint = reader.string();
          break;
        case 4:
          message.tokenEndpoint = reader.string();
          break;
        case 5:
          message.jwksUri = reader.string();
          break;
        case 6:
          message.subjectTypesSupported.push(reader.string());
          break;
        case 7:
          message.responseTypesSupported.push(reader.string());
          break;
        case 8:
          message.claimsSupported.push(reader.string());
          break;
        case 9:
          message.grantTypesSupported.push(reader.string());
          break;
        case 10:
          message.responseModesSupported.push(reader.string());
          break;
        case 11:
          message.userinfoEndpoint = reader.string();
          break;
        case 12:
          message.scopesSupported.push(reader.string());
          break;
        case 13:
          message.tokenEndpointAuthMethodsSupported.push(reader.string());
          break;
        case 14:
          message.userinfoSigningAlgValuesSupported.push(reader.string());
          break;
        case 15:
          message.idTokenSigningAlgValuesSupported.push(reader.string());
          break;
        case 16:
          message.requestParameterSupported = reader.bool();
          break;
        case 17:
          message.requestUriParameterSupported = reader.bool();
          break;
        case 18:
          message.requireRequestUriRegistration = reader.bool();
          break;
        case 19:
          message.claimsParameterSupported = reader.bool();
          break;
        case 20:
          message.revocationEndpoint = reader.string();
          break;
        case 21:
          message.backchannelLogoutSupported = reader.bool();
          break;
        case 22:
          message.backchannelLogoutSessionSupported = reader.bool();
          break;
        case 23:
          message.frontchannelLogoutSupported = reader.bool();
          break;
        case 24:
          message.frontchannelLogoutSessionSupported = reader.bool();
          break;
        case 25:
          message.endSessionEndpoint = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): WellKnown {
    const message = { ...baseWellKnown } as WellKnown;
    message.subjectTypesSupported = [];
    message.responseTypesSupported = [];
    message.claimsSupported = [];
    message.grantTypesSupported = [];
    message.responseModesSupported = [];
    message.scopesSupported = [];
    message.tokenEndpointAuthMethodsSupported = [];
    message.userinfoSigningAlgValuesSupported = [];
    message.idTokenSigningAlgValuesSupported = [];
    if (object.issuer !== undefined && object.issuer !== null) {
      message.issuer = String(object.issuer);
    }
    if (
      object.authorizationEndpoint !== undefined &&
      object.authorizationEndpoint !== null
    ) {
      message.authorizationEndpoint = String(object.authorizationEndpoint);
    }
    if (
      object.registrationEndpoint !== undefined &&
      object.registrationEndpoint !== null
    ) {
      message.registrationEndpoint = String(object.registrationEndpoint);
    }
    if (object.tokenEndpoint !== undefined && object.tokenEndpoint !== null) {
      message.tokenEndpoint = String(object.tokenEndpoint);
    }
    if (object.jwksUri !== undefined && object.jwksUri !== null) {
      message.jwksUri = String(object.jwksUri);
    }
    if (
      object.subjectTypesSupported !== undefined &&
      object.subjectTypesSupported !== null
    ) {
      for (const e of object.subjectTypesSupported) {
        message.subjectTypesSupported.push(String(e));
      }
    }
    if (
      object.responseTypesSupported !== undefined &&
      object.responseTypesSupported !== null
    ) {
      for (const e of object.responseTypesSupported) {
        message.responseTypesSupported.push(String(e));
      }
    }
    if (
      object.claimsSupported !== undefined &&
      object.claimsSupported !== null
    ) {
      for (const e of object.claimsSupported) {
        message.claimsSupported.push(String(e));
      }
    }
    if (
      object.grantTypesSupported !== undefined &&
      object.grantTypesSupported !== null
    ) {
      for (const e of object.grantTypesSupported) {
        message.grantTypesSupported.push(String(e));
      }
    }
    if (
      object.responseModesSupported !== undefined &&
      object.responseModesSupported !== null
    ) {
      for (const e of object.responseModesSupported) {
        message.responseModesSupported.push(String(e));
      }
    }
    if (
      object.userinfoEndpoint !== undefined &&
      object.userinfoEndpoint !== null
    ) {
      message.userinfoEndpoint = String(object.userinfoEndpoint);
    }
    if (
      object.scopesSupported !== undefined &&
      object.scopesSupported !== null
    ) {
      for (const e of object.scopesSupported) {
        message.scopesSupported.push(String(e));
      }
    }
    if (
      object.tokenEndpointAuthMethodsSupported !== undefined &&
      object.tokenEndpointAuthMethodsSupported !== null
    ) {
      for (const e of object.tokenEndpointAuthMethodsSupported) {
        message.tokenEndpointAuthMethodsSupported.push(String(e));
      }
    }
    if (
      object.userinfoSigningAlgValuesSupported !== undefined &&
      object.userinfoSigningAlgValuesSupported !== null
    ) {
      for (const e of object.userinfoSigningAlgValuesSupported) {
        message.userinfoSigningAlgValuesSupported.push(String(e));
      }
    }
    if (
      object.idTokenSigningAlgValuesSupported !== undefined &&
      object.idTokenSigningAlgValuesSupported !== null
    ) {
      for (const e of object.idTokenSigningAlgValuesSupported) {
        message.idTokenSigningAlgValuesSupported.push(String(e));
      }
    }
    if (
      object.requestParameterSupported !== undefined &&
      object.requestParameterSupported !== null
    ) {
      message.requestParameterSupported = Boolean(
        object.requestParameterSupported
      );
    }
    if (
      object.requestUriParameterSupported !== undefined &&
      object.requestUriParameterSupported !== null
    ) {
      message.requestUriParameterSupported = Boolean(
        object.requestUriParameterSupported
      );
    }
    if (
      object.requireRequestUriRegistration !== undefined &&
      object.requireRequestUriRegistration !== null
    ) {
      message.requireRequestUriRegistration = Boolean(
        object.requireRequestUriRegistration
      );
    }
    if (
      object.claimsParameterSupported !== undefined &&
      object.claimsParameterSupported !== null
    ) {
      message.claimsParameterSupported = Boolean(
        object.claimsParameterSupported
      );
    }
    if (
      object.revocationEndpoint !== undefined &&
      object.revocationEndpoint !== null
    ) {
      message.revocationEndpoint = String(object.revocationEndpoint);
    }
    if (
      object.backchannelLogoutSupported !== undefined &&
      object.backchannelLogoutSupported !== null
    ) {
      message.backchannelLogoutSupported = Boolean(
        object.backchannelLogoutSupported
      );
    }
    if (
      object.backchannelLogoutSessionSupported !== undefined &&
      object.backchannelLogoutSessionSupported !== null
    ) {
      message.backchannelLogoutSessionSupported = Boolean(
        object.backchannelLogoutSessionSupported
      );
    }
    if (
      object.frontchannelLogoutSupported !== undefined &&
      object.frontchannelLogoutSupported !== null
    ) {
      message.frontchannelLogoutSupported = Boolean(
        object.frontchannelLogoutSupported
      );
    }
    if (
      object.frontchannelLogoutSessionSupported !== undefined &&
      object.frontchannelLogoutSessionSupported !== null
    ) {
      message.frontchannelLogoutSessionSupported = Boolean(
        object.frontchannelLogoutSessionSupported
      );
    }
    if (
      object.endSessionEndpoint !== undefined &&
      object.endSessionEndpoint !== null
    ) {
      message.endSessionEndpoint = String(object.endSessionEndpoint);
    }
    return message;
  },

  toJSON(message: WellKnown): unknown {
    const obj: any = {};
    message.issuer !== undefined && (obj.issuer = message.issuer);
    message.authorizationEndpoint !== undefined &&
      (obj.authorizationEndpoint = message.authorizationEndpoint);
    message.registrationEndpoint !== undefined &&
      (obj.registrationEndpoint = message.registrationEndpoint);
    message.tokenEndpoint !== undefined &&
      (obj.tokenEndpoint = message.tokenEndpoint);
    message.jwksUri !== undefined && (obj.jwksUri = message.jwksUri);
    if (message.subjectTypesSupported) {
      obj.subjectTypesSupported = message.subjectTypesSupported.map((e) => e);
    } else {
      obj.subjectTypesSupported = [];
    }
    if (message.responseTypesSupported) {
      obj.responseTypesSupported = message.responseTypesSupported.map((e) => e);
    } else {
      obj.responseTypesSupported = [];
    }
    if (message.claimsSupported) {
      obj.claimsSupported = message.claimsSupported.map((e) => e);
    } else {
      obj.claimsSupported = [];
    }
    if (message.grantTypesSupported) {
      obj.grantTypesSupported = message.grantTypesSupported.map((e) => e);
    } else {
      obj.grantTypesSupported = [];
    }
    if (message.responseModesSupported) {
      obj.responseModesSupported = message.responseModesSupported.map((e) => e);
    } else {
      obj.responseModesSupported = [];
    }
    message.userinfoEndpoint !== undefined &&
      (obj.userinfoEndpoint = message.userinfoEndpoint);
    if (message.scopesSupported) {
      obj.scopesSupported = message.scopesSupported.map((e) => e);
    } else {
      obj.scopesSupported = [];
    }
    if (message.tokenEndpointAuthMethodsSupported) {
      obj.tokenEndpointAuthMethodsSupported =
        message.tokenEndpointAuthMethodsSupported.map((e) => e);
    } else {
      obj.tokenEndpointAuthMethodsSupported = [];
    }
    if (message.userinfoSigningAlgValuesSupported) {
      obj.userinfoSigningAlgValuesSupported =
        message.userinfoSigningAlgValuesSupported.map((e) => e);
    } else {
      obj.userinfoSigningAlgValuesSupported = [];
    }
    if (message.idTokenSigningAlgValuesSupported) {
      obj.idTokenSigningAlgValuesSupported =
        message.idTokenSigningAlgValuesSupported.map((e) => e);
    } else {
      obj.idTokenSigningAlgValuesSupported = [];
    }
    message.requestParameterSupported !== undefined &&
      (obj.requestParameterSupported = message.requestParameterSupported);
    message.requestUriParameterSupported !== undefined &&
      (obj.requestUriParameterSupported = message.requestUriParameterSupported);
    message.requireRequestUriRegistration !== undefined &&
      (obj.requireRequestUriRegistration =
        message.requireRequestUriRegistration);
    message.claimsParameterSupported !== undefined &&
      (obj.claimsParameterSupported = message.claimsParameterSupported);
    message.revocationEndpoint !== undefined &&
      (obj.revocationEndpoint = message.revocationEndpoint);
    message.backchannelLogoutSupported !== undefined &&
      (obj.backchannelLogoutSupported = message.backchannelLogoutSupported);
    message.backchannelLogoutSessionSupported !== undefined &&
      (obj.backchannelLogoutSessionSupported =
        message.backchannelLogoutSessionSupported);
    message.frontchannelLogoutSupported !== undefined &&
      (obj.frontchannelLogoutSupported = message.frontchannelLogoutSupported);
    message.frontchannelLogoutSessionSupported !== undefined &&
      (obj.frontchannelLogoutSessionSupported =
        message.frontchannelLogoutSessionSupported);
    message.endSessionEndpoint !== undefined &&
      (obj.endSessionEndpoint = message.endSessionEndpoint);
    return obj;
  },

  fromPartial(object: DeepPartial<WellKnown>): WellKnown {
    const message = { ...baseWellKnown } as WellKnown;
    message.subjectTypesSupported = [];
    message.responseTypesSupported = [];
    message.claimsSupported = [];
    message.grantTypesSupported = [];
    message.responseModesSupported = [];
    message.scopesSupported = [];
    message.tokenEndpointAuthMethodsSupported = [];
    message.userinfoSigningAlgValuesSupported = [];
    message.idTokenSigningAlgValuesSupported = [];
    if (object.issuer !== undefined && object.issuer !== null) {
      message.issuer = object.issuer;
    }
    if (
      object.authorizationEndpoint !== undefined &&
      object.authorizationEndpoint !== null
    ) {
      message.authorizationEndpoint = object.authorizationEndpoint;
    }
    if (
      object.registrationEndpoint !== undefined &&
      object.registrationEndpoint !== null
    ) {
      message.registrationEndpoint = object.registrationEndpoint;
    }
    if (object.tokenEndpoint !== undefined && object.tokenEndpoint !== null) {
      message.tokenEndpoint = object.tokenEndpoint;
    }
    if (object.jwksUri !== undefined && object.jwksUri !== null) {
      message.jwksUri = object.jwksUri;
    }
    if (
      object.subjectTypesSupported !== undefined &&
      object.subjectTypesSupported !== null
    ) {
      for (const e of object.subjectTypesSupported) {
        message.subjectTypesSupported.push(e);
      }
    }
    if (
      object.responseTypesSupported !== undefined &&
      object.responseTypesSupported !== null
    ) {
      for (const e of object.responseTypesSupported) {
        message.responseTypesSupported.push(e);
      }
    }
    if (
      object.claimsSupported !== undefined &&
      object.claimsSupported !== null
    ) {
      for (const e of object.claimsSupported) {
        message.claimsSupported.push(e);
      }
    }
    if (
      object.grantTypesSupported !== undefined &&
      object.grantTypesSupported !== null
    ) {
      for (const e of object.grantTypesSupported) {
        message.grantTypesSupported.push(e);
      }
    }
    if (
      object.responseModesSupported !== undefined &&
      object.responseModesSupported !== null
    ) {
      for (const e of object.responseModesSupported) {
        message.responseModesSupported.push(e);
      }
    }
    if (
      object.userinfoEndpoint !== undefined &&
      object.userinfoEndpoint !== null
    ) {
      message.userinfoEndpoint = object.userinfoEndpoint;
    }
    if (
      object.scopesSupported !== undefined &&
      object.scopesSupported !== null
    ) {
      for (const e of object.scopesSupported) {
        message.scopesSupported.push(e);
      }
    }
    if (
      object.tokenEndpointAuthMethodsSupported !== undefined &&
      object.tokenEndpointAuthMethodsSupported !== null
    ) {
      for (const e of object.tokenEndpointAuthMethodsSupported) {
        message.tokenEndpointAuthMethodsSupported.push(e);
      }
    }
    if (
      object.userinfoSigningAlgValuesSupported !== undefined &&
      object.userinfoSigningAlgValuesSupported !== null
    ) {
      for (const e of object.userinfoSigningAlgValuesSupported) {
        message.userinfoSigningAlgValuesSupported.push(e);
      }
    }
    if (
      object.idTokenSigningAlgValuesSupported !== undefined &&
      object.idTokenSigningAlgValuesSupported !== null
    ) {
      for (const e of object.idTokenSigningAlgValuesSupported) {
        message.idTokenSigningAlgValuesSupported.push(e);
      }
    }
    if (
      object.requestParameterSupported !== undefined &&
      object.requestParameterSupported !== null
    ) {
      message.requestParameterSupported = object.requestParameterSupported;
    }
    if (
      object.requestUriParameterSupported !== undefined &&
      object.requestUriParameterSupported !== null
    ) {
      message.requestUriParameterSupported =
        object.requestUriParameterSupported;
    }
    if (
      object.requireRequestUriRegistration !== undefined &&
      object.requireRequestUriRegistration !== null
    ) {
      message.requireRequestUriRegistration =
        object.requireRequestUriRegistration;
    }
    if (
      object.claimsParameterSupported !== undefined &&
      object.claimsParameterSupported !== null
    ) {
      message.claimsParameterSupported = object.claimsParameterSupported;
    }
    if (
      object.revocationEndpoint !== undefined &&
      object.revocationEndpoint !== null
    ) {
      message.revocationEndpoint = object.revocationEndpoint;
    }
    if (
      object.backchannelLogoutSupported !== undefined &&
      object.backchannelLogoutSupported !== null
    ) {
      message.backchannelLogoutSupported = object.backchannelLogoutSupported;
    }
    if (
      object.backchannelLogoutSessionSupported !== undefined &&
      object.backchannelLogoutSessionSupported !== null
    ) {
      message.backchannelLogoutSessionSupported =
        object.backchannelLogoutSessionSupported;
    }
    if (
      object.frontchannelLogoutSupported !== undefined &&
      object.frontchannelLogoutSupported !== null
    ) {
      message.frontchannelLogoutSupported = object.frontchannelLogoutSupported;
    }
    if (
      object.frontchannelLogoutSessionSupported !== undefined &&
      object.frontchannelLogoutSessionSupported !== null
    ) {
      message.frontchannelLogoutSessionSupported =
        object.frontchannelLogoutSessionSupported;
    }
    if (
      object.endSessionEndpoint !== undefined &&
      object.endSessionEndpoint !== null
    ) {
      message.endSessionEndpoint = object.endSessionEndpoint;
    }
    return message;
  },
};

const baseOAuth2TokenResponse: object = {
  expiresIn: "0",
  scope: "",
  idToken: "",
  accessToken: "",
  refreshToken: "",
  tokenType: "",
};

export const OAuth2TokenResponse = {
  encode(
    message: OAuth2TokenResponse,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.expiresIn !== "0") {
      writer.uint32(8).int64(message.expiresIn);
    }
    if (message.scope !== "") {
      writer.uint32(18).string(message.scope);
    }
    if (message.idToken !== "") {
      writer.uint32(26).string(message.idToken);
    }
    if (message.accessToken !== "") {
      writer.uint32(34).string(message.accessToken);
    }
    if (message.refreshToken !== "") {
      writer.uint32(42).string(message.refreshToken);
    }
    if (message.tokenType !== "") {
      writer.uint32(50).string(message.tokenType);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): OAuth2TokenResponse {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseOAuth2TokenResponse } as OAuth2TokenResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.expiresIn = longToString(reader.int64() as Long);
          break;
        case 2:
          message.scope = reader.string();
          break;
        case 3:
          message.idToken = reader.string();
          break;
        case 4:
          message.accessToken = reader.string();
          break;
        case 5:
          message.refreshToken = reader.string();
          break;
        case 6:
          message.tokenType = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): OAuth2TokenResponse {
    const message = { ...baseOAuth2TokenResponse } as OAuth2TokenResponse;
    if (object.expiresIn !== undefined && object.expiresIn !== null) {
      message.expiresIn = String(object.expiresIn);
    }
    if (object.scope !== undefined && object.scope !== null) {
      message.scope = String(object.scope);
    }
    if (object.idToken !== undefined && object.idToken !== null) {
      message.idToken = String(object.idToken);
    }
    if (object.accessToken !== undefined && object.accessToken !== null) {
      message.accessToken = String(object.accessToken);
    }
    if (object.refreshToken !== undefined && object.refreshToken !== null) {
      message.refreshToken = String(object.refreshToken);
    }
    if (object.tokenType !== undefined && object.tokenType !== null) {
      message.tokenType = String(object.tokenType);
    }
    return message;
  },

  toJSON(message: OAuth2TokenResponse): unknown {
    const obj: any = {};
    message.expiresIn !== undefined && (obj.expiresIn = message.expiresIn);
    message.scope !== undefined && (obj.scope = message.scope);
    message.idToken !== undefined && (obj.idToken = message.idToken);
    message.accessToken !== undefined &&
      (obj.accessToken = message.accessToken);
    message.refreshToken !== undefined &&
      (obj.refreshToken = message.refreshToken);
    message.tokenType !== undefined && (obj.tokenType = message.tokenType);
    return obj;
  },

  fromPartial(object: DeepPartial<OAuth2TokenResponse>): OAuth2TokenResponse {
    const message = { ...baseOAuth2TokenResponse } as OAuth2TokenResponse;
    if (object.expiresIn !== undefined && object.expiresIn !== null) {
      message.expiresIn = object.expiresIn;
    }
    if (object.scope !== undefined && object.scope !== null) {
      message.scope = object.scope;
    }
    if (object.idToken !== undefined && object.idToken !== null) {
      message.idToken = object.idToken;
    }
    if (object.accessToken !== undefined && object.accessToken !== null) {
      message.accessToken = object.accessToken;
    }
    if (object.refreshToken !== undefined && object.refreshToken !== null) {
      message.refreshToken = object.refreshToken;
    }
    if (object.tokenType !== undefined && object.tokenType !== null) {
      message.tokenType = object.tokenType;
    }
    return message;
  },
};

const baseFlushInactiveOAuth2TokensRequest: object = { notAfter: "0" };

export const FlushInactiveOAuth2TokensRequest = {
  encode(
    message: FlushInactiveOAuth2TokensRequest,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.notAfter !== "0") {
      writer.uint32(8).int64(message.notAfter);
    }
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): FlushInactiveOAuth2TokensRequest {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseFlushInactiveOAuth2TokensRequest,
    } as FlushInactiveOAuth2TokensRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.notAfter = longToString(reader.int64() as Long);
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): FlushInactiveOAuth2TokensRequest {
    const message = {
      ...baseFlushInactiveOAuth2TokensRequest,
    } as FlushInactiveOAuth2TokensRequest;
    if (object.notAfter !== undefined && object.notAfter !== null) {
      message.notAfter = String(object.notAfter);
    }
    return message;
  },

  toJSON(message: FlushInactiveOAuth2TokensRequest): unknown {
    const obj: any = {};
    message.notAfter !== undefined && (obj.notAfter = message.notAfter);
    return obj;
  },

  fromPartial(
    object: DeepPartial<FlushInactiveOAuth2TokensRequest>
  ): FlushInactiveOAuth2TokensRequest {
    const message = {
      ...baseFlushInactiveOAuth2TokensRequest,
    } as FlushInactiveOAuth2TokensRequest;
    if (object.notAfter !== undefined && object.notAfter !== null) {
      message.notAfter = object.notAfter;
    }
    return message;
  },
};

const baseIdentityTokenInfo: object = {};

export const IdentityTokenInfo = {
  encode(message: IdentityTokenInfo, writer: Writer = Writer.create()): Writer {
    if (message.customerId.length !== 0) {
      writer.uint32(10).bytes(message.customerId);
    }
    if (message.appSpaceId.length !== 0) {
      writer.uint32(18).bytes(message.appSpaceId);
    }
    if (message.applicationId.length !== 0) {
      writer.uint32(26).bytes(message.applicationId);
    }
    if (message.subject !== undefined) {
      DigitalTwin.encode(message.subject, writer.uint32(34).fork()).ldelim();
    }
    if (message.impersonated !== undefined) {
      DigitalTwin.encode(
        message.impersonated,
        writer.uint32(42).fork()
      ).ldelim();
    }
    if (message.issueTime !== undefined) {
      Timestamp.encode(
        toTimestamp(message.issueTime),
        writer.uint32(50).fork()
      ).ldelim();
    }
    if (message.expireTime !== undefined) {
      Timestamp.encode(
        toTimestamp(message.expireTime),
        writer.uint32(58).fork()
      ).ldelim();
    }
    if (message.authenticationTime !== undefined) {
      Timestamp.encode(
        toTimestamp(message.authenticationTime),
        writer.uint32(66).fork()
      ).ldelim();
    }
    for (const v of message.providerInfo) {
      ProviderInfo.encode(v!, writer.uint32(74).fork()).ldelim();
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): IdentityTokenInfo {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseIdentityTokenInfo } as IdentityTokenInfo;
    message.providerInfo = [];
    message.customerId = Buffer.alloc(0);
    message.appSpaceId = Buffer.alloc(0);
    message.applicationId = Buffer.alloc(0);
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.customerId = reader.bytes() as Buffer;
          break;
        case 2:
          message.appSpaceId = reader.bytes() as Buffer;
          break;
        case 3:
          message.applicationId = reader.bytes() as Buffer;
          break;
        case 4:
          message.subject = DigitalTwin.decode(reader, reader.uint32());
          break;
        case 5:
          message.impersonated = DigitalTwin.decode(reader, reader.uint32());
          break;
        case 6:
          message.issueTime = fromTimestamp(
            Timestamp.decode(reader, reader.uint32())
          );
          break;
        case 7:
          message.expireTime = fromTimestamp(
            Timestamp.decode(reader, reader.uint32())
          );
          break;
        case 8:
          message.authenticationTime = fromTimestamp(
            Timestamp.decode(reader, reader.uint32())
          );
          break;
        case 9:
          message.providerInfo.push(
            ProviderInfo.decode(reader, reader.uint32())
          );
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): IdentityTokenInfo {
    const message = { ...baseIdentityTokenInfo } as IdentityTokenInfo;
    message.providerInfo = [];
    message.customerId = Buffer.alloc(0);
    message.appSpaceId = Buffer.alloc(0);
    message.applicationId = Buffer.alloc(0);
    if (object.customerId !== undefined && object.customerId !== null) {
      message.customerId = Buffer.from(bytesFromBase64(object.customerId));
    }
    if (object.appSpaceId !== undefined && object.appSpaceId !== null) {
      message.appSpaceId = Buffer.from(bytesFromBase64(object.appSpaceId));
    }
    if (object.applicationId !== undefined && object.applicationId !== null) {
      message.applicationId = Buffer.from(
        bytesFromBase64(object.applicationId)
      );
    }
    if (object.subject !== undefined && object.subject !== null) {
      message.subject = DigitalTwin.fromJSON(object.subject);
    }
    if (object.impersonated !== undefined && object.impersonated !== null) {
      message.impersonated = DigitalTwin.fromJSON(object.impersonated);
    }
    if (object.issueTime !== undefined && object.issueTime !== null) {
      message.issueTime = fromJsonTimestamp(object.issueTime);
    }
    if (object.expireTime !== undefined && object.expireTime !== null) {
      message.expireTime = fromJsonTimestamp(object.expireTime);
    }
    if (
      object.authenticationTime !== undefined &&
      object.authenticationTime !== null
    ) {
      message.authenticationTime = fromJsonTimestamp(object.authenticationTime);
    }
    if (object.providerInfo !== undefined && object.providerInfo !== null) {
      for (const e of object.providerInfo) {
        message.providerInfo.push(ProviderInfo.fromJSON(e));
      }
    }
    return message;
  },

  toJSON(message: IdentityTokenInfo): unknown {
    const obj: any = {};
    message.customerId !== undefined &&
      (obj.customerId = base64FromBytes(
        message.customerId !== undefined ? message.customerId : Buffer.alloc(0)
      ));
    message.appSpaceId !== undefined &&
      (obj.appSpaceId = base64FromBytes(
        message.appSpaceId !== undefined ? message.appSpaceId : Buffer.alloc(0)
      ));
    message.applicationId !== undefined &&
      (obj.applicationId = base64FromBytes(
        message.applicationId !== undefined
          ? message.applicationId
          : Buffer.alloc(0)
      ));
    message.subject !== undefined &&
      (obj.subject = message.subject
        ? DigitalTwin.toJSON(message.subject)
        : undefined);
    message.impersonated !== undefined &&
      (obj.impersonated = message.impersonated
        ? DigitalTwin.toJSON(message.impersonated)
        : undefined);
    message.issueTime !== undefined &&
      (obj.issueTime = message.issueTime.toISOString());
    message.expireTime !== undefined &&
      (obj.expireTime = message.expireTime.toISOString());
    message.authenticationTime !== undefined &&
      (obj.authenticationTime = message.authenticationTime.toISOString());
    if (message.providerInfo) {
      obj.providerInfo = message.providerInfo.map((e) =>
        e ? ProviderInfo.toJSON(e) : undefined
      );
    } else {
      obj.providerInfo = [];
    }
    return obj;
  },

  fromPartial(object: DeepPartial<IdentityTokenInfo>): IdentityTokenInfo {
    const message = { ...baseIdentityTokenInfo } as IdentityTokenInfo;
    message.providerInfo = [];
    if (object.customerId !== undefined && object.customerId !== null) {
      message.customerId = object.customerId;
    }
    if (object.appSpaceId !== undefined && object.appSpaceId !== null) {
      message.appSpaceId = object.appSpaceId;
    }
    if (object.applicationId !== undefined && object.applicationId !== null) {
      message.applicationId = object.applicationId;
    }
    if (object.subject !== undefined && object.subject !== null) {
      message.subject = DigitalTwin.fromPartial(object.subject);
    }
    if (object.impersonated !== undefined && object.impersonated !== null) {
      message.impersonated = DigitalTwin.fromPartial(object.impersonated);
    }
    if (object.issueTime !== undefined && object.issueTime !== null) {
      message.issueTime = object.issueTime;
    }
    if (object.expireTime !== undefined && object.expireTime !== null) {
      message.expireTime = object.expireTime;
    }
    if (
      object.authenticationTime !== undefined &&
      object.authenticationTime !== null
    ) {
      message.authenticationTime = object.authenticationTime;
    }
    if (object.providerInfo !== undefined && object.providerInfo !== null) {
      for (const e of object.providerInfo) {
        message.providerInfo.push(ProviderInfo.fromPartial(e));
      }
    }
    return message;
  },
};

const baseProviderInfo: object = { type: 0, issuer: "" };

export const ProviderInfo = {
  encode(message: ProviderInfo, writer: Writer = Writer.create()): Writer {
    if (message.type !== 0) {
      writer.uint32(8).int32(message.type);
    }
    if (message.issuer !== "") {
      writer.uint32(18).string(message.issuer);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): ProviderInfo {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseProviderInfo } as ProviderInfo;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.type = reader.int32() as any;
          break;
        case 2:
          message.issuer = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ProviderInfo {
    const message = { ...baseProviderInfo } as ProviderInfo;
    if (object.type !== undefined && object.type !== null) {
      message.type = providerTypeFromJSON(object.type);
    }
    if (object.issuer !== undefined && object.issuer !== null) {
      message.issuer = String(object.issuer);
    }
    return message;
  },

  toJSON(message: ProviderInfo): unknown {
    const obj: any = {};
    message.type !== undefined && (obj.type = providerTypeToJSON(message.type));
    message.issuer !== undefined && (obj.issuer = message.issuer);
    return obj;
  },

  fromPartial(object: DeepPartial<ProviderInfo>): ProviderInfo {
    const message = { ...baseProviderInfo } as ProviderInfo;
    if (object.type !== undefined && object.type !== null) {
      message.type = object.type;
    }
    if (object.issuer !== undefined && object.issuer !== null) {
      message.issuer = object.issuer;
    }
    return message;
  },
};

const baseUserInfoResponsePayload: object = {
  sub: "",
  name: "",
  givenName: "",
  familyName: "",
  middleName: "",
  nickname: "",
  preferredUsername: "",
  profile: "",
  picture: "",
  website: "",
  email: "",
  emailVerified: false,
  gender: "",
  birthdate: "",
  zoneinfo: "",
  locale: "",
  phoneNumber: "",
  phoneNumberVerified: false,
  updatedAt: "0",
};

export const UserInfoResponsePayload = {
  encode(
    message: UserInfoResponsePayload,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.sub !== "") {
      writer.uint32(10).string(message.sub);
    }
    if (message.name !== "") {
      writer.uint32(18).string(message.name);
    }
    if (message.givenName !== "") {
      writer.uint32(26).string(message.givenName);
    }
    if (message.familyName !== "") {
      writer.uint32(34).string(message.familyName);
    }
    if (message.middleName !== "") {
      writer.uint32(42).string(message.middleName);
    }
    if (message.nickname !== "") {
      writer.uint32(50).string(message.nickname);
    }
    if (message.preferredUsername !== "") {
      writer.uint32(58).string(message.preferredUsername);
    }
    if (message.profile !== "") {
      writer.uint32(66).string(message.profile);
    }
    if (message.picture !== "") {
      writer.uint32(74).string(message.picture);
    }
    if (message.website !== "") {
      writer.uint32(82).string(message.website);
    }
    if (message.email !== "") {
      writer.uint32(90).string(message.email);
    }
    if (message.emailVerified === true) {
      writer.uint32(96).bool(message.emailVerified);
    }
    if (message.gender !== "") {
      writer.uint32(106).string(message.gender);
    }
    if (message.birthdate !== "") {
      writer.uint32(114).string(message.birthdate);
    }
    if (message.zoneinfo !== "") {
      writer.uint32(122).string(message.zoneinfo);
    }
    if (message.locale !== "") {
      writer.uint32(130).string(message.locale);
    }
    if (message.phoneNumber !== "") {
      writer.uint32(138).string(message.phoneNumber);
    }
    if (message.phoneNumberVerified === true) {
      writer.uint32(144).bool(message.phoneNumberVerified);
    }
    if (message.updatedAt !== "0") {
      writer.uint32(152).int64(message.updatedAt);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): UserInfoResponsePayload {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseUserInfoResponsePayload,
    } as UserInfoResponsePayload;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.sub = reader.string();
          break;
        case 2:
          message.name = reader.string();
          break;
        case 3:
          message.givenName = reader.string();
          break;
        case 4:
          message.familyName = reader.string();
          break;
        case 5:
          message.middleName = reader.string();
          break;
        case 6:
          message.nickname = reader.string();
          break;
        case 7:
          message.preferredUsername = reader.string();
          break;
        case 8:
          message.profile = reader.string();
          break;
        case 9:
          message.picture = reader.string();
          break;
        case 10:
          message.website = reader.string();
          break;
        case 11:
          message.email = reader.string();
          break;
        case 12:
          message.emailVerified = reader.bool();
          break;
        case 13:
          message.gender = reader.string();
          break;
        case 14:
          message.birthdate = reader.string();
          break;
        case 15:
          message.zoneinfo = reader.string();
          break;
        case 16:
          message.locale = reader.string();
          break;
        case 17:
          message.phoneNumber = reader.string();
          break;
        case 18:
          message.phoneNumberVerified = reader.bool();
          break;
        case 19:
          message.updatedAt = longToString(reader.int64() as Long);
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): UserInfoResponsePayload {
    const message = {
      ...baseUserInfoResponsePayload,
    } as UserInfoResponsePayload;
    if (object.sub !== undefined && object.sub !== null) {
      message.sub = String(object.sub);
    }
    if (object.name !== undefined && object.name !== null) {
      message.name = String(object.name);
    }
    if (object.givenName !== undefined && object.givenName !== null) {
      message.givenName = String(object.givenName);
    }
    if (object.familyName !== undefined && object.familyName !== null) {
      message.familyName = String(object.familyName);
    }
    if (object.middleName !== undefined && object.middleName !== null) {
      message.middleName = String(object.middleName);
    }
    if (object.nickname !== undefined && object.nickname !== null) {
      message.nickname = String(object.nickname);
    }
    if (
      object.preferredUsername !== undefined &&
      object.preferredUsername !== null
    ) {
      message.preferredUsername = String(object.preferredUsername);
    }
    if (object.profile !== undefined && object.profile !== null) {
      message.profile = String(object.profile);
    }
    if (object.picture !== undefined && object.picture !== null) {
      message.picture = String(object.picture);
    }
    if (object.website !== undefined && object.website !== null) {
      message.website = String(object.website);
    }
    if (object.email !== undefined && object.email !== null) {
      message.email = String(object.email);
    }
    if (object.emailVerified !== undefined && object.emailVerified !== null) {
      message.emailVerified = Boolean(object.emailVerified);
    }
    if (object.gender !== undefined && object.gender !== null) {
      message.gender = String(object.gender);
    }
    if (object.birthdate !== undefined && object.birthdate !== null) {
      message.birthdate = String(object.birthdate);
    }
    if (object.zoneinfo !== undefined && object.zoneinfo !== null) {
      message.zoneinfo = String(object.zoneinfo);
    }
    if (object.locale !== undefined && object.locale !== null) {
      message.locale = String(object.locale);
    }
    if (object.phoneNumber !== undefined && object.phoneNumber !== null) {
      message.phoneNumber = String(object.phoneNumber);
    }
    if (
      object.phoneNumberVerified !== undefined &&
      object.phoneNumberVerified !== null
    ) {
      message.phoneNumberVerified = Boolean(object.phoneNumberVerified);
    }
    if (object.updatedAt !== undefined && object.updatedAt !== null) {
      message.updatedAt = String(object.updatedAt);
    }
    return message;
  },

  toJSON(message: UserInfoResponsePayload): unknown {
    const obj: any = {};
    message.sub !== undefined && (obj.sub = message.sub);
    message.name !== undefined && (obj.name = message.name);
    message.givenName !== undefined && (obj.givenName = message.givenName);
    message.familyName !== undefined && (obj.familyName = message.familyName);
    message.middleName !== undefined && (obj.middleName = message.middleName);
    message.nickname !== undefined && (obj.nickname = message.nickname);
    message.preferredUsername !== undefined &&
      (obj.preferredUsername = message.preferredUsername);
    message.profile !== undefined && (obj.profile = message.profile);
    message.picture !== undefined && (obj.picture = message.picture);
    message.website !== undefined && (obj.website = message.website);
    message.email !== undefined && (obj.email = message.email);
    message.emailVerified !== undefined &&
      (obj.emailVerified = message.emailVerified);
    message.gender !== undefined && (obj.gender = message.gender);
    message.birthdate !== undefined && (obj.birthdate = message.birthdate);
    message.zoneinfo !== undefined && (obj.zoneinfo = message.zoneinfo);
    message.locale !== undefined && (obj.locale = message.locale);
    message.phoneNumber !== undefined &&
      (obj.phoneNumber = message.phoneNumber);
    message.phoneNumberVerified !== undefined &&
      (obj.phoneNumberVerified = message.phoneNumberVerified);
    message.updatedAt !== undefined && (obj.updatedAt = message.updatedAt);
    return obj;
  },

  fromPartial(
    object: DeepPartial<UserInfoResponsePayload>
  ): UserInfoResponsePayload {
    const message = {
      ...baseUserInfoResponsePayload,
    } as UserInfoResponsePayload;
    if (object.sub !== undefined && object.sub !== null) {
      message.sub = object.sub;
    }
    if (object.name !== undefined && object.name !== null) {
      message.name = object.name;
    }
    if (object.givenName !== undefined && object.givenName !== null) {
      message.givenName = object.givenName;
    }
    if (object.familyName !== undefined && object.familyName !== null) {
      message.familyName = object.familyName;
    }
    if (object.middleName !== undefined && object.middleName !== null) {
      message.middleName = object.middleName;
    }
    if (object.nickname !== undefined && object.nickname !== null) {
      message.nickname = object.nickname;
    }
    if (
      object.preferredUsername !== undefined &&
      object.preferredUsername !== null
    ) {
      message.preferredUsername = object.preferredUsername;
    }
    if (object.profile !== undefined && object.profile !== null) {
      message.profile = object.profile;
    }
    if (object.picture !== undefined && object.picture !== null) {
      message.picture = object.picture;
    }
    if (object.website !== undefined && object.website !== null) {
      message.website = object.website;
    }
    if (object.email !== undefined && object.email !== null) {
      message.email = object.email;
    }
    if (object.emailVerified !== undefined && object.emailVerified !== null) {
      message.emailVerified = object.emailVerified;
    }
    if (object.gender !== undefined && object.gender !== null) {
      message.gender = object.gender;
    }
    if (object.birthdate !== undefined && object.birthdate !== null) {
      message.birthdate = object.birthdate;
    }
    if (object.zoneinfo !== undefined && object.zoneinfo !== null) {
      message.zoneinfo = object.zoneinfo;
    }
    if (object.locale !== undefined && object.locale !== null) {
      message.locale = object.locale;
    }
    if (object.phoneNumber !== undefined && object.phoneNumber !== null) {
      message.phoneNumber = object.phoneNumber;
    }
    if (
      object.phoneNumberVerified !== undefined &&
      object.phoneNumberVerified !== null
    ) {
      message.phoneNumberVerified = object.phoneNumberVerified;
    }
    if (object.updatedAt !== undefined && object.updatedAt !== null) {
      message.updatedAt = object.updatedAt;
    }
    return message;
  },
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
