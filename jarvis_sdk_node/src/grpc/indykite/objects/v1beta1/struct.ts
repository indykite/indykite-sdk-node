/* eslint-disable */
import { util, configure, Writer, Reader } from "protobufjs/minimal";
import * as Long from "long";
import { Timestamp } from "../../../google/protobuf/timestamp";
import {
  NullValue,
  nullValueFromJSON,
  nullValueToJSON,
} from "../../../google/protobuf/struct";
import { Any } from "../../../google/protobuf/any";
import { Duration } from "../../../google/protobuf/duration";
import { Identifier } from "../../../indykite/objects/v1beta1/id";
import { LatLng } from "../../../google/type/latlng";

export const protobufPackage = "indykite.objects.v1beta1";

/** A message that can hold any of the supported value types. */
export interface Value {
  value?:
    | { $case: "nullValue"; nullValue: NullValue }
    | { $case: "boolValue"; boolValue: boolean }
    | { $case: "integerValue"; integerValue: string }
    | { $case: "unsignedIntegerValue"; unsignedIntegerValue: string }
    | { $case: "doubleValue"; doubleValue: number }
    | { $case: "anyValue"; anyValue: Any }
    | { $case: "valueTime"; valueTime: Date }
    | { $case: "durationValue"; durationValue: Duration }
    | { $case: "identifierValue"; identifierValue: Identifier }
    | { $case: "stringValue"; stringValue: string }
    | { $case: "bytesValue"; bytesValue: Buffer }
    | { $case: "geoPointValue"; geoPointValue: LatLng }
    | { $case: "arrayValue"; arrayValue: ArrayValue }
    | { $case: "mapValue"; mapValue: MapValue };
}

/** An array value. */
export interface ArrayValue {
  /** Values in the array. */
  values: Value[];
}

/** A map value. */
export interface MapValue {
  /** The map's keys and values. */
  fields: { [key: string]: Value };
}

export interface MapValue_FieldsEntry {
  key: string;
  value?: Value;
}

const baseValue: object = {};

export const Value = {
  encode(message: Value, writer: Writer = Writer.create()): Writer {
    if (message.value?.$case === "nullValue") {
      writer.uint32(8).int32(message.value.nullValue);
    }
    if (message.value?.$case === "boolValue") {
      writer.uint32(16).bool(message.value.boolValue);
    }
    if (message.value?.$case === "integerValue") {
      writer.uint32(24).int64(message.value.integerValue);
    }
    if (message.value?.$case === "unsignedIntegerValue") {
      writer.uint32(112).uint64(message.value.unsignedIntegerValue);
    }
    if (message.value?.$case === "doubleValue") {
      writer.uint32(33).double(message.value.doubleValue);
    }
    if (message.value?.$case === "anyValue") {
      Any.encode(message.value.anyValue, writer.uint32(42).fork()).ldelim();
    }
    if (message.value?.$case === "valueTime") {
      Timestamp.encode(
        toTimestamp(message.value.valueTime),
        writer.uint32(50).fork()
      ).ldelim();
    }
    if (message.value?.$case === "durationValue") {
      Duration.encode(
        message.value.durationValue,
        writer.uint32(98).fork()
      ).ldelim();
    }
    if (message.value?.$case === "identifierValue") {
      Identifier.encode(
        message.value.identifierValue,
        writer.uint32(106).fork()
      ).ldelim();
    }
    if (message.value?.$case === "stringValue") {
      writer.uint32(58).string(message.value.stringValue);
    }
    if (message.value?.$case === "bytesValue") {
      writer.uint32(66).bytes(message.value.bytesValue);
    }
    if (message.value?.$case === "geoPointValue") {
      LatLng.encode(
        message.value.geoPointValue,
        writer.uint32(74).fork()
      ).ldelim();
    }
    if (message.value?.$case === "arrayValue") {
      ArrayValue.encode(
        message.value.arrayValue,
        writer.uint32(82).fork()
      ).ldelim();
    }
    if (message.value?.$case === "mapValue") {
      MapValue.encode(
        message.value.mapValue,
        writer.uint32(90).fork()
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
          message.value = {
            $case: "nullValue",
            nullValue: reader.int32() as any,
          };
          break;
        case 2:
          message.value = { $case: "boolValue", boolValue: reader.bool() };
          break;
        case 3:
          message.value = {
            $case: "integerValue",
            integerValue: longToString(reader.int64() as Long),
          };
          break;
        case 14:
          message.value = {
            $case: "unsignedIntegerValue",
            unsignedIntegerValue: longToString(reader.uint64() as Long),
          };
          break;
        case 4:
          message.value = {
            $case: "doubleValue",
            doubleValue: reader.double(),
          };
          break;
        case 5:
          message.value = {
            $case: "anyValue",
            anyValue: Any.decode(reader, reader.uint32()),
          };
          break;
        case 6:
          message.value = {
            $case: "valueTime",
            valueTime: fromTimestamp(Timestamp.decode(reader, reader.uint32())),
          };
          break;
        case 12:
          message.value = {
            $case: "durationValue",
            durationValue: Duration.decode(reader, reader.uint32()),
          };
          break;
        case 13:
          message.value = {
            $case: "identifierValue",
            identifierValue: Identifier.decode(reader, reader.uint32()),
          };
          break;
        case 7:
          message.value = {
            $case: "stringValue",
            stringValue: reader.string(),
          };
          break;
        case 8:
          message.value = {
            $case: "bytesValue",
            bytesValue: reader.bytes() as Buffer,
          };
          break;
        case 9:
          message.value = {
            $case: "geoPointValue",
            geoPointValue: LatLng.decode(reader, reader.uint32()),
          };
          break;
        case 10:
          message.value = {
            $case: "arrayValue",
            arrayValue: ArrayValue.decode(reader, reader.uint32()),
          };
          break;
        case 11:
          message.value = {
            $case: "mapValue",
            mapValue: MapValue.decode(reader, reader.uint32()),
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
      message.value = {
        $case: "nullValue",
        nullValue: nullValueFromJSON(object.nullValue),
      };
    }
    if (object.boolValue !== undefined && object.boolValue !== null) {
      message.value = {
        $case: "boolValue",
        boolValue: Boolean(object.boolValue),
      };
    }
    if (object.integerValue !== undefined && object.integerValue !== null) {
      message.value = {
        $case: "integerValue",
        integerValue: String(object.integerValue),
      };
    }
    if (
      object.unsignedIntegerValue !== undefined &&
      object.unsignedIntegerValue !== null
    ) {
      message.value = {
        $case: "unsignedIntegerValue",
        unsignedIntegerValue: String(object.unsignedIntegerValue),
      };
    }
    if (object.doubleValue !== undefined && object.doubleValue !== null) {
      message.value = {
        $case: "doubleValue",
        doubleValue: Number(object.doubleValue),
      };
    }
    if (object.anyValue !== undefined && object.anyValue !== null) {
      message.value = {
        $case: "anyValue",
        anyValue: Any.fromJSON(object.anyValue),
      };
    }
    if (object.valueTime !== undefined && object.valueTime !== null) {
      message.value = {
        $case: "valueTime",
        valueTime: fromJsonTimestamp(object.valueTime),
      };
    }
    if (object.durationValue !== undefined && object.durationValue !== null) {
      message.value = {
        $case: "durationValue",
        durationValue: Duration.fromJSON(object.durationValue),
      };
    }
    if (
      object.identifierValue !== undefined &&
      object.identifierValue !== null
    ) {
      message.value = {
        $case: "identifierValue",
        identifierValue: Identifier.fromJSON(object.identifierValue),
      };
    }
    if (object.stringValue !== undefined && object.stringValue !== null) {
      message.value = {
        $case: "stringValue",
        stringValue: String(object.stringValue),
      };
    }
    if (object.bytesValue !== undefined && object.bytesValue !== null) {
      message.value = {
        $case: "bytesValue",
        bytesValue: Buffer.from(bytesFromBase64(object.bytesValue)),
      };
    }
    if (object.geoPointValue !== undefined && object.geoPointValue !== null) {
      message.value = {
        $case: "geoPointValue",
        geoPointValue: LatLng.fromJSON(object.geoPointValue),
      };
    }
    if (object.arrayValue !== undefined && object.arrayValue !== null) {
      message.value = {
        $case: "arrayValue",
        arrayValue: ArrayValue.fromJSON(object.arrayValue),
      };
    }
    if (object.mapValue !== undefined && object.mapValue !== null) {
      message.value = {
        $case: "mapValue",
        mapValue: MapValue.fromJSON(object.mapValue),
      };
    }
    return message;
  },

  toJSON(message: Value): unknown {
    const obj: any = {};
    message.value?.$case === "nullValue" &&
      (obj.nullValue =
        message.value?.nullValue !== undefined
          ? nullValueToJSON(message.value?.nullValue)
          : undefined);
    message.value?.$case === "boolValue" &&
      (obj.boolValue = message.value?.boolValue);
    message.value?.$case === "integerValue" &&
      (obj.integerValue = message.value?.integerValue);
    message.value?.$case === "unsignedIntegerValue" &&
      (obj.unsignedIntegerValue = message.value?.unsignedIntegerValue);
    message.value?.$case === "doubleValue" &&
      (obj.doubleValue = message.value?.doubleValue);
    message.value?.$case === "anyValue" &&
      (obj.anyValue = message.value?.anyValue
        ? Any.toJSON(message.value?.anyValue)
        : undefined);
    message.value?.$case === "valueTime" &&
      (obj.valueTime = message.value?.valueTime.toISOString());
    message.value?.$case === "durationValue" &&
      (obj.durationValue = message.value?.durationValue
        ? Duration.toJSON(message.value?.durationValue)
        : undefined);
    message.value?.$case === "identifierValue" &&
      (obj.identifierValue = message.value?.identifierValue
        ? Identifier.toJSON(message.value?.identifierValue)
        : undefined);
    message.value?.$case === "stringValue" &&
      (obj.stringValue = message.value?.stringValue);
    message.value?.$case === "bytesValue" &&
      (obj.bytesValue =
        message.value?.bytesValue !== undefined
          ? base64FromBytes(message.value?.bytesValue)
          : undefined);
    message.value?.$case === "geoPointValue" &&
      (obj.geoPointValue = message.value?.geoPointValue
        ? LatLng.toJSON(message.value?.geoPointValue)
        : undefined);
    message.value?.$case === "arrayValue" &&
      (obj.arrayValue = message.value?.arrayValue
        ? ArrayValue.toJSON(message.value?.arrayValue)
        : undefined);
    message.value?.$case === "mapValue" &&
      (obj.mapValue = message.value?.mapValue
        ? MapValue.toJSON(message.value?.mapValue)
        : undefined);
    return obj;
  },

  fromPartial(object: DeepPartial<Value>): Value {
    const message = { ...baseValue } as Value;
    if (
      object.value?.$case === "nullValue" &&
      object.value?.nullValue !== undefined &&
      object.value?.nullValue !== null
    ) {
      message.value = { $case: "nullValue", nullValue: object.value.nullValue };
    }
    if (
      object.value?.$case === "boolValue" &&
      object.value?.boolValue !== undefined &&
      object.value?.boolValue !== null
    ) {
      message.value = { $case: "boolValue", boolValue: object.value.boolValue };
    }
    if (
      object.value?.$case === "integerValue" &&
      object.value?.integerValue !== undefined &&
      object.value?.integerValue !== null
    ) {
      message.value = {
        $case: "integerValue",
        integerValue: object.value.integerValue,
      };
    }
    if (
      object.value?.$case === "unsignedIntegerValue" &&
      object.value?.unsignedIntegerValue !== undefined &&
      object.value?.unsignedIntegerValue !== null
    ) {
      message.value = {
        $case: "unsignedIntegerValue",
        unsignedIntegerValue: object.value.unsignedIntegerValue,
      };
    }
    if (
      object.value?.$case === "doubleValue" &&
      object.value?.doubleValue !== undefined &&
      object.value?.doubleValue !== null
    ) {
      message.value = {
        $case: "doubleValue",
        doubleValue: object.value.doubleValue,
      };
    }
    if (
      object.value?.$case === "anyValue" &&
      object.value?.anyValue !== undefined &&
      object.value?.anyValue !== null
    ) {
      message.value = {
        $case: "anyValue",
        anyValue: Any.fromPartial(object.value.anyValue),
      };
    }
    if (
      object.value?.$case === "valueTime" &&
      object.value?.valueTime !== undefined &&
      object.value?.valueTime !== null
    ) {
      message.value = { $case: "valueTime", valueTime: object.value.valueTime };
    }
    if (
      object.value?.$case === "durationValue" &&
      object.value?.durationValue !== undefined &&
      object.value?.durationValue !== null
    ) {
      message.value = {
        $case: "durationValue",
        durationValue: Duration.fromPartial(object.value.durationValue),
      };
    }
    if (
      object.value?.$case === "identifierValue" &&
      object.value?.identifierValue !== undefined &&
      object.value?.identifierValue !== null
    ) {
      message.value = {
        $case: "identifierValue",
        identifierValue: Identifier.fromPartial(object.value.identifierValue),
      };
    }
    if (
      object.value?.$case === "stringValue" &&
      object.value?.stringValue !== undefined &&
      object.value?.stringValue !== null
    ) {
      message.value = {
        $case: "stringValue",
        stringValue: object.value.stringValue,
      };
    }
    if (
      object.value?.$case === "bytesValue" &&
      object.value?.bytesValue !== undefined &&
      object.value?.bytesValue !== null
    ) {
      message.value = {
        $case: "bytesValue",
        bytesValue: object.value.bytesValue,
      };
    }
    if (
      object.value?.$case === "geoPointValue" &&
      object.value?.geoPointValue !== undefined &&
      object.value?.geoPointValue !== null
    ) {
      message.value = {
        $case: "geoPointValue",
        geoPointValue: LatLng.fromPartial(object.value.geoPointValue),
      };
    }
    if (
      object.value?.$case === "arrayValue" &&
      object.value?.arrayValue !== undefined &&
      object.value?.arrayValue !== null
    ) {
      message.value = {
        $case: "arrayValue",
        arrayValue: ArrayValue.fromPartial(object.value.arrayValue),
      };
    }
    if (
      object.value?.$case === "mapValue" &&
      object.value?.mapValue !== undefined &&
      object.value?.mapValue !== null
    ) {
      message.value = {
        $case: "mapValue",
        mapValue: MapValue.fromPartial(object.value.mapValue),
      };
    }
    return message;
  },
};

const baseArrayValue: object = {};

export const ArrayValue = {
  encode(message: ArrayValue, writer: Writer = Writer.create()): Writer {
    for (const v of message.values) {
      Value.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): ArrayValue {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseArrayValue } as ArrayValue;
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

  fromJSON(object: any): ArrayValue {
    const message = { ...baseArrayValue } as ArrayValue;
    message.values = [];
    if (object.values !== undefined && object.values !== null) {
      for (const e of object.values) {
        message.values.push(Value.fromJSON(e));
      }
    }
    return message;
  },

  toJSON(message: ArrayValue): unknown {
    const obj: any = {};
    if (message.values) {
      obj.values = message.values.map((e) => (e ? Value.toJSON(e) : undefined));
    } else {
      obj.values = [];
    }
    return obj;
  },

  fromPartial(object: DeepPartial<ArrayValue>): ArrayValue {
    const message = { ...baseArrayValue } as ArrayValue;
    message.values = [];
    if (object.values !== undefined && object.values !== null) {
      for (const e of object.values) {
        message.values.push(Value.fromPartial(e));
      }
    }
    return message;
  },
};

const baseMapValue: object = {};

export const MapValue = {
  encode(message: MapValue, writer: Writer = Writer.create()): Writer {
    Object.entries(message.fields).forEach(([key, value]) => {
      MapValue_FieldsEntry.encode(
        { key: key as any, value },
        writer.uint32(10).fork()
      ).ldelim();
    });
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): MapValue {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseMapValue } as MapValue;
    message.fields = {};
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          const entry1 = MapValue_FieldsEntry.decode(reader, reader.uint32());
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

  fromJSON(object: any): MapValue {
    const message = { ...baseMapValue } as MapValue;
    message.fields = {};
    if (object.fields !== undefined && object.fields !== null) {
      Object.entries(object.fields).forEach(([key, value]) => {
        message.fields[key] = Value.fromJSON(value);
      });
    }
    return message;
  },

  toJSON(message: MapValue): unknown {
    const obj: any = {};
    obj.fields = {};
    if (message.fields) {
      Object.entries(message.fields).forEach(([k, v]) => {
        obj.fields[k] = Value.toJSON(v);
      });
    }
    return obj;
  },

  fromPartial(object: DeepPartial<MapValue>): MapValue {
    const message = { ...baseMapValue } as MapValue;
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

const baseMapValue_FieldsEntry: object = { key: "" };

export const MapValue_FieldsEntry = {
  encode(
    message: MapValue_FieldsEntry,
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

  decode(input: Reader | Uint8Array, length?: number): MapValue_FieldsEntry {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseMapValue_FieldsEntry } as MapValue_FieldsEntry;
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

  fromJSON(object: any): MapValue_FieldsEntry {
    const message = { ...baseMapValue_FieldsEntry } as MapValue_FieldsEntry;
    if (object.key !== undefined && object.key !== null) {
      message.key = String(object.key);
    }
    if (object.value !== undefined && object.value !== null) {
      message.value = Value.fromJSON(object.value);
    }
    return message;
  },

  toJSON(message: MapValue_FieldsEntry): unknown {
    const obj: any = {};
    message.key !== undefined && (obj.key = message.key);
    message.value !== undefined &&
      (obj.value = message.value ? Value.toJSON(message.value) : undefined);
    return obj;
  },

  fromPartial(object: DeepPartial<MapValue_FieldsEntry>): MapValue_FieldsEntry {
    const message = { ...baseMapValue_FieldsEntry } as MapValue_FieldsEntry;
    if (object.key !== undefined && object.key !== null) {
      message.key = object.key;
    }
    if (object.value !== undefined && object.value !== null) {
      message.value = Value.fromPartial(object.value);
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
