/* eslint-disable */
import { util, configure, Writer, Reader } from "protobufjs/minimal";
import * as Long from "long";

export const protobufPackage = "indykite.identity.v1beta1";

export interface AuthenteqDetails {
  id: string;
  documentData?: AuthenteqDocumentData;
}

export interface AuthenteqDocumentData {
  documentType: string;
  documentNumber: string;
  issuingCountry: string;
  jurisdiction: string;
  nationality: string;
  surnameAndGivenNames: string;
  surname: string;
  givenNames: string;
  nameSuffixes: string;
  namePrefixes: string;
  sex: string;
  dateOfBirth: string;
  dateOfExpiry: string;
  dateOfIssue: string;
  licenseClass: string;
  licenseClassDetails: { [key: string]: LicenseClassDetails };
  croppedFrontImage?: WebImage;
  croppedBackImage?: WebImage;
  faceImage?: WebImage;
}

export interface AuthenteqDocumentData_LicenseClassDetailsEntry {
  key: string;
  value?: LicenseClassDetails;
}

export interface LicenseClassDetails {
  from: string;
  to: string;
  notes: string;
}

export interface WebImage {
  contentType: string;
  content: string;
}

const baseAuthenteqDetails: object = { id: "" };

export const AuthenteqDetails = {
  encode(message: AuthenteqDetails, writer: Writer = Writer.create()): Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.documentData !== undefined) {
      AuthenteqDocumentData.encode(
        message.documentData,
        writer.uint32(34).fork()
      ).ldelim();
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): AuthenteqDetails {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseAuthenteqDetails } as AuthenteqDetails;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string();
          break;
        case 4:
          message.documentData = AuthenteqDocumentData.decode(
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

  fromJSON(object: any): AuthenteqDetails {
    const message = { ...baseAuthenteqDetails } as AuthenteqDetails;
    if (object.id !== undefined && object.id !== null) {
      message.id = String(object.id);
    }
    if (object.documentData !== undefined && object.documentData !== null) {
      message.documentData = AuthenteqDocumentData.fromJSON(
        object.documentData
      );
    }
    return message;
  },

  toJSON(message: AuthenteqDetails): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    message.documentData !== undefined &&
      (obj.documentData = message.documentData
        ? AuthenteqDocumentData.toJSON(message.documentData)
        : undefined);
    return obj;
  },

  fromPartial(object: DeepPartial<AuthenteqDetails>): AuthenteqDetails {
    const message = { ...baseAuthenteqDetails } as AuthenteqDetails;
    if (object.id !== undefined && object.id !== null) {
      message.id = object.id;
    }
    if (object.documentData !== undefined && object.documentData !== null) {
      message.documentData = AuthenteqDocumentData.fromPartial(
        object.documentData
      );
    }
    return message;
  },
};

const baseAuthenteqDocumentData: object = {
  documentType: "",
  documentNumber: "",
  issuingCountry: "",
  jurisdiction: "",
  nationality: "",
  surnameAndGivenNames: "",
  surname: "",
  givenNames: "",
  nameSuffixes: "",
  namePrefixes: "",
  sex: "",
  dateOfBirth: "",
  dateOfExpiry: "",
  dateOfIssue: "",
  licenseClass: "",
};

export const AuthenteqDocumentData = {
  encode(
    message: AuthenteqDocumentData,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.documentType !== "") {
      writer.uint32(10).string(message.documentType);
    }
    if (message.documentNumber !== "") {
      writer.uint32(18).string(message.documentNumber);
    }
    if (message.issuingCountry !== "") {
      writer.uint32(26).string(message.issuingCountry);
    }
    if (message.jurisdiction !== "") {
      writer.uint32(34).string(message.jurisdiction);
    }
    if (message.nationality !== "") {
      writer.uint32(42).string(message.nationality);
    }
    if (message.surnameAndGivenNames !== "") {
      writer.uint32(50).string(message.surnameAndGivenNames);
    }
    if (message.surname !== "") {
      writer.uint32(58).string(message.surname);
    }
    if (message.givenNames !== "") {
      writer.uint32(66).string(message.givenNames);
    }
    if (message.nameSuffixes !== "") {
      writer.uint32(74).string(message.nameSuffixes);
    }
    if (message.namePrefixes !== "") {
      writer.uint32(82).string(message.namePrefixes);
    }
    if (message.sex !== "") {
      writer.uint32(90).string(message.sex);
    }
    if (message.dateOfBirth !== "") {
      writer.uint32(98).string(message.dateOfBirth);
    }
    if (message.dateOfExpiry !== "") {
      writer.uint32(106).string(message.dateOfExpiry);
    }
    if (message.dateOfIssue !== "") {
      writer.uint32(114).string(message.dateOfIssue);
    }
    if (message.licenseClass !== "") {
      writer.uint32(122).string(message.licenseClass);
    }
    Object.entries(message.licenseClassDetails).forEach(([key, value]) => {
      AuthenteqDocumentData_LicenseClassDetailsEntry.encode(
        { key: key as any, value },
        writer.uint32(130).fork()
      ).ldelim();
    });
    if (message.croppedFrontImage !== undefined) {
      WebImage.encode(
        message.croppedFrontImage,
        writer.uint32(138).fork()
      ).ldelim();
    }
    if (message.croppedBackImage !== undefined) {
      WebImage.encode(
        message.croppedBackImage,
        writer.uint32(146).fork()
      ).ldelim();
    }
    if (message.faceImage !== undefined) {
      WebImage.encode(message.faceImage, writer.uint32(154).fork()).ldelim();
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): AuthenteqDocumentData {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseAuthenteqDocumentData } as AuthenteqDocumentData;
    message.licenseClassDetails = {};
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.documentType = reader.string();
          break;
        case 2:
          message.documentNumber = reader.string();
          break;
        case 3:
          message.issuingCountry = reader.string();
          break;
        case 4:
          message.jurisdiction = reader.string();
          break;
        case 5:
          message.nationality = reader.string();
          break;
        case 6:
          message.surnameAndGivenNames = reader.string();
          break;
        case 7:
          message.surname = reader.string();
          break;
        case 8:
          message.givenNames = reader.string();
          break;
        case 9:
          message.nameSuffixes = reader.string();
          break;
        case 10:
          message.namePrefixes = reader.string();
          break;
        case 11:
          message.sex = reader.string();
          break;
        case 12:
          message.dateOfBirth = reader.string();
          break;
        case 13:
          message.dateOfExpiry = reader.string();
          break;
        case 14:
          message.dateOfIssue = reader.string();
          break;
        case 15:
          message.licenseClass = reader.string();
          break;
        case 16:
          const entry16 = AuthenteqDocumentData_LicenseClassDetailsEntry.decode(
            reader,
            reader.uint32()
          );
          if (entry16.value !== undefined) {
            message.licenseClassDetails[entry16.key] = entry16.value;
          }
          break;
        case 17:
          message.croppedFrontImage = WebImage.decode(reader, reader.uint32());
          break;
        case 18:
          message.croppedBackImage = WebImage.decode(reader, reader.uint32());
          break;
        case 19:
          message.faceImage = WebImage.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): AuthenteqDocumentData {
    const message = { ...baseAuthenteqDocumentData } as AuthenteqDocumentData;
    message.licenseClassDetails = {};
    if (object.documentType !== undefined && object.documentType !== null) {
      message.documentType = String(object.documentType);
    }
    if (object.documentNumber !== undefined && object.documentNumber !== null) {
      message.documentNumber = String(object.documentNumber);
    }
    if (object.issuingCountry !== undefined && object.issuingCountry !== null) {
      message.issuingCountry = String(object.issuingCountry);
    }
    if (object.jurisdiction !== undefined && object.jurisdiction !== null) {
      message.jurisdiction = String(object.jurisdiction);
    }
    if (object.nationality !== undefined && object.nationality !== null) {
      message.nationality = String(object.nationality);
    }
    if (
      object.surnameAndGivenNames !== undefined &&
      object.surnameAndGivenNames !== null
    ) {
      message.surnameAndGivenNames = String(object.surnameAndGivenNames);
    }
    if (object.surname !== undefined && object.surname !== null) {
      message.surname = String(object.surname);
    }
    if (object.givenNames !== undefined && object.givenNames !== null) {
      message.givenNames = String(object.givenNames);
    }
    if (object.nameSuffixes !== undefined && object.nameSuffixes !== null) {
      message.nameSuffixes = String(object.nameSuffixes);
    }
    if (object.namePrefixes !== undefined && object.namePrefixes !== null) {
      message.namePrefixes = String(object.namePrefixes);
    }
    if (object.sex !== undefined && object.sex !== null) {
      message.sex = String(object.sex);
    }
    if (object.dateOfBirth !== undefined && object.dateOfBirth !== null) {
      message.dateOfBirth = String(object.dateOfBirth);
    }
    if (object.dateOfExpiry !== undefined && object.dateOfExpiry !== null) {
      message.dateOfExpiry = String(object.dateOfExpiry);
    }
    if (object.dateOfIssue !== undefined && object.dateOfIssue !== null) {
      message.dateOfIssue = String(object.dateOfIssue);
    }
    if (object.licenseClass !== undefined && object.licenseClass !== null) {
      message.licenseClass = String(object.licenseClass);
    }
    if (
      object.licenseClassDetails !== undefined &&
      object.licenseClassDetails !== null
    ) {
      Object.entries(object.licenseClassDetails).forEach(([key, value]) => {
        message.licenseClassDetails[key] = LicenseClassDetails.fromJSON(value);
      });
    }
    if (
      object.croppedFrontImage !== undefined &&
      object.croppedFrontImage !== null
    ) {
      message.croppedFrontImage = WebImage.fromJSON(object.croppedFrontImage);
    }
    if (
      object.croppedBackImage !== undefined &&
      object.croppedBackImage !== null
    ) {
      message.croppedBackImage = WebImage.fromJSON(object.croppedBackImage);
    }
    if (object.faceImage !== undefined && object.faceImage !== null) {
      message.faceImage = WebImage.fromJSON(object.faceImage);
    }
    return message;
  },

  toJSON(message: AuthenteqDocumentData): unknown {
    const obj: any = {};
    message.documentType !== undefined &&
      (obj.documentType = message.documentType);
    message.documentNumber !== undefined &&
      (obj.documentNumber = message.documentNumber);
    message.issuingCountry !== undefined &&
      (obj.issuingCountry = message.issuingCountry);
    message.jurisdiction !== undefined &&
      (obj.jurisdiction = message.jurisdiction);
    message.nationality !== undefined &&
      (obj.nationality = message.nationality);
    message.surnameAndGivenNames !== undefined &&
      (obj.surnameAndGivenNames = message.surnameAndGivenNames);
    message.surname !== undefined && (obj.surname = message.surname);
    message.givenNames !== undefined && (obj.givenNames = message.givenNames);
    message.nameSuffixes !== undefined &&
      (obj.nameSuffixes = message.nameSuffixes);
    message.namePrefixes !== undefined &&
      (obj.namePrefixes = message.namePrefixes);
    message.sex !== undefined && (obj.sex = message.sex);
    message.dateOfBirth !== undefined &&
      (obj.dateOfBirth = message.dateOfBirth);
    message.dateOfExpiry !== undefined &&
      (obj.dateOfExpiry = message.dateOfExpiry);
    message.dateOfIssue !== undefined &&
      (obj.dateOfIssue = message.dateOfIssue);
    message.licenseClass !== undefined &&
      (obj.licenseClass = message.licenseClass);
    obj.licenseClassDetails = {};
    if (message.licenseClassDetails) {
      Object.entries(message.licenseClassDetails).forEach(([k, v]) => {
        obj.licenseClassDetails[k] = LicenseClassDetails.toJSON(v);
      });
    }
    message.croppedFrontImage !== undefined &&
      (obj.croppedFrontImage = message.croppedFrontImage
        ? WebImage.toJSON(message.croppedFrontImage)
        : undefined);
    message.croppedBackImage !== undefined &&
      (obj.croppedBackImage = message.croppedBackImage
        ? WebImage.toJSON(message.croppedBackImage)
        : undefined);
    message.faceImage !== undefined &&
      (obj.faceImage = message.faceImage
        ? WebImage.toJSON(message.faceImage)
        : undefined);
    return obj;
  },

  fromPartial(
    object: DeepPartial<AuthenteqDocumentData>
  ): AuthenteqDocumentData {
    const message = { ...baseAuthenteqDocumentData } as AuthenteqDocumentData;
    message.licenseClassDetails = {};
    if (object.documentType !== undefined && object.documentType !== null) {
      message.documentType = object.documentType;
    }
    if (object.documentNumber !== undefined && object.documentNumber !== null) {
      message.documentNumber = object.documentNumber;
    }
    if (object.issuingCountry !== undefined && object.issuingCountry !== null) {
      message.issuingCountry = object.issuingCountry;
    }
    if (object.jurisdiction !== undefined && object.jurisdiction !== null) {
      message.jurisdiction = object.jurisdiction;
    }
    if (object.nationality !== undefined && object.nationality !== null) {
      message.nationality = object.nationality;
    }
    if (
      object.surnameAndGivenNames !== undefined &&
      object.surnameAndGivenNames !== null
    ) {
      message.surnameAndGivenNames = object.surnameAndGivenNames;
    }
    if (object.surname !== undefined && object.surname !== null) {
      message.surname = object.surname;
    }
    if (object.givenNames !== undefined && object.givenNames !== null) {
      message.givenNames = object.givenNames;
    }
    if (object.nameSuffixes !== undefined && object.nameSuffixes !== null) {
      message.nameSuffixes = object.nameSuffixes;
    }
    if (object.namePrefixes !== undefined && object.namePrefixes !== null) {
      message.namePrefixes = object.namePrefixes;
    }
    if (object.sex !== undefined && object.sex !== null) {
      message.sex = object.sex;
    }
    if (object.dateOfBirth !== undefined && object.dateOfBirth !== null) {
      message.dateOfBirth = object.dateOfBirth;
    }
    if (object.dateOfExpiry !== undefined && object.dateOfExpiry !== null) {
      message.dateOfExpiry = object.dateOfExpiry;
    }
    if (object.dateOfIssue !== undefined && object.dateOfIssue !== null) {
      message.dateOfIssue = object.dateOfIssue;
    }
    if (object.licenseClass !== undefined && object.licenseClass !== null) {
      message.licenseClass = object.licenseClass;
    }
    if (
      object.licenseClassDetails !== undefined &&
      object.licenseClassDetails !== null
    ) {
      Object.entries(object.licenseClassDetails).forEach(([key, value]) => {
        if (value !== undefined) {
          message.licenseClassDetails[key] =
            LicenseClassDetails.fromPartial(value);
        }
      });
    }
    if (
      object.croppedFrontImage !== undefined &&
      object.croppedFrontImage !== null
    ) {
      message.croppedFrontImage = WebImage.fromPartial(
        object.croppedFrontImage
      );
    }
    if (
      object.croppedBackImage !== undefined &&
      object.croppedBackImage !== null
    ) {
      message.croppedBackImage = WebImage.fromPartial(object.croppedBackImage);
    }
    if (object.faceImage !== undefined && object.faceImage !== null) {
      message.faceImage = WebImage.fromPartial(object.faceImage);
    }
    return message;
  },
};

const baseAuthenteqDocumentData_LicenseClassDetailsEntry: object = { key: "" };

export const AuthenteqDocumentData_LicenseClassDetailsEntry = {
  encode(
    message: AuthenteqDocumentData_LicenseClassDetailsEntry,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.key !== "") {
      writer.uint32(10).string(message.key);
    }
    if (message.value !== undefined) {
      LicenseClassDetails.encode(
        message.value,
        writer.uint32(18).fork()
      ).ldelim();
    }
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): AuthenteqDocumentData_LicenseClassDetailsEntry {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseAuthenteqDocumentData_LicenseClassDetailsEntry,
    } as AuthenteqDocumentData_LicenseClassDetailsEntry;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.key = reader.string();
          break;
        case 2:
          message.value = LicenseClassDetails.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): AuthenteqDocumentData_LicenseClassDetailsEntry {
    const message = {
      ...baseAuthenteqDocumentData_LicenseClassDetailsEntry,
    } as AuthenteqDocumentData_LicenseClassDetailsEntry;
    if (object.key !== undefined && object.key !== null) {
      message.key = String(object.key);
    }
    if (object.value !== undefined && object.value !== null) {
      message.value = LicenseClassDetails.fromJSON(object.value);
    }
    return message;
  },

  toJSON(message: AuthenteqDocumentData_LicenseClassDetailsEntry): unknown {
    const obj: any = {};
    message.key !== undefined && (obj.key = message.key);
    message.value !== undefined &&
      (obj.value = message.value
        ? LicenseClassDetails.toJSON(message.value)
        : undefined);
    return obj;
  },

  fromPartial(
    object: DeepPartial<AuthenteqDocumentData_LicenseClassDetailsEntry>
  ): AuthenteqDocumentData_LicenseClassDetailsEntry {
    const message = {
      ...baseAuthenteqDocumentData_LicenseClassDetailsEntry,
    } as AuthenteqDocumentData_LicenseClassDetailsEntry;
    if (object.key !== undefined && object.key !== null) {
      message.key = object.key;
    }
    if (object.value !== undefined && object.value !== null) {
      message.value = LicenseClassDetails.fromPartial(object.value);
    }
    return message;
  },
};

const baseLicenseClassDetails: object = { from: "", to: "", notes: "" };

export const LicenseClassDetails = {
  encode(
    message: LicenseClassDetails,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.from !== "") {
      writer.uint32(10).string(message.from);
    }
    if (message.to !== "") {
      writer.uint32(18).string(message.to);
    }
    if (message.notes !== "") {
      writer.uint32(26).string(message.notes);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): LicenseClassDetails {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseLicenseClassDetails } as LicenseClassDetails;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.from = reader.string();
          break;
        case 2:
          message.to = reader.string();
          break;
        case 3:
          message.notes = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): LicenseClassDetails {
    const message = { ...baseLicenseClassDetails } as LicenseClassDetails;
    if (object.from !== undefined && object.from !== null) {
      message.from = String(object.from);
    }
    if (object.to !== undefined && object.to !== null) {
      message.to = String(object.to);
    }
    if (object.notes !== undefined && object.notes !== null) {
      message.notes = String(object.notes);
    }
    return message;
  },

  toJSON(message: LicenseClassDetails): unknown {
    const obj: any = {};
    message.from !== undefined && (obj.from = message.from);
    message.to !== undefined && (obj.to = message.to);
    message.notes !== undefined && (obj.notes = message.notes);
    return obj;
  },

  fromPartial(object: DeepPartial<LicenseClassDetails>): LicenseClassDetails {
    const message = { ...baseLicenseClassDetails } as LicenseClassDetails;
    if (object.from !== undefined && object.from !== null) {
      message.from = object.from;
    }
    if (object.to !== undefined && object.to !== null) {
      message.to = object.to;
    }
    if (object.notes !== undefined && object.notes !== null) {
      message.notes = object.notes;
    }
    return message;
  },
};

const baseWebImage: object = { contentType: "", content: "" };

export const WebImage = {
  encode(message: WebImage, writer: Writer = Writer.create()): Writer {
    if (message.contentType !== "") {
      writer.uint32(10).string(message.contentType);
    }
    if (message.content !== "") {
      writer.uint32(18).string(message.content);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): WebImage {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseWebImage } as WebImage;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.contentType = reader.string();
          break;
        case 2:
          message.content = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): WebImage {
    const message = { ...baseWebImage } as WebImage;
    if (object.contentType !== undefined && object.contentType !== null) {
      message.contentType = String(object.contentType);
    }
    if (object.content !== undefined && object.content !== null) {
      message.content = String(object.content);
    }
    return message;
  },

  toJSON(message: WebImage): unknown {
    const obj: any = {};
    message.contentType !== undefined &&
      (obj.contentType = message.contentType);
    message.content !== undefined && (obj.content = message.content);
    return obj;
  },

  fromPartial(object: DeepPartial<WebImage>): WebImage {
    const message = { ...baseWebImage } as WebImage;
    if (object.contentType !== undefined && object.contentType !== null) {
      message.contentType = object.contentType;
    }
    if (object.content !== undefined && object.content !== null) {
      message.content = object.content;
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

// If you get a compile-error about 'Constructor<Long> and ... have no overlap',
// add '--ts_proto_opt=esModuleInterop=true' as a flag when calling 'protoc'.
if (util.Long !== Long) {
  util.Long = Long as any;
  configure();
}
