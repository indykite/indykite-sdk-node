/* eslint-disable */
import { util, configure, Writer, Reader } from "protobufjs/minimal";
import * as Long from "long";
import { Value, ArrayValue } from "../../../indykite/objects/v1beta1/struct";
import { Timestamp } from "../../../google/protobuf/timestamp";

export const protobufPackage = "indykite.identity.v1beta1";

/** Document is an IndyKite document object. */
export interface Document {
  /**
   * Name of the document resource.
   * Format: `databases/{application_id}/documents/{document_path}`.
   */
  name: string;
  /**
   * Fields are the key/value pairs of the document.
   *
   * The map keys represent field names.
   */
  fields: { [key: string]: Value };
  /** CreateTime when the document was created. */
  createTime?: Date;
  /** UpdateTime when the document was last changed. */
  updateTime?: Date;
}

export interface Document_FieldsEntry {
  key: string;
  value?: Value;
}

/** DocumentMask used to restrict a get or update operation on a document to a subset of its fields. */
export interface DocumentMask {
  /** FieldPaths is a list of fields in the mask. */
  fieldPaths: string[];
}

/** Precondition used for conditional operations on a Document. */
export interface Precondition {
  conditionType?:
    | { $case: "exists"; exists: boolean }
    | { $case: "updateTime"; updateTime: Date };
}

/** Write is a single operation on a document. */
export interface Write {
  operation?:
    | { $case: "update"; update: Document }
    | { $case: "delete"; delete: string }
    | { $case: "transform"; transform: DocumentTransform };
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
   */
  updateMask?: DocumentMask;
  /**
   * UpdateTransforms represents the transforms to perform after update.
   *
   * This field can be set only when the operation is `update`.
   */
  updateTransforms: DocumentTransform_FieldTransform[];
  /**
   * CurrentDocument is an optional precondition on the document.
   *
   * The write will fail if this is set and not met by the target document.
   */
  currentDocument?: Precondition;
}

/** WriteResult represents the result of applying a write. */
export interface WriteResult {
  /** UpdateTime is the last update time of the document after applying the write. */
  updateTime?: Date;
}

/** DocumentTransform represents the transformation of a document. */
export interface DocumentTransform {
  /** Document is the name of the document to transform. */
  document: string;
  /** FieldTransforms is the list of transformations to apply to the fields of the document. */
  fieldTransforms: DocumentTransform_FieldTransform[];
}

/** FieldTransform represents the transformation of a field of the document. */
export interface DocumentTransform_FieldTransform {
  /** FieldPath is the path of the field. */
  fieldPath: string;
  transformType?:
    | { $case: "appendMissingElements"; appendMissingElements: ArrayValue }
    | { $case: "removeAllFromArray"; removeAllFromArray: ArrayValue };
}

const baseDocument: object = { name: "" };

export const Document = {
  encode(message: Document, writer: Writer = Writer.create()): Writer {
    if (message.name !== "") {
      writer.uint32(10).string(message.name);
    }
    Object.entries(message.fields).forEach(([key, value]) => {
      Document_FieldsEntry.encode(
        { key: key as any, value },
        writer.uint32(18).fork()
      ).ldelim();
    });
    if (message.createTime !== undefined) {
      Timestamp.encode(
        toTimestamp(message.createTime),
        writer.uint32(26).fork()
      ).ldelim();
    }
    if (message.updateTime !== undefined) {
      Timestamp.encode(
        toTimestamp(message.updateTime),
        writer.uint32(34).fork()
      ).ldelim();
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): Document {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseDocument } as Document;
    message.fields = {};
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.name = reader.string();
          break;
        case 2:
          const entry2 = Document_FieldsEntry.decode(reader, reader.uint32());
          if (entry2.value !== undefined) {
            message.fields[entry2.key] = entry2.value;
          }
          break;
        case 3:
          message.createTime = fromTimestamp(
            Timestamp.decode(reader, reader.uint32())
          );
          break;
        case 4:
          message.updateTime = fromTimestamp(
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

  fromJSON(object: any): Document {
    const message = { ...baseDocument } as Document;
    message.fields = {};
    if (object.name !== undefined && object.name !== null) {
      message.name = String(object.name);
    }
    if (object.fields !== undefined && object.fields !== null) {
      Object.entries(object.fields).forEach(([key, value]) => {
        message.fields[key] = Value.fromJSON(value);
      });
    }
    if (object.createTime !== undefined && object.createTime !== null) {
      message.createTime = fromJsonTimestamp(object.createTime);
    }
    if (object.updateTime !== undefined && object.updateTime !== null) {
      message.updateTime = fromJsonTimestamp(object.updateTime);
    }
    return message;
  },

  toJSON(message: Document): unknown {
    const obj: any = {};
    message.name !== undefined && (obj.name = message.name);
    obj.fields = {};
    if (message.fields) {
      Object.entries(message.fields).forEach(([k, v]) => {
        obj.fields[k] = Value.toJSON(v);
      });
    }
    message.createTime !== undefined &&
      (obj.createTime = message.createTime.toISOString());
    message.updateTime !== undefined &&
      (obj.updateTime = message.updateTime.toISOString());
    return obj;
  },

  fromPartial(object: DeepPartial<Document>): Document {
    const message = { ...baseDocument } as Document;
    message.fields = {};
    if (object.name !== undefined && object.name !== null) {
      message.name = object.name;
    }
    if (object.fields !== undefined && object.fields !== null) {
      Object.entries(object.fields).forEach(([key, value]) => {
        if (value !== undefined) {
          message.fields[key] = Value.fromPartial(value);
        }
      });
    }
    if (object.createTime !== undefined && object.createTime !== null) {
      message.createTime = object.createTime;
    }
    if (object.updateTime !== undefined && object.updateTime !== null) {
      message.updateTime = object.updateTime;
    }
    return message;
  },
};

const baseDocument_FieldsEntry: object = { key: "" };

export const Document_FieldsEntry = {
  encode(
    message: Document_FieldsEntry,
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

  decode(input: Reader | Uint8Array, length?: number): Document_FieldsEntry {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseDocument_FieldsEntry } as Document_FieldsEntry;
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

  fromJSON(object: any): Document_FieldsEntry {
    const message = { ...baseDocument_FieldsEntry } as Document_FieldsEntry;
    if (object.key !== undefined && object.key !== null) {
      message.key = String(object.key);
    }
    if (object.value !== undefined && object.value !== null) {
      message.value = Value.fromJSON(object.value);
    }
    return message;
  },

  toJSON(message: Document_FieldsEntry): unknown {
    const obj: any = {};
    message.key !== undefined && (obj.key = message.key);
    message.value !== undefined &&
      (obj.value = message.value ? Value.toJSON(message.value) : undefined);
    return obj;
  },

  fromPartial(object: DeepPartial<Document_FieldsEntry>): Document_FieldsEntry {
    const message = { ...baseDocument_FieldsEntry } as Document_FieldsEntry;
    if (object.key !== undefined && object.key !== null) {
      message.key = object.key;
    }
    if (object.value !== undefined && object.value !== null) {
      message.value = Value.fromPartial(object.value);
    }
    return message;
  },
};

const baseDocumentMask: object = { fieldPaths: "" };

export const DocumentMask = {
  encode(message: DocumentMask, writer: Writer = Writer.create()): Writer {
    for (const v of message.fieldPaths) {
      writer.uint32(10).string(v!);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): DocumentMask {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseDocumentMask } as DocumentMask;
    message.fieldPaths = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.fieldPaths.push(reader.string());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): DocumentMask {
    const message = { ...baseDocumentMask } as DocumentMask;
    message.fieldPaths = [];
    if (object.fieldPaths !== undefined && object.fieldPaths !== null) {
      for (const e of object.fieldPaths) {
        message.fieldPaths.push(String(e));
      }
    }
    return message;
  },

  toJSON(message: DocumentMask): unknown {
    const obj: any = {};
    if (message.fieldPaths) {
      obj.fieldPaths = message.fieldPaths.map((e) => e);
    } else {
      obj.fieldPaths = [];
    }
    return obj;
  },

  fromPartial(object: DeepPartial<DocumentMask>): DocumentMask {
    const message = { ...baseDocumentMask } as DocumentMask;
    message.fieldPaths = [];
    if (object.fieldPaths !== undefined && object.fieldPaths !== null) {
      for (const e of object.fieldPaths) {
        message.fieldPaths.push(e);
      }
    }
    return message;
  },
};

const basePrecondition: object = {};

export const Precondition = {
  encode(message: Precondition, writer: Writer = Writer.create()): Writer {
    if (message.conditionType?.$case === "exists") {
      writer.uint32(8).bool(message.conditionType.exists);
    }
    if (message.conditionType?.$case === "updateTime") {
      Timestamp.encode(
        toTimestamp(message.conditionType.updateTime),
        writer.uint32(18).fork()
      ).ldelim();
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): Precondition {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...basePrecondition } as Precondition;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.conditionType = { $case: "exists", exists: reader.bool() };
          break;
        case 2:
          message.conditionType = {
            $case: "updateTime",
            updateTime: fromTimestamp(
              Timestamp.decode(reader, reader.uint32())
            ),
          };
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Precondition {
    const message = { ...basePrecondition } as Precondition;
    if (object.exists !== undefined && object.exists !== null) {
      message.conditionType = {
        $case: "exists",
        exists: Boolean(object.exists),
      };
    }
    if (object.updateTime !== undefined && object.updateTime !== null) {
      message.conditionType = {
        $case: "updateTime",
        updateTime: fromJsonTimestamp(object.updateTime),
      };
    }
    return message;
  },

  toJSON(message: Precondition): unknown {
    const obj: any = {};
    message.conditionType?.$case === "exists" &&
      (obj.exists = message.conditionType?.exists);
    message.conditionType?.$case === "updateTime" &&
      (obj.updateTime = message.conditionType?.updateTime.toISOString());
    return obj;
  },

  fromPartial(object: DeepPartial<Precondition>): Precondition {
    const message = { ...basePrecondition } as Precondition;
    if (
      object.conditionType?.$case === "exists" &&
      object.conditionType?.exists !== undefined &&
      object.conditionType?.exists !== null
    ) {
      message.conditionType = {
        $case: "exists",
        exists: object.conditionType.exists,
      };
    }
    if (
      object.conditionType?.$case === "updateTime" &&
      object.conditionType?.updateTime !== undefined &&
      object.conditionType?.updateTime !== null
    ) {
      message.conditionType = {
        $case: "updateTime",
        updateTime: object.conditionType.updateTime,
      };
    }
    return message;
  },
};

const baseWrite: object = {};

export const Write = {
  encode(message: Write, writer: Writer = Writer.create()): Writer {
    if (message.operation?.$case === "update") {
      Document.encode(
        message.operation.update,
        writer.uint32(10).fork()
      ).ldelim();
    }
    if (message.operation?.$case === "delete") {
      writer.uint32(18).string(message.operation.delete);
    }
    if (message.operation?.$case === "transform") {
      DocumentTransform.encode(
        message.operation.transform,
        writer.uint32(50).fork()
      ).ldelim();
    }
    if (message.updateMask !== undefined) {
      DocumentMask.encode(
        message.updateMask,
        writer.uint32(26).fork()
      ).ldelim();
    }
    for (const v of message.updateTransforms) {
      DocumentTransform_FieldTransform.encode(
        v!,
        writer.uint32(58).fork()
      ).ldelim();
    }
    if (message.currentDocument !== undefined) {
      Precondition.encode(
        message.currentDocument,
        writer.uint32(34).fork()
      ).ldelim();
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): Write {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseWrite } as Write;
    message.updateTransforms = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.operation = {
            $case: "update",
            update: Document.decode(reader, reader.uint32()),
          };
          break;
        case 2:
          message.operation = { $case: "delete", delete: reader.string() };
          break;
        case 6:
          message.operation = {
            $case: "transform",
            transform: DocumentTransform.decode(reader, reader.uint32()),
          };
          break;
        case 3:
          message.updateMask = DocumentMask.decode(reader, reader.uint32());
          break;
        case 7:
          message.updateTransforms.push(
            DocumentTransform_FieldTransform.decode(reader, reader.uint32())
          );
          break;
        case 4:
          message.currentDocument = Precondition.decode(
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

  fromJSON(object: any): Write {
    const message = { ...baseWrite } as Write;
    message.updateTransforms = [];
    if (object.update !== undefined && object.update !== null) {
      message.operation = {
        $case: "update",
        update: Document.fromJSON(object.update),
      };
    }
    if (object.delete !== undefined && object.delete !== null) {
      message.operation = { $case: "delete", delete: String(object.delete) };
    }
    if (object.transform !== undefined && object.transform !== null) {
      message.operation = {
        $case: "transform",
        transform: DocumentTransform.fromJSON(object.transform),
      };
    }
    if (object.updateMask !== undefined && object.updateMask !== null) {
      message.updateMask = DocumentMask.fromJSON(object.updateMask);
    }
    if (
      object.updateTransforms !== undefined &&
      object.updateTransforms !== null
    ) {
      for (const e of object.updateTransforms) {
        message.updateTransforms.push(
          DocumentTransform_FieldTransform.fromJSON(e)
        );
      }
    }
    if (
      object.currentDocument !== undefined &&
      object.currentDocument !== null
    ) {
      message.currentDocument = Precondition.fromJSON(object.currentDocument);
    }
    return message;
  },

  toJSON(message: Write): unknown {
    const obj: any = {};
    message.operation?.$case === "update" &&
      (obj.update = message.operation?.update
        ? Document.toJSON(message.operation?.update)
        : undefined);
    message.operation?.$case === "delete" &&
      (obj.delete = message.operation?.delete);
    message.operation?.$case === "transform" &&
      (obj.transform = message.operation?.transform
        ? DocumentTransform.toJSON(message.operation?.transform)
        : undefined);
    message.updateMask !== undefined &&
      (obj.updateMask = message.updateMask
        ? DocumentMask.toJSON(message.updateMask)
        : undefined);
    if (message.updateTransforms) {
      obj.updateTransforms = message.updateTransforms.map((e) =>
        e ? DocumentTransform_FieldTransform.toJSON(e) : undefined
      );
    } else {
      obj.updateTransforms = [];
    }
    message.currentDocument !== undefined &&
      (obj.currentDocument = message.currentDocument
        ? Precondition.toJSON(message.currentDocument)
        : undefined);
    return obj;
  },

  fromPartial(object: DeepPartial<Write>): Write {
    const message = { ...baseWrite } as Write;
    message.updateTransforms = [];
    if (
      object.operation?.$case === "update" &&
      object.operation?.update !== undefined &&
      object.operation?.update !== null
    ) {
      message.operation = {
        $case: "update",
        update: Document.fromPartial(object.operation.update),
      };
    }
    if (
      object.operation?.$case === "delete" &&
      object.operation?.delete !== undefined &&
      object.operation?.delete !== null
    ) {
      message.operation = { $case: "delete", delete: object.operation.delete };
    }
    if (
      object.operation?.$case === "transform" &&
      object.operation?.transform !== undefined &&
      object.operation?.transform !== null
    ) {
      message.operation = {
        $case: "transform",
        transform: DocumentTransform.fromPartial(object.operation.transform),
      };
    }
    if (object.updateMask !== undefined && object.updateMask !== null) {
      message.updateMask = DocumentMask.fromPartial(object.updateMask);
    }
    if (
      object.updateTransforms !== undefined &&
      object.updateTransforms !== null
    ) {
      for (const e of object.updateTransforms) {
        message.updateTransforms.push(
          DocumentTransform_FieldTransform.fromPartial(e)
        );
      }
    }
    if (
      object.currentDocument !== undefined &&
      object.currentDocument !== null
    ) {
      message.currentDocument = Precondition.fromPartial(
        object.currentDocument
      );
    }
    return message;
  },
};

const baseWriteResult: object = {};

export const WriteResult = {
  encode(message: WriteResult, writer: Writer = Writer.create()): Writer {
    if (message.updateTime !== undefined) {
      Timestamp.encode(
        toTimestamp(message.updateTime),
        writer.uint32(10).fork()
      ).ldelim();
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): WriteResult {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseWriteResult } as WriteResult;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.updateTime = fromTimestamp(
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

  fromJSON(object: any): WriteResult {
    const message = { ...baseWriteResult } as WriteResult;
    if (object.updateTime !== undefined && object.updateTime !== null) {
      message.updateTime = fromJsonTimestamp(object.updateTime);
    }
    return message;
  },

  toJSON(message: WriteResult): unknown {
    const obj: any = {};
    message.updateTime !== undefined &&
      (obj.updateTime = message.updateTime.toISOString());
    return obj;
  },

  fromPartial(object: DeepPartial<WriteResult>): WriteResult {
    const message = { ...baseWriteResult } as WriteResult;
    if (object.updateTime !== undefined && object.updateTime !== null) {
      message.updateTime = object.updateTime;
    }
    return message;
  },
};

const baseDocumentTransform: object = { document: "" };

export const DocumentTransform = {
  encode(message: DocumentTransform, writer: Writer = Writer.create()): Writer {
    if (message.document !== "") {
      writer.uint32(10).string(message.document);
    }
    for (const v of message.fieldTransforms) {
      DocumentTransform_FieldTransform.encode(
        v!,
        writer.uint32(18).fork()
      ).ldelim();
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): DocumentTransform {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseDocumentTransform } as DocumentTransform;
    message.fieldTransforms = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.document = reader.string();
          break;
        case 2:
          message.fieldTransforms.push(
            DocumentTransform_FieldTransform.decode(reader, reader.uint32())
          );
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): DocumentTransform {
    const message = { ...baseDocumentTransform } as DocumentTransform;
    message.fieldTransforms = [];
    if (object.document !== undefined && object.document !== null) {
      message.document = String(object.document);
    }
    if (
      object.fieldTransforms !== undefined &&
      object.fieldTransforms !== null
    ) {
      for (const e of object.fieldTransforms) {
        message.fieldTransforms.push(
          DocumentTransform_FieldTransform.fromJSON(e)
        );
      }
    }
    return message;
  },

  toJSON(message: DocumentTransform): unknown {
    const obj: any = {};
    message.document !== undefined && (obj.document = message.document);
    if (message.fieldTransforms) {
      obj.fieldTransforms = message.fieldTransforms.map((e) =>
        e ? DocumentTransform_FieldTransform.toJSON(e) : undefined
      );
    } else {
      obj.fieldTransforms = [];
    }
    return obj;
  },

  fromPartial(object: DeepPartial<DocumentTransform>): DocumentTransform {
    const message = { ...baseDocumentTransform } as DocumentTransform;
    message.fieldTransforms = [];
    if (object.document !== undefined && object.document !== null) {
      message.document = object.document;
    }
    if (
      object.fieldTransforms !== undefined &&
      object.fieldTransforms !== null
    ) {
      for (const e of object.fieldTransforms) {
        message.fieldTransforms.push(
          DocumentTransform_FieldTransform.fromPartial(e)
        );
      }
    }
    return message;
  },
};

const baseDocumentTransform_FieldTransform: object = { fieldPath: "" };

export const DocumentTransform_FieldTransform = {
  encode(
    message: DocumentTransform_FieldTransform,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.fieldPath !== "") {
      writer.uint32(10).string(message.fieldPath);
    }
    if (message.transformType?.$case === "appendMissingElements") {
      ArrayValue.encode(
        message.transformType.appendMissingElements,
        writer.uint32(50).fork()
      ).ldelim();
    }
    if (message.transformType?.$case === "removeAllFromArray") {
      ArrayValue.encode(
        message.transformType.removeAllFromArray,
        writer.uint32(58).fork()
      ).ldelim();
    }
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): DocumentTransform_FieldTransform {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseDocumentTransform_FieldTransform,
    } as DocumentTransform_FieldTransform;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.fieldPath = reader.string();
          break;
        case 6:
          message.transformType = {
            $case: "appendMissingElements",
            appendMissingElements: ArrayValue.decode(reader, reader.uint32()),
          };
          break;
        case 7:
          message.transformType = {
            $case: "removeAllFromArray",
            removeAllFromArray: ArrayValue.decode(reader, reader.uint32()),
          };
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): DocumentTransform_FieldTransform {
    const message = {
      ...baseDocumentTransform_FieldTransform,
    } as DocumentTransform_FieldTransform;
    if (object.fieldPath !== undefined && object.fieldPath !== null) {
      message.fieldPath = String(object.fieldPath);
    }
    if (
      object.appendMissingElements !== undefined &&
      object.appendMissingElements !== null
    ) {
      message.transformType = {
        $case: "appendMissingElements",
        appendMissingElements: ArrayValue.fromJSON(
          object.appendMissingElements
        ),
      };
    }
    if (
      object.removeAllFromArray !== undefined &&
      object.removeAllFromArray !== null
    ) {
      message.transformType = {
        $case: "removeAllFromArray",
        removeAllFromArray: ArrayValue.fromJSON(object.removeAllFromArray),
      };
    }
    return message;
  },

  toJSON(message: DocumentTransform_FieldTransform): unknown {
    const obj: any = {};
    message.fieldPath !== undefined && (obj.fieldPath = message.fieldPath);
    message.transformType?.$case === "appendMissingElements" &&
      (obj.appendMissingElements = message.transformType?.appendMissingElements
        ? ArrayValue.toJSON(message.transformType?.appendMissingElements)
        : undefined);
    message.transformType?.$case === "removeAllFromArray" &&
      (obj.removeAllFromArray = message.transformType?.removeAllFromArray
        ? ArrayValue.toJSON(message.transformType?.removeAllFromArray)
        : undefined);
    return obj;
  },

  fromPartial(
    object: DeepPartial<DocumentTransform_FieldTransform>
  ): DocumentTransform_FieldTransform {
    const message = {
      ...baseDocumentTransform_FieldTransform,
    } as DocumentTransform_FieldTransform;
    if (object.fieldPath !== undefined && object.fieldPath !== null) {
      message.fieldPath = object.fieldPath;
    }
    if (
      object.transformType?.$case === "appendMissingElements" &&
      object.transformType?.appendMissingElements !== undefined &&
      object.transformType?.appendMissingElements !== null
    ) {
      message.transformType = {
        $case: "appendMissingElements",
        appendMissingElements: ArrayValue.fromPartial(
          object.transformType.appendMissingElements
        ),
      };
    }
    if (
      object.transformType?.$case === "removeAllFromArray" &&
      object.transformType?.removeAllFromArray !== undefined &&
      object.transformType?.removeAllFromArray !== null
    ) {
      message.transformType = {
        $case: "removeAllFromArray",
        removeAllFromArray: ArrayValue.fromPartial(
          object.transformType.removeAllFromArray
        ),
      };
    }
    return message;
  },
};

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
