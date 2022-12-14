import { IngestMappingConfig_Direction } from '../../../../../grpc/indykite/config/v1beta1/model';
import { IngestMapping } from '../ingest_mapping';
import {
  IngestMappingEntity,
  IngestMappingEntityType,
  IngestMappingRelationshipDirection,
} from '../ingest_mapping_entity';

describe('when the instance is created', () => {
  let client: IngestMapping;

  beforeEach(() => {
    client = new IngestMapping({
      name: 'instance-name',
      displayName: 'Instance Name',
      description: 'Instance description',
      entities: [
        new IngestMappingEntity({
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
              direction: IngestMappingRelationshipDirection.INBOUND,
              matchLabel: 'Family',
            },
            {
              externalId: 'mors_fodselsnummer',
              type: 'MOTHER_OF',
              direction: IngestMappingRelationshipDirection.OUTBOUND,
              matchLabel: 'DigitalTwin',
            },
          ],
        }).withType(IngestMappingEntityType.UPSERT),
      ],
    });
  });

  it('creates a correct instance', () => {
    expect(client.name).toBe('instance-name');
    expect(client.displayName).toBe('Instance Name');
    expect(client.description).toBe('Instance description');
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
    ]);
  });

  it('marshals correctly', () => {
    expect(client.marshal()).toEqual({
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
              properties: [
                {
                  isRequired: false,
                  mappedName: 'nickname',
                  sourceName: 'kallenavn',
                },
              ],
              relationships: [
                {
                  direction: IngestMappingConfig_Direction.INBOUND,
                  externalId: 'familienummer',
                  matchLabel: 'Family',
                  type: 'MEMBER_OF',
                },
                {
                  direction: IngestMappingConfig_Direction.OUTBOUND,
                  externalId: 'mors_fodselsnummer',
                  matchLabel: 'DigitalTwin',
                  type: 'MOTHER_OF',
                },
              ],
              tenantId: 'gid:tenantId',
            },
          ],
        },
      },
    });
  });
});
