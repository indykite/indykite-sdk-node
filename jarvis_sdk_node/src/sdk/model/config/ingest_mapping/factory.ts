import { IngestMappingConfig } from '../../../../grpc/indykite/config/v1beta1/model';
import { IngestMapping } from './ingest_mapping';
import { IngestMappingEntity, IngestMappingEntityType } from './ingest_mapping_entity';

export class IngestMappingFactory {
  static createInstance(name: string, config: IngestMappingConfig): IngestMapping {
    const upsertEntities =
      config.ingestType.oneofKind === 'upsert'
        ? config.ingestType.upsert.entities.map(
            (entity) =>
              new IngestMappingEntity({
                ...entity,
                externalId: entity.externalId,
                relationships: entity.relationships.map((relationship) => ({
                  ...relationship,
                  direction: relationship.direction.valueOf(),
                })),
              }),
          )
        : [];

    const client = new IngestMapping({
      name,
      entities: upsertEntities.map((entity) => entity.withType(IngestMappingEntityType.UPSERT)),
    });
    return client;
  }
}
