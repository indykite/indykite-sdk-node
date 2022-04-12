import { parse, stringify, v4 } from 'uuid';
import { Utils } from '../utils';

describe('Utils', () => {
  it('Digital Twins', () => {
    const token = 'SOME_TOKEN';
    expect(Utils.createDigitalTwinIdFromToken(token)).toEqual({
      accessToken: token,
    });

    const dId = parse(v4()) as Uint8Array;
    const tId = parse(v4()) as Uint8Array;
    const dIdUuid = stringify(dId);
    const tIdUuid = stringify(tId);
    const dIdBuffer = Buffer.from(dId);
    const tIdBuffer = Buffer.from(tId);
    const dIdBase64 = dIdBuffer.toString('base64');
    const tIdBase64 = tIdBuffer.toString('base64');
    expect(Utils.createDigitalTwinId(dId, tId)).toEqual({
      digitalTwin: {
        id: dIdBase64,
        tenantId: tIdBase64,
      },
    });
    expect(Utils.createDigitalTwinId(dIdBuffer, tIdBuffer)).toEqual({
      digitalTwin: {
        id: dIdBase64,
        tenantId: tIdBase64,
      },
    });
    expect(Utils.createDigitalTwinId(dIdUuid, tIdUuid)).toEqual({
      digitalTwin: {
        id: dIdBase64,
        tenantId: tIdBase64,
      },
    });
    expect(Utils.createDigitalTwinId(dIdBase64, tIdBase64)).toEqual({
      digitalTwin: {
        id: dIdBase64,
        tenantId: tIdBase64,
      },
    });
  });
  it('Transform UUID', () => {
    const arrayId = parse(v4()) as Uint8Array;
    const uuid = stringify(arrayId);
    const uuid32 = uuid.replace(/-/g, '');
    const bufferId = Buffer.from(arrayId);
    const base64Id = bufferId.toString('base64');
    let undf; //undefined

    expect(Utils.uuidToBuffer(arrayId).valueOf()).toEqual(bufferId.valueOf());
    expect(Utils.uuidToBuffer(uuid).valueOf()).toEqual(bufferId.valueOf());
    expect(Utils.uuidToBuffer(uuid32).valueOf()).toEqual(bufferId.valueOf());
    expect(Utils.uuidToBuffer(bufferId).valueOf()).toEqual(bufferId.valueOf());
    expect(Utils.uuidToBuffer(base64Id).valueOf()).toEqual(bufferId.valueOf());
    expect(Utils.uuidToString(arrayId).valueOf()).toEqual(uuid);
    expect(Utils.uuidToString(uuid).valueOf()).toEqual(uuid);
    expect(Utils.uuidToString(uuid32).valueOf()).toEqual(uuid);
    expect(Utils.uuidToString(bufferId).valueOf()).toEqual(uuid);
    expect(Utils.uuidToString(base64Id).valueOf()).toEqual(uuid);
    expect(Utils.uuidToString(undf).valueOf()).toEqual('');
    expect(Utils.uuidToBase64(arrayId).valueOf()).toEqual(base64Id);
    expect(Utils.uuidToBase64(uuid).valueOf()).toEqual(base64Id);
    expect(Utils.uuidToBase64(uuid32).valueOf()).toEqual(base64Id);
    expect(Utils.uuidToBase64(bufferId).valueOf()).toEqual(base64Id);
    expect(Utils.uuidToBase64(base64Id).valueOf()).toEqual(base64Id);

    let thrownError;
    try {
      Utils.uuidToString('123456789012345678901234567890??');
    } catch (err) {
      thrownError = err;
    }

    expect(thrownError).toHaveProperty('message', 'Invalid UUID encoding');
  });
});
