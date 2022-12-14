// @generated by protobuf-ts 2.4.0 with parameter long_type_string,client_grpc1,generate_dependencies,// @generated from protobuf file "indykite/objects/v1beta1/id.proto" (package "indykite.objects.v1beta1", syntax proto3),// tslint:disable
//
// Copyright (c) 2020 IndyKite
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
 * Identifier is a universally unique identifier (UUID) a 128-bit number used to identify information in system.
 *
 * @generated from protobuf message indykite.objects.v1beta1.Identifier
 */
export interface Identifier {
    /**
     * @generated from protobuf oneof: id
     */
    id: {
        oneofKind: "idString";
        /**
         * String representation of an RFC4122 compliant UUID.
         *
         * @generated from protobuf field: string id_string = 7;
         */
        idString: string;
    } | {
        oneofKind: "idBytes";
        /**
         * Byte[16] array representation of an RFC4122 compliant UUID.
         *
         * @generated from protobuf field: bytes id_bytes = 8;
         */
        idBytes: Uint8Array;
    } | {
        oneofKind: undefined;
    };
}
/**
 * ObjectReference ...
 *
 * @generated from protobuf message indykite.objects.v1beta1.ObjectReference
 */
export interface ObjectReference {
    /**
     * UUID of the top level Customer.
     *
     * @generated from protobuf field: indykite.objects.v1beta1.Identifier customer_id = 1;
     */
    customerId?: Identifier;
    /**
     * UUID of Application Space in Customer.
     *
     * @generated from protobuf field: indykite.objects.v1beta1.Identifier app_space_id = 2;
     */
    appSpaceId?: Identifier;
    /**
     * UUID of Application in Application Space.
     *
     * @generated from protobuf field: indykite.objects.v1beta1.Identifier app_id = 3;
     */
    appId?: Identifier;
    /**
     * UUID of Tenant in Application Space.
     *
     * @generated from protobuf field: indykite.objects.v1beta1.Identifier tenant_id = 4;
     */
    tenantId?: Identifier;
    /**
     * Gives a hint about what the identifier refers to. Usually a URL to the schema of the target object.
     *
     * @generated from protobuf field: string type_hint = 6;
     */
    typeHint: string;
    /**
     * UUID of Object to refer to.
     *
     * @generated from protobuf field: indykite.objects.v1beta1.Identifier id = 7;
     */
    id?: Identifier;
}
// @generated message type with reflection information, may provide speed optimized methods
class Identifier$Type extends MessageType<Identifier> {
    constructor() {
        super("indykite.objects.v1beta1.Identifier", [
            { no: 7, name: "id_string", kind: "scalar", oneof: "id", T: 9 /*ScalarType.STRING*/ },
            { no: 8, name: "id_bytes", kind: "scalar", oneof: "id", T: 12 /*ScalarType.BYTES*/ }
        ]);
    }
    create(value?: PartialMessage<Identifier>): Identifier {
        const message = { id: { oneofKind: undefined } };
        globalThis.Object.defineProperty(message, MESSAGE_TYPE, { enumerable: false, value: this });
        if (value !== undefined)
            reflectionMergePartial<Identifier>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: Identifier): Identifier {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* string id_string */ 7:
                    message.id = {
                        oneofKind: "idString",
                        idString: reader.string()
                    };
                    break;
                case /* bytes id_bytes */ 8:
                    message.id = {
                        oneofKind: "idBytes",
                        idBytes: reader.bytes()
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
    internalBinaryWrite(message: Identifier, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* string id_string = 7; */
        if (message.id.oneofKind === "idString")
            writer.tag(7, WireType.LengthDelimited).string(message.id.idString);
        /* bytes id_bytes = 8; */
        if (message.id.oneofKind === "idBytes")
            writer.tag(8, WireType.LengthDelimited).bytes(message.id.idBytes);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message indykite.objects.v1beta1.Identifier
 */
export const Identifier = new Identifier$Type();
// @generated message type with reflection information, may provide speed optimized methods
class ObjectReference$Type extends MessageType<ObjectReference> {
    constructor() {
        super("indykite.objects.v1beta1.ObjectReference", [
            { no: 1, name: "customer_id", kind: "message", T: () => Identifier },
            { no: 2, name: "app_space_id", kind: "message", T: () => Identifier },
            { no: 3, name: "app_id", kind: "message", T: () => Identifier },
            { no: 4, name: "tenant_id", kind: "message", T: () => Identifier },
            { no: 6, name: "type_hint", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 7, name: "id", kind: "message", T: () => Identifier }
        ]);
    }
    create(value?: PartialMessage<ObjectReference>): ObjectReference {
        const message = { typeHint: "" };
        globalThis.Object.defineProperty(message, MESSAGE_TYPE, { enumerable: false, value: this });
        if (value !== undefined)
            reflectionMergePartial<ObjectReference>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: ObjectReference): ObjectReference {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* indykite.objects.v1beta1.Identifier customer_id */ 1:
                    message.customerId = Identifier.internalBinaryRead(reader, reader.uint32(), options, message.customerId);
                    break;
                case /* indykite.objects.v1beta1.Identifier app_space_id */ 2:
                    message.appSpaceId = Identifier.internalBinaryRead(reader, reader.uint32(), options, message.appSpaceId);
                    break;
                case /* indykite.objects.v1beta1.Identifier app_id */ 3:
                    message.appId = Identifier.internalBinaryRead(reader, reader.uint32(), options, message.appId);
                    break;
                case /* indykite.objects.v1beta1.Identifier tenant_id */ 4:
                    message.tenantId = Identifier.internalBinaryRead(reader, reader.uint32(), options, message.tenantId);
                    break;
                case /* string type_hint */ 6:
                    message.typeHint = reader.string();
                    break;
                case /* indykite.objects.v1beta1.Identifier id */ 7:
                    message.id = Identifier.internalBinaryRead(reader, reader.uint32(), options, message.id);
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
    internalBinaryWrite(message: ObjectReference, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* indykite.objects.v1beta1.Identifier customer_id = 1; */
        if (message.customerId)
            Identifier.internalBinaryWrite(message.customerId, writer.tag(1, WireType.LengthDelimited).fork(), options).join();
        /* indykite.objects.v1beta1.Identifier app_space_id = 2; */
        if (message.appSpaceId)
            Identifier.internalBinaryWrite(message.appSpaceId, writer.tag(2, WireType.LengthDelimited).fork(), options).join();
        /* indykite.objects.v1beta1.Identifier app_id = 3; */
        if (message.appId)
            Identifier.internalBinaryWrite(message.appId, writer.tag(3, WireType.LengthDelimited).fork(), options).join();
        /* indykite.objects.v1beta1.Identifier tenant_id = 4; */
        if (message.tenantId)
            Identifier.internalBinaryWrite(message.tenantId, writer.tag(4, WireType.LengthDelimited).fork(), options).join();
        /* string type_hint = 6; */
        if (message.typeHint !== "")
            writer.tag(6, WireType.LengthDelimited).string(message.typeHint);
        /* indykite.objects.v1beta1.Identifier id = 7; */
        if (message.id)
            Identifier.internalBinaryWrite(message.id, writer.tag(7, WireType.LengthDelimited).fork(), options).join();
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message indykite.objects.v1beta1.ObjectReference
 */
export const ObjectReference = new ObjectReference$Type();