import * as grpcAttr from '../../grpc/indykite/identity/v1beta1/attributes';

import { Value } from '../../grpc/indykite/objects/v1beta1/struct';
import { SdkErrorCode, SdkError } from '../error';

type UnknownObject = { [k: string]: unknown };

export class PropertyMetaData {
  primary = false;
  assuranceLevel? = 1;
  issuer?: string;
  verifier?: string;
  verificationTime?: Date;

  static deserialize(meta: grpcAttr.PropertyMetadata): PropertyMetaData {
    const m = new PropertyMetaData();
    m.primary = meta.primary;
    m.assuranceLevel = meta.assuranceLevel;
    m.issuer = meta.issuer;
    m.verifier = meta.verifier;
    m.verificationTime = meta.verificationTime;
    return m;
  }
}

export class Property {
  id?: string;

  // PropertyDefinition
  context?: string;
  type?: string;
  property: string;

  meta?: PropertyMetaData;

  // either value or reference
  value?: unknown;
  reference?: string;

  constructor(property: string, id?: string) {
    if (id) this.id = id;
    this.property = property;
  }

  isPrimary(): boolean {
    return this.meta?.primary || false;
  }

  setValue(v: unknown): void {
    if (this.value !== v) {
      this.value = v;
      delete this.reference;
    }
  }

  withValue(v: unknown): Property {
    this.setValue(v);
    return this;
  }

  setReference(r: string): void {
    if (this.reference !== r) {
      this.reference = r;
      delete this.value;
    }
  }

  withReference(r: string): Property {
    this.setReference(r);
    return this;
  }

  setMetadata(primary: boolean): void {
    if (!this.meta) {
      this.meta = {
        primary,
      };
    } else {
      this.meta.primary = primary;
    }
  }

  withMetadata(primary: boolean): Property {
    this.setMetadata(primary);
    return this;
  }

  private static deserializeValue(v: Value): unknown {
    if (v && v.value) {
      switch (v.value.$case) {
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
        case 'anyValue':
          return v.value.anyValue;
        case 'valueTime':
          return v.value.valueTime;
        case 'durationValue':
          return v.value.durationValue;
        case 'identifierValue':
          return v.value.identifierValue;
        case 'stringValue':
          return v.value.stringValue;
        case 'bytesValue':
          return v.value.bytesValue;
        case 'geoPointValue':
          return v.value.geoPointValue;
        case 'arrayValue':
          return v.value.arrayValue.values.map((v: Value) => Property.deserializeValue(v));
        case 'mapValue': {
          const m: { [k: string]: unknown } = {};
          Object.entries(v.value.mapValue.fields).forEach(([k, v]) => {
            m[k] = Property.deserializeValue(v);
          });
          return m;
        }
      }
    }
    return undefined;
  }

  static deserialize(property: grpcAttr.Property): Property {
    if (property.definition && property.value) {
      const p = new Property(property.definition.property, property.id);
      p.context = property.definition.context;
      p.type = property.definition.type;
      if ('objectValue' in property.value) {
        p.value = Property.deserializeValue(property.value.objectValue);
      } else {
        p.reference = property.value.referenceValue;
      }
      if (property.meta) p.meta = PropertyMetaData.deserialize(property.meta);
      return p;
    } else {
      throw new SdkError(
        SdkErrorCode.SDK_CODE_1,
        `Can't deserialize property: ${JSON.stringify(property, null, 2)}`,
      );
    }
  }

  static fromPropertiesList(properties: string[] = []): { definition: { property: string } }[] {
    return properties.map((property) => {
      return {
        definition: {
          property,
        },
      };
    });
  }

  static objectToValue(value: unknown): unknown {
    if (
      typeof value === 'object' &&
      value &&
      ('geoPointValue' in value || 'durationValue' in value || 'bytesValue' in value)
    ) {
      return value;
    }

    switch (typeof value) {
      case 'boolean':
        return { boolValue: value };
      case 'number':
        return { doubleValue: value };
      case 'string':
        return { stringValue: value };
      case 'object': {
        if (value instanceof Date) return { valueTime: value };
        if (Array.isArray(value)) {
          return {
            arrayValue: {
              value: value.map((v) => this.objectToValue(v)),
            },
          };
        }
        const m: UnknownObject = {};
        Object.entries<unknown>(value as UnknownObject).forEach(([k, v]) => {
          m[k] = this.objectToValue(v);
        });
        return { fields: { ...m } };
      }
    }
    //TODO: add anyValue
    // anyValue: Any ///expects Buffer
  }
}

export class PatchPropertiesBuilder {
  operations: grpcAttr.PropertyBatchOperation[] = [];

  static newBuilder(): PatchPropertiesBuilder {
    return new PatchPropertiesBuilder();
  }

  withPatchPropertiesBuilder(builder: PatchPropertiesBuilder): PatchPropertiesBuilder {
    this.operations.push(...builder.operations);
    return this;
  }

  addProperty(property: Property): PatchPropertiesBuilder {
    let value: { objectValue: Value } | { referenceValue: string };
    if (property.value) {
      value = { objectValue: Property.objectToValue(property.value) as Value };
    } else if (property.reference) {
      value = { referenceValue: property.reference };
    } else {
      return this;
    }

    this.operations.push(
      grpcAttr.PropertyBatchOperation.fromJSON({
        add: {
          definition: {
            property: property.property,
          },
          ...value,
        },
      }),
    );
    return this;
  }

  updateProperty(property: Property): PatchPropertiesBuilder {
    const bo = {
      replace: {
        id: property.id,
      },
    };
    let updated = false;

    let value: { objectValue: Value } | { referenceValue: string } | undefined;
    if (property.value) {
      value = { objectValue: Property.objectToValue(property.value) as Value };
      updated = true;
    } else if (property.reference) {
      value = { referenceValue: property.reference };
      updated = true;
    }

    let meta:
      | { primary: boolean; assuranceLevel: number; verifier: string; issuer: string }
      | undefined;
    if (property.meta) {
      meta = { primary: property.meta.primary, assuranceLevel: 1, verifier: '', issuer: '' };
      updated = true;
    }

    if (updated) {
      if (value) bo.replace = Object.assign(bo.replace, value);
      if (meta) bo.replace = Object.assign(bo.replace, { meta });
      this.operations.push(grpcAttr.PropertyBatchOperation.fromJSON(bo));
    }
    return this;
  }

  deleteProperty(property: Property): PatchPropertiesBuilder {
    this.operations.push(
      grpcAttr.PropertyBatchOperation.fromJSON({
        remove: {
          id: property.id,
        },
      }),
    );
    return this;
  }

  build(): grpcAttr.PropertyBatchOperation[] {
    return this.operations;
  }
}

export type PatchResultStatus = 'success' | 'error';
export class PatchResult {
  propertyId?: string;
  message?: string[];

  constructor(public index: string, public status: PatchResultStatus) {}
  static deserialize(result: grpcAttr.BatchOperationResult): PatchResult {
    const pResult = new PatchResult(result.index, result.result?.$case || 'error');
    if (result.result?.$case == 'success') {
      pResult.propertyId = result.result.success.propertyId;
    } else {
      pResult.message = result.result?.error.message;
    }
    return pResult;
  }
}
