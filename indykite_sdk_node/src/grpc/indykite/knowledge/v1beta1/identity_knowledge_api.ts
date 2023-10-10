// @generated by protobuf-ts 2.9.0 with parameter long_type_string,client_grpc1,generate_dependencies
// @generated from protobuf file "indykite/knowledge/v1beta1/identity_knowledge_api.proto" (package "indykite.knowledge.v1beta1", syntax proto3)
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
import { Path } from "./model";
import { InputParam } from "./model";
import { Operation } from "./model";
/**
 * @generated from protobuf message indykite.knowledge.v1beta1.IdentityKnowledgeRequest
 */
export interface IdentityKnowledgeRequest {
    /**
     * @generated from protobuf field: indykite.knowledge.v1beta1.Operation operation = 1;
     */
    operation: Operation;
    /**
     * @generated from protobuf field: string path = 2;
     */
    path: string;
    /**
     * @generated from protobuf field: string conditions = 3;
     */
    conditions: string;
    /**
     * @generated from protobuf field: map<string, indykite.knowledge.v1beta1.InputParam> input_params = 4;
     */
    inputParams: {
        [key: string]: InputParam;
    };
}
/**
 * @generated from protobuf message indykite.knowledge.v1beta1.IdentityKnowledgeResponse
 */
export interface IdentityKnowledgeResponse {
    /**
     * @generated from protobuf field: repeated indykite.knowledge.v1beta1.Path paths = 1;
     */
    paths: Path[];
}
// @generated message type with reflection information, may provide speed optimized methods
class IdentityKnowledgeRequest$Type extends MessageType<IdentityKnowledgeRequest> {
    constructor() {
        super("indykite.knowledge.v1beta1.IdentityKnowledgeRequest", [
            { no: 1, name: "operation", kind: "enum", T: () => ["indykite.knowledge.v1beta1.Operation", Operation, "OPERATION_"], options: { "validate.rules": { enum: { definedOnly: true, in: [1] } } } },
            { no: 2, name: "path", kind: "scalar", T: 9 /*ScalarType.STRING*/, options: { "validate.rules": { string: { maxBytes: "512000" } } } },
            { no: 3, name: "conditions", kind: "scalar", T: 9 /*ScalarType.STRING*/, options: { "validate.rules": { string: { maxBytes: "512000" } } } },
            { no: 4, name: "input_params", kind: "map", K: 9 /*ScalarType.STRING*/, V: { kind: "message", T: () => InputParam } }
        ]);
    }
    create(value?: PartialMessage<IdentityKnowledgeRequest>): IdentityKnowledgeRequest {
        const message = { operation: 0, path: "", conditions: "", inputParams: {} };
        globalThis.Object.defineProperty(message, MESSAGE_TYPE, { enumerable: false, value: this });
        if (value !== undefined)
            reflectionMergePartial<IdentityKnowledgeRequest>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: IdentityKnowledgeRequest): IdentityKnowledgeRequest {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* indykite.knowledge.v1beta1.Operation operation */ 1:
                    message.operation = reader.int32();
                    break;
                case /* string path */ 2:
                    message.path = reader.string();
                    break;
                case /* string conditions */ 3:
                    message.conditions = reader.string();
                    break;
                case /* map<string, indykite.knowledge.v1beta1.InputParam> input_params */ 4:
                    this.binaryReadMap4(message.inputParams, reader, options);
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
    private binaryReadMap4(map: IdentityKnowledgeRequest["inputParams"], reader: IBinaryReader, options: BinaryReadOptions): void {
        let len = reader.uint32(), end = reader.pos + len, key: keyof IdentityKnowledgeRequest["inputParams"] | undefined, val: IdentityKnowledgeRequest["inputParams"][any] | undefined;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case 1:
                    key = reader.string();
                    break;
                case 2:
                    val = InputParam.internalBinaryRead(reader, reader.uint32(), options);
                    break;
                default: throw new globalThis.Error("unknown map entry field for field indykite.knowledge.v1beta1.IdentityKnowledgeRequest.input_params");
            }
        }
        map[key ?? ""] = val ?? InputParam.create();
    }
    internalBinaryWrite(message: IdentityKnowledgeRequest, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* indykite.knowledge.v1beta1.Operation operation = 1; */
        if (message.operation !== 0)
            writer.tag(1, WireType.Varint).int32(message.operation);
        /* string path = 2; */
        if (message.path !== "")
            writer.tag(2, WireType.LengthDelimited).string(message.path);
        /* string conditions = 3; */
        if (message.conditions !== "")
            writer.tag(3, WireType.LengthDelimited).string(message.conditions);
        /* map<string, indykite.knowledge.v1beta1.InputParam> input_params = 4; */
        for (let k of Object.keys(message.inputParams)) {
            writer.tag(4, WireType.LengthDelimited).fork().tag(1, WireType.LengthDelimited).string(k);
            writer.tag(2, WireType.LengthDelimited).fork();
            InputParam.internalBinaryWrite(message.inputParams[k], writer, options);
            writer.join().join();
        }
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message indykite.knowledge.v1beta1.IdentityKnowledgeRequest
 */
export const IdentityKnowledgeRequest = new IdentityKnowledgeRequest$Type();
// @generated message type with reflection information, may provide speed optimized methods
class IdentityKnowledgeResponse$Type extends MessageType<IdentityKnowledgeResponse> {
    constructor() {
        super("indykite.knowledge.v1beta1.IdentityKnowledgeResponse", [
            { no: 1, name: "paths", kind: "message", repeat: 1 /*RepeatType.PACKED*/, T: () => Path }
        ]);
    }
    create(value?: PartialMessage<IdentityKnowledgeResponse>): IdentityKnowledgeResponse {
        const message = { paths: [] };
        globalThis.Object.defineProperty(message, MESSAGE_TYPE, { enumerable: false, value: this });
        if (value !== undefined)
            reflectionMergePartial<IdentityKnowledgeResponse>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: IdentityKnowledgeResponse): IdentityKnowledgeResponse {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* repeated indykite.knowledge.v1beta1.Path paths */ 1:
                    message.paths.push(Path.internalBinaryRead(reader, reader.uint32(), options));
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
    internalBinaryWrite(message: IdentityKnowledgeResponse, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* repeated indykite.knowledge.v1beta1.Path paths = 1; */
        for (let i = 0; i < message.paths.length; i++)
            Path.internalBinaryWrite(message.paths[i], writer.tag(1, WireType.LengthDelimited).fork(), options).join();
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message indykite.knowledge.v1beta1.IdentityKnowledgeResponse
 */
export const IdentityKnowledgeResponse = new IdentityKnowledgeResponse$Type();
/**
 * @generated ServiceType for protobuf service indykite.knowledge.v1beta1.IdentityKnowledgeAPI
 */
export const IdentityKnowledgeAPI = new ServiceType("indykite.knowledge.v1beta1.IdentityKnowledgeAPI", [
    { name: "IdentityKnowledge", options: {}, I: IdentityKnowledgeRequest, O: IdentityKnowledgeResponse }
]);
