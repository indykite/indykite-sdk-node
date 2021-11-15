/* eslint-disable */
import { util, configure, Writer, Reader } from "protobufjs/minimal";
import * as Long from "long";

export const protobufPackage = "google.protobuf";

/**
 * `NullValue` is a singleton enumeration to represent the null value for the
 * `Value` type union.
 *
 *  The JSON representation for `NullValue` is JSON `null`.
 */
export enum NullValue {
  /** NULL_VALUE - Null value. */
  NULL_VALUE = 0,
  UNRECOGNIZED = -1,
}

export function nullValueFromJSON(object: any): NullValue {
  switch (object) {
    case 0:
    case "NULL_VALUE":
      return NullValue.NULL_VALUE;
    case -1:
    case "UNRECOGNIZED":
    default:
      return NullValue.UNRECOGNIZED;
  }
}

export function nullValueToJSON(object: NullValue): string {
  switch (object) {
    case NullValue.NULL_VALUE:
      return "NULL_VALUE";
    default:
      return "UNKNOWN";
  }
}

/**
 * `Struct` represents a structured data value, consisting of fields
 * which map to dynamically typed values. In some languages, `Struct`
 * might be supported by a native representation. For example, in
 * scripting languages like JS a struct is represented as an
 * object. The details of that representation are described together
 * with the proto support for the language.
 *
 * The JSON representation for `Struct` is JSON object.
 */
export interface Struct {
  /** Unordered map of dynamically typed values. */
  fields: { [key: string]: Value };
}

export interface Struct_FieldsEntry {
  key: string;
  value?: Value;
}

/**
 * `Value` represents a dynamically typed value which can be either
 * null, a number, a string, a boolean, a recursive struct value, or a
 * list of values. A producer of value is expected to set one of that
 * variants, absence of any variant indicates an error.
 *
 * The JSON representation for `Value` is JSON value.
 */
export interface Value {
  kind?:
    | { $case: "nullValue"; nullValue: NullValue }
    | { $case: "numberValue"; numberValue: number }
    | { $case: "stringValue"; stringValue: string }
    | { $case: "boolValue"; boolValue: boolean }
    | { $case: "structValue"; structValue: Struct }
    | { $case: "listValue"; listValue: ListValue };
}

/**
 * `ListValue` is a wrapper around a repeated field of values.
 *
 * The JSON representation for `ListValue` is JSON array.
 */
export interface ListValue {
  /** Repeated field of dynamically typed values. */
  values: Value[];
}

const baseStruct: object = {};

export const Struct = {
  encode(message: Struct, writer: Writer = Writer.create()): Writer {
    Object.entries(message.fields).forEach(([key, value]) => {
      Struct_FieldsEntry.encode(
        { key: key as any, value },
        writer.uint32(10).fork()
      ).ldelim();
    });
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): Struct {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseStruct } as Struct;
    message.fields = {};
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          const entry1 = Struct_FieldsEntry.decode(reader, reader.uint32());
          if (entry1.value !== undefined) {
            message.fields[entry1.key] = entry1.value;
          }
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Struct {
    const message = { ...baseStruct } as Struct;
    message.fields = {};
    if (object.fields !== undefined && object.fields !== null) {
      Object.entries(object.fields).forEach(([key, value]) => {
        message.fields[key] = Value.fromJSON(value);
      });
    }
    return message;
  },

  toJSON(message: Struct): unknown {
    const obj: any = {};
    obj.fields = {};
    if (message.fields) {
      Object.entries(message.fields).forEach(([k, v]) => {
        obj.fields[k] = Value.toJSON(v);
      });
    }
    return obj;
  },

  fromPartial(object: DeepPartial<Struct>): Struct {
    const message = { ...baseStruct } as Struct;
    message.fields = {};
    if (object.fields !== undefined && object.fields !== null) {
      Object.entries(object.fields).forEach(([key, value]) => {
        if (value !== undefined) {
          message.fields[key] = Value.fromPartial(value);
        }
      });
    }
    return message;
  },
};

const baseStruct_FieldsEntry: object = { key: "" };

export const Struct_FieldsEntry = {
  encode(
    message: Struct_FieldsEntry,
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

  decode(input: Reader | Uint8Array, length?: number): Struct_FieldsEntry {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseStruct_FieldsEntry } as Struct_FieldsEntry;
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

  fromJSON(object: any): Struct_FieldsEntry {
    const message = { ...baseStruct_FieldsEntry } as Struct_FieldsEntry;
    if (object.key !== undefined && object.key !== null) {
      message.key = String(object.key);
    }
    if (object.value !== undefined && object.value !== null) {
      message.value = Value.fromJSON(object.value);
    }
    return message;
  },

  toJSON(message: Struct_FieldsEntry): unknown {
    const obj: any = {};
    message.key !== undefined && (obj.key = message.key);
    message.value !== undefined &&
      (obj.value = message.value ? Value.toJSON(message.value) : undefined);
    return obj;
  },

  fromPartial(object: DeepPartial<Struct_FieldsEntry>): Struct_FieldsEntry {
    const message = { ...baseStruct_FieldsEntry } as Struct_FieldsEntry;
    if (object.key !== undefined && object.key !== null) {
      message.key = object.key;
    }
    if (object.value !== undefined && object.value !== null) {
      message.value = Value.fromPartial(object.value);
    }
    return message;
  },
};

const baseValue: object = {};

export const Value = {
  encode(message: Value, writer: Writer = Writer.create()): Writer {
    if (message.kind?.$case === "nullValue") {
      writer.uint32(8).int32(message.kind.nullValue);
    }
    if (message.kind?.$case === "numberValue") {
      writer.uint32(17).double(message.kind.numberValue);
    }
    if (message.kind?.$case === "stringValue") {
      writer.uint32(26).string(message.kind.stringValue);
    }
    if (message.kind?.$case === "boolValue") {
      writer.uint32(32).bool(message.kind.boolValue);
    }
    if (message.kind?.$case === "structValue") {
      Struct.encode(
        message.kind.structValue,
        writer.uint32(42).fork()
      ).ldelim();
    }
    if (message.kind?.$case === "listValue") {
      ListValue.encode(
        message.kind.listValue,
        writer.uint32(50).fork()
      ).ldelim();
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): Value {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseValue } as Value;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.kind = {
            $case: "nullValue",
            nullValue: reader.int32() as any,
          };
          break;
        case 2:
          message.kind = { $case: "numberValue", numberValue: reader.double() };
          break;
        case 3:
          message.kind = { $case: "stringValue", stringValue: reader.string() };
          break;
        case 4:
          message.kind = { $case: "boolValue", boolValue: reader.bool() };
          break;
        case 5:
          message.kind = {
            $case: "structValue",
            structValue: Struct.decode(reader, reader.uint32()),
          };
          break;
        case 6:
          message.kind = {
            $case: "listValue",
            listValue: ListValue.decode(reader, reader.uint32()),
          };
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Value {
    const message = { ...baseValue } as Value;
    if (object.nullValue !== undefined && object.nullValue !== null) {
      message.kind = {
        $case: "nullValue",
        nullValue: nullValueFromJSON(object.nullValue),
      };
    }
    if (object.numberValue !== undefined && object.numberValue !== null) {
      message.kind = {
        $case: "numberValue",
        numberValue: Number(object.numberValue),
      };
    }
    if (object.stringValue !== undefined && object.stringValue !== null) {
      message.kind = {
        $case: "stringValue",
        stringValue: String(object.stringValue),
      };
    }
    if (object.boolValue !== undefined && object.boolValue !== null) {
      message.kind = {
        $case: "boolValue",
        boolValue: Boolean(object.boolValue),
      };
    }
    if (object.structValue !== undefined && object.structValue !== null) {
      message.kind = {
        $case: "structValue",
        structValue: Struct.fromJSON(object.structValue),
      };
    }
    if (object.listValue !== undefined && object.listValue !== null) {
      message.kind = {
        $case: "listValue",
        listValue: ListValue.fromJSON(object.listValue),
      };
    }
    return message;
  },

  toJSON(message: Value): unknown {
    const obj: any = {};
    message.kind?.$case === "nullValue" &&
      (obj.nullValue =
        message.kind?.nullValue !== undefined
          ? nullValueToJSON(message.kind?.nullValue)
          : undefined);
    message.kind?.$case === "numberValue" &&
      (obj.numberValue = message.kind?.numberValue);
    message.kind?.$case === "stringValue" &&
      (obj.stringValue = message.kind?.stringValue);
    message.kind?.$case === "boolValue" &&
      (obj.boolValue = message.kind?.boolValue);
    message.kind?.$case === "structValue" &&
      (obj.structValue = message.kind?.structValue
        ? Struct.toJSON(message.kind?.structValue)
        : undefined);
    message.kind?.$case === "listValue" &&
      (obj.listValue = message.kind?.listValue
        ? ListValue.toJSON(message.kind?.listValue)
        : undefined);
    return obj;
  },

  fromPartial(object: DeepPartial<Value>): Value {
    const message = { ...baseValue } as Value;
    if (
      object.kind?.$case === "nullValue" &&
      object.kind?.nullValue !== undefined &&
      object.kind?.nullValue !== null
    ) {
      message.kind = { $case: "nullValue", nullValue: object.kind.nullValue };
    }
    if (
      object.kind?.$case === "numberValue" &&
      object.kind?.numberValue !== undefined &&
      object.kind?.numberValue !== null
    ) {
      message.kind = {
        $case: "numberValue",
        numberValue: object.kind.numberValue,
      };
    }
    if (
      object.kind?.$case === "stringValue" &&
      object.kind?.stringValue !== undefined &&
      object.kind?.stringValue !== null
    ) {
      message.kind = {
        $case: "stringValue",
        stringValue: object.kind.stringValue,
      };
    }
    if (
      object.kind?.$case === "boolValue" &&
      object.kind?.boolValue !== undefined &&
      object.kind?.boolValue !== null
    ) {
      message.kind = { $case: "boolValue", boolValue: object.kind.boolValue };
    }
    if (
      object.kind?.$case === "structValue" &&
      object.kind?.structValue !== undefined &&
      object.kind?.structValue !== null
    ) {
      message.kind = {
        $case: "structValue",
        structValue: Struct.fromPartial(object.kind.structValue),
      };
    }
    if (
      object.kind?.$case === "listValue" &&
      object.kind?.listValue !== undefined &&
      object.kind?.listValue !== null
    ) {
      message.kind = {
        $case: "listValue",
        listValue: ListValue.fromPartial(object.kind.listValue),
      };
    }
    return message;
  },
};

const baseListValue: object = {};

export const ListValue = {
  encode(message: ListValue, writer: Writer = Writer.create()): Writer {
    for (const v of message.values) {
      Value.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): ListValue {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseListValue } as ListValue;
    message.values = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.values.push(Value.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ListValue {
    const message = { ...baseListValue } as ListValue;
    message.values = [];
    if (object.values !== undefined && object.values !== null) {
      for (const e of object.values) {
        message.values.push(Value.fromJSON(e));
      }
    }
    return message;
  },

  toJSON(message: ListValue): unknown {
    const obj: any = {};
    if (message.values) {
      obj.values = message.values.map((e) => (e ? Value.toJSON(e) : undefined));
    } else {
      obj.values = [];
    }
    return obj;
  },

  fromPartial(object: DeepPartial<ListValue>): ListValue {
    const message = { ...baseListValue } as ListValue;
    message.values = [];
    if (object.values !== undefined && object.values !== null) {
      for (const e of object.values) {
        message.values.push(Value.fromPartial(e));
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

// If you get a compile-error about 'Constructor<Long> and ... have no overlap',
// add '--ts_proto_opt=esModuleInterop=true' as a flag when calling 'protoc'.
if (util.Long !== Long) {
  util.Long = Long as any;
  configure();
}
