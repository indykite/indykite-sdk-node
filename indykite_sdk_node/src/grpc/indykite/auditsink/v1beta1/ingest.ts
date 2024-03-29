// @generated by protobuf-ts 2.9.0 with parameter long_type_string,client_grpc1,generate_dependencies
// @generated from protobuf file "indykite/auditsink/v1beta1/ingest.proto" (package "indykite.auditsink.v1beta1", syntax proto3)
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
/**
 * @generated from protobuf message indykite.auditsink.v1beta1.UpsertData
 */
export interface UpsertData {
    /**
     * @generated from protobuf oneof: data
     */
    data: {
        oneofKind: "node";
        /**
         * @generated from protobuf field: indykite.auditsink.v1beta1.Node node = 1;
         */
        node: Node;
    } | {
        oneofKind: "relation";
        /**
         * @generated from protobuf field: indykite.auditsink.v1beta1.Relation relation = 2;
         */
        relation: Relation;
    } | {
        oneofKind: undefined;
    };
}
/**
 * @generated from protobuf message indykite.auditsink.v1beta1.DeleteData
 */
export interface DeleteData {
    /**
     * @generated from protobuf oneof: data
     */
    data: {
        oneofKind: "node";
        /**
         * @generated from protobuf field: indykite.auditsink.v1beta1.NodeMatch node = 1;
         */
        node: NodeMatch;
    } | {
        oneofKind: "relation";
        /**
         * @generated from protobuf field: indykite.auditsink.v1beta1.RelationMatch relation = 2;
         */
        relation: RelationMatch;
    } | {
        oneofKind: "nodeProperty";
        /**
         * @generated from protobuf field: indykite.auditsink.v1beta1.DeleteData.NodePropertyMatch node_property = 3;
         */
        nodeProperty: DeleteData_NodePropertyMatch;
    } | {
        oneofKind: "relationProperty";
        /**
         * @generated from protobuf field: indykite.auditsink.v1beta1.DeleteData.RelationPropertyMatch relation_property = 4;
         */
        relationProperty: DeleteData_RelationPropertyMatch;
    } | {
        oneofKind: undefined;
    };
}
/**
 * @generated from protobuf message indykite.auditsink.v1beta1.DeleteData.NodePropertyMatch
 */
export interface DeleteData_NodePropertyMatch {
    /**
     * @generated from protobuf field: indykite.auditsink.v1beta1.NodeMatch match = 1;
     */
    match?: NodeMatch;
    /**
     * @generated from protobuf field: string key = 2;
     */
    key: string;
}
/**
 * @generated from protobuf message indykite.auditsink.v1beta1.DeleteData.RelationPropertyMatch
 */
export interface DeleteData_RelationPropertyMatch {
    /**
     * @generated from protobuf field: indykite.auditsink.v1beta1.RelationMatch match = 1;
     */
    match?: RelationMatch;
    /**
     * @generated from protobuf field: string key = 2;
     */
    key: string;
}
/**
 * @generated from protobuf message indykite.auditsink.v1beta1.DigitalTwin
 */
export interface DigitalTwin {
    /**
     * @generated from protobuf field: string external_id = 1;
     */
    externalId: string;
    /**
     * @generated from protobuf field: string type = 2;
     */
    type: string;
    /**
     * @generated from protobuf field: string tenant_id = 3;
     */
    tenantId: string;
}
/**
 * @generated from protobuf message indykite.auditsink.v1beta1.Resource
 */
export interface Resource {
    /**
     * @generated from protobuf field: string external_id = 1;
     */
    externalId: string;
    /**
     * @generated from protobuf field: string type = 2;
     */
    type: string;
}
/**
 * @generated from protobuf message indykite.auditsink.v1beta1.Node
 */
export interface Node {
    /**
     * @generated from protobuf oneof: type
     */
    type: {
        oneofKind: "digitalTwin";
        /**
         * @generated from protobuf field: indykite.auditsink.v1beta1.DigitalTwin digital_twin = 1;
         */
        digitalTwin: DigitalTwin;
    } | {
        oneofKind: "resource";
        /**
         * @generated from protobuf field: indykite.auditsink.v1beta1.Resource resource = 2;
         */
        resource: Resource;
    } | {
        oneofKind: undefined;
    };
}
/**
 * @generated from protobuf message indykite.auditsink.v1beta1.Relation
 */
export interface Relation {
    /**
     * @generated from protobuf field: indykite.auditsink.v1beta1.RelationMatch match = 1;
     */
    match?: RelationMatch;
}
/**
 * @generated from protobuf message indykite.auditsink.v1beta1.NodeMatch
 */
export interface NodeMatch {
    /**
     * @generated from protobuf field: string external_id = 1;
     */
    externalId: string;
    /**
     * @generated from protobuf field: string type = 2;
     */
    type: string;
}
/**
 * @generated from protobuf message indykite.auditsink.v1beta1.RelationMatch
 */
export interface RelationMatch {
    /**
     * @generated from protobuf field: indykite.auditsink.v1beta1.NodeMatch source_match = 1;
     */
    sourceMatch?: NodeMatch;
    /**
     * @generated from protobuf field: indykite.auditsink.v1beta1.NodeMatch target_match = 2;
     */
    targetMatch?: NodeMatch;
    /**
     * @generated from protobuf field: string type = 3;
     */
    type: string;
}
// @generated message type with reflection information, may provide speed optimized methods
class UpsertData$Type extends MessageType<UpsertData> {
    constructor() {
        super("indykite.auditsink.v1beta1.UpsertData", [
            { no: 1, name: "node", kind: "message", oneof: "data", T: () => Node },
            { no: 2, name: "relation", kind: "message", oneof: "data", T: () => Relation }
        ]);
    }
    create(value?: PartialMessage<UpsertData>): UpsertData {
        const message = { data: { oneofKind: undefined } };
        globalThis.Object.defineProperty(message, MESSAGE_TYPE, { enumerable: false, value: this });
        if (value !== undefined)
            reflectionMergePartial<UpsertData>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: UpsertData): UpsertData {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* indykite.auditsink.v1beta1.Node node */ 1:
                    message.data = {
                        oneofKind: "node",
                        node: Node.internalBinaryRead(reader, reader.uint32(), options, (message.data as any).node)
                    };
                    break;
                case /* indykite.auditsink.v1beta1.Relation relation */ 2:
                    message.data = {
                        oneofKind: "relation",
                        relation: Relation.internalBinaryRead(reader, reader.uint32(), options, (message.data as any).relation)
                    };
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
    internalBinaryWrite(message: UpsertData, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* indykite.auditsink.v1beta1.Node node = 1; */
        if (message.data.oneofKind === "node")
            Node.internalBinaryWrite(message.data.node, writer.tag(1, WireType.LengthDelimited).fork(), options).join();
        /* indykite.auditsink.v1beta1.Relation relation = 2; */
        if (message.data.oneofKind === "relation")
            Relation.internalBinaryWrite(message.data.relation, writer.tag(2, WireType.LengthDelimited).fork(), options).join();
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message indykite.auditsink.v1beta1.UpsertData
 */
export const UpsertData = new UpsertData$Type();
// @generated message type with reflection information, may provide speed optimized methods
class DeleteData$Type extends MessageType<DeleteData> {
    constructor() {
        super("indykite.auditsink.v1beta1.DeleteData", [
            { no: 1, name: "node", kind: "message", oneof: "data", T: () => NodeMatch },
            { no: 2, name: "relation", kind: "message", oneof: "data", T: () => RelationMatch },
            { no: 3, name: "node_property", kind: "message", oneof: "data", T: () => DeleteData_NodePropertyMatch },
            { no: 4, name: "relation_property", kind: "message", oneof: "data", T: () => DeleteData_RelationPropertyMatch }
        ]);
    }
    create(value?: PartialMessage<DeleteData>): DeleteData {
        const message = { data: { oneofKind: undefined } };
        globalThis.Object.defineProperty(message, MESSAGE_TYPE, { enumerable: false, value: this });
        if (value !== undefined)
            reflectionMergePartial<DeleteData>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: DeleteData): DeleteData {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* indykite.auditsink.v1beta1.NodeMatch node */ 1:
                    message.data = {
                        oneofKind: "node",
                        node: NodeMatch.internalBinaryRead(reader, reader.uint32(), options, (message.data as any).node)
                    };
                    break;
                case /* indykite.auditsink.v1beta1.RelationMatch relation */ 2:
                    message.data = {
                        oneofKind: "relation",
                        relation: RelationMatch.internalBinaryRead(reader, reader.uint32(), options, (message.data as any).relation)
                    };
                    break;
                case /* indykite.auditsink.v1beta1.DeleteData.NodePropertyMatch node_property */ 3:
                    message.data = {
                        oneofKind: "nodeProperty",
                        nodeProperty: DeleteData_NodePropertyMatch.internalBinaryRead(reader, reader.uint32(), options, (message.data as any).nodeProperty)
                    };
                    break;
                case /* indykite.auditsink.v1beta1.DeleteData.RelationPropertyMatch relation_property */ 4:
                    message.data = {
                        oneofKind: "relationProperty",
                        relationProperty: DeleteData_RelationPropertyMatch.internalBinaryRead(reader, reader.uint32(), options, (message.data as any).relationProperty)
                    };
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
    internalBinaryWrite(message: DeleteData, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* indykite.auditsink.v1beta1.NodeMatch node = 1; */
        if (message.data.oneofKind === "node")
            NodeMatch.internalBinaryWrite(message.data.node, writer.tag(1, WireType.LengthDelimited).fork(), options).join();
        /* indykite.auditsink.v1beta1.RelationMatch relation = 2; */
        if (message.data.oneofKind === "relation")
            RelationMatch.internalBinaryWrite(message.data.relation, writer.tag(2, WireType.LengthDelimited).fork(), options).join();
        /* indykite.auditsink.v1beta1.DeleteData.NodePropertyMatch node_property = 3; */
        if (message.data.oneofKind === "nodeProperty")
            DeleteData_NodePropertyMatch.internalBinaryWrite(message.data.nodeProperty, writer.tag(3, WireType.LengthDelimited).fork(), options).join();
        /* indykite.auditsink.v1beta1.DeleteData.RelationPropertyMatch relation_property = 4; */
        if (message.data.oneofKind === "relationProperty")
            DeleteData_RelationPropertyMatch.internalBinaryWrite(message.data.relationProperty, writer.tag(4, WireType.LengthDelimited).fork(), options).join();
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message indykite.auditsink.v1beta1.DeleteData
 */
export const DeleteData = new DeleteData$Type();
// @generated message type with reflection information, may provide speed optimized methods
class DeleteData_NodePropertyMatch$Type extends MessageType<DeleteData_NodePropertyMatch> {
    constructor() {
        super("indykite.auditsink.v1beta1.DeleteData.NodePropertyMatch", [
            { no: 1, name: "match", kind: "message", T: () => NodeMatch },
            { no: 2, name: "key", kind: "scalar", T: 9 /*ScalarType.STRING*/ }
        ]);
    }
    create(value?: PartialMessage<DeleteData_NodePropertyMatch>): DeleteData_NodePropertyMatch {
        const message = { key: "" };
        globalThis.Object.defineProperty(message, MESSAGE_TYPE, { enumerable: false, value: this });
        if (value !== undefined)
            reflectionMergePartial<DeleteData_NodePropertyMatch>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: DeleteData_NodePropertyMatch): DeleteData_NodePropertyMatch {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* indykite.auditsink.v1beta1.NodeMatch match */ 1:
                    message.match = NodeMatch.internalBinaryRead(reader, reader.uint32(), options, message.match);
                    break;
                case /* string key */ 2:
                    message.key = reader.string();
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
    internalBinaryWrite(message: DeleteData_NodePropertyMatch, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* indykite.auditsink.v1beta1.NodeMatch match = 1; */
        if (message.match)
            NodeMatch.internalBinaryWrite(message.match, writer.tag(1, WireType.LengthDelimited).fork(), options).join();
        /* string key = 2; */
        if (message.key !== "")
            writer.tag(2, WireType.LengthDelimited).string(message.key);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message indykite.auditsink.v1beta1.DeleteData.NodePropertyMatch
 */
export const DeleteData_NodePropertyMatch = new DeleteData_NodePropertyMatch$Type();
// @generated message type with reflection information, may provide speed optimized methods
class DeleteData_RelationPropertyMatch$Type extends MessageType<DeleteData_RelationPropertyMatch> {
    constructor() {
        super("indykite.auditsink.v1beta1.DeleteData.RelationPropertyMatch", [
            { no: 1, name: "match", kind: "message", T: () => RelationMatch },
            { no: 2, name: "key", kind: "scalar", T: 9 /*ScalarType.STRING*/ }
        ]);
    }
    create(value?: PartialMessage<DeleteData_RelationPropertyMatch>): DeleteData_RelationPropertyMatch {
        const message = { key: "" };
        globalThis.Object.defineProperty(message, MESSAGE_TYPE, { enumerable: false, value: this });
        if (value !== undefined)
            reflectionMergePartial<DeleteData_RelationPropertyMatch>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: DeleteData_RelationPropertyMatch): DeleteData_RelationPropertyMatch {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* indykite.auditsink.v1beta1.RelationMatch match */ 1:
                    message.match = RelationMatch.internalBinaryRead(reader, reader.uint32(), options, message.match);
                    break;
                case /* string key */ 2:
                    message.key = reader.string();
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
    internalBinaryWrite(message: DeleteData_RelationPropertyMatch, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* indykite.auditsink.v1beta1.RelationMatch match = 1; */
        if (message.match)
            RelationMatch.internalBinaryWrite(message.match, writer.tag(1, WireType.LengthDelimited).fork(), options).join();
        /* string key = 2; */
        if (message.key !== "")
            writer.tag(2, WireType.LengthDelimited).string(message.key);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message indykite.auditsink.v1beta1.DeleteData.RelationPropertyMatch
 */
export const DeleteData_RelationPropertyMatch = new DeleteData_RelationPropertyMatch$Type();
// @generated message type with reflection information, may provide speed optimized methods
class DigitalTwin$Type extends MessageType<DigitalTwin> {
    constructor() {
        super("indykite.auditsink.v1beta1.DigitalTwin", [
            { no: 1, name: "external_id", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 2, name: "type", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 3, name: "tenant_id", kind: "scalar", T: 9 /*ScalarType.STRING*/ }
        ]);
    }
    create(value?: PartialMessage<DigitalTwin>): DigitalTwin {
        const message = { externalId: "", type: "", tenantId: "" };
        globalThis.Object.defineProperty(message, MESSAGE_TYPE, { enumerable: false, value: this });
        if (value !== undefined)
            reflectionMergePartial<DigitalTwin>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: DigitalTwin): DigitalTwin {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* string external_id */ 1:
                    message.externalId = reader.string();
                    break;
                case /* string type */ 2:
                    message.type = reader.string();
                    break;
                case /* string tenant_id */ 3:
                    message.tenantId = reader.string();
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
    internalBinaryWrite(message: DigitalTwin, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* string external_id = 1; */
        if (message.externalId !== "")
            writer.tag(1, WireType.LengthDelimited).string(message.externalId);
        /* string type = 2; */
        if (message.type !== "")
            writer.tag(2, WireType.LengthDelimited).string(message.type);
        /* string tenant_id = 3; */
        if (message.tenantId !== "")
            writer.tag(3, WireType.LengthDelimited).string(message.tenantId);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message indykite.auditsink.v1beta1.DigitalTwin
 */
export const DigitalTwin = new DigitalTwin$Type();
// @generated message type with reflection information, may provide speed optimized methods
class Resource$Type extends MessageType<Resource> {
    constructor() {
        super("indykite.auditsink.v1beta1.Resource", [
            { no: 1, name: "external_id", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 2, name: "type", kind: "scalar", T: 9 /*ScalarType.STRING*/ }
        ]);
    }
    create(value?: PartialMessage<Resource>): Resource {
        const message = { externalId: "", type: "" };
        globalThis.Object.defineProperty(message, MESSAGE_TYPE, { enumerable: false, value: this });
        if (value !== undefined)
            reflectionMergePartial<Resource>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: Resource): Resource {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* string external_id */ 1:
                    message.externalId = reader.string();
                    break;
                case /* string type */ 2:
                    message.type = reader.string();
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
    internalBinaryWrite(message: Resource, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* string external_id = 1; */
        if (message.externalId !== "")
            writer.tag(1, WireType.LengthDelimited).string(message.externalId);
        /* string type = 2; */
        if (message.type !== "")
            writer.tag(2, WireType.LengthDelimited).string(message.type);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message indykite.auditsink.v1beta1.Resource
 */
export const Resource = new Resource$Type();
// @generated message type with reflection information, may provide speed optimized methods
class Node$Type extends MessageType<Node> {
    constructor() {
        super("indykite.auditsink.v1beta1.Node", [
            { no: 1, name: "digital_twin", kind: "message", oneof: "type", T: () => DigitalTwin },
            { no: 2, name: "resource", kind: "message", oneof: "type", T: () => Resource }
        ]);
    }
    create(value?: PartialMessage<Node>): Node {
        const message = { type: { oneofKind: undefined } };
        globalThis.Object.defineProperty(message, MESSAGE_TYPE, { enumerable: false, value: this });
        if (value !== undefined)
            reflectionMergePartial<Node>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: Node): Node {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* indykite.auditsink.v1beta1.DigitalTwin digital_twin */ 1:
                    message.type = {
                        oneofKind: "digitalTwin",
                        digitalTwin: DigitalTwin.internalBinaryRead(reader, reader.uint32(), options, (message.type as any).digitalTwin)
                    };
                    break;
                case /* indykite.auditsink.v1beta1.Resource resource */ 2:
                    message.type = {
                        oneofKind: "resource",
                        resource: Resource.internalBinaryRead(reader, reader.uint32(), options, (message.type as any).resource)
                    };
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
    internalBinaryWrite(message: Node, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* indykite.auditsink.v1beta1.DigitalTwin digital_twin = 1; */
        if (message.type.oneofKind === "digitalTwin")
            DigitalTwin.internalBinaryWrite(message.type.digitalTwin, writer.tag(1, WireType.LengthDelimited).fork(), options).join();
        /* indykite.auditsink.v1beta1.Resource resource = 2; */
        if (message.type.oneofKind === "resource")
            Resource.internalBinaryWrite(message.type.resource, writer.tag(2, WireType.LengthDelimited).fork(), options).join();
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message indykite.auditsink.v1beta1.Node
 */
export const Node = new Node$Type();
// @generated message type with reflection information, may provide speed optimized methods
class Relation$Type extends MessageType<Relation> {
    constructor() {
        super("indykite.auditsink.v1beta1.Relation", [
            { no: 1, name: "match", kind: "message", T: () => RelationMatch }
        ]);
    }
    create(value?: PartialMessage<Relation>): Relation {
        const message = {};
        globalThis.Object.defineProperty(message, MESSAGE_TYPE, { enumerable: false, value: this });
        if (value !== undefined)
            reflectionMergePartial<Relation>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: Relation): Relation {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* indykite.auditsink.v1beta1.RelationMatch match */ 1:
                    message.match = RelationMatch.internalBinaryRead(reader, reader.uint32(), options, message.match);
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
    internalBinaryWrite(message: Relation, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* indykite.auditsink.v1beta1.RelationMatch match = 1; */
        if (message.match)
            RelationMatch.internalBinaryWrite(message.match, writer.tag(1, WireType.LengthDelimited).fork(), options).join();
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message indykite.auditsink.v1beta1.Relation
 */
export const Relation = new Relation$Type();
// @generated message type with reflection information, may provide speed optimized methods
class NodeMatch$Type extends MessageType<NodeMatch> {
    constructor() {
        super("indykite.auditsink.v1beta1.NodeMatch", [
            { no: 1, name: "external_id", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 2, name: "type", kind: "scalar", T: 9 /*ScalarType.STRING*/ }
        ]);
    }
    create(value?: PartialMessage<NodeMatch>): NodeMatch {
        const message = { externalId: "", type: "" };
        globalThis.Object.defineProperty(message, MESSAGE_TYPE, { enumerable: false, value: this });
        if (value !== undefined)
            reflectionMergePartial<NodeMatch>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: NodeMatch): NodeMatch {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* string external_id */ 1:
                    message.externalId = reader.string();
                    break;
                case /* string type */ 2:
                    message.type = reader.string();
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
    internalBinaryWrite(message: NodeMatch, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* string external_id = 1; */
        if (message.externalId !== "")
            writer.tag(1, WireType.LengthDelimited).string(message.externalId);
        /* string type = 2; */
        if (message.type !== "")
            writer.tag(2, WireType.LengthDelimited).string(message.type);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message indykite.auditsink.v1beta1.NodeMatch
 */
export const NodeMatch = new NodeMatch$Type();
// @generated message type with reflection information, may provide speed optimized methods
class RelationMatch$Type extends MessageType<RelationMatch> {
    constructor() {
        super("indykite.auditsink.v1beta1.RelationMatch", [
            { no: 1, name: "source_match", kind: "message", T: () => NodeMatch },
            { no: 2, name: "target_match", kind: "message", T: () => NodeMatch },
            { no: 3, name: "type", kind: "scalar", T: 9 /*ScalarType.STRING*/ }
        ]);
    }
    create(value?: PartialMessage<RelationMatch>): RelationMatch {
        const message = { type: "" };
        globalThis.Object.defineProperty(message, MESSAGE_TYPE, { enumerable: false, value: this });
        if (value !== undefined)
            reflectionMergePartial<RelationMatch>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: RelationMatch): RelationMatch {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* indykite.auditsink.v1beta1.NodeMatch source_match */ 1:
                    message.sourceMatch = NodeMatch.internalBinaryRead(reader, reader.uint32(), options, message.sourceMatch);
                    break;
                case /* indykite.auditsink.v1beta1.NodeMatch target_match */ 2:
                    message.targetMatch = NodeMatch.internalBinaryRead(reader, reader.uint32(), options, message.targetMatch);
                    break;
                case /* string type */ 3:
                    message.type = reader.string();
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
    internalBinaryWrite(message: RelationMatch, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* indykite.auditsink.v1beta1.NodeMatch source_match = 1; */
        if (message.sourceMatch)
            NodeMatch.internalBinaryWrite(message.sourceMatch, writer.tag(1, WireType.LengthDelimited).fork(), options).join();
        /* indykite.auditsink.v1beta1.NodeMatch target_match = 2; */
        if (message.targetMatch)
            NodeMatch.internalBinaryWrite(message.targetMatch, writer.tag(2, WireType.LengthDelimited).fork(), options).join();
        /* string type = 3; */
        if (message.type !== "")
            writer.tag(3, WireType.LengthDelimited).string(message.type);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message indykite.auditsink.v1beta1.RelationMatch
 */
export const RelationMatch = new RelationMatch$Type();
