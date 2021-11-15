/* eslint-disable */
import { util, configure, Writer, Reader } from "protobufjs/minimal";
import * as Long from "long";

export const protobufPackage = "indykite.identity.v1beta1";

export interface ImportUsersRequest {
  users: ImportUser[];
  hashAlgorithm?:
    | { $case: "bcrypt"; bcrypt: Bcrypt }
    | { $case: "standardScrypt"; standardScrypt: StandardScrypt }
    | { $case: "scrypt"; scrypt: Scrypt }
    | { $case: "hmacMd5"; hmacMd5: HMACMD5 }
    | { $case: "hmacSha1"; hmacSha1: HMACSHA1 }
    | { $case: "hmacSha512"; hmacSha512: HMACSHA512 }
    | { $case: "hmacSha256"; hmacSha256: HMACSHA256 }
    | { $case: "md5"; md5: MD5 }
    | { $case: "pbkdf2Sha256"; pbkdf2Sha256: PBKDF2SHA256 }
    | { $case: "pbkdfSha1"; pbkdfSha1: PBKDFSHA1 }
    | { $case: "sha1"; sha1: SHA1 }
    | { $case: "sha256"; sha256: SHA256 }
    | { $case: "sha512"; sha512: SHA512 };
}

export interface ImportUsersResponse {
  errors: ImportUsersResponse_ImportUserResult[];
}

export interface ImportUsersResponse_ImportUsersError {
  /** int64 index = 1; */
  message: string;
}

export interface ImportUsersResponse_ImportUserResult {
  id: Buffer;
  error?: ImportUsersResponse_ImportUsersError;
}

/** uid is the unique internal identifier in source system. */
export interface ImportUser {
  /** optional */
  uid: string;
  password?: PasswordCredential;
  providerUserInfo: UserProvider[];
  disabled: boolean;
}

/**
 * UserMetadata contains additional metadata associated with a user account.
 * Timestamps are in milliseconds since epoch.
 */
export interface UserMetadata {
  creationTimestamp: string;
  lastLogInTimestamp: string;
  /**
   * The time at which the user was last active (ID token refreshed), or 0 if
   * the user was never active.
   */
  lastRefreshTimestamp: string;
}

export interface Email {
  email: string;
  /** optional */
  verified: boolean;
}

export interface Mobile {
  mobile: string;
  /** optional */
  verified: boolean;
}

/**
 * PasswordCredential represent a password for user.
 *
 * Password can be specified for each user when importing in bulk.
 */
export interface PasswordCredential {
  uid?:
    | { $case: "email"; email: Email }
    | { $case: "mobile"; mobile: Mobile }
    | { $case: "userName"; userName: string };
  password?:
    | { $case: "value"; value: string }
    | { $case: "hash"; hash: PasswordHash };
}

export interface PasswordHash {
  passwordHash: Buffer;
  /** optional */
  salt: Buffer;
}

/**
 * UserProvider represents a user identity provider.
 *
 * One or more user providers can be specified for each user when importing in bulk.
 */
export interface UserProvider {
  uid: string;
  providerId: string;
  /** optional */
  email: string;
  /** optional */
  displayName: string;
  /** optional */
  photoUrl: string;
}

export interface Bcrypt {}

export interface StandardScrypt {
  blockSize: string;
  derivedKeyLength: string;
  memoryCost: string;
  parallelization: string;
}

export interface Scrypt {
  key: Buffer;
  saltSeparator: Buffer;
  rounds: string;
  memoryCost: string;
}

export interface HMACMD5 {
  key: Buffer;
}

export interface HMACSHA1 {
  key: Buffer;
}

export interface HMACSHA512 {
  key: Buffer;
}

export interface HMACSHA256 {
  key: Buffer;
}

export interface MD5 {
  rounds: string;
}

export interface PBKDF2SHA256 {
  rounds: string;
}

export interface PBKDFSHA1 {
  rounds: string;
}

export interface SHA1 {
  rounds: string;
}

export interface SHA256 {
  rounds: string;
}

export interface SHA512 {
  rounds: string;
}

const baseImportUsersRequest: object = {};

export const ImportUsersRequest = {
  encode(
    message: ImportUsersRequest,
    writer: Writer = Writer.create()
  ): Writer {
    for (const v of message.users) {
      ImportUser.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    if (message.hashAlgorithm?.$case === "bcrypt") {
      Bcrypt.encode(
        message.hashAlgorithm.bcrypt,
        writer.uint32(18).fork()
      ).ldelim();
    }
    if (message.hashAlgorithm?.$case === "standardScrypt") {
      StandardScrypt.encode(
        message.hashAlgorithm.standardScrypt,
        writer.uint32(26).fork()
      ).ldelim();
    }
    if (message.hashAlgorithm?.$case === "scrypt") {
      Scrypt.encode(
        message.hashAlgorithm.scrypt,
        writer.uint32(34).fork()
      ).ldelim();
    }
    if (message.hashAlgorithm?.$case === "hmacMd5") {
      HMACMD5.encode(
        message.hashAlgorithm.hmacMd5,
        writer.uint32(42).fork()
      ).ldelim();
    }
    if (message.hashAlgorithm?.$case === "hmacSha1") {
      HMACSHA1.encode(
        message.hashAlgorithm.hmacSha1,
        writer.uint32(50).fork()
      ).ldelim();
    }
    if (message.hashAlgorithm?.$case === "hmacSha512") {
      HMACSHA512.encode(
        message.hashAlgorithm.hmacSha512,
        writer.uint32(58).fork()
      ).ldelim();
    }
    if (message.hashAlgorithm?.$case === "hmacSha256") {
      HMACSHA256.encode(
        message.hashAlgorithm.hmacSha256,
        writer.uint32(66).fork()
      ).ldelim();
    }
    if (message.hashAlgorithm?.$case === "md5") {
      MD5.encode(message.hashAlgorithm.md5, writer.uint32(74).fork()).ldelim();
    }
    if (message.hashAlgorithm?.$case === "pbkdf2Sha256") {
      PBKDF2SHA256.encode(
        message.hashAlgorithm.pbkdf2Sha256,
        writer.uint32(82).fork()
      ).ldelim();
    }
    if (message.hashAlgorithm?.$case === "pbkdfSha1") {
      PBKDFSHA1.encode(
        message.hashAlgorithm.pbkdfSha1,
        writer.uint32(90).fork()
      ).ldelim();
    }
    if (message.hashAlgorithm?.$case === "sha1") {
      SHA1.encode(
        message.hashAlgorithm.sha1,
        writer.uint32(98).fork()
      ).ldelim();
    }
    if (message.hashAlgorithm?.$case === "sha256") {
      SHA256.encode(
        message.hashAlgorithm.sha256,
        writer.uint32(106).fork()
      ).ldelim();
    }
    if (message.hashAlgorithm?.$case === "sha512") {
      SHA512.encode(
        message.hashAlgorithm.sha512,
        writer.uint32(114).fork()
      ).ldelim();
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): ImportUsersRequest {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseImportUsersRequest } as ImportUsersRequest;
    message.users = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.users.push(ImportUser.decode(reader, reader.uint32()));
          break;
        case 2:
          message.hashAlgorithm = {
            $case: "bcrypt",
            bcrypt: Bcrypt.decode(reader, reader.uint32()),
          };
          break;
        case 3:
          message.hashAlgorithm = {
            $case: "standardScrypt",
            standardScrypt: StandardScrypt.decode(reader, reader.uint32()),
          };
          break;
        case 4:
          message.hashAlgorithm = {
            $case: "scrypt",
            scrypt: Scrypt.decode(reader, reader.uint32()),
          };
          break;
        case 5:
          message.hashAlgorithm = {
            $case: "hmacMd5",
            hmacMd5: HMACMD5.decode(reader, reader.uint32()),
          };
          break;
        case 6:
          message.hashAlgorithm = {
            $case: "hmacSha1",
            hmacSha1: HMACSHA1.decode(reader, reader.uint32()),
          };
          break;
        case 7:
          message.hashAlgorithm = {
            $case: "hmacSha512",
            hmacSha512: HMACSHA512.decode(reader, reader.uint32()),
          };
          break;
        case 8:
          message.hashAlgorithm = {
            $case: "hmacSha256",
            hmacSha256: HMACSHA256.decode(reader, reader.uint32()),
          };
          break;
        case 9:
          message.hashAlgorithm = {
            $case: "md5",
            md5: MD5.decode(reader, reader.uint32()),
          };
          break;
        case 10:
          message.hashAlgorithm = {
            $case: "pbkdf2Sha256",
            pbkdf2Sha256: PBKDF2SHA256.decode(reader, reader.uint32()),
          };
          break;
        case 11:
          message.hashAlgorithm = {
            $case: "pbkdfSha1",
            pbkdfSha1: PBKDFSHA1.decode(reader, reader.uint32()),
          };
          break;
        case 12:
          message.hashAlgorithm = {
            $case: "sha1",
            sha1: SHA1.decode(reader, reader.uint32()),
          };
          break;
        case 13:
          message.hashAlgorithm = {
            $case: "sha256",
            sha256: SHA256.decode(reader, reader.uint32()),
          };
          break;
        case 14:
          message.hashAlgorithm = {
            $case: "sha512",
            sha512: SHA512.decode(reader, reader.uint32()),
          };
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ImportUsersRequest {
    const message = { ...baseImportUsersRequest } as ImportUsersRequest;
    message.users = [];
    if (object.users !== undefined && object.users !== null) {
      for (const e of object.users) {
        message.users.push(ImportUser.fromJSON(e));
      }
    }
    if (object.bcrypt !== undefined && object.bcrypt !== null) {
      message.hashAlgorithm = {
        $case: "bcrypt",
        bcrypt: Bcrypt.fromJSON(object.bcrypt),
      };
    }
    if (object.standardScrypt !== undefined && object.standardScrypt !== null) {
      message.hashAlgorithm = {
        $case: "standardScrypt",
        standardScrypt: StandardScrypt.fromJSON(object.standardScrypt),
      };
    }
    if (object.scrypt !== undefined && object.scrypt !== null) {
      message.hashAlgorithm = {
        $case: "scrypt",
        scrypt: Scrypt.fromJSON(object.scrypt),
      };
    }
    if (object.hmacMd5 !== undefined && object.hmacMd5 !== null) {
      message.hashAlgorithm = {
        $case: "hmacMd5",
        hmacMd5: HMACMD5.fromJSON(object.hmacMd5),
      };
    }
    if (object.hmacSha1 !== undefined && object.hmacSha1 !== null) {
      message.hashAlgorithm = {
        $case: "hmacSha1",
        hmacSha1: HMACSHA1.fromJSON(object.hmacSha1),
      };
    }
    if (object.hmacSha512 !== undefined && object.hmacSha512 !== null) {
      message.hashAlgorithm = {
        $case: "hmacSha512",
        hmacSha512: HMACSHA512.fromJSON(object.hmacSha512),
      };
    }
    if (object.hmacSha256 !== undefined && object.hmacSha256 !== null) {
      message.hashAlgorithm = {
        $case: "hmacSha256",
        hmacSha256: HMACSHA256.fromJSON(object.hmacSha256),
      };
    }
    if (object.md5 !== undefined && object.md5 !== null) {
      message.hashAlgorithm = { $case: "md5", md5: MD5.fromJSON(object.md5) };
    }
    if (object.pbkdf2Sha256 !== undefined && object.pbkdf2Sha256 !== null) {
      message.hashAlgorithm = {
        $case: "pbkdf2Sha256",
        pbkdf2Sha256: PBKDF2SHA256.fromJSON(object.pbkdf2Sha256),
      };
    }
    if (object.pbkdfSha1 !== undefined && object.pbkdfSha1 !== null) {
      message.hashAlgorithm = {
        $case: "pbkdfSha1",
        pbkdfSha1: PBKDFSHA1.fromJSON(object.pbkdfSha1),
      };
    }
    if (object.sha1 !== undefined && object.sha1 !== null) {
      message.hashAlgorithm = {
        $case: "sha1",
        sha1: SHA1.fromJSON(object.sha1),
      };
    }
    if (object.sha256 !== undefined && object.sha256 !== null) {
      message.hashAlgorithm = {
        $case: "sha256",
        sha256: SHA256.fromJSON(object.sha256),
      };
    }
    if (object.sha512 !== undefined && object.sha512 !== null) {
      message.hashAlgorithm = {
        $case: "sha512",
        sha512: SHA512.fromJSON(object.sha512),
      };
    }
    return message;
  },

  toJSON(message: ImportUsersRequest): unknown {
    const obj: any = {};
    if (message.users) {
      obj.users = message.users.map((e) =>
        e ? ImportUser.toJSON(e) : undefined
      );
    } else {
      obj.users = [];
    }
    message.hashAlgorithm?.$case === "bcrypt" &&
      (obj.bcrypt = message.hashAlgorithm?.bcrypt
        ? Bcrypt.toJSON(message.hashAlgorithm?.bcrypt)
        : undefined);
    message.hashAlgorithm?.$case === "standardScrypt" &&
      (obj.standardScrypt = message.hashAlgorithm?.standardScrypt
        ? StandardScrypt.toJSON(message.hashAlgorithm?.standardScrypt)
        : undefined);
    message.hashAlgorithm?.$case === "scrypt" &&
      (obj.scrypt = message.hashAlgorithm?.scrypt
        ? Scrypt.toJSON(message.hashAlgorithm?.scrypt)
        : undefined);
    message.hashAlgorithm?.$case === "hmacMd5" &&
      (obj.hmacMd5 = message.hashAlgorithm?.hmacMd5
        ? HMACMD5.toJSON(message.hashAlgorithm?.hmacMd5)
        : undefined);
    message.hashAlgorithm?.$case === "hmacSha1" &&
      (obj.hmacSha1 = message.hashAlgorithm?.hmacSha1
        ? HMACSHA1.toJSON(message.hashAlgorithm?.hmacSha1)
        : undefined);
    message.hashAlgorithm?.$case === "hmacSha512" &&
      (obj.hmacSha512 = message.hashAlgorithm?.hmacSha512
        ? HMACSHA512.toJSON(message.hashAlgorithm?.hmacSha512)
        : undefined);
    message.hashAlgorithm?.$case === "hmacSha256" &&
      (obj.hmacSha256 = message.hashAlgorithm?.hmacSha256
        ? HMACSHA256.toJSON(message.hashAlgorithm?.hmacSha256)
        : undefined);
    message.hashAlgorithm?.$case === "md5" &&
      (obj.md5 = message.hashAlgorithm?.md5
        ? MD5.toJSON(message.hashAlgorithm?.md5)
        : undefined);
    message.hashAlgorithm?.$case === "pbkdf2Sha256" &&
      (obj.pbkdf2Sha256 = message.hashAlgorithm?.pbkdf2Sha256
        ? PBKDF2SHA256.toJSON(message.hashAlgorithm?.pbkdf2Sha256)
        : undefined);
    message.hashAlgorithm?.$case === "pbkdfSha1" &&
      (obj.pbkdfSha1 = message.hashAlgorithm?.pbkdfSha1
        ? PBKDFSHA1.toJSON(message.hashAlgorithm?.pbkdfSha1)
        : undefined);
    message.hashAlgorithm?.$case === "sha1" &&
      (obj.sha1 = message.hashAlgorithm?.sha1
        ? SHA1.toJSON(message.hashAlgorithm?.sha1)
        : undefined);
    message.hashAlgorithm?.$case === "sha256" &&
      (obj.sha256 = message.hashAlgorithm?.sha256
        ? SHA256.toJSON(message.hashAlgorithm?.sha256)
        : undefined);
    message.hashAlgorithm?.$case === "sha512" &&
      (obj.sha512 = message.hashAlgorithm?.sha512
        ? SHA512.toJSON(message.hashAlgorithm?.sha512)
        : undefined);
    return obj;
  },

  fromPartial(object: DeepPartial<ImportUsersRequest>): ImportUsersRequest {
    const message = { ...baseImportUsersRequest } as ImportUsersRequest;
    message.users = [];
    if (object.users !== undefined && object.users !== null) {
      for (const e of object.users) {
        message.users.push(ImportUser.fromPartial(e));
      }
    }
    if (
      object.hashAlgorithm?.$case === "bcrypt" &&
      object.hashAlgorithm?.bcrypt !== undefined &&
      object.hashAlgorithm?.bcrypt !== null
    ) {
      message.hashAlgorithm = {
        $case: "bcrypt",
        bcrypt: Bcrypt.fromPartial(object.hashAlgorithm.bcrypt),
      };
    }
    if (
      object.hashAlgorithm?.$case === "standardScrypt" &&
      object.hashAlgorithm?.standardScrypt !== undefined &&
      object.hashAlgorithm?.standardScrypt !== null
    ) {
      message.hashAlgorithm = {
        $case: "standardScrypt",
        standardScrypt: StandardScrypt.fromPartial(
          object.hashAlgorithm.standardScrypt
        ),
      };
    }
    if (
      object.hashAlgorithm?.$case === "scrypt" &&
      object.hashAlgorithm?.scrypt !== undefined &&
      object.hashAlgorithm?.scrypt !== null
    ) {
      message.hashAlgorithm = {
        $case: "scrypt",
        scrypt: Scrypt.fromPartial(object.hashAlgorithm.scrypt),
      };
    }
    if (
      object.hashAlgorithm?.$case === "hmacMd5" &&
      object.hashAlgorithm?.hmacMd5 !== undefined &&
      object.hashAlgorithm?.hmacMd5 !== null
    ) {
      message.hashAlgorithm = {
        $case: "hmacMd5",
        hmacMd5: HMACMD5.fromPartial(object.hashAlgorithm.hmacMd5),
      };
    }
    if (
      object.hashAlgorithm?.$case === "hmacSha1" &&
      object.hashAlgorithm?.hmacSha1 !== undefined &&
      object.hashAlgorithm?.hmacSha1 !== null
    ) {
      message.hashAlgorithm = {
        $case: "hmacSha1",
        hmacSha1: HMACSHA1.fromPartial(object.hashAlgorithm.hmacSha1),
      };
    }
    if (
      object.hashAlgorithm?.$case === "hmacSha512" &&
      object.hashAlgorithm?.hmacSha512 !== undefined &&
      object.hashAlgorithm?.hmacSha512 !== null
    ) {
      message.hashAlgorithm = {
        $case: "hmacSha512",
        hmacSha512: HMACSHA512.fromPartial(object.hashAlgorithm.hmacSha512),
      };
    }
    if (
      object.hashAlgorithm?.$case === "hmacSha256" &&
      object.hashAlgorithm?.hmacSha256 !== undefined &&
      object.hashAlgorithm?.hmacSha256 !== null
    ) {
      message.hashAlgorithm = {
        $case: "hmacSha256",
        hmacSha256: HMACSHA256.fromPartial(object.hashAlgorithm.hmacSha256),
      };
    }
    if (
      object.hashAlgorithm?.$case === "md5" &&
      object.hashAlgorithm?.md5 !== undefined &&
      object.hashAlgorithm?.md5 !== null
    ) {
      message.hashAlgorithm = {
        $case: "md5",
        md5: MD5.fromPartial(object.hashAlgorithm.md5),
      };
    }
    if (
      object.hashAlgorithm?.$case === "pbkdf2Sha256" &&
      object.hashAlgorithm?.pbkdf2Sha256 !== undefined &&
      object.hashAlgorithm?.pbkdf2Sha256 !== null
    ) {
      message.hashAlgorithm = {
        $case: "pbkdf2Sha256",
        pbkdf2Sha256: PBKDF2SHA256.fromPartial(
          object.hashAlgorithm.pbkdf2Sha256
        ),
      };
    }
    if (
      object.hashAlgorithm?.$case === "pbkdfSha1" &&
      object.hashAlgorithm?.pbkdfSha1 !== undefined &&
      object.hashAlgorithm?.pbkdfSha1 !== null
    ) {
      message.hashAlgorithm = {
        $case: "pbkdfSha1",
        pbkdfSha1: PBKDFSHA1.fromPartial(object.hashAlgorithm.pbkdfSha1),
      };
    }
    if (
      object.hashAlgorithm?.$case === "sha1" &&
      object.hashAlgorithm?.sha1 !== undefined &&
      object.hashAlgorithm?.sha1 !== null
    ) {
      message.hashAlgorithm = {
        $case: "sha1",
        sha1: SHA1.fromPartial(object.hashAlgorithm.sha1),
      };
    }
    if (
      object.hashAlgorithm?.$case === "sha256" &&
      object.hashAlgorithm?.sha256 !== undefined &&
      object.hashAlgorithm?.sha256 !== null
    ) {
      message.hashAlgorithm = {
        $case: "sha256",
        sha256: SHA256.fromPartial(object.hashAlgorithm.sha256),
      };
    }
    if (
      object.hashAlgorithm?.$case === "sha512" &&
      object.hashAlgorithm?.sha512 !== undefined &&
      object.hashAlgorithm?.sha512 !== null
    ) {
      message.hashAlgorithm = {
        $case: "sha512",
        sha512: SHA512.fromPartial(object.hashAlgorithm.sha512),
      };
    }
    return message;
  },
};

const baseImportUsersResponse: object = {};

export const ImportUsersResponse = {
  encode(
    message: ImportUsersResponse,
    writer: Writer = Writer.create()
  ): Writer {
    for (const v of message.errors) {
      ImportUsersResponse_ImportUserResult.encode(
        v!,
        writer.uint32(10).fork()
      ).ldelim();
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): ImportUsersResponse {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseImportUsersResponse } as ImportUsersResponse;
    message.errors = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.errors.push(
            ImportUsersResponse_ImportUserResult.decode(reader, reader.uint32())
          );
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ImportUsersResponse {
    const message = { ...baseImportUsersResponse } as ImportUsersResponse;
    message.errors = [];
    if (object.errors !== undefined && object.errors !== null) {
      for (const e of object.errors) {
        message.errors.push(ImportUsersResponse_ImportUserResult.fromJSON(e));
      }
    }
    return message;
  },

  toJSON(message: ImportUsersResponse): unknown {
    const obj: any = {};
    if (message.errors) {
      obj.errors = message.errors.map((e) =>
        e ? ImportUsersResponse_ImportUserResult.toJSON(e) : undefined
      );
    } else {
      obj.errors = [];
    }
    return obj;
  },

  fromPartial(object: DeepPartial<ImportUsersResponse>): ImportUsersResponse {
    const message = { ...baseImportUsersResponse } as ImportUsersResponse;
    message.errors = [];
    if (object.errors !== undefined && object.errors !== null) {
      for (const e of object.errors) {
        message.errors.push(
          ImportUsersResponse_ImportUserResult.fromPartial(e)
        );
      }
    }
    return message;
  },
};

const baseImportUsersResponse_ImportUsersError: object = { message: "" };

export const ImportUsersResponse_ImportUsersError = {
  encode(
    message: ImportUsersResponse_ImportUsersError,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.message !== "") {
      writer.uint32(18).string(message.message);
    }
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): ImportUsersResponse_ImportUsersError {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseImportUsersResponse_ImportUsersError,
    } as ImportUsersResponse_ImportUsersError;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 2:
          message.message = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ImportUsersResponse_ImportUsersError {
    const message = {
      ...baseImportUsersResponse_ImportUsersError,
    } as ImportUsersResponse_ImportUsersError;
    if (object.message !== undefined && object.message !== null) {
      message.message = String(object.message);
    }
    return message;
  },

  toJSON(message: ImportUsersResponse_ImportUsersError): unknown {
    const obj: any = {};
    message.message !== undefined && (obj.message = message.message);
    return obj;
  },

  fromPartial(
    object: DeepPartial<ImportUsersResponse_ImportUsersError>
  ): ImportUsersResponse_ImportUsersError {
    const message = {
      ...baseImportUsersResponse_ImportUsersError,
    } as ImportUsersResponse_ImportUsersError;
    if (object.message !== undefined && object.message !== null) {
      message.message = object.message;
    }
    return message;
  },
};

const baseImportUsersResponse_ImportUserResult: object = {};

export const ImportUsersResponse_ImportUserResult = {
  encode(
    message: ImportUsersResponse_ImportUserResult,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.id.length !== 0) {
      writer.uint32(10).bytes(message.id);
    }
    if (message.error !== undefined) {
      ImportUsersResponse_ImportUsersError.encode(
        message.error,
        writer.uint32(18).fork()
      ).ldelim();
    }
    return writer;
  },

  decode(
    input: Reader | Uint8Array,
    length?: number
  ): ImportUsersResponse_ImportUserResult {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = {
      ...baseImportUsersResponse_ImportUserResult,
    } as ImportUsersResponse_ImportUserResult;
    message.id = Buffer.alloc(0);
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.bytes() as Buffer;
          break;
        case 2:
          message.error = ImportUsersResponse_ImportUsersError.decode(
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

  fromJSON(object: any): ImportUsersResponse_ImportUserResult {
    const message = {
      ...baseImportUsersResponse_ImportUserResult,
    } as ImportUsersResponse_ImportUserResult;
    message.id = Buffer.alloc(0);
    if (object.id !== undefined && object.id !== null) {
      message.id = Buffer.from(bytesFromBase64(object.id));
    }
    if (object.error !== undefined && object.error !== null) {
      message.error = ImportUsersResponse_ImportUsersError.fromJSON(
        object.error
      );
    }
    return message;
  },

  toJSON(message: ImportUsersResponse_ImportUserResult): unknown {
    const obj: any = {};
    message.id !== undefined &&
      (obj.id = base64FromBytes(
        message.id !== undefined ? message.id : Buffer.alloc(0)
      ));
    message.error !== undefined &&
      (obj.error = message.error
        ? ImportUsersResponse_ImportUsersError.toJSON(message.error)
        : undefined);
    return obj;
  },

  fromPartial(
    object: DeepPartial<ImportUsersResponse_ImportUserResult>
  ): ImportUsersResponse_ImportUserResult {
    const message = {
      ...baseImportUsersResponse_ImportUserResult,
    } as ImportUsersResponse_ImportUserResult;
    if (object.id !== undefined && object.id !== null) {
      message.id = object.id;
    }
    if (object.error !== undefined && object.error !== null) {
      message.error = ImportUsersResponse_ImportUsersError.fromPartial(
        object.error
      );
    }
    return message;
  },
};

const baseImportUser: object = { uid: "", disabled: false };

export const ImportUser = {
  encode(message: ImportUser, writer: Writer = Writer.create()): Writer {
    if (message.uid !== "") {
      writer.uint32(10).string(message.uid);
    }
    if (message.password !== undefined) {
      PasswordCredential.encode(
        message.password,
        writer.uint32(18).fork()
      ).ldelim();
    }
    for (const v of message.providerUserInfo) {
      UserProvider.encode(v!, writer.uint32(26).fork()).ldelim();
    }
    if (message.disabled === true) {
      writer.uint32(32).bool(message.disabled);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): ImportUser {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseImportUser } as ImportUser;
    message.providerUserInfo = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.uid = reader.string();
          break;
        case 2:
          message.password = PasswordCredential.decode(reader, reader.uint32());
          break;
        case 3:
          message.providerUserInfo.push(
            UserProvider.decode(reader, reader.uint32())
          );
          break;
        case 4:
          message.disabled = reader.bool();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ImportUser {
    const message = { ...baseImportUser } as ImportUser;
    message.providerUserInfo = [];
    if (object.uid !== undefined && object.uid !== null) {
      message.uid = String(object.uid);
    }
    if (object.password !== undefined && object.password !== null) {
      message.password = PasswordCredential.fromJSON(object.password);
    }
    if (
      object.providerUserInfo !== undefined &&
      object.providerUserInfo !== null
    ) {
      for (const e of object.providerUserInfo) {
        message.providerUserInfo.push(UserProvider.fromJSON(e));
      }
    }
    if (object.disabled !== undefined && object.disabled !== null) {
      message.disabled = Boolean(object.disabled);
    }
    return message;
  },

  toJSON(message: ImportUser): unknown {
    const obj: any = {};
    message.uid !== undefined && (obj.uid = message.uid);
    message.password !== undefined &&
      (obj.password = message.password
        ? PasswordCredential.toJSON(message.password)
        : undefined);
    if (message.providerUserInfo) {
      obj.providerUserInfo = message.providerUserInfo.map((e) =>
        e ? UserProvider.toJSON(e) : undefined
      );
    } else {
      obj.providerUserInfo = [];
    }
    message.disabled !== undefined && (obj.disabled = message.disabled);
    return obj;
  },

  fromPartial(object: DeepPartial<ImportUser>): ImportUser {
    const message = { ...baseImportUser } as ImportUser;
    message.providerUserInfo = [];
    if (object.uid !== undefined && object.uid !== null) {
      message.uid = object.uid;
    }
    if (object.password !== undefined && object.password !== null) {
      message.password = PasswordCredential.fromPartial(object.password);
    }
    if (
      object.providerUserInfo !== undefined &&
      object.providerUserInfo !== null
    ) {
      for (const e of object.providerUserInfo) {
        message.providerUserInfo.push(UserProvider.fromPartial(e));
      }
    }
    if (object.disabled !== undefined && object.disabled !== null) {
      message.disabled = object.disabled;
    }
    return message;
  },
};

const baseUserMetadata: object = {
  creationTimestamp: "0",
  lastLogInTimestamp: "0",
  lastRefreshTimestamp: "0",
};

export const UserMetadata = {
  encode(message: UserMetadata, writer: Writer = Writer.create()): Writer {
    if (message.creationTimestamp !== "0") {
      writer.uint32(8).int64(message.creationTimestamp);
    }
    if (message.lastLogInTimestamp !== "0") {
      writer.uint32(16).int64(message.lastLogInTimestamp);
    }
    if (message.lastRefreshTimestamp !== "0") {
      writer.uint32(24).int64(message.lastRefreshTimestamp);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): UserMetadata {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseUserMetadata } as UserMetadata;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.creationTimestamp = longToString(reader.int64() as Long);
          break;
        case 2:
          message.lastLogInTimestamp = longToString(reader.int64() as Long);
          break;
        case 3:
          message.lastRefreshTimestamp = longToString(reader.int64() as Long);
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): UserMetadata {
    const message = { ...baseUserMetadata } as UserMetadata;
    if (
      object.creationTimestamp !== undefined &&
      object.creationTimestamp !== null
    ) {
      message.creationTimestamp = String(object.creationTimestamp);
    }
    if (
      object.lastLogInTimestamp !== undefined &&
      object.lastLogInTimestamp !== null
    ) {
      message.lastLogInTimestamp = String(object.lastLogInTimestamp);
    }
    if (
      object.lastRefreshTimestamp !== undefined &&
      object.lastRefreshTimestamp !== null
    ) {
      message.lastRefreshTimestamp = String(object.lastRefreshTimestamp);
    }
    return message;
  },

  toJSON(message: UserMetadata): unknown {
    const obj: any = {};
    message.creationTimestamp !== undefined &&
      (obj.creationTimestamp = message.creationTimestamp);
    message.lastLogInTimestamp !== undefined &&
      (obj.lastLogInTimestamp = message.lastLogInTimestamp);
    message.lastRefreshTimestamp !== undefined &&
      (obj.lastRefreshTimestamp = message.lastRefreshTimestamp);
    return obj;
  },

  fromPartial(object: DeepPartial<UserMetadata>): UserMetadata {
    const message = { ...baseUserMetadata } as UserMetadata;
    if (
      object.creationTimestamp !== undefined &&
      object.creationTimestamp !== null
    ) {
      message.creationTimestamp = object.creationTimestamp;
    }
    if (
      object.lastLogInTimestamp !== undefined &&
      object.lastLogInTimestamp !== null
    ) {
      message.lastLogInTimestamp = object.lastLogInTimestamp;
    }
    if (
      object.lastRefreshTimestamp !== undefined &&
      object.lastRefreshTimestamp !== null
    ) {
      message.lastRefreshTimestamp = object.lastRefreshTimestamp;
    }
    return message;
  },
};

const baseEmail: object = { email: "", verified: false };

export const Email = {
  encode(message: Email, writer: Writer = Writer.create()): Writer {
    if (message.email !== "") {
      writer.uint32(10).string(message.email);
    }
    if (message.verified === true) {
      writer.uint32(16).bool(message.verified);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): Email {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseEmail } as Email;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.email = reader.string();
          break;
        case 2:
          message.verified = reader.bool();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Email {
    const message = { ...baseEmail } as Email;
    if (object.email !== undefined && object.email !== null) {
      message.email = String(object.email);
    }
    if (object.verified !== undefined && object.verified !== null) {
      message.verified = Boolean(object.verified);
    }
    return message;
  },

  toJSON(message: Email): unknown {
    const obj: any = {};
    message.email !== undefined && (obj.email = message.email);
    message.verified !== undefined && (obj.verified = message.verified);
    return obj;
  },

  fromPartial(object: DeepPartial<Email>): Email {
    const message = { ...baseEmail } as Email;
    if (object.email !== undefined && object.email !== null) {
      message.email = object.email;
    }
    if (object.verified !== undefined && object.verified !== null) {
      message.verified = object.verified;
    }
    return message;
  },
};

const baseMobile: object = { mobile: "", verified: false };

export const Mobile = {
  encode(message: Mobile, writer: Writer = Writer.create()): Writer {
    if (message.mobile !== "") {
      writer.uint32(10).string(message.mobile);
    }
    if (message.verified === true) {
      writer.uint32(16).bool(message.verified);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): Mobile {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseMobile } as Mobile;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.mobile = reader.string();
          break;
        case 2:
          message.verified = reader.bool();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Mobile {
    const message = { ...baseMobile } as Mobile;
    if (object.mobile !== undefined && object.mobile !== null) {
      message.mobile = String(object.mobile);
    }
    if (object.verified !== undefined && object.verified !== null) {
      message.verified = Boolean(object.verified);
    }
    return message;
  },

  toJSON(message: Mobile): unknown {
    const obj: any = {};
    message.mobile !== undefined && (obj.mobile = message.mobile);
    message.verified !== undefined && (obj.verified = message.verified);
    return obj;
  },

  fromPartial(object: DeepPartial<Mobile>): Mobile {
    const message = { ...baseMobile } as Mobile;
    if (object.mobile !== undefined && object.mobile !== null) {
      message.mobile = object.mobile;
    }
    if (object.verified !== undefined && object.verified !== null) {
      message.verified = object.verified;
    }
    return message;
  },
};

const basePasswordCredential: object = {};

export const PasswordCredential = {
  encode(
    message: PasswordCredential,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.uid?.$case === "email") {
      Email.encode(message.uid.email, writer.uint32(10).fork()).ldelim();
    }
    if (message.uid?.$case === "mobile") {
      Mobile.encode(message.uid.mobile, writer.uint32(18).fork()).ldelim();
    }
    if (message.uid?.$case === "userName") {
      writer.uint32(26).string(message.uid.userName);
    }
    if (message.password?.$case === "value") {
      writer.uint32(34).string(message.password.value);
    }
    if (message.password?.$case === "hash") {
      PasswordHash.encode(
        message.password.hash,
        writer.uint32(42).fork()
      ).ldelim();
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): PasswordCredential {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...basePasswordCredential } as PasswordCredential;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.uid = {
            $case: "email",
            email: Email.decode(reader, reader.uint32()),
          };
          break;
        case 2:
          message.uid = {
            $case: "mobile",
            mobile: Mobile.decode(reader, reader.uint32()),
          };
          break;
        case 3:
          message.uid = { $case: "userName", userName: reader.string() };
          break;
        case 4:
          message.password = { $case: "value", value: reader.string() };
          break;
        case 5:
          message.password = {
            $case: "hash",
            hash: PasswordHash.decode(reader, reader.uint32()),
          };
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): PasswordCredential {
    const message = { ...basePasswordCredential } as PasswordCredential;
    if (object.email !== undefined && object.email !== null) {
      message.uid = { $case: "email", email: Email.fromJSON(object.email) };
    }
    if (object.mobile !== undefined && object.mobile !== null) {
      message.uid = { $case: "mobile", mobile: Mobile.fromJSON(object.mobile) };
    }
    if (object.userName !== undefined && object.userName !== null) {
      message.uid = { $case: "userName", userName: String(object.userName) };
    }
    if (object.value !== undefined && object.value !== null) {
      message.password = { $case: "value", value: String(object.value) };
    }
    if (object.hash !== undefined && object.hash !== null) {
      message.password = {
        $case: "hash",
        hash: PasswordHash.fromJSON(object.hash),
      };
    }
    return message;
  },

  toJSON(message: PasswordCredential): unknown {
    const obj: any = {};
    message.uid?.$case === "email" &&
      (obj.email = message.uid?.email
        ? Email.toJSON(message.uid?.email)
        : undefined);
    message.uid?.$case === "mobile" &&
      (obj.mobile = message.uid?.mobile
        ? Mobile.toJSON(message.uid?.mobile)
        : undefined);
    message.uid?.$case === "userName" && (obj.userName = message.uid?.userName);
    message.password?.$case === "value" &&
      (obj.value = message.password?.value);
    message.password?.$case === "hash" &&
      (obj.hash = message.password?.hash
        ? PasswordHash.toJSON(message.password?.hash)
        : undefined);
    return obj;
  },

  fromPartial(object: DeepPartial<PasswordCredential>): PasswordCredential {
    const message = { ...basePasswordCredential } as PasswordCredential;
    if (
      object.uid?.$case === "email" &&
      object.uid?.email !== undefined &&
      object.uid?.email !== null
    ) {
      message.uid = {
        $case: "email",
        email: Email.fromPartial(object.uid.email),
      };
    }
    if (
      object.uid?.$case === "mobile" &&
      object.uid?.mobile !== undefined &&
      object.uid?.mobile !== null
    ) {
      message.uid = {
        $case: "mobile",
        mobile: Mobile.fromPartial(object.uid.mobile),
      };
    }
    if (
      object.uid?.$case === "userName" &&
      object.uid?.userName !== undefined &&
      object.uid?.userName !== null
    ) {
      message.uid = { $case: "userName", userName: object.uid.userName };
    }
    if (
      object.password?.$case === "value" &&
      object.password?.value !== undefined &&
      object.password?.value !== null
    ) {
      message.password = { $case: "value", value: object.password.value };
    }
    if (
      object.password?.$case === "hash" &&
      object.password?.hash !== undefined &&
      object.password?.hash !== null
    ) {
      message.password = {
        $case: "hash",
        hash: PasswordHash.fromPartial(object.password.hash),
      };
    }
    return message;
  },
};

const basePasswordHash: object = {};

export const PasswordHash = {
  encode(message: PasswordHash, writer: Writer = Writer.create()): Writer {
    if (message.passwordHash.length !== 0) {
      writer.uint32(34).bytes(message.passwordHash);
    }
    if (message.salt.length !== 0) {
      writer.uint32(42).bytes(message.salt);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): PasswordHash {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...basePasswordHash } as PasswordHash;
    message.passwordHash = Buffer.alloc(0);
    message.salt = Buffer.alloc(0);
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 4:
          message.passwordHash = reader.bytes() as Buffer;
          break;
        case 5:
          message.salt = reader.bytes() as Buffer;
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): PasswordHash {
    const message = { ...basePasswordHash } as PasswordHash;
    message.passwordHash = Buffer.alloc(0);
    message.salt = Buffer.alloc(0);
    if (object.passwordHash !== undefined && object.passwordHash !== null) {
      message.passwordHash = Buffer.from(bytesFromBase64(object.passwordHash));
    }
    if (object.salt !== undefined && object.salt !== null) {
      message.salt = Buffer.from(bytesFromBase64(object.salt));
    }
    return message;
  },

  toJSON(message: PasswordHash): unknown {
    const obj: any = {};
    message.passwordHash !== undefined &&
      (obj.passwordHash = base64FromBytes(
        message.passwordHash !== undefined
          ? message.passwordHash
          : Buffer.alloc(0)
      ));
    message.salt !== undefined &&
      (obj.salt = base64FromBytes(
        message.salt !== undefined ? message.salt : Buffer.alloc(0)
      ));
    return obj;
  },

  fromPartial(object: DeepPartial<PasswordHash>): PasswordHash {
    const message = { ...basePasswordHash } as PasswordHash;
    if (object.passwordHash !== undefined && object.passwordHash !== null) {
      message.passwordHash = object.passwordHash;
    }
    if (object.salt !== undefined && object.salt !== null) {
      message.salt = object.salt;
    }
    return message;
  },
};

const baseUserProvider: object = {
  uid: "",
  providerId: "",
  email: "",
  displayName: "",
  photoUrl: "",
};

export const UserProvider = {
  encode(message: UserProvider, writer: Writer = Writer.create()): Writer {
    if (message.uid !== "") {
      writer.uint32(10).string(message.uid);
    }
    if (message.providerId !== "") {
      writer.uint32(18).string(message.providerId);
    }
    if (message.email !== "") {
      writer.uint32(26).string(message.email);
    }
    if (message.displayName !== "") {
      writer.uint32(34).string(message.displayName);
    }
    if (message.photoUrl !== "") {
      writer.uint32(42).string(message.photoUrl);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): UserProvider {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseUserProvider } as UserProvider;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.uid = reader.string();
          break;
        case 2:
          message.providerId = reader.string();
          break;
        case 3:
          message.email = reader.string();
          break;
        case 4:
          message.displayName = reader.string();
          break;
        case 5:
          message.photoUrl = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): UserProvider {
    const message = { ...baseUserProvider } as UserProvider;
    if (object.uid !== undefined && object.uid !== null) {
      message.uid = String(object.uid);
    }
    if (object.providerId !== undefined && object.providerId !== null) {
      message.providerId = String(object.providerId);
    }
    if (object.email !== undefined && object.email !== null) {
      message.email = String(object.email);
    }
    if (object.displayName !== undefined && object.displayName !== null) {
      message.displayName = String(object.displayName);
    }
    if (object.photoUrl !== undefined && object.photoUrl !== null) {
      message.photoUrl = String(object.photoUrl);
    }
    return message;
  },

  toJSON(message: UserProvider): unknown {
    const obj: any = {};
    message.uid !== undefined && (obj.uid = message.uid);
    message.providerId !== undefined && (obj.providerId = message.providerId);
    message.email !== undefined && (obj.email = message.email);
    message.displayName !== undefined &&
      (obj.displayName = message.displayName);
    message.photoUrl !== undefined && (obj.photoUrl = message.photoUrl);
    return obj;
  },

  fromPartial(object: DeepPartial<UserProvider>): UserProvider {
    const message = { ...baseUserProvider } as UserProvider;
    if (object.uid !== undefined && object.uid !== null) {
      message.uid = object.uid;
    }
    if (object.providerId !== undefined && object.providerId !== null) {
      message.providerId = object.providerId;
    }
    if (object.email !== undefined && object.email !== null) {
      message.email = object.email;
    }
    if (object.displayName !== undefined && object.displayName !== null) {
      message.displayName = object.displayName;
    }
    if (object.photoUrl !== undefined && object.photoUrl !== null) {
      message.photoUrl = object.photoUrl;
    }
    return message;
  },
};

const baseBcrypt: object = {};

export const Bcrypt = {
  encode(_: Bcrypt, writer: Writer = Writer.create()): Writer {
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): Bcrypt {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseBcrypt } as Bcrypt;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(_: any): Bcrypt {
    const message = { ...baseBcrypt } as Bcrypt;
    return message;
  },

  toJSON(_: Bcrypt): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial(_: DeepPartial<Bcrypt>): Bcrypt {
    const message = { ...baseBcrypt } as Bcrypt;
    return message;
  },
};

const baseStandardScrypt: object = {
  blockSize: "0",
  derivedKeyLength: "0",
  memoryCost: "0",
  parallelization: "0",
};

export const StandardScrypt = {
  encode(message: StandardScrypt, writer: Writer = Writer.create()): Writer {
    if (message.blockSize !== "0") {
      writer.uint32(8).int64(message.blockSize);
    }
    if (message.derivedKeyLength !== "0") {
      writer.uint32(16).int64(message.derivedKeyLength);
    }
    if (message.memoryCost !== "0") {
      writer.uint32(24).int64(message.memoryCost);
    }
    if (message.parallelization !== "0") {
      writer.uint32(32).int64(message.parallelization);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): StandardScrypt {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseStandardScrypt } as StandardScrypt;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.blockSize = longToString(reader.int64() as Long);
          break;
        case 2:
          message.derivedKeyLength = longToString(reader.int64() as Long);
          break;
        case 3:
          message.memoryCost = longToString(reader.int64() as Long);
          break;
        case 4:
          message.parallelization = longToString(reader.int64() as Long);
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): StandardScrypt {
    const message = { ...baseStandardScrypt } as StandardScrypt;
    if (object.blockSize !== undefined && object.blockSize !== null) {
      message.blockSize = String(object.blockSize);
    }
    if (
      object.derivedKeyLength !== undefined &&
      object.derivedKeyLength !== null
    ) {
      message.derivedKeyLength = String(object.derivedKeyLength);
    }
    if (object.memoryCost !== undefined && object.memoryCost !== null) {
      message.memoryCost = String(object.memoryCost);
    }
    if (
      object.parallelization !== undefined &&
      object.parallelization !== null
    ) {
      message.parallelization = String(object.parallelization);
    }
    return message;
  },

  toJSON(message: StandardScrypt): unknown {
    const obj: any = {};
    message.blockSize !== undefined && (obj.blockSize = message.blockSize);
    message.derivedKeyLength !== undefined &&
      (obj.derivedKeyLength = message.derivedKeyLength);
    message.memoryCost !== undefined && (obj.memoryCost = message.memoryCost);
    message.parallelization !== undefined &&
      (obj.parallelization = message.parallelization);
    return obj;
  },

  fromPartial(object: DeepPartial<StandardScrypt>): StandardScrypt {
    const message = { ...baseStandardScrypt } as StandardScrypt;
    if (object.blockSize !== undefined && object.blockSize !== null) {
      message.blockSize = object.blockSize;
    }
    if (
      object.derivedKeyLength !== undefined &&
      object.derivedKeyLength !== null
    ) {
      message.derivedKeyLength = object.derivedKeyLength;
    }
    if (object.memoryCost !== undefined && object.memoryCost !== null) {
      message.memoryCost = object.memoryCost;
    }
    if (
      object.parallelization !== undefined &&
      object.parallelization !== null
    ) {
      message.parallelization = object.parallelization;
    }
    return message;
  },
};

const baseScrypt: object = { rounds: "0", memoryCost: "0" };

export const Scrypt = {
  encode(message: Scrypt, writer: Writer = Writer.create()): Writer {
    if (message.key.length !== 0) {
      writer.uint32(10).bytes(message.key);
    }
    if (message.saltSeparator.length !== 0) {
      writer.uint32(18).bytes(message.saltSeparator);
    }
    if (message.rounds !== "0") {
      writer.uint32(24).int64(message.rounds);
    }
    if (message.memoryCost !== "0") {
      writer.uint32(32).int64(message.memoryCost);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): Scrypt {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseScrypt } as Scrypt;
    message.key = Buffer.alloc(0);
    message.saltSeparator = Buffer.alloc(0);
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.key = reader.bytes() as Buffer;
          break;
        case 2:
          message.saltSeparator = reader.bytes() as Buffer;
          break;
        case 3:
          message.rounds = longToString(reader.int64() as Long);
          break;
        case 4:
          message.memoryCost = longToString(reader.int64() as Long);
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Scrypt {
    const message = { ...baseScrypt } as Scrypt;
    message.key = Buffer.alloc(0);
    message.saltSeparator = Buffer.alloc(0);
    if (object.key !== undefined && object.key !== null) {
      message.key = Buffer.from(bytesFromBase64(object.key));
    }
    if (object.saltSeparator !== undefined && object.saltSeparator !== null) {
      message.saltSeparator = Buffer.from(
        bytesFromBase64(object.saltSeparator)
      );
    }
    if (object.rounds !== undefined && object.rounds !== null) {
      message.rounds = String(object.rounds);
    }
    if (object.memoryCost !== undefined && object.memoryCost !== null) {
      message.memoryCost = String(object.memoryCost);
    }
    return message;
  },

  toJSON(message: Scrypt): unknown {
    const obj: any = {};
    message.key !== undefined &&
      (obj.key = base64FromBytes(
        message.key !== undefined ? message.key : Buffer.alloc(0)
      ));
    message.saltSeparator !== undefined &&
      (obj.saltSeparator = base64FromBytes(
        message.saltSeparator !== undefined
          ? message.saltSeparator
          : Buffer.alloc(0)
      ));
    message.rounds !== undefined && (obj.rounds = message.rounds);
    message.memoryCost !== undefined && (obj.memoryCost = message.memoryCost);
    return obj;
  },

  fromPartial(object: DeepPartial<Scrypt>): Scrypt {
    const message = { ...baseScrypt } as Scrypt;
    if (object.key !== undefined && object.key !== null) {
      message.key = object.key;
    }
    if (object.saltSeparator !== undefined && object.saltSeparator !== null) {
      message.saltSeparator = object.saltSeparator;
    }
    if (object.rounds !== undefined && object.rounds !== null) {
      message.rounds = object.rounds;
    }
    if (object.memoryCost !== undefined && object.memoryCost !== null) {
      message.memoryCost = object.memoryCost;
    }
    return message;
  },
};

const baseHMACMD5: object = {};

export const HMACMD5 = {
  encode(message: HMACMD5, writer: Writer = Writer.create()): Writer {
    if (message.key.length !== 0) {
      writer.uint32(10).bytes(message.key);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): HMACMD5 {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseHMACMD5 } as HMACMD5;
    message.key = Buffer.alloc(0);
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.key = reader.bytes() as Buffer;
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): HMACMD5 {
    const message = { ...baseHMACMD5 } as HMACMD5;
    message.key = Buffer.alloc(0);
    if (object.key !== undefined && object.key !== null) {
      message.key = Buffer.from(bytesFromBase64(object.key));
    }
    return message;
  },

  toJSON(message: HMACMD5): unknown {
    const obj: any = {};
    message.key !== undefined &&
      (obj.key = base64FromBytes(
        message.key !== undefined ? message.key : Buffer.alloc(0)
      ));
    return obj;
  },

  fromPartial(object: DeepPartial<HMACMD5>): HMACMD5 {
    const message = { ...baseHMACMD5 } as HMACMD5;
    if (object.key !== undefined && object.key !== null) {
      message.key = object.key;
    }
    return message;
  },
};

const baseHMACSHA1: object = {};

export const HMACSHA1 = {
  encode(message: HMACSHA1, writer: Writer = Writer.create()): Writer {
    if (message.key.length !== 0) {
      writer.uint32(10).bytes(message.key);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): HMACSHA1 {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseHMACSHA1 } as HMACSHA1;
    message.key = Buffer.alloc(0);
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.key = reader.bytes() as Buffer;
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): HMACSHA1 {
    const message = { ...baseHMACSHA1 } as HMACSHA1;
    message.key = Buffer.alloc(0);
    if (object.key !== undefined && object.key !== null) {
      message.key = Buffer.from(bytesFromBase64(object.key));
    }
    return message;
  },

  toJSON(message: HMACSHA1): unknown {
    const obj: any = {};
    message.key !== undefined &&
      (obj.key = base64FromBytes(
        message.key !== undefined ? message.key : Buffer.alloc(0)
      ));
    return obj;
  },

  fromPartial(object: DeepPartial<HMACSHA1>): HMACSHA1 {
    const message = { ...baseHMACSHA1 } as HMACSHA1;
    if (object.key !== undefined && object.key !== null) {
      message.key = object.key;
    }
    return message;
  },
};

const baseHMACSHA512: object = {};

export const HMACSHA512 = {
  encode(message: HMACSHA512, writer: Writer = Writer.create()): Writer {
    if (message.key.length !== 0) {
      writer.uint32(10).bytes(message.key);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): HMACSHA512 {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseHMACSHA512 } as HMACSHA512;
    message.key = Buffer.alloc(0);
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.key = reader.bytes() as Buffer;
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): HMACSHA512 {
    const message = { ...baseHMACSHA512 } as HMACSHA512;
    message.key = Buffer.alloc(0);
    if (object.key !== undefined && object.key !== null) {
      message.key = Buffer.from(bytesFromBase64(object.key));
    }
    return message;
  },

  toJSON(message: HMACSHA512): unknown {
    const obj: any = {};
    message.key !== undefined &&
      (obj.key = base64FromBytes(
        message.key !== undefined ? message.key : Buffer.alloc(0)
      ));
    return obj;
  },

  fromPartial(object: DeepPartial<HMACSHA512>): HMACSHA512 {
    const message = { ...baseHMACSHA512 } as HMACSHA512;
    if (object.key !== undefined && object.key !== null) {
      message.key = object.key;
    }
    return message;
  },
};

const baseHMACSHA256: object = {};

export const HMACSHA256 = {
  encode(message: HMACSHA256, writer: Writer = Writer.create()): Writer {
    if (message.key.length !== 0) {
      writer.uint32(10).bytes(message.key);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): HMACSHA256 {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseHMACSHA256 } as HMACSHA256;
    message.key = Buffer.alloc(0);
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.key = reader.bytes() as Buffer;
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): HMACSHA256 {
    const message = { ...baseHMACSHA256 } as HMACSHA256;
    message.key = Buffer.alloc(0);
    if (object.key !== undefined && object.key !== null) {
      message.key = Buffer.from(bytesFromBase64(object.key));
    }
    return message;
  },

  toJSON(message: HMACSHA256): unknown {
    const obj: any = {};
    message.key !== undefined &&
      (obj.key = base64FromBytes(
        message.key !== undefined ? message.key : Buffer.alloc(0)
      ));
    return obj;
  },

  fromPartial(object: DeepPartial<HMACSHA256>): HMACSHA256 {
    const message = { ...baseHMACSHA256 } as HMACSHA256;
    if (object.key !== undefined && object.key !== null) {
      message.key = object.key;
    }
    return message;
  },
};

const baseMD5: object = { rounds: "0" };

export const MD5 = {
  encode(message: MD5, writer: Writer = Writer.create()): Writer {
    if (message.rounds !== "0") {
      writer.uint32(8).int64(message.rounds);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): MD5 {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseMD5 } as MD5;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.rounds = longToString(reader.int64() as Long);
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): MD5 {
    const message = { ...baseMD5 } as MD5;
    if (object.rounds !== undefined && object.rounds !== null) {
      message.rounds = String(object.rounds);
    }
    return message;
  },

  toJSON(message: MD5): unknown {
    const obj: any = {};
    message.rounds !== undefined && (obj.rounds = message.rounds);
    return obj;
  },

  fromPartial(object: DeepPartial<MD5>): MD5 {
    const message = { ...baseMD5 } as MD5;
    if (object.rounds !== undefined && object.rounds !== null) {
      message.rounds = object.rounds;
    }
    return message;
  },
};

const basePBKDF2SHA256: object = { rounds: "0" };

export const PBKDF2SHA256 = {
  encode(message: PBKDF2SHA256, writer: Writer = Writer.create()): Writer {
    if (message.rounds !== "0") {
      writer.uint32(8).int64(message.rounds);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): PBKDF2SHA256 {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...basePBKDF2SHA256 } as PBKDF2SHA256;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.rounds = longToString(reader.int64() as Long);
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): PBKDF2SHA256 {
    const message = { ...basePBKDF2SHA256 } as PBKDF2SHA256;
    if (object.rounds !== undefined && object.rounds !== null) {
      message.rounds = String(object.rounds);
    }
    return message;
  },

  toJSON(message: PBKDF2SHA256): unknown {
    const obj: any = {};
    message.rounds !== undefined && (obj.rounds = message.rounds);
    return obj;
  },

  fromPartial(object: DeepPartial<PBKDF2SHA256>): PBKDF2SHA256 {
    const message = { ...basePBKDF2SHA256 } as PBKDF2SHA256;
    if (object.rounds !== undefined && object.rounds !== null) {
      message.rounds = object.rounds;
    }
    return message;
  },
};

const basePBKDFSHA1: object = { rounds: "0" };

export const PBKDFSHA1 = {
  encode(message: PBKDFSHA1, writer: Writer = Writer.create()): Writer {
    if (message.rounds !== "0") {
      writer.uint32(8).int64(message.rounds);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): PBKDFSHA1 {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...basePBKDFSHA1 } as PBKDFSHA1;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.rounds = longToString(reader.int64() as Long);
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): PBKDFSHA1 {
    const message = { ...basePBKDFSHA1 } as PBKDFSHA1;
    if (object.rounds !== undefined && object.rounds !== null) {
      message.rounds = String(object.rounds);
    }
    return message;
  },

  toJSON(message: PBKDFSHA1): unknown {
    const obj: any = {};
    message.rounds !== undefined && (obj.rounds = message.rounds);
    return obj;
  },

  fromPartial(object: DeepPartial<PBKDFSHA1>): PBKDFSHA1 {
    const message = { ...basePBKDFSHA1 } as PBKDFSHA1;
    if (object.rounds !== undefined && object.rounds !== null) {
      message.rounds = object.rounds;
    }
    return message;
  },
};

const baseSHA1: object = { rounds: "0" };

export const SHA1 = {
  encode(message: SHA1, writer: Writer = Writer.create()): Writer {
    if (message.rounds !== "0") {
      writer.uint32(8).int64(message.rounds);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): SHA1 {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseSHA1 } as SHA1;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.rounds = longToString(reader.int64() as Long);
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): SHA1 {
    const message = { ...baseSHA1 } as SHA1;
    if (object.rounds !== undefined && object.rounds !== null) {
      message.rounds = String(object.rounds);
    }
    return message;
  },

  toJSON(message: SHA1): unknown {
    const obj: any = {};
    message.rounds !== undefined && (obj.rounds = message.rounds);
    return obj;
  },

  fromPartial(object: DeepPartial<SHA1>): SHA1 {
    const message = { ...baseSHA1 } as SHA1;
    if (object.rounds !== undefined && object.rounds !== null) {
      message.rounds = object.rounds;
    }
    return message;
  },
};

const baseSHA256: object = { rounds: "0" };

export const SHA256 = {
  encode(message: SHA256, writer: Writer = Writer.create()): Writer {
    if (message.rounds !== "0") {
      writer.uint32(8).int64(message.rounds);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): SHA256 {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseSHA256 } as SHA256;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.rounds = longToString(reader.int64() as Long);
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): SHA256 {
    const message = { ...baseSHA256 } as SHA256;
    if (object.rounds !== undefined && object.rounds !== null) {
      message.rounds = String(object.rounds);
    }
    return message;
  },

  toJSON(message: SHA256): unknown {
    const obj: any = {};
    message.rounds !== undefined && (obj.rounds = message.rounds);
    return obj;
  },

  fromPartial(object: DeepPartial<SHA256>): SHA256 {
    const message = { ...baseSHA256 } as SHA256;
    if (object.rounds !== undefined && object.rounds !== null) {
      message.rounds = object.rounds;
    }
    return message;
  },
};

const baseSHA512: object = { rounds: "0" };

export const SHA512 = {
  encode(message: SHA512, writer: Writer = Writer.create()): Writer {
    if (message.rounds !== "0") {
      writer.uint32(8).int64(message.rounds);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): SHA512 {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseSHA512 } as SHA512;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.rounds = longToString(reader.int64() as Long);
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): SHA512 {
    const message = { ...baseSHA512 } as SHA512;
    if (object.rounds !== undefined && object.rounds !== null) {
      message.rounds = String(object.rounds);
    }
    return message;
  },

  toJSON(message: SHA512): unknown {
    const obj: any = {};
    message.rounds !== undefined && (obj.rounds = message.rounds);
    return obj;
  },

  fromPartial(object: DeepPartial<SHA512>): SHA512 {
    const message = { ...baseSHA512 } as SHA512;
    if (object.rounds !== undefined && object.rounds !== null) {
      message.rounds = object.rounds;
    }
    return message;
  },
};

declare var self: any | undefined;
declare var window: any | undefined;
declare var global: any | undefined;
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

function longToString(long: Long) {
  return long.toString();
}

// If you get a compile-error about 'Constructor<Long> and ... have no overlap',
// add '--ts_proto_opt=esModuleInterop=true' as a flag when calling 'protoc'.
if (util.Long !== Long) {
  util.Long = Long as any;
  configure();
}
