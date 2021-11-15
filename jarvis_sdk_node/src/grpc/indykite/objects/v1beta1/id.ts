/* eslint-disable */
import { util, configure, Writer, Reader } from "protobufjs/minimal";
import * as Long from "long";

export const protobufPackage = "indykite.objects.v1beta1";

/** Identifier is a universally unique identifier (UUID) a 128-bit number used to identify information in system. */
export interface Identifier {
  id?:
    | { $case: "idString"; idString: string }
    | { $case: "idBytes"; idBytes: Buffer };
}

/** ObjectReference ... */
export interface ObjectReference {
  /** UUID of the top level Customer. */
  customerId?: Identifier;
  /** UUID of Application Space in Customer. */
  appSpaceId?: Identifier;
  /** UUID of Application in Application Space. */
  appId?: Identifier;
  /** UUID of Tenant in Application Space. */
  tenantId?: Identifier;
  /** Gives a hint about what the identifier refers to. Usually a URL to the schema of the target object. */
  typeHint: string;
  /** UUID of Object to refer to. */
  id?: Identifier;
}

const baseIdentifier: object = {};

export const Identifier = {
  encode(message: Identifier, writer: Writer = Writer.create()): Writer {
    if (message.id?.$case === "idString") {
      writer.uint32(58).string(message.id.idString);
    }
    if (message.id?.$case === "idBytes") {
      writer.uint32(66).bytes(message.id.idBytes);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): Identifier {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseIdentifier } as Identifier;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 7:
          message.id = { $case: "idString", idString: reader.string() };
          break;
        case 8:
          message.id = { $case: "idBytes", idBytes: reader.bytes() as Buffer };
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Identifier {
    const message = { ...baseIdentifier } as Identifier;
    if (object.idString !== undefined && object.idString !== null) {
      message.id = { $case: "idString", idString: String(object.idString) };
    }
    if (object.idBytes !== undefined && object.idBytes !== null) {
      message.id = {
        $case: "idBytes",
        idBytes: Buffer.from(bytesFromBase64(object.idBytes)),
      };
    }
    return message;
  },

  toJSON(message: Identifier): unknown {
    const obj: any = {};
    message.id?.$case === "idString" && (obj.idString = message.id?.idString);
    message.id?.$case === "idBytes" &&
      (obj.idBytes =
        message.id?.idBytes !== undefined
          ? base64FromBytes(message.id?.idBytes)
          : undefined);
    return obj;
  },

  fromPartial(object: DeepPartial<Identifier>): Identifier {
    const message = { ...baseIdentifier } as Identifier;
    if (
      object.id?.$case === "idString" &&
      object.id?.idString !== undefined &&
      object.id?.idString !== null
    ) {
      message.id = { $case: "idString", idString: object.id.idString };
    }
    if (
      object.id?.$case === "idBytes" &&
      object.id?.idBytes !== undefined &&
      object.id?.idBytes !== null
    ) {
      message.id = { $case: "idBytes", idBytes: object.id.idBytes };
    }
    return message;
  },
};

const baseObjectReference: object = { typeHint: "" };

export const ObjectReference = {
  encode(message: ObjectReference, writer: Writer = Writer.create()): Writer {
    if (message.customerId !== undefined) {
      Identifier.encode(message.customerId, writer.uint32(10).fork()).ldelim();
    }
    if (message.appSpaceId !== undefined) {
      Identifier.encode(message.appSpaceId, writer.uint32(18).fork()).ldelim();
    }
    if (message.appId !== undefined) {
      Identifier.encode(message.appId, writer.uint32(26).fork()).ldelim();
    }
    if (message.tenantId !== undefined) {
      Identifier.encode(message.tenantId, writer.uint32(34).fork()).ldelim();
    }
    if (message.typeHint !== "") {
      writer.uint32(50).string(message.typeHint);
    }
    if (message.id !== undefined) {
      Identifier.encode(message.id, writer.uint32(58).fork()).ldelim();
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): ObjectReference {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseObjectReference } as ObjectReference;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.customerId = Identifier.decode(reader, reader.uint32());
          break;
        case 2:
          message.appSpaceId = Identifier.decode(reader, reader.uint32());
          break;
        case 3:
          message.appId = Identifier.decode(reader, reader.uint32());
          break;
        case 4:
          message.tenantId = Identifier.decode(reader, reader.uint32());
          break;
        case 6:
          message.typeHint = reader.string();
          break;
        case 7:
          message.id = Identifier.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ObjectReference {
    const message = { ...baseObjectReference } as ObjectReference;
    if (object.customerId !== undefined && object.customerId !== null) {
      message.customerId = Identifier.fromJSON(object.customerId);
    }
    if (object.appSpaceId !== undefined && object.appSpaceId !== null) {
      message.appSpaceId = Identifier.fromJSON(object.appSpaceId);
    }
    if (object.appId !== undefined && object.appId !== null) {
      message.appId = Identifier.fromJSON(object.appId);
    }
    if (object.tenantId !== undefined && object.tenantId !== null) {
      message.tenantId = Identifier.fromJSON(object.tenantId);
    }
    if (object.typeHint !== undefined && object.typeHint !== null) {
      message.typeHint = String(object.typeHint);
    }
    if (object.id !== undefined && object.id !== null) {
      message.id = Identifier.fromJSON(object.id);
    }
    return message;
  },

  toJSON(message: ObjectReference): unknown {
    const obj: any = {};
    message.customerId !== undefined &&
      (obj.customerId = message.customerId
        ? Identifier.toJSON(message.customerId)
        : undefined);
    message.appSpaceId !== undefined &&
      (obj.appSpaceId = message.appSpaceId
        ? Identifier.toJSON(message.appSpaceId)
        : undefined);
    message.appId !== undefined &&
      (obj.appId = message.appId
        ? Identifier.toJSON(message.appId)
        : undefined);
    message.tenantId !== undefined &&
      (obj.tenantId = message.tenantId
        ? Identifier.toJSON(message.tenantId)
        : undefined);
    message.typeHint !== undefined && (obj.typeHint = message.typeHint);
    message.id !== undefined &&
      (obj.id = message.id ? Identifier.toJSON(message.id) : undefined);
    return obj;
  },

  fromPartial(object: DeepPartial<ObjectReference>): ObjectReference {
    const message = { ...baseObjectReference } as ObjectReference;
    if (object.customerId !== undefined && object.customerId !== null) {
      message.customerId = Identifier.fromPartial(object.customerId);
    }
    if (object.appSpaceId !== undefined && object.appSpaceId !== null) {
      message.appSpaceId = Identifier.fromPartial(object.appSpaceId);
    }
    if (object.appId !== undefined && object.appId !== null) {
      message.appId = Identifier.fromPartial(object.appId);
    }
    if (object.tenantId !== undefined && object.tenantId !== null) {
      message.tenantId = Identifier.fromPartial(object.tenantId);
    }
    if (object.typeHint !== undefined && object.typeHint !== null) {
      message.typeHint = object.typeHint;
    }
    if (object.id !== undefined && object.id !== null) {
      message.id = Identifier.fromPartial(object.id);
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

// If you get a compile-error about 'Constructor<Long> and ... have no overlap',
// add '--ts_proto_opt=esModuleInterop=true' as a flag when calling 'protoc'.
if (util.Long !== Long) {
  util.Long = Long as any;
  configure();
}
