import { PropertyBatchOperation } from '../../grpc/indykite/identity/v1beta2/attributes';
import { DigitalTwin as DigitalTwinModel } from '../../grpc/indykite/identity/v1beta2/model';
import * as grpcId from '../../grpc/indykite/identity/v1beta2/identity_management_api';
import { SdkErrorCode, SdkError } from '../error';
import { Utils } from '../utils/utils';
import { Property, PatchPropertiesBuilder } from './property';

export class DigitalTwinCore {
  constructor(
    public id: string,
    public tenantId: string,
    public kind: number,
    public state: number,
    public tags: string[],
  ) {}

  static fromModel(model: DigitalTwinModel): DigitalTwinCore {
    return new DigitalTwinCore(model.id, model.tenantId, model.kind, model.state, model.tags);
  }

  marshal(): DigitalTwinModel {
    return {
      id: this.id,
      tenantId: this.tenantId,
      kind: this.kind,
      state: this.state,
      tags: this.tags,
    };
  }
}
export class DigitalTwin extends DigitalTwinCore {
  properties: Record<string, Property[]> = {};
  protected patchBuilder = PatchPropertiesBuilder.newBuilder();

  constructor(
    public id: string,
    public tenantId: string,
    public kind: number,
    public state: number,
    public tags: string[],
    public createTime?: Date,
  ) {
    super(id, tenantId, kind, state, tags);
  }

  static deserialize(dtResponse: grpcId.GetDigitalTwinResponse): DigitalTwin {
    if (dtResponse.digitalTwin && dtResponse.digitalTwin.digitalTwin) {
      const dt = new DigitalTwin(
        dtResponse.digitalTwin.digitalTwin.id,
        dtResponse.digitalTwin.digitalTwin.tenantId,
        dtResponse.digitalTwin.digitalTwin.kind,
        dtResponse.digitalTwin.digitalTwin.state,
        dtResponse.digitalTwin.digitalTwin.tags,
        Utils.timestampToDate(dtResponse.digitalTwin.createTime),
      );
      dtResponse.digitalTwin.properties
        .filter((p) => p.definition && p.definition.property)
        .map((p) => {
          const prop = Property.deserialize(p);
          dt.addPropertyNoPatch(prop);
        });

      return dt;
    } else {
      throw new SdkError(SdkErrorCode.SDK_CODE_1, "Can't deserialize digital twin");
    }
  }

  getProperty(name: string): Property | undefined {
    if (this.properties[name] && this.properties[name].length > 0) {
      const primaryProperty = this.properties[name].find((p) => p.meta && p.meta.primary);
      return primaryProperty || this.properties[name][0];
    } else return undefined;
  }

  getPropertyById(id: string): Property | undefined {
    for (const name in this.properties) {
      const propertyWithId = this.properties[name].find((property) => property.id === id);
      if (propertyWithId) {
        return propertyWithId;
      }
    }
  }

  getPropertyValue(name: string): unknown | undefined {
    return this.getProperty(name)?.value;
  }

  getProperties(name: string): Property[] {
    return this.properties[name] || [];
  }

  private addPropertyNoPatch(property: Property): void {
    if (this.properties[property.property]) {
      this.properties[property.property].push(property);
    } else {
      this.properties[property.property] = [property];
    }
  }

  addProperty(property: Property): void {
    this.addPropertyNoPatch(property);
    this.patchBuilder.addProperty(property);
  }

  deleteProperty(property: Property): void {
    if (this.properties[property.property]) {
      const prop = this.properties[property.property].find((p) => p.id === property.id);
      if (prop) {
        this.properties[property.property] = this.properties[property.property].filter(
          (p) => p.id !== property.id,
        );
        this.patchBuilder.deleteProperty(prop);
      }
    }
  }

  updatePropertyValue(property: Property, value: unknown): void {
    if (this.properties[property.property]) {
      const prop = this.properties[property.property].find((p) => p.id === property.id);
      if (prop) {
        prop.withValue(value);
        this.patchBuilder.updateProperty(prop);
      }
    }
  }

  updatePropertyMetadata(property: Property, primary: boolean): void {
    if (this.properties[property.property]) {
      const prop = this.properties[property.property].find((p) => p.id === property.id);
      if (prop) {
        prop.withMetadata(primary);
        this.patchBuilder.updateProperty(prop);
      }
    }
  }

  updateProperty(property: Property): void {
    if (this.properties[property.property]) {
      const idx = this.properties[property.property].findIndex((p) => p.id === property.id);
      if (idx != -1) {
        this.properties[property.property][idx] = property;
        this.patchBuilder.updateProperty(property);
      }
    }
  }

  resetOperations(): void {
    this.patchBuilder = PatchPropertiesBuilder.newBuilder();
  }

  getPatchOperation(): PropertyBatchOperation[] {
    return this.patchBuilder.build();
  }

  getPatchOperationsAndReset(): PropertyBatchOperation[] {
    const ops = [...this.getPatchOperation()];
    this.resetOperations();
    return ops;
  }

  getOperationsBuilder(): PatchPropertiesBuilder {
    return this.patchBuilder;
  }
}
