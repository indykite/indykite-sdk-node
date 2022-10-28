import { IngestMappingConfig_Direction } from '../../../../../grpc/indykite/config/v1beta1/model';
import { IngestMappingFactory } from '../factory';
import { IngestMapping } from '../ingest_mapping';
import {
  IngestMappingEntityType,
  IngestMappingRelationshipDirection,
} from '../ingest_mapping_entity';

describe('createInstance', () => {
  let client: IngestMapping;

  beforeEach(() => {
    client = IngestMappingFactory.createInstance('instance-name', {
      ingestType: {
        oneofKind: 'upsert',
        upsert: {
          entities: [
            {
              externalId: {
                isRequired: true,
                mappedName: 'ExternalId',
                sourceName: 'fodselsnummer',
              },
              labels: ['DigitalTwin'],
              tenantId: 'gid:tenantId',
              properties: [
                {
                  isRequired: false,
                  mappedName: 'nickname',
                  sourceName: 'kallenavn',
                },
              ],
              relationships: [
                {
                  externalId: 'familienummer',
                  type: 'MEMBER_OF',
                  direction: IngestMappingConfig_Direction.INBOUND,
                  matchLabel: 'Family',
                },
                {
                  externalId: 'mors_fodselsnummer',
                  type: 'MOTHER_OF',
                  direction: IngestMappingConfig_Direction.OUTBOUND,
                  matchLabel: 'DigitalTwin',
                },
              ],
            },
            {
              externalId: {
                isRequired: true,
                mappedName: 'ExternalId',
                sourceName: 'familienummer',
              },
              labels: ['Family'],
              tenantId: 'gid:tenantId',
              properties: [],
              relationships: [],
            },
          ],
        },
      },
    });
  });

  it('creates a correct instance', () => {
    expect(client.name).toBe('instance-name');
    expect(client.upsertEntities).toEqual([
      {
        entityType: IngestMappingEntityType.UPSERT,
        externalId: {
          isRequired: true,
          mappedName: 'ExternalId',
          sourceName: 'fodselsnummer',
        },
        labels: ['DigitalTwin'],
        properties: [
          {
            isRequired: false,
            mappedName: 'nickname',
            sourceName: 'kallenavn',
          },
        ],
        relationships: [
          {
            direction: IngestMappingRelationshipDirection.INBOUND,
            externalId: 'familienummer',
            matchLabel: 'Family',
            type: 'MEMBER_OF',
          },
          {
            direction: IngestMappingRelationshipDirection.OUTBOUND,
            externalId: 'mors_fodselsnummer',
            matchLabel: 'DigitalTwin',
            type: 'MOTHER_OF',
          },
        ],
        tenantId: 'gid:tenantId',
      },
      {
        entityType: IngestMappingEntityType.UPSERT,
        externalId: {
          isRequired: true,
          mappedName: 'ExternalId',
          sourceName: 'familienummer',
        },
        labels: ['Family'],
        properties: [],
        relationships: [],
        tenantId: 'gid:tenantId',
      },
    ]);
  });
});
