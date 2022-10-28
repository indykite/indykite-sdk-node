import {
  IngestMappingConfig_Direction,
  IngestMappingConfig_Entity as IngestMappingEntityModel,
} from '../../../../grpc/indykite/config/v1beta1/model';

export enum IngestMappingRelationshipDirection {
  INVALID = IngestMappingConfig_Direction.INVALID,
  INBOUND = IngestMappingConfig_Direction.INBOUND,
  OUTBOUND = IngestMappingConfig_Direction.OUTBOUND,
}

export enum IngestMappingEntityType {
  UPSERT,
}

export interface IIngestMappingProperty {
  sourceName: string;
  mappedName: string;
  isRequired: boolean;
}

export interface IIngestMappingRelationship {
  externalId: string;
  type: string;
  direction: IngestMappingRelationshipDirection;
  matchLabel: string;
}

export type IngestMappingEntityWithType = IngestMappingEntity & {
  entityType: IngestMappingEntityType;
};

interface IOptions {
  tenantId: string;
  labels: string[];
  externalId?: IIngestMappingProperty;
  properties: IIngestMappingProperty[];
  relationships: IIngestMappingRelationship[];
}

export class IngestMappingEntity {
  public tenantId: string;
  public labels: string[];
  public externalId?: IIngestMappingProperty;
  public properties: IIngestMappingProperty[];
  public relationships: IIngestMappingRelationship[];

  constructor(options: IOptions) {
    this.tenantId = options.tenantId;
    this.labels = options.labels;
    this.externalId = options.externalId;
    this.properties = options.properties;
    this.relationships = options.relationships;
  }

  marshal(): IngestMappingEntityModel {
    return {
      tenantId: this.tenantId,
      labels: this.labels,
      externalId: this.externalId,
      properties: this.properties,
      relationships: this.relationships.map((relationship) => ({
        ...relationship,
        direction: relationship.direction.valueOf(),
      })),
    };
  }

  withType(type: IngestMappingEntityType): IngestMappingEntityWithType {
    return Object.assign(this, { entityType: type });
  }
}
