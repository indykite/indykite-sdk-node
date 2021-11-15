/* eslint-disable */
import { util, configure, Writer, Reader } from "protobufjs/minimal";
import * as Long from "long";
import { Timestamp } from "../../../google/protobuf/timestamp";
import { Value } from "../../objects/v1beta1/struct";

export const protobufPackage = "indykite.identity.v1beta1";

/** AssuranceLevel of Identity Proofing Requirements (NIST 800-63) */
export enum AssuranceLevel {
  ASSURANCE_LEVEL_INVALID = 0,
  /**
   * ASSURANCE_LEVEL_LOW - Little or no confidence exists in the asserted identity; usually self-asserted; essentially a persistent identifier
   * ASSURANCE_LEVEL_NONE = 1;
   * Confidence exists that the asserted identity is accurate; used frequently for self service applications
   * if any, are self-asserted or should be treated as self-asserted; there is no proofing process.
   */
  ASSURANCE_LEVEL_LOW = 1,
  /**
   * ASSURANCE_LEVEL_SUBSTANTIAL - High confidence in the asserted identity’s accuracy; used to access restricted data
   * Either remote or in-person identity proofing is required using, at a minimum, the procedures given in SP 800-63A.
   */
  ASSURANCE_LEVEL_SUBSTANTIAL = 2,
  /**
   * ASSURANCE_LEVEL_HIGH - Very high confidence in the asserted identity’s accuracy; used to access highly restricted data.
   * In-person or supervised-remote identity proofing is required. Identifying attributes must be verified through
   * examination of physical documentation as described in SP 800-63A.
   */
  ASSURANCE_LEVEL_HIGH = 3,
  UNRECOGNIZED = -1,
}

export function assuranceLevelFromJSON(object: any): AssuranceLevel {
  switch (object) {
    case 0:
    case "ASSURANCE_LEVEL_INVALID":
      return AssuranceLevel.ASSURANCE_LEVEL_INVALID;
    case 1:
    case "ASSURANCE_LEVEL_LOW":
      return AssuranceLevel.ASSURANCE_LEVEL_LOW;
    case 2:
    case "ASSURANCE_LEVEL_SUBSTANTIAL":
      return AssuranceLevel.ASSURANCE_LEVEL_SUBSTANTIAL;
    case 3:
    case "ASSURANCE_LEVEL_HIGH":
      return AssuranceLevel.ASSURANCE_LEVEL_HIGH;
    case -1:
    case "UNRECOGNIZED":
    default:
      return AssuranceLevel.UNRECOGNIZED;
  }
}

export function assuranceLevelToJSON(object: AssuranceLevel): string {
  switch (object) {
    case AssuranceLevel.ASSURANCE_LEVEL_INVALID:
      return "ASSURANCE_LEVEL_INVALID";
    case AssuranceLevel.ASSURANCE_LEVEL_LOW:
      return "ASSURANCE_LEVEL_LOW";
    case AssuranceLevel.ASSURANCE_LEVEL_SUBSTANTIAL:
      return "ASSURANCE_LEVEL_SUBSTANTIAL";
    case AssuranceLevel.ASSURANCE_LEVEL_HIGH:
      return "ASSURANCE_LEVEL_HIGH";
    default:
      return "UNKNOWN";
  }
}

export interface Schema {
  /** context */
  context: { [key: string]: string };
  schema: string;
  schemaVersion: string;
  attributeName: string;
}

export interface Schema_ContextEntry {
  key: string;
  value: string;
}

/** PropertyDefinition ... */
export interface PropertyDefinition {
  /** http://schema.org/ */
  context: string;
  /** Person */
  type: string;
  /** email */
  property: string;
}

/** PropertyConstraint represent a conditions to find the property with expected meta-data. */
export interface PropertyConstraint {
  /** Issuers used to limit the source of property. */
  issuers: string[];
  /** Subset used to specify which property to return if value is an object. */
  subset: string[];
  /** Get on primary properties */
  onlyPrimary: boolean;
}

/** PropertyMask used to define which property to read. */
export interface PropertyMask {
  definition?: PropertyDefinition;
  constraint?: PropertyConstraint;
}

export interface PropertyMetadata {
  /** Primary is true if this instance of a multi-value property is the default to pick from array at first. */
  primary: boolean;
  /** AssuranceLevel shows the level of assurance of the property value. */
  assuranceLevel: AssuranceLevel;
  /**
   * Issuer is the identifier of the source of property value.
   *
   * Example: ["indykite.id", "aW5keWtpRGWAAAIPAAAAAA"]
   */
  issuer: string;
  /** VerificationTime represent the time when AssuranceLevel was changed for Verifier. */
  verificationTime?: Date;
  /**
   * Verifier is the identifier of provider carried out the verification process.
   *
   * Example: ["indykite.id", "aW5keWtpRGWAAAIPAAAAAA"]
   */
  verifier: string;
}

/**
 * Property represents a property stored in database.
 *
 * It contains the ID, Definition, Metadata and Value together.
 */
export interface Property {
  /**
   * Id represents the identifier of this property in hex
   * max value is 7FFFFFFFFFFFFFFF in case of signed in64
   */
  id: string;
  /** Definition represents the property type definition. */
  definition?: PropertyDefinition;
  /**
   * Meta represent the meta-information of this property.
   * One of Meta or Value must be set
   */
  meta?: PropertyMetadata;
  value?:
    | { $case: "objectValue"; objectValue: Value }
    | { $case: "referenceValue"; referenceValue: string };
}

/** PropertyBatchOperation represents a single Property value operation. */
export interface PropertyBatchOperation {
  operation?:
    | { $case: "add"; add: Property }
    | { $case: "replace"; replace: Property }
    | { $case: "remove"; remove: Property };
}

/** BatchPropertyOperationResult represents the result of an BatchUpdate call. */
export interface BatchOperationResult {
  index: string;
  result?:
    | { $case: "success"; success: BatchOperationResultSuccess }
    | { $case: "error"; error: BatchOperationResultError };
}

/** BatchOperationResultSuccess represents the result of an successful BatchOperation call. */
export interface BatchOperationResultSuccess {
  propertyId: string;
}

/** BatchOperationResultError represents an error encountered while executing a batch operation. */
export interface BatchOperationResultError {
  message: string[];
}

/**
 * BatchError represents an error encountered while executing a batch operation.
 *
 * The Index field corresponds to the index of the failed operation in the operations array that was passed
 * to batch operation.
 */
export interface BatchError {
  index: string;
  /** google.rpc.Status status = 2; */
  message: string[];
}

const baseSchema: object = { schema: "", schemaVersion: "", attributeName: "" };

export const Schema = {
  encode(message: Schema, writer: Writer = Writer.create()): Writer {
    Object.entries(message.context).forEach(([key, value]) => {
      Schema_ContextEntry.encode(
        { key: key as any, value },
        writer.uint32(34).fork()
      ).ldelim();
    });
    if (message.schema !== "") {
      writer.uint32(10).string(message.schema);
    }
    if (message.schemaVersion !== "") {
      writer.uint32(18).string(message.schemaVersion);
    }
    if (message.attributeName !== "") {
      writer.uint32(26).string(message.attributeName);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): Schema {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseSchema } as Schema;
    message.context = {};
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 4:
          const entry4 = Schema_ContextEntry.decode(reader, reader.uint32());
          if (entry4.value !== undefined) {
            message.context[entry4.key] = entry4.value;
          }
          break;
        case 1:
          message.schema = reader.string();
          break;
        case 2:
          message.schemaVersion = reader.string();
          break;
        case 3:
          message.attributeName = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Schema {
    const message = { ...baseSchema } as Schema;
    message.context = {};
    if (object.context !== undefined && object.context !== null) {
      Object.entries(object.context).forEach(([key, value]) => {
        message.context[key] = String(value);
      });
    }
    if (object.schema !== undefined && object.schema !== null) {
      message.schema = String(object.schema);
    }
    if (object.schemaVersion !== undefined && object.schemaVersion !== null) {
      message.schemaVersion = String(object.schemaVersion);
    }
    if (object.attributeName !== undefined && object.attributeName !== null) {
      message.attributeName = String(object.attributeName);
    }
    return message;
  },

  toJSON(message: Schema): unknown {
    const obj: any = {};
    obj.context = {};
    if (message.context) {
      Object.entries(message.context).forEach(([k, v]) => {
        obj.context[k] = v;
      });
    }
    message.schema !== undefined && (obj.schema = message.schema);
    message.schemaVersion !== undefined &&
      (obj.schemaVersion = message.schemaVersion);
    message.attributeName !== undefined &&
      (obj.attributeName = message.attributeName);
    return obj;
  },

  fromPartial(object: DeepPartial<Schema>): Schema {
    const message = { ...baseSchema } as Schema;
    message.context = {};
    if (object.context !== undefined && object.context !== null) {
      Object.entries(object.context).forEach(([key, value]) => {
        if (value !== undefined) {
          message.context[key] = String(value);
        }
      });
    }
    if (object.schema !== undefined && object.schema !== null) {
      message.schema = object.schema;
    }
    if (object.schemaVersion !== undefined && object.schemaVersion !== null) {
      message.schemaVersion = object.schemaVersion;
    }
    if (object.attributeName !== undefined && object.attributeName !== null) {
      message.attributeName = object.attributeName;
    }
    return message;
  },
};

const baseSchema_ContextEntry: object = { key: "", value: "" };

export const Schema_ContextEntry = {
  encode(
    message: Schema_ContextEntry,
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

  decode(input: Reader | Uint8Array, length?: number): Schema_ContextEntry {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseSchema_ContextEntry } as Schema_ContextEntry;
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

  fromJSON(object: any): Schema_ContextEntry {
    const message = { ...baseSchema_ContextEntry } as Schema_ContextEntry;
    if (object.key !== undefined && object.key !== null) {
      message.key = String(object.key);
    }
    if (object.value !== undefined && object.value !== null) {
      message.value = String(object.value);
    }
    return message;
  },

  toJSON(message: Schema_ContextEntry): unknown {
    const obj: any = {};
    message.key !== undefined && (obj.key = message.key);
    message.value !== undefined && (obj.value = message.value);
    return obj;
  },

  fromPartial(object: DeepPartial<Schema_ContextEntry>): Schema_ContextEntry {
    const message = { ...baseSchema_ContextEntry } as Schema_ContextEntry;
    if (object.key !== undefined && object.key !== null) {
      message.key = object.key;
    }
    if (object.value !== undefined && object.value !== null) {
      message.value = object.value;
    }
    return message;
  },
};

const basePropertyDefinition: object = { context: "", type: "", property: "" };

export const PropertyDefinition = {
  encode(
    message: PropertyDefinition,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.context !== "") {
      writer.uint32(10).string(message.context);
    }
    if (message.type !== "") {
      writer.uint32(18).string(message.type);
    }
    if (message.property !== "") {
      writer.uint32(26).string(message.property);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): PropertyDefinition {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...basePropertyDefinition } as PropertyDefinition;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.context = reader.string();
          break;
        case 2:
          message.type = reader.string();
          break;
        case 3:
          message.property = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): PropertyDefinition {
    const message = { ...basePropertyDefinition } as PropertyDefinition;
    if (object.context !== undefined && object.context !== null) {
      message.context = String(object.context);
    }
    if (object.type !== undefined && object.type !== null) {
      message.type = String(object.type);
    }
    if (object.property !== undefined && object.property !== null) {
      message.property = String(object.property);
    }
    return message;
  },

  toJSON(message: PropertyDefinition): unknown {
    const obj: any = {};
    message.context !== undefined && (obj.context = message.context);
    message.type !== undefined && (obj.type = message.type);
    message.property !== undefined && (obj.property = message.property);
    return obj;
  },

  fromPartial(object: DeepPartial<PropertyDefinition>): PropertyDefinition {
    const message = { ...basePropertyDefinition } as PropertyDefinition;
    if (object.context !== undefined && object.context !== null) {
      message.context = object.context;
    }
    if (object.type !== undefined && object.type !== null) {
      message.type = object.type;
    }
    if (object.property !== undefined && object.property !== null) {
      message.property = object.property;
    }
    return message;
  },
};

const basePropertyConstraint: object = {
  issuers: "",
  subset: "",
  onlyPrimary: false,
};

export const PropertyConstraint = {
  encode(
    message: PropertyConstraint,
    writer: Writer = Writer.create()
  ): Writer {
    for (const v of message.issuers) {
      writer.uint32(10).string(v!);
    }
    for (const v of message.subset) {
      writer.uint32(18).string(v!);
    }
    if (message.onlyPrimary === true) {
      writer.uint32(24).bool(message.onlyPrimary);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): PropertyConstraint {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...basePropertyConstraint } as PropertyConstraint;
    message.issuers = [];
    message.subset = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.issuers.push(reader.string());
          break;
        case 2:
          message.subset.push(reader.string());
          break;
        case 3:
          message.onlyPrimary = reader.bool();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): PropertyConstraint {
    const message = { ...basePropertyConstraint } as PropertyConstraint;
    message.issuers = [];
    message.subset = [];
    if (object.issuers !== undefined && object.issuers !== null) {
      for (const e of object.issuers) {
        message.issuers.push(String(e));
      }
    }
    if (object.subset !== undefined && object.subset !== null) {
      for (const e of object.subset) {
        message.subset.push(String(e));
      }
    }
    if (object.onlyPrimary !== undefined && object.onlyPrimary !== null) {
      message.onlyPrimary = Boolean(object.onlyPrimary);
    }
    return message;
  },

  toJSON(message: PropertyConstraint): unknown {
    const obj: any = {};
    if (message.issuers) {
      obj.issuers = message.issuers.map((e) => e);
    } else {
      obj.issuers = [];
    }
    if (message.subset) {
      obj.subset = message.subset.map((e) => e);
    } else {
      obj.subset = [];
    }
    message.onlyPrimary !== undefined &&
      (obj.onlyPrimary = message.onlyPrimary);
    return obj;
  },

  fromPartial(object: DeepPartial<PropertyConstraint>): PropertyConstraint {
    const message = { ...basePropertyConstraint } as PropertyConstraint;
    message.issuers = [];
    message.subset = [];
    if (object.issuers !== undefined && object.issuers !== null) {
      for (const e of object.issuers) {
        message.issuers.push(e);
      }
    }
    if (object.subset !== undefined && object.subset !== null) {
      for (const e of object.subset) {
        message.subset.push(e);
      }
    }
    if (object.onlyPrimary !== undefined && object.onlyPrimary !== null) {
      message.onlyPrimary = object.onlyPrimary;
    }
    return message;
  },
};

const basePropertyMask: object = {};

export const PropertyMask = {
  encode(message: PropertyMask, writer: Writer = Writer.create()): Writer {
    if (message.definition !== undefined) {
      PropertyDefinition.encode(
        message.definition,
        writer.uint32(10).fork()
      ).ldelim();
    }
    if (message.constraint !== undefined) {
      PropertyConstraint.encode(
        message.constraint,
        writer.uint32(18).fork()
      ).ldelim();
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): PropertyMask {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...basePropertyMask } as PropertyMask;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.definition = PropertyDefinition.decode(
            reader,
            reader.uint32()
          );
          break;
        case 2:
          message.constraint = PropertyConstraint.decode(
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

  fromJSON(object: any): PropertyMask {
    const message = { ...basePropertyMask } as PropertyMask;
    if (object.definition !== undefined && object.definition !== null) {
      message.definition = PropertyDefinition.fromJSON(object.definition);
    }
    if (object.constraint !== undefined && object.constraint !== null) {
      message.constraint = PropertyConstraint.fromJSON(object.constraint);
    }
    return message;
  },

  toJSON(message: PropertyMask): unknown {
    const obj: any = {};
    message.definition !== undefined &&
      (obj.definition = message.definition
        ? PropertyDefinition.toJSON(message.definition)
        : undefined);
    message.constraint !== undefined &&
      (obj.constraint = message.constraint
        ? PropertyConstraint.toJSON(message.constraint)
        : undefined);
    return obj;
  },

  fromPartial(object: DeepPartial<PropertyMask>): PropertyMask {
    const message = { ...basePropertyMask } as PropertyMask;
    if (object.definition !== undefined && object.definition !== null) {
      message.definition = PropertyDefinition.fromPartial(object.definition);
    }
    if (object.constraint !== undefined && object.constraint !== null) {
      message.constraint = PropertyConstraint.fromPartial(object.constraint);
    }
    return message;
  },
};

const basePropertyMetadata: object = {
  primary: false,
  assuranceLevel: 0,
  issuer: "",
  verifier: "",
};

export const PropertyMetadata = {
  encode(message: PropertyMetadata, writer: Writer = Writer.create()): Writer {
    if (message.primary === true) {
      writer.uint32(8).bool(message.primary);
    }
    if (message.assuranceLevel !== 0) {
      writer.uint32(16).int32(message.assuranceLevel);
    }
    if (message.issuer !== "") {
      writer.uint32(26).string(message.issuer);
    }
    if (message.verificationTime !== undefined) {
      Timestamp.encode(
        toTimestamp(message.verificationTime),
        writer.uint32(34).fork()
      ).ldelim();
    }
    if (message.verifier !== "") {
      writer.uint32(42).string(message.verifier);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): PropertyMetadata {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...basePropertyMetadata } as PropertyMetadata;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.primary = reader.bool();
          break;
        case 2:
          message.assuranceLevel = reader.int32() as any;
          break;
        case 3:
          message.issuer = reader.string();
          break;
        case 4:
          message.verificationTime = fromTimestamp(
            Timestamp.decode(reader, reader.uint32())
          );
          break;
        case 5:
          message.verifier = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): PropertyMetadata {
    const message = { ...basePropertyMetadata } as PropertyMetadata;
    if (object.primary !== undefined && object.primary !== null) {
      message.primary = Boolean(object.primary);
    }
    if (object.assuranceLevel !== undefined && object.assuranceLevel !== null) {
      message.assuranceLevel = assuranceLevelFromJSON(object.assuranceLevel);
    }
    if (object.issuer !== undefined && object.issuer !== null) {
      message.issuer = String(object.issuer);
    }
    if (
      object.verificationTime !== undefined &&
      object.verificationTime !== null
    ) {
      message.verificationTime = fromJsonTimestamp(object.verificationTime);
    }
    if (object.verifier !== undefined && object.verifier !== null) {
      message.verifier = String(object.verifier);
    }
    return message;
  },

  toJSON(message: PropertyMetadata): unknown {
    const obj: any = {};
    message.primary !== undefined && (obj.primary = message.primary);
    message.assuranceLevel !== undefined &&
      (obj.assuranceLevel = assuranceLevelToJSON(message.assuranceLevel));
    message.issuer !== undefined && (obj.issuer = message.issuer);
    message.verificationTime !== undefined &&
      (obj.verificationTime = message.verificationTime.toISOString());
    message.verifier !== undefined && (obj.verifier = message.verifier);
    return obj;
  },

  fromPartial(object: DeepPartial<PropertyMetadata>): PropertyMetadata {
    const message = { ...basePropertyMetadata } as PropertyMetadata;
    if (object.primary !== undefined && object.primary !== null) {
      message.primary = object.primary;
    }
    if (object.assuranceLevel !== undefined && object.assuranceLevel !== null) {
      message.assuranceLevel = object.assuranceLevel;
    }
    if (object.issuer !== undefined && object.issuer !== null) {
      message.issuer = object.issuer;
    }
    if (
      object.verificationTime !== undefined &&
      object.verificationTime !== null
    ) {
      message.verificationTime = object.verificationTime;
    }
    if (object.verifier !== undefined && object.verifier !== null) {
      message.verifier = object.verifier;
    }
    return message;
  },
};

const baseProperty: object = { id: "" };

export const Property = {
  encode(message: Property, writer: Writer = Writer.create()): Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.definition !== undefined) {
      PropertyDefinition.encode(
        message.definition,
        writer.uint32(18).fork()
      ).ldelim();
    }
    if (message.meta !== undefined) {
      PropertyMetadata.encode(message.meta, writer.uint32(26).fork()).ldelim();
    }
    if (message.value?.$case === "objectValue") {
      Value.encode(
        message.value.objectValue,
        writer.uint32(34).fork()
      ).ldelim();
    }
    if (message.value?.$case === "referenceValue") {
      writer.uint32(42).string(message.value.referenceValue);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): Property {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseProperty } as Property;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string();
          break;
        case 2:
          message.definition = PropertyDefinition.decode(
            reader,
            reader.uint32()
          );
          break;
        case 3:
          message.meta = PropertyMetadata.decode(reader, reader.uint32());
          break;
        case 4:
          message.value = {
            $case: "objectValue",
            objectValue: Value.decode(reader, reader.uint32()),
          };
          break;
        case 5:
          message.value = {
            $case: "referenceValue",
            referenceValue: reader.string(),
          };
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Property {
    const message = { ...baseProperty } as Property;
    if (object.id !== undefined && object.id !== null) {
      message.id = String(object.id);
    }
    if (object.definition !== undefined && object.definition !== null) {
      message.definition = PropertyDefinition.fromJSON(object.definition);
    }
    if (object.meta !== undefined && object.meta !== null) {
      message.meta = PropertyMetadata.fromJSON(object.meta);
    }
    if (object.objectValue !== undefined && object.objectValue !== null) {
      message.value = {
        $case: "objectValue",
        objectValue: Value.fromJSON(object.objectValue),
      };
    }
    if (object.referenceValue !== undefined && object.referenceValue !== null) {
      message.value = {
        $case: "referenceValue",
        referenceValue: String(object.referenceValue),
      };
    }
    return message;
  },

  toJSON(message: Property): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    message.definition !== undefined &&
      (obj.definition = message.definition
        ? PropertyDefinition.toJSON(message.definition)
        : undefined);
    message.meta !== undefined &&
      (obj.meta = message.meta
        ? PropertyMetadata.toJSON(message.meta)
        : undefined);
    message.value?.$case === "objectValue" &&
      (obj.objectValue = message.value?.objectValue
        ? Value.toJSON(message.value?.objectValue)
        : undefined);
    message.value?.$case === "referenceValue" &&
      (obj.referenceValue = message.value?.referenceValue);
    return obj;
  },

  fromPartial(object: DeepPartial<Property>): Property {
    const message = { ...baseProperty } as Property;
    if (object.id !== undefined && object.id !== null) {
      message.id = object.id;
    }
    if (object.definition !== undefined && object.definition !== null) {
      message.definition = PropertyDefinition.fromPartial(object.definition);
    }
    if (object.meta !== undefined && object.meta !== null) {
      message.meta = PropertyMetadata.fromPartial(object.meta);
    }
    if (
      object.value?.$case === "objectValue" &&
      object.value?.objectValue !== undefined &&
      object.value?.objectValue !== null
    ) {
      message.value = {
        $case: "objectValue",
        objectValue: Value.fromPartial(object.value.objectValue),
      };
    }
    if (
      object.value?.$case === "referenceValue" &&
      object.value?.referenceValue !== undefined &&
      object.value?.referenceValue !== null
    ) {
      message.value = {
        $case: "referenceValue",
        referenceValue: object.value.referenceValue,
      };
    }
    return message;
  },
};

const basePropertyBatchOperation: object = {};

export const PropertyBatchOperation = {
  encode(
    message: PropertyBatchOperation,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.operation?.$case === "add") {
      Property.encode(message.operation.add, writer.uint32(10).fork()).ldelim();
    }
    if (message.operation?.$case === "replace") {
      Property.encode(
        message.operation.replace,
        writer.uint32(18).fork()
      ).ldelim();
    }
    if (message.operation?.$case === "remove") {
      Property.encode(
        message.operation.remove,
        writer.uint32(26).fork()
      ).ldelim();
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): PropertyBatchOperation {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...basePropertyBatchOperation } as PropertyBatchOperation;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.operation = {
            $case: "add",
            add: Property.decode(reader, reader.uint32()),
          };
          break;
        case 2:
          message.operation = {
            $case: "replace",
            replace: Property.decode(reader, reader.uint32()),
          };
          break;
        case 3:
          message.operation = {
            $case: "remove",
            remove: Property.decode(reader, reader.uint32()),
          };
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): PropertyBatchOperation {
    const message = { ...basePropertyBatchOperation } as PropertyBatchOperation;
    if (object.add !== undefined && object.add !== null) {
      message.operation = { $case: "add", add: Property.fromJSON(object.add) };
    }
    if (object.replace !== undefined && object.replace !== null) {
      message.operation = {
        $case: "replace",
        replace: Property.fromJSON(object.replace),
      };
    }
    if (object.remove !== undefined && object.remove !== null) {
      message.operation = {
        $case: "remove",
        remove: Property.fromJSON(object.remove),
      };
    }
    return message;
  },

  toJSON(message: PropertyBatchOperation): unknown {
    const obj: any = {};
    message.operation?.$case === "add" &&
      (obj.add = message.operation?.add
        ? Property.toJSON(message.operation?.add)
        : undefined);
    message.operation?.$case === "replace" &&
      (obj.replace = message.operation?.replace
        ? Property.toJSON(message.operation?.replace)
        : undefined);
    message.operation?.$case === "remove" &&
      (obj.remove = message.operation?.remove
        ? Property.toJSON(message.operation?.remove)
        : undefined);
    return obj;
  },

  fromPartial(
    object: DeepPartial<PropertyBatchOperation>
  ): PropertyBatchOperation {
    const message = { ...basePropertyBatchOperation } as PropertyBatchOperation;
    if (
      object.operation?.$case === "add" &&
      object.operation?.add !== undefined &&
      object.operation?.add !== null
    ) {
      message.operation = {
        $case: "add",
        add: Property.fromPartial(object.operation.add),
      };
    }
    if (
      object.operation?.$case === "replace" &&
      object.operation?.replace !== undefined &&
      object.operation?.replace !== null
    ) {
      message.operation = {
        $case: "replace",
        replace: Property.fromPartial(object.operation.replace),
      };
    }
    if (
      object.operation?.$case === "remove" &&
      object.operation?.remove !== undefined &&
      object.operation?.remove !== null
    ) {
      message.operation = {
        $case: "remove",
        remove: Property.fromPartial(object.operation.remove),
      };
    }
    return message;
  },
};

const baseBatchOperationResult: object = { index: "0" };

export const BatchOperationResult = {
  encode(
    message: BatchOperationResult,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.index !== "0") {
      writer.uint32(32).uint64(message.index);
    }
    if (message.result?.$case === "success") {
      BatchOperationResultSuccess.encode(
        message.result.success,
        writer.uint32(42).fork()
      ).ldelim();
    }
    if (message.result?.$case === "error") {
      BatchOperationResultError.encode(
        message.result.error,
        writer.uint32(50).fork()
      ).ldelim();
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): BatchOperationResult {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseBatchOperationResult } as BatchOperationResult;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 4:
          message.index = longToString(reader.uint64() as Long);
          break;
        case 5:
          message.result = {
            $case: "success",
            success: BatchOperationResultSuccess.decode(
              reader,
              reader.uint32()
            ),
          };
          break;
        case 6:
          message.result = {
            $case: "error",
            error: BatchOperationResultError.decode(reader, reader.uint32()),
          };
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): BatchOperationResult {
    const message = { ...baseBatchOperationResult } as BatchOperationResult;
    if (object.index !== undefined && object.index !== null) {
      message.index = String(object.index);
    }
    if (object.success !== undefined && object.success !== null) {
      message.result = {
        $case: "success",
        success: BatchOperationResultSuccess.fromJSON(object.success),
      };
    }
    if (object.error !== undefined && object.error !== null) {
      message.result = {
        $case: "error",
        error: BatchOperationResultError.fromJSON(object.error),
      };
    }
    return message;
  },

  toJSON(message: BatchOperationResult): unknown {
    const obj: any = {};
    message.index !== undefined && (obj.index = message.index);
    message.result?.$case === "success" &&
      (obj.success = message.result?.success
        ? BatchOperationResultSuccess.toJSON(message.result?.success)
        : undefined);
    message.result?.$case === "error" &&
      (obj.error = message.result?.error
        ? BatchOperationResultError.toJSON(message.result?.error)
        : undefined);
    return obj;
  },

  fromPartial(object: DeepPartial<BatchOperationResult>): BatchOperationResult {
    const message = { ...baseBatchOperationResult } as BatchOperationResult;
    if (object.index !== undefined && object.index !== null) {
      message.index = object.index;
    }
    if (
      object.result?.$case === "success" &&
      object.result?.success !== undefined &&
      object.result?.success !== null
    ) {
      message.result = {
        $case: "success",
        success: BatchOperationResultSuccess.fromPartial(object.result.success),
      };
    }
    if (
      object.result?.$case === "error" &&
      object.result?.error !== undefined &&
      object.result?.error !== null
    ) {
      message.result = {
        $case: "error",
        error: BatchOperationResultError.fromPartial(object.result.error),
      };
    }
    return message;
  },
};

const baseBatchOperationResultSuccess: object = { propertyId: "" };

export const BatchOperationResultSuccess = {
  encode(
    message: BatchOperationResultSuccess,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.propertyId !== "") {
      writer.uint32(10).string(message.propertyId);
    }
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): BatchOperationResultSuccess {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseBatchOperationResultSuccess,
    } as BatchOperationResultSuccess;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.propertyId = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): BatchOperationResultSuccess {
    const message = {
      ...baseBatchOperationResultSuccess,
    } as BatchOperationResultSuccess;
    if (object.propertyId !== undefined && object.propertyId !== null) {
      message.propertyId = String(object.propertyId);
    }
    return message;
  },

  toJSON(message: BatchOperationResultSuccess): unknown {
    const obj: any = {};
    message.propertyId !== undefined && (obj.propertyId = message.propertyId);
    return obj;
  },

  fromPartial(
    object: DeepPartial<BatchOperationResultSuccess>
  ): BatchOperationResultSuccess {
    const message = {
      ...baseBatchOperationResultSuccess,
    } as BatchOperationResultSuccess;
    if (object.propertyId !== undefined && object.propertyId !== null) {
      message.propertyId = object.propertyId;
    }
    return message;
  },
};

const baseBatchOperationResultError: object = { message: "" };

export const BatchOperationResultError = {
  encode(
    message: BatchOperationResultError,
    writer: Writer = Writer.create()
  ): Writer {
    for (const v of message.message) {
      writer.uint32(10).string(v!);
    }
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): BatchOperationResultError {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseBatchOperationResultError,
    } as BatchOperationResultError;
    message.message = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.message.push(reader.string());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): BatchOperationResultError {
    const message = {
      ...baseBatchOperationResultError,
    } as BatchOperationResultError;
    message.message = [];
    if (object.message !== undefined && object.message !== null) {
      for (const e of object.message) {
        message.message.push(String(e));
      }
    }
    return message;
  },

  toJSON(message: BatchOperationResultError): unknown {
    const obj: any = {};
    if (message.message) {
      obj.message = message.message.map((e) => e);
    } else {
      obj.message = [];
    }
    return obj;
  },

  fromPartial(
    object: DeepPartial<BatchOperationResultError>
  ): BatchOperationResultError {
    const message = {
      ...baseBatchOperationResultError,
    } as BatchOperationResultError;
    message.message = [];
    if (object.message !== undefined && object.message !== null) {
      for (const e of object.message) {
        message.message.push(e);
      }
    }
    return message;
  },
};

const baseBatchError: object = { index: "0", message: "" };

export const BatchError = {
  encode(message: BatchError, writer: Writer = Writer.create()): Writer {
    if (message.index !== "0") {
      writer.uint32(8).int64(message.index);
    }
    for (const v of message.message) {
      writer.uint32(18).string(v!);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): BatchError {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseBatchError } as BatchError;
    message.message = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.index = longToString(reader.int64() as Long);
          break;
        case 2:
          message.message.push(reader.string());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): BatchError {
    const message = { ...baseBatchError } as BatchError;
    message.message = [];
    if (object.index !== undefined && object.index !== null) {
      message.index = String(object.index);
    }
    if (object.message !== undefined && object.message !== null) {
      for (const e of object.message) {
        message.message.push(String(e));
      }
    }
    return message;
  },

  toJSON(message: BatchError): unknown {
    const obj: any = {};
    message.index !== undefined && (obj.index = message.index);
    if (message.message) {
      obj.message = message.message.map((e) => e);
    } else {
      obj.message = [];
    }
    return obj;
  },

  fromPartial(object: DeepPartial<BatchError>): BatchError {
    const message = { ...baseBatchError } as BatchError;
    message.message = [];
    if (object.index !== undefined && object.index !== null) {
      message.index = object.index;
    }
    if (object.message !== undefined && object.message !== null) {
      for (const e of object.message) {
        message.message.push(e);
      }
    }
    return message;
  },
};

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
