/* eslint-disable */
import { util, configure, Writer, Reader } from "protobufjs/minimal";
import * as Long from "long";
import { Any } from "../../google/protobuf/any";
import { ObjectReference } from "../../indykite/objects/v1beta1/id";
import { Timestamp } from "../../google/protobuf/timestamp";

export const protobufPackage = "id.indykite.jarvis.flow";

export interface FlowControlState {
  flowId: Buffer;
  /** currentFocus points to the active node in flow interacting with the UI. */
  currentFocus: string;
  startTime?: Date;
  lastActionTime?: Date;
}

export interface FlowState {
  /** Internal controlling state of the flow. */
  control?: FlowControlState;
  /**
   * google.protobuf.Any input = 2;
   * Input variables for the flow additional to request.
   */
  values: { [key: string]: Any };
}

export interface FlowState_ValuesEntry {
  key: string;
  value?: Any;
}

/** FlowDescription describes a workflow sequence. */
export interface FlowDescription {
  references: { [key: string]: ObjectReference };
  activities: { [key: string]: FlowActivityNodeConfig };
  sequences: FlowNodeSequence[];
}

export interface FlowDescription_ReferencesEntry {
  key: string;
  value?: ObjectReference;
}

export interface FlowDescription_ActivitiesEntry {
  key: string;
  value?: FlowActivityNodeConfig;
}

/** FlowActivityNodeConfig represents a node in FlowDescription. */
export interface FlowActivityNodeConfig {
  nodeType: string;
  displayName: string;
  nodeConfig?: Any;
}

/** FlowNodeSequence represents a sequence between two FlowActivityNodeConfig in FlowDescription. */
export interface FlowNodeSequence {
  sourceRef: string;
  targetRef: string;
  condition: string;
}

const baseFlowControlState: object = { currentFocus: "" };

export const FlowControlState = {
  encode(message: FlowControlState, writer: Writer = Writer.create()): Writer {
    if (message.flowId.length !== 0) {
      writer.uint32(10).bytes(message.flowId);
    }
    if (message.currentFocus !== "") {
      writer.uint32(18).string(message.currentFocus);
    }
    if (message.startTime !== undefined) {
      Timestamp.encode(
        toTimestamp(message.startTime),
        writer.uint32(26).fork()
      ).ldelim();
    }
    if (message.lastActionTime !== undefined) {
      Timestamp.encode(
        toTimestamp(message.lastActionTime),
        writer.uint32(34).fork()
      ).ldelim();
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): FlowControlState {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseFlowControlState } as FlowControlState;
    message.flowId = Buffer.alloc(0);
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.flowId = reader.bytes() as Buffer;
          break;
        case 2:
          message.currentFocus = reader.string();
          break;
        case 3:
          message.startTime = fromTimestamp(
            Timestamp.decode(reader, reader.uint32())
          );
          break;
        case 4:
          message.lastActionTime = fromTimestamp(
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

  fromJSON(object: any): FlowControlState {
    const message = { ...baseFlowControlState } as FlowControlState;
    message.flowId = Buffer.alloc(0);
    if (object.flowId !== undefined && object.flowId !== null) {
      message.flowId = Buffer.from(bytesFromBase64(object.flowId));
    }
    if (object.currentFocus !== undefined && object.currentFocus !== null) {
      message.currentFocus = String(object.currentFocus);
    }
    if (object.startTime !== undefined && object.startTime !== null) {
      message.startTime = fromJsonTimestamp(object.startTime);
    }
    if (object.lastActionTime !== undefined && object.lastActionTime !== null) {
      message.lastActionTime = fromJsonTimestamp(object.lastActionTime);
    }
    return message;
  },

  toJSON(message: FlowControlState): unknown {
    const obj: any = {};
    message.flowId !== undefined &&
      (obj.flowId = base64FromBytes(
        message.flowId !== undefined ? message.flowId : Buffer.alloc(0)
      ));
    message.currentFocus !== undefined &&
      (obj.currentFocus = message.currentFocus);
    message.startTime !== undefined &&
      (obj.startTime = message.startTime.toISOString());
    message.lastActionTime !== undefined &&
      (obj.lastActionTime = message.lastActionTime.toISOString());
    return obj;
  },

  fromPartial(object: DeepPartial<FlowControlState>): FlowControlState {
    const message = { ...baseFlowControlState } as FlowControlState;
    if (object.flowId !== undefined && object.flowId !== null) {
      message.flowId = object.flowId;
    }
    if (object.currentFocus !== undefined && object.currentFocus !== null) {
      message.currentFocus = object.currentFocus;
    }
    if (object.startTime !== undefined && object.startTime !== null) {
      message.startTime = object.startTime;
    }
    if (object.lastActionTime !== undefined && object.lastActionTime !== null) {
      message.lastActionTime = object.lastActionTime;
    }
    return message;
  },
};

const baseFlowState: object = {};

export const FlowState = {
  encode(message: FlowState, writer: Writer = Writer.create()): Writer {
    if (message.control !== undefined) {
      FlowControlState.encode(
        message.control,
        writer.uint32(10).fork()
      ).ldelim();
    }
    Object.entries(message.values).forEach(([key, value]) => {
      FlowState_ValuesEntry.encode(
        { key: key as any, value },
        writer.uint32(26).fork()
      ).ldelim();
    });
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): FlowState {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseFlowState } as FlowState;
    message.values = {};
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.control = FlowControlState.decode(reader, reader.uint32());
          break;
        case 3:
          const entry3 = FlowState_ValuesEntry.decode(reader, reader.uint32());
          if (entry3.value !== undefined) {
            message.values[entry3.key] = entry3.value;
          }
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): FlowState {
    const message = { ...baseFlowState } as FlowState;
    message.values = {};
    if (object.control !== undefined && object.control !== null) {
      message.control = FlowControlState.fromJSON(object.control);
    }
    if (object.values !== undefined && object.values !== null) {
      Object.entries(object.values).forEach(([key, value]) => {
        message.values[key] = Any.fromJSON(value);
      });
    }
    return message;
  },

  toJSON(message: FlowState): unknown {
    const obj: any = {};
    message.control !== undefined &&
      (obj.control = message.control
        ? FlowControlState.toJSON(message.control)
        : undefined);
    obj.values = {};
    if (message.values) {
      Object.entries(message.values).forEach(([k, v]) => {
        obj.values[k] = Any.toJSON(v);
      });
    }
    return obj;
  },

  fromPartial(object: DeepPartial<FlowState>): FlowState {
    const message = { ...baseFlowState } as FlowState;
    message.values = {};
    if (object.control !== undefined && object.control !== null) {
      message.control = FlowControlState.fromPartial(object.control);
    }
    if (object.values !== undefined && object.values !== null) {
      Object.entries(object.values).forEach(([key, value]) => {
        if (value !== undefined) {
          message.values[key] = Any.fromPartial(value);
        }
      });
    }
    return message;
  },
};

const baseFlowState_ValuesEntry: object = { key: "" };

export const FlowState_ValuesEntry = {
  encode(
    message: FlowState_ValuesEntry,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.key !== "") {
      writer.uint32(10).string(message.key);
    }
    if (message.value !== undefined) {
      Any.encode(message.value, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): FlowState_ValuesEntry {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseFlowState_ValuesEntry } as FlowState_ValuesEntry;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.key = reader.string();
          break;
        case 2:
          message.value = Any.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): FlowState_ValuesEntry {
    const message = { ...baseFlowState_ValuesEntry } as FlowState_ValuesEntry;
    if (object.key !== undefined && object.key !== null) {
      message.key = String(object.key);
    }
    if (object.value !== undefined && object.value !== null) {
      message.value = Any.fromJSON(object.value);
    }
    return message;
  },

  toJSON(message: FlowState_ValuesEntry): unknown {
    const obj: any = {};
    message.key !== undefined && (obj.key = message.key);
    message.value !== undefined &&
      (obj.value = message.value ? Any.toJSON(message.value) : undefined);
    return obj;
  },

  fromPartial(
    object: DeepPartial<FlowState_ValuesEntry>
  ): FlowState_ValuesEntry {
    const message = { ...baseFlowState_ValuesEntry } as FlowState_ValuesEntry;
    if (object.key !== undefined && object.key !== null) {
      message.key = object.key;
    }
    if (object.value !== undefined && object.value !== null) {
      message.value = Any.fromPartial(object.value);
    }
    return message;
  },
};

const baseFlowDescription: object = {};

export const FlowDescription = {
  encode(message: FlowDescription, writer: Writer = Writer.create()): Writer {
    Object.entries(message.references).forEach(([key, value]) => {
      FlowDescription_ReferencesEntry.encode(
        { key: key as any, value },
        writer.uint32(50).fork()
      ).ldelim();
    });
    Object.entries(message.activities).forEach(([key, value]) => {
      FlowDescription_ActivitiesEntry.encode(
        { key: key as any, value },
        writer.uint32(58).fork()
      ).ldelim();
    });
    for (const v of message.sequences) {
      FlowNodeSequence.encode(v!, writer.uint32(66).fork()).ldelim();
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): FlowDescription {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseFlowDescription } as FlowDescription;
    message.references = {};
    message.activities = {};
    message.sequences = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 6:
          const entry6 = FlowDescription_ReferencesEntry.decode(
            reader,
            reader.uint32()
          );
          if (entry6.value !== undefined) {
            message.references[entry6.key] = entry6.value;
          }
          break;
        case 7:
          const entry7 = FlowDescription_ActivitiesEntry.decode(
            reader,
            reader.uint32()
          );
          if (entry7.value !== undefined) {
            message.activities[entry7.key] = entry7.value;
          }
          break;
        case 8:
          message.sequences.push(
            FlowNodeSequence.decode(reader, reader.uint32())
          );
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): FlowDescription {
    const message = { ...baseFlowDescription } as FlowDescription;
    message.references = {};
    message.activities = {};
    message.sequences = [];
    if (object.references !== undefined && object.references !== null) {
      Object.entries(object.references).forEach(([key, value]) => {
        message.references[key] = ObjectReference.fromJSON(value);
      });
    }
    if (object.activities !== undefined && object.activities !== null) {
      Object.entries(object.activities).forEach(([key, value]) => {
        message.activities[key] = FlowActivityNodeConfig.fromJSON(value);
      });
    }
    if (object.sequences !== undefined && object.sequences !== null) {
      for (const e of object.sequences) {
        message.sequences.push(FlowNodeSequence.fromJSON(e));
      }
    }
    return message;
  },

  toJSON(message: FlowDescription): unknown {
    const obj: any = {};
    obj.references = {};
    if (message.references) {
      Object.entries(message.references).forEach(([k, v]) => {
        obj.references[k] = ObjectReference.toJSON(v);
      });
    }
    obj.activities = {};
    if (message.activities) {
      Object.entries(message.activities).forEach(([k, v]) => {
        obj.activities[k] = FlowActivityNodeConfig.toJSON(v);
      });
    }
    if (message.sequences) {
      obj.sequences = message.sequences.map((e) =>
        e ? FlowNodeSequence.toJSON(e) : undefined
      );
    } else {
      obj.sequences = [];
    }
    return obj;
  },

  fromPartial(object: DeepPartial<FlowDescription>): FlowDescription {
    const message = { ...baseFlowDescription } as FlowDescription;
    message.references = {};
    message.activities = {};
    message.sequences = [];
    if (object.references !== undefined && object.references !== null) {
      Object.entries(object.references).forEach(([key, value]) => {
        if (value !== undefined) {
          message.references[key] = ObjectReference.fromPartial(value);
        }
      });
    }
    if (object.activities !== undefined && object.activities !== null) {
      Object.entries(object.activities).forEach(([key, value]) => {
        if (value !== undefined) {
          message.activities[key] = FlowActivityNodeConfig.fromPartial(value);
        }
      });
    }
    if (object.sequences !== undefined && object.sequences !== null) {
      for (const e of object.sequences) {
        message.sequences.push(FlowNodeSequence.fromPartial(e));
      }
    }
    return message;
  },
};

const baseFlowDescription_ReferencesEntry: object = { key: "" };

export const FlowDescription_ReferencesEntry = {
  encode(
    message: FlowDescription_ReferencesEntry,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.key !== "") {
      writer.uint32(10).string(message.key);
    }
    if (message.value !== undefined) {
      ObjectReference.encode(message.value, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): FlowDescription_ReferencesEntry {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseFlowDescription_ReferencesEntry,
    } as FlowDescription_ReferencesEntry;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.key = reader.string();
          break;
        case 2:
          message.value = ObjectReference.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): FlowDescription_ReferencesEntry {
    const message = {
      ...baseFlowDescription_ReferencesEntry,
    } as FlowDescription_ReferencesEntry;
    if (object.key !== undefined && object.key !== null) {
      message.key = String(object.key);
    }
    if (object.value !== undefined && object.value !== null) {
      message.value = ObjectReference.fromJSON(object.value);
    }
    return message;
  },

  toJSON(message: FlowDescription_ReferencesEntry): unknown {
    const obj: any = {};
    message.key !== undefined && (obj.key = message.key);
    message.value !== undefined &&
      (obj.value = message.value
        ? ObjectReference.toJSON(message.value)
        : undefined);
    return obj;
  },

  fromPartial(
    object: DeepPartial<FlowDescription_ReferencesEntry>
  ): FlowDescription_ReferencesEntry {
    const message = {
      ...baseFlowDescription_ReferencesEntry,
    } as FlowDescription_ReferencesEntry;
    if (object.key !== undefined && object.key !== null) {
      message.key = object.key;
    }
    if (object.value !== undefined && object.value !== null) {
      message.value = ObjectReference.fromPartial(object.value);
    }
    return message;
  },
};

const baseFlowDescription_ActivitiesEntry: object = { key: "" };

export const FlowDescription_ActivitiesEntry = {
  encode(
    message: FlowDescription_ActivitiesEntry,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.key !== "") {
      writer.uint32(10).string(message.key);
    }
    if (message.value !== undefined) {
      FlowActivityNodeConfig.encode(
        message.value,
        writer.uint32(18).fork()
      ).ldelim();
    }
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): FlowDescription_ActivitiesEntry {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseFlowDescription_ActivitiesEntry,
    } as FlowDescription_ActivitiesEntry;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.key = reader.string();
          break;
        case 2:
          message.value = FlowActivityNodeConfig.decode(
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

  fromJSON(object: any): FlowDescription_ActivitiesEntry {
    const message = {
      ...baseFlowDescription_ActivitiesEntry,
    } as FlowDescription_ActivitiesEntry;
    if (object.key !== undefined && object.key !== null) {
      message.key = String(object.key);
    }
    if (object.value !== undefined && object.value !== null) {
      message.value = FlowActivityNodeConfig.fromJSON(object.value);
    }
    return message;
  },

  toJSON(message: FlowDescription_ActivitiesEntry): unknown {
    const obj: any = {};
    message.key !== undefined && (obj.key = message.key);
    message.value !== undefined &&
      (obj.value = message.value
        ? FlowActivityNodeConfig.toJSON(message.value)
        : undefined);
    return obj;
  },

  fromPartial(
    object: DeepPartial<FlowDescription_ActivitiesEntry>
  ): FlowDescription_ActivitiesEntry {
    const message = {
      ...baseFlowDescription_ActivitiesEntry,
    } as FlowDescription_ActivitiesEntry;
    if (object.key !== undefined && object.key !== null) {
      message.key = object.key;
    }
    if (object.value !== undefined && object.value !== null) {
      message.value = FlowActivityNodeConfig.fromPartial(object.value);
    }
    return message;
  },
};

const baseFlowActivityNodeConfig: object = { nodeType: "", displayName: "" };

export const FlowActivityNodeConfig = {
  encode(
    message: FlowActivityNodeConfig,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.nodeType !== "") {
      writer.uint32(18).string(message.nodeType);
    }
    if (message.displayName !== "") {
      writer.uint32(26).string(message.displayName);
    }
    if (message.nodeConfig !== undefined) {
      Any.encode(message.nodeConfig, writer.uint32(42).fork()).ldelim();
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): FlowActivityNodeConfig {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseFlowActivityNodeConfig } as FlowActivityNodeConfig;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 2:
          message.nodeType = reader.string();
          break;
        case 3:
          message.displayName = reader.string();
          break;
        case 5:
          message.nodeConfig = Any.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): FlowActivityNodeConfig {
    const message = { ...baseFlowActivityNodeConfig } as FlowActivityNodeConfig;
    if (object.nodeType !== undefined && object.nodeType !== null) {
      message.nodeType = String(object.nodeType);
    }
    if (object.displayName !== undefined && object.displayName !== null) {
      message.displayName = String(object.displayName);
    }
    if (object.nodeConfig !== undefined && object.nodeConfig !== null) {
      message.nodeConfig = Any.fromJSON(object.nodeConfig);
    }
    return message;
  },

  toJSON(message: FlowActivityNodeConfig): unknown {
    const obj: any = {};
    message.nodeType !== undefined && (obj.nodeType = message.nodeType);
    message.displayName !== undefined &&
      (obj.displayName = message.displayName);
    message.nodeConfig !== undefined &&
      (obj.nodeConfig = message.nodeConfig
        ? Any.toJSON(message.nodeConfig)
        : undefined);
    return obj;
  },

  fromPartial(
    object: DeepPartial<FlowActivityNodeConfig>
  ): FlowActivityNodeConfig {
    const message = { ...baseFlowActivityNodeConfig } as FlowActivityNodeConfig;
    if (object.nodeType !== undefined && object.nodeType !== null) {
      message.nodeType = object.nodeType;
    }
    if (object.displayName !== undefined && object.displayName !== null) {
      message.displayName = object.displayName;
    }
    if (object.nodeConfig !== undefined && object.nodeConfig !== null) {
      message.nodeConfig = Any.fromPartial(object.nodeConfig);
    }
    return message;
  },
};

const baseFlowNodeSequence: object = {
  sourceRef: "",
  targetRef: "",
  condition: "",
};

export const FlowNodeSequence = {
  encode(message: FlowNodeSequence, writer: Writer = Writer.create()): Writer {
    if (message.sourceRef !== "") {
      writer.uint32(10).string(message.sourceRef);
    }
    if (message.targetRef !== "") {
      writer.uint32(18).string(message.targetRef);
    }
    if (message.condition !== "") {
      writer.uint32(26).string(message.condition);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): FlowNodeSequence {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseFlowNodeSequence } as FlowNodeSequence;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.sourceRef = reader.string();
          break;
        case 2:
          message.targetRef = reader.string();
          break;
        case 3:
          message.condition = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): FlowNodeSequence {
    const message = { ...baseFlowNodeSequence } as FlowNodeSequence;
    if (object.sourceRef !== undefined && object.sourceRef !== null) {
      message.sourceRef = String(object.sourceRef);
    }
    if (object.targetRef !== undefined && object.targetRef !== null) {
      message.targetRef = String(object.targetRef);
    }
    if (object.condition !== undefined && object.condition !== null) {
      message.condition = String(object.condition);
    }
    return message;
  },

  toJSON(message: FlowNodeSequence): unknown {
    const obj: any = {};
    message.sourceRef !== undefined && (obj.sourceRef = message.sourceRef);
    message.targetRef !== undefined && (obj.targetRef = message.targetRef);
    message.condition !== undefined && (obj.condition = message.condition);
    return obj;
  },

  fromPartial(object: DeepPartial<FlowNodeSequence>): FlowNodeSequence {
    const message = { ...baseFlowNodeSequence } as FlowNodeSequence;
    if (object.sourceRef !== undefined && object.sourceRef !== null) {
      message.sourceRef = object.sourceRef;
    }
    if (object.targetRef !== undefined && object.targetRef !== null) {
      message.targetRef = object.targetRef;
    }
    if (object.condition !== undefined && object.condition !== null) {
      message.condition = object.condition;
    }
    return message;
  },
};

declare var self: any | undefined;
declare var window: any | undefined;
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
