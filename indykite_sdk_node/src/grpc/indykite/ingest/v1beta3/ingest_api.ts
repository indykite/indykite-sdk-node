// @generated by protobuf-ts 2.9.0 with parameter long_type_string,client_grpc1,generate_dependencies
// @generated from protobuf file "indykite/ingest/v1beta3/ingest_api.proto" (package "indykite.ingest.v1beta3", syntax proto3)
// tslint:disable
//
// Copyright (c) 2023 IndyKite
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
import { ServiceType } from "@protobuf-ts/runtime-rpc";
import type { BinaryWriteOptions } from "@protobuf-ts/runtime";
import type { IBinaryWriter } from "@protobuf-ts/runtime";
import { WireType } from "@protobuf-ts/runtime";
import type { BinaryReadOptions } from "@protobuf-ts/runtime";
import type { IBinaryReader } from "@protobuf-ts/runtime";
import { UnknownFieldHandler } from "@protobuf-ts/runtime";
import type { PartialMessage } from "@protobuf-ts/runtime";
import { reflectionMergePartial } from "@protobuf-ts/runtime";
import { MESSAGE_TYPE } from "@protobuf-ts/runtime";
import { MessageType } from "@protobuf-ts/runtime";
import { Info } from "./model";
import { Status } from "../../../google/rpc/status";
import { RecordError } from "./model";
import { Record } from "./model";
/**
 * @generated from protobuf message indykite.ingest.v1beta3.StreamRecordsRequest
 */
export interface StreamRecordsRequest {
    /**
     * @generated from protobuf field: indykite.ingest.v1beta3.Record record = 1;
     */
    record?: Record;
}
/**
 * @generated from protobuf message indykite.ingest.v1beta3.StreamRecordsResponse
 */
export interface StreamRecordsResponse {
    /**
     * @generated from protobuf field: string record_id = 1;
     */
    recordId: string;
    /**
     * @generated from protobuf field: uint32 record_index = 2;
     */
    recordIndex: number;
    /**
     * @generated from protobuf oneof: error
     */
    error: {
        oneofKind: "recordError";
        /**
         * @generated from protobuf field: indykite.ingest.v1beta3.RecordError record_error = 3;
         */
        recordError: RecordError;
    } | {
        oneofKind: "statusError";
        /**
         * @generated from protobuf field: google.rpc.Status status_error = 4;
         */
        statusError: Status;
    } | {
        oneofKind: undefined;
    };
    /**
     * @generated from protobuf field: indykite.ingest.v1beta3.Info info = 5;
     */
    info?: Info;
}
/**
 * @generated from protobuf message indykite.ingest.v1beta3.IngestRecordRequest
 */
export interface IngestRecordRequest {
    /**
     * @generated from protobuf field: indykite.ingest.v1beta3.Record record = 1;
     */
    record?: Record;
}
/**
 * @generated from protobuf message indykite.ingest.v1beta3.IngestRecordResponse
 */
export interface IngestRecordResponse {
    /**
     * @generated from protobuf field: string record_id = 1;
     */
    recordId: string;
    /**
     * @generated from protobuf field: indykite.ingest.v1beta3.Info info = 5;
     */
    info?: Info;
}
// @generated message type with reflection information, may provide speed optimized methods
class StreamRecordsRequest$Type extends MessageType<StreamRecordsRequest> {
    constructor() {
        super("indykite.ingest.v1beta3.StreamRecordsRequest", [
            { no: 1, name: "record", kind: "message", T: () => Record, options: { "validate.rules": { message: { required: true } } } }
        ]);
    }
    create(value?: PartialMessage<StreamRecordsRequest>): StreamRecordsRequest {
        const message = {};
        globalThis.Object.defineProperty(message, MESSAGE_TYPE, { enumerable: false, value: this });
        if (value !== undefined)
            reflectionMergePartial<StreamRecordsRequest>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: StreamRecordsRequest): StreamRecordsRequest {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* indykite.ingest.v1beta3.Record record */ 1:
                    message.record = Record.internalBinaryRead(reader, reader.uint32(), options, message.record);
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message: StreamRecordsRequest, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* indykite.ingest.v1beta3.Record record = 1; */
        if (message.record)
            Record.internalBinaryWrite(message.record, writer.tag(1, WireType.LengthDelimited).fork(), options).join();
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message indykite.ingest.v1beta3.StreamRecordsRequest
 */
export const StreamRecordsRequest = new StreamRecordsRequest$Type();
// @generated message type with reflection information, may provide speed optimized methods
class StreamRecordsResponse$Type extends MessageType<StreamRecordsResponse> {
    constructor() {
        super("indykite.ingest.v1beta3.StreamRecordsResponse", [
            { no: 1, name: "record_id", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 2, name: "record_index", kind: "scalar", T: 13 /*ScalarType.UINT32*/ },
            { no: 3, name: "record_error", kind: "message", oneof: "error", T: () => RecordError },
            { no: 4, name: "status_error", kind: "message", oneof: "error", T: () => Status },
            { no: 5, name: "info", kind: "message", T: () => Info }
        ]);
    }
    create(value?: PartialMessage<StreamRecordsResponse>): StreamRecordsResponse {
        const message = { recordId: "", recordIndex: 0, error: { oneofKind: undefined } };
        globalThis.Object.defineProperty(message, MESSAGE_TYPE, { enumerable: false, value: this });
        if (value !== undefined)
            reflectionMergePartial<StreamRecordsResponse>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: StreamRecordsResponse): StreamRecordsResponse {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* string record_id */ 1:
                    message.recordId = reader.string();
                    break;
                case /* uint32 record_index */ 2:
                    message.recordIndex = reader.uint32();
                    break;
                case /* indykite.ingest.v1beta3.RecordError record_error */ 3:
                    message.error = {
                        oneofKind: "recordError",
                        recordError: RecordError.internalBinaryRead(reader, reader.uint32(), options, (message.error as any).recordError)
                    };
                    break;
                case /* google.rpc.Status status_error */ 4:
                    message.error = {
                        oneofKind: "statusError",
                        statusError: Status.internalBinaryRead(reader, reader.uint32(), options, (message.error as any).statusError)
                    };
                    break;
                case /* indykite.ingest.v1beta3.Info info */ 5:
                    message.info = Info.internalBinaryRead(reader, reader.uint32(), options, message.info);
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message: StreamRecordsResponse, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* string record_id = 1; */
        if (message.recordId !== "")
            writer.tag(1, WireType.LengthDelimited).string(message.recordId);
        /* uint32 record_index = 2; */
        if (message.recordIndex !== 0)
            writer.tag(2, WireType.Varint).uint32(message.recordIndex);
        /* indykite.ingest.v1beta3.RecordError record_error = 3; */
        if (message.error.oneofKind === "recordError")
            RecordError.internalBinaryWrite(message.error.recordError, writer.tag(3, WireType.LengthDelimited).fork(), options).join();
        /* google.rpc.Status status_error = 4; */
        if (message.error.oneofKind === "statusError")
            Status.internalBinaryWrite(message.error.statusError, writer.tag(4, WireType.LengthDelimited).fork(), options).join();
        /* indykite.ingest.v1beta3.Info info = 5; */
        if (message.info)
            Info.internalBinaryWrite(message.info, writer.tag(5, WireType.LengthDelimited).fork(), options).join();
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message indykite.ingest.v1beta3.StreamRecordsResponse
 */
export const StreamRecordsResponse = new StreamRecordsResponse$Type();
// @generated message type with reflection information, may provide speed optimized methods
class IngestRecordRequest$Type extends MessageType<IngestRecordRequest> {
    constructor() {
        super("indykite.ingest.v1beta3.IngestRecordRequest", [
            { no: 1, name: "record", kind: "message", T: () => Record, options: { "validate.rules": { message: { required: true } } } }
        ]);
    }
    create(value?: PartialMessage<IngestRecordRequest>): IngestRecordRequest {
        const message = {};
        globalThis.Object.defineProperty(message, MESSAGE_TYPE, { enumerable: false, value: this });
        if (value !== undefined)
            reflectionMergePartial<IngestRecordRequest>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: IngestRecordRequest): IngestRecordRequest {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* indykite.ingest.v1beta3.Record record */ 1:
                    message.record = Record.internalBinaryRead(reader, reader.uint32(), options, message.record);
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message: IngestRecordRequest, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* indykite.ingest.v1beta3.Record record = 1; */
        if (message.record)
            Record.internalBinaryWrite(message.record, writer.tag(1, WireType.LengthDelimited).fork(), options).join();
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message indykite.ingest.v1beta3.IngestRecordRequest
 */
export const IngestRecordRequest = new IngestRecordRequest$Type();
// @generated message type with reflection information, may provide speed optimized methods
class IngestRecordResponse$Type extends MessageType<IngestRecordResponse> {
    constructor() {
        super("indykite.ingest.v1beta3.IngestRecordResponse", [
            { no: 1, name: "record_id", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 5, name: "info", kind: "message", T: () => Info }
        ]);
    }
    create(value?: PartialMessage<IngestRecordResponse>): IngestRecordResponse {
        const message = { recordId: "" };
        globalThis.Object.defineProperty(message, MESSAGE_TYPE, { enumerable: false, value: this });
        if (value !== undefined)
            reflectionMergePartial<IngestRecordResponse>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: IngestRecordResponse): IngestRecordResponse {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* string record_id */ 1:
                    message.recordId = reader.string();
                    break;
                case /* indykite.ingest.v1beta3.Info info */ 5:
                    message.info = Info.internalBinaryRead(reader, reader.uint32(), options, message.info);
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message: IngestRecordResponse, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* string record_id = 1; */
        if (message.recordId !== "")
            writer.tag(1, WireType.LengthDelimited).string(message.recordId);
        /* indykite.ingest.v1beta3.Info info = 5; */
        if (message.info)
            Info.internalBinaryWrite(message.info, writer.tag(5, WireType.LengthDelimited).fork(), options).join();
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message indykite.ingest.v1beta3.IngestRecordResponse
 */
export const IngestRecordResponse = new IngestRecordResponse$Type();
/**
 * @generated ServiceType for protobuf service indykite.ingest.v1beta3.IngestAPI
 */
export const IngestAPI = new ServiceType("indykite.ingest.v1beta3.IngestAPI", [
    { name: "StreamRecords", serverStreaming: true, clientStreaming: true, options: {}, I: StreamRecordsRequest, O: StreamRecordsResponse },
    { name: "IngestRecord", options: {}, I: IngestRecordRequest, O: IngestRecordResponse }
]);
