import { IngestMappingConfig as IngestMappingModel } from '../../../../grpc/indykite/config/v1beta1/model';
import { NodeConfiguration } from '../configuration';
import {
  IngestMappingEntity,
  IngestMappingEntityType,
  IngestMappingEntityWithType,
} from './ingest_mapping_entity';

type IOptions = {
  name: string;
  entities: IngestMappingEntityWithType[];
  displayName?: string;
  description?: string;
};

export class IngestMapping extends NodeConfiguration {
  public upsertEntities: IngestMappingEntity[];

  constructor(options: IOptions) {
    super(options.name);

    this.upsertEntities = options.entities.filter(
      (entity) => entity.entityType === IngestMappingEntityType.UPSERT,
    );
    this.displayName = options.displayName;
    this.description = options.description;
  }

  marshal(): IngestMappingModel {
    return {
      ingestType: {
        oneofKind: 'upsert',
        upsert: {
          entities: this.upsertEntities.map((entity) => entity.marshal()),
        },
      },
    };
  }
}
