import { parse, stringify } from 'uuid';
export class Utils {
  /**
   * Returns the UUIDv4 format of the id.
   * @param id The value may be either `Buffer`, `Array`, `UUIDv4 string` or `base64 string`.
   */
  static uuidToString(id: string | Uint8Array | undefined | Buffer): string {
    switch (typeof id) {
      case 'string':
        return id.charAt(8) === '-' ? id : stringify(Buffer.from(id, 'base64'));
      case 'undefined':
        return '';
      case 'object':
        return stringify(id);
    }
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
      return uuid.charAt(8) === '-'
        ? Buffer.from(parse(uuid) as Uint8Array)
        : Buffer.from(uuid, 'base64');
    }

    if (uuid instanceof Buffer) {
      return uuid;
    }

    return Buffer.from(uuid);
  }

  private static getBase64Id(id: string | Uint8Array | Buffer): string {
    if (typeof id === 'string' && id.charAt(8) !== '-') {
      return id;
    }

    return this.uuidToBuffer(id).toString('base64');
  }
}
