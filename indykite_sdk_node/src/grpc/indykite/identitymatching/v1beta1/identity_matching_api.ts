// @generated by protobuf-ts 2.9.0 with parameter long_type_string,client_grpc1,generate_dependencies
// @generated from protobuf file "indykite/identitymatching/v1beta1/identity_matching_api.proto" (package "indykite.identitymatching.v1beta1", syntax proto3)
// tslint:disable
//
// Copyright (c) 2024 IndyKite
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
import { PipelineStatus } from "./model";
import { Timestamp } from "../../../google/protobuf/timestamp";
import { PropertyMapping } from "./model";
/**
 * @generated from protobuf message indykite.identitymatching.v1beta1.RunIdentityMatchingPipelineRequest
 */
export interface RunIdentityMatchingPipelineRequest {
    /**
     * Id is the Globally unique identifier of the pipeline to run.
     *
     * @generated from protobuf field: string id = 1;
     */
    id: string;
    /**
     * CustomPropertyMappings contains the rules to match nodes properties.
     * If empty, the default rules will be used (stored as part of the pipeline configuration).
     *
     * @generated from protobuf field: repeated indykite.identitymatching.v1beta1.PropertyMapping custom_property_mappings = 2;
     */
    customPropertyMappings: PropertyMapping[];
}
/**
 * @generated from protobuf message indykite.identitymatching.v1beta1.RunIdentityMatchingPipelineResponse
 */
export interface RunIdentityMatchingPipelineResponse {
    /**
     * Id is the Globally unique identifier of the pipeline that was started.
     *
     * @generated from protobuf field: string id = 1;
     */
    id: string;
    /**
     * Output only. The time at which the pipeline was last run.
     *
     * @generated from protobuf field: google.protobuf.Timestamp last_run_time = 2;
     */
    lastRunTime?: Timestamp;
    /**
     * Output only. Multiversion concurrency control version.
     *
     * @generated from protobuf field: string etag = 3;
     */
    etag: string;
}
/**
 * @generated from protobuf message indykite.identitymatching.v1beta1.ReadSuggestedPropertyMappingRequest
 */
export interface ReadSuggestedPropertyMappingRequest {
    /**
     * Id contains the Globally Unique Identifier of the object with server generated id.
     *
     * @generated from protobuf field: string id = 1;
     */
    id: string;
}
/**
 * @generated from protobuf message indykite.identitymatching.v1beta1.ReadSuggestedPropertyMappingResponse
 */
export interface ReadSuggestedPropertyMappingResponse {
    /**
     * Globally unique identifier.
     *
     * @generated from protobuf field: string id = 1;
     */
    id: string;
    /**
     * PropertyMappings contains the rules the pipeline will use to match source nodes with target nodes.
     *
     * @generated from protobuf field: repeated indykite.identitymatching.v1beta1.PropertyMapping property_mappings = 2;
     */
    propertyMappings: PropertyMapping[];
    /**
     * PropertyMappingStatus is the status assigned to the pipeline's step that maps node types' properties.
     * If the status is not SUCCESS, the PropertyMappings might be empty.
     *
     * @generated from protobuf field: indykite.identitymatching.v1beta1.PipelineStatus property_mapping_status = 3;
     */
    propertyMappingStatus: PipelineStatus;
}
/**
 * @generated from protobuf message indykite.identitymatching.v1beta1.ReadEntityMatchingReportRequest
 */
export interface ReadEntityMatchingReportRequest {
    /**
     * Id contains the Globally Unique Identifier of the object with server generated id.
     *
     * @generated from protobuf field: string id = 1;
     */
    id: string;
}
/**
 * @generated from protobuf message indykite.identitymatching.v1beta1.ReadEntityMatchingReportResponse
 */
export interface ReadEntityMatchingReportResponse {
    /**
     * Globally unique identifier.
     *
     * @generated from protobuf field: string id = 1;
     */
    id: string;
    /**
     * ReportURL contains a pre-signed URL to the report document.
     *
     * @generated from protobuf field: string report_url = 2;
     */
    reportUrl: string;
    /**
     * URLExpireTime defines when the report will no longer be accessible at the given ReportURL.
     *
     * @generated from protobuf field: google.protobuf.Timestamp url_expire_time = 3;
     */
    urlExpireTime?: Timestamp;
    /**
     * EntityMappingStatus is the status assigned to the pipeline's step that matches node identities.
     * If the status is not SUCCESS, the report_url might be empty.
     *
     * @generated from protobuf field: indykite.identitymatching.v1beta1.PipelineStatus entity_matching_status = 4;
     */
    entityMatchingStatus: PipelineStatus;
}
// @generated message type with reflection information, may provide speed optimized methods
class RunIdentityMatchingPipelineRequest$Type extends MessageType<RunIdentityMatchingPipelineRequest> {
    constructor() {
        super("indykite.identitymatching.v1beta1.RunIdentityMatchingPipelineRequest", [
            { no: 1, name: "id", kind: "scalar", T: 9 /*ScalarType.STRING*/, options: { "validate.rules": { string: { minLen: "22", maxLen: "254", pattern: "^[A-Za-z0-9-_:]{22,254}$" } } } },
            { no: 2, name: "custom_property_mappings", kind: "message", repeat: 1 /*RepeatType.PACKED*/, T: () => PropertyMapping }
        ]);
    }
    create(value?: PartialMessage<RunIdentityMatchingPipelineRequest>): RunIdentityMatchingPipelineRequest {
        const message = { id: "", customPropertyMappings: [] };
        globalThis.Object.defineProperty(message, MESSAGE_TYPE, { enumerable: false, value: this });
        if (value !== undefined)
            reflectionMergePartial<RunIdentityMatchingPipelineRequest>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: RunIdentityMatchingPipelineRequest): RunIdentityMatchingPipelineRequest {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* string id */ 1:
                    message.id = reader.string();
                    break;
                case /* repeated indykite.identitymatching.v1beta1.PropertyMapping custom_property_mappings */ 2:
                    message.customPropertyMappings.push(PropertyMapping.internalBinaryRead(reader, reader.uint32(), options));
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
    internalBinaryWrite(message: RunIdentityMatchingPipelineRequest, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* string id = 1; */
        if (message.id !== "")
            writer.tag(1, WireType.LengthDelimited).string(message.id);
        /* repeated indykite.identitymatching.v1beta1.PropertyMapping custom_property_mappings = 2; */
        for (let i = 0; i < message.customPropertyMappings.length; i++)
            PropertyMapping.internalBinaryWrite(message.customPropertyMappings[i], writer.tag(2, WireType.LengthDelimited).fork(), options).join();
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message indykite.identitymatching.v1beta1.RunIdentityMatchingPipelineRequest
 */
export const RunIdentityMatchingPipelineRequest = new RunIdentityMatchingPipelineRequest$Type();
// @generated message type with reflection information, may provide speed optimized methods
class RunIdentityMatchingPipelineResponse$Type extends MessageType<RunIdentityMatchingPipelineResponse> {
    constructor() {
        super("indykite.identitymatching.v1beta1.RunIdentityMatchingPipelineResponse", [
            { no: 1, name: "id", kind: "scalar", T: 9 /*ScalarType.STRING*/, options: { "validate.rules": { string: { minLen: "22", maxLen: "254", pattern: "^[A-Za-z0-9-_:]{22,254}$" } } } },
            { no: 2, name: "last_run_time", kind: "message", T: () => Timestamp },
            { no: 3, name: "etag", kind: "scalar", T: 9 /*ScalarType.STRING*/ }
        ]);
    }
    create(value?: PartialMessage<RunIdentityMatchingPipelineResponse>): RunIdentityMatchingPipelineResponse {
        const message = { id: "", etag: "" };
        globalThis.Object.defineProperty(message, MESSAGE_TYPE, { enumerable: false, value: this });
        if (value !== undefined)
            reflectionMergePartial<RunIdentityMatchingPipelineResponse>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: RunIdentityMatchingPipelineResponse): RunIdentityMatchingPipelineResponse {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* string id */ 1:
                    message.id = reader.string();
                    break;
                case /* google.protobuf.Timestamp last_run_time */ 2:
                    message.lastRunTime = Timestamp.internalBinaryRead(reader, reader.uint32(), options, message.lastRunTime);
                    break;
                case /* string etag */ 3:
                    message.etag = reader.string();
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
    internalBinaryWrite(message: RunIdentityMatchingPipelineResponse, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* string id = 1; */
        if (message.id !== "")
            writer.tag(1, WireType.LengthDelimited).string(message.id);
        /* google.protobuf.Timestamp last_run_time = 2; */
        if (message.lastRunTime)
            Timestamp.internalBinaryWrite(message.lastRunTime, writer.tag(2, WireType.LengthDelimited).fork(), options).join();
        /* string etag = 3; */
        if (message.etag !== "")
            writer.tag(3, WireType.LengthDelimited).string(message.etag);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message indykite.identitymatching.v1beta1.RunIdentityMatchingPipelineResponse
 */
export const RunIdentityMatchingPipelineResponse = new RunIdentityMatchingPipelineResponse$Type();
// @generated message type with reflection information, may provide speed optimized methods
class ReadSuggestedPropertyMappingRequest$Type extends MessageType<ReadSuggestedPropertyMappingRequest> {
    constructor() {
        super("indykite.identitymatching.v1beta1.ReadSuggestedPropertyMappingRequest", [
            { no: 1, name: "id", kind: "scalar", T: 9 /*ScalarType.STRING*/, options: { "validate.rules": { string: { minLen: "22", maxLen: "254", pattern: "^[A-Za-z0-9-_:]{22,254}$" } } } }
        ]);
    }
    create(value?: PartialMessage<ReadSuggestedPropertyMappingRequest>): ReadSuggestedPropertyMappingRequest {
        const message = { id: "" };
        globalThis.Object.defineProperty(message, MESSAGE_TYPE, { enumerable: false, value: this });
        if (value !== undefined)
            reflectionMergePartial<ReadSuggestedPropertyMappingRequest>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: ReadSuggestedPropertyMappingRequest): ReadSuggestedPropertyMappingRequest {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* string id */ 1:
                    message.id = reader.string();
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
    internalBinaryWrite(message: ReadSuggestedPropertyMappingRequest, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* string id = 1; */
        if (message.id !== "")
            writer.tag(1, WireType.LengthDelimited).string(message.id);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message indykite.identitymatching.v1beta1.ReadSuggestedPropertyMappingRequest
 */
export const ReadSuggestedPropertyMappingRequest = new ReadSuggestedPropertyMappingRequest$Type();
// @generated message type with reflection information, may provide speed optimized methods
class ReadSuggestedPropertyMappingResponse$Type extends MessageType<ReadSuggestedPropertyMappingResponse> {
    constructor() {
        super("indykite.identitymatching.v1beta1.ReadSuggestedPropertyMappingResponse", [
            { no: 1, name: "id", kind: "scalar", T: 9 /*ScalarType.STRING*/, options: { "validate.rules": { string: { minLen: "22", maxLen: "254", pattern: "^[A-Za-z0-9-_:]{22,254}$" } } } },
            { no: 2, name: "property_mappings", kind: "message", repeat: 1 /*RepeatType.PACKED*/, T: () => PropertyMapping },
            { no: 3, name: "property_mapping_status", kind: "enum", T: () => ["indykite.identitymatching.v1beta1.PipelineStatus", PipelineStatus, "PIPELINE_STATUS_"], options: { "validate.rules": { enum: { definedOnly: true, notIn: [0] } } } }
        ]);
    }
    create(value?: PartialMessage<ReadSuggestedPropertyMappingResponse>): ReadSuggestedPropertyMappingResponse {
        const message = { id: "", propertyMappings: [], propertyMappingStatus: 0 };
        globalThis.Object.defineProperty(message, MESSAGE_TYPE, { enumerable: false, value: this });
        if (value !== undefined)
            reflectionMergePartial<ReadSuggestedPropertyMappingResponse>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: ReadSuggestedPropertyMappingResponse): ReadSuggestedPropertyMappingResponse {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* string id */ 1:
                    message.id = reader.string();
                    break;
                case /* repeated indykite.identitymatching.v1beta1.PropertyMapping property_mappings */ 2:
                    message.propertyMappings.push(PropertyMapping.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case /* indykite.identitymatching.v1beta1.PipelineStatus property_mapping_status */ 3:
                    message.propertyMappingStatus = reader.int32();
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
    internalBinaryWrite(message: ReadSuggestedPropertyMappingResponse, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* string id = 1; */
        if (message.id !== "")
            writer.tag(1, WireType.LengthDelimited).string(message.id);
        /* repeated indykite.identitymatching.v1beta1.PropertyMapping property_mappings = 2; */
        for (let i = 0; i < message.propertyMappings.length; i++)
            PropertyMapping.internalBinaryWrite(message.propertyMappings[i], writer.tag(2, WireType.LengthDelimited).fork(), options).join();
        /* indykite.identitymatching.v1beta1.PipelineStatus property_mapping_status = 3; */
        if (message.propertyMappingStatus !== 0)
            writer.tag(3, WireType.Varint).int32(message.propertyMappingStatus);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message indykite.identitymatching.v1beta1.ReadSuggestedPropertyMappingResponse
 */
export const ReadSuggestedPropertyMappingResponse = new ReadSuggestedPropertyMappingResponse$Type();
// @generated message type with reflection information, may provide speed optimized methods
class ReadEntityMatchingReportRequest$Type extends MessageType<ReadEntityMatchingReportRequest> {
    constructor() {
        super("indykite.identitymatching.v1beta1.ReadEntityMatchingReportRequest", [
            { no: 1, name: "id", kind: "scalar", T: 9 /*ScalarType.STRING*/, options: { "validate.rules": { string: { minLen: "22", maxLen: "254", pattern: "^[A-Za-z0-9-_:]{22,254}$" } } } }
        ]);
    }
    create(value?: PartialMessage<ReadEntityMatchingReportRequest>): ReadEntityMatchingReportRequest {
        const message = { id: "" };
        globalThis.Object.defineProperty(message, MESSAGE_TYPE, { enumerable: false, value: this });
        if (value !== undefined)
            reflectionMergePartial<ReadEntityMatchingReportRequest>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: ReadEntityMatchingReportRequest): ReadEntityMatchingReportRequest {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* string id */ 1:
                    message.id = reader.string();
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
    internalBinaryWrite(message: ReadEntityMatchingReportRequest, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* string id = 1; */
        if (message.id !== "")
            writer.tag(1, WireType.LengthDelimited).string(message.id);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message indykite.identitymatching.v1beta1.ReadEntityMatchingReportRequest
 */
export const ReadEntityMatchingReportRequest = new ReadEntityMatchingReportRequest$Type();
// @generated message type with reflection information, may provide speed optimized methods
class ReadEntityMatchingReportResponse$Type extends MessageType<ReadEntityMatchingReportResponse> {
    constructor() {
        super("indykite.identitymatching.v1beta1.ReadEntityMatchingReportResponse", [
            { no: 1, name: "id", kind: "scalar", T: 9 /*ScalarType.STRING*/, options: { "validate.rules": { string: { minLen: "22", maxLen: "254", pattern: "^[A-Za-z0-9-_:]{22,254}$" } } } },
            { no: 2, name: "report_url", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 3, name: "url_expire_time", kind: "message", T: () => Timestamp },
            { no: 4, name: "entity_matching_status", kind: "enum", T: () => ["indykite.identitymatching.v1beta1.PipelineStatus", PipelineStatus, "PIPELINE_STATUS_"], options: { "validate.rules": { enum: { definedOnly: true, notIn: [0] } } } }
        ]);
    }
    create(value?: PartialMessage<ReadEntityMatchingReportResponse>): ReadEntityMatchingReportResponse {
        const message = { id: "", reportUrl: "", entityMatchingStatus: 0 };
        globalThis.Object.defineProperty(message, MESSAGE_TYPE, { enumerable: false, value: this });
        if (value !== undefined)
            reflectionMergePartial<ReadEntityMatchingReportResponse>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: ReadEntityMatchingReportResponse): ReadEntityMatchingReportResponse {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* string id */ 1:
                    message.id = reader.string();
                    break;
                case /* string report_url */ 2:
                    message.reportUrl = reader.string();
                    break;
                case /* google.protobuf.Timestamp url_expire_time */ 3:
                    message.urlExpireTime = Timestamp.internalBinaryRead(reader, reader.uint32(), options, message.urlExpireTime);
                    break;
                case /* indykite.identitymatching.v1beta1.PipelineStatus entity_matching_status */ 4:
                    message.entityMatchingStatus = reader.int32();
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
    internalBinaryWrite(message: ReadEntityMatchingReportResponse, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* string id = 1; */
        if (message.id !== "")
            writer.tag(1, WireType.LengthDelimited).string(message.id);
        /* string report_url = 2; */
        if (message.reportUrl !== "")
            writer.tag(2, WireType.LengthDelimited).string(message.reportUrl);
        /* google.protobuf.Timestamp url_expire_time = 3; */
        if (message.urlExpireTime)
            Timestamp.internalBinaryWrite(message.urlExpireTime, writer.tag(3, WireType.LengthDelimited).fork(), options).join();
        /* indykite.identitymatching.v1beta1.PipelineStatus entity_matching_status = 4; */
        if (message.entityMatchingStatus !== 0)
            writer.tag(4, WireType.Varint).int32(message.entityMatchingStatus);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message indykite.identitymatching.v1beta1.ReadEntityMatchingReportResponse
 */
export const ReadEntityMatchingReportResponse = new ReadEntityMatchingReportResponse$Type();
/**
 * @generated ServiceType for protobuf service indykite.identitymatching.v1beta1.IdentityMatchingAPI
 */
export const IdentityMatchingAPI = new ServiceType("indykite.identitymatching.v1beta1.IdentityMatchingAPI", [
    { name: "RunIdentityMatchingPipeline", options: {}, I: RunIdentityMatchingPipelineRequest, O: RunIdentityMatchingPipelineResponse },
    { name: "ReadSuggestedPropertyMapping", options: {}, I: ReadSuggestedPropertyMappingRequest, O: ReadSuggestedPropertyMappingResponse },
    { name: "ReadEntityMatchingReport", options: {}, I: ReadEntityMatchingReportRequest, O: ReadEntityMatchingReportResponse }
]);
