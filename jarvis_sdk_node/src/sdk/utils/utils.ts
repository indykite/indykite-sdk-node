import { parse, stringify } from 'uuid';
import { Timestamp } from '../../grpc/google/protobuf/timestamp';
import { StringValue } from '../../grpc/google/protobuf/wrappers';
import { SdkError, SdkErrorCode } from '../error';
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

  static dateToTimestamp(date: Date): Timestamp {
    const time = date.getTime();
    const seconds = Math.floor(time / 1000);
    const nanos = (time % 1000) * 1000000;
    return {
      seconds: seconds.toString(),
      nanos,
    };
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
}
