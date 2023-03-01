import { parse, stringify, v4 } from 'uuid';
import { Any } from '../../../grpc/google/protobuf/any';
import { NullValue } from '../../../grpc/google/protobuf/struct';
import { PostalAddress } from '../../../grpc/indykite/identity/v1beta2/model';
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

describe('objectToValue', () => {
  it('geo, duration, bytes', () => {
    const geo = { geoPointValue: {} };
    const duration = { durationValue: '1s' };
    const bytes = { bytesValue: '' };
    expect(Utils.objectToValue(geo)).toEqual({
      value: {
        oneofKind: 'geoPointValue',
        geoPointValue: {
          latitude: 0,
          longitude: 0,
        },
      },
    });
    expect(Utils.objectToValue(duration)).toEqual({
      value: {
        oneofKind: 'durationValue',
        durationValue: {
          seconds: '1',
          nanos: 0,
        },
      },
    });
    expect(Utils.objectToValue(bytes)).toEqual({
      value: {
        oneofKind: 'bytesValue',
        bytesValue: Uint8Array.from([]),
      },
    });
  });

  it('PostalAddress', () => {
    const address = PostalAddress.fromJson(
      {
        addressCountry: 'Slovakia',
      },
      { typeRegistry: [PostalAddress] },
    );
    expect(Utils.objectToValue(address)).toEqual({
      value: {
        oneofKind: 'anyValue',
        anyValue: {
          typeUrl: Any.typeNameToUrl(PostalAddress.typeName),
          value: PostalAddress.toBinary({
            addressCountry: 'Slovakia',
            addressCountryCode: '',
            addressLocality: '',
            addressRegion: '',
            addressType: '',
            formatted: '',
            postOfficeBoxNumber: '',
            postalCode: '',
            streetAddress: '',
          }),
        },
      },
    });
  });

  it('date', () => {
    const d = new Date('2022-04-21T08:23:55.988Z');
    expect(Utils.objectToValue(d)).toEqual({
      value: {
        oneofKind: 'valueTime',
        valueTime: {
          nanos: 988000000,
          seconds: '1650529435',
        },
      },
    });
  });

  it('null', () => {
    expect(Utils.objectToValue(null)).toEqual({
      value: { oneofKind: 'nullValue', nullValue: NullValue.NULL_VALUE },
    });
  });

  it('object', () => {
    expect(Utils.objectToValue({ answer: 42 })).toEqual({
      value: {
        oneofKind: 'mapValue',
        mapValue: { fields: { answer: { value: { oneofKind: 'doubleValue', doubleValue: 42 } } } },
      },
    });
  });
});

describe('objectToJsonValue', () => {
  it('geo, duration, bytes', () => {
    const geo = { geoPointValue: 'geoPointValue' };
    const duration = { durationValue: 'durationValue' };
    const bytes = { bytesValue: 'bytesValue' };
    expect(Utils.objectToJsonValue(geo)).toEqual(geo);
    expect(Utils.objectToJsonValue(duration)).toEqual(duration);
    expect(Utils.objectToJsonValue(bytes)).toEqual(bytes);
  });

  it('PostalAddress', () => {
    const address = PostalAddress.fromJson(
      {
        addressCountry: 'Slovakia',
      },
      { typeRegistry: [PostalAddress] },
    );
    expect(Utils.objectToJsonValue(address)).toEqual({
      anyValue: {
        ['@type']: Any.typeNameToUrl(PostalAddress.typeName),
        addressCountry: 'Slovakia',
        addressCountryCode: '',
        addressLocality: '',
        addressRegion: '',
        addressType: '',
        formatted: '',
        postOfficeBoxNumber: '',
        postalCode: '',
        streetAddress: '',
      },
    });
  });

  it('date', () => {
    const d = new Date('2022-04-21T08:23:55.988Z');
    expect(Utils.objectToJsonValue(d)).toEqual({ valueTime: '2022-04-21T08:23:55.988Z' });
  });

  it('null', () => {
    expect(Utils.objectToJsonValue(null)).toEqual({ nullValue: null });
  });

  it('object', () => {
    expect(Utils.objectToJsonValue({ answer: 42 })).toEqual({
      mapValue: { fields: { answer: { doubleValue: 42 } } },
    });
  });
});

describe('duration and number conversions', () => {
  it('converts duration to number', () => {
    expect(Utils.durationToNumber()).toBeUndefined();
    expect(Utils.durationToNumber({ seconds: '0', nanos: 0 })).toBe(0);
    expect(Utils.durationToNumber({ seconds: '0', nanos: 500000 })).toBe(0.5);
    expect(Utils.durationToNumber({ seconds: '16', nanos: 0 })).toBe(16);
    expect(Utils.durationToNumber({ seconds: '71', nanos: 250000 })).toBe(71.25);
  });

  it('converts number to duration', () => {
    expect(Utils.numberToDuration()).toBeUndefined();
    expect(Utils.numberToDuration(0)).toEqual({ seconds: '0', nanos: 0 });
    expect(Utils.numberToDuration(0.5)).toEqual({ seconds: '0', nanos: 500000 });
    expect(Utils.numberToDuration(16)).toEqual({ seconds: '16', nanos: 0 });
    expect(Utils.numberToDuration(71.25)).toEqual({ seconds: '71', nanos: 250000 });
  });
});
