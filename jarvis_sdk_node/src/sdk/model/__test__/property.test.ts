import { v4 } from 'uuid';
import { Any } from '../../../grpc/google/protobuf/any';
import { Duration } from '../../../grpc/google/protobuf/duration';
import { NullValue } from '../../../grpc/google/protobuf/struct';
import { LatLng } from '../../../grpc/google/type/latlng';
import * as grpcAttr from '../../../grpc/indykite/identity/v1beta1/attributes';
import { Identifier } from '../../../grpc/indykite/objects/v1beta1/id';
import { Value } from '../../../grpc/indykite/objects/v1beta1/struct';
import { SdkError, SdkErrorCode } from '../../error';
import { PatchPropertiesBuilder, Property } from '../property';

describe('properties', () => {
  it('deserialize - error', () => {
    const p1 = grpcAttr.Property.fromJSON({
      id: v4(),
      value: { $case: 'referenceValue', referenceValue: 'some_reference' },
    });
    const mockErr = new SdkError(
      SdkErrorCode.SDK_CODE_1,
      `Can't deserialize property: ${JSON.stringify(p1, null, 2)}`,
    );
    try {
      Property.deserialize(p1);
    } catch (error) {
      const err = error as SdkErrorCode;
      expect(err).toEqual(mockErr);
    }
  });

  it('deserialize values', () => {
    [
      { nullValue: NullValue.NULL_VALUE },
      { boolValue: true },
      { value: { integerValue: 10 } },
      { unsignedIntegerValue: 10 },
      { doubleValue: 1.2 },
      { anyValue: Any.fromJSON({}) },
      { valueTime: new Date() },
      {
        durationValue: Duration.fromJSON({ seconds: 20 }),
      },
      {
        identifierValue: Identifier.fromJSON({
          idString: 'string_id',
        }),
      },
      { stringValue: 'string' },
      { bytesValue: Buffer.from(v4()) },
      {
        geoPointValue: LatLng.fromJSON({
          latitude: 45,
          longitude: -45,
        }),
      },
      {
        arrayValue: { values: [{ integerValue: 10 }] },
      },
      {
        mapValue: {
          fields: {
            key1: { integerValue: 10 },
          },
        },
      },
    ].forEach((valueType) => {
      const p1 = grpcAttr.Property.fromJSON({
        id: v4(),
        meta: {
          priority: true,
        },
        definition: {
          property: 'property',
        },
      });
      p1.value = {
        $case: 'objectValue',
        objectValue: Value.fromJSON(valueType),
      };
      const sdkProp = Property.deserialize(p1);
      expect(sdkProp.value).not.toBeNull();
    });
  });

  it('value & reference', () => {
    const prop = grpcAttr.Property.fromJSON({
      id: v4(),
      definition: {
        property: 'email',
      },

      meta: { primary: true },
    });
    prop.value = { $case: 'referenceValue', referenceValue: 'some_reference' };

    const sdkProp = Property.deserialize(prop);
    sdkProp.withValue('test+email@indykite.com');
    expect(sdkProp).toHaveProperty('value');
    expect(sdkProp).not.toHaveProperty('reference');
    expect(sdkProp.value).toEqual('test+email@indykite.com');

    sdkProp.withReference('SOME_REFERANCE');
    expect(sdkProp).toHaveProperty('reference');
    expect(sdkProp).not.toHaveProperty('value');
    expect(sdkProp.reference).toEqual('SOME_REFERANCE');

    expect(sdkProp.isPrimary()).toBeTruthy();
    sdkProp.withMetadata(false);
    expect(sdkProp.isPrimary()).toBeFalsy();

    const builder = PatchPropertiesBuilder.newBuilder().updateProperty(sdkProp);
    expect(builder.operations).toHaveLength(1);
    let bo = builder.operations.find((bo) => bo.operation?.$case === 'replace');
    expect(bo).not.toBeNull();

    builder.addProperty(
      new Property('firstName', v4()).withMetadata(true).withReference('some_reference'),
    );
    expect(builder.operations).toHaveLength(2);
    bo = builder.operations.find((bo) => bo.operation?.$case === 'add');
    expect(bo).not.toBeNull();

    //property needs a value to be added
    builder.addProperty(new Property('firstName', v4()).withMetadata(true));
    expect(builder.operations).toHaveLength(2);

    builder.addProperty(
      new Property('firstName', v4()).withMetadata(true).withValue(['first', 'second']),
    );
    expect(builder.operations).toHaveLength(3);
    bo = builder.operations.find(
      (bo) =>
        bo.operation?.$case === 'add' && bo.operation?.add.definition?.property === 'firstName',
    );
    expect(bo).not.toBeNull();

    builder.addProperty(new Property('double', v4()).withValue(2.6));
    expect(builder.operations).toHaveLength(4);
    bo = builder.operations.find(
      (bo) => bo.operation?.$case === 'add' && bo.operation?.add.definition?.property === 'double',
    );
    expect(bo).not.toBeNull();

    delete prop.meta;
    const sdkPropNoMeta = Property.deserialize(prop);
    expect(sdkPropNoMeta.meta).toBeUndefined();
  });

  it('geo, duration, bytes', () => {
    const geo = { geoPointValue: 'geoPointValue' };
    const duration = { durationValue: 'durationValue' };
    const bytes = { bytesValue: 'bytesValue' };
    expect(Property.objectToValue(geo)).toEqual(geo);
    expect(Property.objectToValue(duration)).toEqual(duration);
    expect(Property.objectToValue(bytes)).toEqual(bytes);
  });

  it('isPrimary', () => {
    const p = new Property('test', v4());
    delete p.meta;
    expect(p.isPrimary()).toBeFalsy();
    p.setMetadata(false);
    expect(p.isPrimary()).toBeFalsy();
    p.setMetadata(true);
    expect(p.isPrimary()).toBeTruthy();
  });

  it('withValue', () => {
    const p = new Property('test', v4());
    p.value = '1st Value';
    //different values
    expect(p.withValue('2nd Value').value).toEqual('2nd Value');
    //the same values
    expect(p.withValue('2nd Value').value).toEqual('2nd Value');
  });

  it('withReference', () => {
    const p = new Property('test', v4());
    p.reference = '1st';
    //diferent references
    expect(p.withReference('2nd Value').reference).toEqual('2nd Value');
    //the same references
    expect(p.withReference('2nd Value').reference).toEqual('2nd Value');
  });

  it('fromPropertiesList', () => {
    const strings = ['str1', 'str2'];
    const res = [{ definition: { property: 'str1' } }, { definition: { property: 'str2' } }];
    expect(Property.fromPropertiesList(strings)).toEqual(res);
    expect(Property.fromPropertiesList([])).toEqual([]);
  });

  it('objectToValue', () => {
    const d = new Date();
    expect(Property.objectToValue(d)).toEqual({ valueTime: d });
  });
});

describe('builder', () => {
  it('no value, no ref', () => {
    const p = new Property('email', v4());
    const b1 = PatchPropertiesBuilder.newBuilder().updateProperty(p);
    expect(b1.operations).toHaveLength(0);
  });

  it('update reference', () => {
    const p = new Property('email', v4()).withReference('email_ref');
    const b1 = PatchPropertiesBuilder.newBuilder().updateProperty(p);
    expect(b1.operations).toHaveLength(1);
  });
});
