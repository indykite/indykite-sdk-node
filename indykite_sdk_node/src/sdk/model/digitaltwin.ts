import {
  DigitalEntity as DigitalEntityModel,
  DigitalTwin as DigitalTwinModel,
} from '../../grpc/indykite/identity/v1beta2/model';
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
    public tags: string[] = [],
  ) {}

  static fromModel(model: DigitalTwinModel): DigitalTwinCore {
    return new DigitalTwinCore(model.id, model.tenantId, model.kind, model.state, model.tags);
  }

  static deserializeCore(dtResponse: DigitalEntityModel['digitalTwin']): DigitalTwinCore {
    if (dtResponse) {
      const dt = new DigitalTwinCore(
        dtResponse.id,
        dtResponse.tenantId,
        dtResponse.kind,
        dtResponse.state,
        dtResponse.tags,
      );

      return dt;
    } else {
      throw new SdkError(SdkErrorCode.SDK_CODE_1, "Can't deserialize digital twin");
    }
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
  properties: Map<string, Property[]> = new Map();
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
    const properties = this.properties.get(name);
    if (properties && properties.length > 0) {
      const primaryProperty = properties.find((p) => p.meta && p.meta.primary);
      return primaryProperty || properties[0];
    } else return undefined;
  }

  getPropertyById(id: string): Property | undefined {
    for (const name of this.properties.keys()) {
      const propertyWithId = this.properties.get(name)?.find((property) => property.id === id);
      if (propertyWithId) {
        return propertyWithId;
      }
    }
  }

  getPropertyValue(name: string): unknown | undefined {
    return this.getProperty(name)?.value;
  }

  getProperties(name: string): Property[] {
    return this.properties.get(name) ?? [];
  }

  private addPropertyNoPatch(property: Property): void {
    const properties = this.properties.get(property.property);
    if (properties) {
      properties.push(property);
    } else {
      this.properties.set(property.property, [property]);
    }
  }
}
