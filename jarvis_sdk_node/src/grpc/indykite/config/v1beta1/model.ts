/* eslint-disable */
import { util, configure, Writer, Reader } from "protobufjs/minimal";
import * as Long from "long";
import { Any } from "../../../google/protobuf/any";
import { Value } from "../../../indykite/objects/v1beta1/struct";
import { Duration } from "../../../google/protobuf/duration";
import { Timestamp } from "../../../google/protobuf/timestamp";
import {
  StringValue,
  BoolValue,
  Int64Value,
} from "../../../google/protobuf/wrappers";

export const protobufPackage = "indykite.config.v1beta1";

/** ProviderType is a list of supported OAuth2 providers. */
export enum ProviderType {
  PROVIDER_TYPE_INVALID = 0,
  PROVIDER_TYPE_AMAZON_COM = 1,
  PROVIDER_TYPE_AMAZONCOGNITO_COM = 34,
  PROVIDER_TYPE_BITBUCKET = 2,
  PROVIDER_TYPE_CERN_CH = 3,
  PROVIDER_TYPE_FACEBOOK_COM = 4,
  PROVIDER_TYPE_FITBIT_COM = 5,
  PROVIDER_TYPE_FOURSQUARE_COM = 6,
  PROVIDER_TYPE_GITHUB_COM = 7,
  PROVIDER_TYPE_GITLAB_COM = 8,
  PROVIDER_TYPE_GOOGLE_COM = 9,
  PROVIDER_TYPE_HEROKU_COM = 10,
  PROVIDER_TYPE_HIPCHAT_COM = 11,
  PROVIDER_TYPE_INSTAGRAM_COM = 12,
  PROVIDER_TYPE_KAKAO_COM = 13,
  PROVIDER_TYPE_LINKEDIN_COM = 14,
  PROVIDER_TYPE_MAILCHIMP_COM = 15,
  PROVIDER_TYPE_MAIL_RU = 16,
  PROVIDER_TYPE_MEDIAMATH_COM = 17,
  PROVIDER_TYPE_SANDBOX_MEDIAMATH_COM = 18,
  PROVIDER_TYPE_LIVE_COM = 32,
  PROVIDER_TYPE_MICROSOFT_COM = 19,
  PROVIDER_TYPE_HEALTH_NOKIA_COM = 20,
  PROVIDER_TYPE_ODNOKLASSNIKI_RU = 21,
  PROVIDER_TYPE_PAYPAL_COM = 22,
  PROVIDER_TYPE_SANDBOX_PAYPAL_COM = 23,
  PROVIDER_TYPE_SLACK_COM = 24,
  PROVIDER_TYPE_SPOTIFY_COM = 25,
  PROVIDER_TYPE_STACKOVERFLOW_COM = 26,
  PROVIDER_TYPE_TWITCH_TV = 27,
  PROVIDER_TYPE_UBER_COM = 28,
  PROVIDER_TYPE_VK_COM = 29,
  PROVIDER_TYPE_YAHOO_COM = 30,
  PROVIDER_TYPE_YANDEX_COM = 31,
  PROVIDER_TYPE_AUTHENTEQ_COM = 33,
  PROVIDER_TYPE_INDYKITE_ID = 35,
  PROVIDER_TYPE_INDYKITE_ME = 36,
  PROVIDER_TYPE_CUSTOM = 39,
  UNRECOGNIZED = -1,
}

export function providerTypeFromJSON(object: any): ProviderType {
  switch (object) {
    case 0:
    case "PROVIDER_TYPE_INVALID":
      return ProviderType.PROVIDER_TYPE_INVALID;
    case 1:
    case "PROVIDER_TYPE_AMAZON_COM":
      return ProviderType.PROVIDER_TYPE_AMAZON_COM;
    case 34:
    case "PROVIDER_TYPE_AMAZONCOGNITO_COM":
      return ProviderType.PROVIDER_TYPE_AMAZONCOGNITO_COM;
    case 2:
    case "PROVIDER_TYPE_BITBUCKET":
      return ProviderType.PROVIDER_TYPE_BITBUCKET;
    case 3:
    case "PROVIDER_TYPE_CERN_CH":
      return ProviderType.PROVIDER_TYPE_CERN_CH;
    case 4:
    case "PROVIDER_TYPE_FACEBOOK_COM":
      return ProviderType.PROVIDER_TYPE_FACEBOOK_COM;
    case 5:
    case "PROVIDER_TYPE_FITBIT_COM":
      return ProviderType.PROVIDER_TYPE_FITBIT_COM;
    case 6:
    case "PROVIDER_TYPE_FOURSQUARE_COM":
      return ProviderType.PROVIDER_TYPE_FOURSQUARE_COM;
    case 7:
    case "PROVIDER_TYPE_GITHUB_COM":
      return ProviderType.PROVIDER_TYPE_GITHUB_COM;
    case 8:
    case "PROVIDER_TYPE_GITLAB_COM":
      return ProviderType.PROVIDER_TYPE_GITLAB_COM;
    case 9:
    case "PROVIDER_TYPE_GOOGLE_COM":
      return ProviderType.PROVIDER_TYPE_GOOGLE_COM;
    case 10:
    case "PROVIDER_TYPE_HEROKU_COM":
      return ProviderType.PROVIDER_TYPE_HEROKU_COM;
    case 11:
    case "PROVIDER_TYPE_HIPCHAT_COM":
      return ProviderType.PROVIDER_TYPE_HIPCHAT_COM;
    case 12:
    case "PROVIDER_TYPE_INSTAGRAM_COM":
      return ProviderType.PROVIDER_TYPE_INSTAGRAM_COM;
    case 13:
    case "PROVIDER_TYPE_KAKAO_COM":
      return ProviderType.PROVIDER_TYPE_KAKAO_COM;
    case 14:
    case "PROVIDER_TYPE_LINKEDIN_COM":
      return ProviderType.PROVIDER_TYPE_LINKEDIN_COM;
    case 15:
    case "PROVIDER_TYPE_MAILCHIMP_COM":
      return ProviderType.PROVIDER_TYPE_MAILCHIMP_COM;
    case 16:
    case "PROVIDER_TYPE_MAIL_RU":
      return ProviderType.PROVIDER_TYPE_MAIL_RU;
    case 17:
    case "PROVIDER_TYPE_MEDIAMATH_COM":
      return ProviderType.PROVIDER_TYPE_MEDIAMATH_COM;
    case 18:
    case "PROVIDER_TYPE_SANDBOX_MEDIAMATH_COM":
      return ProviderType.PROVIDER_TYPE_SANDBOX_MEDIAMATH_COM;
    case 32:
    case "PROVIDER_TYPE_LIVE_COM":
      return ProviderType.PROVIDER_TYPE_LIVE_COM;
    case 19:
    case "PROVIDER_TYPE_MICROSOFT_COM":
      return ProviderType.PROVIDER_TYPE_MICROSOFT_COM;
    case 20:
    case "PROVIDER_TYPE_HEALTH_NOKIA_COM":
      return ProviderType.PROVIDER_TYPE_HEALTH_NOKIA_COM;
    case 21:
    case "PROVIDER_TYPE_ODNOKLASSNIKI_RU":
      return ProviderType.PROVIDER_TYPE_ODNOKLASSNIKI_RU;
    case 22:
    case "PROVIDER_TYPE_PAYPAL_COM":
      return ProviderType.PROVIDER_TYPE_PAYPAL_COM;
    case 23:
    case "PROVIDER_TYPE_SANDBOX_PAYPAL_COM":
      return ProviderType.PROVIDER_TYPE_SANDBOX_PAYPAL_COM;
    case 24:
    case "PROVIDER_TYPE_SLACK_COM":
      return ProviderType.PROVIDER_TYPE_SLACK_COM;
    case 25:
    case "PROVIDER_TYPE_SPOTIFY_COM":
      return ProviderType.PROVIDER_TYPE_SPOTIFY_COM;
    case 26:
    case "PROVIDER_TYPE_STACKOVERFLOW_COM":
      return ProviderType.PROVIDER_TYPE_STACKOVERFLOW_COM;
    case 27:
    case "PROVIDER_TYPE_TWITCH_TV":
      return ProviderType.PROVIDER_TYPE_TWITCH_TV;
    case 28:
    case "PROVIDER_TYPE_UBER_COM":
      return ProviderType.PROVIDER_TYPE_UBER_COM;
    case 29:
    case "PROVIDER_TYPE_VK_COM":
      return ProviderType.PROVIDER_TYPE_VK_COM;
    case 30:
    case "PROVIDER_TYPE_YAHOO_COM":
      return ProviderType.PROVIDER_TYPE_YAHOO_COM;
    case 31:
    case "PROVIDER_TYPE_YANDEX_COM":
      return ProviderType.PROVIDER_TYPE_YANDEX_COM;
    case 33:
    case "PROVIDER_TYPE_AUTHENTEQ_COM":
      return ProviderType.PROVIDER_TYPE_AUTHENTEQ_COM;
    case 35:
    case "PROVIDER_TYPE_INDYKITE_ID":
      return ProviderType.PROVIDER_TYPE_INDYKITE_ID;
    case 36:
    case "PROVIDER_TYPE_INDYKITE_ME":
      return ProviderType.PROVIDER_TYPE_INDYKITE_ME;
    case 39:
    case "PROVIDER_TYPE_CUSTOM":
      return ProviderType.PROVIDER_TYPE_CUSTOM;
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
    case ProviderType.PROVIDER_TYPE_AMAZON_COM:
      return "PROVIDER_TYPE_AMAZON_COM";
    case ProviderType.PROVIDER_TYPE_AMAZONCOGNITO_COM:
      return "PROVIDER_TYPE_AMAZONCOGNITO_COM";
    case ProviderType.PROVIDER_TYPE_BITBUCKET:
      return "PROVIDER_TYPE_BITBUCKET";
    case ProviderType.PROVIDER_TYPE_CERN_CH:
      return "PROVIDER_TYPE_CERN_CH";
    case ProviderType.PROVIDER_TYPE_FACEBOOK_COM:
      return "PROVIDER_TYPE_FACEBOOK_COM";
    case ProviderType.PROVIDER_TYPE_FITBIT_COM:
      return "PROVIDER_TYPE_FITBIT_COM";
    case ProviderType.PROVIDER_TYPE_FOURSQUARE_COM:
      return "PROVIDER_TYPE_FOURSQUARE_COM";
    case ProviderType.PROVIDER_TYPE_GITHUB_COM:
      return "PROVIDER_TYPE_GITHUB_COM";
    case ProviderType.PROVIDER_TYPE_GITLAB_COM:
      return "PROVIDER_TYPE_GITLAB_COM";
    case ProviderType.PROVIDER_TYPE_GOOGLE_COM:
      return "PROVIDER_TYPE_GOOGLE_COM";
    case ProviderType.PROVIDER_TYPE_HEROKU_COM:
      return "PROVIDER_TYPE_HEROKU_COM";
    case ProviderType.PROVIDER_TYPE_HIPCHAT_COM:
      return "PROVIDER_TYPE_HIPCHAT_COM";
    case ProviderType.PROVIDER_TYPE_INSTAGRAM_COM:
      return "PROVIDER_TYPE_INSTAGRAM_COM";
    case ProviderType.PROVIDER_TYPE_KAKAO_COM:
      return "PROVIDER_TYPE_KAKAO_COM";
    case ProviderType.PROVIDER_TYPE_LINKEDIN_COM:
      return "PROVIDER_TYPE_LINKEDIN_COM";
    case ProviderType.PROVIDER_TYPE_MAILCHIMP_COM:
      return "PROVIDER_TYPE_MAILCHIMP_COM";
    case ProviderType.PROVIDER_TYPE_MAIL_RU:
      return "PROVIDER_TYPE_MAIL_RU";
    case ProviderType.PROVIDER_TYPE_MEDIAMATH_COM:
      return "PROVIDER_TYPE_MEDIAMATH_COM";
    case ProviderType.PROVIDER_TYPE_SANDBOX_MEDIAMATH_COM:
      return "PROVIDER_TYPE_SANDBOX_MEDIAMATH_COM";
    case ProviderType.PROVIDER_TYPE_LIVE_COM:
      return "PROVIDER_TYPE_LIVE_COM";
    case ProviderType.PROVIDER_TYPE_MICROSOFT_COM:
      return "PROVIDER_TYPE_MICROSOFT_COM";
    case ProviderType.PROVIDER_TYPE_HEALTH_NOKIA_COM:
      return "PROVIDER_TYPE_HEALTH_NOKIA_COM";
    case ProviderType.PROVIDER_TYPE_ODNOKLASSNIKI_RU:
      return "PROVIDER_TYPE_ODNOKLASSNIKI_RU";
    case ProviderType.PROVIDER_TYPE_PAYPAL_COM:
      return "PROVIDER_TYPE_PAYPAL_COM";
    case ProviderType.PROVIDER_TYPE_SANDBOX_PAYPAL_COM:
      return "PROVIDER_TYPE_SANDBOX_PAYPAL_COM";
    case ProviderType.PROVIDER_TYPE_SLACK_COM:
      return "PROVIDER_TYPE_SLACK_COM";
    case ProviderType.PROVIDER_TYPE_SPOTIFY_COM:
      return "PROVIDER_TYPE_SPOTIFY_COM";
    case ProviderType.PROVIDER_TYPE_STACKOVERFLOW_COM:
      return "PROVIDER_TYPE_STACKOVERFLOW_COM";
    case ProviderType.PROVIDER_TYPE_TWITCH_TV:
      return "PROVIDER_TYPE_TWITCH_TV";
    case ProviderType.PROVIDER_TYPE_UBER_COM:
      return "PROVIDER_TYPE_UBER_COM";
    case ProviderType.PROVIDER_TYPE_VK_COM:
      return "PROVIDER_TYPE_VK_COM";
    case ProviderType.PROVIDER_TYPE_YAHOO_COM:
      return "PROVIDER_TYPE_YAHOO_COM";
    case ProviderType.PROVIDER_TYPE_YANDEX_COM:
      return "PROVIDER_TYPE_YANDEX_COM";
    case ProviderType.PROVIDER_TYPE_AUTHENTEQ_COM:
      return "PROVIDER_TYPE_AUTHENTEQ_COM";
    case ProviderType.PROVIDER_TYPE_INDYKITE_ID:
      return "PROVIDER_TYPE_INDYKITE_ID";
    case ProviderType.PROVIDER_TYPE_INDYKITE_ME:
      return "PROVIDER_TYPE_INDYKITE_ME";
    case ProviderType.PROVIDER_TYPE_CUSTOM:
      return "PROVIDER_TYPE_CUSTOM";
    default:
      return "UNKNOWN";
  }
}

export enum GrantType {
  GRANT_TYPE_INVALID = 0,
  /** GRANT_TYPE_AUTHORIZATION_CODE - https://tools.ietf.org/html/rfc6749#section-4.1 */
  GRANT_TYPE_AUTHORIZATION_CODE = 1,
  /** GRANT_TYPE_IMPLICIT - https://tools.ietf.org/html/rfc6749#section-4.2 */
  GRANT_TYPE_IMPLICIT = 2,
  /** GRANT_TYPE_PASSWORD - https://tools.ietf.org/html/rfc6749#section-4.3 */
  GRANT_TYPE_PASSWORD = 3,
  /** GRANT_TYPE_CLIENT_CREDENTIALS - https://tools.ietf.org/html/rfc6749#section-4.4 */
  GRANT_TYPE_CLIENT_CREDENTIALS = 4,
  /** GRANT_TYPE_REFRESH_TOKEN - https://tools.ietf.org/html/rfc6749#section-6 */
  GRANT_TYPE_REFRESH_TOKEN = 5,
  UNRECOGNIZED = -1,
}

export function grantTypeFromJSON(object: any): GrantType {
  switch (object) {
    case 0:
    case "GRANT_TYPE_INVALID":
      return GrantType.GRANT_TYPE_INVALID;
    case 1:
    case "GRANT_TYPE_AUTHORIZATION_CODE":
      return GrantType.GRANT_TYPE_AUTHORIZATION_CODE;
    case 2:
    case "GRANT_TYPE_IMPLICIT":
      return GrantType.GRANT_TYPE_IMPLICIT;
    case 3:
    case "GRANT_TYPE_PASSWORD":
      return GrantType.GRANT_TYPE_PASSWORD;
    case 4:
    case "GRANT_TYPE_CLIENT_CREDENTIALS":
      return GrantType.GRANT_TYPE_CLIENT_CREDENTIALS;
    case 5:
    case "GRANT_TYPE_REFRESH_TOKEN":
      return GrantType.GRANT_TYPE_REFRESH_TOKEN;
    case -1:
    case "UNRECOGNIZED":
    default:
      return GrantType.UNRECOGNIZED;
  }
}

export function grantTypeToJSON(object: GrantType): string {
  switch (object) {
    case GrantType.GRANT_TYPE_INVALID:
      return "GRANT_TYPE_INVALID";
    case GrantType.GRANT_TYPE_AUTHORIZATION_CODE:
      return "GRANT_TYPE_AUTHORIZATION_CODE";
    case GrantType.GRANT_TYPE_IMPLICIT:
      return "GRANT_TYPE_IMPLICIT";
    case GrantType.GRANT_TYPE_PASSWORD:
      return "GRANT_TYPE_PASSWORD";
    case GrantType.GRANT_TYPE_CLIENT_CREDENTIALS:
      return "GRANT_TYPE_CLIENT_CREDENTIALS";
    case GrantType.GRANT_TYPE_REFRESH_TOKEN:
      return "GRANT_TYPE_REFRESH_TOKEN";
    default:
      return "UNKNOWN";
  }
}

export enum ResponseType {
  RESPONSE_TYPE_INVALID = 0,
  RESPONSE_TYPE_TOKEN = 1,
  RESPONSE_TYPE_CODE = 2,
  RESPONSE_TYPE_ID_TOKEN = 3,
  UNRECOGNIZED = -1,
}

export function responseTypeFromJSON(object: any): ResponseType {
  switch (object) {
    case 0:
    case "RESPONSE_TYPE_INVALID":
      return ResponseType.RESPONSE_TYPE_INVALID;
    case 1:
    case "RESPONSE_TYPE_TOKEN":
      return ResponseType.RESPONSE_TYPE_TOKEN;
    case 2:
    case "RESPONSE_TYPE_CODE":
      return ResponseType.RESPONSE_TYPE_CODE;
    case 3:
    case "RESPONSE_TYPE_ID_TOKEN":
      return ResponseType.RESPONSE_TYPE_ID_TOKEN;
    case -1:
    case "UNRECOGNIZED":
    default:
      return ResponseType.UNRECOGNIZED;
  }
}

export function responseTypeToJSON(object: ResponseType): string {
  switch (object) {
    case ResponseType.RESPONSE_TYPE_INVALID:
      return "RESPONSE_TYPE_INVALID";
    case ResponseType.RESPONSE_TYPE_TOKEN:
      return "RESPONSE_TYPE_TOKEN";
    case ResponseType.RESPONSE_TYPE_CODE:
      return "RESPONSE_TYPE_CODE";
    case ResponseType.RESPONSE_TYPE_ID_TOKEN:
      return "RESPONSE_TYPE_ID_TOKEN";
    default:
      return "UNKNOWN";
  }
}

export enum ClientSubjectType {
  CLIENT_SUBJECT_TYPE_INVALID = 0,
  CLIENT_SUBJECT_TYPE_PUBLIC = 1,
  CLIENT_SUBJECT_TYPE_PAIRWISE = 2,
  UNRECOGNIZED = -1,
}

export function clientSubjectTypeFromJSON(object: any): ClientSubjectType {
  switch (object) {
    case 0:
    case "CLIENT_SUBJECT_TYPE_INVALID":
      return ClientSubjectType.CLIENT_SUBJECT_TYPE_INVALID;
    case 1:
    case "CLIENT_SUBJECT_TYPE_PUBLIC":
      return ClientSubjectType.CLIENT_SUBJECT_TYPE_PUBLIC;
    case 2:
    case "CLIENT_SUBJECT_TYPE_PAIRWISE":
      return ClientSubjectType.CLIENT_SUBJECT_TYPE_PAIRWISE;
    case -1:
    case "UNRECOGNIZED":
    default:
      return ClientSubjectType.UNRECOGNIZED;
  }
}

export function clientSubjectTypeToJSON(object: ClientSubjectType): string {
  switch (object) {
    case ClientSubjectType.CLIENT_SUBJECT_TYPE_INVALID:
      return "CLIENT_SUBJECT_TYPE_INVALID";
    case ClientSubjectType.CLIENT_SUBJECT_TYPE_PUBLIC:
      return "CLIENT_SUBJECT_TYPE_PUBLIC";
    case ClientSubjectType.CLIENT_SUBJECT_TYPE_PAIRWISE:
      return "CLIENT_SUBJECT_TYPE_PAIRWISE";
    default:
      return "UNKNOWN";
  }
}

export enum TokenEndpointAuthMethod {
  TOKEN_ENDPOINT_AUTH_METHOD_INVALID = 0,
  TOKEN_ENDPOINT_AUTH_METHOD_CLIENT_SECRET_BASIC = 1,
  TOKEN_ENDPOINT_AUTH_METHOD_CLIENT_SECRET_POST = 2,
  TOKEN_ENDPOINT_AUTH_METHOD_PRIVATE_KEY_JWT = 3,
  TOKEN_ENDPOINT_AUTH_METHOD_NONE = 4,
  UNRECOGNIZED = -1,
}

export function tokenEndpointAuthMethodFromJSON(
  object: any
): TokenEndpointAuthMethod {
  switch (object) {
    case 0:
    case "TOKEN_ENDPOINT_AUTH_METHOD_INVALID":
      return TokenEndpointAuthMethod.TOKEN_ENDPOINT_AUTH_METHOD_INVALID;
    case 1:
    case "TOKEN_ENDPOINT_AUTH_METHOD_CLIENT_SECRET_BASIC":
      return TokenEndpointAuthMethod.TOKEN_ENDPOINT_AUTH_METHOD_CLIENT_SECRET_BASIC;
    case 2:
    case "TOKEN_ENDPOINT_AUTH_METHOD_CLIENT_SECRET_POST":
      return TokenEndpointAuthMethod.TOKEN_ENDPOINT_AUTH_METHOD_CLIENT_SECRET_POST;
    case 3:
    case "TOKEN_ENDPOINT_AUTH_METHOD_PRIVATE_KEY_JWT":
      return TokenEndpointAuthMethod.TOKEN_ENDPOINT_AUTH_METHOD_PRIVATE_KEY_JWT;
    case 4:
    case "TOKEN_ENDPOINT_AUTH_METHOD_NONE":
      return TokenEndpointAuthMethod.TOKEN_ENDPOINT_AUTH_METHOD_NONE;
    case -1:
    case "UNRECOGNIZED":
    default:
      return TokenEndpointAuthMethod.UNRECOGNIZED;
  }
}

export function tokenEndpointAuthMethodToJSON(
  object: TokenEndpointAuthMethod
): string {
  switch (object) {
    case TokenEndpointAuthMethod.TOKEN_ENDPOINT_AUTH_METHOD_INVALID:
      return "TOKEN_ENDPOINT_AUTH_METHOD_INVALID";
    case TokenEndpointAuthMethod.TOKEN_ENDPOINT_AUTH_METHOD_CLIENT_SECRET_BASIC:
      return "TOKEN_ENDPOINT_AUTH_METHOD_CLIENT_SECRET_BASIC";
    case TokenEndpointAuthMethod.TOKEN_ENDPOINT_AUTH_METHOD_CLIENT_SECRET_POST:
      return "TOKEN_ENDPOINT_AUTH_METHOD_CLIENT_SECRET_POST";
    case TokenEndpointAuthMethod.TOKEN_ENDPOINT_AUTH_METHOD_PRIVATE_KEY_JWT:
      return "TOKEN_ENDPOINT_AUTH_METHOD_PRIVATE_KEY_JWT";
    case TokenEndpointAuthMethod.TOKEN_ENDPOINT_AUTH_METHOD_NONE:
      return "TOKEN_ENDPOINT_AUTH_METHOD_NONE";
    default:
      return "UNKNOWN";
  }
}

/** ConveyancePreference ... */
export enum ConveyancePreference {
  CONVEYANCE_PREFERENCE_INVALID = 0,
  CONVEYANCE_PREFERENCE_NONE = 1,
  CONVEYANCE_PREFERENCE_INDIRECT = 2,
  CONVEYANCE_PREFERENCE_DIRECT = 3,
  UNRECOGNIZED = -1,
}

export function conveyancePreferenceFromJSON(
  object: any
): ConveyancePreference {
  switch (object) {
    case 0:
    case "CONVEYANCE_PREFERENCE_INVALID":
      return ConveyancePreference.CONVEYANCE_PREFERENCE_INVALID;
    case 1:
    case "CONVEYANCE_PREFERENCE_NONE":
      return ConveyancePreference.CONVEYANCE_PREFERENCE_NONE;
    case 2:
    case "CONVEYANCE_PREFERENCE_INDIRECT":
      return ConveyancePreference.CONVEYANCE_PREFERENCE_INDIRECT;
    case 3:
    case "CONVEYANCE_PREFERENCE_DIRECT":
      return ConveyancePreference.CONVEYANCE_PREFERENCE_DIRECT;
    case -1:
    case "UNRECOGNIZED":
    default:
      return ConveyancePreference.UNRECOGNIZED;
  }
}

export function conveyancePreferenceToJSON(
  object: ConveyancePreference
): string {
  switch (object) {
    case ConveyancePreference.CONVEYANCE_PREFERENCE_INVALID:
      return "CONVEYANCE_PREFERENCE_INVALID";
    case ConveyancePreference.CONVEYANCE_PREFERENCE_NONE:
      return "CONVEYANCE_PREFERENCE_NONE";
    case ConveyancePreference.CONVEYANCE_PREFERENCE_INDIRECT:
      return "CONVEYANCE_PREFERENCE_INDIRECT";
    case ConveyancePreference.CONVEYANCE_PREFERENCE_DIRECT:
      return "CONVEYANCE_PREFERENCE_DIRECT";
    default:
      return "UNKNOWN";
  }
}

/** AuthenticatorAttachment ... */
export enum AuthenticatorAttachment {
  AUTHENTICATOR_ATTACHMENT_INVALID = 0,
  AUTHENTICATOR_ATTACHMENT_DEFAULT = 1,
  AUTHENTICATOR_ATTACHMENT_PLATFORM = 2,
  AUTHENTICATOR_ATTACHMENT_CROSS_PLATFORM = 3,
  UNRECOGNIZED = -1,
}

export function authenticatorAttachmentFromJSON(
  object: any
): AuthenticatorAttachment {
  switch (object) {
    case 0:
    case "AUTHENTICATOR_ATTACHMENT_INVALID":
      return AuthenticatorAttachment.AUTHENTICATOR_ATTACHMENT_INVALID;
    case 1:
    case "AUTHENTICATOR_ATTACHMENT_DEFAULT":
      return AuthenticatorAttachment.AUTHENTICATOR_ATTACHMENT_DEFAULT;
    case 2:
    case "AUTHENTICATOR_ATTACHMENT_PLATFORM":
      return AuthenticatorAttachment.AUTHENTICATOR_ATTACHMENT_PLATFORM;
    case 3:
    case "AUTHENTICATOR_ATTACHMENT_CROSS_PLATFORM":
      return AuthenticatorAttachment.AUTHENTICATOR_ATTACHMENT_CROSS_PLATFORM;
    case -1:
    case "UNRECOGNIZED":
    default:
      return AuthenticatorAttachment.UNRECOGNIZED;
  }
}

export function authenticatorAttachmentToJSON(
  object: AuthenticatorAttachment
): string {
  switch (object) {
    case AuthenticatorAttachment.AUTHENTICATOR_ATTACHMENT_INVALID:
      return "AUTHENTICATOR_ATTACHMENT_INVALID";
    case AuthenticatorAttachment.AUTHENTICATOR_ATTACHMENT_DEFAULT:
      return "AUTHENTICATOR_ATTACHMENT_DEFAULT";
    case AuthenticatorAttachment.AUTHENTICATOR_ATTACHMENT_PLATFORM:
      return "AUTHENTICATOR_ATTACHMENT_PLATFORM";
    case AuthenticatorAttachment.AUTHENTICATOR_ATTACHMENT_CROSS_PLATFORM:
      return "AUTHENTICATOR_ATTACHMENT_CROSS_PLATFORM";
    default:
      return "UNKNOWN";
  }
}

/** UserVerificationRequirement ... */
export enum UserVerificationRequirement {
  USER_VERIFICATION_REQUIREMENT_INVALID = 0,
  USER_VERIFICATION_REQUIREMENT_PREFERRED = 1,
  USER_VERIFICATION_REQUIREMENT_REQUIRED = 2,
  USER_VERIFICATION_REQUIREMENT_DISCOURAGED = 3,
  UNRECOGNIZED = -1,
}

export function userVerificationRequirementFromJSON(
  object: any
): UserVerificationRequirement {
  switch (object) {
    case 0:
    case "USER_VERIFICATION_REQUIREMENT_INVALID":
      return UserVerificationRequirement.USER_VERIFICATION_REQUIREMENT_INVALID;
    case 1:
    case "USER_VERIFICATION_REQUIREMENT_PREFERRED":
      return UserVerificationRequirement.USER_VERIFICATION_REQUIREMENT_PREFERRED;
    case 2:
    case "USER_VERIFICATION_REQUIREMENT_REQUIRED":
      return UserVerificationRequirement.USER_VERIFICATION_REQUIREMENT_REQUIRED;
    case 3:
    case "USER_VERIFICATION_REQUIREMENT_DISCOURAGED":
      return UserVerificationRequirement.USER_VERIFICATION_REQUIREMENT_DISCOURAGED;
    case -1:
    case "UNRECOGNIZED":
    default:
      return UserVerificationRequirement.UNRECOGNIZED;
  }
}

export function userVerificationRequirementToJSON(
  object: UserVerificationRequirement
): string {
  switch (object) {
    case UserVerificationRequirement.USER_VERIFICATION_REQUIREMENT_INVALID:
      return "USER_VERIFICATION_REQUIREMENT_INVALID";
    case UserVerificationRequirement.USER_VERIFICATION_REQUIREMENT_PREFERRED:
      return "USER_VERIFICATION_REQUIREMENT_PREFERRED";
    case UserVerificationRequirement.USER_VERIFICATION_REQUIREMENT_REQUIRED:
      return "USER_VERIFICATION_REQUIREMENT_REQUIRED";
    case UserVerificationRequirement.USER_VERIFICATION_REQUIREMENT_DISCOURAGED:
      return "USER_VERIFICATION_REQUIREMENT_DISCOURAGED";
    default:
      return "UNKNOWN";
  }
}

export enum PasswordPolicyTemplate {
  PASSWORD_POLICY_TEMPLATE_INVALID = 0,
  PASSWORD_POLICY_TEMPLATE_CUSTOM = 1,
  PASSWORD_POLICY_TEMPLATE_NIST = 2,
  UNRECOGNIZED = -1,
}

export function passwordPolicyTemplateFromJSON(
  object: any
): PasswordPolicyTemplate {
  switch (object) {
    case 0:
    case "PASSWORD_POLICY_TEMPLATE_INVALID":
      return PasswordPolicyTemplate.PASSWORD_POLICY_TEMPLATE_INVALID;
    case 1:
    case "PASSWORD_POLICY_TEMPLATE_CUSTOM":
      return PasswordPolicyTemplate.PASSWORD_POLICY_TEMPLATE_CUSTOM;
    case 2:
    case "PASSWORD_POLICY_TEMPLATE_NIST":
      return PasswordPolicyTemplate.PASSWORD_POLICY_TEMPLATE_NIST;
    case -1:
    case "UNRECOGNIZED":
    default:
      return PasswordPolicyTemplate.UNRECOGNIZED;
  }
}

export function passwordPolicyTemplateToJSON(
  object: PasswordPolicyTemplate
): string {
  switch (object) {
    case PasswordPolicyTemplate.PASSWORD_POLICY_TEMPLATE_INVALID:
      return "PASSWORD_POLICY_TEMPLATE_INVALID";
    case PasswordPolicyTemplate.PASSWORD_POLICY_TEMPLATE_CUSTOM:
      return "PASSWORD_POLICY_TEMPLATE_CUSTOM";
    case PasswordPolicyTemplate.PASSWORD_POLICY_TEMPLATE_NIST:
      return "PASSWORD_POLICY_TEMPLATE_NIST";
    default:
      return "UNKNOWN";
  }
}

/**
 * UniqueNameIdentifier is an alternative to Globally Unique ID generated by the server.
 *
 * This identifier combines the Globally Unique ID of the location where to look for the name
 * to find the object. It makes the object identification easier by the human readable name.
 */
export interface UniqueNameIdentifier {
  location: string;
  /** Name is unique name of configuration object. */
  name: string;
}

/** Customer representing the Customer Node. */
export interface Customer {
  /** Globally unique identifier. */
  id: string;
  /** Name is unique name of configuration object. */
  name: string;
  /** Human readable name of configuration. */
  displayName: string;
  /** Description of the configuration */
  description?: string;
  /** Output only. The time at which the configuration was created. */
  createTime?: Date;
  /**
   * Output only. The time at which the configuration was last changed.
   *
   * This value is initially set to the `create_time` then increases monotonically with each change.
   */
  updateTime?: Date;
  /**
   * Output only. The time this configuration was destroyed.
   *
   * Only present if deletion of object was requested.
   */
  destroyTime?: Date;
  /**
   * Output only. The time this configuration will be entirely deleted.
   *
   * Only present if deletion of object was requested.
   */
  deleteTime?: Date;
  /** Output only. Multiversion concurrency control version. */
  etag: string;
}

/** ApplicationSpace representing the Application Space Node. */
export interface ApplicationSpace {
  /** Globally unique identifier. */
  id: string;
  /** Name is unique name of configuration object. */
  name: string;
  /** Human readable name of configuration. */
  displayName: string;
  /** Description of the configuration */
  description?: string;
  /** Output only. The time at which the configuration was created. */
  createTime?: Date;
  /**
   * Output only. The time at which the configuration was last changed.
   *
   * This value is initially set to the `create_time` then increases monotonically with each change.
   */
  updateTime?: Date;
  /**
   * Output only. The time this configuration was destroyed.
   *
   * Only present if deletion of object was requested.
   */
  destroyTime?: Date;
  /**
   * Output only. The time this configuration will be entirely deleted.
   *
   * Only present if deletion of object was requested.
   */
  deleteTime?: Date;
  /** Output only. Multiversion concurrency control version. */
  etag: string;
  /** CustomerId this object is directly or indirectly connected to. */
  customerId: string;
  /** IssuerId associated with this Application Space. */
  issuerId: string;
}

/**
 * Tenant is a representation of an organization.
 * Tenant is distinct and separate from other IndyKite tenants and has its own
 * representation of objects.
 */
export interface Tenant {
  /** Globally unique identifier. */
  id: string;
  /** Name is unique name of configuration object. */
  name: string;
  /** Human readable name of configuration. */
  displayName: string;
  /** Description of the configuration */
  description?: string;
  /** Output only. The time at which the configuration was created. */
  createTime?: Date;
  /**
   * Output only. The time at which the configuration was last changed.
   *
   * This value is initially set to the `create_time` then increases monotonically with each change.
   */
  updateTime?: Date;
  /**
   * Output only. The time this configuration was destroyed.
   *
   * Only present if deletion of object was requested.
   */
  destroyTime?: Date;
  /**
   * Output only. The time this configuration will be entirely deleted.
   *
   * Only present if deletion of object was requested.
   */
  deleteTime?: Date;
  /** Output only. Multiversion concurrency control version. */
  etag: string;
  /** CustomerId this object is directly or indirectly connected to. */
  customerId: string;
  /** AppSpaceId this object is directly or indirectly connected to. */
  appSpaceId: string;
  /** IssuerId this object is directly or indirectly connected to. */
  issuerId: string;
}

/** Application represents the customer application. */
export interface Application {
  /** Globally unique identifier. */
  id: string;
  /** Name is unique name of configuration object. */
  name: string;
  /** Human readable name of configuration. */
  displayName: string;
  /** Description of the configuration */
  description?: string;
  /** Output only. The time at which the configuration was created. */
  createTime?: Date;
  /**
   * Output only. The time at which the configuration was last changed.
   *
   * This value is initially set to the `create_time` then increases monotonically with each change.
   */
  updateTime?: Date;
  /**
   * Output only. The time this configuration was destroyed.
   *
   * Only present if deletion of object was requested.
   */
  destroyTime?: Date;
  /**
   * Output only. The time this configuration will be entirely deleted.
   *
   * Only present if deletion of object was requested.
   */
  deleteTime?: Date;
  /** Output only. Multiversion concurrency control version. */
  etag: string;
  /** CustomerId this object is directly or indirectly connected to. */
  customerId: string;
  /** AppSpaceId this object is directly or indirectly connected to. */
  appSpaceId: string;
}

export interface ApplicationAgent {
  /** Globally unique identifier. */
  id: string;
  /** Name is unique name of configuration object. */
  name: string;
  /** Human readable name of configuration. */
  displayName: string;
  /** Description of the configuration */
  description?: string;
  /** Output only. The time at which the configuration was created. */
  createTime?: Date;
  /**
   * Output only. The time at which the configuration was last changed.
   *
   * This value is initially set to the `create_time` then increases monotonically with each change.
   */
  updateTime?: Date;
  /**
   * Output only. The time this configuration was destroyed.
   *
   * Only present if deletion of object was requested.
   */
  destroyTime?: Date;
  /**
   * Output only. The time this configuration will be entirely deleted.
   *
   * Only present if deletion of object was requested.
   */
  deleteTime?: Date;
  /** Output only. Multiversion concurrency control version. */
  etag: string;
  /** CustomerId this object is directly or indirectly connected to. */
  customerId: string;
  /** AppSpaceId this object is directly or indirectly connected to. */
  appSpaceId: string;
  /** ApplicationId this object is directly connected to. */
  applicationId: string;
}

export interface ApplicationAgentCredential {
  /** Globally unique identifier. */
  id: string;
  /** Kid is public key ID */
  kid: string;
  /** Human readable name of configuration. */
  displayName: string;
  /** Output only. The time at which the configuration was created. */
  createTime?: Date;
  /**
   * Output only. The time this configuration was destroyed.
   *
   * Only present if deletion of object was requested.
   */
  destroyTime?: Date;
  /**
   * Output only. The time this configuration will be entirely deleted.
   *
   * Only present if deletion of object was requested.
   */
  deleteTime?: Date;
  /** CustomerId this object is directly or indirectly connected to. */
  customerId: string;
  /** AppSpaceId this object is directly or indirectly connected to. */
  appSpaceId: string;
  /** ApplicationId this object is directly connected to. */
  applicationId: string;
  /** ApplicationAgentId this object is directly connected to. */
  applicationAgentId: string;
}

export interface ConfigNode {
  /** Globally unique identifier. */
  id: string;
  /** Name is unique name of configuration object. */
  name: string;
  /** Human readable name of configuration. */
  displayName: string;
  /** Description of the configuration */
  description?: string;
  /** Output only. The time at which the configuration was created. */
  createTime?: Date;
  /**
   * Output only. The time at which the configuration was last changed.
   *
   * This value is initially set to the `create_time` then increases monotonically with each change.
   */
  updateTime?: Date;
  /**
   * Output only. The time this configuration was destroyed.
   *
   * Only present if deletion of object was requested.
   */
  destroyTime?: Date;
  /**
   * Output only. The time this configuration will be entirely deleted.
   *
   * Only present if deletion of object was requested.
   */
  deleteTime?: Date;
  /** Output only. Multiversion concurrency control version. */
  etag: string;
  /** CustomerId this object is directly or indirectly connected to. */
  customerId: string;
  /** AppSpaceId this object is directly or indirectly connected to. */
  appSpaceId: string;
  /** TenantId this object is directly or indirectly connected to. */
  tenantId: string;
  config?:
    | { $case: "authFlowConfig"; authFlowConfig: AuthFlowConfig }
    | { $case: "emailServiceConfig"; emailServiceConfig: EmailServiceConfig }
    | { $case: "oauth2ClientConfig"; oauth2ClientConfig: OAuth2ClientConfig }
    | {
        $case: "passwordProviderConfig";
        passwordProviderConfig: PasswordProviderConfig;
      }
    | {
        $case: "webauthnProviderConfig";
        webauthnProviderConfig: WebAuthnProviderConfig;
      }
    | {
        $case: "authenteqProviderConfig";
        authenteqProviderConfig: AuthenteqProviderConfig;
      }
    | { $case: "safrProviderConfig"; safrProviderConfig: SAFRProviderConfig };
}

/** OAuth2ClientConfig is a service specific set of parameters */
export interface OAuth2ClientConfig {
  providerType: ProviderType;
  clientId: string;
  clientSecret: string;
  redirectUri: string[];
  defaultScopes: string[];
  /** string loginHint = 5; */
  allowedScopes: string[];
  /** string code_challenge_method = 6 [(validate.rules).string = {ignore_empty: true, in: ["plain", "S256"]}]; */
  allowSignup: boolean;
  /**
   * URL using the https scheme with no query or fragment component that the OP asserts as its Issuer Identifier.
   * If Issuer discovery is supported (see Section 2), this value MUST be identical to the issuer value returned by WebFinger.
   * This also MUST be identical to the iss Claim value in ID Tokens issued from this Issuer.
   * Example: `https://server/issuer/.well-known/openid-configuration`
   */
  issuer: string;
  /**
   * URL of the OP's OAuth 2.0 Authorization Endpoint
   * Example: `https://server/issuer/.well-known/openid-configuration`
   */
  authorizationEndpoint: string;
  /** RL of the OP's OAuth 2.0 Token Endpoint */
  tokenEndpoint: string;
  discoveryUrl: string;
  /**
   * URL of the OP's UserInfo Endpoint
   * Example `https://server/issuer/.well-known/openid-configuration`
   */
  userinfoEndpoint: string;
  /**
   * URL of the OP's JSON Web Key Set [JWK] document. This contains the signing key(s) the
   * RP uses to validate signatures from the OP. The JWK Set MAY also contain the Server's encryption key(s),
   * which are used by RPs to encrypt requests to the Server. When both signing and encryption keys are made available,
   * a use (Key Use) parameter value is REQUIRED for all keys in the referenced JWK Set to indicate each key's
   * intended usage. Although some algorithms allow the same key to be used for both signatures and encryption,
   * doing so is NOT RECOMMENDED, as it is less secure. The JWK x5c parameter MAY be used to provide X.509
   * representations of keys provided. When used, the bare key values MUST still be present and MUST match those in the certificate.
   */
  jwksUri: string;
  /** Example `https://server/openid.png` */
  imageUrl: string;
  /** Example `login.microsoftonline.com/" + tenant + "/oauth2/v2.0/authorize` */
  tenant: string;
  /**
   * [Send Auth Request](https://developers.google.com/identity/protocols/oauth2/openid-connect#sendauthrequest)
   * [Authentication URI Parameters](https://developers.google.com/identity/protocols/oauth2/openid-connect#authenticationuriparameters)
   */
  hostedDomains: string;
}

export interface OAuth2Application {
  /** Globally unique identifier. */
  id: string;
  /** Name is unique name of configuration object. */
  name: string;
  /** Human readable name of configuration. */
  displayName: string;
  /** Description of the configuration */
  description?: string;
  /** Output only. The time at which the configuration was created. */
  createTime?: Date;
  /**
   * Output only. The time at which the configuration was last changed.
   *
   * This value is initially set to the `create_time` then increases monotonically with each change.
   */
  updateTime?: Date;
  /**
   * Output only. The time this configuration was destroyed.
   *
   * Only present if deletion of object was requested.
   */
  destroyTime?: Date;
  /**
   * Output only. The time this configuration will be entirely deleted.
   *
   * Only present if deletion of object was requested.
   */
  deleteTime?: Date;
  /** Output only. Multiversion concurrency control version. */
  etag: string;
  /** CustomerId this object is indirectly connected to. */
  customerId: string;
  /** AppSpaceId this object is indirectly connected to. */
  appSpaceId: string;
  /** oauth2_provider_id this object is directly connected to. */
  oauth2ProviderId: string;
  /** OAuth2ApplicationConfig IndyKite OIDC Application Config */
  config?: OAuth2ApplicationConfig;
}

export interface OAuth2ApplicationConfig {
  /**
   * ClientId is the id for this client.
   * It is read-only and is ignored during create/update request.
   */
  clientId: string;
  /** DisplayName is a human readable name to show in consent page etc, not in Console */
  displayName: string;
  /** Description is a optional description to show in consent page etc, not in Console */
  description: string;
  /** RedirectURIs is an array of allowed redirect urls for the client, for example http://mydomain/oauth/callback . */
  redirectUris: string[];
  /** Owner is a string identifying the owner of the OAuth 2.0 Client. */
  owner: string;
  /**
   * PolicyURI is a URL string that points to a human-readable privacy policy document
   * that describes how the deployment organization collects, uses,
   * retains, and discloses personal data.
   */
  policyUri: string;
  /**
   * AllowedCORSOrigins are one or more URLs (scheme://host[:port]) which are allowed to make CORS requests
   * to the /oauth/token endpoint. If this array is empty, the sever's CORS origin configuration (`CORS_ALLOWED_ORIGINS`)
   * will be used instead. If this array is set, the allowed origins are appended to the server's CORS origin configuration.
   * Be aware that environment variable `CORS_ENABLED` MUST be set to `true` for this to work.
   */
  allowedCorsOrigins: string[];
  /**
   * TermsOfServiceURI is a URL string that points to a human-readable terms of service
   * document for the client that describes a contractual relationship
   * between the end-user and the client that the end-user accepts when
   * authorizing the client.
   */
  termsOfServiceUri: string;
  /**
   * ClientURI is an URL string of a web page providing information about the client.
   * If present, the server SHOULD display this URL to the end-user in
   * a clickable fashion.
   */
  clientUri: string;
  /** LogoURI is an URL string that references a logo for the client. */
  logoUri: string;
  /** UserSupportEmailAddress is main email contact for User support */
  userSupportEmailAddress: string;
  /**
   * AdditionalContacts is a array of strings representing ways to contact people responsible
   * for this client, typically email addresses.
   */
  additionalContacts: string[];
  /**
   * SubjectType requested for responses to this Client. The subject_types_supported Discovery parameter contains a
   * list of the supported subject_type values for this server. Valid types include `pairwise` and `public`.
   */
  subjectType: ClientSubjectType;
  /**
   * URL using the https scheme to be used in calculating Pseudonymous Identifiers by the OP. The URL references a
   * file with a single JSON array of redirect_uri values.
   */
  sectorIdentifierUri: string;
  /**
   * GrantTypes is an array of grant types the client is allowed to use.
   *
   * Pattern: client_credentials|authorization_code|implicit|refresh_token
   */
  grantTypes: GrantType[];
  /**
   * ResponseTypes is an array of the OAuth 2.0 response type strings that the client can
   * use at the authorization endpoint.
   *
   * Pattern: id_token|code|token
   */
  responseTypes: ResponseType[];
  /**
   * Scope is a string containing a space-separated list of scope values (as
   * described in Section 3.3 of OAuth 2.0 [RFC6749]) that the client
   * can use when requesting access tokens.
   *
   * Pattern: ^[!#-\[\]-~]{1,254}$
   */
  scopes: string[];
  /**
   * Audience is a whitelist defining the audiences this client is allowed to request tokens for. An audience limits
   * the applicability of an OAuth 2.0 Access Token to, for example, certain API endpoints.
   */
  audiences: string[];
  /**
   * Requested Client Authentication method for the Token Endpoint. The options are client_secret_post,
   * client_secret_basic, private_key_jwt, and none.
   */
  tokenEndpointAuthMethod: TokenEndpointAuthMethod;
  /** Requested Client Authentication signing algorithm for the Token Endpoint. */
  tokenEndpointAuthSigningAlg: string;
  /**
   * JWS alg algorithm [JWA] REQUIRED for signing UserInfo Responses. If this is specified, the response will be JWT
   * [JWT] serialized, and signed using JWS. The default, if omitted, is for the UserInfo Response to return the Claims
   * as a UTF-8 encoded JSON object using the application/json content-type.
   */
  userinfoSignedResponseAlg: string;
}

export interface OAuth2Provider {
  /** Globally unique identifier. */
  id: string;
  /** Name is unique name of configuration object. */
  name: string;
  /** Human readable name of configuration. */
  displayName: string;
  /** Description of the configuration */
  description?: string;
  /** Output only. The time at which the configuration was created. */
  createTime?: Date;
  /**
   * Output only. The time at which the configuration was last changed.
   *
   * This value is initially set to the `create_time` then increases monotonically with each change.
   */
  updateTime?: Date;
  /**
   * Output only. The time this configuration was destroyed.
   *
   * Only present if deletion of object was requested.
   */
  destroyTime?: Date;
  /**
   * Output only. The time this configuration will be entirely deleted.
   *
   * Only present if deletion of object was requested.
   */
  deleteTime?: Date;
  /** Output only. Multiversion concurrency control version. */
  etag: string;
  /** CustomerId this object is indirectly connected to. */
  customerId: string;
  /** AppSpaceId this object is indirectly connected to. */
  appSpaceId: string;
  /** OAuth2ApplicationConfig IndyKite OIDC Application Config */
  config?: OAuth2ProviderConfig;
}

export interface OAuth2ProviderConfig {
  /**
   * GrantTypes is an array of grant types the client is allowed to use.
   *
   * Pattern: client_credentials|authorization_code|implicit|refresh_token
   */
  grantTypes: GrantType[];
  /**
   * ResponseTypes is an array of the OAuth 2.0 response type strings that the client can
   * use at the authorization endpoint.
   *
   * Pattern: id_token|code|token
   */
  responseTypes: ResponseType[];
  /**
   * Scope is a string containing a space-separated list of scope values (as
   * described in Section 3.3 of OAuth 2.0 [RFC6749]) that the client
   * can use when requesting access tokens.
   *
   * Pattern: ^[!#-\[\]-~]{1,254}$
   */
  scopes: string[];
  /**
   * Requested Client Authentication method for the Token Endpoint. The options are client_secret_post,
   * client_secret_basic, private_key_jwt, and none.
   */
  tokenEndpointAuthMethod: TokenEndpointAuthMethod[];
  /** Requested Client Authentication signing algorithm for the Token Endpoint. */
  tokenEndpointAuthSigningAlg: string[];
  /**
   * Array of request_uri values that are pre-registered by the RP for use at the OP. Servers MAY cache the
   * contents of the files referenced by these URIs and not retrieve them at the time they are used in a request.
   * OPs can require that request_uri values used be pre-registered with the require_request_uri_registration
   * discovery parameter.
   */
  requestUris: string[];
  /**
   * RequestObjectSigningAlg JWS [JWS] alg algorithm [JWA] that MUST be used for signing Request Objects sent to the OP. All Request Objects
   * from this Client MUST be rejected, if not signed with this algorithm.
   */
  requestObjectSigningAlg: string;
  frontChannelLoginUri: { [key: string]: string };
  frontChannelConsentUri: { [key: string]: string };
}

export interface OAuth2ProviderConfig_FrontChannelLoginUriEntry {
  key: string;
  value: string;
}

export interface OAuth2ProviderConfig_FrontChannelConsentUriEntry {
  key: string;
  value: string;
}

/** WebAuthnProviderConfig ... */
export interface WebAuthnProviderConfig {
  id: string;
  /** Could be Shared between multiple sites? WebAuthnSiteDefinition */
  displayName: string;
  origin: string;
  icon: string;
  /**  */
  attestationPreference: ConveyancePreference;
  authenticatorAttachment: AuthenticatorAttachment;
  requireResidentKey: boolean;
  userVerification: UserVerificationRequirement;
  /**  */
  registrationTimeout: number;
  authenticationTimeout: number;
  debug: boolean;
}

/** WebAuthnSiteDefinition ... */
export interface WebAuthnSiteDefinition {
  id: string;
  displayName: string;
  origin: string;
  icon: string;
}

/** AuthFlowConfig Flow Definition */
export interface AuthFlowConfig {
  sourceFormat: AuthFlowConfig_Format;
  /** JSON from Console UI of the Flow diagram */
  source: Buffer;
  default?: boolean;
  /** Proto soon to deprecate once the rich_json can be parsed and compiled. */
  proto?: Any;
}

export enum AuthFlowConfig_Format {
  FORMAT_BARE_INVALID = 0,
  FORMAT_BARE_YAML = 1,
  FORMAT_BARE_JSON = 2,
  FORMAT_RICH_JSON = 3,
  UNRECOGNIZED = -1,
}

export function authFlowConfig_FormatFromJSON(
  object: any
): AuthFlowConfig_Format {
  switch (object) {
    case 0:
    case "FORMAT_BARE_INVALID":
      return AuthFlowConfig_Format.FORMAT_BARE_INVALID;
    case 1:
    case "FORMAT_BARE_YAML":
      return AuthFlowConfig_Format.FORMAT_BARE_YAML;
    case 2:
    case "FORMAT_BARE_JSON":
      return AuthFlowConfig_Format.FORMAT_BARE_JSON;
    case 3:
    case "FORMAT_RICH_JSON":
      return AuthFlowConfig_Format.FORMAT_RICH_JSON;
    case -1:
    case "UNRECOGNIZED":
    default:
      return AuthFlowConfig_Format.UNRECOGNIZED;
  }
}

export function authFlowConfig_FormatToJSON(
  object: AuthFlowConfig_Format
): string {
  switch (object) {
    case AuthFlowConfig_Format.FORMAT_BARE_INVALID:
      return "FORMAT_BARE_INVALID";
    case AuthFlowConfig_Format.FORMAT_BARE_YAML:
      return "FORMAT_BARE_YAML";
    case AuthFlowConfig_Format.FORMAT_BARE_JSON:
      return "FORMAT_BARE_JSON";
    case AuthFlowConfig_Format.FORMAT_RICH_JSON:
      return "FORMAT_RICH_JSON";
    default:
      return "UNKNOWN";
  }
}

/** AuthenteqProviderConfig ... */
export interface AuthenteqProviderConfig {
  /** DefaultRedirectUri used when RedirectUri selection is not obvious. */
  defaultRedirectUri: string;
  clientId: string;
  clientSecret: string;
  hostAddress: string;
}

/** SAFRProviderConfig ... */
export interface SAFRProviderConfig {
  accountId: string;
  password: string;
  /**
   * Directory ...
   * Default value : main
   */
  directory: string;
}

/** SMSServiceConfig ... */
export interface SMSServiceConfig {}

/** EmailServiceConfig ... */
export interface EmailServiceConfig {
  defaultFromAddress?: Email;
  default?: boolean;
  provider?:
    | { $case: "sendgrid"; sendgrid: SendGridProviderConfig }
    | { $case: "mailjet"; mailjet: MailJetProviderConfig }
    | { $case: "mailgun"; mailgun: MailgunProviderConfig }
    | { $case: "amazon"; amazon: AmazonSESProviderConfig };
  authenticationMessage?: EmailDefinition;
  invitationMessage?: EmailDefinition;
  resetPasswordMessage?: EmailDefinition;
  verificationMessage?: EmailDefinition;
}

/** Email holds email name and address info. */
export interface Email {
  address: string;
  name: string;
}

export interface SendGridProviderConfig {
  apiKey: string;
  sandboxMode: boolean;
  ipPoolName?: string;
  /** Host default to https://api.sendgrid.com */
  host?: string;
}

export interface MailJetProviderConfig {
  apiKey: string;
  sandboxMode: boolean;
  urlTags: { [key: string]: string };
  customCampaign?: string;
}

export interface MailJetProviderConfig_UrlTagsEntry {
  key: string;
  value: string;
}

export interface MailgunProviderConfig {
  apiKey: string;
  defaultFromAddress?: Email;
}

export interface AmazonSESProviderConfig {
  /** AWS Access key ID */
  accessKeyId: string;
  /** AWS Secret Access Key */
  secretAccessKey: string;
  /**
   * The region to send requests to. This parameter is required and must
   * be configured globally or on a per-client basis unless otherwise
   * noted. A full list of regions is found in the "Regions and Endpoints"
   * document.
   *
   * See (Regions)[http://docs.aws.amazon.com/general/latest/gr/rande.html] for AWS
   * Regions and Endpoints.
   */
  region: string;
  /** ConfigurationSetName The name of the configuration set that you want to use when sending the email. */
  configurationSetName: string;
  defaultFromAddress?: Email;
  /** FeedbackForwardingEmailAddress The address that you want bounce and complaint notifications to be sent to. */
  feedbackForwardingEmailAddress: string;
  /**
   * ReplyToAddresses The "Reply-to" email addresses for the message.
   *
   * When the recipient replies  to the message, each Reply-to address receives the reply.
   */
  replyToAddresses: string[];
}

export interface EmailDefinition {
  email?:
    | { $case: "template"; template: EmailTemplate }
    | { $case: "message"; message: EmailMessage };
}

export interface EmailTemplate {
  templateId: string;
  templateVersion?: string;
  from?: Email;
  replyTo?: Email;
  to: Email[];
  cc: Email[];
  bcc: Email[];
  subject: string;
  headers: { [key: string]: string };
  customArgs: { [key: string]: string };
  dynamicTemplateValues: { [key: string]: Value };
  categories: string[];
  attachments: EmailAttachment[];
  eventPayload?: string;
  /** The Amazon Resource Name (ARN) of the template. */
  templateArn: string;
}

export interface EmailTemplate_HeadersEntry {
  key: string;
  value: string;
}

export interface EmailTemplate_CustomArgsEntry {
  key: string;
  value: string;
}

export interface EmailTemplate_DynamicTemplateValuesEntry {
  key: string;
  value?: Value;
}

export interface EmailAttachment {
  contentType: string;
  contentId?: string;
  inline: boolean;
  fileName: string;
  content: Buffer;
}

export interface EmailMessage {
  from?: Email;
  replyTo?: Email;
  to: Email[];
  cc: Email[];
  bcc: Email[];
  subject: string;
  textContent: string;
  htmlContent: string;
  headers: { [key: string]: string };
  customArgs: { [key: string]: string };
  dynamicTemplateValues: { [key: string]: Value };
  categories: string[];
  attachments: EmailAttachment[];
  eventPayload?: string;
}

export interface EmailMessage_HeadersEntry {
  key: string;
  value: string;
}

export interface EmailMessage_CustomArgsEntry {
  key: string;
  value: string;
}

export interface EmailMessage_DynamicTemplateValuesEntry {
  key: string;
  value?: Value;
}

/** PasswordProviderConfig ... */
export interface PasswordProviderConfig {
  usernamePolicy?: UsernamePolicy;
  passwordPolicy?: PasswordPolicy;
  /** Specifies the period (in seconds) after which the failure count will be reset. */
  failInterval?: Duration;
  minimumPasswordLifetime?: Duration;
  maximumPasswordLifetime?: Duration;
  /** Sets the number of previous passwords that are stored and which a user is prevented from using */
  passwordHistory: string;
  /** Specifies the maximum number of consecutive failures to input the correct password before the user's account is locked. */
  maximumConsecutiveFailures: string;
  /** Specifies the period (in seconds) for which a lockout is enforced. */
  lockoutTime?: Duration;
}

export interface UsernamePolicy {
  /** Must be valid email with MX record */
  validEmail: boolean;
  /** Email must be verified */
  verifyEmail: boolean;
  /** Allowed email domains to register. Can be shared among tenants. */
  allowedEmailDomains: string[];
  /** Unique email domain in AppSpace, not allowed to be shared amon tenants. */
  exclusiveEmailDomains: string[];
}

export interface PasswordPolicy {
  template: PasswordPolicyTemplate;
  minimumLength?: string;
}

const baseUniqueNameIdentifier: object = { location: "", name: "" };

export const UniqueNameIdentifier = {
  encode(
    message: UniqueNameIdentifier,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.location !== "") {
      writer.uint32(10).string(message.location);
    }
    if (message.name !== "") {
      writer.uint32(18).string(message.name);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): UniqueNameIdentifier {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseUniqueNameIdentifier } as UniqueNameIdentifier;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.location = reader.string();
          break;
        case 2:
          message.name = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): UniqueNameIdentifier {
    const message = { ...baseUniqueNameIdentifier } as UniqueNameIdentifier;
    if (object.location !== undefined && object.location !== null) {
      message.location = String(object.location);
    }
    if (object.name !== undefined && object.name !== null) {
      message.name = String(object.name);
    }
    return message;
  },

  toJSON(message: UniqueNameIdentifier): unknown {
    const obj: any = {};
    message.location !== undefined && (obj.location = message.location);
    message.name !== undefined && (obj.name = message.name);
    return obj;
  },

  fromPartial(object: DeepPartial<UniqueNameIdentifier>): UniqueNameIdentifier {
    const message = { ...baseUniqueNameIdentifier } as UniqueNameIdentifier;
    if (object.location !== undefined && object.location !== null) {
      message.location = object.location;
    }
    if (object.name !== undefined && object.name !== null) {
      message.name = object.name;
    }
    return message;
  },
};

const baseCustomer: object = { id: "", name: "", displayName: "", etag: "" };

export const Customer = {
  encode(message: Customer, writer: Writer = Writer.create()): Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.name !== "") {
      writer.uint32(18).string(message.name);
    }
    if (message.displayName !== "") {
      writer.uint32(26).string(message.displayName);
    }
    if (message.description !== undefined) {
      StringValue.encode(
        { value: message.description! },
        writer.uint32(34).fork()
      ).ldelim();
    }
    if (message.createTime !== undefined) {
      Timestamp.encode(
        toTimestamp(message.createTime),
        writer.uint32(42).fork()
      ).ldelim();
    }
    if (message.updateTime !== undefined) {
      Timestamp.encode(
        toTimestamp(message.updateTime),
        writer.uint32(50).fork()
      ).ldelim();
    }
    if (message.destroyTime !== undefined) {
      Timestamp.encode(
        toTimestamp(message.destroyTime),
        writer.uint32(58).fork()
      ).ldelim();
    }
    if (message.deleteTime !== undefined) {
      Timestamp.encode(
        toTimestamp(message.deleteTime),
        writer.uint32(66).fork()
      ).ldelim();
    }
    if (message.etag !== "") {
      writer.uint32(74).string(message.etag);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): Customer {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseCustomer } as Customer;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string();
          break;
        case 2:
          message.name = reader.string();
          break;
        case 3:
          message.displayName = reader.string();
          break;
        case 4:
          message.description = StringValue.decode(
            reader,
            reader.uint32()
          ).value;
          break;
        case 5:
          message.createTime = fromTimestamp(
            Timestamp.decode(reader, reader.uint32())
          );
          break;
        case 6:
          message.updateTime = fromTimestamp(
            Timestamp.decode(reader, reader.uint32())
          );
          break;
        case 7:
          message.destroyTime = fromTimestamp(
            Timestamp.decode(reader, reader.uint32())
          );
          break;
        case 8:
          message.deleteTime = fromTimestamp(
            Timestamp.decode(reader, reader.uint32())
          );
          break;
        case 9:
          message.etag = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Customer {
    const message = { ...baseCustomer } as Customer;
    if (object.id !== undefined && object.id !== null) {
      message.id = String(object.id);
    }
    if (object.name !== undefined && object.name !== null) {
      message.name = String(object.name);
    }
    if (object.displayName !== undefined && object.displayName !== null) {
      message.displayName = String(object.displayName);
    }
    if (object.description !== undefined && object.description !== null) {
      message.description = String(object.description);
    }
    if (object.createTime !== undefined && object.createTime !== null) {
      message.createTime = fromJsonTimestamp(object.createTime);
    }
    if (object.updateTime !== undefined && object.updateTime !== null) {
      message.updateTime = fromJsonTimestamp(object.updateTime);
    }
    if (object.destroyTime !== undefined && object.destroyTime !== null) {
      message.destroyTime = fromJsonTimestamp(object.destroyTime);
    }
    if (object.deleteTime !== undefined && object.deleteTime !== null) {
      message.deleteTime = fromJsonTimestamp(object.deleteTime);
    }
    if (object.etag !== undefined && object.etag !== null) {
      message.etag = String(object.etag);
    }
    return message;
  },

  toJSON(message: Customer): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    message.name !== undefined && (obj.name = message.name);
    message.displayName !== undefined &&
      (obj.displayName = message.displayName);
    message.description !== undefined &&
      (obj.description = message.description);
    message.createTime !== undefined &&
      (obj.createTime = message.createTime.toISOString());
    message.updateTime !== undefined &&
      (obj.updateTime = message.updateTime.toISOString());
    message.destroyTime !== undefined &&
      (obj.destroyTime = message.destroyTime.toISOString());
    message.deleteTime !== undefined &&
      (obj.deleteTime = message.deleteTime.toISOString());
    message.etag !== undefined && (obj.etag = message.etag);
    return obj;
  },

  fromPartial(object: DeepPartial<Customer>): Customer {
    const message = { ...baseCustomer } as Customer;
    if (object.id !== undefined && object.id !== null) {
      message.id = object.id;
    }
    if (object.name !== undefined && object.name !== null) {
      message.name = object.name;
    }
    if (object.displayName !== undefined && object.displayName !== null) {
      message.displayName = object.displayName;
    }
    if (object.description !== undefined && object.description !== null) {
      message.description = object.description;
    }
    if (object.createTime !== undefined && object.createTime !== null) {
      message.createTime = object.createTime;
    }
    if (object.updateTime !== undefined && object.updateTime !== null) {
      message.updateTime = object.updateTime;
    }
    if (object.destroyTime !== undefined && object.destroyTime !== null) {
      message.destroyTime = object.destroyTime;
    }
    if (object.deleteTime !== undefined && object.deleteTime !== null) {
      message.deleteTime = object.deleteTime;
    }
    if (object.etag !== undefined && object.etag !== null) {
      message.etag = object.etag;
    }
    return message;
  },
};

const baseApplicationSpace: object = {
  id: "",
  name: "",
  displayName: "",
  etag: "",
  customerId: "",
  issuerId: "",
};

export const ApplicationSpace = {
  encode(message: ApplicationSpace, writer: Writer = Writer.create()): Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.name !== "") {
      writer.uint32(18).string(message.name);
    }
    if (message.displayName !== "") {
      writer.uint32(26).string(message.displayName);
    }
    if (message.description !== undefined) {
      StringValue.encode(
        { value: message.description! },
        writer.uint32(34).fork()
      ).ldelim();
    }
    if (message.createTime !== undefined) {
      Timestamp.encode(
        toTimestamp(message.createTime),
        writer.uint32(42).fork()
      ).ldelim();
    }
    if (message.updateTime !== undefined) {
      Timestamp.encode(
        toTimestamp(message.updateTime),
        writer.uint32(50).fork()
      ).ldelim();
    }
    if (message.destroyTime !== undefined) {
      Timestamp.encode(
        toTimestamp(message.destroyTime),
        writer.uint32(58).fork()
      ).ldelim();
    }
    if (message.deleteTime !== undefined) {
      Timestamp.encode(
        toTimestamp(message.deleteTime),
        writer.uint32(66).fork()
      ).ldelim();
    }
    if (message.etag !== "") {
      writer.uint32(74).string(message.etag);
    }
    if (message.customerId !== "") {
      writer.uint32(82).string(message.customerId);
    }
    if (message.issuerId !== "") {
      writer.uint32(90).string(message.issuerId);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): ApplicationSpace {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseApplicationSpace } as ApplicationSpace;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string();
          break;
        case 2:
          message.name = reader.string();
          break;
        case 3:
          message.displayName = reader.string();
          break;
        case 4:
          message.description = StringValue.decode(
            reader,
            reader.uint32()
          ).value;
          break;
        case 5:
          message.createTime = fromTimestamp(
            Timestamp.decode(reader, reader.uint32())
          );
          break;
        case 6:
          message.updateTime = fromTimestamp(
            Timestamp.decode(reader, reader.uint32())
          );
          break;
        case 7:
          message.destroyTime = fromTimestamp(
            Timestamp.decode(reader, reader.uint32())
          );
          break;
        case 8:
          message.deleteTime = fromTimestamp(
            Timestamp.decode(reader, reader.uint32())
          );
          break;
        case 9:
          message.etag = reader.string();
          break;
        case 10:
          message.customerId = reader.string();
          break;
        case 11:
          message.issuerId = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ApplicationSpace {
    const message = { ...baseApplicationSpace } as ApplicationSpace;
    if (object.id !== undefined && object.id !== null) {
      message.id = String(object.id);
    }
    if (object.name !== undefined && object.name !== null) {
      message.name = String(object.name);
    }
    if (object.displayName !== undefined && object.displayName !== null) {
      message.displayName = String(object.displayName);
    }
    if (object.description !== undefined && object.description !== null) {
      message.description = String(object.description);
    }
    if (object.createTime !== undefined && object.createTime !== null) {
      message.createTime = fromJsonTimestamp(object.createTime);
    }
    if (object.updateTime !== undefined && object.updateTime !== null) {
      message.updateTime = fromJsonTimestamp(object.updateTime);
    }
    if (object.destroyTime !== undefined && object.destroyTime !== null) {
      message.destroyTime = fromJsonTimestamp(object.destroyTime);
    }
    if (object.deleteTime !== undefined && object.deleteTime !== null) {
      message.deleteTime = fromJsonTimestamp(object.deleteTime);
    }
    if (object.etag !== undefined && object.etag !== null) {
      message.etag = String(object.etag);
    }
    if (object.customerId !== undefined && object.customerId !== null) {
      message.customerId = String(object.customerId);
    }
    if (object.issuerId !== undefined && object.issuerId !== null) {
      message.issuerId = String(object.issuerId);
    }
    return message;
  },

  toJSON(message: ApplicationSpace): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    message.name !== undefined && (obj.name = message.name);
    message.displayName !== undefined &&
      (obj.displayName = message.displayName);
    message.description !== undefined &&
      (obj.description = message.description);
    message.createTime !== undefined &&
      (obj.createTime = message.createTime.toISOString());
    message.updateTime !== undefined &&
      (obj.updateTime = message.updateTime.toISOString());
    message.destroyTime !== undefined &&
      (obj.destroyTime = message.destroyTime.toISOString());
    message.deleteTime !== undefined &&
      (obj.deleteTime = message.deleteTime.toISOString());
    message.etag !== undefined && (obj.etag = message.etag);
    message.customerId !== undefined && (obj.customerId = message.customerId);
    message.issuerId !== undefined && (obj.issuerId = message.issuerId);
    return obj;
  },

  fromPartial(object: DeepPartial<ApplicationSpace>): ApplicationSpace {
    const message = { ...baseApplicationSpace } as ApplicationSpace;
    if (object.id !== undefined && object.id !== null) {
      message.id = object.id;
    }
    if (object.name !== undefined && object.name !== null) {
      message.name = object.name;
    }
    if (object.displayName !== undefined && object.displayName !== null) {
      message.displayName = object.displayName;
    }
    if (object.description !== undefined && object.description !== null) {
      message.description = object.description;
    }
    if (object.createTime !== undefined && object.createTime !== null) {
      message.createTime = object.createTime;
    }
    if (object.updateTime !== undefined && object.updateTime !== null) {
      message.updateTime = object.updateTime;
    }
    if (object.destroyTime !== undefined && object.destroyTime !== null) {
      message.destroyTime = object.destroyTime;
    }
    if (object.deleteTime !== undefined && object.deleteTime !== null) {
      message.deleteTime = object.deleteTime;
    }
    if (object.etag !== undefined && object.etag !== null) {
      message.etag = object.etag;
    }
    if (object.customerId !== undefined && object.customerId !== null) {
      message.customerId = object.customerId;
    }
    if (object.issuerId !== undefined && object.issuerId !== null) {
      message.issuerId = object.issuerId;
    }
    return message;
  },
};

const baseTenant: object = {
  id: "",
  name: "",
  displayName: "",
  etag: "",
  customerId: "",
  appSpaceId: "",
  issuerId: "",
};

export const Tenant = {
  encode(message: Tenant, writer: Writer = Writer.create()): Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.name !== "") {
      writer.uint32(18).string(message.name);
    }
    if (message.displayName !== "") {
      writer.uint32(26).string(message.displayName);
    }
    if (message.description !== undefined) {
      StringValue.encode(
        { value: message.description! },
        writer.uint32(34).fork()
      ).ldelim();
    }
    if (message.createTime !== undefined) {
      Timestamp.encode(
        toTimestamp(message.createTime),
        writer.uint32(42).fork()
      ).ldelim();
    }
    if (message.updateTime !== undefined) {
      Timestamp.encode(
        toTimestamp(message.updateTime),
        writer.uint32(50).fork()
      ).ldelim();
    }
    if (message.destroyTime !== undefined) {
      Timestamp.encode(
        toTimestamp(message.destroyTime),
        writer.uint32(58).fork()
      ).ldelim();
    }
    if (message.deleteTime !== undefined) {
      Timestamp.encode(
        toTimestamp(message.deleteTime),
        writer.uint32(66).fork()
      ).ldelim();
    }
    if (message.etag !== "") {
      writer.uint32(74).string(message.etag);
    }
    if (message.customerId !== "") {
      writer.uint32(82).string(message.customerId);
    }
    if (message.appSpaceId !== "") {
      writer.uint32(90).string(message.appSpaceId);
    }
    if (message.issuerId !== "") {
      writer.uint32(98).string(message.issuerId);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): Tenant {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseTenant } as Tenant;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string();
          break;
        case 2:
          message.name = reader.string();
          break;
        case 3:
          message.displayName = reader.string();
          break;
        case 4:
          message.description = StringValue.decode(
            reader,
            reader.uint32()
          ).value;
          break;
        case 5:
          message.createTime = fromTimestamp(
            Timestamp.decode(reader, reader.uint32())
          );
          break;
        case 6:
          message.updateTime = fromTimestamp(
            Timestamp.decode(reader, reader.uint32())
          );
          break;
        case 7:
          message.destroyTime = fromTimestamp(
            Timestamp.decode(reader, reader.uint32())
          );
          break;
        case 8:
          message.deleteTime = fromTimestamp(
            Timestamp.decode(reader, reader.uint32())
          );
          break;
        case 9:
          message.etag = reader.string();
          break;
        case 10:
          message.customerId = reader.string();
          break;
        case 11:
          message.appSpaceId = reader.string();
          break;
        case 12:
          message.issuerId = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Tenant {
    const message = { ...baseTenant } as Tenant;
    if (object.id !== undefined && object.id !== null) {
      message.id = String(object.id);
    }
    if (object.name !== undefined && object.name !== null) {
      message.name = String(object.name);
    }
    if (object.displayName !== undefined && object.displayName !== null) {
      message.displayName = String(object.displayName);
    }
    if (object.description !== undefined && object.description !== null) {
      message.description = String(object.description);
    }
    if (object.createTime !== undefined && object.createTime !== null) {
      message.createTime = fromJsonTimestamp(object.createTime);
    }
    if (object.updateTime !== undefined && object.updateTime !== null) {
      message.updateTime = fromJsonTimestamp(object.updateTime);
    }
    if (object.destroyTime !== undefined && object.destroyTime !== null) {
      message.destroyTime = fromJsonTimestamp(object.destroyTime);
    }
    if (object.deleteTime !== undefined && object.deleteTime !== null) {
      message.deleteTime = fromJsonTimestamp(object.deleteTime);
    }
    if (object.etag !== undefined && object.etag !== null) {
      message.etag = String(object.etag);
    }
    if (object.customerId !== undefined && object.customerId !== null) {
      message.customerId = String(object.customerId);
    }
    if (object.appSpaceId !== undefined && object.appSpaceId !== null) {
      message.appSpaceId = String(object.appSpaceId);
    }
    if (object.issuerId !== undefined && object.issuerId !== null) {
      message.issuerId = String(object.issuerId);
    }
    return message;
  },

  toJSON(message: Tenant): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    message.name !== undefined && (obj.name = message.name);
    message.displayName !== undefined &&
      (obj.displayName = message.displayName);
    message.description !== undefined &&
      (obj.description = message.description);
    message.createTime !== undefined &&
      (obj.createTime = message.createTime.toISOString());
    message.updateTime !== undefined &&
      (obj.updateTime = message.updateTime.toISOString());
    message.destroyTime !== undefined &&
      (obj.destroyTime = message.destroyTime.toISOString());
    message.deleteTime !== undefined &&
      (obj.deleteTime = message.deleteTime.toISOString());
    message.etag !== undefined && (obj.etag = message.etag);
    message.customerId !== undefined && (obj.customerId = message.customerId);
    message.appSpaceId !== undefined && (obj.appSpaceId = message.appSpaceId);
    message.issuerId !== undefined && (obj.issuerId = message.issuerId);
    return obj;
  },

  fromPartial(object: DeepPartial<Tenant>): Tenant {
    const message = { ...baseTenant } as Tenant;
    if (object.id !== undefined && object.id !== null) {
      message.id = object.id;
    }
    if (object.name !== undefined && object.name !== null) {
      message.name = object.name;
    }
    if (object.displayName !== undefined && object.displayName !== null) {
      message.displayName = object.displayName;
    }
    if (object.description !== undefined && object.description !== null) {
      message.description = object.description;
    }
    if (object.createTime !== undefined && object.createTime !== null) {
      message.createTime = object.createTime;
    }
    if (object.updateTime !== undefined && object.updateTime !== null) {
      message.updateTime = object.updateTime;
    }
    if (object.destroyTime !== undefined && object.destroyTime !== null) {
      message.destroyTime = object.destroyTime;
    }
    if (object.deleteTime !== undefined && object.deleteTime !== null) {
      message.deleteTime = object.deleteTime;
    }
    if (object.etag !== undefined && object.etag !== null) {
      message.etag = object.etag;
    }
    if (object.customerId !== undefined && object.customerId !== null) {
      message.customerId = object.customerId;
    }
    if (object.appSpaceId !== undefined && object.appSpaceId !== null) {
      message.appSpaceId = object.appSpaceId;
    }
    if (object.issuerId !== undefined && object.issuerId !== null) {
      message.issuerId = object.issuerId;
    }
    return message;
  },
};

const baseApplication: object = {
  id: "",
  name: "",
  displayName: "",
  etag: "",
  customerId: "",
  appSpaceId: "",
};

export const Application = {
  encode(message: Application, writer: Writer = Writer.create()): Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.name !== "") {
      writer.uint32(18).string(message.name);
    }
    if (message.displayName !== "") {
      writer.uint32(26).string(message.displayName);
    }
    if (message.description !== undefined) {
      StringValue.encode(
        { value: message.description! },
        writer.uint32(34).fork()
      ).ldelim();
    }
    if (message.createTime !== undefined) {
      Timestamp.encode(
        toTimestamp(message.createTime),
        writer.uint32(42).fork()
      ).ldelim();
    }
    if (message.updateTime !== undefined) {
      Timestamp.encode(
        toTimestamp(message.updateTime),
        writer.uint32(50).fork()
      ).ldelim();
    }
    if (message.destroyTime !== undefined) {
      Timestamp.encode(
        toTimestamp(message.destroyTime),
        writer.uint32(58).fork()
      ).ldelim();
    }
    if (message.deleteTime !== undefined) {
      Timestamp.encode(
        toTimestamp(message.deleteTime),
        writer.uint32(66).fork()
      ).ldelim();
    }
    if (message.etag !== "") {
      writer.uint32(74).string(message.etag);
    }
    if (message.customerId !== "") {
      writer.uint32(82).string(message.customerId);
    }
    if (message.appSpaceId !== "") {
      writer.uint32(90).string(message.appSpaceId);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): Application {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseApplication } as Application;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string();
          break;
        case 2:
          message.name = reader.string();
          break;
        case 3:
          message.displayName = reader.string();
          break;
        case 4:
          message.description = StringValue.decode(
            reader,
            reader.uint32()
          ).value;
          break;
        case 5:
          message.createTime = fromTimestamp(
            Timestamp.decode(reader, reader.uint32())
          );
          break;
        case 6:
          message.updateTime = fromTimestamp(
            Timestamp.decode(reader, reader.uint32())
          );
          break;
        case 7:
          message.destroyTime = fromTimestamp(
            Timestamp.decode(reader, reader.uint32())
          );
          break;
        case 8:
          message.deleteTime = fromTimestamp(
            Timestamp.decode(reader, reader.uint32())
          );
          break;
        case 9:
          message.etag = reader.string();
          break;
        case 10:
          message.customerId = reader.string();
          break;
        case 11:
          message.appSpaceId = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Application {
    const message = { ...baseApplication } as Application;
    if (object.id !== undefined && object.id !== null) {
      message.id = String(object.id);
    }
    if (object.name !== undefined && object.name !== null) {
      message.name = String(object.name);
    }
    if (object.displayName !== undefined && object.displayName !== null) {
      message.displayName = String(object.displayName);
    }
    if (object.description !== undefined && object.description !== null) {
      message.description = String(object.description);
    }
    if (object.createTime !== undefined && object.createTime !== null) {
      message.createTime = fromJsonTimestamp(object.createTime);
    }
    if (object.updateTime !== undefined && object.updateTime !== null) {
      message.updateTime = fromJsonTimestamp(object.updateTime);
    }
    if (object.destroyTime !== undefined && object.destroyTime !== null) {
      message.destroyTime = fromJsonTimestamp(object.destroyTime);
    }
    if (object.deleteTime !== undefined && object.deleteTime !== null) {
      message.deleteTime = fromJsonTimestamp(object.deleteTime);
    }
    if (object.etag !== undefined && object.etag !== null) {
      message.etag = String(object.etag);
    }
    if (object.customerId !== undefined && object.customerId !== null) {
      message.customerId = String(object.customerId);
    }
    if (object.appSpaceId !== undefined && object.appSpaceId !== null) {
      message.appSpaceId = String(object.appSpaceId);
    }
    return message;
  },

  toJSON(message: Application): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    message.name !== undefined && (obj.name = message.name);
    message.displayName !== undefined &&
      (obj.displayName = message.displayName);
    message.description !== undefined &&
      (obj.description = message.description);
    message.createTime !== undefined &&
      (obj.createTime = message.createTime.toISOString());
    message.updateTime !== undefined &&
      (obj.updateTime = message.updateTime.toISOString());
    message.destroyTime !== undefined &&
      (obj.destroyTime = message.destroyTime.toISOString());
    message.deleteTime !== undefined &&
      (obj.deleteTime = message.deleteTime.toISOString());
    message.etag !== undefined && (obj.etag = message.etag);
    message.customerId !== undefined && (obj.customerId = message.customerId);
    message.appSpaceId !== undefined && (obj.appSpaceId = message.appSpaceId);
    return obj;
  },

  fromPartial(object: DeepPartial<Application>): Application {
    const message = { ...baseApplication } as Application;
    if (object.id !== undefined && object.id !== null) {
      message.id = object.id;
    }
    if (object.name !== undefined && object.name !== null) {
      message.name = object.name;
    }
    if (object.displayName !== undefined && object.displayName !== null) {
      message.displayName = object.displayName;
    }
    if (object.description !== undefined && object.description !== null) {
      message.description = object.description;
    }
    if (object.createTime !== undefined && object.createTime !== null) {
      message.createTime = object.createTime;
    }
    if (object.updateTime !== undefined && object.updateTime !== null) {
      message.updateTime = object.updateTime;
    }
    if (object.destroyTime !== undefined && object.destroyTime !== null) {
      message.destroyTime = object.destroyTime;
    }
    if (object.deleteTime !== undefined && object.deleteTime !== null) {
      message.deleteTime = object.deleteTime;
    }
    if (object.etag !== undefined && object.etag !== null) {
      message.etag = object.etag;
    }
    if (object.customerId !== undefined && object.customerId !== null) {
      message.customerId = object.customerId;
    }
    if (object.appSpaceId !== undefined && object.appSpaceId !== null) {
      message.appSpaceId = object.appSpaceId;
    }
    return message;
  },
};

const baseApplicationAgent: object = {
  id: "",
  name: "",
  displayName: "",
  etag: "",
  customerId: "",
  appSpaceId: "",
  applicationId: "",
};

export const ApplicationAgent = {
  encode(message: ApplicationAgent, writer: Writer = Writer.create()): Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.name !== "") {
      writer.uint32(18).string(message.name);
    }
    if (message.displayName !== "") {
      writer.uint32(26).string(message.displayName);
    }
    if (message.description !== undefined) {
      StringValue.encode(
        { value: message.description! },
        writer.uint32(34).fork()
      ).ldelim();
    }
    if (message.createTime !== undefined) {
      Timestamp.encode(
        toTimestamp(message.createTime),
        writer.uint32(42).fork()
      ).ldelim();
    }
    if (message.updateTime !== undefined) {
      Timestamp.encode(
        toTimestamp(message.updateTime),
        writer.uint32(50).fork()
      ).ldelim();
    }
    if (message.destroyTime !== undefined) {
      Timestamp.encode(
        toTimestamp(message.destroyTime),
        writer.uint32(58).fork()
      ).ldelim();
    }
    if (message.deleteTime !== undefined) {
      Timestamp.encode(
        toTimestamp(message.deleteTime),
        writer.uint32(66).fork()
      ).ldelim();
    }
    if (message.etag !== "") {
      writer.uint32(74).string(message.etag);
    }
    if (message.customerId !== "") {
      writer.uint32(82).string(message.customerId);
    }
    if (message.appSpaceId !== "") {
      writer.uint32(90).string(message.appSpaceId);
    }
    if (message.applicationId !== "") {
      writer.uint32(98).string(message.applicationId);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): ApplicationAgent {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseApplicationAgent } as ApplicationAgent;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string();
          break;
        case 2:
          message.name = reader.string();
          break;
        case 3:
          message.displayName = reader.string();
          break;
        case 4:
          message.description = StringValue.decode(
            reader,
            reader.uint32()
          ).value;
          break;
        case 5:
          message.createTime = fromTimestamp(
            Timestamp.decode(reader, reader.uint32())
          );
          break;
        case 6:
          message.updateTime = fromTimestamp(
            Timestamp.decode(reader, reader.uint32())
          );
          break;
        case 7:
          message.destroyTime = fromTimestamp(
            Timestamp.decode(reader, reader.uint32())
          );
          break;
        case 8:
          message.deleteTime = fromTimestamp(
            Timestamp.decode(reader, reader.uint32())
          );
          break;
        case 9:
          message.etag = reader.string();
          break;
        case 10:
          message.customerId = reader.string();
          break;
        case 11:
          message.appSpaceId = reader.string();
          break;
        case 12:
          message.applicationId = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ApplicationAgent {
    const message = { ...baseApplicationAgent } as ApplicationAgent;
    if (object.id !== undefined && object.id !== null) {
      message.id = String(object.id);
    }
    if (object.name !== undefined && object.name !== null) {
      message.name = String(object.name);
    }
    if (object.displayName !== undefined && object.displayName !== null) {
      message.displayName = String(object.displayName);
    }
    if (object.description !== undefined && object.description !== null) {
      message.description = String(object.description);
    }
    if (object.createTime !== undefined && object.createTime !== null) {
      message.createTime = fromJsonTimestamp(object.createTime);
    }
    if (object.updateTime !== undefined && object.updateTime !== null) {
      message.updateTime = fromJsonTimestamp(object.updateTime);
    }
    if (object.destroyTime !== undefined && object.destroyTime !== null) {
      message.destroyTime = fromJsonTimestamp(object.destroyTime);
    }
    if (object.deleteTime !== undefined && object.deleteTime !== null) {
      message.deleteTime = fromJsonTimestamp(object.deleteTime);
    }
    if (object.etag !== undefined && object.etag !== null) {
      message.etag = String(object.etag);
    }
    if (object.customerId !== undefined && object.customerId !== null) {
      message.customerId = String(object.customerId);
    }
    if (object.appSpaceId !== undefined && object.appSpaceId !== null) {
      message.appSpaceId = String(object.appSpaceId);
    }
    if (object.applicationId !== undefined && object.applicationId !== null) {
      message.applicationId = String(object.applicationId);
    }
    return message;
  },

  toJSON(message: ApplicationAgent): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    message.name !== undefined && (obj.name = message.name);
    message.displayName !== undefined &&
      (obj.displayName = message.displayName);
    message.description !== undefined &&
      (obj.description = message.description);
    message.createTime !== undefined &&
      (obj.createTime = message.createTime.toISOString());
    message.updateTime !== undefined &&
      (obj.updateTime = message.updateTime.toISOString());
    message.destroyTime !== undefined &&
      (obj.destroyTime = message.destroyTime.toISOString());
    message.deleteTime !== undefined &&
      (obj.deleteTime = message.deleteTime.toISOString());
    message.etag !== undefined && (obj.etag = message.etag);
    message.customerId !== undefined && (obj.customerId = message.customerId);
    message.appSpaceId !== undefined && (obj.appSpaceId = message.appSpaceId);
    message.applicationId !== undefined &&
      (obj.applicationId = message.applicationId);
    return obj;
  },

  fromPartial(object: DeepPartial<ApplicationAgent>): ApplicationAgent {
    const message = { ...baseApplicationAgent } as ApplicationAgent;
    if (object.id !== undefined && object.id !== null) {
      message.id = object.id;
    }
    if (object.name !== undefined && object.name !== null) {
      message.name = object.name;
    }
    if (object.displayName !== undefined && object.displayName !== null) {
      message.displayName = object.displayName;
    }
    if (object.description !== undefined && object.description !== null) {
      message.description = object.description;
    }
    if (object.createTime !== undefined && object.createTime !== null) {
      message.createTime = object.createTime;
    }
    if (object.updateTime !== undefined && object.updateTime !== null) {
      message.updateTime = object.updateTime;
    }
    if (object.destroyTime !== undefined && object.destroyTime !== null) {
      message.destroyTime = object.destroyTime;
    }
    if (object.deleteTime !== undefined && object.deleteTime !== null) {
      message.deleteTime = object.deleteTime;
    }
    if (object.etag !== undefined && object.etag !== null) {
      message.etag = object.etag;
    }
    if (object.customerId !== undefined && object.customerId !== null) {
      message.customerId = object.customerId;
    }
    if (object.appSpaceId !== undefined && object.appSpaceId !== null) {
      message.appSpaceId = object.appSpaceId;
    }
    if (object.applicationId !== undefined && object.applicationId !== null) {
      message.applicationId = object.applicationId;
    }
    return message;
  },
};

const baseApplicationAgentCredential: object = {
  id: "",
  kid: "",
  displayName: "",
  customerId: "",
  appSpaceId: "",
  applicationId: "",
  applicationAgentId: "",
};

export const ApplicationAgentCredential = {
  encode(
    message: ApplicationAgentCredential,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.kid !== "") {
      writer.uint32(18).string(message.kid);
    }
    if (message.displayName !== "") {
      writer.uint32(26).string(message.displayName);
    }
    if (message.createTime !== undefined) {
      Timestamp.encode(
        toTimestamp(message.createTime),
        writer.uint32(42).fork()
      ).ldelim();
    }
    if (message.destroyTime !== undefined) {
      Timestamp.encode(
        toTimestamp(message.destroyTime),
        writer.uint32(58).fork()
      ).ldelim();
    }
    if (message.deleteTime !== undefined) {
      Timestamp.encode(
        toTimestamp(message.deleteTime),
        writer.uint32(66).fork()
      ).ldelim();
    }
    if (message.customerId !== "") {
      writer.uint32(82).string(message.customerId);
    }
    if (message.appSpaceId !== "") {
      writer.uint32(90).string(message.appSpaceId);
    }
    if (message.applicationId !== "") {
      writer.uint32(98).string(message.applicationId);
    }
    if (message.applicationAgentId !== "") {
      writer.uint32(74).string(message.applicationAgentId);
    }
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): ApplicationAgentCredential {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseApplicationAgentCredential,
    } as ApplicationAgentCredential;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string();
          break;
        case 2:
          message.kid = reader.string();
          break;
        case 3:
          message.displayName = reader.string();
          break;
        case 5:
          message.createTime = fromTimestamp(
            Timestamp.decode(reader, reader.uint32())
          );
          break;
        case 7:
          message.destroyTime = fromTimestamp(
            Timestamp.decode(reader, reader.uint32())
          );
          break;
        case 8:
          message.deleteTime = fromTimestamp(
            Timestamp.decode(reader, reader.uint32())
          );
          break;
        case 10:
          message.customerId = reader.string();
          break;
        case 11:
          message.appSpaceId = reader.string();
          break;
        case 12:
          message.applicationId = reader.string();
          break;
        case 9:
          message.applicationAgentId = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ApplicationAgentCredential {
    const message = {
      ...baseApplicationAgentCredential,
    } as ApplicationAgentCredential;
    if (object.id !== undefined && object.id !== null) {
      message.id = String(object.id);
    }
    if (object.kid !== undefined && object.kid !== null) {
      message.kid = String(object.kid);
    }
    if (object.displayName !== undefined && object.displayName !== null) {
      message.displayName = String(object.displayName);
    }
    if (object.createTime !== undefined && object.createTime !== null) {
      message.createTime = fromJsonTimestamp(object.createTime);
    }
    if (object.destroyTime !== undefined && object.destroyTime !== null) {
      message.destroyTime = fromJsonTimestamp(object.destroyTime);
    }
    if (object.deleteTime !== undefined && object.deleteTime !== null) {
      message.deleteTime = fromJsonTimestamp(object.deleteTime);
    }
    if (object.customerId !== undefined && object.customerId !== null) {
      message.customerId = String(object.customerId);
    }
    if (object.appSpaceId !== undefined && object.appSpaceId !== null) {
      message.appSpaceId = String(object.appSpaceId);
    }
    if (object.applicationId !== undefined && object.applicationId !== null) {
      message.applicationId = String(object.applicationId);
    }
    if (
      object.applicationAgentId !== undefined &&
      object.applicationAgentId !== null
    ) {
      message.applicationAgentId = String(object.applicationAgentId);
    }
    return message;
  },

  toJSON(message: ApplicationAgentCredential): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    message.kid !== undefined && (obj.kid = message.kid);
    message.displayName !== undefined &&
      (obj.displayName = message.displayName);
    message.createTime !== undefined &&
      (obj.createTime = message.createTime.toISOString());
    message.destroyTime !== undefined &&
      (obj.destroyTime = message.destroyTime.toISOString());
    message.deleteTime !== undefined &&
      (obj.deleteTime = message.deleteTime.toISOString());
    message.customerId !== undefined && (obj.customerId = message.customerId);
    message.appSpaceId !== undefined && (obj.appSpaceId = message.appSpaceId);
    message.applicationId !== undefined &&
      (obj.applicationId = message.applicationId);
    message.applicationAgentId !== undefined &&
      (obj.applicationAgentId = message.applicationAgentId);
    return obj;
  },

  fromPartial(
    object: DeepPartial<ApplicationAgentCredential>
  ): ApplicationAgentCredential {
    const message = {
      ...baseApplicationAgentCredential,
    } as ApplicationAgentCredential;
    if (object.id !== undefined && object.id !== null) {
      message.id = object.id;
    }
    if (object.kid !== undefined && object.kid !== null) {
      message.kid = object.kid;
    }
    if (object.displayName !== undefined && object.displayName !== null) {
      message.displayName = object.displayName;
    }
    if (object.createTime !== undefined && object.createTime !== null) {
      message.createTime = object.createTime;
    }
    if (object.destroyTime !== undefined && object.destroyTime !== null) {
      message.destroyTime = object.destroyTime;
    }
    if (object.deleteTime !== undefined && object.deleteTime !== null) {
      message.deleteTime = object.deleteTime;
    }
    if (object.customerId !== undefined && object.customerId !== null) {
      message.customerId = object.customerId;
    }
    if (object.appSpaceId !== undefined && object.appSpaceId !== null) {
      message.appSpaceId = object.appSpaceId;
    }
    if (object.applicationId !== undefined && object.applicationId !== null) {
      message.applicationId = object.applicationId;
    }
    if (
      object.applicationAgentId !== undefined &&
      object.applicationAgentId !== null
    ) {
      message.applicationAgentId = object.applicationAgentId;
    }
    return message;
  },
};

const baseConfigNode: object = {
  id: "",
  name: "",
  displayName: "",
  etag: "",
  customerId: "",
  appSpaceId: "",
  tenantId: "",
};

export const ConfigNode = {
  encode(message: ConfigNode, writer: Writer = Writer.create()): Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.name !== "") {
      writer.uint32(18).string(message.name);
    }
    if (message.displayName !== "") {
      writer.uint32(26).string(message.displayName);
    }
    if (message.description !== undefined) {
      StringValue.encode(
        { value: message.description! },
        writer.uint32(34).fork()
      ).ldelim();
    }
    if (message.createTime !== undefined) {
      Timestamp.encode(
        toTimestamp(message.createTime),
        writer.uint32(42).fork()
      ).ldelim();
    }
    if (message.updateTime !== undefined) {
      Timestamp.encode(
        toTimestamp(message.updateTime),
        writer.uint32(50).fork()
      ).ldelim();
    }
    if (message.destroyTime !== undefined) {
      Timestamp.encode(
        toTimestamp(message.destroyTime),
        writer.uint32(58).fork()
      ).ldelim();
    }
    if (message.deleteTime !== undefined) {
      Timestamp.encode(
        toTimestamp(message.deleteTime),
        writer.uint32(66).fork()
      ).ldelim();
    }
    if (message.etag !== "") {
      writer.uint32(74).string(message.etag);
    }
    if (message.customerId !== "") {
      writer.uint32(82).string(message.customerId);
    }
    if (message.appSpaceId !== "") {
      writer.uint32(90).string(message.appSpaceId);
    }
    if (message.tenantId !== "") {
      writer.uint32(98).string(message.tenantId);
    }
    if (message.config?.$case === "authFlowConfig") {
      AuthFlowConfig.encode(
        message.config.authFlowConfig,
        writer.uint32(114).fork()
      ).ldelim();
    }
    if (message.config?.$case === "emailServiceConfig") {
      EmailServiceConfig.encode(
        message.config.emailServiceConfig,
        writer.uint32(122).fork()
      ).ldelim();
    }
    if (message.config?.$case === "oauth2ClientConfig") {
      OAuth2ClientConfig.encode(
        message.config.oauth2ClientConfig,
        writer.uint32(130).fork()
      ).ldelim();
    }
    if (message.config?.$case === "passwordProviderConfig") {
      PasswordProviderConfig.encode(
        message.config.passwordProviderConfig,
        writer.uint32(146).fork()
      ).ldelim();
    }
    if (message.config?.$case === "webauthnProviderConfig") {
      WebAuthnProviderConfig.encode(
        message.config.webauthnProviderConfig,
        writer.uint32(154).fork()
      ).ldelim();
    }
    if (message.config?.$case === "authenteqProviderConfig") {
      AuthenteqProviderConfig.encode(
        message.config.authenteqProviderConfig,
        writer.uint32(162).fork()
      ).ldelim();
    }
    if (message.config?.$case === "safrProviderConfig") {
      SAFRProviderConfig.encode(
        message.config.safrProviderConfig,
        writer.uint32(170).fork()
      ).ldelim();
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): ConfigNode {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseConfigNode } as ConfigNode;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string();
          break;
        case 2:
          message.name = reader.string();
          break;
        case 3:
          message.displayName = reader.string();
          break;
        case 4:
          message.description = StringValue.decode(
            reader,
            reader.uint32()
          ).value;
          break;
        case 5:
          message.createTime = fromTimestamp(
            Timestamp.decode(reader, reader.uint32())
          );
          break;
        case 6:
          message.updateTime = fromTimestamp(
            Timestamp.decode(reader, reader.uint32())
          );
          break;
        case 7:
          message.destroyTime = fromTimestamp(
            Timestamp.decode(reader, reader.uint32())
          );
          break;
        case 8:
          message.deleteTime = fromTimestamp(
            Timestamp.decode(reader, reader.uint32())
          );
          break;
        case 9:
          message.etag = reader.string();
          break;
        case 10:
          message.customerId = reader.string();
          break;
        case 11:
          message.appSpaceId = reader.string();
          break;
        case 12:
          message.tenantId = reader.string();
          break;
        case 14:
          message.config = {
            $case: "authFlowConfig",
            authFlowConfig: AuthFlowConfig.decode(reader, reader.uint32()),
          };
          break;
        case 15:
          message.config = {
            $case: "emailServiceConfig",
            emailServiceConfig: EmailServiceConfig.decode(
              reader,
              reader.uint32()
            ),
          };
          break;
        case 16:
          message.config = {
            $case: "oauth2ClientConfig",
            oauth2ClientConfig: OAuth2ClientConfig.decode(
              reader,
              reader.uint32()
            ),
          };
          break;
        case 18:
          message.config = {
            $case: "passwordProviderConfig",
            passwordProviderConfig: PasswordProviderConfig.decode(
              reader,
              reader.uint32()
            ),
          };
          break;
        case 19:
          message.config = {
            $case: "webauthnProviderConfig",
            webauthnProviderConfig: WebAuthnProviderConfig.decode(
              reader,
              reader.uint32()
            ),
          };
          break;
        case 20:
          message.config = {
            $case: "authenteqProviderConfig",
            authenteqProviderConfig: AuthenteqProviderConfig.decode(
              reader,
              reader.uint32()
            ),
          };
          break;
        case 21:
          message.config = {
            $case: "safrProviderConfig",
            safrProviderConfig: SAFRProviderConfig.decode(
              reader,
              reader.uint32()
            ),
          };
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ConfigNode {
    const message = { ...baseConfigNode } as ConfigNode;
    if (object.id !== undefined && object.id !== null) {
      message.id = String(object.id);
    }
    if (object.name !== undefined && object.name !== null) {
      message.name = String(object.name);
    }
    if (object.displayName !== undefined && object.displayName !== null) {
      message.displayName = String(object.displayName);
    }
    if (object.description !== undefined && object.description !== null) {
      message.description = String(object.description);
    }
    if (object.createTime !== undefined && object.createTime !== null) {
      message.createTime = fromJsonTimestamp(object.createTime);
    }
    if (object.updateTime !== undefined && object.updateTime !== null) {
      message.updateTime = fromJsonTimestamp(object.updateTime);
    }
    if (object.destroyTime !== undefined && object.destroyTime !== null) {
      message.destroyTime = fromJsonTimestamp(object.destroyTime);
    }
    if (object.deleteTime !== undefined && object.deleteTime !== null) {
      message.deleteTime = fromJsonTimestamp(object.deleteTime);
    }
    if (object.etag !== undefined && object.etag !== null) {
      message.etag = String(object.etag);
    }
    if (object.customerId !== undefined && object.customerId !== null) {
      message.customerId = String(object.customerId);
    }
    if (object.appSpaceId !== undefined && object.appSpaceId !== null) {
      message.appSpaceId = String(object.appSpaceId);
    }
    if (object.tenantId !== undefined && object.tenantId !== null) {
      message.tenantId = String(object.tenantId);
    }
    if (object.authFlowConfig !== undefined && object.authFlowConfig !== null) {
      message.config = {
        $case: "authFlowConfig",
        authFlowConfig: AuthFlowConfig.fromJSON(object.authFlowConfig),
      };
    }
    if (
      object.emailServiceConfig !== undefined &&
      object.emailServiceConfig !== null
    ) {
      message.config = {
        $case: "emailServiceConfig",
        emailServiceConfig: EmailServiceConfig.fromJSON(
          object.emailServiceConfig
        ),
      };
    }
    if (
      object.oauth2ClientConfig !== undefined &&
      object.oauth2ClientConfig !== null
    ) {
      message.config = {
        $case: "oauth2ClientConfig",
        oauth2ClientConfig: OAuth2ClientConfig.fromJSON(
          object.oauth2ClientConfig
        ),
      };
    }
    if (
      object.passwordProviderConfig !== undefined &&
      object.passwordProviderConfig !== null
    ) {
      message.config = {
        $case: "passwordProviderConfig",
        passwordProviderConfig: PasswordProviderConfig.fromJSON(
          object.passwordProviderConfig
        ),
      };
    }
    if (
      object.webauthnProviderConfig !== undefined &&
      object.webauthnProviderConfig !== null
    ) {
      message.config = {
        $case: "webauthnProviderConfig",
        webauthnProviderConfig: WebAuthnProviderConfig.fromJSON(
          object.webauthnProviderConfig
        ),
      };
    }
    if (
      object.authenteqProviderConfig !== undefined &&
      object.authenteqProviderConfig !== null
    ) {
      message.config = {
        $case: "authenteqProviderConfig",
        authenteqProviderConfig: AuthenteqProviderConfig.fromJSON(
          object.authenteqProviderConfig
        ),
      };
    }
    if (
      object.safrProviderConfig !== undefined &&
      object.safrProviderConfig !== null
    ) {
      message.config = {
        $case: "safrProviderConfig",
        safrProviderConfig: SAFRProviderConfig.fromJSON(
          object.safrProviderConfig
        ),
      };
    }
    return message;
  },

  toJSON(message: ConfigNode): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    message.name !== undefined && (obj.name = message.name);
    message.displayName !== undefined &&
      (obj.displayName = message.displayName);
    message.description !== undefined &&
      (obj.description = message.description);
    message.createTime !== undefined &&
      (obj.createTime = message.createTime.toISOString());
    message.updateTime !== undefined &&
      (obj.updateTime = message.updateTime.toISOString());
    message.destroyTime !== undefined &&
      (obj.destroyTime = message.destroyTime.toISOString());
    message.deleteTime !== undefined &&
      (obj.deleteTime = message.deleteTime.toISOString());
    message.etag !== undefined && (obj.etag = message.etag);
    message.customerId !== undefined && (obj.customerId = message.customerId);
    message.appSpaceId !== undefined && (obj.appSpaceId = message.appSpaceId);
    message.tenantId !== undefined && (obj.tenantId = message.tenantId);
    message.config?.$case === "authFlowConfig" &&
      (obj.authFlowConfig = message.config?.authFlowConfig
        ? AuthFlowConfig.toJSON(message.config?.authFlowConfig)
        : undefined);
    message.config?.$case === "emailServiceConfig" &&
      (obj.emailServiceConfig = message.config?.emailServiceConfig
        ? EmailServiceConfig.toJSON(message.config?.emailServiceConfig)
        : undefined);
    message.config?.$case === "oauth2ClientConfig" &&
      (obj.oauth2ClientConfig = message.config?.oauth2ClientConfig
        ? OAuth2ClientConfig.toJSON(message.config?.oauth2ClientConfig)
        : undefined);
    message.config?.$case === "passwordProviderConfig" &&
      (obj.passwordProviderConfig = message.config?.passwordProviderConfig
        ? PasswordProviderConfig.toJSON(message.config?.passwordProviderConfig)
        : undefined);
    message.config?.$case === "webauthnProviderConfig" &&
      (obj.webauthnProviderConfig = message.config?.webauthnProviderConfig
        ? WebAuthnProviderConfig.toJSON(message.config?.webauthnProviderConfig)
        : undefined);
    message.config?.$case === "authenteqProviderConfig" &&
      (obj.authenteqProviderConfig = message.config?.authenteqProviderConfig
        ? AuthenteqProviderConfig.toJSON(
            message.config?.authenteqProviderConfig
          )
        : undefined);
    message.config?.$case === "safrProviderConfig" &&
      (obj.safrProviderConfig = message.config?.safrProviderConfig
        ? SAFRProviderConfig.toJSON(message.config?.safrProviderConfig)
        : undefined);
    return obj;
  },

  fromPartial(object: DeepPartial<ConfigNode>): ConfigNode {
    const message = { ...baseConfigNode } as ConfigNode;
    if (object.id !== undefined && object.id !== null) {
      message.id = object.id;
    }
    if (object.name !== undefined && object.name !== null) {
      message.name = object.name;
    }
    if (object.displayName !== undefined && object.displayName !== null) {
      message.displayName = object.displayName;
    }
    if (object.description !== undefined && object.description !== null) {
      message.description = object.description;
    }
    if (object.createTime !== undefined && object.createTime !== null) {
      message.createTime = object.createTime;
    }
    if (object.updateTime !== undefined && object.updateTime !== null) {
      message.updateTime = object.updateTime;
    }
    if (object.destroyTime !== undefined && object.destroyTime !== null) {
      message.destroyTime = object.destroyTime;
    }
    if (object.deleteTime !== undefined && object.deleteTime !== null) {
      message.deleteTime = object.deleteTime;
    }
    if (object.etag !== undefined && object.etag !== null) {
      message.etag = object.etag;
    }
    if (object.customerId !== undefined && object.customerId !== null) {
      message.customerId = object.customerId;
    }
    if (object.appSpaceId !== undefined && object.appSpaceId !== null) {
      message.appSpaceId = object.appSpaceId;
    }
    if (object.tenantId !== undefined && object.tenantId !== null) {
      message.tenantId = object.tenantId;
    }
    if (
      object.config?.$case === "authFlowConfig" &&
      object.config?.authFlowConfig !== undefined &&
      object.config?.authFlowConfig !== null
    ) {
      message.config = {
        $case: "authFlowConfig",
        authFlowConfig: AuthFlowConfig.fromPartial(
          object.config.authFlowConfig
        ),
      };
    }
    if (
      object.config?.$case === "emailServiceConfig" &&
      object.config?.emailServiceConfig !== undefined &&
      object.config?.emailServiceConfig !== null
    ) {
      message.config = {
        $case: "emailServiceConfig",
        emailServiceConfig: EmailServiceConfig.fromPartial(
          object.config.emailServiceConfig
        ),
      };
    }
    if (
      object.config?.$case === "oauth2ClientConfig" &&
      object.config?.oauth2ClientConfig !== undefined &&
      object.config?.oauth2ClientConfig !== null
    ) {
      message.config = {
        $case: "oauth2ClientConfig",
        oauth2ClientConfig: OAuth2ClientConfig.fromPartial(
          object.config.oauth2ClientConfig
        ),
      };
    }
    if (
      object.config?.$case === "passwordProviderConfig" &&
      object.config?.passwordProviderConfig !== undefined &&
      object.config?.passwordProviderConfig !== null
    ) {
      message.config = {
        $case: "passwordProviderConfig",
        passwordProviderConfig: PasswordProviderConfig.fromPartial(
          object.config.passwordProviderConfig
        ),
      };
    }
    if (
      object.config?.$case === "webauthnProviderConfig" &&
      object.config?.webauthnProviderConfig !== undefined &&
      object.config?.webauthnProviderConfig !== null
    ) {
      message.config = {
        $case: "webauthnProviderConfig",
        webauthnProviderConfig: WebAuthnProviderConfig.fromPartial(
          object.config.webauthnProviderConfig
        ),
      };
    }
    if (
      object.config?.$case === "authenteqProviderConfig" &&
      object.config?.authenteqProviderConfig !== undefined &&
      object.config?.authenteqProviderConfig !== null
    ) {
      message.config = {
        $case: "authenteqProviderConfig",
        authenteqProviderConfig: AuthenteqProviderConfig.fromPartial(
          object.config.authenteqProviderConfig
        ),
      };
    }
    if (
      object.config?.$case === "safrProviderConfig" &&
      object.config?.safrProviderConfig !== undefined &&
      object.config?.safrProviderConfig !== null
    ) {
      message.config = {
        $case: "safrProviderConfig",
        safrProviderConfig: SAFRProviderConfig.fromPartial(
          object.config.safrProviderConfig
        ),
      };
    }
    return message;
  },
};

const baseOAuth2ClientConfig: object = {
  providerType: 0,
  clientId: "",
  clientSecret: "",
  redirectUri: "",
  defaultScopes: "",
  allowedScopes: "",
  allowSignup: false,
  issuer: "",
  authorizationEndpoint: "",
  tokenEndpoint: "",
  discoveryUrl: "",
  userinfoEndpoint: "",
  jwksUri: "",
  imageUrl: "",
  tenant: "",
  hostedDomains: "",
};

export const OAuth2ClientConfig = {
  encode(
    message: OAuth2ClientConfig,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.providerType !== 0) {
      writer.uint32(8).int32(message.providerType);
    }
    if (message.clientId !== "") {
      writer.uint32(18).string(message.clientId);
    }
    if (message.clientSecret !== "") {
      writer.uint32(26).string(message.clientSecret);
    }
    for (const v of message.redirectUri) {
      writer.uint32(34).string(v!);
    }
    for (const v of message.defaultScopes) {
      writer.uint32(138).string(v!);
    }
    for (const v of message.allowedScopes) {
      writer.uint32(154).string(v!);
    }
    if (message.allowSignup === true) {
      writer.uint32(64).bool(message.allowSignup);
    }
    if (message.issuer !== "") {
      writer.uint32(74).string(message.issuer);
    }
    if (message.authorizationEndpoint !== "") {
      writer.uint32(82).string(message.authorizationEndpoint);
    }
    if (message.tokenEndpoint !== "") {
      writer.uint32(90).string(message.tokenEndpoint);
    }
    if (message.discoveryUrl !== "") {
      writer.uint32(130).string(message.discoveryUrl);
    }
    if (message.userinfoEndpoint !== "") {
      writer.uint32(98).string(message.userinfoEndpoint);
    }
    if (message.jwksUri !== "") {
      writer.uint32(106).string(message.jwksUri);
    }
    if (message.imageUrl !== "") {
      writer.uint32(114).string(message.imageUrl);
    }
    if (message.tenant !== "") {
      writer.uint32(122).string(message.tenant);
    }
    if (message.hostedDomains !== "") {
      writer.uint32(146).string(message.hostedDomains);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): OAuth2ClientConfig {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseOAuth2ClientConfig } as OAuth2ClientConfig;
    message.redirectUri = [];
    message.defaultScopes = [];
    message.allowedScopes = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.providerType = reader.int32() as any;
          break;
        case 2:
          message.clientId = reader.string();
          break;
        case 3:
          message.clientSecret = reader.string();
          break;
        case 4:
          message.redirectUri.push(reader.string());
          break;
        case 17:
          message.defaultScopes.push(reader.string());
          break;
        case 19:
          message.allowedScopes.push(reader.string());
          break;
        case 8:
          message.allowSignup = reader.bool();
          break;
        case 9:
          message.issuer = reader.string();
          break;
        case 10:
          message.authorizationEndpoint = reader.string();
          break;
        case 11:
          message.tokenEndpoint = reader.string();
          break;
        case 16:
          message.discoveryUrl = reader.string();
          break;
        case 12:
          message.userinfoEndpoint = reader.string();
          break;
        case 13:
          message.jwksUri = reader.string();
          break;
        case 14:
          message.imageUrl = reader.string();
          break;
        case 15:
          message.tenant = reader.string();
          break;
        case 18:
          message.hostedDomains = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): OAuth2ClientConfig {
    const message = { ...baseOAuth2ClientConfig } as OAuth2ClientConfig;
    message.redirectUri = [];
    message.defaultScopes = [];
    message.allowedScopes = [];
    if (object.providerType !== undefined && object.providerType !== null) {
      message.providerType = providerTypeFromJSON(object.providerType);
    }
    if (object.clientId !== undefined && object.clientId !== null) {
      message.clientId = String(object.clientId);
    }
    if (object.clientSecret !== undefined && object.clientSecret !== null) {
      message.clientSecret = String(object.clientSecret);
    }
    if (object.redirectUri !== undefined && object.redirectUri !== null) {
      for (const e of object.redirectUri) {
        message.redirectUri.push(String(e));
      }
    }
    if (object.defaultScopes !== undefined && object.defaultScopes !== null) {
      for (const e of object.defaultScopes) {
        message.defaultScopes.push(String(e));
      }
    }
    if (object.allowedScopes !== undefined && object.allowedScopes !== null) {
      for (const e of object.allowedScopes) {
        message.allowedScopes.push(String(e));
      }
    }
    if (object.allowSignup !== undefined && object.allowSignup !== null) {
      message.allowSignup = Boolean(object.allowSignup);
    }
    if (object.issuer !== undefined && object.issuer !== null) {
      message.issuer = String(object.issuer);
    }
    if (
      object.authorizationEndpoint !== undefined &&
      object.authorizationEndpoint !== null
    ) {
      message.authorizationEndpoint = String(object.authorizationEndpoint);
    }
    if (object.tokenEndpoint !== undefined && object.tokenEndpoint !== null) {
      message.tokenEndpoint = String(object.tokenEndpoint);
    }
    if (object.discoveryUrl !== undefined && object.discoveryUrl !== null) {
      message.discoveryUrl = String(object.discoveryUrl);
    }
    if (
      object.userinfoEndpoint !== undefined &&
      object.userinfoEndpoint !== null
    ) {
      message.userinfoEndpoint = String(object.userinfoEndpoint);
    }
    if (object.jwksUri !== undefined && object.jwksUri !== null) {
      message.jwksUri = String(object.jwksUri);
    }
    if (object.imageUrl !== undefined && object.imageUrl !== null) {
      message.imageUrl = String(object.imageUrl);
    }
    if (object.tenant !== undefined && object.tenant !== null) {
      message.tenant = String(object.tenant);
    }
    if (object.hostedDomains !== undefined && object.hostedDomains !== null) {
      message.hostedDomains = String(object.hostedDomains);
    }
    return message;
  },

  toJSON(message: OAuth2ClientConfig): unknown {
    const obj: any = {};
    message.providerType !== undefined &&
      (obj.providerType = providerTypeToJSON(message.providerType));
    message.clientId !== undefined && (obj.clientId = message.clientId);
    message.clientSecret !== undefined &&
      (obj.clientSecret = message.clientSecret);
    if (message.redirectUri) {
      obj.redirectUri = message.redirectUri.map((e) => e);
    } else {
      obj.redirectUri = [];
    }
    if (message.defaultScopes) {
      obj.defaultScopes = message.defaultScopes.map((e) => e);
    } else {
      obj.defaultScopes = [];
    }
    if (message.allowedScopes) {
      obj.allowedScopes = message.allowedScopes.map((e) => e);
    } else {
      obj.allowedScopes = [];
    }
    message.allowSignup !== undefined &&
      (obj.allowSignup = message.allowSignup);
    message.issuer !== undefined && (obj.issuer = message.issuer);
    message.authorizationEndpoint !== undefined &&
      (obj.authorizationEndpoint = message.authorizationEndpoint);
    message.tokenEndpoint !== undefined &&
      (obj.tokenEndpoint = message.tokenEndpoint);
    message.discoveryUrl !== undefined &&
      (obj.discoveryUrl = message.discoveryUrl);
    message.userinfoEndpoint !== undefined &&
      (obj.userinfoEndpoint = message.userinfoEndpoint);
    message.jwksUri !== undefined && (obj.jwksUri = message.jwksUri);
    message.imageUrl !== undefined && (obj.imageUrl = message.imageUrl);
    message.tenant !== undefined && (obj.tenant = message.tenant);
    message.hostedDomains !== undefined &&
      (obj.hostedDomains = message.hostedDomains);
    return obj;
  },

  fromPartial(object: DeepPartial<OAuth2ClientConfig>): OAuth2ClientConfig {
    const message = { ...baseOAuth2ClientConfig } as OAuth2ClientConfig;
    message.redirectUri = [];
    message.defaultScopes = [];
    message.allowedScopes = [];
    if (object.providerType !== undefined && object.providerType !== null) {
      message.providerType = object.providerType;
    }
    if (object.clientId !== undefined && object.clientId !== null) {
      message.clientId = object.clientId;
    }
    if (object.clientSecret !== undefined && object.clientSecret !== null) {
      message.clientSecret = object.clientSecret;
    }
    if (object.redirectUri !== undefined && object.redirectUri !== null) {
      for (const e of object.redirectUri) {
        message.redirectUri.push(e);
      }
    }
    if (object.defaultScopes !== undefined && object.defaultScopes !== null) {
      for (const e of object.defaultScopes) {
        message.defaultScopes.push(e);
      }
    }
    if (object.allowedScopes !== undefined && object.allowedScopes !== null) {
      for (const e of object.allowedScopes) {
        message.allowedScopes.push(e);
      }
    }
    if (object.allowSignup !== undefined && object.allowSignup !== null) {
      message.allowSignup = object.allowSignup;
    }
    if (object.issuer !== undefined && object.issuer !== null) {
      message.issuer = object.issuer;
    }
    if (
      object.authorizationEndpoint !== undefined &&
      object.authorizationEndpoint !== null
    ) {
      message.authorizationEndpoint = object.authorizationEndpoint;
    }
    if (object.tokenEndpoint !== undefined && object.tokenEndpoint !== null) {
      message.tokenEndpoint = object.tokenEndpoint;
    }
    if (object.discoveryUrl !== undefined && object.discoveryUrl !== null) {
      message.discoveryUrl = object.discoveryUrl;
    }
    if (
      object.userinfoEndpoint !== undefined &&
      object.userinfoEndpoint !== null
    ) {
      message.userinfoEndpoint = object.userinfoEndpoint;
    }
    if (object.jwksUri !== undefined && object.jwksUri !== null) {
      message.jwksUri = object.jwksUri;
    }
    if (object.imageUrl !== undefined && object.imageUrl !== null) {
      message.imageUrl = object.imageUrl;
    }
    if (object.tenant !== undefined && object.tenant !== null) {
      message.tenant = object.tenant;
    }
    if (object.hostedDomains !== undefined && object.hostedDomains !== null) {
      message.hostedDomains = object.hostedDomains;
    }
    return message;
  },
};

const baseOAuth2Application: object = {
  id: "",
  name: "",
  displayName: "",
  etag: "",
  customerId: "",
  appSpaceId: "",
  oauth2ProviderId: "",
};

export const OAuth2Application = {
  encode(message: OAuth2Application, writer: Writer = Writer.create()): Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.name !== "") {
      writer.uint32(18).string(message.name);
    }
    if (message.displayName !== "") {
      writer.uint32(26).string(message.displayName);
    }
    if (message.description !== undefined) {
      StringValue.encode(
        { value: message.description! },
        writer.uint32(34).fork()
      ).ldelim();
    }
    if (message.createTime !== undefined) {
      Timestamp.encode(
        toTimestamp(message.createTime),
        writer.uint32(42).fork()
      ).ldelim();
    }
    if (message.updateTime !== undefined) {
      Timestamp.encode(
        toTimestamp(message.updateTime),
        writer.uint32(50).fork()
      ).ldelim();
    }
    if (message.destroyTime !== undefined) {
      Timestamp.encode(
        toTimestamp(message.destroyTime),
        writer.uint32(58).fork()
      ).ldelim();
    }
    if (message.deleteTime !== undefined) {
      Timestamp.encode(
        toTimestamp(message.deleteTime),
        writer.uint32(66).fork()
      ).ldelim();
    }
    if (message.etag !== "") {
      writer.uint32(74).string(message.etag);
    }
    if (message.customerId !== "") {
      writer.uint32(82).string(message.customerId);
    }
    if (message.appSpaceId !== "") {
      writer.uint32(90).string(message.appSpaceId);
    }
    if (message.oauth2ProviderId !== "") {
      writer.uint32(98).string(message.oauth2ProviderId);
    }
    if (message.config !== undefined) {
      OAuth2ApplicationConfig.encode(
        message.config,
        writer.uint32(106).fork()
      ).ldelim();
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): OAuth2Application {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseOAuth2Application } as OAuth2Application;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string();
          break;
        case 2:
          message.name = reader.string();
          break;
        case 3:
          message.displayName = reader.string();
          break;
        case 4:
          message.description = StringValue.decode(
            reader,
            reader.uint32()
          ).value;
          break;
        case 5:
          message.createTime = fromTimestamp(
            Timestamp.decode(reader, reader.uint32())
          );
          break;
        case 6:
          message.updateTime = fromTimestamp(
            Timestamp.decode(reader, reader.uint32())
          );
          break;
        case 7:
          message.destroyTime = fromTimestamp(
            Timestamp.decode(reader, reader.uint32())
          );
          break;
        case 8:
          message.deleteTime = fromTimestamp(
            Timestamp.decode(reader, reader.uint32())
          );
          break;
        case 9:
          message.etag = reader.string();
          break;
        case 10:
          message.customerId = reader.string();
          break;
        case 11:
          message.appSpaceId = reader.string();
          break;
        case 12:
          message.oauth2ProviderId = reader.string();
          break;
        case 13:
          message.config = OAuth2ApplicationConfig.decode(
            reader,
            reader.uint32()
          );
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): OAuth2Application {
    const message = { ...baseOAuth2Application } as OAuth2Application;
    if (object.id !== undefined && object.id !== null) {
      message.id = String(object.id);
    }
    if (object.name !== undefined && object.name !== null) {
      message.name = String(object.name);
    }
    if (object.displayName !== undefined && object.displayName !== null) {
      message.displayName = String(object.displayName);
    }
    if (object.description !== undefined && object.description !== null) {
      message.description = String(object.description);
    }
    if (object.createTime !== undefined && object.createTime !== null) {
      message.createTime = fromJsonTimestamp(object.createTime);
    }
    if (object.updateTime !== undefined && object.updateTime !== null) {
      message.updateTime = fromJsonTimestamp(object.updateTime);
    }
    if (object.destroyTime !== undefined && object.destroyTime !== null) {
      message.destroyTime = fromJsonTimestamp(object.destroyTime);
    }
    if (object.deleteTime !== undefined && object.deleteTime !== null) {
      message.deleteTime = fromJsonTimestamp(object.deleteTime);
    }
    if (object.etag !== undefined && object.etag !== null) {
      message.etag = String(object.etag);
    }
    if (object.customerId !== undefined && object.customerId !== null) {
      message.customerId = String(object.customerId);
    }
    if (object.appSpaceId !== undefined && object.appSpaceId !== null) {
      message.appSpaceId = String(object.appSpaceId);
    }
    if (
      object.oauth2ProviderId !== undefined &&
      object.oauth2ProviderId !== null
    ) {
      message.oauth2ProviderId = String(object.oauth2ProviderId);
    }
    if (object.config !== undefined && object.config !== null) {
      message.config = OAuth2ApplicationConfig.fromJSON(object.config);
    }
    return message;
  },

  toJSON(message: OAuth2Application): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    message.name !== undefined && (obj.name = message.name);
    message.displayName !== undefined &&
      (obj.displayName = message.displayName);
    message.description !== undefined &&
      (obj.description = message.description);
    message.createTime !== undefined &&
      (obj.createTime = message.createTime.toISOString());
    message.updateTime !== undefined &&
      (obj.updateTime = message.updateTime.toISOString());
    message.destroyTime !== undefined &&
      (obj.destroyTime = message.destroyTime.toISOString());
    message.deleteTime !== undefined &&
      (obj.deleteTime = message.deleteTime.toISOString());
    message.etag !== undefined && (obj.etag = message.etag);
    message.customerId !== undefined && (obj.customerId = message.customerId);
    message.appSpaceId !== undefined && (obj.appSpaceId = message.appSpaceId);
    message.oauth2ProviderId !== undefined &&
      (obj.oauth2ProviderId = message.oauth2ProviderId);
    message.config !== undefined &&
      (obj.config = message.config
        ? OAuth2ApplicationConfig.toJSON(message.config)
        : undefined);
    return obj;
  },

  fromPartial(object: DeepPartial<OAuth2Application>): OAuth2Application {
    const message = { ...baseOAuth2Application } as OAuth2Application;
    if (object.id !== undefined && object.id !== null) {
      message.id = object.id;
    }
    if (object.name !== undefined && object.name !== null) {
      message.name = object.name;
    }
    if (object.displayName !== undefined && object.displayName !== null) {
      message.displayName = object.displayName;
    }
    if (object.description !== undefined && object.description !== null) {
      message.description = object.description;
    }
    if (object.createTime !== undefined && object.createTime !== null) {
      message.createTime = object.createTime;
    }
    if (object.updateTime !== undefined && object.updateTime !== null) {
      message.updateTime = object.updateTime;
    }
    if (object.destroyTime !== undefined && object.destroyTime !== null) {
      message.destroyTime = object.destroyTime;
    }
    if (object.deleteTime !== undefined && object.deleteTime !== null) {
      message.deleteTime = object.deleteTime;
    }
    if (object.etag !== undefined && object.etag !== null) {
      message.etag = object.etag;
    }
    if (object.customerId !== undefined && object.customerId !== null) {
      message.customerId = object.customerId;
    }
    if (object.appSpaceId !== undefined && object.appSpaceId !== null) {
      message.appSpaceId = object.appSpaceId;
    }
    if (
      object.oauth2ProviderId !== undefined &&
      object.oauth2ProviderId !== null
    ) {
      message.oauth2ProviderId = object.oauth2ProviderId;
    }
    if (object.config !== undefined && object.config !== null) {
      message.config = OAuth2ApplicationConfig.fromPartial(object.config);
    }
    return message;
  },
};

const baseOAuth2ApplicationConfig: object = {
  clientId: "",
  displayName: "",
  description: "",
  redirectUris: "",
  owner: "",
  policyUri: "",
  allowedCorsOrigins: "",
  termsOfServiceUri: "",
  clientUri: "",
  logoUri: "",
  userSupportEmailAddress: "",
  additionalContacts: "",
  subjectType: 0,
  sectorIdentifierUri: "",
  grantTypes: 0,
  responseTypes: 0,
  scopes: "",
  audiences: "",
  tokenEndpointAuthMethod: 0,
  tokenEndpointAuthSigningAlg: "",
  userinfoSignedResponseAlg: "",
};

export const OAuth2ApplicationConfig = {
  encode(
    message: OAuth2ApplicationConfig,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.clientId !== "") {
      writer.uint32(10).string(message.clientId);
    }
    if (message.displayName !== "") {
      writer.uint32(26).string(message.displayName);
    }
    if (message.description !== "") {
      writer.uint32(34).string(message.description);
    }
    for (const v of message.redirectUris) {
      writer.uint32(42).string(v!);
    }
    if (message.owner !== "") {
      writer.uint32(50).string(message.owner);
    }
    if (message.policyUri !== "") {
      writer.uint32(58).string(message.policyUri);
    }
    for (const v of message.allowedCorsOrigins) {
      writer.uint32(66).string(v!);
    }
    if (message.termsOfServiceUri !== "") {
      writer.uint32(74).string(message.termsOfServiceUri);
    }
    if (message.clientUri !== "") {
      writer.uint32(82).string(message.clientUri);
    }
    if (message.logoUri !== "") {
      writer.uint32(90).string(message.logoUri);
    }
    if (message.userSupportEmailAddress !== "") {
      writer.uint32(98).string(message.userSupportEmailAddress);
    }
    for (const v of message.additionalContacts) {
      writer.uint32(106).string(v!);
    }
    if (message.subjectType !== 0) {
      writer.uint32(112).int32(message.subjectType);
    }
    if (message.sectorIdentifierUri !== "") {
      writer.uint32(122).string(message.sectorIdentifierUri);
    }
    writer.uint32(130).fork();
    for (const v of message.grantTypes) {
      writer.int32(v);
    }
    writer.ldelim();
    writer.uint32(138).fork();
    for (const v of message.responseTypes) {
      writer.int32(v);
    }
    writer.ldelim();
    for (const v of message.scopes) {
      writer.uint32(146).string(v!);
    }
    for (const v of message.audiences) {
      writer.uint32(154).string(v!);
    }
    if (message.tokenEndpointAuthMethod !== 0) {
      writer.uint32(160).int32(message.tokenEndpointAuthMethod);
    }
    if (message.tokenEndpointAuthSigningAlg !== "") {
      writer.uint32(170).string(message.tokenEndpointAuthSigningAlg);
    }
    if (message.userinfoSignedResponseAlg !== "") {
      writer.uint32(178).string(message.userinfoSignedResponseAlg);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): OAuth2ApplicationConfig {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseOAuth2ApplicationConfig,
    } as OAuth2ApplicationConfig;
    message.redirectUris = [];
    message.allowedCorsOrigins = [];
    message.additionalContacts = [];
    message.grantTypes = [];
    message.responseTypes = [];
    message.scopes = [];
    message.audiences = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.clientId = reader.string();
          break;
        case 3:
          message.displayName = reader.string();
          break;
        case 4:
          message.description = reader.string();
          break;
        case 5:
          message.redirectUris.push(reader.string());
          break;
        case 6:
          message.owner = reader.string();
          break;
        case 7:
          message.policyUri = reader.string();
          break;
        case 8:
          message.allowedCorsOrigins.push(reader.string());
          break;
        case 9:
          message.termsOfServiceUri = reader.string();
          break;
        case 10:
          message.clientUri = reader.string();
          break;
        case 11:
          message.logoUri = reader.string();
          break;
        case 12:
          message.userSupportEmailAddress = reader.string();
          break;
        case 13:
          message.additionalContacts.push(reader.string());
          break;
        case 14:
          message.subjectType = reader.int32() as any;
          break;
        case 15:
          message.sectorIdentifierUri = reader.string();
          break;
        case 16:
          if ((tag & 7) === 2) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.grantTypes.push(reader.int32() as any);
            }
          } else {
            message.grantTypes.push(reader.int32() as any);
          }
          break;
        case 17:
          if ((tag & 7) === 2) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.responseTypes.push(reader.int32() as any);
            }
          } else {
            message.responseTypes.push(reader.int32() as any);
          }
          break;
        case 18:
          message.scopes.push(reader.string());
          break;
        case 19:
          message.audiences.push(reader.string());
          break;
        case 20:
          message.tokenEndpointAuthMethod = reader.int32() as any;
          break;
        case 21:
          message.tokenEndpointAuthSigningAlg = reader.string();
          break;
        case 22:
          message.userinfoSignedResponseAlg = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): OAuth2ApplicationConfig {
    const message = {
      ...baseOAuth2ApplicationConfig,
    } as OAuth2ApplicationConfig;
    message.redirectUris = [];
    message.allowedCorsOrigins = [];
    message.additionalContacts = [];
    message.grantTypes = [];
    message.responseTypes = [];
    message.scopes = [];
    message.audiences = [];
    if (object.clientId !== undefined && object.clientId !== null) {
      message.clientId = String(object.clientId);
    }
    if (object.displayName !== undefined && object.displayName !== null) {
      message.displayName = String(object.displayName);
    }
    if (object.description !== undefined && object.description !== null) {
      message.description = String(object.description);
    }
    if (object.redirectUris !== undefined && object.redirectUris !== null) {
      for (const e of object.redirectUris) {
        message.redirectUris.push(String(e));
      }
    }
    if (object.owner !== undefined && object.owner !== null) {
      message.owner = String(object.owner);
    }
    if (object.policyUri !== undefined && object.policyUri !== null) {
      message.policyUri = String(object.policyUri);
    }
    if (
      object.allowedCorsOrigins !== undefined &&
      object.allowedCorsOrigins !== null
    ) {
      for (const e of object.allowedCorsOrigins) {
        message.allowedCorsOrigins.push(String(e));
      }
    }
    if (
      object.termsOfServiceUri !== undefined &&
      object.termsOfServiceUri !== null
    ) {
      message.termsOfServiceUri = String(object.termsOfServiceUri);
    }
    if (object.clientUri !== undefined && object.clientUri !== null) {
      message.clientUri = String(object.clientUri);
    }
    if (object.logoUri !== undefined && object.logoUri !== null) {
      message.logoUri = String(object.logoUri);
    }
    if (
      object.userSupportEmailAddress !== undefined &&
      object.userSupportEmailAddress !== null
    ) {
      message.userSupportEmailAddress = String(object.userSupportEmailAddress);
    }
    if (
      object.additionalContacts !== undefined &&
      object.additionalContacts !== null
    ) {
      for (const e of object.additionalContacts) {
        message.additionalContacts.push(String(e));
      }
    }
    if (object.subjectType !== undefined && object.subjectType !== null) {
      message.subjectType = clientSubjectTypeFromJSON(object.subjectType);
    }
    if (
      object.sectorIdentifierUri !== undefined &&
      object.sectorIdentifierUri !== null
    ) {
      message.sectorIdentifierUri = String(object.sectorIdentifierUri);
    }
    if (object.grantTypes !== undefined && object.grantTypes !== null) {
      for (const e of object.grantTypes) {
        message.grantTypes.push(grantTypeFromJSON(e));
      }
    }
    if (object.responseTypes !== undefined && object.responseTypes !== null) {
      for (const e of object.responseTypes) {
        message.responseTypes.push(responseTypeFromJSON(e));
      }
    }
    if (object.scopes !== undefined && object.scopes !== null) {
      for (const e of object.scopes) {
        message.scopes.push(String(e));
      }
    }
    if (object.audiences !== undefined && object.audiences !== null) {
      for (const e of object.audiences) {
        message.audiences.push(String(e));
      }
    }
    if (
      object.tokenEndpointAuthMethod !== undefined &&
      object.tokenEndpointAuthMethod !== null
    ) {
      message.tokenEndpointAuthMethod = tokenEndpointAuthMethodFromJSON(
        object.tokenEndpointAuthMethod
      );
    }
    if (
      object.tokenEndpointAuthSigningAlg !== undefined &&
      object.tokenEndpointAuthSigningAlg !== null
    ) {
      message.tokenEndpointAuthSigningAlg = String(
        object.tokenEndpointAuthSigningAlg
      );
    }
    if (
      object.userinfoSignedResponseAlg !== undefined &&
      object.userinfoSignedResponseAlg !== null
    ) {
      message.userinfoSignedResponseAlg = String(
        object.userinfoSignedResponseAlg
      );
    }
    return message;
  },

  toJSON(message: OAuth2ApplicationConfig): unknown {
    const obj: any = {};
    message.clientId !== undefined && (obj.clientId = message.clientId);
    message.displayName !== undefined &&
      (obj.displayName = message.displayName);
    message.description !== undefined &&
      (obj.description = message.description);
    if (message.redirectUris) {
      obj.redirectUris = message.redirectUris.map((e) => e);
    } else {
      obj.redirectUris = [];
    }
    message.owner !== undefined && (obj.owner = message.owner);
    message.policyUri !== undefined && (obj.policyUri = message.policyUri);
    if (message.allowedCorsOrigins) {
      obj.allowedCorsOrigins = message.allowedCorsOrigins.map((e) => e);
    } else {
      obj.allowedCorsOrigins = [];
    }
    message.termsOfServiceUri !== undefined &&
      (obj.termsOfServiceUri = message.termsOfServiceUri);
    message.clientUri !== undefined && (obj.clientUri = message.clientUri);
    message.logoUri !== undefined && (obj.logoUri = message.logoUri);
    message.userSupportEmailAddress !== undefined &&
      (obj.userSupportEmailAddress = message.userSupportEmailAddress);
    if (message.additionalContacts) {
      obj.additionalContacts = message.additionalContacts.map((e) => e);
    } else {
      obj.additionalContacts = [];
    }
    message.subjectType !== undefined &&
      (obj.subjectType = clientSubjectTypeToJSON(message.subjectType));
    message.sectorIdentifierUri !== undefined &&
      (obj.sectorIdentifierUri = message.sectorIdentifierUri);
    if (message.grantTypes) {
      obj.grantTypes = message.grantTypes.map((e) => grantTypeToJSON(e));
    } else {
      obj.grantTypes = [];
    }
    if (message.responseTypes) {
      obj.responseTypes = message.responseTypes.map((e) =>
        responseTypeToJSON(e)
      );
    } else {
      obj.responseTypes = [];
    }
    if (message.scopes) {
      obj.scopes = message.scopes.map((e) => e);
    } else {
      obj.scopes = [];
    }
    if (message.audiences) {
      obj.audiences = message.audiences.map((e) => e);
    } else {
      obj.audiences = [];
    }
    message.tokenEndpointAuthMethod !== undefined &&
      (obj.tokenEndpointAuthMethod = tokenEndpointAuthMethodToJSON(
        message.tokenEndpointAuthMethod
      ));
    message.tokenEndpointAuthSigningAlg !== undefined &&
      (obj.tokenEndpointAuthSigningAlg = message.tokenEndpointAuthSigningAlg);
    message.userinfoSignedResponseAlg !== undefined &&
      (obj.userinfoSignedResponseAlg = message.userinfoSignedResponseAlg);
    return obj;
  },

  fromPartial(
    object: DeepPartial<OAuth2ApplicationConfig>
  ): OAuth2ApplicationConfig {
    const message = {
      ...baseOAuth2ApplicationConfig,
    } as OAuth2ApplicationConfig;
    message.redirectUris = [];
    message.allowedCorsOrigins = [];
    message.additionalContacts = [];
    message.grantTypes = [];
    message.responseTypes = [];
    message.scopes = [];
    message.audiences = [];
    if (object.clientId !== undefined && object.clientId !== null) {
      message.clientId = object.clientId;
    }
    if (object.displayName !== undefined && object.displayName !== null) {
      message.displayName = object.displayName;
    }
    if (object.description !== undefined && object.description !== null) {
      message.description = object.description;
    }
    if (object.redirectUris !== undefined && object.redirectUris !== null) {
      for (const e of object.redirectUris) {
        message.redirectUris.push(e);
      }
    }
    if (object.owner !== undefined && object.owner !== null) {
      message.owner = object.owner;
    }
    if (object.policyUri !== undefined && object.policyUri !== null) {
      message.policyUri = object.policyUri;
    }
    if (
      object.allowedCorsOrigins !== undefined &&
      object.allowedCorsOrigins !== null
    ) {
      for (const e of object.allowedCorsOrigins) {
        message.allowedCorsOrigins.push(e);
      }
    }
    if (
      object.termsOfServiceUri !== undefined &&
      object.termsOfServiceUri !== null
    ) {
      message.termsOfServiceUri = object.termsOfServiceUri;
    }
    if (object.clientUri !== undefined && object.clientUri !== null) {
      message.clientUri = object.clientUri;
    }
    if (object.logoUri !== undefined && object.logoUri !== null) {
      message.logoUri = object.logoUri;
    }
    if (
      object.userSupportEmailAddress !== undefined &&
      object.userSupportEmailAddress !== null
    ) {
      message.userSupportEmailAddress = object.userSupportEmailAddress;
    }
    if (
      object.additionalContacts !== undefined &&
      object.additionalContacts !== null
    ) {
      for (const e of object.additionalContacts) {
        message.additionalContacts.push(e);
      }
    }
    if (object.subjectType !== undefined && object.subjectType !== null) {
      message.subjectType = object.subjectType;
    }
    if (
      object.sectorIdentifierUri !== undefined &&
      object.sectorIdentifierUri !== null
    ) {
      message.sectorIdentifierUri = object.sectorIdentifierUri;
    }
    if (object.grantTypes !== undefined && object.grantTypes !== null) {
      for (const e of object.grantTypes) {
        message.grantTypes.push(e);
      }
    }
    if (object.responseTypes !== undefined && object.responseTypes !== null) {
      for (const e of object.responseTypes) {
        message.responseTypes.push(e);
      }
    }
    if (object.scopes !== undefined && object.scopes !== null) {
      for (const e of object.scopes) {
        message.scopes.push(e);
      }
    }
    if (object.audiences !== undefined && object.audiences !== null) {
      for (const e of object.audiences) {
        message.audiences.push(e);
      }
    }
    if (
      object.tokenEndpointAuthMethod !== undefined &&
      object.tokenEndpointAuthMethod !== null
    ) {
      message.tokenEndpointAuthMethod = object.tokenEndpointAuthMethod;
    }
    if (
      object.tokenEndpointAuthSigningAlg !== undefined &&
      object.tokenEndpointAuthSigningAlg !== null
    ) {
      message.tokenEndpointAuthSigningAlg = object.tokenEndpointAuthSigningAlg;
    }
    if (
      object.userinfoSignedResponseAlg !== undefined &&
      object.userinfoSignedResponseAlg !== null
    ) {
      message.userinfoSignedResponseAlg = object.userinfoSignedResponseAlg;
    }
    return message;
  },
};

const baseOAuth2Provider: object = {
  id: "",
  name: "",
  displayName: "",
  etag: "",
  customerId: "",
  appSpaceId: "",
};

export const OAuth2Provider = {
  encode(message: OAuth2Provider, writer: Writer = Writer.create()): Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.name !== "") {
      writer.uint32(18).string(message.name);
    }
    if (message.displayName !== "") {
      writer.uint32(26).string(message.displayName);
    }
    if (message.description !== undefined) {
      StringValue.encode(
        { value: message.description! },
        writer.uint32(34).fork()
      ).ldelim();
    }
    if (message.createTime !== undefined) {
      Timestamp.encode(
        toTimestamp(message.createTime),
        writer.uint32(42).fork()
      ).ldelim();
    }
    if (message.updateTime !== undefined) {
      Timestamp.encode(
        toTimestamp(message.updateTime),
        writer.uint32(50).fork()
      ).ldelim();
    }
    if (message.destroyTime !== undefined) {
      Timestamp.encode(
        toTimestamp(message.destroyTime),
        writer.uint32(58).fork()
      ).ldelim();
    }
    if (message.deleteTime !== undefined) {
      Timestamp.encode(
        toTimestamp(message.deleteTime),
        writer.uint32(66).fork()
      ).ldelim();
    }
    if (message.etag !== "") {
      writer.uint32(74).string(message.etag);
    }
    if (message.customerId !== "") {
      writer.uint32(82).string(message.customerId);
    }
    if (message.appSpaceId !== "") {
      writer.uint32(90).string(message.appSpaceId);
    }
    if (message.config !== undefined) {
      OAuth2ProviderConfig.encode(
        message.config,
        writer.uint32(98).fork()
      ).ldelim();
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): OAuth2Provider {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseOAuth2Provider } as OAuth2Provider;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string();
          break;
        case 2:
          message.name = reader.string();
          break;
        case 3:
          message.displayName = reader.string();
          break;
        case 4:
          message.description = StringValue.decode(
            reader,
            reader.uint32()
          ).value;
          break;
        case 5:
          message.createTime = fromTimestamp(
            Timestamp.decode(reader, reader.uint32())
          );
          break;
        case 6:
          message.updateTime = fromTimestamp(
            Timestamp.decode(reader, reader.uint32())
          );
          break;
        case 7:
          message.destroyTime = fromTimestamp(
            Timestamp.decode(reader, reader.uint32())
          );
          break;
        case 8:
          message.deleteTime = fromTimestamp(
            Timestamp.decode(reader, reader.uint32())
          );
          break;
        case 9:
          message.etag = reader.string();
          break;
        case 10:
          message.customerId = reader.string();
          break;
        case 11:
          message.appSpaceId = reader.string();
          break;
        case 12:
          message.config = OAuth2ProviderConfig.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): OAuth2Provider {
    const message = { ...baseOAuth2Provider } as OAuth2Provider;
    if (object.id !== undefined && object.id !== null) {
      message.id = String(object.id);
    }
    if (object.name !== undefined && object.name !== null) {
      message.name = String(object.name);
    }
    if (object.displayName !== undefined && object.displayName !== null) {
      message.displayName = String(object.displayName);
    }
    if (object.description !== undefined && object.description !== null) {
      message.description = String(object.description);
    }
    if (object.createTime !== undefined && object.createTime !== null) {
      message.createTime = fromJsonTimestamp(object.createTime);
    }
    if (object.updateTime !== undefined && object.updateTime !== null) {
      message.updateTime = fromJsonTimestamp(object.updateTime);
    }
    if (object.destroyTime !== undefined && object.destroyTime !== null) {
      message.destroyTime = fromJsonTimestamp(object.destroyTime);
    }
    if (object.deleteTime !== undefined && object.deleteTime !== null) {
      message.deleteTime = fromJsonTimestamp(object.deleteTime);
    }
    if (object.etag !== undefined && object.etag !== null) {
      message.etag = String(object.etag);
    }
    if (object.customerId !== undefined && object.customerId !== null) {
      message.customerId = String(object.customerId);
    }
    if (object.appSpaceId !== undefined && object.appSpaceId !== null) {
      message.appSpaceId = String(object.appSpaceId);
    }
    if (object.config !== undefined && object.config !== null) {
      message.config = OAuth2ProviderConfig.fromJSON(object.config);
    }
    return message;
  },

  toJSON(message: OAuth2Provider): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    message.name !== undefined && (obj.name = message.name);
    message.displayName !== undefined &&
      (obj.displayName = message.displayName);
    message.description !== undefined &&
      (obj.description = message.description);
    message.createTime !== undefined &&
      (obj.createTime = message.createTime.toISOString());
    message.updateTime !== undefined &&
      (obj.updateTime = message.updateTime.toISOString());
    message.destroyTime !== undefined &&
      (obj.destroyTime = message.destroyTime.toISOString());
    message.deleteTime !== undefined &&
      (obj.deleteTime = message.deleteTime.toISOString());
    message.etag !== undefined && (obj.etag = message.etag);
    message.customerId !== undefined && (obj.customerId = message.customerId);
    message.appSpaceId !== undefined && (obj.appSpaceId = message.appSpaceId);
    message.config !== undefined &&
      (obj.config = message.config
        ? OAuth2ProviderConfig.toJSON(message.config)
        : undefined);
    return obj;
  },

  fromPartial(object: DeepPartial<OAuth2Provider>): OAuth2Provider {
    const message = { ...baseOAuth2Provider } as OAuth2Provider;
    if (object.id !== undefined && object.id !== null) {
      message.id = object.id;
    }
    if (object.name !== undefined && object.name !== null) {
      message.name = object.name;
    }
    if (object.displayName !== undefined && object.displayName !== null) {
      message.displayName = object.displayName;
    }
    if (object.description !== undefined && object.description !== null) {
      message.description = object.description;
    }
    if (object.createTime !== undefined && object.createTime !== null) {
      message.createTime = object.createTime;
    }
    if (object.updateTime !== undefined && object.updateTime !== null) {
      message.updateTime = object.updateTime;
    }
    if (object.destroyTime !== undefined && object.destroyTime !== null) {
      message.destroyTime = object.destroyTime;
    }
    if (object.deleteTime !== undefined && object.deleteTime !== null) {
      message.deleteTime = object.deleteTime;
    }
    if (object.etag !== undefined && object.etag !== null) {
      message.etag = object.etag;
    }
    if (object.customerId !== undefined && object.customerId !== null) {
      message.customerId = object.customerId;
    }
    if (object.appSpaceId !== undefined && object.appSpaceId !== null) {
      message.appSpaceId = object.appSpaceId;
    }
    if (object.config !== undefined && object.config !== null) {
      message.config = OAuth2ProviderConfig.fromPartial(object.config);
    }
    return message;
  },
};

const baseOAuth2ProviderConfig: object = {
  grantTypes: 0,
  responseTypes: 0,
  scopes: "",
  tokenEndpointAuthMethod: 0,
  tokenEndpointAuthSigningAlg: "",
  requestUris: "",
  requestObjectSigningAlg: "",
};

export const OAuth2ProviderConfig = {
  encode(
    message: OAuth2ProviderConfig,
    writer: Writer = Writer.create()
  ): Writer {
    writer.uint32(10).fork();
    for (const v of message.grantTypes) {
      writer.int32(v);
    }
    writer.ldelim();
    writer.uint32(18).fork();
    for (const v of message.responseTypes) {
      writer.int32(v);
    }
    writer.ldelim();
    for (const v of message.scopes) {
      writer.uint32(26).string(v!);
    }
    writer.uint32(34).fork();
    for (const v of message.tokenEndpointAuthMethod) {
      writer.int32(v);
    }
    writer.ldelim();
    for (const v of message.tokenEndpointAuthSigningAlg) {
      writer.uint32(42).string(v!);
    }
    for (const v of message.requestUris) {
      writer.uint32(50).string(v!);
    }
    if (message.requestObjectSigningAlg !== "") {
      writer.uint32(58).string(message.requestObjectSigningAlg);
    }
    Object.entries(message.frontChannelLoginUri).forEach(([key, value]) => {
      OAuth2ProviderConfig_FrontChannelLoginUriEntry.encode(
        { key: key as any, value },
        writer.uint32(66).fork()
      ).ldelim();
    });
    Object.entries(message.frontChannelConsentUri).forEach(([key, value]) => {
      OAuth2ProviderConfig_FrontChannelConsentUriEntry.encode(
        { key: key as any, value },
        writer.uint32(74).fork()
      ).ldelim();
    });
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): OAuth2ProviderConfig {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseOAuth2ProviderConfig } as OAuth2ProviderConfig;
    message.grantTypes = [];
    message.responseTypes = [];
    message.scopes = [];
    message.tokenEndpointAuthMethod = [];
    message.tokenEndpointAuthSigningAlg = [];
    message.requestUris = [];
    message.frontChannelLoginUri = {};
    message.frontChannelConsentUri = {};
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if ((tag & 7) === 2) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.grantTypes.push(reader.int32() as any);
            }
          } else {
            message.grantTypes.push(reader.int32() as any);
          }
          break;
        case 2:
          if ((tag & 7) === 2) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.responseTypes.push(reader.int32() as any);
            }
          } else {
            message.responseTypes.push(reader.int32() as any);
          }
          break;
        case 3:
          message.scopes.push(reader.string());
          break;
        case 4:
          if ((tag & 7) === 2) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.tokenEndpointAuthMethod.push(reader.int32() as any);
            }
          } else {
            message.tokenEndpointAuthMethod.push(reader.int32() as any);
          }
          break;
        case 5:
          message.tokenEndpointAuthSigningAlg.push(reader.string());
          break;
        case 6:
          message.requestUris.push(reader.string());
          break;
        case 7:
          message.requestObjectSigningAlg = reader.string();
          break;
        case 8:
          const entry8 = OAuth2ProviderConfig_FrontChannelLoginUriEntry.decode(
            reader,
            reader.uint32()
          );
          if (entry8.value !== undefined) {
            message.frontChannelLoginUri[entry8.key] = entry8.value;
          }
          break;
        case 9:
          const entry9 =
            OAuth2ProviderConfig_FrontChannelConsentUriEntry.decode(
              reader,
              reader.uint32()
            );
          if (entry9.value !== undefined) {
            message.frontChannelConsentUri[entry9.key] = entry9.value;
          }
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): OAuth2ProviderConfig {
    const message = { ...baseOAuth2ProviderConfig } as OAuth2ProviderConfig;
    message.grantTypes = [];
    message.responseTypes = [];
    message.scopes = [];
    message.tokenEndpointAuthMethod = [];
    message.tokenEndpointAuthSigningAlg = [];
    message.requestUris = [];
    message.frontChannelLoginUri = {};
    message.frontChannelConsentUri = {};
    if (object.grantTypes !== undefined && object.grantTypes !== null) {
      for (const e of object.grantTypes) {
        message.grantTypes.push(grantTypeFromJSON(e));
      }
    }
    if (object.responseTypes !== undefined && object.responseTypes !== null) {
      for (const e of object.responseTypes) {
        message.responseTypes.push(responseTypeFromJSON(e));
      }
    }
    if (object.scopes !== undefined && object.scopes !== null) {
      for (const e of object.scopes) {
        message.scopes.push(String(e));
      }
    }
    if (
      object.tokenEndpointAuthMethod !== undefined &&
      object.tokenEndpointAuthMethod !== null
    ) {
      for (const e of object.tokenEndpointAuthMethod) {
        message.tokenEndpointAuthMethod.push(
          tokenEndpointAuthMethodFromJSON(e)
        );
      }
    }
    if (
      object.tokenEndpointAuthSigningAlg !== undefined &&
      object.tokenEndpointAuthSigningAlg !== null
    ) {
      for (const e of object.tokenEndpointAuthSigningAlg) {
        message.tokenEndpointAuthSigningAlg.push(String(e));
      }
    }
    if (object.requestUris !== undefined && object.requestUris !== null) {
      for (const e of object.requestUris) {
        message.requestUris.push(String(e));
      }
    }
    if (
      object.requestObjectSigningAlg !== undefined &&
      object.requestObjectSigningAlg !== null
    ) {
      message.requestObjectSigningAlg = String(object.requestObjectSigningAlg);
    }
    if (
      object.frontChannelLoginUri !== undefined &&
      object.frontChannelLoginUri !== null
    ) {
      Object.entries(object.frontChannelLoginUri).forEach(([key, value]) => {
        message.frontChannelLoginUri[key] = String(value);
      });
    }
    if (
      object.frontChannelConsentUri !== undefined &&
      object.frontChannelConsentUri !== null
    ) {
      Object.entries(object.frontChannelConsentUri).forEach(([key, value]) => {
        message.frontChannelConsentUri[key] = String(value);
      });
    }
    return message;
  },

  toJSON(message: OAuth2ProviderConfig): unknown {
    const obj: any = {};
    if (message.grantTypes) {
      obj.grantTypes = message.grantTypes.map((e) => grantTypeToJSON(e));
    } else {
      obj.grantTypes = [];
    }
    if (message.responseTypes) {
      obj.responseTypes = message.responseTypes.map((e) =>
        responseTypeToJSON(e)
      );
    } else {
      obj.responseTypes = [];
    }
    if (message.scopes) {
      obj.scopes = message.scopes.map((e) => e);
    } else {
      obj.scopes = [];
    }
    if (message.tokenEndpointAuthMethod) {
      obj.tokenEndpointAuthMethod = message.tokenEndpointAuthMethod.map((e) =>
        tokenEndpointAuthMethodToJSON(e)
      );
    } else {
      obj.tokenEndpointAuthMethod = [];
    }
    if (message.tokenEndpointAuthSigningAlg) {
      obj.tokenEndpointAuthSigningAlg = message.tokenEndpointAuthSigningAlg.map(
        (e) => e
      );
    } else {
      obj.tokenEndpointAuthSigningAlg = [];
    }
    if (message.requestUris) {
      obj.requestUris = message.requestUris.map((e) => e);
    } else {
      obj.requestUris = [];
    }
    message.requestObjectSigningAlg !== undefined &&
      (obj.requestObjectSigningAlg = message.requestObjectSigningAlg);
    obj.frontChannelLoginUri = {};
    if (message.frontChannelLoginUri) {
      Object.entries(message.frontChannelLoginUri).forEach(([k, v]) => {
        obj.frontChannelLoginUri[k] = v;
      });
    }
    obj.frontChannelConsentUri = {};
    if (message.frontChannelConsentUri) {
      Object.entries(message.frontChannelConsentUri).forEach(([k, v]) => {
        obj.frontChannelConsentUri[k] = v;
      });
    }
    return obj;
  },

  fromPartial(object: DeepPartial<OAuth2ProviderConfig>): OAuth2ProviderConfig {
    const message = { ...baseOAuth2ProviderConfig } as OAuth2ProviderConfig;
    message.grantTypes = [];
    message.responseTypes = [];
    message.scopes = [];
    message.tokenEndpointAuthMethod = [];
    message.tokenEndpointAuthSigningAlg = [];
    message.requestUris = [];
    message.frontChannelLoginUri = {};
    message.frontChannelConsentUri = {};
    if (object.grantTypes !== undefined && object.grantTypes !== null) {
      for (const e of object.grantTypes) {
        message.grantTypes.push(e);
      }
    }
    if (object.responseTypes !== undefined && object.responseTypes !== null) {
      for (const e of object.responseTypes) {
        message.responseTypes.push(e);
      }
    }
    if (object.scopes !== undefined && object.scopes !== null) {
      for (const e of object.scopes) {
        message.scopes.push(e);
      }
    }
    if (
      object.tokenEndpointAuthMethod !== undefined &&
      object.tokenEndpointAuthMethod !== null
    ) {
      for (const e of object.tokenEndpointAuthMethod) {
        message.tokenEndpointAuthMethod.push(e);
      }
    }
    if (
      object.tokenEndpointAuthSigningAlg !== undefined &&
      object.tokenEndpointAuthSigningAlg !== null
    ) {
      for (const e of object.tokenEndpointAuthSigningAlg) {
        message.tokenEndpointAuthSigningAlg.push(e);
      }
    }
    if (object.requestUris !== undefined && object.requestUris !== null) {
      for (const e of object.requestUris) {
        message.requestUris.push(e);
      }
    }
    if (
      object.requestObjectSigningAlg !== undefined &&
      object.requestObjectSigningAlg !== null
    ) {
      message.requestObjectSigningAlg = object.requestObjectSigningAlg;
    }
    if (
      object.frontChannelLoginUri !== undefined &&
      object.frontChannelLoginUri !== null
    ) {
      Object.entries(object.frontChannelLoginUri).forEach(([key, value]) => {
        if (value !== undefined) {
          message.frontChannelLoginUri[key] = String(value);
        }
      });
    }
    if (
      object.frontChannelConsentUri !== undefined &&
      object.frontChannelConsentUri !== null
    ) {
      Object.entries(object.frontChannelConsentUri).forEach(([key, value]) => {
        if (value !== undefined) {
          message.frontChannelConsentUri[key] = String(value);
        }
      });
    }
    return message;
  },
};

const baseOAuth2ProviderConfig_FrontChannelLoginUriEntry: object = {
  key: "",
  value: "",
};

export const OAuth2ProviderConfig_FrontChannelLoginUriEntry = {
  encode(
    message: OAuth2ProviderConfig_FrontChannelLoginUriEntry,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.key !== "") {
      writer.uint32(10).string(message.key);
    }
    if (message.value !== "") {
      writer.uint32(18).string(message.value);
    }
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): OAuth2ProviderConfig_FrontChannelLoginUriEntry {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseOAuth2ProviderConfig_FrontChannelLoginUriEntry,
    } as OAuth2ProviderConfig_FrontChannelLoginUriEntry;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.key = reader.string();
          break;
        case 2:
          message.value = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): OAuth2ProviderConfig_FrontChannelLoginUriEntry {
    const message = {
      ...baseOAuth2ProviderConfig_FrontChannelLoginUriEntry,
    } as OAuth2ProviderConfig_FrontChannelLoginUriEntry;
    if (object.key !== undefined && object.key !== null) {
      message.key = String(object.key);
    }
    if (object.value !== undefined && object.value !== null) {
      message.value = String(object.value);
    }
    return message;
  },

  toJSON(message: OAuth2ProviderConfig_FrontChannelLoginUriEntry): unknown {
    const obj: any = {};
    message.key !== undefined && (obj.key = message.key);
    message.value !== undefined && (obj.value = message.value);
    return obj;
  },

  fromPartial(
    object: DeepPartial<OAuth2ProviderConfig_FrontChannelLoginUriEntry>
  ): OAuth2ProviderConfig_FrontChannelLoginUriEntry {
    const message = {
      ...baseOAuth2ProviderConfig_FrontChannelLoginUriEntry,
    } as OAuth2ProviderConfig_FrontChannelLoginUriEntry;
    if (object.key !== undefined && object.key !== null) {
      message.key = object.key;
    }
    if (object.value !== undefined && object.value !== null) {
      message.value = object.value;
    }
    return message;
  },
};

const baseOAuth2ProviderConfig_FrontChannelConsentUriEntry: object = {
  key: "",
  value: "",
};

export const OAuth2ProviderConfig_FrontChannelConsentUriEntry = {
  encode(
    message: OAuth2ProviderConfig_FrontChannelConsentUriEntry,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.key !== "") {
      writer.uint32(10).string(message.key);
    }
    if (message.value !== "") {
      writer.uint32(18).string(message.value);
    }
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): OAuth2ProviderConfig_FrontChannelConsentUriEntry {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseOAuth2ProviderConfig_FrontChannelConsentUriEntry,
    } as OAuth2ProviderConfig_FrontChannelConsentUriEntry;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.key = reader.string();
          break;
        case 2:
          message.value = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): OAuth2ProviderConfig_FrontChannelConsentUriEntry {
    const message = {
      ...baseOAuth2ProviderConfig_FrontChannelConsentUriEntry,
    } as OAuth2ProviderConfig_FrontChannelConsentUriEntry;
    if (object.key !== undefined && object.key !== null) {
      message.key = String(object.key);
    }
    if (object.value !== undefined && object.value !== null) {
      message.value = String(object.value);
    }
    return message;
  },

  toJSON(message: OAuth2ProviderConfig_FrontChannelConsentUriEntry): unknown {
    const obj: any = {};
    message.key !== undefined && (obj.key = message.key);
    message.value !== undefined && (obj.value = message.value);
    return obj;
  },

  fromPartial(
    object: DeepPartial<OAuth2ProviderConfig_FrontChannelConsentUriEntry>
  ): OAuth2ProviderConfig_FrontChannelConsentUriEntry {
    const message = {
      ...baseOAuth2ProviderConfig_FrontChannelConsentUriEntry,
    } as OAuth2ProviderConfig_FrontChannelConsentUriEntry;
    if (object.key !== undefined && object.key !== null) {
      message.key = object.key;
    }
    if (object.value !== undefined && object.value !== null) {
      message.value = object.value;
    }
    return message;
  },
};

const baseWebAuthnProviderConfig: object = {
  id: "",
  displayName: "",
  origin: "",
  icon: "",
  attestationPreference: 0,
  authenticatorAttachment: 0,
  requireResidentKey: false,
  userVerification: 0,
  registrationTimeout: 0,
  authenticationTimeout: 0,
  debug: false,
};

export const WebAuthnProviderConfig = {
  encode(
    message: WebAuthnProviderConfig,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.displayName !== "") {
      writer.uint32(18).string(message.displayName);
    }
    if (message.origin !== "") {
      writer.uint32(26).string(message.origin);
    }
    if (message.icon !== "") {
      writer.uint32(34).string(message.icon);
    }
    if (message.attestationPreference !== 0) {
      writer.uint32(40).int32(message.attestationPreference);
    }
    if (message.authenticatorAttachment !== 0) {
      writer.uint32(48).int32(message.authenticatorAttachment);
    }
    if (message.requireResidentKey === true) {
      writer.uint32(56).bool(message.requireResidentKey);
    }
    if (message.userVerification !== 0) {
      writer.uint32(64).int32(message.userVerification);
    }
    if (message.registrationTimeout !== 0) {
      writer.uint32(72).uint32(message.registrationTimeout);
    }
    if (message.authenticationTimeout !== 0) {
      writer.uint32(88).uint32(message.authenticationTimeout);
    }
    if (message.debug === true) {
      writer.uint32(80).bool(message.debug);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): WebAuthnProviderConfig {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseWebAuthnProviderConfig } as WebAuthnProviderConfig;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string();
          break;
        case 2:
          message.displayName = reader.string();
          break;
        case 3:
          message.origin = reader.string();
          break;
        case 4:
          message.icon = reader.string();
          break;
        case 5:
          message.attestationPreference = reader.int32() as any;
          break;
        case 6:
          message.authenticatorAttachment = reader.int32() as any;
          break;
        case 7:
          message.requireResidentKey = reader.bool();
          break;
        case 8:
          message.userVerification = reader.int32() as any;
          break;
        case 9:
          message.registrationTimeout = reader.uint32();
          break;
        case 11:
          message.authenticationTimeout = reader.uint32();
          break;
        case 10:
          message.debug = reader.bool();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): WebAuthnProviderConfig {
    const message = { ...baseWebAuthnProviderConfig } as WebAuthnProviderConfig;
    if (object.id !== undefined && object.id !== null) {
      message.id = String(object.id);
    }
    if (object.displayName !== undefined && object.displayName !== null) {
      message.displayName = String(object.displayName);
    }
    if (object.origin !== undefined && object.origin !== null) {
      message.origin = String(object.origin);
    }
    if (object.icon !== undefined && object.icon !== null) {
      message.icon = String(object.icon);
    }
    if (
      object.attestationPreference !== undefined &&
      object.attestationPreference !== null
    ) {
      message.attestationPreference = conveyancePreferenceFromJSON(
        object.attestationPreference
      );
    }
    if (
      object.authenticatorAttachment !== undefined &&
      object.authenticatorAttachment !== null
    ) {
      message.authenticatorAttachment = authenticatorAttachmentFromJSON(
        object.authenticatorAttachment
      );
    }
    if (
      object.requireResidentKey !== undefined &&
      object.requireResidentKey !== null
    ) {
      message.requireResidentKey = Boolean(object.requireResidentKey);
    }
    if (
      object.userVerification !== undefined &&
      object.userVerification !== null
    ) {
      message.userVerification = userVerificationRequirementFromJSON(
        object.userVerification
      );
    }
    if (
      object.registrationTimeout !== undefined &&
      object.registrationTimeout !== null
    ) {
      message.registrationTimeout = Number(object.registrationTimeout);
    }
    if (
      object.authenticationTimeout !== undefined &&
      object.authenticationTimeout !== null
    ) {
      message.authenticationTimeout = Number(object.authenticationTimeout);
    }
    if (object.debug !== undefined && object.debug !== null) {
      message.debug = Boolean(object.debug);
    }
    return message;
  },

  toJSON(message: WebAuthnProviderConfig): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    message.displayName !== undefined &&
      (obj.displayName = message.displayName);
    message.origin !== undefined && (obj.origin = message.origin);
    message.icon !== undefined && (obj.icon = message.icon);
    message.attestationPreference !== undefined &&
      (obj.attestationPreference = conveyancePreferenceToJSON(
        message.attestationPreference
      ));
    message.authenticatorAttachment !== undefined &&
      (obj.authenticatorAttachment = authenticatorAttachmentToJSON(
        message.authenticatorAttachment
      ));
    message.requireResidentKey !== undefined &&
      (obj.requireResidentKey = message.requireResidentKey);
    message.userVerification !== undefined &&
      (obj.userVerification = userVerificationRequirementToJSON(
        message.userVerification
      ));
    message.registrationTimeout !== undefined &&
      (obj.registrationTimeout = message.registrationTimeout);
    message.authenticationTimeout !== undefined &&
      (obj.authenticationTimeout = message.authenticationTimeout);
    message.debug !== undefined && (obj.debug = message.debug);
    return obj;
  },

  fromPartial(
    object: DeepPartial<WebAuthnProviderConfig>
  ): WebAuthnProviderConfig {
    const message = { ...baseWebAuthnProviderConfig } as WebAuthnProviderConfig;
    if (object.id !== undefined && object.id !== null) {
      message.id = object.id;
    }
    if (object.displayName !== undefined && object.displayName !== null) {
      message.displayName = object.displayName;
    }
    if (object.origin !== undefined && object.origin !== null) {
      message.origin = object.origin;
    }
    if (object.icon !== undefined && object.icon !== null) {
      message.icon = object.icon;
    }
    if (
      object.attestationPreference !== undefined &&
      object.attestationPreference !== null
    ) {
      message.attestationPreference = object.attestationPreference;
    }
    if (
      object.authenticatorAttachment !== undefined &&
      object.authenticatorAttachment !== null
    ) {
      message.authenticatorAttachment = object.authenticatorAttachment;
    }
    if (
      object.requireResidentKey !== undefined &&
      object.requireResidentKey !== null
    ) {
      message.requireResidentKey = object.requireResidentKey;
    }
    if (
      object.userVerification !== undefined &&
      object.userVerification !== null
    ) {
      message.userVerification = object.userVerification;
    }
    if (
      object.registrationTimeout !== undefined &&
      object.registrationTimeout !== null
    ) {
      message.registrationTimeout = object.registrationTimeout;
    }
    if (
      object.authenticationTimeout !== undefined &&
      object.authenticationTimeout !== null
    ) {
      message.authenticationTimeout = object.authenticationTimeout;
    }
    if (object.debug !== undefined && object.debug !== null) {
      message.debug = object.debug;
    }
    return message;
  },
};

const baseWebAuthnSiteDefinition: object = {
  id: "",
  displayName: "",
  origin: "",
  icon: "",
};

export const WebAuthnSiteDefinition = {
  encode(
    message: WebAuthnSiteDefinition,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.displayName !== "") {
      writer.uint32(18).string(message.displayName);
    }
    if (message.origin !== "") {
      writer.uint32(26).string(message.origin);
    }
    if (message.icon !== "") {
      writer.uint32(34).string(message.icon);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): WebAuthnSiteDefinition {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseWebAuthnSiteDefinition } as WebAuthnSiteDefinition;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string();
          break;
        case 2:
          message.displayName = reader.string();
          break;
        case 3:
          message.origin = reader.string();
          break;
        case 4:
          message.icon = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): WebAuthnSiteDefinition {
    const message = { ...baseWebAuthnSiteDefinition } as WebAuthnSiteDefinition;
    if (object.id !== undefined && object.id !== null) {
      message.id = String(object.id);
    }
    if (object.displayName !== undefined && object.displayName !== null) {
      message.displayName = String(object.displayName);
    }
    if (object.origin !== undefined && object.origin !== null) {
      message.origin = String(object.origin);
    }
    if (object.icon !== undefined && object.icon !== null) {
      message.icon = String(object.icon);
    }
    return message;
  },

  toJSON(message: WebAuthnSiteDefinition): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    message.displayName !== undefined &&
      (obj.displayName = message.displayName);
    message.origin !== undefined && (obj.origin = message.origin);
    message.icon !== undefined && (obj.icon = message.icon);
    return obj;
  },

  fromPartial(
    object: DeepPartial<WebAuthnSiteDefinition>
  ): WebAuthnSiteDefinition {
    const message = { ...baseWebAuthnSiteDefinition } as WebAuthnSiteDefinition;
    if (object.id !== undefined && object.id !== null) {
      message.id = object.id;
    }
    if (object.displayName !== undefined && object.displayName !== null) {
      message.displayName = object.displayName;
    }
    if (object.origin !== undefined && object.origin !== null) {
      message.origin = object.origin;
    }
    if (object.icon !== undefined && object.icon !== null) {
      message.icon = object.icon;
    }
    return message;
  },
};

const baseAuthFlowConfig: object = { sourceFormat: 0 };

export const AuthFlowConfig = {
  encode(message: AuthFlowConfig, writer: Writer = Writer.create()): Writer {
    if (message.sourceFormat !== 0) {
      writer.uint32(8).int32(message.sourceFormat);
    }
    if (message.source.length !== 0) {
      writer.uint32(18).bytes(message.source);
    }
    if (message.default !== undefined) {
      BoolValue.encode(
        { value: message.default! },
        writer.uint32(26).fork()
      ).ldelim();
    }
    if (message.proto !== undefined) {
      Any.encode(message.proto, writer.uint32(34).fork()).ldelim();
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): AuthFlowConfig {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseAuthFlowConfig } as AuthFlowConfig;
    message.source = Buffer.alloc(0);
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.sourceFormat = reader.int32() as any;
          break;
        case 2:
          message.source = reader.bytes() as Buffer;
          break;
        case 3:
          message.default = BoolValue.decode(reader, reader.uint32()).value;
          break;
        case 4:
          message.proto = Any.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): AuthFlowConfig {
    const message = { ...baseAuthFlowConfig } as AuthFlowConfig;
    message.source = Buffer.alloc(0);
    if (object.sourceFormat !== undefined && object.sourceFormat !== null) {
      message.sourceFormat = authFlowConfig_FormatFromJSON(object.sourceFormat);
    }
    if (object.source !== undefined && object.source !== null) {
      message.source = Buffer.from(bytesFromBase64(object.source));
    }
    if (object.default !== undefined && object.default !== null) {
      message.default = Boolean(object.default);
    }
    if (object.proto !== undefined && object.proto !== null) {
      message.proto = Any.fromJSON(object.proto);
    }
    return message;
  },

  toJSON(message: AuthFlowConfig): unknown {
    const obj: any = {};
    message.sourceFormat !== undefined &&
      (obj.sourceFormat = authFlowConfig_FormatToJSON(message.sourceFormat));
    message.source !== undefined &&
      (obj.source = base64FromBytes(
        message.source !== undefined ? message.source : Buffer.alloc(0)
      ));
    message.default !== undefined && (obj.default = message.default);
    message.proto !== undefined &&
      (obj.proto = message.proto ? Any.toJSON(message.proto) : undefined);
    return obj;
  },

  fromPartial(object: DeepPartial<AuthFlowConfig>): AuthFlowConfig {
    const message = { ...baseAuthFlowConfig } as AuthFlowConfig;
    if (object.sourceFormat !== undefined && object.sourceFormat !== null) {
      message.sourceFormat = object.sourceFormat;
    }
    if (object.source !== undefined && object.source !== null) {
      message.source = object.source;
    }
    if (object.default !== undefined && object.default !== null) {
      message.default = object.default;
    }
    if (object.proto !== undefined && object.proto !== null) {
      message.proto = Any.fromPartial(object.proto);
    }
    return message;
  },
};

const baseAuthenteqProviderConfig: object = {
  defaultRedirectUri: "",
  clientId: "",
  clientSecret: "",
  hostAddress: "",
};

export const AuthenteqProviderConfig = {
  encode(
    message: AuthenteqProviderConfig,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.defaultRedirectUri !== "") {
      writer.uint32(10).string(message.defaultRedirectUri);
    }
    if (message.clientId !== "") {
      writer.uint32(18).string(message.clientId);
    }
    if (message.clientSecret !== "") {
      writer.uint32(26).string(message.clientSecret);
    }
    if (message.hostAddress !== "") {
      writer.uint32(34).string(message.hostAddress);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): AuthenteqProviderConfig {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseAuthenteqProviderConfig,
    } as AuthenteqProviderConfig;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.defaultRedirectUri = reader.string();
          break;
        case 2:
          message.clientId = reader.string();
          break;
        case 3:
          message.clientSecret = reader.string();
          break;
        case 4:
          message.hostAddress = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): AuthenteqProviderConfig {
    const message = {
      ...baseAuthenteqProviderConfig,
    } as AuthenteqProviderConfig;
    if (
      object.defaultRedirectUri !== undefined &&
      object.defaultRedirectUri !== null
    ) {
      message.defaultRedirectUri = String(object.defaultRedirectUri);
    }
    if (object.clientId !== undefined && object.clientId !== null) {
      message.clientId = String(object.clientId);
    }
    if (object.clientSecret !== undefined && object.clientSecret !== null) {
      message.clientSecret = String(object.clientSecret);
    }
    if (object.hostAddress !== undefined && object.hostAddress !== null) {
      message.hostAddress = String(object.hostAddress);
    }
    return message;
  },

  toJSON(message: AuthenteqProviderConfig): unknown {
    const obj: any = {};
    message.defaultRedirectUri !== undefined &&
      (obj.defaultRedirectUri = message.defaultRedirectUri);
    message.clientId !== undefined && (obj.clientId = message.clientId);
    message.clientSecret !== undefined &&
      (obj.clientSecret = message.clientSecret);
    message.hostAddress !== undefined &&
      (obj.hostAddress = message.hostAddress);
    return obj;
  },

  fromPartial(
    object: DeepPartial<AuthenteqProviderConfig>
  ): AuthenteqProviderConfig {
    const message = {
      ...baseAuthenteqProviderConfig,
    } as AuthenteqProviderConfig;
    if (
      object.defaultRedirectUri !== undefined &&
      object.defaultRedirectUri !== null
    ) {
      message.defaultRedirectUri = object.defaultRedirectUri;
    }
    if (object.clientId !== undefined && object.clientId !== null) {
      message.clientId = object.clientId;
    }
    if (object.clientSecret !== undefined && object.clientSecret !== null) {
      message.clientSecret = object.clientSecret;
    }
    if (object.hostAddress !== undefined && object.hostAddress !== null) {
      message.hostAddress = object.hostAddress;
    }
    return message;
  },
};

const baseSAFRProviderConfig: object = {
  accountId: "",
  password: "",
  directory: "",
};

export const SAFRProviderConfig = {
  encode(
    message: SAFRProviderConfig,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.accountId !== "") {
      writer.uint32(10).string(message.accountId);
    }
    if (message.password !== "") {
      writer.uint32(18).string(message.password);
    }
    if (message.directory !== "") {
      writer.uint32(26).string(message.directory);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): SAFRProviderConfig {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseSAFRProviderConfig } as SAFRProviderConfig;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.accountId = reader.string();
          break;
        case 2:
          message.password = reader.string();
          break;
        case 3:
          message.directory = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): SAFRProviderConfig {
    const message = { ...baseSAFRProviderConfig } as SAFRProviderConfig;
    if (object.accountId !== undefined && object.accountId !== null) {
      message.accountId = String(object.accountId);
    }
    if (object.password !== undefined && object.password !== null) {
      message.password = String(object.password);
    }
    if (object.directory !== undefined && object.directory !== null) {
      message.directory = String(object.directory);
    }
    return message;
  },

  toJSON(message: SAFRProviderConfig): unknown {
    const obj: any = {};
    message.accountId !== undefined && (obj.accountId = message.accountId);
    message.password !== undefined && (obj.password = message.password);
    message.directory !== undefined && (obj.directory = message.directory);
    return obj;
  },

  fromPartial(object: DeepPartial<SAFRProviderConfig>): SAFRProviderConfig {
    const message = { ...baseSAFRProviderConfig } as SAFRProviderConfig;
    if (object.accountId !== undefined && object.accountId !== null) {
      message.accountId = object.accountId;
    }
    if (object.password !== undefined && object.password !== null) {
      message.password = object.password;
    }
    if (object.directory !== undefined && object.directory !== null) {
      message.directory = object.directory;
    }
    return message;
  },
};

const baseSMSServiceConfig: object = {};

export const SMSServiceConfig = {
  encode(_: SMSServiceConfig, writer: Writer = Writer.create()): Writer {
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): SMSServiceConfig {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseSMSServiceConfig } as SMSServiceConfig;
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

  fromJSON(_: any): SMSServiceConfig {
    const message = { ...baseSMSServiceConfig } as SMSServiceConfig;
    return message;
  },

  toJSON(_: SMSServiceConfig): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial(_: DeepPartial<SMSServiceConfig>): SMSServiceConfig {
    const message = { ...baseSMSServiceConfig } as SMSServiceConfig;
    return message;
  },
};

const baseEmailServiceConfig: object = {};

export const EmailServiceConfig = {
  encode(
    message: EmailServiceConfig,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.defaultFromAddress !== undefined) {
      Email.encode(
        message.defaultFromAddress,
        writer.uint32(10).fork()
      ).ldelim();
    }
    if (message.default !== undefined) {
      BoolValue.encode(
        { value: message.default! },
        writer.uint32(26).fork()
      ).ldelim();
    }
    if (message.provider?.$case === "sendgrid") {
      SendGridProviderConfig.encode(
        message.provider.sendgrid,
        writer.uint32(34).fork()
      ).ldelim();
    }
    if (message.provider?.$case === "mailjet") {
      MailJetProviderConfig.encode(
        message.provider.mailjet,
        writer.uint32(42).fork()
      ).ldelim();
    }
    if (message.provider?.$case === "mailgun") {
      MailgunProviderConfig.encode(
        message.provider.mailgun,
        writer.uint32(50).fork()
      ).ldelim();
    }
    if (message.provider?.$case === "amazon") {
      AmazonSESProviderConfig.encode(
        message.provider.amazon,
        writer.uint32(58).fork()
      ).ldelim();
    }
    if (message.authenticationMessage !== undefined) {
      EmailDefinition.encode(
        message.authenticationMessage,
        writer.uint32(98).fork()
      ).ldelim();
    }
    if (message.invitationMessage !== undefined) {
      EmailDefinition.encode(
        message.invitationMessage,
        writer.uint32(74).fork()
      ).ldelim();
    }
    if (message.resetPasswordMessage !== undefined) {
      EmailDefinition.encode(
        message.resetPasswordMessage,
        writer.uint32(82).fork()
      ).ldelim();
    }
    if (message.verificationMessage !== undefined) {
      EmailDefinition.encode(
        message.verificationMessage,
        writer.uint32(90).fork()
      ).ldelim();
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): EmailServiceConfig {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseEmailServiceConfig } as EmailServiceConfig;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.defaultFromAddress = Email.decode(reader, reader.uint32());
          break;
        case 3:
          message.default = BoolValue.decode(reader, reader.uint32()).value;
          break;
        case 4:
          message.provider = {
            $case: "sendgrid",
            sendgrid: SendGridProviderConfig.decode(reader, reader.uint32()),
          };
          break;
        case 5:
          message.provider = {
            $case: "mailjet",
            mailjet: MailJetProviderConfig.decode(reader, reader.uint32()),
          };
          break;
        case 6:
          message.provider = {
            $case: "mailgun",
            mailgun: MailgunProviderConfig.decode(reader, reader.uint32()),
          };
          break;
        case 7:
          message.provider = {
            $case: "amazon",
            amazon: AmazonSESProviderConfig.decode(reader, reader.uint32()),
          };
          break;
        case 12:
          message.authenticationMessage = EmailDefinition.decode(
            reader,
            reader.uint32()
          );
          break;
        case 9:
          message.invitationMessage = EmailDefinition.decode(
            reader,
            reader.uint32()
          );
          break;
        case 10:
          message.resetPasswordMessage = EmailDefinition.decode(
            reader,
            reader.uint32()
          );
          break;
        case 11:
          message.verificationMessage = EmailDefinition.decode(
            reader,
            reader.uint32()
          );
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): EmailServiceConfig {
    const message = { ...baseEmailServiceConfig } as EmailServiceConfig;
    if (
      object.defaultFromAddress !== undefined &&
      object.defaultFromAddress !== null
    ) {
      message.defaultFromAddress = Email.fromJSON(object.defaultFromAddress);
    }
    if (object.default !== undefined && object.default !== null) {
      message.default = Boolean(object.default);
    }
    if (object.sendgrid !== undefined && object.sendgrid !== null) {
      message.provider = {
        $case: "sendgrid",
        sendgrid: SendGridProviderConfig.fromJSON(object.sendgrid),
      };
    }
    if (object.mailjet !== undefined && object.mailjet !== null) {
      message.provider = {
        $case: "mailjet",
        mailjet: MailJetProviderConfig.fromJSON(object.mailjet),
      };
    }
    if (object.mailgun !== undefined && object.mailgun !== null) {
      message.provider = {
        $case: "mailgun",
        mailgun: MailgunProviderConfig.fromJSON(object.mailgun),
      };
    }
    if (object.amazon !== undefined && object.amazon !== null) {
      message.provider = {
        $case: "amazon",
        amazon: AmazonSESProviderConfig.fromJSON(object.amazon),
      };
    }
    if (
      object.authenticationMessage !== undefined &&
      object.authenticationMessage !== null
    ) {
      message.authenticationMessage = EmailDefinition.fromJSON(
        object.authenticationMessage
      );
    }
    if (
      object.invitationMessage !== undefined &&
      object.invitationMessage !== null
    ) {
      message.invitationMessage = EmailDefinition.fromJSON(
        object.invitationMessage
      );
    }
    if (
      object.resetPasswordMessage !== undefined &&
      object.resetPasswordMessage !== null
    ) {
      message.resetPasswordMessage = EmailDefinition.fromJSON(
        object.resetPasswordMessage
      );
    }
    if (
      object.verificationMessage !== undefined &&
      object.verificationMessage !== null
    ) {
      message.verificationMessage = EmailDefinition.fromJSON(
        object.verificationMessage
      );
    }
    return message;
  },

  toJSON(message: EmailServiceConfig): unknown {
    const obj: any = {};
    message.defaultFromAddress !== undefined &&
      (obj.defaultFromAddress = message.defaultFromAddress
        ? Email.toJSON(message.defaultFromAddress)
        : undefined);
    message.default !== undefined && (obj.default = message.default);
    message.provider?.$case === "sendgrid" &&
      (obj.sendgrid = message.provider?.sendgrid
        ? SendGridProviderConfig.toJSON(message.provider?.sendgrid)
        : undefined);
    message.provider?.$case === "mailjet" &&
      (obj.mailjet = message.provider?.mailjet
        ? MailJetProviderConfig.toJSON(message.provider?.mailjet)
        : undefined);
    message.provider?.$case === "mailgun" &&
      (obj.mailgun = message.provider?.mailgun
        ? MailgunProviderConfig.toJSON(message.provider?.mailgun)
        : undefined);
    message.provider?.$case === "amazon" &&
      (obj.amazon = message.provider?.amazon
        ? AmazonSESProviderConfig.toJSON(message.provider?.amazon)
        : undefined);
    message.authenticationMessage !== undefined &&
      (obj.authenticationMessage = message.authenticationMessage
        ? EmailDefinition.toJSON(message.authenticationMessage)
        : undefined);
    message.invitationMessage !== undefined &&
      (obj.invitationMessage = message.invitationMessage
        ? EmailDefinition.toJSON(message.invitationMessage)
        : undefined);
    message.resetPasswordMessage !== undefined &&
      (obj.resetPasswordMessage = message.resetPasswordMessage
        ? EmailDefinition.toJSON(message.resetPasswordMessage)
        : undefined);
    message.verificationMessage !== undefined &&
      (obj.verificationMessage = message.verificationMessage
        ? EmailDefinition.toJSON(message.verificationMessage)
        : undefined);
    return obj;
  },

  fromPartial(object: DeepPartial<EmailServiceConfig>): EmailServiceConfig {
    const message = { ...baseEmailServiceConfig } as EmailServiceConfig;
    if (
      object.defaultFromAddress !== undefined &&
      object.defaultFromAddress !== null
    ) {
      message.defaultFromAddress = Email.fromPartial(object.defaultFromAddress);
    }
    if (object.default !== undefined && object.default !== null) {
      message.default = object.default;
    }
    if (
      object.provider?.$case === "sendgrid" &&
      object.provider?.sendgrid !== undefined &&
      object.provider?.sendgrid !== null
    ) {
      message.provider = {
        $case: "sendgrid",
        sendgrid: SendGridProviderConfig.fromPartial(object.provider.sendgrid),
      };
    }
    if (
      object.provider?.$case === "mailjet" &&
      object.provider?.mailjet !== undefined &&
      object.provider?.mailjet !== null
    ) {
      message.provider = {
        $case: "mailjet",
        mailjet: MailJetProviderConfig.fromPartial(object.provider.mailjet),
      };
    }
    if (
      object.provider?.$case === "mailgun" &&
      object.provider?.mailgun !== undefined &&
      object.provider?.mailgun !== null
    ) {
      message.provider = {
        $case: "mailgun",
        mailgun: MailgunProviderConfig.fromPartial(object.provider.mailgun),
      };
    }
    if (
      object.provider?.$case === "amazon" &&
      object.provider?.amazon !== undefined &&
      object.provider?.amazon !== null
    ) {
      message.provider = {
        $case: "amazon",
        amazon: AmazonSESProviderConfig.fromPartial(object.provider.amazon),
      };
    }
    if (
      object.authenticationMessage !== undefined &&
      object.authenticationMessage !== null
    ) {
      message.authenticationMessage = EmailDefinition.fromPartial(
        object.authenticationMessage
      );
    }
    if (
      object.invitationMessage !== undefined &&
      object.invitationMessage !== null
    ) {
      message.invitationMessage = EmailDefinition.fromPartial(
        object.invitationMessage
      );
    }
    if (
      object.resetPasswordMessage !== undefined &&
      object.resetPasswordMessage !== null
    ) {
      message.resetPasswordMessage = EmailDefinition.fromPartial(
        object.resetPasswordMessage
      );
    }
    if (
      object.verificationMessage !== undefined &&
      object.verificationMessage !== null
    ) {
      message.verificationMessage = EmailDefinition.fromPartial(
        object.verificationMessage
      );
    }
    return message;
  },
};

const baseEmail: object = { address: "", name: "" };

export const Email = {
  encode(message: Email, writer: Writer = Writer.create()): Writer {
    if (message.address !== "") {
      writer.uint32(10).string(message.address);
    }
    if (message.name !== "") {
      writer.uint32(18).string(message.name);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): Email {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseEmail } as Email;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.address = reader.string();
          break;
        case 2:
          message.name = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Email {
    const message = { ...baseEmail } as Email;
    if (object.address !== undefined && object.address !== null) {
      message.address = String(object.address);
    }
    if (object.name !== undefined && object.name !== null) {
      message.name = String(object.name);
    }
    return message;
  },

  toJSON(message: Email): unknown {
    const obj: any = {};
    message.address !== undefined && (obj.address = message.address);
    message.name !== undefined && (obj.name = message.name);
    return obj;
  },

  fromPartial(object: DeepPartial<Email>): Email {
    const message = { ...baseEmail } as Email;
    if (object.address !== undefined && object.address !== null) {
      message.address = object.address;
    }
    if (object.name !== undefined && object.name !== null) {
      message.name = object.name;
    }
    return message;
  },
};

const baseSendGridProviderConfig: object = { apiKey: "", sandboxMode: false };

export const SendGridProviderConfig = {
  encode(
    message: SendGridProviderConfig,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.apiKey !== "") {
      writer.uint32(10).string(message.apiKey);
    }
    if (message.sandboxMode === true) {
      writer.uint32(16).bool(message.sandboxMode);
    }
    if (message.ipPoolName !== undefined) {
      StringValue.encode(
        { value: message.ipPoolName! },
        writer.uint32(26).fork()
      ).ldelim();
    }
    if (message.host !== undefined) {
      StringValue.encode(
        { value: message.host! },
        writer.uint32(34).fork()
      ).ldelim();
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): SendGridProviderConfig {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseSendGridProviderConfig } as SendGridProviderConfig;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.apiKey = reader.string();
          break;
        case 2:
          message.sandboxMode = reader.bool();
          break;
        case 3:
          message.ipPoolName = StringValue.decode(
            reader,
            reader.uint32()
          ).value;
          break;
        case 4:
          message.host = StringValue.decode(reader, reader.uint32()).value;
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): SendGridProviderConfig {
    const message = { ...baseSendGridProviderConfig } as SendGridProviderConfig;
    if (object.apiKey !== undefined && object.apiKey !== null) {
      message.apiKey = String(object.apiKey);
    }
    if (object.sandboxMode !== undefined && object.sandboxMode !== null) {
      message.sandboxMode = Boolean(object.sandboxMode);
    }
    if (object.ipPoolName !== undefined && object.ipPoolName !== null) {
      message.ipPoolName = String(object.ipPoolName);
    }
    if (object.host !== undefined && object.host !== null) {
      message.host = String(object.host);
    }
    return message;
  },

  toJSON(message: SendGridProviderConfig): unknown {
    const obj: any = {};
    message.apiKey !== undefined && (obj.apiKey = message.apiKey);
    message.sandboxMode !== undefined &&
      (obj.sandboxMode = message.sandboxMode);
    message.ipPoolName !== undefined && (obj.ipPoolName = message.ipPoolName);
    message.host !== undefined && (obj.host = message.host);
    return obj;
  },

  fromPartial(
    object: DeepPartial<SendGridProviderConfig>
  ): SendGridProviderConfig {
    const message = { ...baseSendGridProviderConfig } as SendGridProviderConfig;
    if (object.apiKey !== undefined && object.apiKey !== null) {
      message.apiKey = object.apiKey;
    }
    if (object.sandboxMode !== undefined && object.sandboxMode !== null) {
      message.sandboxMode = object.sandboxMode;
    }
    if (object.ipPoolName !== undefined && object.ipPoolName !== null) {
      message.ipPoolName = object.ipPoolName;
    }
    if (object.host !== undefined && object.host !== null) {
      message.host = object.host;
    }
    return message;
  },
};

const baseMailJetProviderConfig: object = { apiKey: "", sandboxMode: false };

export const MailJetProviderConfig = {
  encode(
    message: MailJetProviderConfig,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.apiKey !== "") {
      writer.uint32(10).string(message.apiKey);
    }
    if (message.sandboxMode === true) {
      writer.uint32(16).bool(message.sandboxMode);
    }
    Object.entries(message.urlTags).forEach(([key, value]) => {
      MailJetProviderConfig_UrlTagsEntry.encode(
        { key: key as any, value },
        writer.uint32(66).fork()
      ).ldelim();
    });
    if (message.customCampaign !== undefined) {
      StringValue.encode(
        { value: message.customCampaign! },
        writer.uint32(34).fork()
      ).ldelim();
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): MailJetProviderConfig {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseMailJetProviderConfig } as MailJetProviderConfig;
    message.urlTags = {};
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.apiKey = reader.string();
          break;
        case 2:
          message.sandboxMode = reader.bool();
          break;
        case 8:
          const entry8 = MailJetProviderConfig_UrlTagsEntry.decode(
            reader,
            reader.uint32()
          );
          if (entry8.value !== undefined) {
            message.urlTags[entry8.key] = entry8.value;
          }
          break;
        case 4:
          message.customCampaign = StringValue.decode(
            reader,
            reader.uint32()
          ).value;
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): MailJetProviderConfig {
    const message = { ...baseMailJetProviderConfig } as MailJetProviderConfig;
    message.urlTags = {};
    if (object.apiKey !== undefined && object.apiKey !== null) {
      message.apiKey = String(object.apiKey);
    }
    if (object.sandboxMode !== undefined && object.sandboxMode !== null) {
      message.sandboxMode = Boolean(object.sandboxMode);
    }
    if (object.urlTags !== undefined && object.urlTags !== null) {
      Object.entries(object.urlTags).forEach(([key, value]) => {
        message.urlTags[key] = String(value);
      });
    }
    if (object.customCampaign !== undefined && object.customCampaign !== null) {
      message.customCampaign = String(object.customCampaign);
    }
    return message;
  },

  toJSON(message: MailJetProviderConfig): unknown {
    const obj: any = {};
    message.apiKey !== undefined && (obj.apiKey = message.apiKey);
    message.sandboxMode !== undefined &&
      (obj.sandboxMode = message.sandboxMode);
    obj.urlTags = {};
    if (message.urlTags) {
      Object.entries(message.urlTags).forEach(([k, v]) => {
        obj.urlTags[k] = v;
      });
    }
    message.customCampaign !== undefined &&
      (obj.customCampaign = message.customCampaign);
    return obj;
  },

  fromPartial(
    object: DeepPartial<MailJetProviderConfig>
  ): MailJetProviderConfig {
    const message = { ...baseMailJetProviderConfig } as MailJetProviderConfig;
    message.urlTags = {};
    if (object.apiKey !== undefined && object.apiKey !== null) {
      message.apiKey = object.apiKey;
    }
    if (object.sandboxMode !== undefined && object.sandboxMode !== null) {
      message.sandboxMode = object.sandboxMode;
    }
    if (object.urlTags !== undefined && object.urlTags !== null) {
      Object.entries(object.urlTags).forEach(([key, value]) => {
        if (value !== undefined) {
          message.urlTags[key] = String(value);
        }
      });
    }
    if (object.customCampaign !== undefined && object.customCampaign !== null) {
      message.customCampaign = object.customCampaign;
    }
    return message;
  },
};

const baseMailJetProviderConfig_UrlTagsEntry: object = { key: "", value: "" };

export const MailJetProviderConfig_UrlTagsEntry = {
  encode(
    message: MailJetProviderConfig_UrlTagsEntry,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.key !== "") {
      writer.uint32(10).string(message.key);
    }
    if (message.value !== "") {
      writer.uint32(18).string(message.value);
    }
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): MailJetProviderConfig_UrlTagsEntry {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseMailJetProviderConfig_UrlTagsEntry,
    } as MailJetProviderConfig_UrlTagsEntry;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.key = reader.string();
          break;
        case 2:
          message.value = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): MailJetProviderConfig_UrlTagsEntry {
    const message = {
      ...baseMailJetProviderConfig_UrlTagsEntry,
    } as MailJetProviderConfig_UrlTagsEntry;
    if (object.key !== undefined && object.key !== null) {
      message.key = String(object.key);
    }
    if (object.value !== undefined && object.value !== null) {
      message.value = String(object.value);
    }
    return message;
  },

  toJSON(message: MailJetProviderConfig_UrlTagsEntry): unknown {
    const obj: any = {};
    message.key !== undefined && (obj.key = message.key);
    message.value !== undefined && (obj.value = message.value);
    return obj;
  },

  fromPartial(
    object: DeepPartial<MailJetProviderConfig_UrlTagsEntry>
  ): MailJetProviderConfig_UrlTagsEntry {
    const message = {
      ...baseMailJetProviderConfig_UrlTagsEntry,
    } as MailJetProviderConfig_UrlTagsEntry;
    if (object.key !== undefined && object.key !== null) {
      message.key = object.key;
    }
    if (object.value !== undefined && object.value !== null) {
      message.value = object.value;
    }
    return message;
  },
};

const baseMailgunProviderConfig: object = { apiKey: "" };

export const MailgunProviderConfig = {
  encode(
    message: MailgunProviderConfig,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.apiKey !== "") {
      writer.uint32(10).string(message.apiKey);
    }
    if (message.defaultFromAddress !== undefined) {
      Email.encode(
        message.defaultFromAddress,
        writer.uint32(18).fork()
      ).ldelim();
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): MailgunProviderConfig {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseMailgunProviderConfig } as MailgunProviderConfig;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.apiKey = reader.string();
          break;
        case 2:
          message.defaultFromAddress = Email.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): MailgunProviderConfig {
    const message = { ...baseMailgunProviderConfig } as MailgunProviderConfig;
    if (object.apiKey !== undefined && object.apiKey !== null) {
      message.apiKey = String(object.apiKey);
    }
    if (
      object.defaultFromAddress !== undefined &&
      object.defaultFromAddress !== null
    ) {
      message.defaultFromAddress = Email.fromJSON(object.defaultFromAddress);
    }
    return message;
  },

  toJSON(message: MailgunProviderConfig): unknown {
    const obj: any = {};
    message.apiKey !== undefined && (obj.apiKey = message.apiKey);
    message.defaultFromAddress !== undefined &&
      (obj.defaultFromAddress = message.defaultFromAddress
        ? Email.toJSON(message.defaultFromAddress)
        : undefined);
    return obj;
  },

  fromPartial(
    object: DeepPartial<MailgunProviderConfig>
  ): MailgunProviderConfig {
    const message = { ...baseMailgunProviderConfig } as MailgunProviderConfig;
    if (object.apiKey !== undefined && object.apiKey !== null) {
      message.apiKey = object.apiKey;
    }
    if (
      object.defaultFromAddress !== undefined &&
      object.defaultFromAddress !== null
    ) {
      message.defaultFromAddress = Email.fromPartial(object.defaultFromAddress);
    }
    return message;
  },
};

const baseAmazonSESProviderConfig: object = {
  accessKeyId: "",
  secretAccessKey: "",
  region: "",
  configurationSetName: "",
  feedbackForwardingEmailAddress: "",
  replyToAddresses: "",
};

export const AmazonSESProviderConfig = {
  encode(
    message: AmazonSESProviderConfig,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.accessKeyId !== "") {
      writer.uint32(10).string(message.accessKeyId);
    }
    if (message.secretAccessKey !== "") {
      writer.uint32(18).string(message.secretAccessKey);
    }
    if (message.region !== "") {
      writer.uint32(34).string(message.region);
    }
    if (message.configurationSetName !== "") {
      writer.uint32(42).string(message.configurationSetName);
    }
    if (message.defaultFromAddress !== undefined) {
      Email.encode(
        message.defaultFromAddress,
        writer.uint32(50).fork()
      ).ldelim();
    }
    if (message.feedbackForwardingEmailAddress !== "") {
      writer.uint32(58).string(message.feedbackForwardingEmailAddress);
    }
    for (const v of message.replyToAddresses) {
      writer.uint32(66).string(v!);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): AmazonSESProviderConfig {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseAmazonSESProviderConfig,
    } as AmazonSESProviderConfig;
    message.replyToAddresses = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.accessKeyId = reader.string();
          break;
        case 2:
          message.secretAccessKey = reader.string();
          break;
        case 4:
          message.region = reader.string();
          break;
        case 5:
          message.configurationSetName = reader.string();
          break;
        case 6:
          message.defaultFromAddress = Email.decode(reader, reader.uint32());
          break;
        case 7:
          message.feedbackForwardingEmailAddress = reader.string();
          break;
        case 8:
          message.replyToAddresses.push(reader.string());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): AmazonSESProviderConfig {
    const message = {
      ...baseAmazonSESProviderConfig,
    } as AmazonSESProviderConfig;
    message.replyToAddresses = [];
    if (object.accessKeyId !== undefined && object.accessKeyId !== null) {
      message.accessKeyId = String(object.accessKeyId);
    }
    if (
      object.secretAccessKey !== undefined &&
      object.secretAccessKey !== null
    ) {
      message.secretAccessKey = String(object.secretAccessKey);
    }
    if (object.region !== undefined && object.region !== null) {
      message.region = String(object.region);
    }
    if (
      object.configurationSetName !== undefined &&
      object.configurationSetName !== null
    ) {
      message.configurationSetName = String(object.configurationSetName);
    }
    if (
      object.defaultFromAddress !== undefined &&
      object.defaultFromAddress !== null
    ) {
      message.defaultFromAddress = Email.fromJSON(object.defaultFromAddress);
    }
    if (
      object.feedbackForwardingEmailAddress !== undefined &&
      object.feedbackForwardingEmailAddress !== null
    ) {
      message.feedbackForwardingEmailAddress = String(
        object.feedbackForwardingEmailAddress
      );
    }
    if (
      object.replyToAddresses !== undefined &&
      object.replyToAddresses !== null
    ) {
      for (const e of object.replyToAddresses) {
        message.replyToAddresses.push(String(e));
      }
    }
    return message;
  },

  toJSON(message: AmazonSESProviderConfig): unknown {
    const obj: any = {};
    message.accessKeyId !== undefined &&
      (obj.accessKeyId = message.accessKeyId);
    message.secretAccessKey !== undefined &&
      (obj.secretAccessKey = message.secretAccessKey);
    message.region !== undefined && (obj.region = message.region);
    message.configurationSetName !== undefined &&
      (obj.configurationSetName = message.configurationSetName);
    message.defaultFromAddress !== undefined &&
      (obj.defaultFromAddress = message.defaultFromAddress
        ? Email.toJSON(message.defaultFromAddress)
        : undefined);
    message.feedbackForwardingEmailAddress !== undefined &&
      (obj.feedbackForwardingEmailAddress =
        message.feedbackForwardingEmailAddress);
    if (message.replyToAddresses) {
      obj.replyToAddresses = message.replyToAddresses.map((e) => e);
    } else {
      obj.replyToAddresses = [];
    }
    return obj;
  },

  fromPartial(
    object: DeepPartial<AmazonSESProviderConfig>
  ): AmazonSESProviderConfig {
    const message = {
      ...baseAmazonSESProviderConfig,
    } as AmazonSESProviderConfig;
    message.replyToAddresses = [];
    if (object.accessKeyId !== undefined && object.accessKeyId !== null) {
      message.accessKeyId = object.accessKeyId;
    }
    if (
      object.secretAccessKey !== undefined &&
      object.secretAccessKey !== null
    ) {
      message.secretAccessKey = object.secretAccessKey;
    }
    if (object.region !== undefined && object.region !== null) {
      message.region = object.region;
    }
    if (
      object.configurationSetName !== undefined &&
      object.configurationSetName !== null
    ) {
      message.configurationSetName = object.configurationSetName;
    }
    if (
      object.defaultFromAddress !== undefined &&
      object.defaultFromAddress !== null
    ) {
      message.defaultFromAddress = Email.fromPartial(object.defaultFromAddress);
    }
    if (
      object.feedbackForwardingEmailAddress !== undefined &&
      object.feedbackForwardingEmailAddress !== null
    ) {
      message.feedbackForwardingEmailAddress =
        object.feedbackForwardingEmailAddress;
    }
    if (
      object.replyToAddresses !== undefined &&
      object.replyToAddresses !== null
    ) {
      for (const e of object.replyToAddresses) {
        message.replyToAddresses.push(e);
      }
    }
    return message;
  },
};

const baseEmailDefinition: object = {};

export const EmailDefinition = {
  encode(message: EmailDefinition, writer: Writer = Writer.create()): Writer {
    if (message.email?.$case === "template") {
      EmailTemplate.encode(
        message.email.template,
        writer.uint32(18).fork()
      ).ldelim();
    }
    if (message.email?.$case === "message") {
      EmailMessage.encode(
        message.email.message,
        writer.uint32(26).fork()
      ).ldelim();
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): EmailDefinition {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseEmailDefinition } as EmailDefinition;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 2:
          message.email = {
            $case: "template",
            template: EmailTemplate.decode(reader, reader.uint32()),
          };
          break;
        case 3:
          message.email = {
            $case: "message",
            message: EmailMessage.decode(reader, reader.uint32()),
          };
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): EmailDefinition {
    const message = { ...baseEmailDefinition } as EmailDefinition;
    if (object.template !== undefined && object.template !== null) {
      message.email = {
        $case: "template",
        template: EmailTemplate.fromJSON(object.template),
      };
    }
    if (object.message !== undefined && object.message !== null) {
      message.email = {
        $case: "message",
        message: EmailMessage.fromJSON(object.message),
      };
    }
    return message;
  },

  toJSON(message: EmailDefinition): unknown {
    const obj: any = {};
    message.email?.$case === "template" &&
      (obj.template = message.email?.template
        ? EmailTemplate.toJSON(message.email?.template)
        : undefined);
    message.email?.$case === "message" &&
      (obj.message = message.email?.message
        ? EmailMessage.toJSON(message.email?.message)
        : undefined);
    return obj;
  },

  fromPartial(object: DeepPartial<EmailDefinition>): EmailDefinition {
    const message = { ...baseEmailDefinition } as EmailDefinition;
    if (
      object.email?.$case === "template" &&
      object.email?.template !== undefined &&
      object.email?.template !== null
    ) {
      message.email = {
        $case: "template",
        template: EmailTemplate.fromPartial(object.email.template),
      };
    }
    if (
      object.email?.$case === "message" &&
      object.email?.message !== undefined &&
      object.email?.message !== null
    ) {
      message.email = {
        $case: "message",
        message: EmailMessage.fromPartial(object.email.message),
      };
    }
    return message;
  },
};

const baseEmailTemplate: object = {
  templateId: "",
  subject: "",
  categories: "",
  templateArn: "",
};

export const EmailTemplate = {
  encode(message: EmailTemplate, writer: Writer = Writer.create()): Writer {
    if (message.templateId !== "") {
      writer.uint32(10).string(message.templateId);
    }
    if (message.templateVersion !== undefined) {
      StringValue.encode(
        { value: message.templateVersion! },
        writer.uint32(162).fork()
      ).ldelim();
    }
    if (message.from !== undefined) {
      Email.encode(message.from, writer.uint32(18).fork()).ldelim();
    }
    if (message.replyTo !== undefined) {
      Email.encode(message.replyTo, writer.uint32(26).fork()).ldelim();
    }
    for (const v of message.to) {
      Email.encode(v!, writer.uint32(34).fork()).ldelim();
    }
    for (const v of message.cc) {
      Email.encode(v!, writer.uint32(42).fork()).ldelim();
    }
    for (const v of message.bcc) {
      Email.encode(v!, writer.uint32(50).fork()).ldelim();
    }
    if (message.subject !== "") {
      writer.uint32(58).string(message.subject);
    }
    Object.entries(message.headers).forEach(([key, value]) => {
      EmailTemplate_HeadersEntry.encode(
        { key: key as any, value },
        writer.uint32(66).fork()
      ).ldelim();
    });
    Object.entries(message.customArgs).forEach(([key, value]) => {
      EmailTemplate_CustomArgsEntry.encode(
        { key: key as any, value },
        writer.uint32(90).fork()
      ).ldelim();
    });
    Object.entries(message.dynamicTemplateValues).forEach(([key, value]) => {
      EmailTemplate_DynamicTemplateValuesEntry.encode(
        { key: key as any, value },
        writer.uint32(98).fork()
      ).ldelim();
    });
    for (const v of message.categories) {
      writer.uint32(106).string(v!);
    }
    for (const v of message.attachments) {
      EmailAttachment.encode(v!, writer.uint32(114).fork()).ldelim();
    }
    if (message.eventPayload !== undefined) {
      StringValue.encode(
        { value: message.eventPayload! },
        writer.uint32(122).fork()
      ).ldelim();
    }
    if (message.templateArn !== "") {
      writer.uint32(130).string(message.templateArn);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): EmailTemplate {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseEmailTemplate } as EmailTemplate;
    message.to = [];
    message.cc = [];
    message.bcc = [];
    message.headers = {};
    message.customArgs = {};
    message.dynamicTemplateValues = {};
    message.categories = [];
    message.attachments = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.templateId = reader.string();
          break;
        case 20:
          message.templateVersion = StringValue.decode(
            reader,
            reader.uint32()
          ).value;
          break;
        case 2:
          message.from = Email.decode(reader, reader.uint32());
          break;
        case 3:
          message.replyTo = Email.decode(reader, reader.uint32());
          break;
        case 4:
          message.to.push(Email.decode(reader, reader.uint32()));
          break;
        case 5:
          message.cc.push(Email.decode(reader, reader.uint32()));
          break;
        case 6:
          message.bcc.push(Email.decode(reader, reader.uint32()));
          break;
        case 7:
          message.subject = reader.string();
          break;
        case 8:
          const entry8 = EmailTemplate_HeadersEntry.decode(
            reader,
            reader.uint32()
          );
          if (entry8.value !== undefined) {
            message.headers[entry8.key] = entry8.value;
          }
          break;
        case 11:
          const entry11 = EmailTemplate_CustomArgsEntry.decode(
            reader,
            reader.uint32()
          );
          if (entry11.value !== undefined) {
            message.customArgs[entry11.key] = entry11.value;
          }
          break;
        case 12:
          const entry12 = EmailTemplate_DynamicTemplateValuesEntry.decode(
            reader,
            reader.uint32()
          );
          if (entry12.value !== undefined) {
            message.dynamicTemplateValues[entry12.key] = entry12.value;
          }
          break;
        case 13:
          message.categories.push(reader.string());
          break;
        case 14:
          message.attachments.push(
            EmailAttachment.decode(reader, reader.uint32())
          );
          break;
        case 15:
          message.eventPayload = StringValue.decode(
            reader,
            reader.uint32()
          ).value;
          break;
        case 16:
          message.templateArn = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): EmailTemplate {
    const message = { ...baseEmailTemplate } as EmailTemplate;
    message.to = [];
    message.cc = [];
    message.bcc = [];
    message.headers = {};
    message.customArgs = {};
    message.dynamicTemplateValues = {};
    message.categories = [];
    message.attachments = [];
    if (object.templateId !== undefined && object.templateId !== null) {
      message.templateId = String(object.templateId);
    }
    if (
      object.templateVersion !== undefined &&
      object.templateVersion !== null
    ) {
      message.templateVersion = String(object.templateVersion);
    }
    if (object.from !== undefined && object.from !== null) {
      message.from = Email.fromJSON(object.from);
    }
    if (object.replyTo !== undefined && object.replyTo !== null) {
      message.replyTo = Email.fromJSON(object.replyTo);
    }
    if (object.to !== undefined && object.to !== null) {
      for (const e of object.to) {
        message.to.push(Email.fromJSON(e));
      }
    }
    if (object.cc !== undefined && object.cc !== null) {
      for (const e of object.cc) {
        message.cc.push(Email.fromJSON(e));
      }
    }
    if (object.bcc !== undefined && object.bcc !== null) {
      for (const e of object.bcc) {
        message.bcc.push(Email.fromJSON(e));
      }
    }
    if (object.subject !== undefined && object.subject !== null) {
      message.subject = String(object.subject);
    }
    if (object.headers !== undefined && object.headers !== null) {
      Object.entries(object.headers).forEach(([key, value]) => {
        message.headers[key] = String(value);
      });
    }
    if (object.customArgs !== undefined && object.customArgs !== null) {
      Object.entries(object.customArgs).forEach(([key, value]) => {
        message.customArgs[key] = String(value);
      });
    }
    if (
      object.dynamicTemplateValues !== undefined &&
      object.dynamicTemplateValues !== null
    ) {
      Object.entries(object.dynamicTemplateValues).forEach(([key, value]) => {
        message.dynamicTemplateValues[key] = Value.fromJSON(value);
      });
    }
    if (object.categories !== undefined && object.categories !== null) {
      for (const e of object.categories) {
        message.categories.push(String(e));
      }
    }
    if (object.attachments !== undefined && object.attachments !== null) {
      for (const e of object.attachments) {
        message.attachments.push(EmailAttachment.fromJSON(e));
      }
    }
    if (object.eventPayload !== undefined && object.eventPayload !== null) {
      message.eventPayload = String(object.eventPayload);
    }
    if (object.templateArn !== undefined && object.templateArn !== null) {
      message.templateArn = String(object.templateArn);
    }
    return message;
  },

  toJSON(message: EmailTemplate): unknown {
    const obj: any = {};
    message.templateId !== undefined && (obj.templateId = message.templateId);
    message.templateVersion !== undefined &&
      (obj.templateVersion = message.templateVersion);
    message.from !== undefined &&
      (obj.from = message.from ? Email.toJSON(message.from) : undefined);
    message.replyTo !== undefined &&
      (obj.replyTo = message.replyTo
        ? Email.toJSON(message.replyTo)
        : undefined);
    if (message.to) {
      obj.to = message.to.map((e) => (e ? Email.toJSON(e) : undefined));
    } else {
      obj.to = [];
    }
    if (message.cc) {
      obj.cc = message.cc.map((e) => (e ? Email.toJSON(e) : undefined));
    } else {
      obj.cc = [];
    }
    if (message.bcc) {
      obj.bcc = message.bcc.map((e) => (e ? Email.toJSON(e) : undefined));
    } else {
      obj.bcc = [];
    }
    message.subject !== undefined && (obj.subject = message.subject);
    obj.headers = {};
    if (message.headers) {
      Object.entries(message.headers).forEach(([k, v]) => {
        obj.headers[k] = v;
      });
    }
    obj.customArgs = {};
    if (message.customArgs) {
      Object.entries(message.customArgs).forEach(([k, v]) => {
        obj.customArgs[k] = v;
      });
    }
    obj.dynamicTemplateValues = {};
    if (message.dynamicTemplateValues) {
      Object.entries(message.dynamicTemplateValues).forEach(([k, v]) => {
        obj.dynamicTemplateValues[k] = Value.toJSON(v);
      });
    }
    if (message.categories) {
      obj.categories = message.categories.map((e) => e);
    } else {
      obj.categories = [];
    }
    if (message.attachments) {
      obj.attachments = message.attachments.map((e) =>
        e ? EmailAttachment.toJSON(e) : undefined
      );
    } else {
      obj.attachments = [];
    }
    message.eventPayload !== undefined &&
      (obj.eventPayload = message.eventPayload);
    message.templateArn !== undefined &&
      (obj.templateArn = message.templateArn);
    return obj;
  },

  fromPartial(object: DeepPartial<EmailTemplate>): EmailTemplate {
    const message = { ...baseEmailTemplate } as EmailTemplate;
    message.to = [];
    message.cc = [];
    message.bcc = [];
    message.headers = {};
    message.customArgs = {};
    message.dynamicTemplateValues = {};
    message.categories = [];
    message.attachments = [];
    if (object.templateId !== undefined && object.templateId !== null) {
      message.templateId = object.templateId;
    }
    if (
      object.templateVersion !== undefined &&
      object.templateVersion !== null
    ) {
      message.templateVersion = object.templateVersion;
    }
    if (object.from !== undefined && object.from !== null) {
      message.from = Email.fromPartial(object.from);
    }
    if (object.replyTo !== undefined && object.replyTo !== null) {
      message.replyTo = Email.fromPartial(object.replyTo);
    }
    if (object.to !== undefined && object.to !== null) {
      for (const e of object.to) {
        message.to.push(Email.fromPartial(e));
      }
    }
    if (object.cc !== undefined && object.cc !== null) {
      for (const e of object.cc) {
        message.cc.push(Email.fromPartial(e));
      }
    }
    if (object.bcc !== undefined && object.bcc !== null) {
      for (const e of object.bcc) {
        message.bcc.push(Email.fromPartial(e));
      }
    }
    if (object.subject !== undefined && object.subject !== null) {
      message.subject = object.subject;
    }
    if (object.headers !== undefined && object.headers !== null) {
      Object.entries(object.headers).forEach(([key, value]) => {
        if (value !== undefined) {
          message.headers[key] = String(value);
        }
      });
    }
    if (object.customArgs !== undefined && object.customArgs !== null) {
      Object.entries(object.customArgs).forEach(([key, value]) => {
        if (value !== undefined) {
          message.customArgs[key] = String(value);
        }
      });
    }
    if (
      object.dynamicTemplateValues !== undefined &&
      object.dynamicTemplateValues !== null
    ) {
      Object.entries(object.dynamicTemplateValues).forEach(([key, value]) => {
        if (value !== undefined) {
          message.dynamicTemplateValues[key] = Value.fromPartial(value);
        }
      });
    }
    if (object.categories !== undefined && object.categories !== null) {
      for (const e of object.categories) {
        message.categories.push(e);
      }
    }
    if (object.attachments !== undefined && object.attachments !== null) {
      for (const e of object.attachments) {
        message.attachments.push(EmailAttachment.fromPartial(e));
      }
    }
    if (object.eventPayload !== undefined && object.eventPayload !== null) {
      message.eventPayload = object.eventPayload;
    }
    if (object.templateArn !== undefined && object.templateArn !== null) {
      message.templateArn = object.templateArn;
    }
    return message;
  },
};

const baseEmailTemplate_HeadersEntry: object = { key: "", value: "" };

export const EmailTemplate_HeadersEntry = {
  encode(
    message: EmailTemplate_HeadersEntry,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.key !== "") {
      writer.uint32(10).string(message.key);
    }
    if (message.value !== "") {
      writer.uint32(18).string(message.value);
    }
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): EmailTemplate_HeadersEntry {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseEmailTemplate_HeadersEntry,
    } as EmailTemplate_HeadersEntry;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.key = reader.string();
          break;
        case 2:
          message.value = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): EmailTemplate_HeadersEntry {
    const message = {
      ...baseEmailTemplate_HeadersEntry,
    } as EmailTemplate_HeadersEntry;
    if (object.key !== undefined && object.key !== null) {
      message.key = String(object.key);
    }
    if (object.value !== undefined && object.value !== null) {
      message.value = String(object.value);
    }
    return message;
  },

  toJSON(message: EmailTemplate_HeadersEntry): unknown {
    const obj: any = {};
    message.key !== undefined && (obj.key = message.key);
    message.value !== undefined && (obj.value = message.value);
    return obj;
  },

  fromPartial(
    object: DeepPartial<EmailTemplate_HeadersEntry>
  ): EmailTemplate_HeadersEntry {
    const message = {
      ...baseEmailTemplate_HeadersEntry,
    } as EmailTemplate_HeadersEntry;
    if (object.key !== undefined && object.key !== null) {
      message.key = object.key;
    }
    if (object.value !== undefined && object.value !== null) {
      message.value = object.value;
    }
    return message;
  },
};

const baseEmailTemplate_CustomArgsEntry: object = { key: "", value: "" };

export const EmailTemplate_CustomArgsEntry = {
  encode(
    message: EmailTemplate_CustomArgsEntry,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.key !== "") {
      writer.uint32(10).string(message.key);
    }
    if (message.value !== "") {
      writer.uint32(18).string(message.value);
    }
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): EmailTemplate_CustomArgsEntry {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseEmailTemplate_CustomArgsEntry,
    } as EmailTemplate_CustomArgsEntry;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.key = reader.string();
          break;
        case 2:
          message.value = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): EmailTemplate_CustomArgsEntry {
    const message = {
      ...baseEmailTemplate_CustomArgsEntry,
    } as EmailTemplate_CustomArgsEntry;
    if (object.key !== undefined && object.key !== null) {
      message.key = String(object.key);
    }
    if (object.value !== undefined && object.value !== null) {
      message.value = String(object.value);
    }
    return message;
  },

  toJSON(message: EmailTemplate_CustomArgsEntry): unknown {
    const obj: any = {};
    message.key !== undefined && (obj.key = message.key);
    message.value !== undefined && (obj.value = message.value);
    return obj;
  },

  fromPartial(
    object: DeepPartial<EmailTemplate_CustomArgsEntry>
  ): EmailTemplate_CustomArgsEntry {
    const message = {
      ...baseEmailTemplate_CustomArgsEntry,
    } as EmailTemplate_CustomArgsEntry;
    if (object.key !== undefined && object.key !== null) {
      message.key = object.key;
    }
    if (object.value !== undefined && object.value !== null) {
      message.value = object.value;
    }
    return message;
  },
};

const baseEmailTemplate_DynamicTemplateValuesEntry: object = { key: "" };

export const EmailTemplate_DynamicTemplateValuesEntry = {
  encode(
    message: EmailTemplate_DynamicTemplateValuesEntry,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.key !== "") {
      writer.uint32(10).string(message.key);
    }
    if (message.value !== undefined) {
      Value.encode(message.value, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): EmailTemplate_DynamicTemplateValuesEntry {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseEmailTemplate_DynamicTemplateValuesEntry,
    } as EmailTemplate_DynamicTemplateValuesEntry;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.key = reader.string();
          break;
        case 2:
          message.value = Value.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): EmailTemplate_DynamicTemplateValuesEntry {
    const message = {
      ...baseEmailTemplate_DynamicTemplateValuesEntry,
    } as EmailTemplate_DynamicTemplateValuesEntry;
    if (object.key !== undefined && object.key !== null) {
      message.key = String(object.key);
    }
    if (object.value !== undefined && object.value !== null) {
      message.value = Value.fromJSON(object.value);
    }
    return message;
  },

  toJSON(message: EmailTemplate_DynamicTemplateValuesEntry): unknown {
    const obj: any = {};
    message.key !== undefined && (obj.key = message.key);
    message.value !== undefined &&
      (obj.value = message.value ? Value.toJSON(message.value) : undefined);
    return obj;
  },

  fromPartial(
    object: DeepPartial<EmailTemplate_DynamicTemplateValuesEntry>
  ): EmailTemplate_DynamicTemplateValuesEntry {
    const message = {
      ...baseEmailTemplate_DynamicTemplateValuesEntry,
    } as EmailTemplate_DynamicTemplateValuesEntry;
    if (object.key !== undefined && object.key !== null) {
      message.key = object.key;
    }
    if (object.value !== undefined && object.value !== null) {
      message.value = Value.fromPartial(object.value);
    }
    return message;
  },
};

const baseEmailAttachment: object = {
  contentType: "",
  inline: false,
  fileName: "",
};

export const EmailAttachment = {
  encode(message: EmailAttachment, writer: Writer = Writer.create()): Writer {
    if (message.contentType !== "") {
      writer.uint32(10).string(message.contentType);
    }
    if (message.contentId !== undefined) {
      StringValue.encode(
        { value: message.contentId! },
        writer.uint32(18).fork()
      ).ldelim();
    }
    if (message.inline === true) {
      writer.uint32(24).bool(message.inline);
    }
    if (message.fileName !== "") {
      writer.uint32(34).string(message.fileName);
    }
    if (message.content.length !== 0) {
      writer.uint32(42).bytes(message.content);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): EmailAttachment {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseEmailAttachment } as EmailAttachment;
    message.content = Buffer.alloc(0);
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.contentType = reader.string();
          break;
        case 2:
          message.contentId = StringValue.decode(reader, reader.uint32()).value;
          break;
        case 3:
          message.inline = reader.bool();
          break;
        case 4:
          message.fileName = reader.string();
          break;
        case 5:
          message.content = reader.bytes() as Buffer;
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): EmailAttachment {
    const message = { ...baseEmailAttachment } as EmailAttachment;
    message.content = Buffer.alloc(0);
    if (object.contentType !== undefined && object.contentType !== null) {
      message.contentType = String(object.contentType);
    }
    if (object.contentId !== undefined && object.contentId !== null) {
      message.contentId = String(object.contentId);
    }
    if (object.inline !== undefined && object.inline !== null) {
      message.inline = Boolean(object.inline);
    }
    if (object.fileName !== undefined && object.fileName !== null) {
      message.fileName = String(object.fileName);
    }
    if (object.content !== undefined && object.content !== null) {
      message.content = Buffer.from(bytesFromBase64(object.content));
    }
    return message;
  },

  toJSON(message: EmailAttachment): unknown {
    const obj: any = {};
    message.contentType !== undefined &&
      (obj.contentType = message.contentType);
    message.contentId !== undefined && (obj.contentId = message.contentId);
    message.inline !== undefined && (obj.inline = message.inline);
    message.fileName !== undefined && (obj.fileName = message.fileName);
    message.content !== undefined &&
      (obj.content = base64FromBytes(
        message.content !== undefined ? message.content : Buffer.alloc(0)
      ));
    return obj;
  },

  fromPartial(object: DeepPartial<EmailAttachment>): EmailAttachment {
    const message = { ...baseEmailAttachment } as EmailAttachment;
    if (object.contentType !== undefined && object.contentType !== null) {
      message.contentType = object.contentType;
    }
    if (object.contentId !== undefined && object.contentId !== null) {
      message.contentId = object.contentId;
    }
    if (object.inline !== undefined && object.inline !== null) {
      message.inline = object.inline;
    }
    if (object.fileName !== undefined && object.fileName !== null) {
      message.fileName = object.fileName;
    }
    if (object.content !== undefined && object.content !== null) {
      message.content = object.content;
    }
    return message;
  },
};

const baseEmailMessage: object = {
  subject: "",
  textContent: "",
  htmlContent: "",
  categories: "",
};

export const EmailMessage = {
  encode(message: EmailMessage, writer: Writer = Writer.create()): Writer {
    if (message.from !== undefined) {
      Email.encode(message.from, writer.uint32(10).fork()).ldelim();
    }
    if (message.replyTo !== undefined) {
      Email.encode(message.replyTo, writer.uint32(18).fork()).ldelim();
    }
    for (const v of message.to) {
      Email.encode(v!, writer.uint32(26).fork()).ldelim();
    }
    for (const v of message.cc) {
      Email.encode(v!, writer.uint32(34).fork()).ldelim();
    }
    for (const v of message.bcc) {
      Email.encode(v!, writer.uint32(42).fork()).ldelim();
    }
    if (message.subject !== "") {
      writer.uint32(50).string(message.subject);
    }
    if (message.textContent !== "") {
      writer.uint32(58).string(message.textContent);
    }
    if (message.htmlContent !== "") {
      writer.uint32(66).string(message.htmlContent);
    }
    Object.entries(message.headers).forEach(([key, value]) => {
      EmailMessage_HeadersEntry.encode(
        { key: key as any, value },
        writer.uint32(74).fork()
      ).ldelim();
    });
    Object.entries(message.customArgs).forEach(([key, value]) => {
      EmailMessage_CustomArgsEntry.encode(
        { key: key as any, value },
        writer.uint32(90).fork()
      ).ldelim();
    });
    Object.entries(message.dynamicTemplateValues).forEach(([key, value]) => {
      EmailMessage_DynamicTemplateValuesEntry.encode(
        { key: key as any, value },
        writer.uint32(82).fork()
      ).ldelim();
    });
    for (const v of message.categories) {
      writer.uint32(98).string(v!);
    }
    for (const v of message.attachments) {
      EmailAttachment.encode(v!, writer.uint32(106).fork()).ldelim();
    }
    if (message.eventPayload !== undefined) {
      StringValue.encode(
        { value: message.eventPayload! },
        writer.uint32(114).fork()
      ).ldelim();
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): EmailMessage {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseEmailMessage } as EmailMessage;
    message.to = [];
    message.cc = [];
    message.bcc = [];
    message.headers = {};
    message.customArgs = {};
    message.dynamicTemplateValues = {};
    message.categories = [];
    message.attachments = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.from = Email.decode(reader, reader.uint32());
          break;
        case 2:
          message.replyTo = Email.decode(reader, reader.uint32());
          break;
        case 3:
          message.to.push(Email.decode(reader, reader.uint32()));
          break;
        case 4:
          message.cc.push(Email.decode(reader, reader.uint32()));
          break;
        case 5:
          message.bcc.push(Email.decode(reader, reader.uint32()));
          break;
        case 6:
          message.subject = reader.string();
          break;
        case 7:
          message.textContent = reader.string();
          break;
        case 8:
          message.htmlContent = reader.string();
          break;
        case 9:
          const entry9 = EmailMessage_HeadersEntry.decode(
            reader,
            reader.uint32()
          );
          if (entry9.value !== undefined) {
            message.headers[entry9.key] = entry9.value;
          }
          break;
        case 11:
          const entry11 = EmailMessage_CustomArgsEntry.decode(
            reader,
            reader.uint32()
          );
          if (entry11.value !== undefined) {
            message.customArgs[entry11.key] = entry11.value;
          }
          break;
        case 10:
          const entry10 = EmailMessage_DynamicTemplateValuesEntry.decode(
            reader,
            reader.uint32()
          );
          if (entry10.value !== undefined) {
            message.dynamicTemplateValues[entry10.key] = entry10.value;
          }
          break;
        case 12:
          message.categories.push(reader.string());
          break;
        case 13:
          message.attachments.push(
            EmailAttachment.decode(reader, reader.uint32())
          );
          break;
        case 14:
          message.eventPayload = StringValue.decode(
            reader,
            reader.uint32()
          ).value;
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): EmailMessage {
    const message = { ...baseEmailMessage } as EmailMessage;
    message.to = [];
    message.cc = [];
    message.bcc = [];
    message.headers = {};
    message.customArgs = {};
    message.dynamicTemplateValues = {};
    message.categories = [];
    message.attachments = [];
    if (object.from !== undefined && object.from !== null) {
      message.from = Email.fromJSON(object.from);
    }
    if (object.replyTo !== undefined && object.replyTo !== null) {
      message.replyTo = Email.fromJSON(object.replyTo);
    }
    if (object.to !== undefined && object.to !== null) {
      for (const e of object.to) {
        message.to.push(Email.fromJSON(e));
      }
    }
    if (object.cc !== undefined && object.cc !== null) {
      for (const e of object.cc) {
        message.cc.push(Email.fromJSON(e));
      }
    }
    if (object.bcc !== undefined && object.bcc !== null) {
      for (const e of object.bcc) {
        message.bcc.push(Email.fromJSON(e));
      }
    }
    if (object.subject !== undefined && object.subject !== null) {
      message.subject = String(object.subject);
    }
    if (object.textContent !== undefined && object.textContent !== null) {
      message.textContent = String(object.textContent);
    }
    if (object.htmlContent !== undefined && object.htmlContent !== null) {
      message.htmlContent = String(object.htmlContent);
    }
    if (object.headers !== undefined && object.headers !== null) {
      Object.entries(object.headers).forEach(([key, value]) => {
        message.headers[key] = String(value);
      });
    }
    if (object.customArgs !== undefined && object.customArgs !== null) {
      Object.entries(object.customArgs).forEach(([key, value]) => {
        message.customArgs[key] = String(value);
      });
    }
    if (
      object.dynamicTemplateValues !== undefined &&
      object.dynamicTemplateValues !== null
    ) {
      Object.entries(object.dynamicTemplateValues).forEach(([key, value]) => {
        message.dynamicTemplateValues[key] = Value.fromJSON(value);
      });
    }
    if (object.categories !== undefined && object.categories !== null) {
      for (const e of object.categories) {
        message.categories.push(String(e));
      }
    }
    if (object.attachments !== undefined && object.attachments !== null) {
      for (const e of object.attachments) {
        message.attachments.push(EmailAttachment.fromJSON(e));
      }
    }
    if (object.eventPayload !== undefined && object.eventPayload !== null) {
      message.eventPayload = String(object.eventPayload);
    }
    return message;
  },

  toJSON(message: EmailMessage): unknown {
    const obj: any = {};
    message.from !== undefined &&
      (obj.from = message.from ? Email.toJSON(message.from) : undefined);
    message.replyTo !== undefined &&
      (obj.replyTo = message.replyTo
        ? Email.toJSON(message.replyTo)
        : undefined);
    if (message.to) {
      obj.to = message.to.map((e) => (e ? Email.toJSON(e) : undefined));
    } else {
      obj.to = [];
    }
    if (message.cc) {
      obj.cc = message.cc.map((e) => (e ? Email.toJSON(e) : undefined));
    } else {
      obj.cc = [];
    }
    if (message.bcc) {
      obj.bcc = message.bcc.map((e) => (e ? Email.toJSON(e) : undefined));
    } else {
      obj.bcc = [];
    }
    message.subject !== undefined && (obj.subject = message.subject);
    message.textContent !== undefined &&
      (obj.textContent = message.textContent);
    message.htmlContent !== undefined &&
      (obj.htmlContent = message.htmlContent);
    obj.headers = {};
    if (message.headers) {
      Object.entries(message.headers).forEach(([k, v]) => {
        obj.headers[k] = v;
      });
    }
    obj.customArgs = {};
    if (message.customArgs) {
      Object.entries(message.customArgs).forEach(([k, v]) => {
        obj.customArgs[k] = v;
      });
    }
    obj.dynamicTemplateValues = {};
    if (message.dynamicTemplateValues) {
      Object.entries(message.dynamicTemplateValues).forEach(([k, v]) => {
        obj.dynamicTemplateValues[k] = Value.toJSON(v);
      });
    }
    if (message.categories) {
      obj.categories = message.categories.map((e) => e);
    } else {
      obj.categories = [];
    }
    if (message.attachments) {
      obj.attachments = message.attachments.map((e) =>
        e ? EmailAttachment.toJSON(e) : undefined
      );
    } else {
      obj.attachments = [];
    }
    message.eventPayload !== undefined &&
      (obj.eventPayload = message.eventPayload);
    return obj;
  },

  fromPartial(object: DeepPartial<EmailMessage>): EmailMessage {
    const message = { ...baseEmailMessage } as EmailMessage;
    message.to = [];
    message.cc = [];
    message.bcc = [];
    message.headers = {};
    message.customArgs = {};
    message.dynamicTemplateValues = {};
    message.categories = [];
    message.attachments = [];
    if (object.from !== undefined && object.from !== null) {
      message.from = Email.fromPartial(object.from);
    }
    if (object.replyTo !== undefined && object.replyTo !== null) {
      message.replyTo = Email.fromPartial(object.replyTo);
    }
    if (object.to !== undefined && object.to !== null) {
      for (const e of object.to) {
        message.to.push(Email.fromPartial(e));
      }
    }
    if (object.cc !== undefined && object.cc !== null) {
      for (const e of object.cc) {
        message.cc.push(Email.fromPartial(e));
      }
    }
    if (object.bcc !== undefined && object.bcc !== null) {
      for (const e of object.bcc) {
        message.bcc.push(Email.fromPartial(e));
      }
    }
    if (object.subject !== undefined && object.subject !== null) {
      message.subject = object.subject;
    }
    if (object.textContent !== undefined && object.textContent !== null) {
      message.textContent = object.textContent;
    }
    if (object.htmlContent !== undefined && object.htmlContent !== null) {
      message.htmlContent = object.htmlContent;
    }
    if (object.headers !== undefined && object.headers !== null) {
      Object.entries(object.headers).forEach(([key, value]) => {
        if (value !== undefined) {
          message.headers[key] = String(value);
        }
      });
    }
    if (object.customArgs !== undefined && object.customArgs !== null) {
      Object.entries(object.customArgs).forEach(([key, value]) => {
        if (value !== undefined) {
          message.customArgs[key] = String(value);
        }
      });
    }
    if (
      object.dynamicTemplateValues !== undefined &&
      object.dynamicTemplateValues !== null
    ) {
      Object.entries(object.dynamicTemplateValues).forEach(([key, value]) => {
        if (value !== undefined) {
          message.dynamicTemplateValues[key] = Value.fromPartial(value);
        }
      });
    }
    if (object.categories !== undefined && object.categories !== null) {
      for (const e of object.categories) {
        message.categories.push(e);
      }
    }
    if (object.attachments !== undefined && object.attachments !== null) {
      for (const e of object.attachments) {
        message.attachments.push(EmailAttachment.fromPartial(e));
      }
    }
    if (object.eventPayload !== undefined && object.eventPayload !== null) {
      message.eventPayload = object.eventPayload;
    }
    return message;
  },
};

const baseEmailMessage_HeadersEntry: object = { key: "", value: "" };

export const EmailMessage_HeadersEntry = {
  encode(
    message: EmailMessage_HeadersEntry,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.key !== "") {
      writer.uint32(10).string(message.key);
    }
    if (message.value !== "") {
      writer.uint32(18).string(message.value);
    }
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): EmailMessage_HeadersEntry {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseEmailMessage_HeadersEntry,
    } as EmailMessage_HeadersEntry;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.key = reader.string();
          break;
        case 2:
          message.value = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): EmailMessage_HeadersEntry {
    const message = {
      ...baseEmailMessage_HeadersEntry,
    } as EmailMessage_HeadersEntry;
    if (object.key !== undefined && object.key !== null) {
      message.key = String(object.key);
    }
    if (object.value !== undefined && object.value !== null) {
      message.value = String(object.value);
    }
    return message;
  },

  toJSON(message: EmailMessage_HeadersEntry): unknown {
    const obj: any = {};
    message.key !== undefined && (obj.key = message.key);
    message.value !== undefined && (obj.value = message.value);
    return obj;
  },

  fromPartial(
    object: DeepPartial<EmailMessage_HeadersEntry>
  ): EmailMessage_HeadersEntry {
    const message = {
      ...baseEmailMessage_HeadersEntry,
    } as EmailMessage_HeadersEntry;
    if (object.key !== undefined && object.key !== null) {
      message.key = object.key;
    }
    if (object.value !== undefined && object.value !== null) {
      message.value = object.value;
    }
    return message;
  },
};

const baseEmailMessage_CustomArgsEntry: object = { key: "", value: "" };

export const EmailMessage_CustomArgsEntry = {
  encode(
    message: EmailMessage_CustomArgsEntry,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.key !== "") {
      writer.uint32(10).string(message.key);
    }
    if (message.value !== "") {
      writer.uint32(18).string(message.value);
    }
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): EmailMessage_CustomArgsEntry {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseEmailMessage_CustomArgsEntry,
    } as EmailMessage_CustomArgsEntry;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.key = reader.string();
          break;
        case 2:
          message.value = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): EmailMessage_CustomArgsEntry {
    const message = {
      ...baseEmailMessage_CustomArgsEntry,
    } as EmailMessage_CustomArgsEntry;
    if (object.key !== undefined && object.key !== null) {
      message.key = String(object.key);
    }
    if (object.value !== undefined && object.value !== null) {
      message.value = String(object.value);
    }
    return message;
  },

  toJSON(message: EmailMessage_CustomArgsEntry): unknown {
    const obj: any = {};
    message.key !== undefined && (obj.key = message.key);
    message.value !== undefined && (obj.value = message.value);
    return obj;
  },

  fromPartial(
    object: DeepPartial<EmailMessage_CustomArgsEntry>
  ): EmailMessage_CustomArgsEntry {
    const message = {
      ...baseEmailMessage_CustomArgsEntry,
    } as EmailMessage_CustomArgsEntry;
    if (object.key !== undefined && object.key !== null) {
      message.key = object.key;
    }
    if (object.value !== undefined && object.value !== null) {
      message.value = object.value;
    }
    return message;
  },
};

const baseEmailMessage_DynamicTemplateValuesEntry: object = { key: "" };

export const EmailMessage_DynamicTemplateValuesEntry = {
  encode(
    message: EmailMessage_DynamicTemplateValuesEntry,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.key !== "") {
      writer.uint32(10).string(message.key);
    }
    if (message.value !== undefined) {
      Value.encode(message.value, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): EmailMessage_DynamicTemplateValuesEntry {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseEmailMessage_DynamicTemplateValuesEntry,
    } as EmailMessage_DynamicTemplateValuesEntry;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.key = reader.string();
          break;
        case 2:
          message.value = Value.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): EmailMessage_DynamicTemplateValuesEntry {
    const message = {
      ...baseEmailMessage_DynamicTemplateValuesEntry,
    } as EmailMessage_DynamicTemplateValuesEntry;
    if (object.key !== undefined && object.key !== null) {
      message.key = String(object.key);
    }
    if (object.value !== undefined && object.value !== null) {
      message.value = Value.fromJSON(object.value);
    }
    return message;
  },

  toJSON(message: EmailMessage_DynamicTemplateValuesEntry): unknown {
    const obj: any = {};
    message.key !== undefined && (obj.key = message.key);
    message.value !== undefined &&
      (obj.value = message.value ? Value.toJSON(message.value) : undefined);
    return obj;
  },

  fromPartial(
    object: DeepPartial<EmailMessage_DynamicTemplateValuesEntry>
  ): EmailMessage_DynamicTemplateValuesEntry {
    const message = {
      ...baseEmailMessage_DynamicTemplateValuesEntry,
    } as EmailMessage_DynamicTemplateValuesEntry;
    if (object.key !== undefined && object.key !== null) {
      message.key = object.key;
    }
    if (object.value !== undefined && object.value !== null) {
      message.value = Value.fromPartial(object.value);
    }
    return message;
  },
};

const basePasswordProviderConfig: object = {
  passwordHistory: "0",
  maximumConsecutiveFailures: "0",
};

export const PasswordProviderConfig = {
  encode(
    message: PasswordProviderConfig,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.usernamePolicy !== undefined) {
      UsernamePolicy.encode(
        message.usernamePolicy,
        writer.uint32(10).fork()
      ).ldelim();
    }
    if (message.passwordPolicy !== undefined) {
      PasswordPolicy.encode(
        message.passwordPolicy,
        writer.uint32(18).fork()
      ).ldelim();
    }
    if (message.failInterval !== undefined) {
      Duration.encode(message.failInterval, writer.uint32(26).fork()).ldelim();
    }
    if (message.minimumPasswordLifetime !== undefined) {
      Duration.encode(
        message.minimumPasswordLifetime,
        writer.uint32(34).fork()
      ).ldelim();
    }
    if (message.maximumPasswordLifetime !== undefined) {
      Duration.encode(
        message.maximumPasswordLifetime,
        writer.uint32(42).fork()
      ).ldelim();
    }
    if (message.passwordHistory !== "0") {
      writer.uint32(48).int64(message.passwordHistory);
    }
    if (message.maximumConsecutiveFailures !== "0") {
      writer.uint32(56).int64(message.maximumConsecutiveFailures);
    }
    if (message.lockoutTime !== undefined) {
      Duration.encode(message.lockoutTime, writer.uint32(66).fork()).ldelim();
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): PasswordProviderConfig {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...basePasswordProviderConfig } as PasswordProviderConfig;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.usernamePolicy = UsernamePolicy.decode(
            reader,
            reader.uint32()
          );
          break;
        case 2:
          message.passwordPolicy = PasswordPolicy.decode(
            reader,
            reader.uint32()
          );
          break;
        case 3:
          message.failInterval = Duration.decode(reader, reader.uint32());
          break;
        case 4:
          message.minimumPasswordLifetime = Duration.decode(
            reader,
            reader.uint32()
          );
          break;
        case 5:
          message.maximumPasswordLifetime = Duration.decode(
            reader,
            reader.uint32()
          );
          break;
        case 6:
          message.passwordHistory = longToString(reader.int64() as Long);
          break;
        case 7:
          message.maximumConsecutiveFailures = longToString(
            reader.int64() as Long
          );
          break;
        case 8:
          message.lockoutTime = Duration.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): PasswordProviderConfig {
    const message = { ...basePasswordProviderConfig } as PasswordProviderConfig;
    if (object.usernamePolicy !== undefined && object.usernamePolicy !== null) {
      message.usernamePolicy = UsernamePolicy.fromJSON(object.usernamePolicy);
    }
    if (object.passwordPolicy !== undefined && object.passwordPolicy !== null) {
      message.passwordPolicy = PasswordPolicy.fromJSON(object.passwordPolicy);
    }
    if (object.failInterval !== undefined && object.failInterval !== null) {
      message.failInterval = Duration.fromJSON(object.failInterval);
    }
    if (
      object.minimumPasswordLifetime !== undefined &&
      object.minimumPasswordLifetime !== null
    ) {
      message.minimumPasswordLifetime = Duration.fromJSON(
        object.minimumPasswordLifetime
      );
    }
    if (
      object.maximumPasswordLifetime !== undefined &&
      object.maximumPasswordLifetime !== null
    ) {
      message.maximumPasswordLifetime = Duration.fromJSON(
        object.maximumPasswordLifetime
      );
    }
    if (
      object.passwordHistory !== undefined &&
      object.passwordHistory !== null
    ) {
      message.passwordHistory = String(object.passwordHistory);
    }
    if (
      object.maximumConsecutiveFailures !== undefined &&
      object.maximumConsecutiveFailures !== null
    ) {
      message.maximumConsecutiveFailures = String(
        object.maximumConsecutiveFailures
      );
    }
    if (object.lockoutTime !== undefined && object.lockoutTime !== null) {
      message.lockoutTime = Duration.fromJSON(object.lockoutTime);
    }
    return message;
  },

  toJSON(message: PasswordProviderConfig): unknown {
    const obj: any = {};
    message.usernamePolicy !== undefined &&
      (obj.usernamePolicy = message.usernamePolicy
        ? UsernamePolicy.toJSON(message.usernamePolicy)
        : undefined);
    message.passwordPolicy !== undefined &&
      (obj.passwordPolicy = message.passwordPolicy
        ? PasswordPolicy.toJSON(message.passwordPolicy)
        : undefined);
    message.failInterval !== undefined &&
      (obj.failInterval = message.failInterval
        ? Duration.toJSON(message.failInterval)
        : undefined);
    message.minimumPasswordLifetime !== undefined &&
      (obj.minimumPasswordLifetime = message.minimumPasswordLifetime
        ? Duration.toJSON(message.minimumPasswordLifetime)
        : undefined);
    message.maximumPasswordLifetime !== undefined &&
      (obj.maximumPasswordLifetime = message.maximumPasswordLifetime
        ? Duration.toJSON(message.maximumPasswordLifetime)
        : undefined);
    message.passwordHistory !== undefined &&
      (obj.passwordHistory = message.passwordHistory);
    message.maximumConsecutiveFailures !== undefined &&
      (obj.maximumConsecutiveFailures = message.maximumConsecutiveFailures);
    message.lockoutTime !== undefined &&
      (obj.lockoutTime = message.lockoutTime
        ? Duration.toJSON(message.lockoutTime)
        : undefined);
    return obj;
  },

  fromPartial(
    object: DeepPartial<PasswordProviderConfig>
  ): PasswordProviderConfig {
    const message = { ...basePasswordProviderConfig } as PasswordProviderConfig;
    if (object.usernamePolicy !== undefined && object.usernamePolicy !== null) {
      message.usernamePolicy = UsernamePolicy.fromPartial(
        object.usernamePolicy
      );
    }
    if (object.passwordPolicy !== undefined && object.passwordPolicy !== null) {
      message.passwordPolicy = PasswordPolicy.fromPartial(
        object.passwordPolicy
      );
    }
    if (object.failInterval !== undefined && object.failInterval !== null) {
      message.failInterval = Duration.fromPartial(object.failInterval);
    }
    if (
      object.minimumPasswordLifetime !== undefined &&
      object.minimumPasswordLifetime !== null
    ) {
      message.minimumPasswordLifetime = Duration.fromPartial(
        object.minimumPasswordLifetime
      );
    }
    if (
      object.maximumPasswordLifetime !== undefined &&
      object.maximumPasswordLifetime !== null
    ) {
      message.maximumPasswordLifetime = Duration.fromPartial(
        object.maximumPasswordLifetime
      );
    }
    if (
      object.passwordHistory !== undefined &&
      object.passwordHistory !== null
    ) {
      message.passwordHistory = object.passwordHistory;
    }
    if (
      object.maximumConsecutiveFailures !== undefined &&
      object.maximumConsecutiveFailures !== null
    ) {
      message.maximumConsecutiveFailures = object.maximumConsecutiveFailures;
    }
    if (object.lockoutTime !== undefined && object.lockoutTime !== null) {
      message.lockoutTime = Duration.fromPartial(object.lockoutTime);
    }
    return message;
  },
};

const baseUsernamePolicy: object = {
  validEmail: false,
  verifyEmail: false,
  allowedEmailDomains: "",
  exclusiveEmailDomains: "",
};

export const UsernamePolicy = {
  encode(message: UsernamePolicy, writer: Writer = Writer.create()): Writer {
    if (message.validEmail === true) {
      writer.uint32(8).bool(message.validEmail);
    }
    if (message.verifyEmail === true) {
      writer.uint32(16).bool(message.verifyEmail);
    }
    for (const v of message.allowedEmailDomains) {
      writer.uint32(26).string(v!);
    }
    for (const v of message.exclusiveEmailDomains) {
      writer.uint32(34).string(v!);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): UsernamePolicy {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseUsernamePolicy } as UsernamePolicy;
    message.allowedEmailDomains = [];
    message.exclusiveEmailDomains = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.validEmail = reader.bool();
          break;
        case 2:
          message.verifyEmail = reader.bool();
          break;
        case 3:
          message.allowedEmailDomains.push(reader.string());
          break;
        case 4:
          message.exclusiveEmailDomains.push(reader.string());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): UsernamePolicy {
    const message = { ...baseUsernamePolicy } as UsernamePolicy;
    message.allowedEmailDomains = [];
    message.exclusiveEmailDomains = [];
    if (object.validEmail !== undefined && object.validEmail !== null) {
      message.validEmail = Boolean(object.validEmail);
    }
    if (object.verifyEmail !== undefined && object.verifyEmail !== null) {
      message.verifyEmail = Boolean(object.verifyEmail);
    }
    if (
      object.allowedEmailDomains !== undefined &&
      object.allowedEmailDomains !== null
    ) {
      for (const e of object.allowedEmailDomains) {
        message.allowedEmailDomains.push(String(e));
      }
    }
    if (
      object.exclusiveEmailDomains !== undefined &&
      object.exclusiveEmailDomains !== null
    ) {
      for (const e of object.exclusiveEmailDomains) {
        message.exclusiveEmailDomains.push(String(e));
      }
    }
    return message;
  },

  toJSON(message: UsernamePolicy): unknown {
    const obj: any = {};
    message.validEmail !== undefined && (obj.validEmail = message.validEmail);
    message.verifyEmail !== undefined &&
      (obj.verifyEmail = message.verifyEmail);
    if (message.allowedEmailDomains) {
      obj.allowedEmailDomains = message.allowedEmailDomains.map((e) => e);
    } else {
      obj.allowedEmailDomains = [];
    }
    if (message.exclusiveEmailDomains) {
      obj.exclusiveEmailDomains = message.exclusiveEmailDomains.map((e) => e);
    } else {
      obj.exclusiveEmailDomains = [];
    }
    return obj;
  },

  fromPartial(object: DeepPartial<UsernamePolicy>): UsernamePolicy {
    const message = { ...baseUsernamePolicy } as UsernamePolicy;
    message.allowedEmailDomains = [];
    message.exclusiveEmailDomains = [];
    if (object.validEmail !== undefined && object.validEmail !== null) {
      message.validEmail = object.validEmail;
    }
    if (object.verifyEmail !== undefined && object.verifyEmail !== null) {
      message.verifyEmail = object.verifyEmail;
    }
    if (
      object.allowedEmailDomains !== undefined &&
      object.allowedEmailDomains !== null
    ) {
      for (const e of object.allowedEmailDomains) {
        message.allowedEmailDomains.push(e);
      }
    }
    if (
      object.exclusiveEmailDomains !== undefined &&
      object.exclusiveEmailDomains !== null
    ) {
      for (const e of object.exclusiveEmailDomains) {
        message.exclusiveEmailDomains.push(e);
      }
    }
    return message;
  },
};

const basePasswordPolicy: object = { template: 0 };

export const PasswordPolicy = {
  encode(message: PasswordPolicy, writer: Writer = Writer.create()): Writer {
    if (message.template !== 0) {
      writer.uint32(8).int32(message.template);
    }
    if (message.minimumLength !== undefined) {
      Int64Value.encode(
        { value: message.minimumLength! },
        writer.uint32(18).fork()
      ).ldelim();
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): PasswordPolicy {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...basePasswordPolicy } as PasswordPolicy;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.template = reader.int32() as any;
          break;
        case 2:
          message.minimumLength = Int64Value.decode(
            reader,
            reader.uint32()
          ).value;
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): PasswordPolicy {
    const message = { ...basePasswordPolicy } as PasswordPolicy;
    if (object.template !== undefined && object.template !== null) {
      message.template = passwordPolicyTemplateFromJSON(object.template);
    }
    if (object.minimumLength !== undefined && object.minimumLength !== null) {
      message.minimumLength = String(object.minimumLength);
    }
    return message;
  },

  toJSON(message: PasswordPolicy): unknown {
    const obj: any = {};
    message.template !== undefined &&
      (obj.template = passwordPolicyTemplateToJSON(message.template));
    message.minimumLength !== undefined &&
      (obj.minimumLength = message.minimumLength);
    return obj;
  },

  fromPartial(object: DeepPartial<PasswordPolicy>): PasswordPolicy {
    const message = { ...basePasswordPolicy } as PasswordPolicy;
    if (object.template !== undefined && object.template !== null) {
      message.template = object.template;
    }
    if (object.minimumLength !== undefined && object.minimumLength !== null) {
      message.minimumLength = object.minimumLength;
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
