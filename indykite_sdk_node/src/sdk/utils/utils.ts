import { JsonObject, JsonValue } from '@protobuf-ts/runtime';
import { parse, stringify } from 'uuid';
import { Any } from '../../grpc/google/protobuf/any';
import { Duration } from '../../grpc/google/protobuf/duration';
import { Timestamp } from '../../grpc/google/protobuf/timestamp';
import { PostalAddress } from '../../grpc/indykite/identity/v1beta2/model';
import { Value } from '../../grpc/indykite/objects/v1beta1/struct';
import { SdkError, SdkErrorCode } from '../error';

type UnknownObject = { [k: string]: unknown };
export class Utils {
  /**
   * Returns the UUIDv4 format of the id.
   * @param id The value may be either `Buffer`, `Array`, `UUIDv4 string` or `base64 string`.
   */
  static uuidToString(id: string | Uint8Array | undefined | Buffer): string {
    switch (typeof id) {
      case 'string':
        return [32, 36].includes(id.length)
          ? Utils.uuid32ToUuid36(id)
          : stringify(Buffer.from(id, 'base64'));
      case 'undefined':
        return '';
      case 'object':
        return stringify(id);
    }
  }

  /**
   * Returns the UUIDv4 format of the id in the Base64 encoding.
   * @param id The value in the `UUIDv4 string` format.
   */
  static uuidToBase64(id: string | Buffer | Uint8Array): string {
    if (id instanceof Buffer) {
      return id.toString('base64');
    } else if (id instanceof Uint8Array) {
      return Buffer.from(id).toString('base64');
    }

    return [32, 36].includes(id.length)
      ? this.uuidToBase64(Uint8Array.from(parse(Utils.uuid32ToUuid36(id))))
      : id;
  }

  /**
   * Creates an object with `digitalTwin` property containing `id` and `tenantId`
   * properties with base64 encoded values.
   */
  static createDigitalTwinId(
    id: string | Uint8Array | Buffer,
    tenantId: string | Uint8Array | Buffer,
  ): { digitalTwin: { id: string; tenantId: string } } {
    return {
      digitalTwin: {
        id: this.getBase64Id(id),
        tenantId: this.getBase64Id(tenantId),
      },
    };
  }

  static createDigitalTwinIdFromToken(token: string): { accessToken: string } {
    return {
      accessToken: token,
    };
  }

  /**
   * Returns the Buffer instance containing the id.
   * @param uuid The value may be either `Buffer`, `Array`, `UUIDv4 string` or `base64 string`.
   */
  static uuidToBuffer(uuid: string | Uint8Array | Buffer): Buffer {
    if (typeof uuid === 'string') {
      return [32, 36].includes(uuid.length)
        ? Buffer.from(parse(Utils.uuid32ToUuid36(uuid)) as Uint8Array)
        : Buffer.from(uuid, 'base64');
    }

    if (uuid instanceof Buffer) {
      return uuid;
    }

    return Buffer.from(uuid);
  }

  /**
   * Returns the Uint8Array instance containing the id.
   * @param uuid The value may be either `Buffer`, `Array`, `UUIDv4 string` or `base64 string`.
   */
  static uuidToUint8Array(uuid: string | Uint8Array | Buffer): Uint8Array {
    if (uuid instanceof Uint8Array) {
      return uuid;
    }

    return Uint8Array.from(this.uuidToBuffer(uuid));
  }

  /**
   * Returns the Date instance equal to the passed Timestamp object.
   */
  static timestampToDate(timestamp: Timestamp): Date;

  /**
   * Returns the Date instance equal to the passed Timestamp object. If the parameter
   * is `undefined` then the returned value is `undefined` as well.
   */
  static timestampToDate(timestamp?: Timestamp): Date | undefined;

  static timestampToDate(timestamp?: Timestamp): Date | undefined {
    if (!timestamp) return;

    const seconds = parseInt(timestamp.seconds) * 1000;
    const milis = timestamp.nanos ? timestamp.nanos / 1000000 : 0;
    return new Date(seconds + milis);
  }

  static dateToTimestamp(date: Date): Timestamp;
  static dateToTimestamp(date?: Date): Timestamp | undefined;
  static dateToTimestamp(date?: Date): Timestamp | undefined {
    if (!date) return;

    const time = date.getTime();
    const seconds = Math.floor(time / 1000);
    const nanos = (time % 1000) * 1000000;
    return {
      seconds: seconds.toString(),
      nanos,
    };
  }

  static durationToNumber(duration: Duration): number;
  static durationToNumber(duration?: Duration): number | undefined;
  static durationToNumber(duration?: Duration): number | undefined {
    if (!duration) return;

    return parseInt(duration.seconds) + duration.nanos / 1000000;
  }

  static numberToDuration(duration: number): Duration;
  static numberToDuration(duration?: number): Duration | undefined;
  static numberToDuration(duration?: number): Duration | undefined {
    if (duration === undefined) return;

    return {
      seconds: Math.floor(duration).toString(),
      nanos: (duration * 1000000) % 1000000,
    };
  }

  static dateToSeconds(date: Date): number {
    return Math.floor(date.getTime() / 1000);
  }

  static deserializeValue(v: Value): unknown {
    if (v && v.value) {
      switch (v.value.oneofKind) {
        case 'nullValue':
          return v.value.nullValue;
        case 'boolValue':
          return v.value.boolValue;
        case 'integerValue':
          return v.value.integerValue;
        case 'unsignedIntegerValue':
          return v.value.unsignedIntegerValue;
        case 'doubleValue':
          return v.value.doubleValue;
        case 'anyValue': {
          if (Any.typeNameToUrl(PostalAddress.typeName) === v.value.anyValue.typeUrl) {
            return PostalAddress.fromBinary(v.value.anyValue.value);
          }
          return v.value.anyValue;
        }
        case 'valueTime':
          return v.value.valueTime;
        case 'durationValue':
          return v.value.durationValue;
        case 'stringValue':
          return v.value.stringValue;
        case 'bytesValue':
          return v.value.bytesValue;
        case 'geoPointValue':
          return v.value.geoPointValue;
        case 'arrayValue':
          return v.value.arrayValue.values.map((v: Value) => Utils.deserializeValue(v));
        case 'mapValue': {
          const m: { [k: string]: unknown } = {};
          Object.entries(v.value.mapValue.fields).forEach(([k, v]) => {
            m[k] = Utils.deserializeValue(v);
          });
          return m;
        }
      }
    }
    return undefined;
  }

  static objectToJsonValue(value: unknown): JsonValue {
    if (
      typeof value === 'object' &&
      value &&
      ('geoPointValue' in value || 'durationValue' in value || 'bytesValue' in value)
    ) {
      return value as JsonObject;
    }

    switch (typeof value) {
      case 'boolean':
        return { boolValue: value };
      case 'number':
        return { doubleValue: value };
      case 'string':
        return { stringValue: value };
      case 'object': {
        if (value === null) return { nullValue: null };
        if (value instanceof Date) return { valueTime: value.toISOString() };
        if (Array.isArray(value)) {
          return {
            arrayValue: {
              values: value.map((v) => this.objectToJsonValue(v)),
            },
          };
        }
        if (PostalAddress.is(value)) {
          return {
            anyValue: {
              ...value,
              ['@type']: Any.typeNameToUrl(PostalAddress.typeName),
            },
          };
        }
        const m: JsonObject = {};
        Object.entries(value as UnknownObject).forEach(([k, v]) => {
          m[k] = this.objectToJsonValue(v);
        });
        return {
          mapValue: {
            fields: { ...m },
          },
        };
      }
    }
    //TODO: add anyValue
    // anyValue: Any ///expects Buffer

    throw new SdkError(SdkErrorCode.SDK_CODE_1, 'Unable to convert a value');
  }

  static objectToValue(value: unknown): Value {
    return Value.fromJson(Utils.objectToJsonValue(value), { typeRegistry: [PostalAddress] });
  }

  private static getBase64Id(id: string | Uint8Array | Buffer): string {
    if (typeof id === 'string' && id.charAt(8) !== '-') {
      return id;
    }

    return this.uuidToBuffer(id).toString('base64');
  }

  /**
   * Converts the UUID encoded with 32 characters to the 36 characters UUID format (with dash symbols).
   * If the UUID is already encoded with 36 characters, the original value is returned.
   * @param id The UUID encoded either with 32 or 36 characters.
   * @returns The UUID encoded with 36 characters.
   */
  private static uuid32ToUuid36(id: string) {
    if (!/[a-zA-Z0-9+/=]{32}/.test(id) && !/[a-zA-Z0-9+/=-]{36}/.test(id)) {
      throw new SdkError(SdkErrorCode.SDK_CODE_1, 'Invalid UUID encoding');
    }

    if (id.length === 36) return id;

    const part1 = id.substring(0, 8);
    const part2 = id.substring(8, 12);
    const part3 = id.substring(12, 16);
    const part4 = id.substring(16, 20);
    const part5 = id.substring(20, 32);
    return `${part1}-${part2}-${part3}-${part4}-${part5}`;
  }

  static parseDuration(duration:string):Date{
    const pattern = new RegExp(/^(?!$)(\d+(?:\.\d+)?h)?(\d+(?:\.\d+)?m)?(\d+(?:\.\d+)?s)?(\d+(?:\.\d+)?ms)?(\d+(?:\.\d+)?us)?(\d+(?:\.\d+)?ns)?/g);
    if (!pattern.test(duration)){
      throw new SdkError(SdkErrorCode.SDK_CODE_1, 'Invalid Duration format!');
    }
    const SIXTY = 60;
    let result = new Date(0,0,0,0,0,0,0);
    const values = duration.split(pattern);
    if (values && !values.reduce((acc, value, idx)=>{
      if (!idx) return acc; 
      return acc || !!!value;
    }, false)){
      throw new SdkError(SdkErrorCode.SDK_CODE_1, 'Invalid Duration format!');
    }
    // hours
    if (values && values[1]){
      const hours = parseFloat(values[1].replace("h","")) * SIXTY;
      result.setHours(hours / SIXTY >> 0, hours % SIXTY); // force integers
    }
    // minutes
    if (values && values[2]){
      const minutes = parseFloat(values[2].replace("m","")) * SIXTY;
      result.setMinutes(minutes / SIXTY >> 0, minutes % SIXTY); // force integers
    }
    // seconds
    if (values && values[3]){
      const seconds = parseFloat(values[3].replace("s","")) * SIXTY;
      result.setSeconds(seconds / SIXTY >> 0, seconds % SIXTY); // force integers
    }
    // miliseconds
    if (values && values[4]){
      const mseconds = parseFloat(values[4].replace("s",""));
      result.setMilliseconds(mseconds >> 0); // force integers
    }
    // ignore us (micro - idx 5),ns (nano - idx 6)
    const tmpTime = result.getTime();
    if (tmpTime < 2 * 60 * 1000 && tmpTime > 24 * 60 * 60 * 1000){
      throw new SdkError(SdkErrorCode.SDK_CODE_1, 'Invalid Duration value (>= 2m, <= 24h)');
    }
    return result;
  }
}
