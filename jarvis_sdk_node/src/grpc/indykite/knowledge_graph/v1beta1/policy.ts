// @generated by protobuf-ts 2.4.0 with parameter long_type_string,client_grpc1,generate_dependencies,// @generated from protobuf file "indykite/knowledge_graph/v1beta1/policy.proto" (package "indykite.knowledge_graph.v1beta1", syntax proto3),// tslint:disable
//
// Copyright (c) 2022 IndyKite AS.
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
import { Timestamp } from "../../../google/protobuf/timestamp";
import { AssuranceLevel } from "../../identity/v1beta1/attributes";
/**
 * @generated from protobuf message indykite.knowledge_graph.v1beta1.Policy
 */
export interface Policy {
    /**
     * @generated from protobuf field: indykite.knowledge_graph.v1beta1.Path path = 1;
     */
    path?: Path;
    /**
     * @generated from protobuf field: repeated string actions = 2;
     */
    actions: string[];
    /**
     * @generated from protobuf field: bool active = 3;
     */
    active: boolean;
}
/**
 * @generated from protobuf message indykite.knowledge_graph.v1beta1.Path
 */
export interface Path {
    /**
     * @generated from protobuf field: string subject_id = 1;
     */
    subjectId: string;
    /**
     * @generated from protobuf field: string resource_id = 2;
     */
    resourceId: string;
    /**
     * @generated from protobuf field: repeated indykite.knowledge_graph.v1beta1.Path.Entity entities = 3;
     */
    entities: Path_Entity[];
    /**
     * @generated from protobuf field: repeated indykite.knowledge_graph.v1beta1.Path.Relationship relationships = 4;
     */
    relationships: Path_Relationship[];
}
/**
 * @generated from protobuf message indykite.knowledge_graph.v1beta1.Path.Entity
 */
export interface Path_Entity {
    /**
     * @generated from protobuf field: string id = 1;
     */
    id: string;
    /**
     * @generated from protobuf field: repeated string labels = 2;
     */
    labels: string[];
    /**
     * @generated from protobuf field: repeated indykite.knowledge_graph.v1beta1.Path.Entity.IdentityProperty identity_properties = 4;
     */
    identityProperties: Path_Entity_IdentityProperty[];
    /**
     * @generated from protobuf field: repeated indykite.knowledge_graph.v1beta1.Path.Entity.KnowledgeProperty knowledge_properties = 5;
     */
    knowledgeProperties: Path_Entity_KnowledgeProperty[];
}
/**
 * @generated from protobuf message indykite.knowledge_graph.v1beta1.Path.Entity.IdentityProperty
 */
export interface Path_Entity_IdentityProperty {
    /**
     * @generated from protobuf field: string property = 1;
     */
    property: string;
    /**
     * @generated from protobuf field: string value = 2;
     */
    value: string;
    /**
     * @generated from protobuf field: indykite.identity.v1beta1.AssuranceLevel minimum_assurance_level = 3;
     */
    minimumAssuranceLevel: AssuranceLevel;
    /**
     * @generated from protobuf field: repeated string allowed_issuers = 4;
     */
    allowedIssuers: string[];
    /**
     * @generated from protobuf field: google.protobuf.Timestamp verification_time = 5;
     */
    verificationTime?: Timestamp;
    /**
     * @generated from protobuf field: repeated string allowed_verifiers = 6;
     */
    allowedVerifiers: string[];
    /**
     * @generated from protobuf field: bool must_be_primary = 7;
     */
    mustBePrimary: boolean;
}
/**
 * @generated from protobuf message indykite.knowledge_graph.v1beta1.Path.Entity.KnowledgeProperty
 */
export interface Path_Entity_KnowledgeProperty {
    /**
     * @generated from protobuf field: string property = 1;
     */
    property: string;
    /**
     * @generated from protobuf field: string value = 2;
     */
    value: string;
}
/**
 * @generated from protobuf message indykite.knowledge_graph.v1beta1.Path.Relationship
 */
export interface Path_Relationship {
    /**
     * @generated from protobuf field: string source = 1;
     */
    source: string;
    /**
     * @generated from protobuf field: string target = 2;
     */
    target: string;
    /**
     * @generated from protobuf field: repeated string types = 3;
     */
    types: string[];
    /**
     * @generated from protobuf field: bool non_directional = 4;
     */
    nonDirectional: boolean;
}
// @generated message type with reflection information, may provide speed optimized methods
class Policy$Type extends MessageType<Policy> {
    constructor() {
        super("indykite.knowledge_graph.v1beta1.Policy", [
            { no: 1, name: "path", kind: "message", T: () => Path, options: { "validate.rules": { message: { required: true } } } },
            { no: 2, name: "actions", kind: "scalar", repeat: 2 /*RepeatType.UNPACKED*/, T: 9 /*ScalarType.STRING*/, options: { "validate.rules": { repeated: { minItems: "1", maxItems: "32", unique: true, items: { string: { minLen: "2", maxLen: "100", pattern: "^[a-zA-Z0-9.:_\\-\\/]{2,}$" } } } } } },
            { no: 3, name: "active", kind: "scalar", T: 8 /*ScalarType.BOOL*/ }
        ]);
    }
    create(value?: PartialMessage<Policy>): Policy {
        const message = { actions: [], active: false };
        globalThis.Object.defineProperty(message, MESSAGE_TYPE, { enumerable: false, value: this });
        if (value !== undefined)
            reflectionMergePartial<Policy>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: Policy): Policy {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* indykite.knowledge_graph.v1beta1.Path path */ 1:
                    message.path = Path.internalBinaryRead(reader, reader.uint32(), options, message.path);
                    break;
                case /* repeated string actions */ 2:
                    message.actions.push(reader.string());
                    break;
                case /* bool active */ 3:
                    message.active = reader.bool();
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
    internalBinaryWrite(message: Policy, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* indykite.knowledge_graph.v1beta1.Path path = 1; */
        if (message.path)
            Path.internalBinaryWrite(message.path, writer.tag(1, WireType.LengthDelimited).fork(), options).join();
        /* repeated string actions = 2; */
        for (let i = 0; i < message.actions.length; i++)
            writer.tag(2, WireType.LengthDelimited).string(message.actions[i]);
        /* bool active = 3; */
        if (message.active !== false)
            writer.tag(3, WireType.Varint).bool(message.active);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message indykite.knowledge_graph.v1beta1.Policy
 */
export const Policy = new Policy$Type();
// @generated message type with reflection information, may provide speed optimized methods
class Path$Type extends MessageType<Path> {
    constructor() {
        super("indykite.knowledge_graph.v1beta1.Path", [
            { no: 1, name: "subject_id", kind: "scalar", T: 9 /*ScalarType.STRING*/, options: { "validate.rules": { string: { minLen: "2", maxLen: "50" } } } },
            { no: 2, name: "resource_id", kind: "scalar", T: 9 /*ScalarType.STRING*/, options: { "validate.rules": { string: { minLen: "2", maxLen: "50" } } } },
            { no: 3, name: "entities", kind: "message", repeat: 1 /*RepeatType.PACKED*/, T: () => Path_Entity, options: { "validate.rules": { repeated: { minItems: "2" } } } },
            { no: 4, name: "relationships", kind: "message", repeat: 1 /*RepeatType.PACKED*/, T: () => Path_Relationship, options: { "validate.rules": { repeated: { minItems: "1" } } } }
        ]);
    }
    create(value?: PartialMessage<Path>): Path {
        const message = { subjectId: "", resourceId: "", entities: [], relationships: [] };
        globalThis.Object.defineProperty(message, MESSAGE_TYPE, { enumerable: false, value: this });
        if (value !== undefined)
            reflectionMergePartial<Path>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: Path): Path {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* string subject_id */ 1:
                    message.subjectId = reader.string();
                    break;
                case /* string resource_id */ 2:
                    message.resourceId = reader.string();
                    break;
                case /* repeated indykite.knowledge_graph.v1beta1.Path.Entity entities */ 3:
                    message.entities.push(Path_Entity.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case /* repeated indykite.knowledge_graph.v1beta1.Path.Relationship relationships */ 4:
                    message.relationships.push(Path_Relationship.internalBinaryRead(reader, reader.uint32(), options));
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
    internalBinaryWrite(message: Path, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* string subject_id = 1; */
        if (message.subjectId !== "")
            writer.tag(1, WireType.LengthDelimited).string(message.subjectId);
        /* string resource_id = 2; */
        if (message.resourceId !== "")
            writer.tag(2, WireType.LengthDelimited).string(message.resourceId);
        /* repeated indykite.knowledge_graph.v1beta1.Path.Entity entities = 3; */
        for (let i = 0; i < message.entities.length; i++)
            Path_Entity.internalBinaryWrite(message.entities[i], writer.tag(3, WireType.LengthDelimited).fork(), options).join();
        /* repeated indykite.knowledge_graph.v1beta1.Path.Relationship relationships = 4; */
        for (let i = 0; i < message.relationships.length; i++)
            Path_Relationship.internalBinaryWrite(message.relationships[i], writer.tag(4, WireType.LengthDelimited).fork(), options).join();
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message indykite.knowledge_graph.v1beta1.Path
 */
export const Path = new Path$Type();
// @generated message type with reflection information, may provide speed optimized methods
class Path_Entity$Type extends MessageType<Path_Entity> {
    constructor() {
        super("indykite.knowledge_graph.v1beta1.Path.Entity", [
            { no: 1, name: "id", kind: "scalar", T: 9 /*ScalarType.STRING*/, options: { "validate.rules": { string: { minLen: "2", maxLen: "50" } } } },
            { no: 2, name: "labels", kind: "scalar", repeat: 2 /*RepeatType.UNPACKED*/, T: 9 /*ScalarType.STRING*/, options: { "validate.rules": { repeated: { minItems: "1", maxItems: "32", unique: true, items: { string: { minLen: "2", maxLen: "50", pattern: "^(?:[A-Z][a-z]+)+$" } } } } } },
            { no: 4, name: "identity_properties", kind: "message", repeat: 1 /*RepeatType.PACKED*/, T: () => Path_Entity_IdentityProperty },
            { no: 5, name: "knowledge_properties", kind: "message", repeat: 1 /*RepeatType.PACKED*/, T: () => Path_Entity_KnowledgeProperty }
        ]);
    }
    create(value?: PartialMessage<Path_Entity>): Path_Entity {
        const message = { id: "", labels: [], identityProperties: [], knowledgeProperties: [] };
        globalThis.Object.defineProperty(message, MESSAGE_TYPE, { enumerable: false, value: this });
        if (value !== undefined)
            reflectionMergePartial<Path_Entity>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: Path_Entity): Path_Entity {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* string id */ 1:
                    message.id = reader.string();
                    break;
                case /* repeated string labels */ 2:
                    message.labels.push(reader.string());
                    break;
                case /* repeated indykite.knowledge_graph.v1beta1.Path.Entity.IdentityProperty identity_properties */ 4:
                    message.identityProperties.push(Path_Entity_IdentityProperty.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case /* repeated indykite.knowledge_graph.v1beta1.Path.Entity.KnowledgeProperty knowledge_properties */ 5:
                    message.knowledgeProperties.push(Path_Entity_KnowledgeProperty.internalBinaryRead(reader, reader.uint32(), options));
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
    internalBinaryWrite(message: Path_Entity, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* string id = 1; */
        if (message.id !== "")
            writer.tag(1, WireType.LengthDelimited).string(message.id);
        /* repeated string labels = 2; */
        for (let i = 0; i < message.labels.length; i++)
            writer.tag(2, WireType.LengthDelimited).string(message.labels[i]);
        /* repeated indykite.knowledge_graph.v1beta1.Path.Entity.IdentityProperty identity_properties = 4; */
        for (let i = 0; i < message.identityProperties.length; i++)
            Path_Entity_IdentityProperty.internalBinaryWrite(message.identityProperties[i], writer.tag(4, WireType.LengthDelimited).fork(), options).join();
        /* repeated indykite.knowledge_graph.v1beta1.Path.Entity.KnowledgeProperty knowledge_properties = 5; */
        for (let i = 0; i < message.knowledgeProperties.length; i++)
            Path_Entity_KnowledgeProperty.internalBinaryWrite(message.knowledgeProperties[i], writer.tag(5, WireType.LengthDelimited).fork(), options).join();
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message indykite.knowledge_graph.v1beta1.Path.Entity
 */
export const Path_Entity = new Path_Entity$Type();
// @generated message type with reflection information, may provide speed optimized methods
class Path_Entity_IdentityProperty$Type extends MessageType<Path_Entity_IdentityProperty> {
    constructor() {
        super("indykite.knowledge_graph.v1beta1.Path.Entity.IdentityProperty", [
            { no: 1, name: "property", kind: "scalar", T: 9 /*ScalarType.STRING*/, options: { "validate.rules": { string: { minLen: "2", maxLen: "256", pattern: "^[a-zA-Z_][a-zA-Z0-9_]+$" } } } },
            { no: 2, name: "value", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 3, name: "minimum_assurance_level", kind: "enum", T: () => ["indykite.identity.v1beta1.AssuranceLevel", AssuranceLevel, "ASSURANCE_LEVEL_"], options: { "validate.rules": { enum: { definedOnly: true } } } },
            { no: 4, name: "allowed_issuers", kind: "scalar", repeat: 2 /*RepeatType.UNPACKED*/, T: 9 /*ScalarType.STRING*/ },
            { no: 5, name: "verification_time", kind: "message", T: () => Timestamp },
            { no: 6, name: "allowed_verifiers", kind: "scalar", repeat: 2 /*RepeatType.UNPACKED*/, T: 9 /*ScalarType.STRING*/ },
            { no: 7, name: "must_be_primary", kind: "scalar", T: 8 /*ScalarType.BOOL*/ }
        ]);
    }
    create(value?: PartialMessage<Path_Entity_IdentityProperty>): Path_Entity_IdentityProperty {
        const message = { property: "", value: "", minimumAssuranceLevel: 0, allowedIssuers: [], allowedVerifiers: [], mustBePrimary: false };
        globalThis.Object.defineProperty(message, MESSAGE_TYPE, { enumerable: false, value: this });
        if (value !== undefined)
            reflectionMergePartial<Path_Entity_IdentityProperty>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: Path_Entity_IdentityProperty): Path_Entity_IdentityProperty {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* string property */ 1:
                    message.property = reader.string();
                    break;
                case /* string value */ 2:
                    message.value = reader.string();
                    break;
                case /* indykite.identity.v1beta1.AssuranceLevel minimum_assurance_level */ 3:
                    message.minimumAssuranceLevel = reader.int32();
                    break;
                case /* repeated string allowed_issuers */ 4:
                    message.allowedIssuers.push(reader.string());
                    break;
                case /* google.protobuf.Timestamp verification_time */ 5:
                    message.verificationTime = Timestamp.internalBinaryRead(reader, reader.uint32(), options, message.verificationTime);
                    break;
                case /* repeated string allowed_verifiers */ 6:
                    message.allowedVerifiers.push(reader.string());
                    break;
                case /* bool must_be_primary */ 7:
                    message.mustBePrimary = reader.bool();
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
    internalBinaryWrite(message: Path_Entity_IdentityProperty, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* string property = 1; */
        if (message.property !== "")
            writer.tag(1, WireType.LengthDelimited).string(message.property);
        /* string value = 2; */
        if (message.value !== "")
            writer.tag(2, WireType.LengthDelimited).string(message.value);
        /* indykite.identity.v1beta1.AssuranceLevel minimum_assurance_level = 3; */
        if (message.minimumAssuranceLevel !== 0)
            writer.tag(3, WireType.Varint).int32(message.minimumAssuranceLevel);
        /* repeated string allowed_issuers = 4; */
        for (let i = 0; i < message.allowedIssuers.length; i++)
            writer.tag(4, WireType.LengthDelimited).string(message.allowedIssuers[i]);
        /* google.protobuf.Timestamp verification_time = 5; */
        if (message.verificationTime)
            Timestamp.internalBinaryWrite(message.verificationTime, writer.tag(5, WireType.LengthDelimited).fork(), options).join();
        /* repeated string allowed_verifiers = 6; */
        for (let i = 0; i < message.allowedVerifiers.length; i++)
            writer.tag(6, WireType.LengthDelimited).string(message.allowedVerifiers[i]);
        /* bool must_be_primary = 7; */
        if (message.mustBePrimary !== false)
            writer.tag(7, WireType.Varint).bool(message.mustBePrimary);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message indykite.knowledge_graph.v1beta1.Path.Entity.IdentityProperty
 */
export const Path_Entity_IdentityProperty = new Path_Entity_IdentityProperty$Type();
// @generated message type with reflection information, may provide speed optimized methods
class Path_Entity_KnowledgeProperty$Type extends MessageType<Path_Entity_KnowledgeProperty> {
    constructor() {
        super("indykite.knowledge_graph.v1beta1.Path.Entity.KnowledgeProperty", [
            { no: 1, name: "property", kind: "scalar", T: 9 /*ScalarType.STRING*/, options: { "validate.rules": { string: { minLen: "2", maxLen: "256", pattern: "^[a-zA-Z_][a-zA-Z0-9_]+$" } } } },
            { no: 2, name: "value", kind: "scalar", T: 9 /*ScalarType.STRING*/, options: { "validate.rules": { string: { minLen: "2" } } } }
        ]);
    }
    create(value?: PartialMessage<Path_Entity_KnowledgeProperty>): Path_Entity_KnowledgeProperty {
        const message = { property: "", value: "" };
        globalThis.Object.defineProperty(message, MESSAGE_TYPE, { enumerable: false, value: this });
        if (value !== undefined)
            reflectionMergePartial<Path_Entity_KnowledgeProperty>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: Path_Entity_KnowledgeProperty): Path_Entity_KnowledgeProperty {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* string property */ 1:
                    message.property = reader.string();
                    break;
                case /* string value */ 2:
                    message.value = reader.string();
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
    internalBinaryWrite(message: Path_Entity_KnowledgeProperty, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* string property = 1; */
        if (message.property !== "")
            writer.tag(1, WireType.LengthDelimited).string(message.property);
        /* string value = 2; */
        if (message.value !== "")
            writer.tag(2, WireType.LengthDelimited).string(message.value);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message indykite.knowledge_graph.v1beta1.Path.Entity.KnowledgeProperty
 */
export const Path_Entity_KnowledgeProperty = new Path_Entity_KnowledgeProperty$Type();
// @generated message type with reflection information, may provide speed optimized methods
class Path_Relationship$Type extends MessageType<Path_Relationship> {
    constructor() {
        super("indykite.knowledge_graph.v1beta1.Path.Relationship", [
            { no: 1, name: "source", kind: "scalar", T: 9 /*ScalarType.STRING*/, options: { "validate.rules": { string: { minLen: "2", maxLen: "50" } } } },
            { no: 2, name: "target", kind: "scalar", T: 9 /*ScalarType.STRING*/, options: { "validate.rules": { string: { minLen: "2", maxLen: "50" } } } },
            { no: 3, name: "types", kind: "scalar", repeat: 2 /*RepeatType.UNPACKED*/, T: 9 /*ScalarType.STRING*/, options: { "validate.rules": { repeated: { minItems: "0", maxItems: "32", unique: true, items: { string: { minLen: "2", maxLen: "50", pattern: "^[A-Z]+(?:_[A-Z]+)*$" } } } } } },
            { no: 4, name: "non_directional", kind: "scalar", T: 8 /*ScalarType.BOOL*/ }
        ]);
    }
    create(value?: PartialMessage<Path_Relationship>): Path_Relationship {
        const message = { source: "", target: "", types: [], nonDirectional: false };
        globalThis.Object.defineProperty(message, MESSAGE_TYPE, { enumerable: false, value: this });
        if (value !== undefined)
            reflectionMergePartial<Path_Relationship>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: Path_Relationship): Path_Relationship {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* string source */ 1:
                    message.source = reader.string();
                    break;
                case /* string target */ 2:
                    message.target = reader.string();
                    break;
                case /* repeated string types */ 3:
                    message.types.push(reader.string());
                    break;
                case /* bool non_directional */ 4:
                    message.nonDirectional = reader.bool();
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
    internalBinaryWrite(message: Path_Relationship, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* string source = 1; */
        if (message.source !== "")
            writer.tag(1, WireType.LengthDelimited).string(message.source);
        /* string target = 2; */
        if (message.target !== "")
            writer.tag(2, WireType.LengthDelimited).string(message.target);
        /* repeated string types = 3; */
        for (let i = 0; i < message.types.length; i++)
            writer.tag(3, WireType.LengthDelimited).string(message.types[i]);
        /* bool non_directional = 4; */
        if (message.nonDirectional !== false)
            writer.tag(4, WireType.Varint).bool(message.nonDirectional);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message indykite.knowledge_graph.v1beta1.Path.Relationship
 */
export const Path_Relationship = new Path_Relationship$Type();
