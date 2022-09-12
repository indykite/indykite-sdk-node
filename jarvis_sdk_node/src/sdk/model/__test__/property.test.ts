import { JsonValue } from '@protobuf-ts/runtime';
import { v4 } from 'uuid';
import { Any } from '../../../grpc/google/protobuf/any';
import { LatLng } from '../../../grpc/google/type/latlng';
import * as grpcAttr from '../../../grpc/indykite/identity/v1beta1/attributes';
import { PostalAddress } from '../../../grpc/indykite/identity/v1beta1/model';
import { Value } from '../../../grpc/indykite/objects/v1beta1/struct';
import { SdkError, SdkErrorCode } from '../../error';
import { PatchPropertiesBuilder, Property } from '../property';

describe('properties', () => {
  it('deserialize - error', () => {
    const p1 = grpcAttr.Property.fromJson({
      id: v4(),
      referenceValue: 'some_reference',
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
      { nullValue: null },
      { boolValue: true },
      { integerValue: 10 },
      { unsignedIntegerValue: 10 },
      { doubleValue: 1.2 },
      { anyValue: Any.fromJson({}) },
      {
        anyValue: {
          ...PostalAddress.fromJson({
            addressCountry: 'Slovakia',
          }),
          ['@type']: Any.typeNameToUrl(PostalAddress.typeName),
        },
      },
      { valueTime: new Date().toISOString() },
      {
        durationValue: '20s',
      },
      {
        identifierValue: {
          idString: 'string_id',
        },
      },
      { stringValue: 'string' },
      { bytesValue: Buffer.from(v4()).toString('base64') },
      {
        geoPointValue: LatLng.fromJson({
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
      const p1 = grpcAttr.Property.fromJson({
        id: v4(),
        meta: {
          primary: true,
        },
        definition: {
          property: 'property',
        },
      });
      p1.value = {
        oneofKind: 'objectValue',
        objectValue: Value.fromJson(valueType as unknown as JsonValue, {
          typeRegistry: [PostalAddress],
        }),
      };
      const sdkProp = Property.deserialize(p1);
      expect(sdkProp.value).not.toBeNull();
    });
  });

  it('value & reference', () => {
    const prop = grpcAttr.Property.fromJson({
      id: v4(),
      definition: {
        property: 'email',
      },

      meta: { primary: true },
    });
    prop.value = { oneofKind: 'referenceValue', referenceValue: 'some_reference' };

    const sdkProp = Property.deserialize(prop);
    sdkProp.withValue('test+email@indykite.com');
    expect(sdkProp).toHaveProperty('value');
    expect(sdkProp).not.toHaveProperty('reference');
    expect(sdkProp.value).toEqual('test+email@indykite.com');
    expect(sdkProp.marshal()).toEqual({
      id: prop.id,
      definition: {
        context: '',
        property: 'email',
        type: '',
      },
      value: {
        oneofKind: 'objectValue',
        objectValue: {
          value: {
            oneofKind: 'stringValue',
            stringValue: 'test+email@indykite.com',
          },
        },
      },
      meta: {
        assuranceLevel: 0,
        issuer: '',
        primary: true,
        verifier: '',
      },
    });

    sdkProp.withReference('SOME_REFERANCE');
    expect(sdkProp).toHaveProperty('reference');
    expect(sdkProp).not.toHaveProperty('value');
    expect(sdkProp.reference).toEqual('SOME_REFERANCE');

    expect(sdkProp.isPrimary()).toBeTruthy();
    sdkProp.withMetadata(false);
    expect(sdkProp.isPrimary()).toBeFalsy();
    expect(sdkProp.marshal()).toEqual({
      id: prop.id,
      definition: {
        context: '',
        property: 'email',
        type: '',
      },
      value: {
        oneofKind: 'referenceValue',
        referenceValue: 'SOME_REFERANCE',
      },
      meta: {
        assuranceLevel: 0,
        issuer: '',
        primary: false,
        verifier: '',
      },
    });

    const builder = PatchPropertiesBuilder.newBuilder().updateProperty(sdkProp);
    expect(builder.operations).toHaveLength(1);
    let bo = builder.operations.find((bo) => bo.operation?.oneofKind === 'replace');
    expect(bo).not.toBeNull();

    builder.addProperty(
      new Property('firstName', v4()).withMetadata(true).withReference('some_reference'),
    );
    expect(builder.operations).toHaveLength(2);
    bo = builder.operations.find((bo) => bo.operation?.oneofKind === 'add');
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
        bo.operation?.oneofKind === 'add' && bo.operation?.add.definition?.property === 'firstName',
    );
    expect(bo).not.toBeNull();

    builder.addProperty(new Property('double', v4()).withValue(2.6));
    expect(builder.operations).toHaveLength(4);
    bo = builder.operations.find(
      (bo) =>
        bo.operation?.oneofKind === 'add' && bo.operation?.add.definition?.property === 'double',
    );
    expect(bo).not.toBeNull();

    delete prop.meta;
    const sdkPropNoMeta = Property.deserialize(prop);
    expect(sdkPropNoMeta.meta).toBeUndefined();
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
    expect(Property.fromPropertiesList()).toEqual([]);
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

  it('delete property without id', () => {
    const p = new Property('email').withReference('email_ref');
    const b1 = PatchPropertiesBuilder.newBuilder();
    expect(b1.deleteProperty(p)).toBe(b1);
    expect(b1.operations).toHaveLength(0);
  });

  it('marshal property without id', () => {
    const p = new Property('email');
    let caughtError: Error | null = null;
    try {
      p.marshal();
    } catch (err) {
      caughtError = err as Error;
    }
    expect(caughtError?.message).toBe("Can't marshal the property without an ID");

    p.withMetadata(false);
    p.id = 'some-id';
    try {
      p.marshal();
    } catch (err) {
      caughtError = err as Error;
    }
    expect(caughtError?.message).toBe("Can't marshal property metadata");
  });
});
