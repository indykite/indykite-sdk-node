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
  Customer,
  ApplicationSpace,
  Application,
  ApplicationAgent,
  ApplicationAgentCredential,
  Tenant,
  ConfigNode,
  OAuth2ProviderConfig,
  OAuth2Provider,
  OAuth2ApplicationConfig,
  OAuth2Application,
  UniqueNameIdentifier,
  AuthFlowConfig,
  EmailServiceConfig,
  SMSServiceConfig,
  OAuth2ClientConfig,
  PasswordProviderConfig,
  WebAuthnProviderConfig,
  AuthenteqProviderConfig,
  SAFRProviderConfig,
} from "../../../indykite/config/v1beta1/model";
import { Timestamp } from "../../../google/protobuf/timestamp";
import { StringValue } from "../../../google/protobuf/wrappers";

export const protobufPackage = "indykite.config.v1beta1";

export interface ReadCustomerRequest {
  identifier?: { $case: "id"; id: string } | { $case: "name"; name: string };
}

export interface ReadCustomerResponse {
  customer?: Customer;
}

/** The request message containing the ApplicationSpace's name. */
export interface CreateApplicationSpaceRequest {
  /** CustomerId associated with the request. */
  customerId: string;
  /** Name is unique and immutable name. It's not globally unique only unique in scope. */
  name: string;
  /** DisplayName is a human readable name. */
  displayName?: string;
  /** Description is a optional description */
  description?: string;
}

export interface CreateApplicationSpaceResponse {
  /** Globally unique identifier. */
  id: string;
  /** Output only. The time at which the configuration was created. */
  createTime?: Date;
  /**
   * Output only. The time at which the configuration was last changed.
   *
   * This value is initially set to the `create_time` then increases monotonically with each change.
   */
  updateTime?: Date;
  /** Output only. Multiversion concurrency control version. */
  etag: string;
}

export interface ReadApplicationSpaceRequest {
  identifier?:
    | { $case: "id"; id: string }
    | { $case: "name"; name: UniqueNameIdentifier };
}

export interface ReadApplicationSpaceResponse {
  appSpace?: ApplicationSpace;
}

export interface ListApplicationSpacesRequest {
  /** Globally unique identifier. */
  customerId: string;
  /** Match documents with exact name search */
  match: string[];
}

export interface ListApplicationSpacesResponse {
  appSpace?: ApplicationSpace;
}

export interface UpdateApplicationSpaceRequest {
  /** Globally unique identifier. */
  id: string;
  etag?: string;
  /** DisplayName is a human readable name. */
  displayName?: string;
  /** Description is a optional description */
  description?: string;
}

export interface UpdateApplicationSpaceResponse {
  /** Globally unique identifier. */
  id: string;
  /** This value is initially set to the `create_time` then increases monotonically with each change. */
  updateTime?: Date;
  /** Output only. Multiversion concurrency control version. */
  etag: string;
}

export interface DeleteApplicationSpaceRequest {
  /** Id is the Globally unique identifier of object to delete. */
  id: string;
  etag?: string;
}

export interface DeleteApplicationSpaceResponse {}

/** The request message containing the Application's name. */
export interface CreateApplicationRequest {
  /** ApplicationSpaceId defines the parent container identifier. */
  appSpaceId: string;
  /** Name is unique and immutable name. It's not globally unique only unique in scope. */
  name: string;
  /** DisplayName is a human readable name. */
  displayName?: string;
  /** Description is a optional description */
  description?: string;
}

export interface CreateApplicationResponse {
  /** Globally unique identifier. */
  id: string;
  /** Output only. The time at which the configuration was created. */
  createTime?: Date;
  /**
   * Output only. The time at which the configuration was last changed.
   *
   * This value is initially set to the `create_time` then increases monotonically with each change.
   */
  updateTime?: Date;
  /** Output only. Multiversion concurrency control version. */
  etag: string;
}

export interface ReadApplicationRequest {
  identifier?:
    | { $case: "id"; id: string }
    | { $case: "name"; name: UniqueNameIdentifier };
}

export interface ReadApplicationResponse {
  application?: Application;
}

export interface ListApplicationsRequest {
  /** Globally unique identifier. */
  appSpaceId: string;
  /** Match documents with exact name search */
  match: string[];
}

export interface ListApplicationsResponse {
  application?: Application;
}

export interface UpdateApplicationRequest {
  /** Globally unique identifier. */
  id: string;
  etag?: string;
  /** DisplayName is a human readable name. */
  displayName?: string;
  /** Description is a optional description */
  description?: string;
}

export interface UpdateApplicationResponse {
  /** Globally unique identifier. */
  id: string;
  /**
   * Output only. The time at which the configuration was last changed.
   *
   * This value is initially set to the `create_time` then increases monotonically with each change.
   */
  updateTime?: Date;
  /** Output only. Multiversion concurrency control version. */
  etag: string;
}

export interface DeleteApplicationRequest {
  /** Id is the Globally unique identifier of object to delete. */
  id: string;
  etag?: string;
}

export interface DeleteApplicationResponse {}

/** The request message containing the Application's name. */
export interface CreateApplicationAgentRequest {
  /** ApplicationId is the Parent Application ID. */
  applicationId: string;
  /** Name is unique and immutable name. It's not globally unique only unique in scope. */
  name: string;
  /** Human readable name of ApplicationAgent. */
  displayName?: string;
  /** Description of ApplicationAgent. */
  description?: string;
}

export interface CreateApplicationAgentResponse {
  /** Globally unique identifier. */
  id: string;
  /** Output only. The time at which the configuration was created. */
  createTime?: Date;
  /**
   * Output only. The time at which the configuration was last changed.
   *
   * This value is initially set to the `create_time` then increases monotonically with each change.
   */
  updateTime?: Date;
  /** Output only. Multiversion concurrency control version. */
  etag: string;
}

export interface ReadApplicationAgentRequest {
  identifier?:
    | { $case: "id"; id: string }
    | { $case: "name"; name: UniqueNameIdentifier };
}

export interface ReadApplicationAgentResponse {
  applicationAgent?: ApplicationAgent;
}

export interface ListApplicationAgentsRequest {
  /** Globally unique identifier. */
  appSpaceId: string;
  /** Match documents with exact name search */
  match: string[];
}

export interface ListApplicationAgentsResponse {
  applicationAgent?: ApplicationAgent;
}

export interface UpdateApplicationAgentRequest {
  /** Globally unique identifier. */
  id: string;
  etag?: string;
  /** DisplayName is a human readable name. */
  displayName?: string;
  /** Description is a optional description */
  description?: string;
}

export interface UpdateApplicationAgentResponse {
  /** Globally unique identifier. */
  id: string;
  /**
   * Output only. The time at which the configuration was last changed.
   *
   * This value is initially set to the `create_time` then increases monotonically with each change.
   */
  updateTime?: Date;
  /** Output only. Multiversion concurrency control version. */
  etag: string;
}

export interface DeleteApplicationAgentRequest {
  /** Id is the Globally unique identifier of object to delete. */
  id: string;
  etag?: string;
}

export interface DeleteApplicationAgentResponse {}

export interface RegisterApplicationAgentCredentialRequest {
  applicationAgentId: string;
  displayName: string;
  publicKey?: { $case: "jwk"; jwk: Buffer } | { $case: "pem"; pem: Buffer };
  expireTime?: Date;
  defaultTenantId: string;
}

export interface RegisterApplicationAgentCredentialResponse {
  id: string;
  applicationAgentId: string;
  kid: string;
  agentConfig: Buffer;
  createTime?: Date;
  expireTime?: Date;
}

export interface ReadApplicationAgentCredentialRequest {
  /** Id contains the Globally Unique Identifier of the object with server generated id. */
  id: string;
}

export interface ReadApplicationAgentCredentialResponse {
  applicationAgentCredential?: ApplicationAgentCredential;
}

export interface DeleteApplicationAgentCredentialRequest {
  /** Id is the Globally unique identifier of object to delete. */
  id: string;
}

export interface DeleteApplicationAgentCredentialResponse {}

/** The request message containing the tenant's name. */
export interface CreateTenantRequest {
  /** IssuerId defines the parent container identifier. */
  issuerId: string;
  /** Name is unique and immutable name. It's not globally unique only unique in scope. */
  name: string;
  /** DisplayName is a human readable name. */
  displayName?: string;
  /** Description is a optional description */
  description?: string;
}

export interface CreateTenantResponse {
  /** Globally unique identifier. */
  id: string;
  /** Output only. The time at which the configuration was created. */
  createTime?: Date;
  /**
   * Output only. The time at which the configuration was last changed.
   *
   * This value is initially set to the `create_time` then increases monotonically with each change.
   */
  updateTime?: Date;
  /** Output only. Multiversion concurrency control version. */
  etag: string;
}

export interface ReadTenantRequest {
  identifier?:
    | { $case: "id"; id: string }
    | { $case: "name"; name: UniqueNameIdentifier };
}

export interface ReadTenantResponse {
  tenant?: Tenant;
}

export interface ListTenantsRequest {
  /** Globally unique identifier. */
  appSpaceId: string;
  /** Match documents with exact name search */
  match: string[];
}

export interface ListTenantsResponse {
  tenant?: Tenant;
}

export interface UpdateTenantRequest {
  /** Globally unique identifier. */
  id: string;
  etag?: string;
  /** DisplayName is a human readable name. */
  displayName?: string;
  /** Description is a optional description */
  description?: string;
}

export interface UpdateTenantResponse {
  /** Globally unique identifier. */
  id: string;
  /**
   * Output only. The time at which the configuration was last changed.
   *
   * This value is initially set to the `create_time` then increases monotonically with each change.
   */
  updateTime?: Date;
  /** Output only. Multiversion concurrency control version. */
  etag: string;
}

export interface DeleteTenantRequest {
  /** Id is the Globally unique identifier of object to delete. */
  id: string;
  etag?: string;
}

export interface DeleteTenantResponse {}

/** CreateConfigNodeRequest represents a request to create a new Configuration object. */
export interface CreateConfigNodeRequest {
  /** Location is the place where configuration object is created and associated with. */
  location: string;
  /** Name is unique and immutable name. It's not globally unique only unique in scope. */
  name: string;
  /** DisplayName is a human readable name. */
  displayName?: string;
  /** Description is a optional description. */
  description?: string;
  config?:
    | { $case: "authFlowConfig"; authFlowConfig: AuthFlowConfig }
    | { $case: "emailServiceConfig"; emailServiceConfig: EmailServiceConfig }
    | { $case: "smsServiceConfig"; smsServiceConfig: SMSServiceConfig }
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

/** CreateConfigNodeResponse represents a result of operation request. */
export interface CreateConfigNodeResponse {
  /** Globally unique identifier. */
  id: string;
  /** Output only. The time at which the configuration was created. */
  createTime?: Date;
  /**
   * Output only. The time at which the configuration was last changed.
   *
   * This value is initially set to the `create_time` then increases monotonically with each change.
   */
  updateTime?: Date;
  /** Output only. Multiversion concurrency control version. */
  etag: string;
}

/** ReadConfigNodeRequest represents a request to find a new Configuration object. */
export interface ReadConfigNodeRequest {
  id: string;
}

/** ReadConfigNodeResponse represents a result of operation request. */
export interface ReadConfigNodeResponse {
  configNode?: ConfigNode;
}

/** UpdateConfigNodeRequest represents a request to update a Configuration object. */
export interface UpdateConfigNodeRequest {
  /** Globally unique identifier. */
  id: string;
  etag?: string;
  /** DisplayName is a human readable name. */
  displayName?: string;
  /** Description is a optional description. */
  description?: string;
  config?:
    | { $case: "authFlowConfig"; authFlowConfig: AuthFlowConfig }
    | { $case: "emailServiceConfig"; emailServiceConfig: EmailServiceConfig }
    | { $case: "smsServiceConfig"; smsServiceConfig: SMSServiceConfig }
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

/** UpdateConfigNodeResponse represents a result of operation request. */
export interface UpdateConfigNodeResponse {
  /** Globally unique identifier. */
  id: string;
  /**
   * Output only. The time at which the configuration was last changed.
   *
   * This value is initially set to the `create_time` then increases monotonically with each change.
   */
  updateTime?: Date;
  /** Output only. Multiversion concurrency control version. */
  etag: string;
}

/** DeleteConfigNodeRequest represents a request to delete a Configuration object. */
export interface DeleteConfigNodeRequest {
  /** Globally unique identifier. */
  id: string;
  etag?: string;
}

export interface DeleteConfigNodeResponse {}

/** CreateOAuth2ProviderRequest represents a request to create a new Configuration object. */
export interface CreateOAuth2ProviderRequest {
  /** AppSpaceId is the place where configuration object is created and associated with. */
  appSpaceId: string;
  /** Name is unique and immutable name. It's not globally unique only unique in scope. */
  name: string;
  /** DisplayName is a human readable name. */
  displayName?: string;
  /** Description is a optional description. */
  description?: string;
  config?: OAuth2ProviderConfig;
}

/** CreateOAuth2ProviderResponse represents a result of operation request. */
export interface CreateOAuth2ProviderResponse {
  /** Globally unique identifier. */
  id: string;
  /** Output only. The time at which the configuration was created. */
  createTime?: Date;
  /**
   * Output only. The time at which the configuration was last changed.
   *
   * This value is initially set to the `create_time` then increases monotonically with each change.
   */
  updateTime?: Date;
  /** Output only. Multiversion concurrency control version. */
  etag: string;
}

/** ReadOAuth2ProviderRequest represents a request to find a new Configuration object. */
export interface ReadOAuth2ProviderRequest {
  id: string;
}

/** ReadOAuth2ProviderResponse represents a result of operation request. */
export interface ReadOAuth2ProviderResponse {
  oauth2Provider?: OAuth2Provider;
}

/** UpdateOAuth2ProviderRequest represents a request to update a Configuration object. */
export interface UpdateOAuth2ProviderRequest {
  /** Globally unique identifier. */
  id: string;
  etag?: string;
  /** DisplayName is a human readable name. */
  displayName?: string;
  /** Description is a optional description. */
  description?: string;
  config?: OAuth2ProviderConfig;
}

/** UpdateOAuth2ProviderResponse represents a result of operation request. */
export interface UpdateOAuth2ProviderResponse {
  /** Globally unique identifier. */
  id: string;
  /**
   * Output only. The time at which the configuration was last changed.
   *
   * This value is initially set to the `create_time` then increases monotonically with each change.
   */
  updateTime?: Date;
  /** Output only. Multiversion concurrency control version. */
  etag: string;
}

/** DeleteOAuth2ProviderRequest represents a request to delete a Configuration object. */
export interface DeleteOAuth2ProviderRequest {
  /** Globally unique identifier. */
  id: string;
  etag?: string;
}

export interface DeleteOAuth2ProviderResponse {}

/** CreateOAuth2ApplicationRequest represents a request to create a new Configuration object. */
export interface CreateOAuth2ApplicationRequest {
  /** Oauth2ProviderId is the place where configuration object is created and associated with. */
  oauth2ProviderId: string;
  /** Name is unique and immutable name. It's not globally unique only unique in scope. */
  name: string;
  /** DisplayName is a human readable name. */
  displayName?: string;
  /** Description is a optional description. */
  description?: string;
  config?: OAuth2ApplicationConfig;
}

/** CreateOAuth2ApplicationResponse represents a result of operation request. */
export interface CreateOAuth2ApplicationResponse {
  /** Globally unique identifier. */
  id: string;
  /** Output only. The time at which the configuration was created. */
  createTime?: Date;
  /**
   * Output only. The time at which the configuration was last changed.
   *
   * This value is initially set to the `create_time` then increases monotonically with each change.
   */
  updateTime?: Date;
  /** Output only. Multiversion concurrency control version. */
  etag: string;
  clientId: string;
  /**
   * ClientSecret is the client's secret. The secret will be included in the create request as cleartext, and then
   * never again. The secret is stored using BCrypt so it is impossible to recover it. Tell your users
   * that they need to write the secret down as it will not be made available again.
   */
  clientSecret: string;
}

/** ReadOAuth2ApplicationRequest represents a request to find a new Configuration object. */
export interface ReadOAuth2ApplicationRequest {
  id: string;
}

/** ReadOAuth2ApplicationResponse represents a result of operation request. */
export interface ReadOAuth2ApplicationResponse {
  oauth2Application?: OAuth2Application;
}

/** UpdateOAuth2ApplicationRequest represents a request to update a Configuration object. */
export interface UpdateOAuth2ApplicationRequest {
  /** Globally unique identifier. */
  id: string;
  etag?: string;
  /** DisplayName is a human readable name. */
  displayName?: string;
  /** Description is a optional description. */
  description?: string;
  config?: OAuth2ApplicationConfig;
}

/** UpdateOAuth2ApplicationResponse represents a result of operation request. */
export interface UpdateOAuth2ApplicationResponse {
  /** Globally unique identifier. */
  id: string;
  /**
   * Output only. The time at which the configuration was last changed.
   *
   * This value is initially set to the `create_time` then increases monotonically with each change.
   */
  updateTime?: Date;
  /** Output only. Multiversion concurrency control version. */
  etag: string;
}

/** DeleteOAuth2ApplicationRequest represents a request to delete a Configuration object. */
export interface DeleteOAuth2ApplicationRequest {
  /** Globally unique identifier. */
  id: string;
  etag?: string;
}

export interface DeleteOAuth2ApplicationResponse {}

const baseReadCustomerRequest: object = {};

export const ReadCustomerRequest = {
  encode(
    message: ReadCustomerRequest,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.identifier?.$case === "id") {
      writer.uint32(10).string(message.identifier.id);
    }
    if (message.identifier?.$case === "name") {
      writer.uint32(18).string(message.identifier.name);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): ReadCustomerRequest {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseReadCustomerRequest } as ReadCustomerRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.identifier = { $case: "id", id: reader.string() };
          break;
        case 2:
          message.identifier = { $case: "name", name: reader.string() };
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ReadCustomerRequest {
    const message = { ...baseReadCustomerRequest } as ReadCustomerRequest;
    if (object.id !== undefined && object.id !== null) {
      message.identifier = { $case: "id", id: String(object.id) };
    }
    if (object.name !== undefined && object.name !== null) {
      message.identifier = { $case: "name", name: String(object.name) };
    }
    return message;
  },

  toJSON(message: ReadCustomerRequest): unknown {
    const obj: any = {};
    message.identifier?.$case === "id" && (obj.id = message.identifier?.id);
    message.identifier?.$case === "name" &&
      (obj.name = message.identifier?.name);
    return obj;
  },

  fromPartial(object: DeepPartial<ReadCustomerRequest>): ReadCustomerRequest {
    const message = { ...baseReadCustomerRequest } as ReadCustomerRequest;
    if (
      object.identifier?.$case === "id" &&
      object.identifier?.id !== undefined &&
      object.identifier?.id !== null
    ) {
      message.identifier = { $case: "id", id: object.identifier.id };
    }
    if (
      object.identifier?.$case === "name" &&
      object.identifier?.name !== undefined &&
      object.identifier?.name !== null
    ) {
      message.identifier = { $case: "name", name: object.identifier.name };
    }
    return message;
  },
};

const baseReadCustomerResponse: object = {};

export const ReadCustomerResponse = {
  encode(
    message: ReadCustomerResponse,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.customer !== undefined) {
      Customer.encode(message.customer, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): ReadCustomerResponse {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseReadCustomerResponse } as ReadCustomerResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.customer = Customer.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ReadCustomerResponse {
    const message = { ...baseReadCustomerResponse } as ReadCustomerResponse;
    if (object.customer !== undefined && object.customer !== null) {
      message.customer = Customer.fromJSON(object.customer);
    }
    return message;
  },

  toJSON(message: ReadCustomerResponse): unknown {
    const obj: any = {};
    message.customer !== undefined &&
      (obj.customer = message.customer
        ? Customer.toJSON(message.customer)
        : undefined);
    return obj;
  },

  fromPartial(object: DeepPartial<ReadCustomerResponse>): ReadCustomerResponse {
    const message = { ...baseReadCustomerResponse } as ReadCustomerResponse;
    if (object.customer !== undefined && object.customer !== null) {
      message.customer = Customer.fromPartial(object.customer);
    }
    return message;
  },
};

const baseCreateApplicationSpaceRequest: object = { customerId: "", name: "" };

export const CreateApplicationSpaceRequest = {
  encode(
    message: CreateApplicationSpaceRequest,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.customerId !== "") {
      writer.uint32(10).string(message.customerId);
    }
    if (message.name !== "") {
      writer.uint32(18).string(message.name);
    }
    if (message.displayName !== undefined) {
      StringValue.encode(
        { value: message.displayName! },
        writer.uint32(26).fork()
      ).ldelim();
    }
    if (message.description !== undefined) {
      StringValue.encode(
        { value: message.description! },
        writer.uint32(34).fork()
      ).ldelim();
    }
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): CreateApplicationSpaceRequest {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseCreateApplicationSpaceRequest,
    } as CreateApplicationSpaceRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.customerId = reader.string();
          break;
        case 2:
          message.name = reader.string();
          break;
        case 3:
          message.displayName = StringValue.decode(
            reader,
            reader.uint32()
          ).value;
          break;
        case 4:
          message.description = StringValue.decode(
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

  fromJSON(object: any): CreateApplicationSpaceRequest {
    const message = {
      ...baseCreateApplicationSpaceRequest,
    } as CreateApplicationSpaceRequest;
    if (object.customerId !== undefined && object.customerId !== null) {
      message.customerId = String(object.customerId);
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
    return message;
  },

  toJSON(message: CreateApplicationSpaceRequest): unknown {
    const obj: any = {};
    message.customerId !== undefined && (obj.customerId = message.customerId);
    message.name !== undefined && (obj.name = message.name);
    message.displayName !== undefined &&
      (obj.displayName = message.displayName);
    message.description !== undefined &&
      (obj.description = message.description);
    return obj;
  },

  fromPartial(
    object: DeepPartial<CreateApplicationSpaceRequest>
  ): CreateApplicationSpaceRequest {
    const message = {
      ...baseCreateApplicationSpaceRequest,
    } as CreateApplicationSpaceRequest;
    if (object.customerId !== undefined && object.customerId !== null) {
      message.customerId = object.customerId;
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
    return message;
  },
};

const baseCreateApplicationSpaceResponse: object = { id: "", etag: "" };

export const CreateApplicationSpaceResponse = {
  encode(
    message: CreateApplicationSpaceResponse,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.createTime !== undefined) {
      Timestamp.encode(
        toTimestamp(message.createTime),
        writer.uint32(18).fork()
      ).ldelim();
    }
    if (message.updateTime !== undefined) {
      Timestamp.encode(
        toTimestamp(message.updateTime),
        writer.uint32(26).fork()
      ).ldelim();
    }
    if (message.etag !== "") {
      writer.uint32(34).string(message.etag);
    }
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): CreateApplicationSpaceResponse {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseCreateApplicationSpaceResponse,
    } as CreateApplicationSpaceResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string();
          break;
        case 2:
          message.createTime = fromTimestamp(
            Timestamp.decode(reader, reader.uint32())
          );
          break;
        case 3:
          message.updateTime = fromTimestamp(
            Timestamp.decode(reader, reader.uint32())
          );
          break;
        case 4:
          message.etag = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): CreateApplicationSpaceResponse {
    const message = {
      ...baseCreateApplicationSpaceResponse,
    } as CreateApplicationSpaceResponse;
    if (object.id !== undefined && object.id !== null) {
      message.id = String(object.id);
    }
    if (object.createTime !== undefined && object.createTime !== null) {
      message.createTime = fromJsonTimestamp(object.createTime);
    }
    if (object.updateTime !== undefined && object.updateTime !== null) {
      message.updateTime = fromJsonTimestamp(object.updateTime);
    }
    if (object.etag !== undefined && object.etag !== null) {
      message.etag = String(object.etag);
    }
    return message;
  },

  toJSON(message: CreateApplicationSpaceResponse): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    message.createTime !== undefined &&
      (obj.createTime = message.createTime.toISOString());
    message.updateTime !== undefined &&
      (obj.updateTime = message.updateTime.toISOString());
    message.etag !== undefined && (obj.etag = message.etag);
    return obj;
  },

  fromPartial(
    object: DeepPartial<CreateApplicationSpaceResponse>
  ): CreateApplicationSpaceResponse {
    const message = {
      ...baseCreateApplicationSpaceResponse,
    } as CreateApplicationSpaceResponse;
    if (object.id !== undefined && object.id !== null) {
      message.id = object.id;
    }
    if (object.createTime !== undefined && object.createTime !== null) {
      message.createTime = object.createTime;
    }
    if (object.updateTime !== undefined && object.updateTime !== null) {
      message.updateTime = object.updateTime;
    }
    if (object.etag !== undefined && object.etag !== null) {
      message.etag = object.etag;
    }
    return message;
  },
};

const baseReadApplicationSpaceRequest: object = {};

export const ReadApplicationSpaceRequest = {
  encode(
    message: ReadApplicationSpaceRequest,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.identifier?.$case === "id") {
      writer.uint32(10).string(message.identifier.id);
    }
    if (message.identifier?.$case === "name") {
      UniqueNameIdentifier.encode(
        message.identifier.name,
        writer.uint32(18).fork()
      ).ldelim();
    }
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): ReadApplicationSpaceRequest {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseReadApplicationSpaceRequest,
    } as ReadApplicationSpaceRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.identifier = { $case: "id", id: reader.string() };
          break;
        case 2:
          message.identifier = {
            $case: "name",
            name: UniqueNameIdentifier.decode(reader, reader.uint32()),
          };
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ReadApplicationSpaceRequest {
    const message = {
      ...baseReadApplicationSpaceRequest,
    } as ReadApplicationSpaceRequest;
    if (object.id !== undefined && object.id !== null) {
      message.identifier = { $case: "id", id: String(object.id) };
    }
    if (object.name !== undefined && object.name !== null) {
      message.identifier = {
        $case: "name",
        name: UniqueNameIdentifier.fromJSON(object.name),
      };
    }
    return message;
  },

  toJSON(message: ReadApplicationSpaceRequest): unknown {
    const obj: any = {};
    message.identifier?.$case === "id" && (obj.id = message.identifier?.id);
    message.identifier?.$case === "name" &&
      (obj.name = message.identifier?.name
        ? UniqueNameIdentifier.toJSON(message.identifier?.name)
        : undefined);
    return obj;
  },

  fromPartial(
    object: DeepPartial<ReadApplicationSpaceRequest>
  ): ReadApplicationSpaceRequest {
    const message = {
      ...baseReadApplicationSpaceRequest,
    } as ReadApplicationSpaceRequest;
    if (
      object.identifier?.$case === "id" &&
      object.identifier?.id !== undefined &&
      object.identifier?.id !== null
    ) {
      message.identifier = { $case: "id", id: object.identifier.id };
    }
    if (
      object.identifier?.$case === "name" &&
      object.identifier?.name !== undefined &&
      object.identifier?.name !== null
    ) {
      message.identifier = {
        $case: "name",
        name: UniqueNameIdentifier.fromPartial(object.identifier.name),
      };
    }
    return message;
  },
};

const baseReadApplicationSpaceResponse: object = {};

export const ReadApplicationSpaceResponse = {
  encode(
    message: ReadApplicationSpaceResponse,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.appSpace !== undefined) {
      ApplicationSpace.encode(
        message.appSpace,
        writer.uint32(18).fork()
      ).ldelim();
    }
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): ReadApplicationSpaceResponse {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseReadApplicationSpaceResponse,
    } as ReadApplicationSpaceResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 2:
          message.appSpace = ApplicationSpace.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ReadApplicationSpaceResponse {
    const message = {
      ...baseReadApplicationSpaceResponse,
    } as ReadApplicationSpaceResponse;
    if (object.appSpace !== undefined && object.appSpace !== null) {
      message.appSpace = ApplicationSpace.fromJSON(object.appSpace);
    }
    return message;
  },

  toJSON(message: ReadApplicationSpaceResponse): unknown {
    const obj: any = {};
    message.appSpace !== undefined &&
      (obj.appSpace = message.appSpace
        ? ApplicationSpace.toJSON(message.appSpace)
        : undefined);
    return obj;
  },

  fromPartial(
    object: DeepPartial<ReadApplicationSpaceResponse>
  ): ReadApplicationSpaceResponse {
    const message = {
      ...baseReadApplicationSpaceResponse,
    } as ReadApplicationSpaceResponse;
    if (object.appSpace !== undefined && object.appSpace !== null) {
      message.appSpace = ApplicationSpace.fromPartial(object.appSpace);
    }
    return message;
  },
};

const baseListApplicationSpacesRequest: object = { customerId: "", match: "" };

export const ListApplicationSpacesRequest = {
  encode(
    message: ListApplicationSpacesRequest,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.customerId !== "") {
      writer.uint32(10).string(message.customerId);
    }
    for (const v of message.match) {
      writer.uint32(18).string(v!);
    }
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): ListApplicationSpacesRequest {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseListApplicationSpacesRequest,
    } as ListApplicationSpacesRequest;
    message.match = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.customerId = reader.string();
          break;
        case 2:
          message.match.push(reader.string());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ListApplicationSpacesRequest {
    const message = {
      ...baseListApplicationSpacesRequest,
    } as ListApplicationSpacesRequest;
    message.match = [];
    if (object.customerId !== undefined && object.customerId !== null) {
      message.customerId = String(object.customerId);
    }
    if (object.match !== undefined && object.match !== null) {
      for (const e of object.match) {
        message.match.push(String(e));
      }
    }
    return message;
  },

  toJSON(message: ListApplicationSpacesRequest): unknown {
    const obj: any = {};
    message.customerId !== undefined && (obj.customerId = message.customerId);
    if (message.match) {
      obj.match = message.match.map((e) => e);
    } else {
      obj.match = [];
    }
    return obj;
  },

  fromPartial(
    object: DeepPartial<ListApplicationSpacesRequest>
  ): ListApplicationSpacesRequest {
    const message = {
      ...baseListApplicationSpacesRequest,
    } as ListApplicationSpacesRequest;
    message.match = [];
    if (object.customerId !== undefined && object.customerId !== null) {
      message.customerId = object.customerId;
    }
    if (object.match !== undefined && object.match !== null) {
      for (const e of object.match) {
        message.match.push(e);
      }
    }
    return message;
  },
};

const baseListApplicationSpacesResponse: object = {};

export const ListApplicationSpacesResponse = {
  encode(
    message: ListApplicationSpacesResponse,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.appSpace !== undefined) {
      ApplicationSpace.encode(
        message.appSpace,
        writer.uint32(10).fork()
      ).ldelim();
    }
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): ListApplicationSpacesResponse {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseListApplicationSpacesResponse,
    } as ListApplicationSpacesResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.appSpace = ApplicationSpace.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ListApplicationSpacesResponse {
    const message = {
      ...baseListApplicationSpacesResponse,
    } as ListApplicationSpacesResponse;
    if (object.appSpace !== undefined && object.appSpace !== null) {
      message.appSpace = ApplicationSpace.fromJSON(object.appSpace);
    }
    return message;
  },

  toJSON(message: ListApplicationSpacesResponse): unknown {
    const obj: any = {};
    message.appSpace !== undefined &&
      (obj.appSpace = message.appSpace
        ? ApplicationSpace.toJSON(message.appSpace)
        : undefined);
    return obj;
  },

  fromPartial(
    object: DeepPartial<ListApplicationSpacesResponse>
  ): ListApplicationSpacesResponse {
    const message = {
      ...baseListApplicationSpacesResponse,
    } as ListApplicationSpacesResponse;
    if (object.appSpace !== undefined && object.appSpace !== null) {
      message.appSpace = ApplicationSpace.fromPartial(object.appSpace);
    }
    return message;
  },
};

const baseUpdateApplicationSpaceRequest: object = { id: "" };

export const UpdateApplicationSpaceRequest = {
  encode(
    message: UpdateApplicationSpaceRequest,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.etag !== undefined) {
      StringValue.encode(
        { value: message.etag! },
        writer.uint32(18).fork()
      ).ldelim();
    }
    if (message.displayName !== undefined) {
      StringValue.encode(
        { value: message.displayName! },
        writer.uint32(26).fork()
      ).ldelim();
    }
    if (message.description !== undefined) {
      StringValue.encode(
        { value: message.description! },
        writer.uint32(34).fork()
      ).ldelim();
    }
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): UpdateApplicationSpaceRequest {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseUpdateApplicationSpaceRequest,
    } as UpdateApplicationSpaceRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string();
          break;
        case 2:
          message.etag = StringValue.decode(reader, reader.uint32()).value;
          break;
        case 3:
          message.displayName = StringValue.decode(
            reader,
            reader.uint32()
          ).value;
          break;
        case 4:
          message.description = StringValue.decode(
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

  fromJSON(object: any): UpdateApplicationSpaceRequest {
    const message = {
      ...baseUpdateApplicationSpaceRequest,
    } as UpdateApplicationSpaceRequest;
    if (object.id !== undefined && object.id !== null) {
      message.id = String(object.id);
    }
    if (object.etag !== undefined && object.etag !== null) {
      message.etag = String(object.etag);
    }
    if (object.displayName !== undefined && object.displayName !== null) {
      message.displayName = String(object.displayName);
    }
    if (object.description !== undefined && object.description !== null) {
      message.description = String(object.description);
    }
    return message;
  },

  toJSON(message: UpdateApplicationSpaceRequest): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    message.etag !== undefined && (obj.etag = message.etag);
    message.displayName !== undefined &&
      (obj.displayName = message.displayName);
    message.description !== undefined &&
      (obj.description = message.description);
    return obj;
  },

  fromPartial(
    object: DeepPartial<UpdateApplicationSpaceRequest>
  ): UpdateApplicationSpaceRequest {
    const message = {
      ...baseUpdateApplicationSpaceRequest,
    } as UpdateApplicationSpaceRequest;
    if (object.id !== undefined && object.id !== null) {
      message.id = object.id;
    }
    if (object.etag !== undefined && object.etag !== null) {
      message.etag = object.etag;
    }
    if (object.displayName !== undefined && object.displayName !== null) {
      message.displayName = object.displayName;
    }
    if (object.description !== undefined && object.description !== null) {
      message.description = object.description;
    }
    return message;
  },
};

const baseUpdateApplicationSpaceResponse: object = { id: "", etag: "" };

export const UpdateApplicationSpaceResponse = {
  encode(
    message: UpdateApplicationSpaceResponse,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.updateTime !== undefined) {
      Timestamp.encode(
        toTimestamp(message.updateTime),
        writer.uint32(18).fork()
      ).ldelim();
    }
    if (message.etag !== "") {
      writer.uint32(26).string(message.etag);
    }
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): UpdateApplicationSpaceResponse {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseUpdateApplicationSpaceResponse,
    } as UpdateApplicationSpaceResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string();
          break;
        case 2:
          message.updateTime = fromTimestamp(
            Timestamp.decode(reader, reader.uint32())
          );
          break;
        case 3:
          message.etag = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): UpdateApplicationSpaceResponse {
    const message = {
      ...baseUpdateApplicationSpaceResponse,
    } as UpdateApplicationSpaceResponse;
    if (object.id !== undefined && object.id !== null) {
      message.id = String(object.id);
    }
    if (object.updateTime !== undefined && object.updateTime !== null) {
      message.updateTime = fromJsonTimestamp(object.updateTime);
    }
    if (object.etag !== undefined && object.etag !== null) {
      message.etag = String(object.etag);
    }
    return message;
  },

  toJSON(message: UpdateApplicationSpaceResponse): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    message.updateTime !== undefined &&
      (obj.updateTime = message.updateTime.toISOString());
    message.etag !== undefined && (obj.etag = message.etag);
    return obj;
  },

  fromPartial(
    object: DeepPartial<UpdateApplicationSpaceResponse>
  ): UpdateApplicationSpaceResponse {
    const message = {
      ...baseUpdateApplicationSpaceResponse,
    } as UpdateApplicationSpaceResponse;
    if (object.id !== undefined && object.id !== null) {
      message.id = object.id;
    }
    if (object.updateTime !== undefined && object.updateTime !== null) {
      message.updateTime = object.updateTime;
    }
    if (object.etag !== undefined && object.etag !== null) {
      message.etag = object.etag;
    }
    return message;
  },
};

const baseDeleteApplicationSpaceRequest: object = { id: "" };

export const DeleteApplicationSpaceRequest = {
  encode(
    message: DeleteApplicationSpaceRequest,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.etag !== undefined) {
      StringValue.encode(
        { value: message.etag! },
        writer.uint32(18).fork()
      ).ldelim();
    }
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): DeleteApplicationSpaceRequest {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseDeleteApplicationSpaceRequest,
    } as DeleteApplicationSpaceRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string();
          break;
        case 2:
          message.etag = StringValue.decode(reader, reader.uint32()).value;
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): DeleteApplicationSpaceRequest {
    const message = {
      ...baseDeleteApplicationSpaceRequest,
    } as DeleteApplicationSpaceRequest;
    if (object.id !== undefined && object.id !== null) {
      message.id = String(object.id);
    }
    if (object.etag !== undefined && object.etag !== null) {
      message.etag = String(object.etag);
    }
    return message;
  },

  toJSON(message: DeleteApplicationSpaceRequest): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    message.etag !== undefined && (obj.etag = message.etag);
    return obj;
  },

  fromPartial(
    object: DeepPartial<DeleteApplicationSpaceRequest>
  ): DeleteApplicationSpaceRequest {
    const message = {
      ...baseDeleteApplicationSpaceRequest,
    } as DeleteApplicationSpaceRequest;
    if (object.id !== undefined && object.id !== null) {
      message.id = object.id;
    }
    if (object.etag !== undefined && object.etag !== null) {
      message.etag = object.etag;
    }
    return message;
  },
};

const baseDeleteApplicationSpaceResponse: object = {};

export const DeleteApplicationSpaceResponse = {
  encode(
    _: DeleteApplicationSpaceResponse,
    writer: Writer = Writer.create()
  ): Writer {
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): DeleteApplicationSpaceResponse {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseDeleteApplicationSpaceResponse,
    } as DeleteApplicationSpaceResponse;
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

  fromJSON(_: any): DeleteApplicationSpaceResponse {
    const message = {
      ...baseDeleteApplicationSpaceResponse,
    } as DeleteApplicationSpaceResponse;
    return message;
  },

  toJSON(_: DeleteApplicationSpaceResponse): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial(
    _: DeepPartial<DeleteApplicationSpaceResponse>
  ): DeleteApplicationSpaceResponse {
    const message = {
      ...baseDeleteApplicationSpaceResponse,
    } as DeleteApplicationSpaceResponse;
    return message;
  },
};

const baseCreateApplicationRequest: object = { appSpaceId: "", name: "" };

export const CreateApplicationRequest = {
  encode(
    message: CreateApplicationRequest,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.appSpaceId !== "") {
      writer.uint32(10).string(message.appSpaceId);
    }
    if (message.name !== "") {
      writer.uint32(18).string(message.name);
    }
    if (message.displayName !== undefined) {
      StringValue.encode(
        { value: message.displayName! },
        writer.uint32(26).fork()
      ).ldelim();
    }
    if (message.description !== undefined) {
      StringValue.encode(
        { value: message.description! },
        writer.uint32(34).fork()
      ).ldelim();
    }
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): CreateApplicationRequest {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseCreateApplicationRequest,
    } as CreateApplicationRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.appSpaceId = reader.string();
          break;
        case 2:
          message.name = reader.string();
          break;
        case 3:
          message.displayName = StringValue.decode(
            reader,
            reader.uint32()
          ).value;
          break;
        case 4:
          message.description = StringValue.decode(
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

  fromJSON(object: any): CreateApplicationRequest {
    const message = {
      ...baseCreateApplicationRequest,
    } as CreateApplicationRequest;
    if (object.appSpaceId !== undefined && object.appSpaceId !== null) {
      message.appSpaceId = String(object.appSpaceId);
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
    return message;
  },

  toJSON(message: CreateApplicationRequest): unknown {
    const obj: any = {};
    message.appSpaceId !== undefined && (obj.appSpaceId = message.appSpaceId);
    message.name !== undefined && (obj.name = message.name);
    message.displayName !== undefined &&
      (obj.displayName = message.displayName);
    message.description !== undefined &&
      (obj.description = message.description);
    return obj;
  },

  fromPartial(
    object: DeepPartial<CreateApplicationRequest>
  ): CreateApplicationRequest {
    const message = {
      ...baseCreateApplicationRequest,
    } as CreateApplicationRequest;
    if (object.appSpaceId !== undefined && object.appSpaceId !== null) {
      message.appSpaceId = object.appSpaceId;
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
    return message;
  },
};

const baseCreateApplicationResponse: object = { id: "", etag: "" };

export const CreateApplicationResponse = {
  encode(
    message: CreateApplicationResponse,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.createTime !== undefined) {
      Timestamp.encode(
        toTimestamp(message.createTime),
        writer.uint32(18).fork()
      ).ldelim();
    }
    if (message.updateTime !== undefined) {
      Timestamp.encode(
        toTimestamp(message.updateTime),
        writer.uint32(26).fork()
      ).ldelim();
    }
    if (message.etag !== "") {
      writer.uint32(34).string(message.etag);
    }
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): CreateApplicationResponse {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseCreateApplicationResponse,
    } as CreateApplicationResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string();
          break;
        case 2:
          message.createTime = fromTimestamp(
            Timestamp.decode(reader, reader.uint32())
          );
          break;
        case 3:
          message.updateTime = fromTimestamp(
            Timestamp.decode(reader, reader.uint32())
          );
          break;
        case 4:
          message.etag = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): CreateApplicationResponse {
    const message = {
      ...baseCreateApplicationResponse,
    } as CreateApplicationResponse;
    if (object.id !== undefined && object.id !== null) {
      message.id = String(object.id);
    }
    if (object.createTime !== undefined && object.createTime !== null) {
      message.createTime = fromJsonTimestamp(object.createTime);
    }
    if (object.updateTime !== undefined && object.updateTime !== null) {
      message.updateTime = fromJsonTimestamp(object.updateTime);
    }
    if (object.etag !== undefined && object.etag !== null) {
      message.etag = String(object.etag);
    }
    return message;
  },

  toJSON(message: CreateApplicationResponse): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    message.createTime !== undefined &&
      (obj.createTime = message.createTime.toISOString());
    message.updateTime !== undefined &&
      (obj.updateTime = message.updateTime.toISOString());
    message.etag !== undefined && (obj.etag = message.etag);
    return obj;
  },

  fromPartial(
    object: DeepPartial<CreateApplicationResponse>
  ): CreateApplicationResponse {
    const message = {
      ...baseCreateApplicationResponse,
    } as CreateApplicationResponse;
    if (object.id !== undefined && object.id !== null) {
      message.id = object.id;
    }
    if (object.createTime !== undefined && object.createTime !== null) {
      message.createTime = object.createTime;
    }
    if (object.updateTime !== undefined && object.updateTime !== null) {
      message.updateTime = object.updateTime;
    }
    if (object.etag !== undefined && object.etag !== null) {
      message.etag = object.etag;
    }
    return message;
  },
};

const baseReadApplicationRequest: object = {};

export const ReadApplicationRequest = {
  encode(
    message: ReadApplicationRequest,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.identifier?.$case === "id") {
      writer.uint32(10).string(message.identifier.id);
    }
    if (message.identifier?.$case === "name") {
      UniqueNameIdentifier.encode(
        message.identifier.name,
        writer.uint32(18).fork()
      ).ldelim();
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): ReadApplicationRequest {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseReadApplicationRequest } as ReadApplicationRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.identifier = { $case: "id", id: reader.string() };
          break;
        case 2:
          message.identifier = {
            $case: "name",
            name: UniqueNameIdentifier.decode(reader, reader.uint32()),
          };
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ReadApplicationRequest {
    const message = { ...baseReadApplicationRequest } as ReadApplicationRequest;
    if (object.id !== undefined && object.id !== null) {
      message.identifier = { $case: "id", id: String(object.id) };
    }
    if (object.name !== undefined && object.name !== null) {
      message.identifier = {
        $case: "name",
        name: UniqueNameIdentifier.fromJSON(object.name),
      };
    }
    return message;
  },

  toJSON(message: ReadApplicationRequest): unknown {
    const obj: any = {};
    message.identifier?.$case === "id" && (obj.id = message.identifier?.id);
    message.identifier?.$case === "name" &&
      (obj.name = message.identifier?.name
        ? UniqueNameIdentifier.toJSON(message.identifier?.name)
        : undefined);
    return obj;
  },

  fromPartial(
    object: DeepPartial<ReadApplicationRequest>
  ): ReadApplicationRequest {
    const message = { ...baseReadApplicationRequest } as ReadApplicationRequest;
    if (
      object.identifier?.$case === "id" &&
      object.identifier?.id !== undefined &&
      object.identifier?.id !== null
    ) {
      message.identifier = { $case: "id", id: object.identifier.id };
    }
    if (
      object.identifier?.$case === "name" &&
      object.identifier?.name !== undefined &&
      object.identifier?.name !== null
    ) {
      message.identifier = {
        $case: "name",
        name: UniqueNameIdentifier.fromPartial(object.identifier.name),
      };
    }
    return message;
  },
};

const baseReadApplicationResponse: object = {};

export const ReadApplicationResponse = {
  encode(
    message: ReadApplicationResponse,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.application !== undefined) {
      Application.encode(
        message.application,
        writer.uint32(26).fork()
      ).ldelim();
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): ReadApplicationResponse {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseReadApplicationResponse,
    } as ReadApplicationResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 3:
          message.application = Application.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ReadApplicationResponse {
    const message = {
      ...baseReadApplicationResponse,
    } as ReadApplicationResponse;
    if (object.application !== undefined && object.application !== null) {
      message.application = Application.fromJSON(object.application);
    }
    return message;
  },

  toJSON(message: ReadApplicationResponse): unknown {
    const obj: any = {};
    message.application !== undefined &&
      (obj.application = message.application
        ? Application.toJSON(message.application)
        : undefined);
    return obj;
  },

  fromPartial(
    object: DeepPartial<ReadApplicationResponse>
  ): ReadApplicationResponse {
    const message = {
      ...baseReadApplicationResponse,
    } as ReadApplicationResponse;
    if (object.application !== undefined && object.application !== null) {
      message.application = Application.fromPartial(object.application);
    }
    return message;
  },
};

const baseListApplicationsRequest: object = { appSpaceId: "", match: "" };

export const ListApplicationsRequest = {
  encode(
    message: ListApplicationsRequest,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.appSpaceId !== "") {
      writer.uint32(10).string(message.appSpaceId);
    }
    for (const v of message.match) {
      writer.uint32(18).string(v!);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): ListApplicationsRequest {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseListApplicationsRequest,
    } as ListApplicationsRequest;
    message.match = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.appSpaceId = reader.string();
          break;
        case 2:
          message.match.push(reader.string());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ListApplicationsRequest {
    const message = {
      ...baseListApplicationsRequest,
    } as ListApplicationsRequest;
    message.match = [];
    if (object.appSpaceId !== undefined && object.appSpaceId !== null) {
      message.appSpaceId = String(object.appSpaceId);
    }
    if (object.match !== undefined && object.match !== null) {
      for (const e of object.match) {
        message.match.push(String(e));
      }
    }
    return message;
  },

  toJSON(message: ListApplicationsRequest): unknown {
    const obj: any = {};
    message.appSpaceId !== undefined && (obj.appSpaceId = message.appSpaceId);
    if (message.match) {
      obj.match = message.match.map((e) => e);
    } else {
      obj.match = [];
    }
    return obj;
  },

  fromPartial(
    object: DeepPartial<ListApplicationsRequest>
  ): ListApplicationsRequest {
    const message = {
      ...baseListApplicationsRequest,
    } as ListApplicationsRequest;
    message.match = [];
    if (object.appSpaceId !== undefined && object.appSpaceId !== null) {
      message.appSpaceId = object.appSpaceId;
    }
    if (object.match !== undefined && object.match !== null) {
      for (const e of object.match) {
        message.match.push(e);
      }
    }
    return message;
  },
};

const baseListApplicationsResponse: object = {};

export const ListApplicationsResponse = {
  encode(
    message: ListApplicationsResponse,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.application !== undefined) {
      Application.encode(
        message.application,
        writer.uint32(10).fork()
      ).ldelim();
    }
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): ListApplicationsResponse {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseListApplicationsResponse,
    } as ListApplicationsResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.application = Application.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ListApplicationsResponse {
    const message = {
      ...baseListApplicationsResponse,
    } as ListApplicationsResponse;
    if (object.application !== undefined && object.application !== null) {
      message.application = Application.fromJSON(object.application);
    }
    return message;
  },

  toJSON(message: ListApplicationsResponse): unknown {
    const obj: any = {};
    message.application !== undefined &&
      (obj.application = message.application
        ? Application.toJSON(message.application)
        : undefined);
    return obj;
  },

  fromPartial(
    object: DeepPartial<ListApplicationsResponse>
  ): ListApplicationsResponse {
    const message = {
      ...baseListApplicationsResponse,
    } as ListApplicationsResponse;
    if (object.application !== undefined && object.application !== null) {
      message.application = Application.fromPartial(object.application);
    }
    return message;
  },
};

const baseUpdateApplicationRequest: object = { id: "" };

export const UpdateApplicationRequest = {
  encode(
    message: UpdateApplicationRequest,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.etag !== undefined) {
      StringValue.encode(
        { value: message.etag! },
        writer.uint32(18).fork()
      ).ldelim();
    }
    if (message.displayName !== undefined) {
      StringValue.encode(
        { value: message.displayName! },
        writer.uint32(26).fork()
      ).ldelim();
    }
    if (message.description !== undefined) {
      StringValue.encode(
        { value: message.description! },
        writer.uint32(34).fork()
      ).ldelim();
    }
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): UpdateApplicationRequest {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseUpdateApplicationRequest,
    } as UpdateApplicationRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string();
          break;
        case 2:
          message.etag = StringValue.decode(reader, reader.uint32()).value;
          break;
        case 3:
          message.displayName = StringValue.decode(
            reader,
            reader.uint32()
          ).value;
          break;
        case 4:
          message.description = StringValue.decode(
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

  fromJSON(object: any): UpdateApplicationRequest {
    const message = {
      ...baseUpdateApplicationRequest,
    } as UpdateApplicationRequest;
    if (object.id !== undefined && object.id !== null) {
      message.id = String(object.id);
    }
    if (object.etag !== undefined && object.etag !== null) {
      message.etag = String(object.etag);
    }
    if (object.displayName !== undefined && object.displayName !== null) {
      message.displayName = String(object.displayName);
    }
    if (object.description !== undefined && object.description !== null) {
      message.description = String(object.description);
    }
    return message;
  },

  toJSON(message: UpdateApplicationRequest): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    message.etag !== undefined && (obj.etag = message.etag);
    message.displayName !== undefined &&
      (obj.displayName = message.displayName);
    message.description !== undefined &&
      (obj.description = message.description);
    return obj;
  },

  fromPartial(
    object: DeepPartial<UpdateApplicationRequest>
  ): UpdateApplicationRequest {
    const message = {
      ...baseUpdateApplicationRequest,
    } as UpdateApplicationRequest;
    if (object.id !== undefined && object.id !== null) {
      message.id = object.id;
    }
    if (object.etag !== undefined && object.etag !== null) {
      message.etag = object.etag;
    }
    if (object.displayName !== undefined && object.displayName !== null) {
      message.displayName = object.displayName;
    }
    if (object.description !== undefined && object.description !== null) {
      message.description = object.description;
    }
    return message;
  },
};

const baseUpdateApplicationResponse: object = { id: "", etag: "" };

export const UpdateApplicationResponse = {
  encode(
    message: UpdateApplicationResponse,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.updateTime !== undefined) {
      Timestamp.encode(
        toTimestamp(message.updateTime),
        writer.uint32(18).fork()
      ).ldelim();
    }
    if (message.etag !== "") {
      writer.uint32(26).string(message.etag);
    }
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): UpdateApplicationResponse {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseUpdateApplicationResponse,
    } as UpdateApplicationResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string();
          break;
        case 2:
          message.updateTime = fromTimestamp(
            Timestamp.decode(reader, reader.uint32())
          );
          break;
        case 3:
          message.etag = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): UpdateApplicationResponse {
    const message = {
      ...baseUpdateApplicationResponse,
    } as UpdateApplicationResponse;
    if (object.id !== undefined && object.id !== null) {
      message.id = String(object.id);
    }
    if (object.updateTime !== undefined && object.updateTime !== null) {
      message.updateTime = fromJsonTimestamp(object.updateTime);
    }
    if (object.etag !== undefined && object.etag !== null) {
      message.etag = String(object.etag);
    }
    return message;
  },

  toJSON(message: UpdateApplicationResponse): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    message.updateTime !== undefined &&
      (obj.updateTime = message.updateTime.toISOString());
    message.etag !== undefined && (obj.etag = message.etag);
    return obj;
  },

  fromPartial(
    object: DeepPartial<UpdateApplicationResponse>
  ): UpdateApplicationResponse {
    const message = {
      ...baseUpdateApplicationResponse,
    } as UpdateApplicationResponse;
    if (object.id !== undefined && object.id !== null) {
      message.id = object.id;
    }
    if (object.updateTime !== undefined && object.updateTime !== null) {
      message.updateTime = object.updateTime;
    }
    if (object.etag !== undefined && object.etag !== null) {
      message.etag = object.etag;
    }
    return message;
  },
};

const baseDeleteApplicationRequest: object = { id: "" };

export const DeleteApplicationRequest = {
  encode(
    message: DeleteApplicationRequest,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.etag !== undefined) {
      StringValue.encode(
        { value: message.etag! },
        writer.uint32(18).fork()
      ).ldelim();
    }
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): DeleteApplicationRequest {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseDeleteApplicationRequest,
    } as DeleteApplicationRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string();
          break;
        case 2:
          message.etag = StringValue.decode(reader, reader.uint32()).value;
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): DeleteApplicationRequest {
    const message = {
      ...baseDeleteApplicationRequest,
    } as DeleteApplicationRequest;
    if (object.id !== undefined && object.id !== null) {
      message.id = String(object.id);
    }
    if (object.etag !== undefined && object.etag !== null) {
      message.etag = String(object.etag);
    }
    return message;
  },

  toJSON(message: DeleteApplicationRequest): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    message.etag !== undefined && (obj.etag = message.etag);
    return obj;
  },

  fromPartial(
    object: DeepPartial<DeleteApplicationRequest>
  ): DeleteApplicationRequest {
    const message = {
      ...baseDeleteApplicationRequest,
    } as DeleteApplicationRequest;
    if (object.id !== undefined && object.id !== null) {
      message.id = object.id;
    }
    if (object.etag !== undefined && object.etag !== null) {
      message.etag = object.etag;
    }
    return message;
  },
};

const baseDeleteApplicationResponse: object = {};

export const DeleteApplicationResponse = {
  encode(
    _: DeleteApplicationResponse,
    writer: Writer = Writer.create()
  ): Writer {
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): DeleteApplicationResponse {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseDeleteApplicationResponse,
    } as DeleteApplicationResponse;
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

  fromJSON(_: any): DeleteApplicationResponse {
    const message = {
      ...baseDeleteApplicationResponse,
    } as DeleteApplicationResponse;
    return message;
  },

  toJSON(_: DeleteApplicationResponse): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial(
    _: DeepPartial<DeleteApplicationResponse>
  ): DeleteApplicationResponse {
    const message = {
      ...baseDeleteApplicationResponse,
    } as DeleteApplicationResponse;
    return message;
  },
};

const baseCreateApplicationAgentRequest: object = {
  applicationId: "",
  name: "",
};

export const CreateApplicationAgentRequest = {
  encode(
    message: CreateApplicationAgentRequest,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.applicationId !== "") {
      writer.uint32(10).string(message.applicationId);
    }
    if (message.name !== "") {
      writer.uint32(18).string(message.name);
    }
    if (message.displayName !== undefined) {
      StringValue.encode(
        { value: message.displayName! },
        writer.uint32(26).fork()
      ).ldelim();
    }
    if (message.description !== undefined) {
      StringValue.encode(
        { value: message.description! },
        writer.uint32(34).fork()
      ).ldelim();
    }
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): CreateApplicationAgentRequest {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseCreateApplicationAgentRequest,
    } as CreateApplicationAgentRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.applicationId = reader.string();
          break;
        case 2:
          message.name = reader.string();
          break;
        case 3:
          message.displayName = StringValue.decode(
            reader,
            reader.uint32()
          ).value;
          break;
        case 4:
          message.description = StringValue.decode(
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

  fromJSON(object: any): CreateApplicationAgentRequest {
    const message = {
      ...baseCreateApplicationAgentRequest,
    } as CreateApplicationAgentRequest;
    if (object.applicationId !== undefined && object.applicationId !== null) {
      message.applicationId = String(object.applicationId);
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
    return message;
  },

  toJSON(message: CreateApplicationAgentRequest): unknown {
    const obj: any = {};
    message.applicationId !== undefined &&
      (obj.applicationId = message.applicationId);
    message.name !== undefined && (obj.name = message.name);
    message.displayName !== undefined &&
      (obj.displayName = message.displayName);
    message.description !== undefined &&
      (obj.description = message.description);
    return obj;
  },

  fromPartial(
    object: DeepPartial<CreateApplicationAgentRequest>
  ): CreateApplicationAgentRequest {
    const message = {
      ...baseCreateApplicationAgentRequest,
    } as CreateApplicationAgentRequest;
    if (object.applicationId !== undefined && object.applicationId !== null) {
      message.applicationId = object.applicationId;
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
    return message;
  },
};

const baseCreateApplicationAgentResponse: object = { id: "", etag: "" };

export const CreateApplicationAgentResponse = {
  encode(
    message: CreateApplicationAgentResponse,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.createTime !== undefined) {
      Timestamp.encode(
        toTimestamp(message.createTime),
        writer.uint32(26).fork()
      ).ldelim();
    }
    if (message.updateTime !== undefined) {
      Timestamp.encode(
        toTimestamp(message.updateTime),
        writer.uint32(34).fork()
      ).ldelim();
    }
    if (message.etag !== "") {
      writer.uint32(42).string(message.etag);
    }
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): CreateApplicationAgentResponse {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseCreateApplicationAgentResponse,
    } as CreateApplicationAgentResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string();
          break;
        case 3:
          message.createTime = fromTimestamp(
            Timestamp.decode(reader, reader.uint32())
          );
          break;
        case 4:
          message.updateTime = fromTimestamp(
            Timestamp.decode(reader, reader.uint32())
          );
          break;
        case 5:
          message.etag = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): CreateApplicationAgentResponse {
    const message = {
      ...baseCreateApplicationAgentResponse,
    } as CreateApplicationAgentResponse;
    if (object.id !== undefined && object.id !== null) {
      message.id = String(object.id);
    }
    if (object.createTime !== undefined && object.createTime !== null) {
      message.createTime = fromJsonTimestamp(object.createTime);
    }
    if (object.updateTime !== undefined && object.updateTime !== null) {
      message.updateTime = fromJsonTimestamp(object.updateTime);
    }
    if (object.etag !== undefined && object.etag !== null) {
      message.etag = String(object.etag);
    }
    return message;
  },

  toJSON(message: CreateApplicationAgentResponse): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    message.createTime !== undefined &&
      (obj.createTime = message.createTime.toISOString());
    message.updateTime !== undefined &&
      (obj.updateTime = message.updateTime.toISOString());
    message.etag !== undefined && (obj.etag = message.etag);
    return obj;
  },

  fromPartial(
    object: DeepPartial<CreateApplicationAgentResponse>
  ): CreateApplicationAgentResponse {
    const message = {
      ...baseCreateApplicationAgentResponse,
    } as CreateApplicationAgentResponse;
    if (object.id !== undefined && object.id !== null) {
      message.id = object.id;
    }
    if (object.createTime !== undefined && object.createTime !== null) {
      message.createTime = object.createTime;
    }
    if (object.updateTime !== undefined && object.updateTime !== null) {
      message.updateTime = object.updateTime;
    }
    if (object.etag !== undefined && object.etag !== null) {
      message.etag = object.etag;
    }
    return message;
  },
};

const baseReadApplicationAgentRequest: object = {};

export const ReadApplicationAgentRequest = {
  encode(
    message: ReadApplicationAgentRequest,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.identifier?.$case === "id") {
      writer.uint32(10).string(message.identifier.id);
    }
    if (message.identifier?.$case === "name") {
      UniqueNameIdentifier.encode(
        message.identifier.name,
        writer.uint32(18).fork()
      ).ldelim();
    }
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): ReadApplicationAgentRequest {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseReadApplicationAgentRequest,
    } as ReadApplicationAgentRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.identifier = { $case: "id", id: reader.string() };
          break;
        case 2:
          message.identifier = {
            $case: "name",
            name: UniqueNameIdentifier.decode(reader, reader.uint32()),
          };
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ReadApplicationAgentRequest {
    const message = {
      ...baseReadApplicationAgentRequest,
    } as ReadApplicationAgentRequest;
    if (object.id !== undefined && object.id !== null) {
      message.identifier = { $case: "id", id: String(object.id) };
    }
    if (object.name !== undefined && object.name !== null) {
      message.identifier = {
        $case: "name",
        name: UniqueNameIdentifier.fromJSON(object.name),
      };
    }
    return message;
  },

  toJSON(message: ReadApplicationAgentRequest): unknown {
    const obj: any = {};
    message.identifier?.$case === "id" && (obj.id = message.identifier?.id);
    message.identifier?.$case === "name" &&
      (obj.name = message.identifier?.name
        ? UniqueNameIdentifier.toJSON(message.identifier?.name)
        : undefined);
    return obj;
  },

  fromPartial(
    object: DeepPartial<ReadApplicationAgentRequest>
  ): ReadApplicationAgentRequest {
    const message = {
      ...baseReadApplicationAgentRequest,
    } as ReadApplicationAgentRequest;
    if (
      object.identifier?.$case === "id" &&
      object.identifier?.id !== undefined &&
      object.identifier?.id !== null
    ) {
      message.identifier = { $case: "id", id: object.identifier.id };
    }
    if (
      object.identifier?.$case === "name" &&
      object.identifier?.name !== undefined &&
      object.identifier?.name !== null
    ) {
      message.identifier = {
        $case: "name",
        name: UniqueNameIdentifier.fromPartial(object.identifier.name),
      };
    }
    return message;
  },
};

const baseReadApplicationAgentResponse: object = {};

export const ReadApplicationAgentResponse = {
  encode(
    message: ReadApplicationAgentResponse,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.applicationAgent !== undefined) {
      ApplicationAgent.encode(
        message.applicationAgent,
        writer.uint32(18).fork()
      ).ldelim();
    }
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): ReadApplicationAgentResponse {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseReadApplicationAgentResponse,
    } as ReadApplicationAgentResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 2:
          message.applicationAgent = ApplicationAgent.decode(
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

  fromJSON(object: any): ReadApplicationAgentResponse {
    const message = {
      ...baseReadApplicationAgentResponse,
    } as ReadApplicationAgentResponse;
    if (
      object.applicationAgent !== undefined &&
      object.applicationAgent !== null
    ) {
      message.applicationAgent = ApplicationAgent.fromJSON(
        object.applicationAgent
      );
    }
    return message;
  },

  toJSON(message: ReadApplicationAgentResponse): unknown {
    const obj: any = {};
    message.applicationAgent !== undefined &&
      (obj.applicationAgent = message.applicationAgent
        ? ApplicationAgent.toJSON(message.applicationAgent)
        : undefined);
    return obj;
  },

  fromPartial(
    object: DeepPartial<ReadApplicationAgentResponse>
  ): ReadApplicationAgentResponse {
    const message = {
      ...baseReadApplicationAgentResponse,
    } as ReadApplicationAgentResponse;
    if (
      object.applicationAgent !== undefined &&
      object.applicationAgent !== null
    ) {
      message.applicationAgent = ApplicationAgent.fromPartial(
        object.applicationAgent
      );
    }
    return message;
  },
};

const baseListApplicationAgentsRequest: object = { appSpaceId: "", match: "" };

export const ListApplicationAgentsRequest = {
  encode(
    message: ListApplicationAgentsRequest,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.appSpaceId !== "") {
      writer.uint32(10).string(message.appSpaceId);
    }
    for (const v of message.match) {
      writer.uint32(18).string(v!);
    }
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): ListApplicationAgentsRequest {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseListApplicationAgentsRequest,
    } as ListApplicationAgentsRequest;
    message.match = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.appSpaceId = reader.string();
          break;
        case 2:
          message.match.push(reader.string());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ListApplicationAgentsRequest {
    const message = {
      ...baseListApplicationAgentsRequest,
    } as ListApplicationAgentsRequest;
    message.match = [];
    if (object.appSpaceId !== undefined && object.appSpaceId !== null) {
      message.appSpaceId = String(object.appSpaceId);
    }
    if (object.match !== undefined && object.match !== null) {
      for (const e of object.match) {
        message.match.push(String(e));
      }
    }
    return message;
  },

  toJSON(message: ListApplicationAgentsRequest): unknown {
    const obj: any = {};
    message.appSpaceId !== undefined && (obj.appSpaceId = message.appSpaceId);
    if (message.match) {
      obj.match = message.match.map((e) => e);
    } else {
      obj.match = [];
    }
    return obj;
  },

  fromPartial(
    object: DeepPartial<ListApplicationAgentsRequest>
  ): ListApplicationAgentsRequest {
    const message = {
      ...baseListApplicationAgentsRequest,
    } as ListApplicationAgentsRequest;
    message.match = [];
    if (object.appSpaceId !== undefined && object.appSpaceId !== null) {
      message.appSpaceId = object.appSpaceId;
    }
    if (object.match !== undefined && object.match !== null) {
      for (const e of object.match) {
        message.match.push(e);
      }
    }
    return message;
  },
};

const baseListApplicationAgentsResponse: object = {};

export const ListApplicationAgentsResponse = {
  encode(
    message: ListApplicationAgentsResponse,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.applicationAgent !== undefined) {
      ApplicationAgent.encode(
        message.applicationAgent,
        writer.uint32(10).fork()
      ).ldelim();
    }
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): ListApplicationAgentsResponse {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseListApplicationAgentsResponse,
    } as ListApplicationAgentsResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.applicationAgent = ApplicationAgent.decode(
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

  fromJSON(object: any): ListApplicationAgentsResponse {
    const message = {
      ...baseListApplicationAgentsResponse,
    } as ListApplicationAgentsResponse;
    if (
      object.applicationAgent !== undefined &&
      object.applicationAgent !== null
    ) {
      message.applicationAgent = ApplicationAgent.fromJSON(
        object.applicationAgent
      );
    }
    return message;
  },

  toJSON(message: ListApplicationAgentsResponse): unknown {
    const obj: any = {};
    message.applicationAgent !== undefined &&
      (obj.applicationAgent = message.applicationAgent
        ? ApplicationAgent.toJSON(message.applicationAgent)
        : undefined);
    return obj;
  },

  fromPartial(
    object: DeepPartial<ListApplicationAgentsResponse>
  ): ListApplicationAgentsResponse {
    const message = {
      ...baseListApplicationAgentsResponse,
    } as ListApplicationAgentsResponse;
    if (
      object.applicationAgent !== undefined &&
      object.applicationAgent !== null
    ) {
      message.applicationAgent = ApplicationAgent.fromPartial(
        object.applicationAgent
      );
    }
    return message;
  },
};

const baseUpdateApplicationAgentRequest: object = { id: "" };

export const UpdateApplicationAgentRequest = {
  encode(
    message: UpdateApplicationAgentRequest,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.etag !== undefined) {
      StringValue.encode(
        { value: message.etag! },
        writer.uint32(18).fork()
      ).ldelim();
    }
    if (message.displayName !== undefined) {
      StringValue.encode(
        { value: message.displayName! },
        writer.uint32(26).fork()
      ).ldelim();
    }
    if (message.description !== undefined) {
      StringValue.encode(
        { value: message.description! },
        writer.uint32(34).fork()
      ).ldelim();
    }
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): UpdateApplicationAgentRequest {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseUpdateApplicationAgentRequest,
    } as UpdateApplicationAgentRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string();
          break;
        case 2:
          message.etag = StringValue.decode(reader, reader.uint32()).value;
          break;
        case 3:
          message.displayName = StringValue.decode(
            reader,
            reader.uint32()
          ).value;
          break;
        case 4:
          message.description = StringValue.decode(
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

  fromJSON(object: any): UpdateApplicationAgentRequest {
    const message = {
      ...baseUpdateApplicationAgentRequest,
    } as UpdateApplicationAgentRequest;
    if (object.id !== undefined && object.id !== null) {
      message.id = String(object.id);
    }
    if (object.etag !== undefined && object.etag !== null) {
      message.etag = String(object.etag);
    }
    if (object.displayName !== undefined && object.displayName !== null) {
      message.displayName = String(object.displayName);
    }
    if (object.description !== undefined && object.description !== null) {
      message.description = String(object.description);
    }
    return message;
  },

  toJSON(message: UpdateApplicationAgentRequest): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    message.etag !== undefined && (obj.etag = message.etag);
    message.displayName !== undefined &&
      (obj.displayName = message.displayName);
    message.description !== undefined &&
      (obj.description = message.description);
    return obj;
  },

  fromPartial(
    object: DeepPartial<UpdateApplicationAgentRequest>
  ): UpdateApplicationAgentRequest {
    const message = {
      ...baseUpdateApplicationAgentRequest,
    } as UpdateApplicationAgentRequest;
    if (object.id !== undefined && object.id !== null) {
      message.id = object.id;
    }
    if (object.etag !== undefined && object.etag !== null) {
      message.etag = object.etag;
    }
    if (object.displayName !== undefined && object.displayName !== null) {
      message.displayName = object.displayName;
    }
    if (object.description !== undefined && object.description !== null) {
      message.description = object.description;
    }
    return message;
  },
};

const baseUpdateApplicationAgentResponse: object = { id: "", etag: "" };

export const UpdateApplicationAgentResponse = {
  encode(
    message: UpdateApplicationAgentResponse,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.updateTime !== undefined) {
      Timestamp.encode(
        toTimestamp(message.updateTime),
        writer.uint32(18).fork()
      ).ldelim();
    }
    if (message.etag !== "") {
      writer.uint32(26).string(message.etag);
    }
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): UpdateApplicationAgentResponse {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseUpdateApplicationAgentResponse,
    } as UpdateApplicationAgentResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string();
          break;
        case 2:
          message.updateTime = fromTimestamp(
            Timestamp.decode(reader, reader.uint32())
          );
          break;
        case 3:
          message.etag = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): UpdateApplicationAgentResponse {
    const message = {
      ...baseUpdateApplicationAgentResponse,
    } as UpdateApplicationAgentResponse;
    if (object.id !== undefined && object.id !== null) {
      message.id = String(object.id);
    }
    if (object.updateTime !== undefined && object.updateTime !== null) {
      message.updateTime = fromJsonTimestamp(object.updateTime);
    }
    if (object.etag !== undefined && object.etag !== null) {
      message.etag = String(object.etag);
    }
    return message;
  },

  toJSON(message: UpdateApplicationAgentResponse): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    message.updateTime !== undefined &&
      (obj.updateTime = message.updateTime.toISOString());
    message.etag !== undefined && (obj.etag = message.etag);
    return obj;
  },

  fromPartial(
    object: DeepPartial<UpdateApplicationAgentResponse>
  ): UpdateApplicationAgentResponse {
    const message = {
      ...baseUpdateApplicationAgentResponse,
    } as UpdateApplicationAgentResponse;
    if (object.id !== undefined && object.id !== null) {
      message.id = object.id;
    }
    if (object.updateTime !== undefined && object.updateTime !== null) {
      message.updateTime = object.updateTime;
    }
    if (object.etag !== undefined && object.etag !== null) {
      message.etag = object.etag;
    }
    return message;
  },
};

const baseDeleteApplicationAgentRequest: object = { id: "" };

export const DeleteApplicationAgentRequest = {
  encode(
    message: DeleteApplicationAgentRequest,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.etag !== undefined) {
      StringValue.encode(
        { value: message.etag! },
        writer.uint32(18).fork()
      ).ldelim();
    }
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): DeleteApplicationAgentRequest {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseDeleteApplicationAgentRequest,
    } as DeleteApplicationAgentRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string();
          break;
        case 2:
          message.etag = StringValue.decode(reader, reader.uint32()).value;
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): DeleteApplicationAgentRequest {
    const message = {
      ...baseDeleteApplicationAgentRequest,
    } as DeleteApplicationAgentRequest;
    if (object.id !== undefined && object.id !== null) {
      message.id = String(object.id);
    }
    if (object.etag !== undefined && object.etag !== null) {
      message.etag = String(object.etag);
    }
    return message;
  },

  toJSON(message: DeleteApplicationAgentRequest): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    message.etag !== undefined && (obj.etag = message.etag);
    return obj;
  },

  fromPartial(
    object: DeepPartial<DeleteApplicationAgentRequest>
  ): DeleteApplicationAgentRequest {
    const message = {
      ...baseDeleteApplicationAgentRequest,
    } as DeleteApplicationAgentRequest;
    if (object.id !== undefined && object.id !== null) {
      message.id = object.id;
    }
    if (object.etag !== undefined && object.etag !== null) {
      message.etag = object.etag;
    }
    return message;
  },
};

const baseDeleteApplicationAgentResponse: object = {};

export const DeleteApplicationAgentResponse = {
  encode(
    _: DeleteApplicationAgentResponse,
    writer: Writer = Writer.create()
  ): Writer {
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): DeleteApplicationAgentResponse {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseDeleteApplicationAgentResponse,
    } as DeleteApplicationAgentResponse;
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

  fromJSON(_: any): DeleteApplicationAgentResponse {
    const message = {
      ...baseDeleteApplicationAgentResponse,
    } as DeleteApplicationAgentResponse;
    return message;
  },

  toJSON(_: DeleteApplicationAgentResponse): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial(
    _: DeepPartial<DeleteApplicationAgentResponse>
  ): DeleteApplicationAgentResponse {
    const message = {
      ...baseDeleteApplicationAgentResponse,
    } as DeleteApplicationAgentResponse;
    return message;
  },
};

const baseRegisterApplicationAgentCredentialRequest: object = {
  applicationAgentId: "",
  displayName: "",
  defaultTenantId: "",
};

export const RegisterApplicationAgentCredentialRequest = {
  encode(
    message: RegisterApplicationAgentCredentialRequest,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.applicationAgentId !== "") {
      writer.uint32(10).string(message.applicationAgentId);
    }
    if (message.displayName !== "") {
      writer.uint32(18).string(message.displayName);
    }
    if (message.publicKey?.$case === "jwk") {
      writer.uint32(26).bytes(message.publicKey.jwk);
    }
    if (message.publicKey?.$case === "pem") {
      writer.uint32(34).bytes(message.publicKey.pem);
    }
    if (message.expireTime !== undefined) {
      Timestamp.encode(
        toTimestamp(message.expireTime),
        writer.uint32(42).fork()
      ).ldelim();
    }
    if (message.defaultTenantId !== "") {
      writer.uint32(50).string(message.defaultTenantId);
    }
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): RegisterApplicationAgentCredentialRequest {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseRegisterApplicationAgentCredentialRequest,
    } as RegisterApplicationAgentCredentialRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.applicationAgentId = reader.string();
          break;
        case 2:
          message.displayName = reader.string();
          break;
        case 3:
          message.publicKey = { $case: "jwk", jwk: reader.bytes() as Buffer };
          break;
        case 4:
          message.publicKey = { $case: "pem", pem: reader.bytes() as Buffer };
          break;
        case 5:
          message.expireTime = fromTimestamp(
            Timestamp.decode(reader, reader.uint32())
          );
          break;
        case 6:
          message.defaultTenantId = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): RegisterApplicationAgentCredentialRequest {
    const message = {
      ...baseRegisterApplicationAgentCredentialRequest,
    } as RegisterApplicationAgentCredentialRequest;
    if (
      object.applicationAgentId !== undefined &&
      object.applicationAgentId !== null
    ) {
      message.applicationAgentId = String(object.applicationAgentId);
    }
    if (object.displayName !== undefined && object.displayName !== null) {
      message.displayName = String(object.displayName);
    }
    if (object.jwk !== undefined && object.jwk !== null) {
      message.publicKey = {
        $case: "jwk",
        jwk: Buffer.from(bytesFromBase64(object.jwk)),
      };
    }
    if (object.pem !== undefined && object.pem !== null) {
      message.publicKey = {
        $case: "pem",
        pem: Buffer.from(bytesFromBase64(object.pem)),
      };
    }
    if (object.expireTime !== undefined && object.expireTime !== null) {
      message.expireTime = fromJsonTimestamp(object.expireTime);
    }
    if (
      object.defaultTenantId !== undefined &&
      object.defaultTenantId !== null
    ) {
      message.defaultTenantId = String(object.defaultTenantId);
    }
    return message;
  },

  toJSON(message: RegisterApplicationAgentCredentialRequest): unknown {
    const obj: any = {};
    message.applicationAgentId !== undefined &&
      (obj.applicationAgentId = message.applicationAgentId);
    message.displayName !== undefined &&
      (obj.displayName = message.displayName);
    message.publicKey?.$case === "jwk" &&
      (obj.jwk =
        message.publicKey?.jwk !== undefined
          ? base64FromBytes(message.publicKey?.jwk)
          : undefined);
    message.publicKey?.$case === "pem" &&
      (obj.pem =
        message.publicKey?.pem !== undefined
          ? base64FromBytes(message.publicKey?.pem)
          : undefined);
    message.expireTime !== undefined &&
      (obj.expireTime = message.expireTime.toISOString());
    message.defaultTenantId !== undefined &&
      (obj.defaultTenantId = message.defaultTenantId);
    return obj;
  },

  fromPartial(
    object: DeepPartial<RegisterApplicationAgentCredentialRequest>
  ): RegisterApplicationAgentCredentialRequest {
    const message = {
      ...baseRegisterApplicationAgentCredentialRequest,
    } as RegisterApplicationAgentCredentialRequest;
    if (
      object.applicationAgentId !== undefined &&
      object.applicationAgentId !== null
    ) {
      message.applicationAgentId = object.applicationAgentId;
    }
    if (object.displayName !== undefined && object.displayName !== null) {
      message.displayName = object.displayName;
    }
    if (
      object.publicKey?.$case === "jwk" &&
      object.publicKey?.jwk !== undefined &&
      object.publicKey?.jwk !== null
    ) {
      message.publicKey = { $case: "jwk", jwk: object.publicKey.jwk };
    }
    if (
      object.publicKey?.$case === "pem" &&
      object.publicKey?.pem !== undefined &&
      object.publicKey?.pem !== null
    ) {
      message.publicKey = { $case: "pem", pem: object.publicKey.pem };
    }
    if (object.expireTime !== undefined && object.expireTime !== null) {
      message.expireTime = object.expireTime;
    }
    if (
      object.defaultTenantId !== undefined &&
      object.defaultTenantId !== null
    ) {
      message.defaultTenantId = object.defaultTenantId;
    }
    return message;
  },
};

const baseRegisterApplicationAgentCredentialResponse: object = {
  id: "",
  applicationAgentId: "",
  kid: "",
};

export const RegisterApplicationAgentCredentialResponse = {
  encode(
    message: RegisterApplicationAgentCredentialResponse,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.applicationAgentId !== "") {
      writer.uint32(18).string(message.applicationAgentId);
    }
    if (message.kid !== "") {
      writer.uint32(26).string(message.kid);
    }
    if (message.agentConfig.length !== 0) {
      writer.uint32(34).bytes(message.agentConfig);
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
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): RegisterApplicationAgentCredentialResponse {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseRegisterApplicationAgentCredentialResponse,
    } as RegisterApplicationAgentCredentialResponse;
    message.agentConfig = Buffer.alloc(0);
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string();
          break;
        case 2:
          message.applicationAgentId = reader.string();
          break;
        case 3:
          message.kid = reader.string();
          break;
        case 4:
          message.agentConfig = reader.bytes() as Buffer;
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
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): RegisterApplicationAgentCredentialResponse {
    const message = {
      ...baseRegisterApplicationAgentCredentialResponse,
    } as RegisterApplicationAgentCredentialResponse;
    message.agentConfig = Buffer.alloc(0);
    if (object.id !== undefined && object.id !== null) {
      message.id = String(object.id);
    }
    if (
      object.applicationAgentId !== undefined &&
      object.applicationAgentId !== null
    ) {
      message.applicationAgentId = String(object.applicationAgentId);
    }
    if (object.kid !== undefined && object.kid !== null) {
      message.kid = String(object.kid);
    }
    if (object.agentConfig !== undefined && object.agentConfig !== null) {
      message.agentConfig = Buffer.from(bytesFromBase64(object.agentConfig));
    }
    if (object.createTime !== undefined && object.createTime !== null) {
      message.createTime = fromJsonTimestamp(object.createTime);
    }
    if (object.expireTime !== undefined && object.expireTime !== null) {
      message.expireTime = fromJsonTimestamp(object.expireTime);
    }
    return message;
  },

  toJSON(message: RegisterApplicationAgentCredentialResponse): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    message.applicationAgentId !== undefined &&
      (obj.applicationAgentId = message.applicationAgentId);
    message.kid !== undefined && (obj.kid = message.kid);
    message.agentConfig !== undefined &&
      (obj.agentConfig = base64FromBytes(
        message.agentConfig !== undefined
          ? message.agentConfig
          : Buffer.alloc(0)
      ));
    message.createTime !== undefined &&
      (obj.createTime = message.createTime.toISOString());
    message.expireTime !== undefined &&
      (obj.expireTime = message.expireTime.toISOString());
    return obj;
  },

  fromPartial(
    object: DeepPartial<RegisterApplicationAgentCredentialResponse>
  ): RegisterApplicationAgentCredentialResponse {
    const message = {
      ...baseRegisterApplicationAgentCredentialResponse,
    } as RegisterApplicationAgentCredentialResponse;
    if (object.id !== undefined && object.id !== null) {
      message.id = object.id;
    }
    if (
      object.applicationAgentId !== undefined &&
      object.applicationAgentId !== null
    ) {
      message.applicationAgentId = object.applicationAgentId;
    }
    if (object.kid !== undefined && object.kid !== null) {
      message.kid = object.kid;
    }
    if (object.agentConfig !== undefined && object.agentConfig !== null) {
      message.agentConfig = object.agentConfig;
    }
    if (object.createTime !== undefined && object.createTime !== null) {
      message.createTime = object.createTime;
    }
    if (object.expireTime !== undefined && object.expireTime !== null) {
      message.expireTime = object.expireTime;
    }
    return message;
  },
};

const baseReadApplicationAgentCredentialRequest: object = { id: "" };

export const ReadApplicationAgentCredentialRequest = {
  encode(
    message: ReadApplicationAgentCredentialRequest,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): ReadApplicationAgentCredentialRequest {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseReadApplicationAgentCredentialRequest,
    } as ReadApplicationAgentCredentialRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ReadApplicationAgentCredentialRequest {
    const message = {
      ...baseReadApplicationAgentCredentialRequest,
    } as ReadApplicationAgentCredentialRequest;
    if (object.id !== undefined && object.id !== null) {
      message.id = String(object.id);
    }
    return message;
  },

  toJSON(message: ReadApplicationAgentCredentialRequest): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    return obj;
  },

  fromPartial(
    object: DeepPartial<ReadApplicationAgentCredentialRequest>
  ): ReadApplicationAgentCredentialRequest {
    const message = {
      ...baseReadApplicationAgentCredentialRequest,
    } as ReadApplicationAgentCredentialRequest;
    if (object.id !== undefined && object.id !== null) {
      message.id = object.id;
    }
    return message;
  },
};

const baseReadApplicationAgentCredentialResponse: object = {};

export const ReadApplicationAgentCredentialResponse = {
  encode(
    message: ReadApplicationAgentCredentialResponse,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.applicationAgentCredential !== undefined) {
      ApplicationAgentCredential.encode(
        message.applicationAgentCredential,
        writer.uint32(10).fork()
      ).ldelim();
    }
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): ReadApplicationAgentCredentialResponse {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseReadApplicationAgentCredentialResponse,
    } as ReadApplicationAgentCredentialResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.applicationAgentCredential =
            ApplicationAgentCredential.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ReadApplicationAgentCredentialResponse {
    const message = {
      ...baseReadApplicationAgentCredentialResponse,
    } as ReadApplicationAgentCredentialResponse;
    if (
      object.applicationAgentCredential !== undefined &&
      object.applicationAgentCredential !== null
    ) {
      message.applicationAgentCredential = ApplicationAgentCredential.fromJSON(
        object.applicationAgentCredential
      );
    }
    return message;
  },

  toJSON(message: ReadApplicationAgentCredentialResponse): unknown {
    const obj: any = {};
    message.applicationAgentCredential !== undefined &&
      (obj.applicationAgentCredential = message.applicationAgentCredential
        ? ApplicationAgentCredential.toJSON(message.applicationAgentCredential)
        : undefined);
    return obj;
  },

  fromPartial(
    object: DeepPartial<ReadApplicationAgentCredentialResponse>
  ): ReadApplicationAgentCredentialResponse {
    const message = {
      ...baseReadApplicationAgentCredentialResponse,
    } as ReadApplicationAgentCredentialResponse;
    if (
      object.applicationAgentCredential !== undefined &&
      object.applicationAgentCredential !== null
    ) {
      message.applicationAgentCredential =
        ApplicationAgentCredential.fromPartial(
          object.applicationAgentCredential
        );
    }
    return message;
  },
};

const baseDeleteApplicationAgentCredentialRequest: object = { id: "" };

export const DeleteApplicationAgentCredentialRequest = {
  encode(
    message: DeleteApplicationAgentCredentialRequest,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): DeleteApplicationAgentCredentialRequest {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseDeleteApplicationAgentCredentialRequest,
    } as DeleteApplicationAgentCredentialRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): DeleteApplicationAgentCredentialRequest {
    const message = {
      ...baseDeleteApplicationAgentCredentialRequest,
    } as DeleteApplicationAgentCredentialRequest;
    if (object.id !== undefined && object.id !== null) {
      message.id = String(object.id);
    }
    return message;
  },

  toJSON(message: DeleteApplicationAgentCredentialRequest): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    return obj;
  },

  fromPartial(
    object: DeepPartial<DeleteApplicationAgentCredentialRequest>
  ): DeleteApplicationAgentCredentialRequest {
    const message = {
      ...baseDeleteApplicationAgentCredentialRequest,
    } as DeleteApplicationAgentCredentialRequest;
    if (object.id !== undefined && object.id !== null) {
      message.id = object.id;
    }
    return message;
  },
};

const baseDeleteApplicationAgentCredentialResponse: object = {};

export const DeleteApplicationAgentCredentialResponse = {
  encode(
    _: DeleteApplicationAgentCredentialResponse,
    writer: Writer = Writer.create()
  ): Writer {
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): DeleteApplicationAgentCredentialResponse {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseDeleteApplicationAgentCredentialResponse,
    } as DeleteApplicationAgentCredentialResponse;
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

  fromJSON(_: any): DeleteApplicationAgentCredentialResponse {
    const message = {
      ...baseDeleteApplicationAgentCredentialResponse,
    } as DeleteApplicationAgentCredentialResponse;
    return message;
  },

  toJSON(_: DeleteApplicationAgentCredentialResponse): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial(
    _: DeepPartial<DeleteApplicationAgentCredentialResponse>
  ): DeleteApplicationAgentCredentialResponse {
    const message = {
      ...baseDeleteApplicationAgentCredentialResponse,
    } as DeleteApplicationAgentCredentialResponse;
    return message;
  },
};

const baseCreateTenantRequest: object = { issuerId: "", name: "" };

export const CreateTenantRequest = {
  encode(
    message: CreateTenantRequest,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.issuerId !== "") {
      writer.uint32(42).string(message.issuerId);
    }
    if (message.name !== "") {
      writer.uint32(18).string(message.name);
    }
    if (message.displayName !== undefined) {
      StringValue.encode(
        { value: message.displayName! },
        writer.uint32(26).fork()
      ).ldelim();
    }
    if (message.description !== undefined) {
      StringValue.encode(
        { value: message.description! },
        writer.uint32(34).fork()
      ).ldelim();
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): CreateTenantRequest {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseCreateTenantRequest } as CreateTenantRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 5:
          message.issuerId = reader.string();
          break;
        case 2:
          message.name = reader.string();
          break;
        case 3:
          message.displayName = StringValue.decode(
            reader,
            reader.uint32()
          ).value;
          break;
        case 4:
          message.description = StringValue.decode(
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

  fromJSON(object: any): CreateTenantRequest {
    const message = { ...baseCreateTenantRequest } as CreateTenantRequest;
    if (object.issuerId !== undefined && object.issuerId !== null) {
      message.issuerId = String(object.issuerId);
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
    return message;
  },

  toJSON(message: CreateTenantRequest): unknown {
    const obj: any = {};
    message.issuerId !== undefined && (obj.issuerId = message.issuerId);
    message.name !== undefined && (obj.name = message.name);
    message.displayName !== undefined &&
      (obj.displayName = message.displayName);
    message.description !== undefined &&
      (obj.description = message.description);
    return obj;
  },

  fromPartial(object: DeepPartial<CreateTenantRequest>): CreateTenantRequest {
    const message = { ...baseCreateTenantRequest } as CreateTenantRequest;
    if (object.issuerId !== undefined && object.issuerId !== null) {
      message.issuerId = object.issuerId;
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
    return message;
  },
};

const baseCreateTenantResponse: object = { id: "", etag: "" };

export const CreateTenantResponse = {
  encode(
    message: CreateTenantResponse,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.createTime !== undefined) {
      Timestamp.encode(
        toTimestamp(message.createTime),
        writer.uint32(18).fork()
      ).ldelim();
    }
    if (message.updateTime !== undefined) {
      Timestamp.encode(
        toTimestamp(message.updateTime),
        writer.uint32(26).fork()
      ).ldelim();
    }
    if (message.etag !== "") {
      writer.uint32(34).string(message.etag);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): CreateTenantResponse {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseCreateTenantResponse } as CreateTenantResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string();
          break;
        case 2:
          message.createTime = fromTimestamp(
            Timestamp.decode(reader, reader.uint32())
          );
          break;
        case 3:
          message.updateTime = fromTimestamp(
            Timestamp.decode(reader, reader.uint32())
          );
          break;
        case 4:
          message.etag = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): CreateTenantResponse {
    const message = { ...baseCreateTenantResponse } as CreateTenantResponse;
    if (object.id !== undefined && object.id !== null) {
      message.id = String(object.id);
    }
    if (object.createTime !== undefined && object.createTime !== null) {
      message.createTime = fromJsonTimestamp(object.createTime);
    }
    if (object.updateTime !== undefined && object.updateTime !== null) {
      message.updateTime = fromJsonTimestamp(object.updateTime);
    }
    if (object.etag !== undefined && object.etag !== null) {
      message.etag = String(object.etag);
    }
    return message;
  },

  toJSON(message: CreateTenantResponse): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    message.createTime !== undefined &&
      (obj.createTime = message.createTime.toISOString());
    message.updateTime !== undefined &&
      (obj.updateTime = message.updateTime.toISOString());
    message.etag !== undefined && (obj.etag = message.etag);
    return obj;
  },

  fromPartial(object: DeepPartial<CreateTenantResponse>): CreateTenantResponse {
    const message = { ...baseCreateTenantResponse } as CreateTenantResponse;
    if (object.id !== undefined && object.id !== null) {
      message.id = object.id;
    }
    if (object.createTime !== undefined && object.createTime !== null) {
      message.createTime = object.createTime;
    }
    if (object.updateTime !== undefined && object.updateTime !== null) {
      message.updateTime = object.updateTime;
    }
    if (object.etag !== undefined && object.etag !== null) {
      message.etag = object.etag;
    }
    return message;
  },
};

const baseReadTenantRequest: object = {};

export const ReadTenantRequest = {
  encode(message: ReadTenantRequest, writer: Writer = Writer.create()): Writer {
    if (message.identifier?.$case === "id") {
      writer.uint32(10).string(message.identifier.id);
    }
    if (message.identifier?.$case === "name") {
      UniqueNameIdentifier.encode(
        message.identifier.name,
        writer.uint32(18).fork()
      ).ldelim();
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): ReadTenantRequest {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseReadTenantRequest } as ReadTenantRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.identifier = { $case: "id", id: reader.string() };
          break;
        case 2:
          message.identifier = {
            $case: "name",
            name: UniqueNameIdentifier.decode(reader, reader.uint32()),
          };
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ReadTenantRequest {
    const message = { ...baseReadTenantRequest } as ReadTenantRequest;
    if (object.id !== undefined && object.id !== null) {
      message.identifier = { $case: "id", id: String(object.id) };
    }
    if (object.name !== undefined && object.name !== null) {
      message.identifier = {
        $case: "name",
        name: UniqueNameIdentifier.fromJSON(object.name),
      };
    }
    return message;
  },

  toJSON(message: ReadTenantRequest): unknown {
    const obj: any = {};
    message.identifier?.$case === "id" && (obj.id = message.identifier?.id);
    message.identifier?.$case === "name" &&
      (obj.name = message.identifier?.name
        ? UniqueNameIdentifier.toJSON(message.identifier?.name)
        : undefined);
    return obj;
  },

  fromPartial(object: DeepPartial<ReadTenantRequest>): ReadTenantRequest {
    const message = { ...baseReadTenantRequest } as ReadTenantRequest;
    if (
      object.identifier?.$case === "id" &&
      object.identifier?.id !== undefined &&
      object.identifier?.id !== null
    ) {
      message.identifier = { $case: "id", id: object.identifier.id };
    }
    if (
      object.identifier?.$case === "name" &&
      object.identifier?.name !== undefined &&
      object.identifier?.name !== null
    ) {
      message.identifier = {
        $case: "name",
        name: UniqueNameIdentifier.fromPartial(object.identifier.name),
      };
    }
    return message;
  },
};

const baseReadTenantResponse: object = {};

export const ReadTenantResponse = {
  encode(
    message: ReadTenantResponse,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.tenant !== undefined) {
      Tenant.encode(message.tenant, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): ReadTenantResponse {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseReadTenantResponse } as ReadTenantResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.tenant = Tenant.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ReadTenantResponse {
    const message = { ...baseReadTenantResponse } as ReadTenantResponse;
    if (object.tenant !== undefined && object.tenant !== null) {
      message.tenant = Tenant.fromJSON(object.tenant);
    }
    return message;
  },

  toJSON(message: ReadTenantResponse): unknown {
    const obj: any = {};
    message.tenant !== undefined &&
      (obj.tenant = message.tenant ? Tenant.toJSON(message.tenant) : undefined);
    return obj;
  },

  fromPartial(object: DeepPartial<ReadTenantResponse>): ReadTenantResponse {
    const message = { ...baseReadTenantResponse } as ReadTenantResponse;
    if (object.tenant !== undefined && object.tenant !== null) {
      message.tenant = Tenant.fromPartial(object.tenant);
    }
    return message;
  },
};

const baseListTenantsRequest: object = { appSpaceId: "", match: "" };

export const ListTenantsRequest = {
  encode(
    message: ListTenantsRequest,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.appSpaceId !== "") {
      writer.uint32(10).string(message.appSpaceId);
    }
    for (const v of message.match) {
      writer.uint32(18).string(v!);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): ListTenantsRequest {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseListTenantsRequest } as ListTenantsRequest;
    message.match = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.appSpaceId = reader.string();
          break;
        case 2:
          message.match.push(reader.string());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ListTenantsRequest {
    const message = { ...baseListTenantsRequest } as ListTenantsRequest;
    message.match = [];
    if (object.appSpaceId !== undefined && object.appSpaceId !== null) {
      message.appSpaceId = String(object.appSpaceId);
    }
    if (object.match !== undefined && object.match !== null) {
      for (const e of object.match) {
        message.match.push(String(e));
      }
    }
    return message;
  },

  toJSON(message: ListTenantsRequest): unknown {
    const obj: any = {};
    message.appSpaceId !== undefined && (obj.appSpaceId = message.appSpaceId);
    if (message.match) {
      obj.match = message.match.map((e) => e);
    } else {
      obj.match = [];
    }
    return obj;
  },

  fromPartial(object: DeepPartial<ListTenantsRequest>): ListTenantsRequest {
    const message = { ...baseListTenantsRequest } as ListTenantsRequest;
    message.match = [];
    if (object.appSpaceId !== undefined && object.appSpaceId !== null) {
      message.appSpaceId = object.appSpaceId;
    }
    if (object.match !== undefined && object.match !== null) {
      for (const e of object.match) {
        message.match.push(e);
      }
    }
    return message;
  },
};

const baseListTenantsResponse: object = {};

export const ListTenantsResponse = {
  encode(
    message: ListTenantsResponse,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.tenant !== undefined) {
      Tenant.encode(message.tenant, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): ListTenantsResponse {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseListTenantsResponse } as ListTenantsResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.tenant = Tenant.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ListTenantsResponse {
    const message = { ...baseListTenantsResponse } as ListTenantsResponse;
    if (object.tenant !== undefined && object.tenant !== null) {
      message.tenant = Tenant.fromJSON(object.tenant);
    }
    return message;
  },

  toJSON(message: ListTenantsResponse): unknown {
    const obj: any = {};
    message.tenant !== undefined &&
      (obj.tenant = message.tenant ? Tenant.toJSON(message.tenant) : undefined);
    return obj;
  },

  fromPartial(object: DeepPartial<ListTenantsResponse>): ListTenantsResponse {
    const message = { ...baseListTenantsResponse } as ListTenantsResponse;
    if (object.tenant !== undefined && object.tenant !== null) {
      message.tenant = Tenant.fromPartial(object.tenant);
    }
    return message;
  },
};

const baseUpdateTenantRequest: object = { id: "" };

export const UpdateTenantRequest = {
  encode(
    message: UpdateTenantRequest,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.etag !== undefined) {
      StringValue.encode(
        { value: message.etag! },
        writer.uint32(18).fork()
      ).ldelim();
    }
    if (message.displayName !== undefined) {
      StringValue.encode(
        { value: message.displayName! },
        writer.uint32(26).fork()
      ).ldelim();
    }
    if (message.description !== undefined) {
      StringValue.encode(
        { value: message.description! },
        writer.uint32(34).fork()
      ).ldelim();
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): UpdateTenantRequest {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseUpdateTenantRequest } as UpdateTenantRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string();
          break;
        case 2:
          message.etag = StringValue.decode(reader, reader.uint32()).value;
          break;
        case 3:
          message.displayName = StringValue.decode(
            reader,
            reader.uint32()
          ).value;
          break;
        case 4:
          message.description = StringValue.decode(
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

  fromJSON(object: any): UpdateTenantRequest {
    const message = { ...baseUpdateTenantRequest } as UpdateTenantRequest;
    if (object.id !== undefined && object.id !== null) {
      message.id = String(object.id);
    }
    if (object.etag !== undefined && object.etag !== null) {
      message.etag = String(object.etag);
    }
    if (object.displayName !== undefined && object.displayName !== null) {
      message.displayName = String(object.displayName);
    }
    if (object.description !== undefined && object.description !== null) {
      message.description = String(object.description);
    }
    return message;
  },

  toJSON(message: UpdateTenantRequest): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    message.etag !== undefined && (obj.etag = message.etag);
    message.displayName !== undefined &&
      (obj.displayName = message.displayName);
    message.description !== undefined &&
      (obj.description = message.description);
    return obj;
  },

  fromPartial(object: DeepPartial<UpdateTenantRequest>): UpdateTenantRequest {
    const message = { ...baseUpdateTenantRequest } as UpdateTenantRequest;
    if (object.id !== undefined && object.id !== null) {
      message.id = object.id;
    }
    if (object.etag !== undefined && object.etag !== null) {
      message.etag = object.etag;
    }
    if (object.displayName !== undefined && object.displayName !== null) {
      message.displayName = object.displayName;
    }
    if (object.description !== undefined && object.description !== null) {
      message.description = object.description;
    }
    return message;
  },
};

const baseUpdateTenantResponse: object = { id: "", etag: "" };

export const UpdateTenantResponse = {
  encode(
    message: UpdateTenantResponse,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.updateTime !== undefined) {
      Timestamp.encode(
        toTimestamp(message.updateTime),
        writer.uint32(18).fork()
      ).ldelim();
    }
    if (message.etag !== "") {
      writer.uint32(26).string(message.etag);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): UpdateTenantResponse {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseUpdateTenantResponse } as UpdateTenantResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string();
          break;
        case 2:
          message.updateTime = fromTimestamp(
            Timestamp.decode(reader, reader.uint32())
          );
          break;
        case 3:
          message.etag = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): UpdateTenantResponse {
    const message = { ...baseUpdateTenantResponse } as UpdateTenantResponse;
    if (object.id !== undefined && object.id !== null) {
      message.id = String(object.id);
    }
    if (object.updateTime !== undefined && object.updateTime !== null) {
      message.updateTime = fromJsonTimestamp(object.updateTime);
    }
    if (object.etag !== undefined && object.etag !== null) {
      message.etag = String(object.etag);
    }
    return message;
  },

  toJSON(message: UpdateTenantResponse): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    message.updateTime !== undefined &&
      (obj.updateTime = message.updateTime.toISOString());
    message.etag !== undefined && (obj.etag = message.etag);
    return obj;
  },

  fromPartial(object: DeepPartial<UpdateTenantResponse>): UpdateTenantResponse {
    const message = { ...baseUpdateTenantResponse } as UpdateTenantResponse;
    if (object.id !== undefined && object.id !== null) {
      message.id = object.id;
    }
    if (object.updateTime !== undefined && object.updateTime !== null) {
      message.updateTime = object.updateTime;
    }
    if (object.etag !== undefined && object.etag !== null) {
      message.etag = object.etag;
    }
    return message;
  },
};

const baseDeleteTenantRequest: object = { id: "" };

export const DeleteTenantRequest = {
  encode(
    message: DeleteTenantRequest,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.etag !== undefined) {
      StringValue.encode(
        { value: message.etag! },
        writer.uint32(18).fork()
      ).ldelim();
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): DeleteTenantRequest {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseDeleteTenantRequest } as DeleteTenantRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string();
          break;
        case 2:
          message.etag = StringValue.decode(reader, reader.uint32()).value;
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): DeleteTenantRequest {
    const message = { ...baseDeleteTenantRequest } as DeleteTenantRequest;
    if (object.id !== undefined && object.id !== null) {
      message.id = String(object.id);
    }
    if (object.etag !== undefined && object.etag !== null) {
      message.etag = String(object.etag);
    }
    return message;
  },

  toJSON(message: DeleteTenantRequest): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    message.etag !== undefined && (obj.etag = message.etag);
    return obj;
  },

  fromPartial(object: DeepPartial<DeleteTenantRequest>): DeleteTenantRequest {
    const message = { ...baseDeleteTenantRequest } as DeleteTenantRequest;
    if (object.id !== undefined && object.id !== null) {
      message.id = object.id;
    }
    if (object.etag !== undefined && object.etag !== null) {
      message.etag = object.etag;
    }
    return message;
  },
};

const baseDeleteTenantResponse: object = {};

export const DeleteTenantResponse = {
  encode(_: DeleteTenantResponse, writer: Writer = Writer.create()): Writer {
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): DeleteTenantResponse {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseDeleteTenantResponse } as DeleteTenantResponse;
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

  fromJSON(_: any): DeleteTenantResponse {
    const message = { ...baseDeleteTenantResponse } as DeleteTenantResponse;
    return message;
  },

  toJSON(_: DeleteTenantResponse): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial(_: DeepPartial<DeleteTenantResponse>): DeleteTenantResponse {
    const message = { ...baseDeleteTenantResponse } as DeleteTenantResponse;
    return message;
  },
};

const baseCreateConfigNodeRequest: object = { location: "", name: "" };

export const CreateConfigNodeRequest = {
  encode(
    message: CreateConfigNodeRequest,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.location !== "") {
      writer.uint32(10).string(message.location);
    }
    if (message.name !== "") {
      writer.uint32(34).string(message.name);
    }
    if (message.displayName !== undefined) {
      StringValue.encode(
        { value: message.displayName! },
        writer.uint32(42).fork()
      ).ldelim();
    }
    if (message.description !== undefined) {
      StringValue.encode(
        { value: message.description! },
        writer.uint32(50).fork()
      ).ldelim();
    }
    if (message.config?.$case === "authFlowConfig") {
      AuthFlowConfig.encode(
        message.config.authFlowConfig,
        writer.uint32(122).fork()
      ).ldelim();
    }
    if (message.config?.$case === "emailServiceConfig") {
      EmailServiceConfig.encode(
        message.config.emailServiceConfig,
        writer.uint32(130).fork()
      ).ldelim();
    }
    if (message.config?.$case === "smsServiceConfig") {
      SMSServiceConfig.encode(
        message.config.smsServiceConfig,
        writer.uint32(138).fork()
      ).ldelim();
    }
    if (message.config?.$case === "oauth2ClientConfig") {
      OAuth2ClientConfig.encode(
        message.config.oauth2ClientConfig,
        writer.uint32(146).fork()
      ).ldelim();
    }
    if (message.config?.$case === "passwordProviderConfig") {
      PasswordProviderConfig.encode(
        message.config.passwordProviderConfig,
        writer.uint32(162).fork()
      ).ldelim();
    }
    if (message.config?.$case === "webauthnProviderConfig") {
      WebAuthnProviderConfig.encode(
        message.config.webauthnProviderConfig,
        writer.uint32(170).fork()
      ).ldelim();
    }
    if (message.config?.$case === "authenteqProviderConfig") {
      AuthenteqProviderConfig.encode(
        message.config.authenteqProviderConfig,
        writer.uint32(178).fork()
      ).ldelim();
    }
    if (message.config?.$case === "safrProviderConfig") {
      SAFRProviderConfig.encode(
        message.config.safrProviderConfig,
        writer.uint32(186).fork()
      ).ldelim();
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): CreateConfigNodeRequest {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseCreateConfigNodeRequest,
    } as CreateConfigNodeRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.location = reader.string();
          break;
        case 4:
          message.name = reader.string();
          break;
        case 5:
          message.displayName = StringValue.decode(
            reader,
            reader.uint32()
          ).value;
          break;
        case 6:
          message.description = StringValue.decode(
            reader,
            reader.uint32()
          ).value;
          break;
        case 15:
          message.config = {
            $case: "authFlowConfig",
            authFlowConfig: AuthFlowConfig.decode(reader, reader.uint32()),
          };
          break;
        case 16:
          message.config = {
            $case: "emailServiceConfig",
            emailServiceConfig: EmailServiceConfig.decode(
              reader,
              reader.uint32()
            ),
          };
          break;
        case 17:
          message.config = {
            $case: "smsServiceConfig",
            smsServiceConfig: SMSServiceConfig.decode(reader, reader.uint32()),
          };
          break;
        case 18:
          message.config = {
            $case: "oauth2ClientConfig",
            oauth2ClientConfig: OAuth2ClientConfig.decode(
              reader,
              reader.uint32()
            ),
          };
          break;
        case 20:
          message.config = {
            $case: "passwordProviderConfig",
            passwordProviderConfig: PasswordProviderConfig.decode(
              reader,
              reader.uint32()
            ),
          };
          break;
        case 21:
          message.config = {
            $case: "webauthnProviderConfig",
            webauthnProviderConfig: WebAuthnProviderConfig.decode(
              reader,
              reader.uint32()
            ),
          };
          break;
        case 22:
          message.config = {
            $case: "authenteqProviderConfig",
            authenteqProviderConfig: AuthenteqProviderConfig.decode(
              reader,
              reader.uint32()
            ),
          };
          break;
        case 23:
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

  fromJSON(object: any): CreateConfigNodeRequest {
    const message = {
      ...baseCreateConfigNodeRequest,
    } as CreateConfigNodeRequest;
    if (object.location !== undefined && object.location !== null) {
      message.location = String(object.location);
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
      object.smsServiceConfig !== undefined &&
      object.smsServiceConfig !== null
    ) {
      message.config = {
        $case: "smsServiceConfig",
        smsServiceConfig: SMSServiceConfig.fromJSON(object.smsServiceConfig),
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

  toJSON(message: CreateConfigNodeRequest): unknown {
    const obj: any = {};
    message.location !== undefined && (obj.location = message.location);
    message.name !== undefined && (obj.name = message.name);
    message.displayName !== undefined &&
      (obj.displayName = message.displayName);
    message.description !== undefined &&
      (obj.description = message.description);
    message.config?.$case === "authFlowConfig" &&
      (obj.authFlowConfig = message.config?.authFlowConfig
        ? AuthFlowConfig.toJSON(message.config?.authFlowConfig)
        : undefined);
    message.config?.$case === "emailServiceConfig" &&
      (obj.emailServiceConfig = message.config?.emailServiceConfig
        ? EmailServiceConfig.toJSON(message.config?.emailServiceConfig)
        : undefined);
    message.config?.$case === "smsServiceConfig" &&
      (obj.smsServiceConfig = message.config?.smsServiceConfig
        ? SMSServiceConfig.toJSON(message.config?.smsServiceConfig)
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

  fromPartial(
    object: DeepPartial<CreateConfigNodeRequest>
  ): CreateConfigNodeRequest {
    const message = {
      ...baseCreateConfigNodeRequest,
    } as CreateConfigNodeRequest;
    if (object.location !== undefined && object.location !== null) {
      message.location = object.location;
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
      object.config?.$case === "smsServiceConfig" &&
      object.config?.smsServiceConfig !== undefined &&
      object.config?.smsServiceConfig !== null
    ) {
      message.config = {
        $case: "smsServiceConfig",
        smsServiceConfig: SMSServiceConfig.fromPartial(
          object.config.smsServiceConfig
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

const baseCreateConfigNodeResponse: object = { id: "", etag: "" };

export const CreateConfigNodeResponse = {
  encode(
    message: CreateConfigNodeResponse,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.createTime !== undefined) {
      Timestamp.encode(
        toTimestamp(message.createTime),
        writer.uint32(18).fork()
      ).ldelim();
    }
    if (message.updateTime !== undefined) {
      Timestamp.encode(
        toTimestamp(message.updateTime),
        writer.uint32(26).fork()
      ).ldelim();
    }
    if (message.etag !== "") {
      writer.uint32(34).string(message.etag);
    }
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): CreateConfigNodeResponse {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseCreateConfigNodeResponse,
    } as CreateConfigNodeResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string();
          break;
        case 2:
          message.createTime = fromTimestamp(
            Timestamp.decode(reader, reader.uint32())
          );
          break;
        case 3:
          message.updateTime = fromTimestamp(
            Timestamp.decode(reader, reader.uint32())
          );
          break;
        case 4:
          message.etag = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): CreateConfigNodeResponse {
    const message = {
      ...baseCreateConfigNodeResponse,
    } as CreateConfigNodeResponse;
    if (object.id !== undefined && object.id !== null) {
      message.id = String(object.id);
    }
    if (object.createTime !== undefined && object.createTime !== null) {
      message.createTime = fromJsonTimestamp(object.createTime);
    }
    if (object.updateTime !== undefined && object.updateTime !== null) {
      message.updateTime = fromJsonTimestamp(object.updateTime);
    }
    if (object.etag !== undefined && object.etag !== null) {
      message.etag = String(object.etag);
    }
    return message;
  },

  toJSON(message: CreateConfigNodeResponse): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    message.createTime !== undefined &&
      (obj.createTime = message.createTime.toISOString());
    message.updateTime !== undefined &&
      (obj.updateTime = message.updateTime.toISOString());
    message.etag !== undefined && (obj.etag = message.etag);
    return obj;
  },

  fromPartial(
    object: DeepPartial<CreateConfigNodeResponse>
  ): CreateConfigNodeResponse {
    const message = {
      ...baseCreateConfigNodeResponse,
    } as CreateConfigNodeResponse;
    if (object.id !== undefined && object.id !== null) {
      message.id = object.id;
    }
    if (object.createTime !== undefined && object.createTime !== null) {
      message.createTime = object.createTime;
    }
    if (object.updateTime !== undefined && object.updateTime !== null) {
      message.updateTime = object.updateTime;
    }
    if (object.etag !== undefined && object.etag !== null) {
      message.etag = object.etag;
    }
    return message;
  },
};

const baseReadConfigNodeRequest: object = { id: "" };

export const ReadConfigNodeRequest = {
  encode(
    message: ReadConfigNodeRequest,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): ReadConfigNodeRequest {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseReadConfigNodeRequest } as ReadConfigNodeRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ReadConfigNodeRequest {
    const message = { ...baseReadConfigNodeRequest } as ReadConfigNodeRequest;
    if (object.id !== undefined && object.id !== null) {
      message.id = String(object.id);
    }
    return message;
  },

  toJSON(message: ReadConfigNodeRequest): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    return obj;
  },

  fromPartial(
    object: DeepPartial<ReadConfigNodeRequest>
  ): ReadConfigNodeRequest {
    const message = { ...baseReadConfigNodeRequest } as ReadConfigNodeRequest;
    if (object.id !== undefined && object.id !== null) {
      message.id = object.id;
    }
    return message;
  },
};

const baseReadConfigNodeResponse: object = {};

export const ReadConfigNodeResponse = {
  encode(
    message: ReadConfigNodeResponse,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.configNode !== undefined) {
      ConfigNode.encode(message.configNode, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): ReadConfigNodeResponse {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseReadConfigNodeResponse } as ReadConfigNodeResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.configNode = ConfigNode.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ReadConfigNodeResponse {
    const message = { ...baseReadConfigNodeResponse } as ReadConfigNodeResponse;
    if (object.configNode !== undefined && object.configNode !== null) {
      message.configNode = ConfigNode.fromJSON(object.configNode);
    }
    return message;
  },

  toJSON(message: ReadConfigNodeResponse): unknown {
    const obj: any = {};
    message.configNode !== undefined &&
      (obj.configNode = message.configNode
        ? ConfigNode.toJSON(message.configNode)
        : undefined);
    return obj;
  },

  fromPartial(
    object: DeepPartial<ReadConfigNodeResponse>
  ): ReadConfigNodeResponse {
    const message = { ...baseReadConfigNodeResponse } as ReadConfigNodeResponse;
    if (object.configNode !== undefined && object.configNode !== null) {
      message.configNode = ConfigNode.fromPartial(object.configNode);
    }
    return message;
  },
};

const baseUpdateConfigNodeRequest: object = { id: "" };

export const UpdateConfigNodeRequest = {
  encode(
    message: UpdateConfigNodeRequest,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.etag !== undefined) {
      StringValue.encode(
        { value: message.etag! },
        writer.uint32(18).fork()
      ).ldelim();
    }
    if (message.displayName !== undefined) {
      StringValue.encode(
        { value: message.displayName! },
        writer.uint32(26).fork()
      ).ldelim();
    }
    if (message.description !== undefined) {
      StringValue.encode(
        { value: message.description! },
        writer.uint32(34).fork()
      ).ldelim();
    }
    if (message.config?.$case === "authFlowConfig") {
      AuthFlowConfig.encode(
        message.config.authFlowConfig,
        writer.uint32(122).fork()
      ).ldelim();
    }
    if (message.config?.$case === "emailServiceConfig") {
      EmailServiceConfig.encode(
        message.config.emailServiceConfig,
        writer.uint32(130).fork()
      ).ldelim();
    }
    if (message.config?.$case === "smsServiceConfig") {
      SMSServiceConfig.encode(
        message.config.smsServiceConfig,
        writer.uint32(138).fork()
      ).ldelim();
    }
    if (message.config?.$case === "oauth2ClientConfig") {
      OAuth2ClientConfig.encode(
        message.config.oauth2ClientConfig,
        writer.uint32(146).fork()
      ).ldelim();
    }
    if (message.config?.$case === "passwordProviderConfig") {
      PasswordProviderConfig.encode(
        message.config.passwordProviderConfig,
        writer.uint32(162).fork()
      ).ldelim();
    }
    if (message.config?.$case === "webauthnProviderConfig") {
      WebAuthnProviderConfig.encode(
        message.config.webauthnProviderConfig,
        writer.uint32(170).fork()
      ).ldelim();
    }
    if (message.config?.$case === "authenteqProviderConfig") {
      AuthenteqProviderConfig.encode(
        message.config.authenteqProviderConfig,
        writer.uint32(178).fork()
      ).ldelim();
    }
    if (message.config?.$case === "safrProviderConfig") {
      SAFRProviderConfig.encode(
        message.config.safrProviderConfig,
        writer.uint32(186).fork()
      ).ldelim();
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): UpdateConfigNodeRequest {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseUpdateConfigNodeRequest,
    } as UpdateConfigNodeRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string();
          break;
        case 2:
          message.etag = StringValue.decode(reader, reader.uint32()).value;
          break;
        case 3:
          message.displayName = StringValue.decode(
            reader,
            reader.uint32()
          ).value;
          break;
        case 4:
          message.description = StringValue.decode(
            reader,
            reader.uint32()
          ).value;
          break;
        case 15:
          message.config = {
            $case: "authFlowConfig",
            authFlowConfig: AuthFlowConfig.decode(reader, reader.uint32()),
          };
          break;
        case 16:
          message.config = {
            $case: "emailServiceConfig",
            emailServiceConfig: EmailServiceConfig.decode(
              reader,
              reader.uint32()
            ),
          };
          break;
        case 17:
          message.config = {
            $case: "smsServiceConfig",
            smsServiceConfig: SMSServiceConfig.decode(reader, reader.uint32()),
          };
          break;
        case 18:
          message.config = {
            $case: "oauth2ClientConfig",
            oauth2ClientConfig: OAuth2ClientConfig.decode(
              reader,
              reader.uint32()
            ),
          };
          break;
        case 20:
          message.config = {
            $case: "passwordProviderConfig",
            passwordProviderConfig: PasswordProviderConfig.decode(
              reader,
              reader.uint32()
            ),
          };
          break;
        case 21:
          message.config = {
            $case: "webauthnProviderConfig",
            webauthnProviderConfig: WebAuthnProviderConfig.decode(
              reader,
              reader.uint32()
            ),
          };
          break;
        case 22:
          message.config = {
            $case: "authenteqProviderConfig",
            authenteqProviderConfig: AuthenteqProviderConfig.decode(
              reader,
              reader.uint32()
            ),
          };
          break;
        case 23:
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

  fromJSON(object: any): UpdateConfigNodeRequest {
    const message = {
      ...baseUpdateConfigNodeRequest,
    } as UpdateConfigNodeRequest;
    if (object.id !== undefined && object.id !== null) {
      message.id = String(object.id);
    }
    if (object.etag !== undefined && object.etag !== null) {
      message.etag = String(object.etag);
    }
    if (object.displayName !== undefined && object.displayName !== null) {
      message.displayName = String(object.displayName);
    }
    if (object.description !== undefined && object.description !== null) {
      message.description = String(object.description);
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
      object.smsServiceConfig !== undefined &&
      object.smsServiceConfig !== null
    ) {
      message.config = {
        $case: "smsServiceConfig",
        smsServiceConfig: SMSServiceConfig.fromJSON(object.smsServiceConfig),
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

  toJSON(message: UpdateConfigNodeRequest): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    message.etag !== undefined && (obj.etag = message.etag);
    message.displayName !== undefined &&
      (obj.displayName = message.displayName);
    message.description !== undefined &&
      (obj.description = message.description);
    message.config?.$case === "authFlowConfig" &&
      (obj.authFlowConfig = message.config?.authFlowConfig
        ? AuthFlowConfig.toJSON(message.config?.authFlowConfig)
        : undefined);
    message.config?.$case === "emailServiceConfig" &&
      (obj.emailServiceConfig = message.config?.emailServiceConfig
        ? EmailServiceConfig.toJSON(message.config?.emailServiceConfig)
        : undefined);
    message.config?.$case === "smsServiceConfig" &&
      (obj.smsServiceConfig = message.config?.smsServiceConfig
        ? SMSServiceConfig.toJSON(message.config?.smsServiceConfig)
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

  fromPartial(
    object: DeepPartial<UpdateConfigNodeRequest>
  ): UpdateConfigNodeRequest {
    const message = {
      ...baseUpdateConfigNodeRequest,
    } as UpdateConfigNodeRequest;
    if (object.id !== undefined && object.id !== null) {
      message.id = object.id;
    }
    if (object.etag !== undefined && object.etag !== null) {
      message.etag = object.etag;
    }
    if (object.displayName !== undefined && object.displayName !== null) {
      message.displayName = object.displayName;
    }
    if (object.description !== undefined && object.description !== null) {
      message.description = object.description;
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
      object.config?.$case === "smsServiceConfig" &&
      object.config?.smsServiceConfig !== undefined &&
      object.config?.smsServiceConfig !== null
    ) {
      message.config = {
        $case: "smsServiceConfig",
        smsServiceConfig: SMSServiceConfig.fromPartial(
          object.config.smsServiceConfig
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

const baseUpdateConfigNodeResponse: object = { id: "", etag: "" };

export const UpdateConfigNodeResponse = {
  encode(
    message: UpdateConfigNodeResponse,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.updateTime !== undefined) {
      Timestamp.encode(
        toTimestamp(message.updateTime),
        writer.uint32(18).fork()
      ).ldelim();
    }
    if (message.etag !== "") {
      writer.uint32(26).string(message.etag);
    }
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): UpdateConfigNodeResponse {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseUpdateConfigNodeResponse,
    } as UpdateConfigNodeResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string();
          break;
        case 2:
          message.updateTime = fromTimestamp(
            Timestamp.decode(reader, reader.uint32())
          );
          break;
        case 3:
          message.etag = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): UpdateConfigNodeResponse {
    const message = {
      ...baseUpdateConfigNodeResponse,
    } as UpdateConfigNodeResponse;
    if (object.id !== undefined && object.id !== null) {
      message.id = String(object.id);
    }
    if (object.updateTime !== undefined && object.updateTime !== null) {
      message.updateTime = fromJsonTimestamp(object.updateTime);
    }
    if (object.etag !== undefined && object.etag !== null) {
      message.etag = String(object.etag);
    }
    return message;
  },

  toJSON(message: UpdateConfigNodeResponse): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    message.updateTime !== undefined &&
      (obj.updateTime = message.updateTime.toISOString());
    message.etag !== undefined && (obj.etag = message.etag);
    return obj;
  },

  fromPartial(
    object: DeepPartial<UpdateConfigNodeResponse>
  ): UpdateConfigNodeResponse {
    const message = {
      ...baseUpdateConfigNodeResponse,
    } as UpdateConfigNodeResponse;
    if (object.id !== undefined && object.id !== null) {
      message.id = object.id;
    }
    if (object.updateTime !== undefined && object.updateTime !== null) {
      message.updateTime = object.updateTime;
    }
    if (object.etag !== undefined && object.etag !== null) {
      message.etag = object.etag;
    }
    return message;
  },
};

const baseDeleteConfigNodeRequest: object = { id: "" };

export const DeleteConfigNodeRequest = {
  encode(
    message: DeleteConfigNodeRequest,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.etag !== undefined) {
      StringValue.encode(
        { value: message.etag! },
        writer.uint32(26).fork()
      ).ldelim();
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): DeleteConfigNodeRequest {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseDeleteConfigNodeRequest,
    } as DeleteConfigNodeRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string();
          break;
        case 3:
          message.etag = StringValue.decode(reader, reader.uint32()).value;
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): DeleteConfigNodeRequest {
    const message = {
      ...baseDeleteConfigNodeRequest,
    } as DeleteConfigNodeRequest;
    if (object.id !== undefined && object.id !== null) {
      message.id = String(object.id);
    }
    if (object.etag !== undefined && object.etag !== null) {
      message.etag = String(object.etag);
    }
    return message;
  },

  toJSON(message: DeleteConfigNodeRequest): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    message.etag !== undefined && (obj.etag = message.etag);
    return obj;
  },

  fromPartial(
    object: DeepPartial<DeleteConfigNodeRequest>
  ): DeleteConfigNodeRequest {
    const message = {
      ...baseDeleteConfigNodeRequest,
    } as DeleteConfigNodeRequest;
    if (object.id !== undefined && object.id !== null) {
      message.id = object.id;
    }
    if (object.etag !== undefined && object.etag !== null) {
      message.etag = object.etag;
    }
    return message;
  },
};

const baseDeleteConfigNodeResponse: object = {};

export const DeleteConfigNodeResponse = {
  encode(
    _: DeleteConfigNodeResponse,
    writer: Writer = Writer.create()
  ): Writer {
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): DeleteConfigNodeResponse {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseDeleteConfigNodeResponse,
    } as DeleteConfigNodeResponse;
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

  fromJSON(_: any): DeleteConfigNodeResponse {
    const message = {
      ...baseDeleteConfigNodeResponse,
    } as DeleteConfigNodeResponse;
    return message;
  },

  toJSON(_: DeleteConfigNodeResponse): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial(
    _: DeepPartial<DeleteConfigNodeResponse>
  ): DeleteConfigNodeResponse {
    const message = {
      ...baseDeleteConfigNodeResponse,
    } as DeleteConfigNodeResponse;
    return message;
  },
};

const baseCreateOAuth2ProviderRequest: object = { appSpaceId: "", name: "" };

export const CreateOAuth2ProviderRequest = {
  encode(
    message: CreateOAuth2ProviderRequest,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.appSpaceId !== "") {
      writer.uint32(10).string(message.appSpaceId);
    }
    if (message.name !== "") {
      writer.uint32(18).string(message.name);
    }
    if (message.displayName !== undefined) {
      StringValue.encode(
        { value: message.displayName! },
        writer.uint32(26).fork()
      ).ldelim();
    }
    if (message.description !== undefined) {
      StringValue.encode(
        { value: message.description! },
        writer.uint32(34).fork()
      ).ldelim();
    }
    if (message.config !== undefined) {
      OAuth2ProviderConfig.encode(
        message.config,
        writer.uint32(42).fork()
      ).ldelim();
    }
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): CreateOAuth2ProviderRequest {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseCreateOAuth2ProviderRequest,
    } as CreateOAuth2ProviderRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.appSpaceId = reader.string();
          break;
        case 2:
          message.name = reader.string();
          break;
        case 3:
          message.displayName = StringValue.decode(
            reader,
            reader.uint32()
          ).value;
          break;
        case 4:
          message.description = StringValue.decode(
            reader,
            reader.uint32()
          ).value;
          break;
        case 5:
          message.config = OAuth2ProviderConfig.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): CreateOAuth2ProviderRequest {
    const message = {
      ...baseCreateOAuth2ProviderRequest,
    } as CreateOAuth2ProviderRequest;
    if (object.appSpaceId !== undefined && object.appSpaceId !== null) {
      message.appSpaceId = String(object.appSpaceId);
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
    if (object.config !== undefined && object.config !== null) {
      message.config = OAuth2ProviderConfig.fromJSON(object.config);
    }
    return message;
  },

  toJSON(message: CreateOAuth2ProviderRequest): unknown {
    const obj: any = {};
    message.appSpaceId !== undefined && (obj.appSpaceId = message.appSpaceId);
    message.name !== undefined && (obj.name = message.name);
    message.displayName !== undefined &&
      (obj.displayName = message.displayName);
    message.description !== undefined &&
      (obj.description = message.description);
    message.config !== undefined &&
      (obj.config = message.config
        ? OAuth2ProviderConfig.toJSON(message.config)
        : undefined);
    return obj;
  },

  fromPartial(
    object: DeepPartial<CreateOAuth2ProviderRequest>
  ): CreateOAuth2ProviderRequest {
    const message = {
      ...baseCreateOAuth2ProviderRequest,
    } as CreateOAuth2ProviderRequest;
    if (object.appSpaceId !== undefined && object.appSpaceId !== null) {
      message.appSpaceId = object.appSpaceId;
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
    if (object.config !== undefined && object.config !== null) {
      message.config = OAuth2ProviderConfig.fromPartial(object.config);
    }
    return message;
  },
};

const baseCreateOAuth2ProviderResponse: object = { id: "", etag: "" };

export const CreateOAuth2ProviderResponse = {
  encode(
    message: CreateOAuth2ProviderResponse,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.createTime !== undefined) {
      Timestamp.encode(
        toTimestamp(message.createTime),
        writer.uint32(18).fork()
      ).ldelim();
    }
    if (message.updateTime !== undefined) {
      Timestamp.encode(
        toTimestamp(message.updateTime),
        writer.uint32(26).fork()
      ).ldelim();
    }
    if (message.etag !== "") {
      writer.uint32(34).string(message.etag);
    }
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): CreateOAuth2ProviderResponse {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseCreateOAuth2ProviderResponse,
    } as CreateOAuth2ProviderResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string();
          break;
        case 2:
          message.createTime = fromTimestamp(
            Timestamp.decode(reader, reader.uint32())
          );
          break;
        case 3:
          message.updateTime = fromTimestamp(
            Timestamp.decode(reader, reader.uint32())
          );
          break;
        case 4:
          message.etag = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): CreateOAuth2ProviderResponse {
    const message = {
      ...baseCreateOAuth2ProviderResponse,
    } as CreateOAuth2ProviderResponse;
    if (object.id !== undefined && object.id !== null) {
      message.id = String(object.id);
    }
    if (object.createTime !== undefined && object.createTime !== null) {
      message.createTime = fromJsonTimestamp(object.createTime);
    }
    if (object.updateTime !== undefined && object.updateTime !== null) {
      message.updateTime = fromJsonTimestamp(object.updateTime);
    }
    if (object.etag !== undefined && object.etag !== null) {
      message.etag = String(object.etag);
    }
    return message;
  },

  toJSON(message: CreateOAuth2ProviderResponse): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    message.createTime !== undefined &&
      (obj.createTime = message.createTime.toISOString());
    message.updateTime !== undefined &&
      (obj.updateTime = message.updateTime.toISOString());
    message.etag !== undefined && (obj.etag = message.etag);
    return obj;
  },

  fromPartial(
    object: DeepPartial<CreateOAuth2ProviderResponse>
  ): CreateOAuth2ProviderResponse {
    const message = {
      ...baseCreateOAuth2ProviderResponse,
    } as CreateOAuth2ProviderResponse;
    if (object.id !== undefined && object.id !== null) {
      message.id = object.id;
    }
    if (object.createTime !== undefined && object.createTime !== null) {
      message.createTime = object.createTime;
    }
    if (object.updateTime !== undefined && object.updateTime !== null) {
      message.updateTime = object.updateTime;
    }
    if (object.etag !== undefined && object.etag !== null) {
      message.etag = object.etag;
    }
    return message;
  },
};

const baseReadOAuth2ProviderRequest: object = { id: "" };

export const ReadOAuth2ProviderRequest = {
  encode(
    message: ReadOAuth2ProviderRequest,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): ReadOAuth2ProviderRequest {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseReadOAuth2ProviderRequest,
    } as ReadOAuth2ProviderRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ReadOAuth2ProviderRequest {
    const message = {
      ...baseReadOAuth2ProviderRequest,
    } as ReadOAuth2ProviderRequest;
    if (object.id !== undefined && object.id !== null) {
      message.id = String(object.id);
    }
    return message;
  },

  toJSON(message: ReadOAuth2ProviderRequest): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    return obj;
  },

  fromPartial(
    object: DeepPartial<ReadOAuth2ProviderRequest>
  ): ReadOAuth2ProviderRequest {
    const message = {
      ...baseReadOAuth2ProviderRequest,
    } as ReadOAuth2ProviderRequest;
    if (object.id !== undefined && object.id !== null) {
      message.id = object.id;
    }
    return message;
  },
};

const baseReadOAuth2ProviderResponse: object = {};

export const ReadOAuth2ProviderResponse = {
  encode(
    message: ReadOAuth2ProviderResponse,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.oauth2Provider !== undefined) {
      OAuth2Provider.encode(
        message.oauth2Provider,
        writer.uint32(10).fork()
      ).ldelim();
    }
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): ReadOAuth2ProviderResponse {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseReadOAuth2ProviderResponse,
    } as ReadOAuth2ProviderResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.oauth2Provider = OAuth2Provider.decode(
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

  fromJSON(object: any): ReadOAuth2ProviderResponse {
    const message = {
      ...baseReadOAuth2ProviderResponse,
    } as ReadOAuth2ProviderResponse;
    if (object.oauth2Provider !== undefined && object.oauth2Provider !== null) {
      message.oauth2Provider = OAuth2Provider.fromJSON(object.oauth2Provider);
    }
    return message;
  },

  toJSON(message: ReadOAuth2ProviderResponse): unknown {
    const obj: any = {};
    message.oauth2Provider !== undefined &&
      (obj.oauth2Provider = message.oauth2Provider
        ? OAuth2Provider.toJSON(message.oauth2Provider)
        : undefined);
    return obj;
  },

  fromPartial(
    object: DeepPartial<ReadOAuth2ProviderResponse>
  ): ReadOAuth2ProviderResponse {
    const message = {
      ...baseReadOAuth2ProviderResponse,
    } as ReadOAuth2ProviderResponse;
    if (object.oauth2Provider !== undefined && object.oauth2Provider !== null) {
      message.oauth2Provider = OAuth2Provider.fromPartial(
        object.oauth2Provider
      );
    }
    return message;
  },
};

const baseUpdateOAuth2ProviderRequest: object = { id: "" };

export const UpdateOAuth2ProviderRequest = {
  encode(
    message: UpdateOAuth2ProviderRequest,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.etag !== undefined) {
      StringValue.encode(
        { value: message.etag! },
        writer.uint32(18).fork()
      ).ldelim();
    }
    if (message.displayName !== undefined) {
      StringValue.encode(
        { value: message.displayName! },
        writer.uint32(26).fork()
      ).ldelim();
    }
    if (message.description !== undefined) {
      StringValue.encode(
        { value: message.description! },
        writer.uint32(34).fork()
      ).ldelim();
    }
    if (message.config !== undefined) {
      OAuth2ProviderConfig.encode(
        message.config,
        writer.uint32(42).fork()
      ).ldelim();
    }
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): UpdateOAuth2ProviderRequest {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseUpdateOAuth2ProviderRequest,
    } as UpdateOAuth2ProviderRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string();
          break;
        case 2:
          message.etag = StringValue.decode(reader, reader.uint32()).value;
          break;
        case 3:
          message.displayName = StringValue.decode(
            reader,
            reader.uint32()
          ).value;
          break;
        case 4:
          message.description = StringValue.decode(
            reader,
            reader.uint32()
          ).value;
          break;
        case 5:
          message.config = OAuth2ProviderConfig.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): UpdateOAuth2ProviderRequest {
    const message = {
      ...baseUpdateOAuth2ProviderRequest,
    } as UpdateOAuth2ProviderRequest;
    if (object.id !== undefined && object.id !== null) {
      message.id = String(object.id);
    }
    if (object.etag !== undefined && object.etag !== null) {
      message.etag = String(object.etag);
    }
    if (object.displayName !== undefined && object.displayName !== null) {
      message.displayName = String(object.displayName);
    }
    if (object.description !== undefined && object.description !== null) {
      message.description = String(object.description);
    }
    if (object.config !== undefined && object.config !== null) {
      message.config = OAuth2ProviderConfig.fromJSON(object.config);
    }
    return message;
  },

  toJSON(message: UpdateOAuth2ProviderRequest): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    message.etag !== undefined && (obj.etag = message.etag);
    message.displayName !== undefined &&
      (obj.displayName = message.displayName);
    message.description !== undefined &&
      (obj.description = message.description);
    message.config !== undefined &&
      (obj.config = message.config
        ? OAuth2ProviderConfig.toJSON(message.config)
        : undefined);
    return obj;
  },

  fromPartial(
    object: DeepPartial<UpdateOAuth2ProviderRequest>
  ): UpdateOAuth2ProviderRequest {
    const message = {
      ...baseUpdateOAuth2ProviderRequest,
    } as UpdateOAuth2ProviderRequest;
    if (object.id !== undefined && object.id !== null) {
      message.id = object.id;
    }
    if (object.etag !== undefined && object.etag !== null) {
      message.etag = object.etag;
    }
    if (object.displayName !== undefined && object.displayName !== null) {
      message.displayName = object.displayName;
    }
    if (object.description !== undefined && object.description !== null) {
      message.description = object.description;
    }
    if (object.config !== undefined && object.config !== null) {
      message.config = OAuth2ProviderConfig.fromPartial(object.config);
    }
    return message;
  },
};

const baseUpdateOAuth2ProviderResponse: object = { id: "", etag: "" };

export const UpdateOAuth2ProviderResponse = {
  encode(
    message: UpdateOAuth2ProviderResponse,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.updateTime !== undefined) {
      Timestamp.encode(
        toTimestamp(message.updateTime),
        writer.uint32(18).fork()
      ).ldelim();
    }
    if (message.etag !== "") {
      writer.uint32(26).string(message.etag);
    }
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): UpdateOAuth2ProviderResponse {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseUpdateOAuth2ProviderResponse,
    } as UpdateOAuth2ProviderResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string();
          break;
        case 2:
          message.updateTime = fromTimestamp(
            Timestamp.decode(reader, reader.uint32())
          );
          break;
        case 3:
          message.etag = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): UpdateOAuth2ProviderResponse {
    const message = {
      ...baseUpdateOAuth2ProviderResponse,
    } as UpdateOAuth2ProviderResponse;
    if (object.id !== undefined && object.id !== null) {
      message.id = String(object.id);
    }
    if (object.updateTime !== undefined && object.updateTime !== null) {
      message.updateTime = fromJsonTimestamp(object.updateTime);
    }
    if (object.etag !== undefined && object.etag !== null) {
      message.etag = String(object.etag);
    }
    return message;
  },

  toJSON(message: UpdateOAuth2ProviderResponse): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    message.updateTime !== undefined &&
      (obj.updateTime = message.updateTime.toISOString());
    message.etag !== undefined && (obj.etag = message.etag);
    return obj;
  },

  fromPartial(
    object: DeepPartial<UpdateOAuth2ProviderResponse>
  ): UpdateOAuth2ProviderResponse {
    const message = {
      ...baseUpdateOAuth2ProviderResponse,
    } as UpdateOAuth2ProviderResponse;
    if (object.id !== undefined && object.id !== null) {
      message.id = object.id;
    }
    if (object.updateTime !== undefined && object.updateTime !== null) {
      message.updateTime = object.updateTime;
    }
    if (object.etag !== undefined && object.etag !== null) {
      message.etag = object.etag;
    }
    return message;
  },
};

const baseDeleteOAuth2ProviderRequest: object = { id: "" };

export const DeleteOAuth2ProviderRequest = {
  encode(
    message: DeleteOAuth2ProviderRequest,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.etag !== undefined) {
      StringValue.encode(
        { value: message.etag! },
        writer.uint32(18).fork()
      ).ldelim();
    }
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): DeleteOAuth2ProviderRequest {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseDeleteOAuth2ProviderRequest,
    } as DeleteOAuth2ProviderRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string();
          break;
        case 2:
          message.etag = StringValue.decode(reader, reader.uint32()).value;
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): DeleteOAuth2ProviderRequest {
    const message = {
      ...baseDeleteOAuth2ProviderRequest,
    } as DeleteOAuth2ProviderRequest;
    if (object.id !== undefined && object.id !== null) {
      message.id = String(object.id);
    }
    if (object.etag !== undefined && object.etag !== null) {
      message.etag = String(object.etag);
    }
    return message;
  },

  toJSON(message: DeleteOAuth2ProviderRequest): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    message.etag !== undefined && (obj.etag = message.etag);
    return obj;
  },

  fromPartial(
    object: DeepPartial<DeleteOAuth2ProviderRequest>
  ): DeleteOAuth2ProviderRequest {
    const message = {
      ...baseDeleteOAuth2ProviderRequest,
    } as DeleteOAuth2ProviderRequest;
    if (object.id !== undefined && object.id !== null) {
      message.id = object.id;
    }
    if (object.etag !== undefined && object.etag !== null) {
      message.etag = object.etag;
    }
    return message;
  },
};

const baseDeleteOAuth2ProviderResponse: object = {};

export const DeleteOAuth2ProviderResponse = {
  encode(
    _: DeleteOAuth2ProviderResponse,
    writer: Writer = Writer.create()
  ): Writer {
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): DeleteOAuth2ProviderResponse {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseDeleteOAuth2ProviderResponse,
    } as DeleteOAuth2ProviderResponse;
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

  fromJSON(_: any): DeleteOAuth2ProviderResponse {
    const message = {
      ...baseDeleteOAuth2ProviderResponse,
    } as DeleteOAuth2ProviderResponse;
    return message;
  },

  toJSON(_: DeleteOAuth2ProviderResponse): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial(
    _: DeepPartial<DeleteOAuth2ProviderResponse>
  ): DeleteOAuth2ProviderResponse {
    const message = {
      ...baseDeleteOAuth2ProviderResponse,
    } as DeleteOAuth2ProviderResponse;
    return message;
  },
};

const baseCreateOAuth2ApplicationRequest: object = {
  oauth2ProviderId: "",
  name: "",
};

export const CreateOAuth2ApplicationRequest = {
  encode(
    message: CreateOAuth2ApplicationRequest,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.oauth2ProviderId !== "") {
      writer.uint32(10).string(message.oauth2ProviderId);
    }
    if (message.name !== "") {
      writer.uint32(18).string(message.name);
    }
    if (message.displayName !== undefined) {
      StringValue.encode(
        { value: message.displayName! },
        writer.uint32(26).fork()
      ).ldelim();
    }
    if (message.description !== undefined) {
      StringValue.encode(
        { value: message.description! },
        writer.uint32(34).fork()
      ).ldelim();
    }
    if (message.config !== undefined) {
      OAuth2ApplicationConfig.encode(
        message.config,
        writer.uint32(42).fork()
      ).ldelim();
    }
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): CreateOAuth2ApplicationRequest {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseCreateOAuth2ApplicationRequest,
    } as CreateOAuth2ApplicationRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.oauth2ProviderId = reader.string();
          break;
        case 2:
          message.name = reader.string();
          break;
        case 3:
          message.displayName = StringValue.decode(
            reader,
            reader.uint32()
          ).value;
          break;
        case 4:
          message.description = StringValue.decode(
            reader,
            reader.uint32()
          ).value;
          break;
        case 5:
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

  fromJSON(object: any): CreateOAuth2ApplicationRequest {
    const message = {
      ...baseCreateOAuth2ApplicationRequest,
    } as CreateOAuth2ApplicationRequest;
    if (
      object.oauth2ProviderId !== undefined &&
      object.oauth2ProviderId !== null
    ) {
      message.oauth2ProviderId = String(object.oauth2ProviderId);
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
    if (object.config !== undefined && object.config !== null) {
      message.config = OAuth2ApplicationConfig.fromJSON(object.config);
    }
    return message;
  },

  toJSON(message: CreateOAuth2ApplicationRequest): unknown {
    const obj: any = {};
    message.oauth2ProviderId !== undefined &&
      (obj.oauth2ProviderId = message.oauth2ProviderId);
    message.name !== undefined && (obj.name = message.name);
    message.displayName !== undefined &&
      (obj.displayName = message.displayName);
    message.description !== undefined &&
      (obj.description = message.description);
    message.config !== undefined &&
      (obj.config = message.config
        ? OAuth2ApplicationConfig.toJSON(message.config)
        : undefined);
    return obj;
  },

  fromPartial(
    object: DeepPartial<CreateOAuth2ApplicationRequest>
  ): CreateOAuth2ApplicationRequest {
    const message = {
      ...baseCreateOAuth2ApplicationRequest,
    } as CreateOAuth2ApplicationRequest;
    if (
      object.oauth2ProviderId !== undefined &&
      object.oauth2ProviderId !== null
    ) {
      message.oauth2ProviderId = object.oauth2ProviderId;
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
    if (object.config !== undefined && object.config !== null) {
      message.config = OAuth2ApplicationConfig.fromPartial(object.config);
    }
    return message;
  },
};

const baseCreateOAuth2ApplicationResponse: object = {
  id: "",
  etag: "",
  clientId: "",
  clientSecret: "",
};

export const CreateOAuth2ApplicationResponse = {
  encode(
    message: CreateOAuth2ApplicationResponse,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.createTime !== undefined) {
      Timestamp.encode(
        toTimestamp(message.createTime),
        writer.uint32(18).fork()
      ).ldelim();
    }
    if (message.updateTime !== undefined) {
      Timestamp.encode(
        toTimestamp(message.updateTime),
        writer.uint32(26).fork()
      ).ldelim();
    }
    if (message.etag !== "") {
      writer.uint32(34).string(message.etag);
    }
    if (message.clientId !== "") {
      writer.uint32(42).string(message.clientId);
    }
    if (message.clientSecret !== "") {
      writer.uint32(50).string(message.clientSecret);
    }
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): CreateOAuth2ApplicationResponse {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseCreateOAuth2ApplicationResponse,
    } as CreateOAuth2ApplicationResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string();
          break;
        case 2:
          message.createTime = fromTimestamp(
            Timestamp.decode(reader, reader.uint32())
          );
          break;
        case 3:
          message.updateTime = fromTimestamp(
            Timestamp.decode(reader, reader.uint32())
          );
          break;
        case 4:
          message.etag = reader.string();
          break;
        case 5:
          message.clientId = reader.string();
          break;
        case 6:
          message.clientSecret = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): CreateOAuth2ApplicationResponse {
    const message = {
      ...baseCreateOAuth2ApplicationResponse,
    } as CreateOAuth2ApplicationResponse;
    if (object.id !== undefined && object.id !== null) {
      message.id = String(object.id);
    }
    if (object.createTime !== undefined && object.createTime !== null) {
      message.createTime = fromJsonTimestamp(object.createTime);
    }
    if (object.updateTime !== undefined && object.updateTime !== null) {
      message.updateTime = fromJsonTimestamp(object.updateTime);
    }
    if (object.etag !== undefined && object.etag !== null) {
      message.etag = String(object.etag);
    }
    if (object.clientId !== undefined && object.clientId !== null) {
      message.clientId = String(object.clientId);
    }
    if (object.clientSecret !== undefined && object.clientSecret !== null) {
      message.clientSecret = String(object.clientSecret);
    }
    return message;
  },

  toJSON(message: CreateOAuth2ApplicationResponse): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    message.createTime !== undefined &&
      (obj.createTime = message.createTime.toISOString());
    message.updateTime !== undefined &&
      (obj.updateTime = message.updateTime.toISOString());
    message.etag !== undefined && (obj.etag = message.etag);
    message.clientId !== undefined && (obj.clientId = message.clientId);
    message.clientSecret !== undefined &&
      (obj.clientSecret = message.clientSecret);
    return obj;
  },

  fromPartial(
    object: DeepPartial<CreateOAuth2ApplicationResponse>
  ): CreateOAuth2ApplicationResponse {
    const message = {
      ...baseCreateOAuth2ApplicationResponse,
    } as CreateOAuth2ApplicationResponse;
    if (object.id !== undefined && object.id !== null) {
      message.id = object.id;
    }
    if (object.createTime !== undefined && object.createTime !== null) {
      message.createTime = object.createTime;
    }
    if (object.updateTime !== undefined && object.updateTime !== null) {
      message.updateTime = object.updateTime;
    }
    if (object.etag !== undefined && object.etag !== null) {
      message.etag = object.etag;
    }
    if (object.clientId !== undefined && object.clientId !== null) {
      message.clientId = object.clientId;
    }
    if (object.clientSecret !== undefined && object.clientSecret !== null) {
      message.clientSecret = object.clientSecret;
    }
    return message;
  },
};

const baseReadOAuth2ApplicationRequest: object = { id: "" };

export const ReadOAuth2ApplicationRequest = {
  encode(
    message: ReadOAuth2ApplicationRequest,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): ReadOAuth2ApplicationRequest {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseReadOAuth2ApplicationRequest,
    } as ReadOAuth2ApplicationRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ReadOAuth2ApplicationRequest {
    const message = {
      ...baseReadOAuth2ApplicationRequest,
    } as ReadOAuth2ApplicationRequest;
    if (object.id !== undefined && object.id !== null) {
      message.id = String(object.id);
    }
    return message;
  },

  toJSON(message: ReadOAuth2ApplicationRequest): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    return obj;
  },

  fromPartial(
    object: DeepPartial<ReadOAuth2ApplicationRequest>
  ): ReadOAuth2ApplicationRequest {
    const message = {
      ...baseReadOAuth2ApplicationRequest,
    } as ReadOAuth2ApplicationRequest;
    if (object.id !== undefined && object.id !== null) {
      message.id = object.id;
    }
    return message;
  },
};

const baseReadOAuth2ApplicationResponse: object = {};

export const ReadOAuth2ApplicationResponse = {
  encode(
    message: ReadOAuth2ApplicationResponse,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.oauth2Application !== undefined) {
      OAuth2Application.encode(
        message.oauth2Application,
        writer.uint32(10).fork()
      ).ldelim();
    }
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): ReadOAuth2ApplicationResponse {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseReadOAuth2ApplicationResponse,
    } as ReadOAuth2ApplicationResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.oauth2Application = OAuth2Application.decode(
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

  fromJSON(object: any): ReadOAuth2ApplicationResponse {
    const message = {
      ...baseReadOAuth2ApplicationResponse,
    } as ReadOAuth2ApplicationResponse;
    if (
      object.oauth2Application !== undefined &&
      object.oauth2Application !== null
    ) {
      message.oauth2Application = OAuth2Application.fromJSON(
        object.oauth2Application
      );
    }
    return message;
  },

  toJSON(message: ReadOAuth2ApplicationResponse): unknown {
    const obj: any = {};
    message.oauth2Application !== undefined &&
      (obj.oauth2Application = message.oauth2Application
        ? OAuth2Application.toJSON(message.oauth2Application)
        : undefined);
    return obj;
  },

  fromPartial(
    object: DeepPartial<ReadOAuth2ApplicationResponse>
  ): ReadOAuth2ApplicationResponse {
    const message = {
      ...baseReadOAuth2ApplicationResponse,
    } as ReadOAuth2ApplicationResponse;
    if (
      object.oauth2Application !== undefined &&
      object.oauth2Application !== null
    ) {
      message.oauth2Application = OAuth2Application.fromPartial(
        object.oauth2Application
      );
    }
    return message;
  },
};

const baseUpdateOAuth2ApplicationRequest: object = { id: "" };

export const UpdateOAuth2ApplicationRequest = {
  encode(
    message: UpdateOAuth2ApplicationRequest,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.etag !== undefined) {
      StringValue.encode(
        { value: message.etag! },
        writer.uint32(18).fork()
      ).ldelim();
    }
    if (message.displayName !== undefined) {
      StringValue.encode(
        { value: message.displayName! },
        writer.uint32(26).fork()
      ).ldelim();
    }
    if (message.description !== undefined) {
      StringValue.encode(
        { value: message.description! },
        writer.uint32(34).fork()
      ).ldelim();
    }
    if (message.config !== undefined) {
      OAuth2ApplicationConfig.encode(
        message.config,
        writer.uint32(42).fork()
      ).ldelim();
    }
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): UpdateOAuth2ApplicationRequest {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseUpdateOAuth2ApplicationRequest,
    } as UpdateOAuth2ApplicationRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string();
          break;
        case 2:
          message.etag = StringValue.decode(reader, reader.uint32()).value;
          break;
        case 3:
          message.displayName = StringValue.decode(
            reader,
            reader.uint32()
          ).value;
          break;
        case 4:
          message.description = StringValue.decode(
            reader,
            reader.uint32()
          ).value;
          break;
        case 5:
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

  fromJSON(object: any): UpdateOAuth2ApplicationRequest {
    const message = {
      ...baseUpdateOAuth2ApplicationRequest,
    } as UpdateOAuth2ApplicationRequest;
    if (object.id !== undefined && object.id !== null) {
      message.id = String(object.id);
    }
    if (object.etag !== undefined && object.etag !== null) {
      message.etag = String(object.etag);
    }
    if (object.displayName !== undefined && object.displayName !== null) {
      message.displayName = String(object.displayName);
    }
    if (object.description !== undefined && object.description !== null) {
      message.description = String(object.description);
    }
    if (object.config !== undefined && object.config !== null) {
      message.config = OAuth2ApplicationConfig.fromJSON(object.config);
    }
    return message;
  },

  toJSON(message: UpdateOAuth2ApplicationRequest): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    message.etag !== undefined && (obj.etag = message.etag);
    message.displayName !== undefined &&
      (obj.displayName = message.displayName);
    message.description !== undefined &&
      (obj.description = message.description);
    message.config !== undefined &&
      (obj.config = message.config
        ? OAuth2ApplicationConfig.toJSON(message.config)
        : undefined);
    return obj;
  },

  fromPartial(
    object: DeepPartial<UpdateOAuth2ApplicationRequest>
  ): UpdateOAuth2ApplicationRequest {
    const message = {
      ...baseUpdateOAuth2ApplicationRequest,
    } as UpdateOAuth2ApplicationRequest;
    if (object.id !== undefined && object.id !== null) {
      message.id = object.id;
    }
    if (object.etag !== undefined && object.etag !== null) {
      message.etag = object.etag;
    }
    if (object.displayName !== undefined && object.displayName !== null) {
      message.displayName = object.displayName;
    }
    if (object.description !== undefined && object.description !== null) {
      message.description = object.description;
    }
    if (object.config !== undefined && object.config !== null) {
      message.config = OAuth2ApplicationConfig.fromPartial(object.config);
    }
    return message;
  },
};

const baseUpdateOAuth2ApplicationResponse: object = { id: "", etag: "" };

export const UpdateOAuth2ApplicationResponse = {
  encode(
    message: UpdateOAuth2ApplicationResponse,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.updateTime !== undefined) {
      Timestamp.encode(
        toTimestamp(message.updateTime),
        writer.uint32(18).fork()
      ).ldelim();
    }
    if (message.etag !== "") {
      writer.uint32(26).string(message.etag);
    }
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): UpdateOAuth2ApplicationResponse {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseUpdateOAuth2ApplicationResponse,
    } as UpdateOAuth2ApplicationResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string();
          break;
        case 2:
          message.updateTime = fromTimestamp(
            Timestamp.decode(reader, reader.uint32())
          );
          break;
        case 3:
          message.etag = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): UpdateOAuth2ApplicationResponse {
    const message = {
      ...baseUpdateOAuth2ApplicationResponse,
    } as UpdateOAuth2ApplicationResponse;
    if (object.id !== undefined && object.id !== null) {
      message.id = String(object.id);
    }
    if (object.updateTime !== undefined && object.updateTime !== null) {
      message.updateTime = fromJsonTimestamp(object.updateTime);
    }
    if (object.etag !== undefined && object.etag !== null) {
      message.etag = String(object.etag);
    }
    return message;
  },

  toJSON(message: UpdateOAuth2ApplicationResponse): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    message.updateTime !== undefined &&
      (obj.updateTime = message.updateTime.toISOString());
    message.etag !== undefined && (obj.etag = message.etag);
    return obj;
  },

  fromPartial(
    object: DeepPartial<UpdateOAuth2ApplicationResponse>
  ): UpdateOAuth2ApplicationResponse {
    const message = {
      ...baseUpdateOAuth2ApplicationResponse,
    } as UpdateOAuth2ApplicationResponse;
    if (object.id !== undefined && object.id !== null) {
      message.id = object.id;
    }
    if (object.updateTime !== undefined && object.updateTime !== null) {
      message.updateTime = object.updateTime;
    }
    if (object.etag !== undefined && object.etag !== null) {
      message.etag = object.etag;
    }
    return message;
  },
};

const baseDeleteOAuth2ApplicationRequest: object = { id: "" };

export const DeleteOAuth2ApplicationRequest = {
  encode(
    message: DeleteOAuth2ApplicationRequest,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.etag !== undefined) {
      StringValue.encode(
        { value: message.etag! },
        writer.uint32(18).fork()
      ).ldelim();
    }
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): DeleteOAuth2ApplicationRequest {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseDeleteOAuth2ApplicationRequest,
    } as DeleteOAuth2ApplicationRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string();
          break;
        case 2:
          message.etag = StringValue.decode(reader, reader.uint32()).value;
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): DeleteOAuth2ApplicationRequest {
    const message = {
      ...baseDeleteOAuth2ApplicationRequest,
    } as DeleteOAuth2ApplicationRequest;
    if (object.id !== undefined && object.id !== null) {
      message.id = String(object.id);
    }
    if (object.etag !== undefined && object.etag !== null) {
      message.etag = String(object.etag);
    }
    return message;
  },

  toJSON(message: DeleteOAuth2ApplicationRequest): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    message.etag !== undefined && (obj.etag = message.etag);
    return obj;
  },

  fromPartial(
    object: DeepPartial<DeleteOAuth2ApplicationRequest>
  ): DeleteOAuth2ApplicationRequest {
    const message = {
      ...baseDeleteOAuth2ApplicationRequest,
    } as DeleteOAuth2ApplicationRequest;
    if (object.id !== undefined && object.id !== null) {
      message.id = object.id;
    }
    if (object.etag !== undefined && object.etag !== null) {
      message.etag = object.etag;
    }
    return message;
  },
};

const baseDeleteOAuth2ApplicationResponse: object = {};

export const DeleteOAuth2ApplicationResponse = {
  encode(
    _: DeleteOAuth2ApplicationResponse,
    writer: Writer = Writer.create()
  ): Writer {
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): DeleteOAuth2ApplicationResponse {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseDeleteOAuth2ApplicationResponse,
    } as DeleteOAuth2ApplicationResponse;
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

  fromJSON(_: any): DeleteOAuth2ApplicationResponse {
    const message = {
      ...baseDeleteOAuth2ApplicationResponse,
    } as DeleteOAuth2ApplicationResponse;
    return message;
  },

  toJSON(_: DeleteOAuth2ApplicationResponse): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial(
    _: DeepPartial<DeleteOAuth2ApplicationResponse>
  ): DeleteOAuth2ApplicationResponse {
    const message = {
      ...baseDeleteOAuth2ApplicationResponse,
    } as DeleteOAuth2ApplicationResponse;
    return message;
  },
};

/** ConfigManagementAPI provides the operations to mange the IndyKite platform configurations. */
export const ConfigManagementAPIService = {
  /** ReadCustomer Reads a customer. */
  readCustomer: {
    path: "/indykite.config.v1beta1.ConfigManagementAPI/ReadCustomer",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: ReadCustomerRequest) =>
      Buffer.from(ReadCustomerRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => ReadCustomerRequest.decode(value),
    responseSerialize: (value: ReadCustomerResponse) =>
      Buffer.from(ReadCustomerResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) => ReadCustomerResponse.decode(value),
  },
  /** CreateApplicationSpace ... */
  createApplicationSpace: {
    path: "/indykite.config.v1beta1.ConfigManagementAPI/CreateApplicationSpace",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: CreateApplicationSpaceRequest) =>
      Buffer.from(CreateApplicationSpaceRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) =>
      CreateApplicationSpaceRequest.decode(value),
    responseSerialize: (value: CreateApplicationSpaceResponse) =>
      Buffer.from(CreateApplicationSpaceResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) =>
      CreateApplicationSpaceResponse.decode(value),
  },
  readApplicationSpace: {
    path: "/indykite.config.v1beta1.ConfigManagementAPI/ReadApplicationSpace",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: ReadApplicationSpaceRequest) =>
      Buffer.from(ReadApplicationSpaceRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) =>
      ReadApplicationSpaceRequest.decode(value),
    responseSerialize: (value: ReadApplicationSpaceResponse) =>
      Buffer.from(ReadApplicationSpaceResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) =>
      ReadApplicationSpaceResponse.decode(value),
  },
  listApplicationSpaces: {
    path: "/indykite.config.v1beta1.ConfigManagementAPI/ListApplicationSpaces",
    requestStream: false,
    responseStream: true,
    requestSerialize: (value: ListApplicationSpacesRequest) =>
      Buffer.from(ListApplicationSpacesRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) =>
      ListApplicationSpacesRequest.decode(value),
    responseSerialize: (value: ListApplicationSpacesResponse) =>
      Buffer.from(ListApplicationSpacesResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) =>
      ListApplicationSpacesResponse.decode(value),
  },
  updateApplicationSpace: {
    path: "/indykite.config.v1beta1.ConfigManagementAPI/UpdateApplicationSpace",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: UpdateApplicationSpaceRequest) =>
      Buffer.from(UpdateApplicationSpaceRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) =>
      UpdateApplicationSpaceRequest.decode(value),
    responseSerialize: (value: UpdateApplicationSpaceResponse) =>
      Buffer.from(UpdateApplicationSpaceResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) =>
      UpdateApplicationSpaceResponse.decode(value),
  },
  deleteApplicationSpace: {
    path: "/indykite.config.v1beta1.ConfigManagementAPI/DeleteApplicationSpace",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: DeleteApplicationSpaceRequest) =>
      Buffer.from(DeleteApplicationSpaceRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) =>
      DeleteApplicationSpaceRequest.decode(value),
    responseSerialize: (value: DeleteApplicationSpaceResponse) =>
      Buffer.from(DeleteApplicationSpaceResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) =>
      DeleteApplicationSpaceResponse.decode(value),
  },
  /** CreateApplication ... */
  createApplication: {
    path: "/indykite.config.v1beta1.ConfigManagementAPI/CreateApplication",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: CreateApplicationRequest) =>
      Buffer.from(CreateApplicationRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) =>
      CreateApplicationRequest.decode(value),
    responseSerialize: (value: CreateApplicationResponse) =>
      Buffer.from(CreateApplicationResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) =>
      CreateApplicationResponse.decode(value),
  },
  readApplication: {
    path: "/indykite.config.v1beta1.ConfigManagementAPI/ReadApplication",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: ReadApplicationRequest) =>
      Buffer.from(ReadApplicationRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => ReadApplicationRequest.decode(value),
    responseSerialize: (value: ReadApplicationResponse) =>
      Buffer.from(ReadApplicationResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) =>
      ReadApplicationResponse.decode(value),
  },
  listApplications: {
    path: "/indykite.config.v1beta1.ConfigManagementAPI/ListApplications",
    requestStream: false,
    responseStream: true,
    requestSerialize: (value: ListApplicationsRequest) =>
      Buffer.from(ListApplicationsRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) =>
      ListApplicationsRequest.decode(value),
    responseSerialize: (value: ListApplicationsResponse) =>
      Buffer.from(ListApplicationsResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) =>
      ListApplicationsResponse.decode(value),
  },
  updateApplication: {
    path: "/indykite.config.v1beta1.ConfigManagementAPI/UpdateApplication",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: UpdateApplicationRequest) =>
      Buffer.from(UpdateApplicationRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) =>
      UpdateApplicationRequest.decode(value),
    responseSerialize: (value: UpdateApplicationResponse) =>
      Buffer.from(UpdateApplicationResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) =>
      UpdateApplicationResponse.decode(value),
  },
  deleteApplication: {
    path: "/indykite.config.v1beta1.ConfigManagementAPI/DeleteApplication",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: DeleteApplicationRequest) =>
      Buffer.from(DeleteApplicationRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) =>
      DeleteApplicationRequest.decode(value),
    responseSerialize: (value: DeleteApplicationResponse) =>
      Buffer.from(DeleteApplicationResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) =>
      DeleteApplicationResponse.decode(value),
  },
  /** CreateApplicationAgent ... */
  createApplicationAgent: {
    path: "/indykite.config.v1beta1.ConfigManagementAPI/CreateApplicationAgent",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: CreateApplicationAgentRequest) =>
      Buffer.from(CreateApplicationAgentRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) =>
      CreateApplicationAgentRequest.decode(value),
    responseSerialize: (value: CreateApplicationAgentResponse) =>
      Buffer.from(CreateApplicationAgentResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) =>
      CreateApplicationAgentResponse.decode(value),
  },
  readApplicationAgent: {
    path: "/indykite.config.v1beta1.ConfigManagementAPI/ReadApplicationAgent",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: ReadApplicationAgentRequest) =>
      Buffer.from(ReadApplicationAgentRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) =>
      ReadApplicationAgentRequest.decode(value),
    responseSerialize: (value: ReadApplicationAgentResponse) =>
      Buffer.from(ReadApplicationAgentResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) =>
      ReadApplicationAgentResponse.decode(value),
  },
  listApplicationAgents: {
    path: "/indykite.config.v1beta1.ConfigManagementAPI/ListApplicationAgents",
    requestStream: false,
    responseStream: true,
    requestSerialize: (value: ListApplicationAgentsRequest) =>
      Buffer.from(ListApplicationAgentsRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) =>
      ListApplicationAgentsRequest.decode(value),
    responseSerialize: (value: ListApplicationAgentsResponse) =>
      Buffer.from(ListApplicationAgentsResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) =>
      ListApplicationAgentsResponse.decode(value),
  },
  updateApplicationAgent: {
    path: "/indykite.config.v1beta1.ConfigManagementAPI/UpdateApplicationAgent",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: UpdateApplicationAgentRequest) =>
      Buffer.from(UpdateApplicationAgentRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) =>
      UpdateApplicationAgentRequest.decode(value),
    responseSerialize: (value: UpdateApplicationAgentResponse) =>
      Buffer.from(UpdateApplicationAgentResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) =>
      UpdateApplicationAgentResponse.decode(value),
  },
  deleteApplicationAgent: {
    path: "/indykite.config.v1beta1.ConfigManagementAPI/DeleteApplicationAgent",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: DeleteApplicationAgentRequest) =>
      Buffer.from(DeleteApplicationAgentRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) =>
      DeleteApplicationAgentRequest.decode(value),
    responseSerialize: (value: DeleteApplicationAgentResponse) =>
      Buffer.from(DeleteApplicationAgentResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) =>
      DeleteApplicationAgentResponse.decode(value),
  },
  registerApplicationAgentCredential: {
    path: "/indykite.config.v1beta1.ConfigManagementAPI/RegisterApplicationAgentCredential",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: RegisterApplicationAgentCredentialRequest) =>
      Buffer.from(
        RegisterApplicationAgentCredentialRequest.encode(value).finish()
      ),
    requestDeserialize: (value: Buffer) =>
      RegisterApplicationAgentCredentialRequest.decode(value),
    responseSerialize: (value: RegisterApplicationAgentCredentialResponse) =>
      Buffer.from(
        RegisterApplicationAgentCredentialResponse.encode(value).finish()
      ),
    responseDeserialize: (value: Buffer) =>
      RegisterApplicationAgentCredentialResponse.decode(value),
  },
  readApplicationAgentCredential: {
    path: "/indykite.config.v1beta1.ConfigManagementAPI/ReadApplicationAgentCredential",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: ReadApplicationAgentCredentialRequest) =>
      Buffer.from(ReadApplicationAgentCredentialRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) =>
      ReadApplicationAgentCredentialRequest.decode(value),
    responseSerialize: (value: ReadApplicationAgentCredentialResponse) =>
      Buffer.from(
        ReadApplicationAgentCredentialResponse.encode(value).finish()
      ),
    responseDeserialize: (value: Buffer) =>
      ReadApplicationAgentCredentialResponse.decode(value),
  },
  deleteApplicationAgentCredential: {
    path: "/indykite.config.v1beta1.ConfigManagementAPI/DeleteApplicationAgentCredential",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: DeleteApplicationAgentCredentialRequest) =>
      Buffer.from(
        DeleteApplicationAgentCredentialRequest.encode(value).finish()
      ),
    requestDeserialize: (value: Buffer) =>
      DeleteApplicationAgentCredentialRequest.decode(value),
    responseSerialize: (value: DeleteApplicationAgentCredentialResponse) =>
      Buffer.from(
        DeleteApplicationAgentCredentialResponse.encode(value).finish()
      ),
    responseDeserialize: (value: Buffer) =>
      DeleteApplicationAgentCredentialResponse.decode(value),
  },
  /** CreateTenant ... */
  createTenant: {
    path: "/indykite.config.v1beta1.ConfigManagementAPI/CreateTenant",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: CreateTenantRequest) =>
      Buffer.from(CreateTenantRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => CreateTenantRequest.decode(value),
    responseSerialize: (value: CreateTenantResponse) =>
      Buffer.from(CreateTenantResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) => CreateTenantResponse.decode(value),
  },
  readTenant: {
    path: "/indykite.config.v1beta1.ConfigManagementAPI/ReadTenant",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: ReadTenantRequest) =>
      Buffer.from(ReadTenantRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => ReadTenantRequest.decode(value),
    responseSerialize: (value: ReadTenantResponse) =>
      Buffer.from(ReadTenantResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) => ReadTenantResponse.decode(value),
  },
  listTenants: {
    path: "/indykite.config.v1beta1.ConfigManagementAPI/ListTenants",
    requestStream: false,
    responseStream: true,
    requestSerialize: (value: ListTenantsRequest) =>
      Buffer.from(ListTenantsRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => ListTenantsRequest.decode(value),
    responseSerialize: (value: ListTenantsResponse) =>
      Buffer.from(ListTenantsResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) => ListTenantsResponse.decode(value),
  },
  updateTenant: {
    path: "/indykite.config.v1beta1.ConfigManagementAPI/UpdateTenant",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: UpdateTenantRequest) =>
      Buffer.from(UpdateTenantRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => UpdateTenantRequest.decode(value),
    responseSerialize: (value: UpdateTenantResponse) =>
      Buffer.from(UpdateTenantResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) => UpdateTenantResponse.decode(value),
  },
  deleteTenant: {
    path: "/indykite.config.v1beta1.ConfigManagementAPI/DeleteTenant",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: DeleteTenantRequest) =>
      Buffer.from(DeleteTenantRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => DeleteTenantRequest.decode(value),
    responseSerialize: (value: DeleteTenantResponse) =>
      Buffer.from(DeleteTenantResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) => DeleteTenantResponse.decode(value),
  },
  /** CreateConfigNode ... */
  createConfigNode: {
    path: "/indykite.config.v1beta1.ConfigManagementAPI/CreateConfigNode",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: CreateConfigNodeRequest) =>
      Buffer.from(CreateConfigNodeRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) =>
      CreateConfigNodeRequest.decode(value),
    responseSerialize: (value: CreateConfigNodeResponse) =>
      Buffer.from(CreateConfigNodeResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) =>
      CreateConfigNodeResponse.decode(value),
  },
  readConfigNode: {
    path: "/indykite.config.v1beta1.ConfigManagementAPI/ReadConfigNode",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: ReadConfigNodeRequest) =>
      Buffer.from(ReadConfigNodeRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => ReadConfigNodeRequest.decode(value),
    responseSerialize: (value: ReadConfigNodeResponse) =>
      Buffer.from(ReadConfigNodeResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) =>
      ReadConfigNodeResponse.decode(value),
  },
  /** rpc ListConfigNodes(ListConfigNodesRequest) returns (stream ReadConfigNodeResponse); */
  updateConfigNode: {
    path: "/indykite.config.v1beta1.ConfigManagementAPI/UpdateConfigNode",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: UpdateConfigNodeRequest) =>
      Buffer.from(UpdateConfigNodeRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) =>
      UpdateConfigNodeRequest.decode(value),
    responseSerialize: (value: UpdateConfigNodeResponse) =>
      Buffer.from(UpdateConfigNodeResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) =>
      UpdateConfigNodeResponse.decode(value),
  },
  deleteConfigNode: {
    path: "/indykite.config.v1beta1.ConfigManagementAPI/DeleteConfigNode",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: DeleteConfigNodeRequest) =>
      Buffer.from(DeleteConfigNodeRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) =>
      DeleteConfigNodeRequest.decode(value),
    responseSerialize: (value: DeleteConfigNodeResponse) =>
      Buffer.from(DeleteConfigNodeResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) =>
      DeleteConfigNodeResponse.decode(value),
  },
  createOAuth2Provider: {
    path: "/indykite.config.v1beta1.ConfigManagementAPI/CreateOAuth2Provider",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: CreateOAuth2ProviderRequest) =>
      Buffer.from(CreateOAuth2ProviderRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) =>
      CreateOAuth2ProviderRequest.decode(value),
    responseSerialize: (value: CreateOAuth2ProviderResponse) =>
      Buffer.from(CreateOAuth2ProviderResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) =>
      CreateOAuth2ProviderResponse.decode(value),
  },
  readOAuth2Provider: {
    path: "/indykite.config.v1beta1.ConfigManagementAPI/ReadOAuth2Provider",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: ReadOAuth2ProviderRequest) =>
      Buffer.from(ReadOAuth2ProviderRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) =>
      ReadOAuth2ProviderRequest.decode(value),
    responseSerialize: (value: ReadOAuth2ProviderResponse) =>
      Buffer.from(ReadOAuth2ProviderResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) =>
      ReadOAuth2ProviderResponse.decode(value),
  },
  /** rpc ListOAuth2Providers(ListOAuth2ProvidersRequest) returns (stream ReadOAuth2ProviderResponse); */
  updateOAuth2Provider: {
    path: "/indykite.config.v1beta1.ConfigManagementAPI/UpdateOAuth2Provider",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: UpdateOAuth2ProviderRequest) =>
      Buffer.from(UpdateOAuth2ProviderRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) =>
      UpdateOAuth2ProviderRequest.decode(value),
    responseSerialize: (value: UpdateOAuth2ProviderResponse) =>
      Buffer.from(UpdateOAuth2ProviderResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) =>
      UpdateOAuth2ProviderResponse.decode(value),
  },
  deleteOAuth2Provider: {
    path: "/indykite.config.v1beta1.ConfigManagementAPI/DeleteOAuth2Provider",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: DeleteOAuth2ProviderRequest) =>
      Buffer.from(DeleteOAuth2ProviderRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) =>
      DeleteOAuth2ProviderRequest.decode(value),
    responseSerialize: (value: DeleteOAuth2ProviderResponse) =>
      Buffer.from(DeleteOAuth2ProviderResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) =>
      DeleteOAuth2ProviderResponse.decode(value),
  },
  createOAuth2Application: {
    path: "/indykite.config.v1beta1.ConfigManagementAPI/CreateOAuth2Application",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: CreateOAuth2ApplicationRequest) =>
      Buffer.from(CreateOAuth2ApplicationRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) =>
      CreateOAuth2ApplicationRequest.decode(value),
    responseSerialize: (value: CreateOAuth2ApplicationResponse) =>
      Buffer.from(CreateOAuth2ApplicationResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) =>
      CreateOAuth2ApplicationResponse.decode(value),
  },
  readOAuth2Application: {
    path: "/indykite.config.v1beta1.ConfigManagementAPI/ReadOAuth2Application",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: ReadOAuth2ApplicationRequest) =>
      Buffer.from(ReadOAuth2ApplicationRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) =>
      ReadOAuth2ApplicationRequest.decode(value),
    responseSerialize: (value: ReadOAuth2ApplicationResponse) =>
      Buffer.from(ReadOAuth2ApplicationResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) =>
      ReadOAuth2ApplicationResponse.decode(value),
  },
  /** rpc ListOAuth2Applications(ListOAuth2ApplicationsRequest) returns (stream ReadOAuth2ApplicationResponse); */
  updateOAuth2Application: {
    path: "/indykite.config.v1beta1.ConfigManagementAPI/UpdateOAuth2Application",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: UpdateOAuth2ApplicationRequest) =>
      Buffer.from(UpdateOAuth2ApplicationRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) =>
      UpdateOAuth2ApplicationRequest.decode(value),
    responseSerialize: (value: UpdateOAuth2ApplicationResponse) =>
      Buffer.from(UpdateOAuth2ApplicationResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) =>
      UpdateOAuth2ApplicationResponse.decode(value),
  },
  deleteOAuth2Application: {
    path: "/indykite.config.v1beta1.ConfigManagementAPI/DeleteOAuth2Application",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: DeleteOAuth2ApplicationRequest) =>
      Buffer.from(DeleteOAuth2ApplicationRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) =>
      DeleteOAuth2ApplicationRequest.decode(value),
    responseSerialize: (value: DeleteOAuth2ApplicationResponse) =>
      Buffer.from(DeleteOAuth2ApplicationResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) =>
      DeleteOAuth2ApplicationResponse.decode(value),
  },
} as const;

export interface ConfigManagementAPIServer
  extends UntypedServiceImplementation {
  /** ReadCustomer Reads a customer. */
  readCustomer: handleUnaryCall<ReadCustomerRequest, ReadCustomerResponse>;
  /** CreateApplicationSpace ... */
  createApplicationSpace: handleUnaryCall<
    CreateApplicationSpaceRequest,
    CreateApplicationSpaceResponse
  >;
  readApplicationSpace: handleUnaryCall<
    ReadApplicationSpaceRequest,
    ReadApplicationSpaceResponse
  >;
  listApplicationSpaces: handleServerStreamingCall<
    ListApplicationSpacesRequest,
    ListApplicationSpacesResponse
  >;
  updateApplicationSpace: handleUnaryCall<
    UpdateApplicationSpaceRequest,
    UpdateApplicationSpaceResponse
  >;
  deleteApplicationSpace: handleUnaryCall<
    DeleteApplicationSpaceRequest,
    DeleteApplicationSpaceResponse
  >;
  /** CreateApplication ... */
  createApplication: handleUnaryCall<
    CreateApplicationRequest,
    CreateApplicationResponse
  >;
  readApplication: handleUnaryCall<
    ReadApplicationRequest,
    ReadApplicationResponse
  >;
  listApplications: handleServerStreamingCall<
    ListApplicationsRequest,
    ListApplicationsResponse
  >;
  updateApplication: handleUnaryCall<
    UpdateApplicationRequest,
    UpdateApplicationResponse
  >;
  deleteApplication: handleUnaryCall<
    DeleteApplicationRequest,
    DeleteApplicationResponse
  >;
  /** CreateApplicationAgent ... */
  createApplicationAgent: handleUnaryCall<
    CreateApplicationAgentRequest,
    CreateApplicationAgentResponse
  >;
  readApplicationAgent: handleUnaryCall<
    ReadApplicationAgentRequest,
    ReadApplicationAgentResponse
  >;
  listApplicationAgents: handleServerStreamingCall<
    ListApplicationAgentsRequest,
    ListApplicationAgentsResponse
  >;
  updateApplicationAgent: handleUnaryCall<
    UpdateApplicationAgentRequest,
    UpdateApplicationAgentResponse
  >;
  deleteApplicationAgent: handleUnaryCall<
    DeleteApplicationAgentRequest,
    DeleteApplicationAgentResponse
  >;
  registerApplicationAgentCredential: handleUnaryCall<
    RegisterApplicationAgentCredentialRequest,
    RegisterApplicationAgentCredentialResponse
  >;
  readApplicationAgentCredential: handleUnaryCall<
    ReadApplicationAgentCredentialRequest,
    ReadApplicationAgentCredentialResponse
  >;
  deleteApplicationAgentCredential: handleUnaryCall<
    DeleteApplicationAgentCredentialRequest,
    DeleteApplicationAgentCredentialResponse
  >;
  /** CreateTenant ... */
  createTenant: handleUnaryCall<CreateTenantRequest, CreateTenantResponse>;
  readTenant: handleUnaryCall<ReadTenantRequest, ReadTenantResponse>;
  listTenants: handleServerStreamingCall<
    ListTenantsRequest,
    ListTenantsResponse
  >;
  updateTenant: handleUnaryCall<UpdateTenantRequest, UpdateTenantResponse>;
  deleteTenant: handleUnaryCall<DeleteTenantRequest, DeleteTenantResponse>;
  /** CreateConfigNode ... */
  createConfigNode: handleUnaryCall<
    CreateConfigNodeRequest,
    CreateConfigNodeResponse
  >;
  readConfigNode: handleUnaryCall<
    ReadConfigNodeRequest,
    ReadConfigNodeResponse
  >;
  /** rpc ListConfigNodes(ListConfigNodesRequest) returns (stream ReadConfigNodeResponse); */
  updateConfigNode: handleUnaryCall<
    UpdateConfigNodeRequest,
    UpdateConfigNodeResponse
  >;
  deleteConfigNode: handleUnaryCall<
    DeleteConfigNodeRequest,
    DeleteConfigNodeResponse
  >;
  createOAuth2Provider: handleUnaryCall<
    CreateOAuth2ProviderRequest,
    CreateOAuth2ProviderResponse
  >;
  readOAuth2Provider: handleUnaryCall<
    ReadOAuth2ProviderRequest,
    ReadOAuth2ProviderResponse
  >;
  /** rpc ListOAuth2Providers(ListOAuth2ProvidersRequest) returns (stream ReadOAuth2ProviderResponse); */
  updateOAuth2Provider: handleUnaryCall<
    UpdateOAuth2ProviderRequest,
    UpdateOAuth2ProviderResponse
  >;
  deleteOAuth2Provider: handleUnaryCall<
    DeleteOAuth2ProviderRequest,
    DeleteOAuth2ProviderResponse
  >;
  createOAuth2Application: handleUnaryCall<
    CreateOAuth2ApplicationRequest,
    CreateOAuth2ApplicationResponse
  >;
  readOAuth2Application: handleUnaryCall<
    ReadOAuth2ApplicationRequest,
    ReadOAuth2ApplicationResponse
  >;
  /** rpc ListOAuth2Applications(ListOAuth2ApplicationsRequest) returns (stream ReadOAuth2ApplicationResponse); */
  updateOAuth2Application: handleUnaryCall<
    UpdateOAuth2ApplicationRequest,
    UpdateOAuth2ApplicationResponse
  >;
  deleteOAuth2Application: handleUnaryCall<
    DeleteOAuth2ApplicationRequest,
    DeleteOAuth2ApplicationResponse
  >;
}

export interface ConfigManagementAPIClient extends Client {
  /** ReadCustomer Reads a customer. */
  readCustomer(
    request: ReadCustomerRequest,
    callback: (
      error: ServiceError | null,
      response: ReadCustomerResponse
    ) => void
  ): ClientUnaryCall;
  readCustomer(
    request: ReadCustomerRequest,
    metadata: Metadata,
    callback: (
      error: ServiceError | null,
      response: ReadCustomerResponse
    ) => void
  ): ClientUnaryCall;
  readCustomer(
    request: ReadCustomerRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (
      error: ServiceError | null,
      response: ReadCustomerResponse
    ) => void
  ): ClientUnaryCall;
  /** CreateApplicationSpace ... */
  createApplicationSpace(
    request: CreateApplicationSpaceRequest,
    callback: (
      error: ServiceError | null,
      response: CreateApplicationSpaceResponse
    ) => void
  ): ClientUnaryCall;
  createApplicationSpace(
    request: CreateApplicationSpaceRequest,
    metadata: Metadata,
    callback: (
      error: ServiceError | null,
      response: CreateApplicationSpaceResponse
    ) => void
  ): ClientUnaryCall;
  createApplicationSpace(
    request: CreateApplicationSpaceRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (
      error: ServiceError | null,
      response: CreateApplicationSpaceResponse
    ) => void
  ): ClientUnaryCall;
  readApplicationSpace(
    request: ReadApplicationSpaceRequest,
    callback: (
      error: ServiceError | null,
      response: ReadApplicationSpaceResponse
    ) => void
  ): ClientUnaryCall;
  readApplicationSpace(
    request: ReadApplicationSpaceRequest,
    metadata: Metadata,
    callback: (
      error: ServiceError | null,
      response: ReadApplicationSpaceResponse
    ) => void
  ): ClientUnaryCall;
  readApplicationSpace(
    request: ReadApplicationSpaceRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (
      error: ServiceError | null,
      response: ReadApplicationSpaceResponse
    ) => void
  ): ClientUnaryCall;
  listApplicationSpaces(
    request: ListApplicationSpacesRequest,
    options?: Partial<CallOptions>
  ): ClientReadableStream<ListApplicationSpacesResponse>;
  listApplicationSpaces(
    request: ListApplicationSpacesRequest,
    metadata?: Metadata,
    options?: Partial<CallOptions>
  ): ClientReadableStream<ListApplicationSpacesResponse>;
  updateApplicationSpace(
    request: UpdateApplicationSpaceRequest,
    callback: (
      error: ServiceError | null,
      response: UpdateApplicationSpaceResponse
    ) => void
  ): ClientUnaryCall;
  updateApplicationSpace(
    request: UpdateApplicationSpaceRequest,
    metadata: Metadata,
    callback: (
      error: ServiceError | null,
      response: UpdateApplicationSpaceResponse
    ) => void
  ): ClientUnaryCall;
  updateApplicationSpace(
    request: UpdateApplicationSpaceRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (
      error: ServiceError | null,
      response: UpdateApplicationSpaceResponse
    ) => void
  ): ClientUnaryCall;
  deleteApplicationSpace(
    request: DeleteApplicationSpaceRequest,
    callback: (
      error: ServiceError | null,
      response: DeleteApplicationSpaceResponse
    ) => void
  ): ClientUnaryCall;
  deleteApplicationSpace(
    request: DeleteApplicationSpaceRequest,
    metadata: Metadata,
    callback: (
      error: ServiceError | null,
      response: DeleteApplicationSpaceResponse
    ) => void
  ): ClientUnaryCall;
  deleteApplicationSpace(
    request: DeleteApplicationSpaceRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (
      error: ServiceError | null,
      response: DeleteApplicationSpaceResponse
    ) => void
  ): ClientUnaryCall;
  /** CreateApplication ... */
  createApplication(
    request: CreateApplicationRequest,
    callback: (
      error: ServiceError | null,
      response: CreateApplicationResponse
    ) => void
  ): ClientUnaryCall;
  createApplication(
    request: CreateApplicationRequest,
    metadata: Metadata,
    callback: (
      error: ServiceError | null,
      response: CreateApplicationResponse
    ) => void
  ): ClientUnaryCall;
  createApplication(
    request: CreateApplicationRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (
      error: ServiceError | null,
      response: CreateApplicationResponse
    ) => void
  ): ClientUnaryCall;
  readApplication(
    request: ReadApplicationRequest,
    callback: (
      error: ServiceError | null,
      response: ReadApplicationResponse
    ) => void
  ): ClientUnaryCall;
  readApplication(
    request: ReadApplicationRequest,
    metadata: Metadata,
    callback: (
      error: ServiceError | null,
      response: ReadApplicationResponse
    ) => void
  ): ClientUnaryCall;
  readApplication(
    request: ReadApplicationRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (
      error: ServiceError | null,
      response: ReadApplicationResponse
    ) => void
  ): ClientUnaryCall;
  listApplications(
    request: ListApplicationsRequest,
    options?: Partial<CallOptions>
  ): ClientReadableStream<ListApplicationsResponse>;
  listApplications(
    request: ListApplicationsRequest,
    metadata?: Metadata,
    options?: Partial<CallOptions>
  ): ClientReadableStream<ListApplicationsResponse>;
  updateApplication(
    request: UpdateApplicationRequest,
    callback: (
      error: ServiceError | null,
      response: UpdateApplicationResponse
    ) => void
  ): ClientUnaryCall;
  updateApplication(
    request: UpdateApplicationRequest,
    metadata: Metadata,
    callback: (
      error: ServiceError | null,
      response: UpdateApplicationResponse
    ) => void
  ): ClientUnaryCall;
  updateApplication(
    request: UpdateApplicationRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (
      error: ServiceError | null,
      response: UpdateApplicationResponse
    ) => void
  ): ClientUnaryCall;
  deleteApplication(
    request: DeleteApplicationRequest,
    callback: (
      error: ServiceError | null,
      response: DeleteApplicationResponse
    ) => void
  ): ClientUnaryCall;
  deleteApplication(
    request: DeleteApplicationRequest,
    metadata: Metadata,
    callback: (
      error: ServiceError | null,
      response: DeleteApplicationResponse
    ) => void
  ): ClientUnaryCall;
  deleteApplication(
    request: DeleteApplicationRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (
      error: ServiceError | null,
      response: DeleteApplicationResponse
    ) => void
  ): ClientUnaryCall;
  /** CreateApplicationAgent ... */
  createApplicationAgent(
    request: CreateApplicationAgentRequest,
    callback: (
      error: ServiceError | null,
      response: CreateApplicationAgentResponse
    ) => void
  ): ClientUnaryCall;
  createApplicationAgent(
    request: CreateApplicationAgentRequest,
    metadata: Metadata,
    callback: (
      error: ServiceError | null,
      response: CreateApplicationAgentResponse
    ) => void
  ): ClientUnaryCall;
  createApplicationAgent(
    request: CreateApplicationAgentRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (
      error: ServiceError | null,
      response: CreateApplicationAgentResponse
    ) => void
  ): ClientUnaryCall;
  readApplicationAgent(
    request: ReadApplicationAgentRequest,
    callback: (
      error: ServiceError | null,
      response: ReadApplicationAgentResponse
    ) => void
  ): ClientUnaryCall;
  readApplicationAgent(
    request: ReadApplicationAgentRequest,
    metadata: Metadata,
    callback: (
      error: ServiceError | null,
      response: ReadApplicationAgentResponse
    ) => void
  ): ClientUnaryCall;
  readApplicationAgent(
    request: ReadApplicationAgentRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (
      error: ServiceError | null,
      response: ReadApplicationAgentResponse
    ) => void
  ): ClientUnaryCall;
  listApplicationAgents(
    request: ListApplicationAgentsRequest,
    options?: Partial<CallOptions>
  ): ClientReadableStream<ListApplicationAgentsResponse>;
  listApplicationAgents(
    request: ListApplicationAgentsRequest,
    metadata?: Metadata,
    options?: Partial<CallOptions>
  ): ClientReadableStream<ListApplicationAgentsResponse>;
  updateApplicationAgent(
    request: UpdateApplicationAgentRequest,
    callback: (
      error: ServiceError | null,
      response: UpdateApplicationAgentResponse
    ) => void
  ): ClientUnaryCall;
  updateApplicationAgent(
    request: UpdateApplicationAgentRequest,
    metadata: Metadata,
    callback: (
      error: ServiceError | null,
      response: UpdateApplicationAgentResponse
    ) => void
  ): ClientUnaryCall;
  updateApplicationAgent(
    request: UpdateApplicationAgentRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (
      error: ServiceError | null,
      response: UpdateApplicationAgentResponse
    ) => void
  ): ClientUnaryCall;
  deleteApplicationAgent(
    request: DeleteApplicationAgentRequest,
    callback: (
      error: ServiceError | null,
      response: DeleteApplicationAgentResponse
    ) => void
  ): ClientUnaryCall;
  deleteApplicationAgent(
    request: DeleteApplicationAgentRequest,
    metadata: Metadata,
    callback: (
      error: ServiceError | null,
      response: DeleteApplicationAgentResponse
    ) => void
  ): ClientUnaryCall;
  deleteApplicationAgent(
    request: DeleteApplicationAgentRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (
      error: ServiceError | null,
      response: DeleteApplicationAgentResponse
    ) => void
  ): ClientUnaryCall;
  registerApplicationAgentCredential(
    request: RegisterApplicationAgentCredentialRequest,
    callback: (
      error: ServiceError | null,
      response: RegisterApplicationAgentCredentialResponse
    ) => void
  ): ClientUnaryCall;
  registerApplicationAgentCredential(
    request: RegisterApplicationAgentCredentialRequest,
    metadata: Metadata,
    callback: (
      error: ServiceError | null,
      response: RegisterApplicationAgentCredentialResponse
    ) => void
  ): ClientUnaryCall;
  registerApplicationAgentCredential(
    request: RegisterApplicationAgentCredentialRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (
      error: ServiceError | null,
      response: RegisterApplicationAgentCredentialResponse
    ) => void
  ): ClientUnaryCall;
  readApplicationAgentCredential(
    request: ReadApplicationAgentCredentialRequest,
    callback: (
      error: ServiceError | null,
      response: ReadApplicationAgentCredentialResponse
    ) => void
  ): ClientUnaryCall;
  readApplicationAgentCredential(
    request: ReadApplicationAgentCredentialRequest,
    metadata: Metadata,
    callback: (
      error: ServiceError | null,
      response: ReadApplicationAgentCredentialResponse
    ) => void
  ): ClientUnaryCall;
  readApplicationAgentCredential(
    request: ReadApplicationAgentCredentialRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (
      error: ServiceError | null,
      response: ReadApplicationAgentCredentialResponse
    ) => void
  ): ClientUnaryCall;
  deleteApplicationAgentCredential(
    request: DeleteApplicationAgentCredentialRequest,
    callback: (
      error: ServiceError | null,
      response: DeleteApplicationAgentCredentialResponse
    ) => void
  ): ClientUnaryCall;
  deleteApplicationAgentCredential(
    request: DeleteApplicationAgentCredentialRequest,
    metadata: Metadata,
    callback: (
      error: ServiceError | null,
      response: DeleteApplicationAgentCredentialResponse
    ) => void
  ): ClientUnaryCall;
  deleteApplicationAgentCredential(
    request: DeleteApplicationAgentCredentialRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (
      error: ServiceError | null,
      response: DeleteApplicationAgentCredentialResponse
    ) => void
  ): ClientUnaryCall;
  /** CreateTenant ... */
  createTenant(
    request: CreateTenantRequest,
    callback: (
      error: ServiceError | null,
      response: CreateTenantResponse
    ) => void
  ): ClientUnaryCall;
  createTenant(
    request: CreateTenantRequest,
    metadata: Metadata,
    callback: (
      error: ServiceError | null,
      response: CreateTenantResponse
    ) => void
  ): ClientUnaryCall;
  createTenant(
    request: CreateTenantRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (
      error: ServiceError | null,
      response: CreateTenantResponse
    ) => void
  ): ClientUnaryCall;
  readTenant(
    request: ReadTenantRequest,
    callback: (error: ServiceError | null, response: ReadTenantResponse) => void
  ): ClientUnaryCall;
  readTenant(
    request: ReadTenantRequest,
    metadata: Metadata,
    callback: (error: ServiceError | null, response: ReadTenantResponse) => void
  ): ClientUnaryCall;
  readTenant(
    request: ReadTenantRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (error: ServiceError | null, response: ReadTenantResponse) => void
  ): ClientUnaryCall;
  listTenants(
    request: ListTenantsRequest,
    options?: Partial<CallOptions>
  ): ClientReadableStream<ListTenantsResponse>;
  listTenants(
    request: ListTenantsRequest,
    metadata?: Metadata,
    options?: Partial<CallOptions>
  ): ClientReadableStream<ListTenantsResponse>;
  updateTenant(
    request: UpdateTenantRequest,
    callback: (
      error: ServiceError | null,
      response: UpdateTenantResponse
    ) => void
  ): ClientUnaryCall;
  updateTenant(
    request: UpdateTenantRequest,
    metadata: Metadata,
    callback: (
      error: ServiceError | null,
      response: UpdateTenantResponse
    ) => void
  ): ClientUnaryCall;
  updateTenant(
    request: UpdateTenantRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (
      error: ServiceError | null,
      response: UpdateTenantResponse
    ) => void
  ): ClientUnaryCall;
  deleteTenant(
    request: DeleteTenantRequest,
    callback: (
      error: ServiceError | null,
      response: DeleteTenantResponse
    ) => void
  ): ClientUnaryCall;
  deleteTenant(
    request: DeleteTenantRequest,
    metadata: Metadata,
    callback: (
      error: ServiceError | null,
      response: DeleteTenantResponse
    ) => void
  ): ClientUnaryCall;
  deleteTenant(
    request: DeleteTenantRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (
      error: ServiceError | null,
      response: DeleteTenantResponse
    ) => void
  ): ClientUnaryCall;
  /** CreateConfigNode ... */
  createConfigNode(
    request: CreateConfigNodeRequest,
    callback: (
      error: ServiceError | null,
      response: CreateConfigNodeResponse
    ) => void
  ): ClientUnaryCall;
  createConfigNode(
    request: CreateConfigNodeRequest,
    metadata: Metadata,
    callback: (
      error: ServiceError | null,
      response: CreateConfigNodeResponse
    ) => void
  ): ClientUnaryCall;
  createConfigNode(
    request: CreateConfigNodeRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (
      error: ServiceError | null,
      response: CreateConfigNodeResponse
    ) => void
  ): ClientUnaryCall;
  readConfigNode(
    request: ReadConfigNodeRequest,
    callback: (
      error: ServiceError | null,
      response: ReadConfigNodeResponse
    ) => void
  ): ClientUnaryCall;
  readConfigNode(
    request: ReadConfigNodeRequest,
    metadata: Metadata,
    callback: (
      error: ServiceError | null,
      response: ReadConfigNodeResponse
    ) => void
  ): ClientUnaryCall;
  readConfigNode(
    request: ReadConfigNodeRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (
      error: ServiceError | null,
      response: ReadConfigNodeResponse
    ) => void
  ): ClientUnaryCall;
  /** rpc ListConfigNodes(ListConfigNodesRequest) returns (stream ReadConfigNodeResponse); */
  updateConfigNode(
    request: UpdateConfigNodeRequest,
    callback: (
      error: ServiceError | null,
      response: UpdateConfigNodeResponse
    ) => void
  ): ClientUnaryCall;
  updateConfigNode(
    request: UpdateConfigNodeRequest,
    metadata: Metadata,
    callback: (
      error: ServiceError | null,
      response: UpdateConfigNodeResponse
    ) => void
  ): ClientUnaryCall;
  updateConfigNode(
    request: UpdateConfigNodeRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (
      error: ServiceError | null,
      response: UpdateConfigNodeResponse
    ) => void
  ): ClientUnaryCall;
  deleteConfigNode(
    request: DeleteConfigNodeRequest,
    callback: (
      error: ServiceError | null,
      response: DeleteConfigNodeResponse
    ) => void
  ): ClientUnaryCall;
  deleteConfigNode(
    request: DeleteConfigNodeRequest,
    metadata: Metadata,
    callback: (
      error: ServiceError | null,
      response: DeleteConfigNodeResponse
    ) => void
  ): ClientUnaryCall;
  deleteConfigNode(
    request: DeleteConfigNodeRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (
      error: ServiceError | null,
      response: DeleteConfigNodeResponse
    ) => void
  ): ClientUnaryCall;
  createOAuth2Provider(
    request: CreateOAuth2ProviderRequest,
    callback: (
      error: ServiceError | null,
      response: CreateOAuth2ProviderResponse
    ) => void
  ): ClientUnaryCall;
  createOAuth2Provider(
    request: CreateOAuth2ProviderRequest,
    metadata: Metadata,
    callback: (
      error: ServiceError | null,
      response: CreateOAuth2ProviderResponse
    ) => void
  ): ClientUnaryCall;
  createOAuth2Provider(
    request: CreateOAuth2ProviderRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (
      error: ServiceError | null,
      response: CreateOAuth2ProviderResponse
    ) => void
  ): ClientUnaryCall;
  readOAuth2Provider(
    request: ReadOAuth2ProviderRequest,
    callback: (
      error: ServiceError | null,
      response: ReadOAuth2ProviderResponse
    ) => void
  ): ClientUnaryCall;
  readOAuth2Provider(
    request: ReadOAuth2ProviderRequest,
    metadata: Metadata,
    callback: (
      error: ServiceError | null,
      response: ReadOAuth2ProviderResponse
    ) => void
  ): ClientUnaryCall;
  readOAuth2Provider(
    request: ReadOAuth2ProviderRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (
      error: ServiceError | null,
      response: ReadOAuth2ProviderResponse
    ) => void
  ): ClientUnaryCall;
  /** rpc ListOAuth2Providers(ListOAuth2ProvidersRequest) returns (stream ReadOAuth2ProviderResponse); */
  updateOAuth2Provider(
    request: UpdateOAuth2ProviderRequest,
    callback: (
      error: ServiceError | null,
      response: UpdateOAuth2ProviderResponse
    ) => void
  ): ClientUnaryCall;
  updateOAuth2Provider(
    request: UpdateOAuth2ProviderRequest,
    metadata: Metadata,
    callback: (
      error: ServiceError | null,
      response: UpdateOAuth2ProviderResponse
    ) => void
  ): ClientUnaryCall;
  updateOAuth2Provider(
    request: UpdateOAuth2ProviderRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (
      error: ServiceError | null,
      response: UpdateOAuth2ProviderResponse
    ) => void
  ): ClientUnaryCall;
  deleteOAuth2Provider(
    request: DeleteOAuth2ProviderRequest,
    callback: (
      error: ServiceError | null,
      response: DeleteOAuth2ProviderResponse
    ) => void
  ): ClientUnaryCall;
  deleteOAuth2Provider(
    request: DeleteOAuth2ProviderRequest,
    metadata: Metadata,
    callback: (
      error: ServiceError | null,
      response: DeleteOAuth2ProviderResponse
    ) => void
  ): ClientUnaryCall;
  deleteOAuth2Provider(
    request: DeleteOAuth2ProviderRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (
      error: ServiceError | null,
      response: DeleteOAuth2ProviderResponse
    ) => void
  ): ClientUnaryCall;
  createOAuth2Application(
    request: CreateOAuth2ApplicationRequest,
    callback: (
      error: ServiceError | null,
      response: CreateOAuth2ApplicationResponse
    ) => void
  ): ClientUnaryCall;
  createOAuth2Application(
    request: CreateOAuth2ApplicationRequest,
    metadata: Metadata,
    callback: (
      error: ServiceError | null,
      response: CreateOAuth2ApplicationResponse
    ) => void
  ): ClientUnaryCall;
  createOAuth2Application(
    request: CreateOAuth2ApplicationRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (
      error: ServiceError | null,
      response: CreateOAuth2ApplicationResponse
    ) => void
  ): ClientUnaryCall;
  readOAuth2Application(
    request: ReadOAuth2ApplicationRequest,
    callback: (
      error: ServiceError | null,
      response: ReadOAuth2ApplicationResponse
    ) => void
  ): ClientUnaryCall;
  readOAuth2Application(
    request: ReadOAuth2ApplicationRequest,
    metadata: Metadata,
    callback: (
      error: ServiceError | null,
      response: ReadOAuth2ApplicationResponse
    ) => void
  ): ClientUnaryCall;
  readOAuth2Application(
    request: ReadOAuth2ApplicationRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (
      error: ServiceError | null,
      response: ReadOAuth2ApplicationResponse
    ) => void
  ): ClientUnaryCall;
  /** rpc ListOAuth2Applications(ListOAuth2ApplicationsRequest) returns (stream ReadOAuth2ApplicationResponse); */
  updateOAuth2Application(
    request: UpdateOAuth2ApplicationRequest,
    callback: (
      error: ServiceError | null,
      response: UpdateOAuth2ApplicationResponse
    ) => void
  ): ClientUnaryCall;
  updateOAuth2Application(
    request: UpdateOAuth2ApplicationRequest,
    metadata: Metadata,
    callback: (
      error: ServiceError | null,
      response: UpdateOAuth2ApplicationResponse
    ) => void
  ): ClientUnaryCall;
  updateOAuth2Application(
    request: UpdateOAuth2ApplicationRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (
      error: ServiceError | null,
      response: UpdateOAuth2ApplicationResponse
    ) => void
  ): ClientUnaryCall;
  deleteOAuth2Application(
    request: DeleteOAuth2ApplicationRequest,
    callback: (
      error: ServiceError | null,
      response: DeleteOAuth2ApplicationResponse
    ) => void
  ): ClientUnaryCall;
  deleteOAuth2Application(
    request: DeleteOAuth2ApplicationRequest,
    metadata: Metadata,
    callback: (
      error: ServiceError | null,
      response: DeleteOAuth2ApplicationResponse
    ) => void
  ): ClientUnaryCall;
  deleteOAuth2Application(
    request: DeleteOAuth2ApplicationRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (
      error: ServiceError | null,
      response: DeleteOAuth2ApplicationResponse
    ) => void
  ): ClientUnaryCall;
}

export const ConfigManagementAPIClient = makeGenericClientConstructor(
  ConfigManagementAPIService,
  "indykite.config.v1beta1.ConfigManagementAPI"
) as unknown as {
  new (
    address: string,
    credentials: ChannelCredentials,
    options?: Partial<ChannelOptions>
  ): ConfigManagementAPIClient;
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

// If you get a compile-error about 'Constructor<Long> and ... have no overlap',
// add '--ts_proto_opt=esModuleInterop=true' as a flag when calling 'protoc'.
if (util.Long !== Long) {
  util.Long = Long as any;
  configure();
}
