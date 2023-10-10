import { JsonValue } from '@protobuf-ts/runtime';
import * as grpcAttr from '../../grpc/indykite/identity/v1beta2/attributes';
import { PostalAddress } from '../../grpc/indykite/identity/v1beta2/model';

import { SdkErrorCode, SdkError } from '../error';
import { Utils } from '../utils/utils';

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
    m.verificationTime = Utils.timestampToDate(meta.verificationTime);
    return m;
  }

  marshal(): grpcAttr.PropertyMetadata {
    if (
      this.assuranceLevel === undefined ||
      this.issuer === undefined ||
      this.verifier === undefined
    ) {
      throw new SdkError(SdkErrorCode.SDK_CODE_1, "Can't marshal property metadata");
    }

    return {
      assuranceLevel: this.assuranceLevel,
      issuer: this.issuer,
      verifier: this.verifier,
      primary: this.primary,
      verificationTime: Utils.dateToTimestamp(this.verificationTime),
    };
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
    if (id !== undefined) this.id = id;
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
      this.meta = new PropertyMetaData();
    }
    this.meta.primary = primary;
  }

  withMetadata(primary: boolean): Property {
    this.setMetadata(primary);
    return this;
  }

  marshal(): grpcAttr.Property {
    let value: grpcAttr.Property['value'] = {
      oneofKind: undefined,
    };

    if (this.value) {
      value = {
        oneofKind: 'objectValue',
        objectValue: Utils.objectToValue(this.value),
      };
    } else if (this.reference) {
      value = {
        oneofKind: 'referenceValue',
        referenceValue: this.reference,
      };
    }

    const definition: grpcAttr.Property['definition'] = {
      context: this.context ?? '',
      property: this.property,
      type: this.type ?? '',
    };

    return {
      id: this.id ?? '',
      value,
      definition,
      meta: this.meta?.marshal(),
    };
  }

  static deserialize(property: grpcAttr.Property): Property {
    if (property.definition && property.value) {
      const p = new Property(property.definition.property, property.id);
      p.context = property.definition.context;
      p.type = property.definition.type;
      if (property.value.oneofKind === 'objectValue') {
        p.value = Utils.deserializeValue(property.value.objectValue);
      } else if (property.value.oneofKind === 'referenceValue') {
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
    let value: { objectValue: JsonValue } | { referenceValue: string };
    if (property.value) {
      value = { objectValue: Utils.objectToJsonValue(property.value) };
    } else if (property.reference) {
      value = { referenceValue: property.reference };
    } else {
      return this;
    }

    this.operations.push(
      grpcAttr.PropertyBatchOperation.fromJson(
        {
          add: {
            definition: {
              property: property.property,
            },
            ...value,
          },
        },
        {
          typeRegistry: [PostalAddress],
        },
      ),
    );
    return this;
  }

  updateProperty(property: Property): PatchPropertiesBuilder {
    if (!property.id) {
      return this;
    }

    const bo = {
      replace: {
        id: property.id,
      },
    };
    let updated = false;

    let value: { objectValue: JsonValue } | { referenceValue: string } | undefined;
    if (property.value) {
      value = { objectValue: Utils.objectToJsonValue(property.value) };
      updated = true;
    } else if (property.reference) {
      value = { referenceValue: property.reference };
      updated = true;
    }

    let meta: { primary: boolean } | undefined;
    if (property.meta) {
      meta = {
        primary: property.meta.primary,
      };
      updated = true;
    }

    if (updated) {
      if (value) bo.replace = Object.assign(bo.replace, value);
      if (meta) bo.replace = Object.assign(bo.replace, { meta });
      this.operations.push(
        grpcAttr.PropertyBatchOperation.fromJson(bo, { typeRegistry: [PostalAddress] }),
      );
    }
    return this;
  }

  deleteProperty(property: Property): PatchPropertiesBuilder {
    if (!property.id) {
      return this;
    }

    this.operations.push(
      grpcAttr.PropertyBatchOperation.fromJson({
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
    const pResult = new PatchResult(result.index, result.result?.oneofKind || 'error');
    if (result.result && result.result.oneofKind == 'success') {
      pResult.propertyId = result.result.success.propertyId;
    } else if (result.result && result.result.oneofKind == 'error') {
      pResult.message = result.result.error.message;
    }
    return pResult;
  }
}
