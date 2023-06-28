// @generated by protobuf-ts 2.9.0 with parameter long_type_string,client_grpc1,generate_dependencies
// @generated from protobuf file "indykite/identity/v1beta1/document.proto" (package "indykite.identity.v1beta1", syntax proto3)
// tslint:disable
//
// Copyright (c) 2021 IndyKite
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
import { ArrayValue } from "../../objects/v1beta1/struct";
import { Timestamp } from "../../../google/protobuf/timestamp";
import { Value } from "../../objects/v1beta1/struct";
/**
 * Document is an IndyKite document object.
 *
 * @generated from protobuf message indykite.identity.v1beta1.Document
 */
export interface Document {
    /**
     * Name of the document resource.
     * Format: `databases/{application_id}/documents/{document_path}`.
     *
     * @generated from protobuf field: string name = 1;
     */
    name: string;
    /**
     * Fields are the key/value pairs of the document.
     *
     * The map keys represent field names.
     *
     * @generated from protobuf field: map<string, indykite.objects.v1beta1.Value> fields = 2;
     */
    fields: {
        [key: string]: Value;
    };
    /**
     * CreateTime when the document was created.
     *
     * @generated from protobuf field: google.protobuf.Timestamp create_time = 3;
     */
    createTime?: Timestamp;
    /**
     * UpdateTime when the document was last changed.
     *
     * @generated from protobuf field: google.protobuf.Timestamp update_time = 4;
     */
    updateTime?: Timestamp;
}
/**
 * DocumentMask used to restrict a get or update operation on a document to a subset of its fields.
 *
 * @generated from protobuf message indykite.identity.v1beta1.DocumentMask
 */
export interface DocumentMask {
    /**
     * FieldPaths is a list of fields in the mask.
     *
     * @generated from protobuf field: repeated string field_paths = 1;
     */
    fieldPaths: string[];
}
/**
 * Precondition used for conditional operations on a Document.
 *
 * @generated from protobuf message indykite.identity.v1beta1.Precondition
 */
export interface Precondition {
    /**
     * @generated from protobuf oneof: condition_type
     */
    conditionType: {
        oneofKind: "exists";
        /**
         * Exists set to `true` when the target document must exist else set to `false`.
         *
         * @generated from protobuf field: bool exists = 1;
         */
        exists: boolean;
    } | {
        oneofKind: "updateTime";
        /**
         * UpdateTime when set, the target document must exist and have been last updated at that time.
         *
         * @generated from protobuf field: google.protobuf.Timestamp update_time = 2;
         */
        updateTime: Timestamp;
    } | {
        oneofKind: undefined;
    };
}
/**
 * Write is a single operation on a document.
 *
 * @generated from protobuf message indykite.identity.v1beta1.Write
 */
export interface Write {
    /**
     * @generated from protobuf oneof: operation
     */
    operation: {
        oneofKind: "update";
        /**
         * Document to write.
         *
         * @generated from protobuf field: indykite.identity.v1beta1.Document update = 1;
         */
        update: Document;
    } | {
        oneofKind: "delete";
        /**
         * Delete is a document name to delete.
         *
         * Format: `databases/{application_id}/documents/{document_path}`.
         *
         * @generated from protobuf field: string delete = 2;
         */
        delete: string;
    } | {
        oneofKind: "transform";
        /**
         * Transform represent a transformation to a document.
         *
         * @generated from protobuf field: indykite.identity.v1beta1.DocumentTransform transform = 6;
         */
        transform: DocumentTransform;
    } | {
        oneofKind: undefined;
    };
    /**
     * UpdateMask is the fields to update in this write.
     *
     * This field can be set only when the operation is `update`.
     * If the mask is not set for an `update` and the document exists, any
     * existing data will be overwritten.
     * If the mask is set and the document on the server has fields not covered by
     * the mask, they are left unchanged.
     * Fields referenced in the mask, but not present in the input document, are
     * deleted from the document on the server.
     *
     * @generated from protobuf field: indykite.identity.v1beta1.DocumentMask update_mask = 3;
     */
    updateMask?: DocumentMask;
    /**
     * UpdateTransforms represents the transforms to perform after update.
     *
     * This field can be set only when the operation is `update`.
     *
     * @generated from protobuf field: repeated indykite.identity.v1beta1.DocumentTransform.FieldTransform update_transforms = 7;
     */
    updateTransforms: DocumentTransform_FieldTransform[];
    /**
     * CurrentDocument is an optional precondition on the document.
     *
     * The write will fail if this is set and not met by the target document.
     *
     * @generated from protobuf field: indykite.identity.v1beta1.Precondition current_document = 4;
     */
    currentDocument?: Precondition;
}
/**
 * WriteResult represents the result of applying a write.
 *
 * @generated from protobuf message indykite.identity.v1beta1.WriteResult
 */
export interface WriteResult {
    /**
     * UpdateTime is the last update time of the document after applying the write.
     *
     * @generated from protobuf field: google.protobuf.Timestamp update_time = 1;
     */
    updateTime?: Timestamp;
}
/**
 * DocumentTransform represents the transformation of a document.
 *
 * @generated from protobuf message indykite.identity.v1beta1.DocumentTransform
 */
export interface DocumentTransform {
    /**
     * Document is the name of the document to transform.
     *
     * @generated from protobuf field: string document = 1;
     */
    document: string;
    /**
     * FieldTransforms is the list of transformations to apply to the fields of the document.
     *
     * @generated from protobuf field: repeated indykite.identity.v1beta1.DocumentTransform.FieldTransform field_transforms = 2;
     */
    fieldTransforms: DocumentTransform_FieldTransform[];
}
/**
 * FieldTransform represents the transformation of a field of the document.
 *
 * @generated from protobuf message indykite.identity.v1beta1.DocumentTransform.FieldTransform
 */
export interface DocumentTransform_FieldTransform {
    /**
     * FieldPath is the path of the field.
     *
     * @generated from protobuf field: string field_path = 1;
     */
    fieldPath: string;
    /**
     * @generated from protobuf oneof: transform_type
     */
    transformType: {
        oneofKind: "appendMissingElements";
        /**
         * AppendMissingElements transforms the field by appending the given elements in order
         * if they are not already present in the current field value.
         * If the field is not an array, or if the field does not yet exist, it is
         * first set to the empty array.
         *
         * Equivalent numbers of different types (e.g. 3L and 3.0) are
         * considered equal when checking if a value is missing.
         * NaN is equal to NaN, and Null is equal to Null.
         * If the input contains multiple equivalent values, only the first will
         * be considered.
         *
         * The corresponding transform_result will be the null value.
         *
         * @generated from protobuf field: indykite.objects.v1beta1.ArrayValue append_missing_elements = 6;
         */
        appendMissingElements: ArrayValue;
    } | {
        oneofKind: "removeAllFromArray";
        /**
         * remove_all_from_array Removes all of the given elements from the array in the field.
         * If the field is not an array, or if the field does not yet exist, it is
         * set to the empty array.
         *
         * @generated from protobuf field: indykite.objects.v1beta1.ArrayValue remove_all_from_array = 7;
         */
        removeAllFromArray: ArrayValue;
    } | {
        oneofKind: undefined;
    };
}
// @generated message type with reflection information, may provide speed optimized methods
class Document$Type extends MessageType<Document> {
    constructor() {
        super("indykite.identity.v1beta1.Document", [
            { no: 1, name: "name", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 2, name: "fields", kind: "map", K: 9 /*ScalarType.STRING*/, V: { kind: "message", T: () => Value } },
            { no: 3, name: "create_time", kind: "message", T: () => Timestamp },
            { no: 4, name: "update_time", kind: "message", T: () => Timestamp }
        ]);
    }
    create(value?: PartialMessage<Document>): Document {
        const message = { name: "", fields: {} };
        globalThis.Object.defineProperty(message, MESSAGE_TYPE, { enumerable: false, value: this });
        if (value !== undefined)
            reflectionMergePartial<Document>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: Document): Document {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* string name */ 1:
                    message.name = reader.string();
                    break;
                case /* map<string, indykite.objects.v1beta1.Value> fields */ 2:
                    this.binaryReadMap2(message.fields, reader, options);
                    break;
                case /* google.protobuf.Timestamp create_time */ 3:
                    message.createTime = Timestamp.internalBinaryRead(reader, reader.uint32(), options, message.createTime);
                    break;
                case /* google.protobuf.Timestamp update_time */ 4:
                    message.updateTime = Timestamp.internalBinaryRead(reader, reader.uint32(), options, message.updateTime);
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
    private binaryReadMap2(map: Document["fields"], reader: IBinaryReader, options: BinaryReadOptions): void {
        let len = reader.uint32(), end = reader.pos + len, key: keyof Document["fields"] | undefined, val: Document["fields"][any] | undefined;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case 1:
                    key = reader.string();
                    break;
                case 2:
                    val = Value.internalBinaryRead(reader, reader.uint32(), options);
                    break;
                default: throw new globalThis.Error("unknown map entry field for field indykite.identity.v1beta1.Document.fields");
            }
        }
        map[key ?? ""] = val ?? Value.create();
    }
    internalBinaryWrite(message: Document, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* string name = 1; */
        if (message.name !== "")
            writer.tag(1, WireType.LengthDelimited).string(message.name);
        /* map<string, indykite.objects.v1beta1.Value> fields = 2; */
        for (let k of Object.keys(message.fields)) {
            writer.tag(2, WireType.LengthDelimited).fork().tag(1, WireType.LengthDelimited).string(k);
            writer.tag(2, WireType.LengthDelimited).fork();
            Value.internalBinaryWrite(message.fields[k], writer, options);
            writer.join().join();
        }
        /* google.protobuf.Timestamp create_time = 3; */
        if (message.createTime)
            Timestamp.internalBinaryWrite(message.createTime, writer.tag(3, WireType.LengthDelimited).fork(), options).join();
        /* google.protobuf.Timestamp update_time = 4; */
        if (message.updateTime)
            Timestamp.internalBinaryWrite(message.updateTime, writer.tag(4, WireType.LengthDelimited).fork(), options).join();
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message indykite.identity.v1beta1.Document
 */
export const Document = new Document$Type();
// @generated message type with reflection information, may provide speed optimized methods
class DocumentMask$Type extends MessageType<DocumentMask> {
    constructor() {
        super("indykite.identity.v1beta1.DocumentMask", [
            { no: 1, name: "field_paths", kind: "scalar", repeat: 2 /*RepeatType.UNPACKED*/, T: 9 /*ScalarType.STRING*/ }
        ]);
    }
    create(value?: PartialMessage<DocumentMask>): DocumentMask {
        const message = { fieldPaths: [] };
        globalThis.Object.defineProperty(message, MESSAGE_TYPE, { enumerable: false, value: this });
        if (value !== undefined)
            reflectionMergePartial<DocumentMask>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: DocumentMask): DocumentMask {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* repeated string field_paths */ 1:
                    message.fieldPaths.push(reader.string());
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
    internalBinaryWrite(message: DocumentMask, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* repeated string field_paths = 1; */
        for (let i = 0; i < message.fieldPaths.length; i++)
            writer.tag(1, WireType.LengthDelimited).string(message.fieldPaths[i]);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message indykite.identity.v1beta1.DocumentMask
 */
export const DocumentMask = new DocumentMask$Type();
// @generated message type with reflection information, may provide speed optimized methods
class Precondition$Type extends MessageType<Precondition> {
    constructor() {
        super("indykite.identity.v1beta1.Precondition", [
            { no: 1, name: "exists", kind: "scalar", oneof: "conditionType", T: 8 /*ScalarType.BOOL*/ },
            { no: 2, name: "update_time", kind: "message", oneof: "conditionType", T: () => Timestamp }
        ]);
    }
    create(value?: PartialMessage<Precondition>): Precondition {
        const message = { conditionType: { oneofKind: undefined } };
        globalThis.Object.defineProperty(message, MESSAGE_TYPE, { enumerable: false, value: this });
        if (value !== undefined)
            reflectionMergePartial<Precondition>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: Precondition): Precondition {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* bool exists */ 1:
                    message.conditionType = {
                        oneofKind: "exists",
                        exists: reader.bool()
                    };
                    break;
                case /* google.protobuf.Timestamp update_time */ 2:
                    message.conditionType = {
                        oneofKind: "updateTime",
                        updateTime: Timestamp.internalBinaryRead(reader, reader.uint32(), options, (message.conditionType as any).updateTime)
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
    internalBinaryWrite(message: Precondition, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* bool exists = 1; */
        if (message.conditionType.oneofKind === "exists")
            writer.tag(1, WireType.Varint).bool(message.conditionType.exists);
        /* google.protobuf.Timestamp update_time = 2; */
        if (message.conditionType.oneofKind === "updateTime")
            Timestamp.internalBinaryWrite(message.conditionType.updateTime, writer.tag(2, WireType.LengthDelimited).fork(), options).join();
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message indykite.identity.v1beta1.Precondition
 */
export const Precondition = new Precondition$Type();
// @generated message type with reflection information, may provide speed optimized methods
class Write$Type extends MessageType<Write> {
    constructor() {
        super("indykite.identity.v1beta1.Write", [
            { no: 1, name: "update", kind: "message", oneof: "operation", T: () => Document },
            { no: 2, name: "delete", kind: "scalar", oneof: "operation", T: 9 /*ScalarType.STRING*/ },
            { no: 6, name: "transform", kind: "message", oneof: "operation", T: () => DocumentTransform },
            { no: 3, name: "update_mask", kind: "message", T: () => DocumentMask },
            { no: 7, name: "update_transforms", kind: "message", repeat: 1 /*RepeatType.PACKED*/, T: () => DocumentTransform_FieldTransform },
            { no: 4, name: "current_document", kind: "message", T: () => Precondition }
        ]);
    }
    create(value?: PartialMessage<Write>): Write {
        const message = { operation: { oneofKind: undefined }, updateTransforms: [] };
        globalThis.Object.defineProperty(message, MESSAGE_TYPE, { enumerable: false, value: this });
        if (value !== undefined)
            reflectionMergePartial<Write>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: Write): Write {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* indykite.identity.v1beta1.Document update */ 1:
                    message.operation = {
                        oneofKind: "update",
                        update: Document.internalBinaryRead(reader, reader.uint32(), options, (message.operation as any).update)
                    };
                    break;
                case /* string delete */ 2:
                    message.operation = {
                        oneofKind: "delete",
                        delete: reader.string()
                    };
                    break;
                case /* indykite.identity.v1beta1.DocumentTransform transform */ 6:
                    message.operation = {
                        oneofKind: "transform",
                        transform: DocumentTransform.internalBinaryRead(reader, reader.uint32(), options, (message.operation as any).transform)
                    };
                    break;
                case /* indykite.identity.v1beta1.DocumentMask update_mask */ 3:
                    message.updateMask = DocumentMask.internalBinaryRead(reader, reader.uint32(), options, message.updateMask);
                    break;
                case /* repeated indykite.identity.v1beta1.DocumentTransform.FieldTransform update_transforms */ 7:
                    message.updateTransforms.push(DocumentTransform_FieldTransform.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case /* indykite.identity.v1beta1.Precondition current_document */ 4:
                    message.currentDocument = Precondition.internalBinaryRead(reader, reader.uint32(), options, message.currentDocument);
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
    internalBinaryWrite(message: Write, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* indykite.identity.v1beta1.Document update = 1; */
        if (message.operation.oneofKind === "update")
            Document.internalBinaryWrite(message.operation.update, writer.tag(1, WireType.LengthDelimited).fork(), options).join();
        /* string delete = 2; */
        if (message.operation.oneofKind === "delete")
            writer.tag(2, WireType.LengthDelimited).string(message.operation.delete);
        /* indykite.identity.v1beta1.DocumentTransform transform = 6; */
        if (message.operation.oneofKind === "transform")
            DocumentTransform.internalBinaryWrite(message.operation.transform, writer.tag(6, WireType.LengthDelimited).fork(), options).join();
        /* indykite.identity.v1beta1.DocumentMask update_mask = 3; */
        if (message.updateMask)
            DocumentMask.internalBinaryWrite(message.updateMask, writer.tag(3, WireType.LengthDelimited).fork(), options).join();
        /* repeated indykite.identity.v1beta1.DocumentTransform.FieldTransform update_transforms = 7; */
        for (let i = 0; i < message.updateTransforms.length; i++)
            DocumentTransform_FieldTransform.internalBinaryWrite(message.updateTransforms[i], writer.tag(7, WireType.LengthDelimited).fork(), options).join();
        /* indykite.identity.v1beta1.Precondition current_document = 4; */
        if (message.currentDocument)
            Precondition.internalBinaryWrite(message.currentDocument, writer.tag(4, WireType.LengthDelimited).fork(), options).join();
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message indykite.identity.v1beta1.Write
 */
export const Write = new Write$Type();
// @generated message type with reflection information, may provide speed optimized methods
class WriteResult$Type extends MessageType<WriteResult> {
    constructor() {
        super("indykite.identity.v1beta1.WriteResult", [
            { no: 1, name: "update_time", kind: "message", T: () => Timestamp }
        ]);
    }
    create(value?: PartialMessage<WriteResult>): WriteResult {
        const message = {};
        globalThis.Object.defineProperty(message, MESSAGE_TYPE, { enumerable: false, value: this });
        if (value !== undefined)
            reflectionMergePartial<WriteResult>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: WriteResult): WriteResult {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* google.protobuf.Timestamp update_time */ 1:
                    message.updateTime = Timestamp.internalBinaryRead(reader, reader.uint32(), options, message.updateTime);
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
    internalBinaryWrite(message: WriteResult, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* google.protobuf.Timestamp update_time = 1; */
        if (message.updateTime)
            Timestamp.internalBinaryWrite(message.updateTime, writer.tag(1, WireType.LengthDelimited).fork(), options).join();
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message indykite.identity.v1beta1.WriteResult
 */
export const WriteResult = new WriteResult$Type();
// @generated message type with reflection information, may provide speed optimized methods
class DocumentTransform$Type extends MessageType<DocumentTransform> {
    constructor() {
        super("indykite.identity.v1beta1.DocumentTransform", [
            { no: 1, name: "document", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 2, name: "field_transforms", kind: "message", repeat: 1 /*RepeatType.PACKED*/, T: () => DocumentTransform_FieldTransform }
        ]);
    }
    create(value?: PartialMessage<DocumentTransform>): DocumentTransform {
        const message = { document: "", fieldTransforms: [] };
        globalThis.Object.defineProperty(message, MESSAGE_TYPE, { enumerable: false, value: this });
        if (value !== undefined)
            reflectionMergePartial<DocumentTransform>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: DocumentTransform): DocumentTransform {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* string document */ 1:
                    message.document = reader.string();
                    break;
                case /* repeated indykite.identity.v1beta1.DocumentTransform.FieldTransform field_transforms */ 2:
                    message.fieldTransforms.push(DocumentTransform_FieldTransform.internalBinaryRead(reader, reader.uint32(), options));
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
    internalBinaryWrite(message: DocumentTransform, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* string document = 1; */
        if (message.document !== "")
            writer.tag(1, WireType.LengthDelimited).string(message.document);
        /* repeated indykite.identity.v1beta1.DocumentTransform.FieldTransform field_transforms = 2; */
        for (let i = 0; i < message.fieldTransforms.length; i++)
            DocumentTransform_FieldTransform.internalBinaryWrite(message.fieldTransforms[i], writer.tag(2, WireType.LengthDelimited).fork(), options).join();
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message indykite.identity.v1beta1.DocumentTransform
 */
export const DocumentTransform = new DocumentTransform$Type();
// @generated message type with reflection information, may provide speed optimized methods
class DocumentTransform_FieldTransform$Type extends MessageType<DocumentTransform_FieldTransform> {
    constructor() {
        super("indykite.identity.v1beta1.DocumentTransform.FieldTransform", [
            { no: 1, name: "field_path", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 6, name: "append_missing_elements", kind: "message", oneof: "transformType", T: () => ArrayValue },
            { no: 7, name: "remove_all_from_array", kind: "message", oneof: "transformType", T: () => ArrayValue }
        ]);
    }
    create(value?: PartialMessage<DocumentTransform_FieldTransform>): DocumentTransform_FieldTransform {
        const message = { fieldPath: "", transformType: { oneofKind: undefined } };
        globalThis.Object.defineProperty(message, MESSAGE_TYPE, { enumerable: false, value: this });
        if (value !== undefined)
            reflectionMergePartial<DocumentTransform_FieldTransform>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: DocumentTransform_FieldTransform): DocumentTransform_FieldTransform {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* string field_path */ 1:
                    message.fieldPath = reader.string();
                    break;
                case /* indykite.objects.v1beta1.ArrayValue append_missing_elements */ 6:
                    message.transformType = {
                        oneofKind: "appendMissingElements",
                        appendMissingElements: ArrayValue.internalBinaryRead(reader, reader.uint32(), options, (message.transformType as any).appendMissingElements)
                    };
                    break;
                case /* indykite.objects.v1beta1.ArrayValue remove_all_from_array */ 7:
                    message.transformType = {
                        oneofKind: "removeAllFromArray",
                        removeAllFromArray: ArrayValue.internalBinaryRead(reader, reader.uint32(), options, (message.transformType as any).removeAllFromArray)
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
    internalBinaryWrite(message: DocumentTransform_FieldTransform, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* string field_path = 1; */
        if (message.fieldPath !== "")
            writer.tag(1, WireType.LengthDelimited).string(message.fieldPath);
        /* indykite.objects.v1beta1.ArrayValue append_missing_elements = 6; */
        if (message.transformType.oneofKind === "appendMissingElements")
            ArrayValue.internalBinaryWrite(message.transformType.appendMissingElements, writer.tag(6, WireType.LengthDelimited).fork(), options).join();
        /* indykite.objects.v1beta1.ArrayValue remove_all_from_array = 7; */
        if (message.transformType.oneofKind === "removeAllFromArray")
            ArrayValue.internalBinaryWrite(message.transformType.removeAllFromArray, writer.tag(7, WireType.LengthDelimited).fork(), options).join();
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message indykite.identity.v1beta1.DocumentTransform.FieldTransform
 */
export const DocumentTransform_FieldTransform = new DocumentTransform_FieldTransform$Type();
