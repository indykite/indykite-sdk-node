import { SdkClient } from './client/client';
import { IngestAPIClient } from '../grpc/indykite/ingest/v1beta3/ingest_api.grpc-client';
import {
  IngestRecordRequest,
  IngestRecordResponse,
  StreamRecordsRequest,
  StreamRecordsResponse,
} from '../grpc/indykite/ingest/v1beta3/ingest_api';
import { Readable } from 'stream';
import { SdkError, SdkErrorCode, SkdErrorText } from './error';
import { IndexFixer, streamKeeper } from './utils/stream';
import { Utils } from './utils/utils';
import { NodeMatch, Record as RecordModel } from '../grpc/indykite/ingest/v1beta3/model';
import { Metadata, Property } from '../grpc/indykite/knowledge/objects/v1beta1/ikg';
import { Value } from '../grpc/indykite/objects/v1beta2/value';
import { Timestamp } from '../grpc/google/protobuf/timestamp';

export interface IngestNodeRecord {
  externalId: string;
  type: string;
  tags?: string[];
  properties?: IngestProperty[];
  id?: string;
  isIdentity?: boolean;
}

export interface IngestNodeMatch {
  externalId: string;
  type: string;
}

export interface IngestRelationship {
  source: IngestNodeMatch;
  target: IngestNodeMatch;
  type: string;
  properties?: IngestProperty[];
}

export interface IngestRelationshipProperty {
  source: IngestNodeMatch;
  target: IngestNodeMatch;
  type: string;
  propertyType: string;
}

/* eslint-disable  @typescript-eslint/no-explicit-any */
export interface IngestProperty {
  type: string;
  value: any;
  metadata?: IngestMetadata;
}

export interface IngestMetadata {
  assuranceLevel: 1 | 2 | 3;
  verificationTime: Timestamp;
  source: string;
  customMetadata: { [key: string]: string };
}

export interface DeleteRelationship {
  source: IngestNodeMatch;
  target: IngestNodeMatch;
  type: string;
  properties?: DeleteProperty[];
}

/* eslint-disable  @typescript-eslint/no-explicit-any */
export interface DeleteProperty {
  type: string;
  value: any;
  metadata?: Metadata;
}

export class IngestRecord {
  protected request: IngestRecordRequest;

  /**
   * @param id Unique identifier of the record, for client side reference
   */
  static delete(id: string) {
    return new IngestRecordDelete(id);
  }

  /**
   * @param id Unique identifier of the record, for client side reference
   */
  static upsert(id: string) {
    return new IngestRecordUpsert(id);
  }

  constructor(request?: IngestRecordRequest) {
    if (request) {
      this.request = request;
      return;
    }

    this.request = {
      record: undefined,
    };
  }

  marshal(): IngestRecordRequest {
    return this.request;
  }

  getRecord(): RecordModel {
    return this.request.record as RecordModel;
  }
}

export class IngestRecordUpsert extends IngestRecord {
  constructor(id: string) {
    super();
    this.request.record = {
      id,
      operation: {
        oneofKind: 'upsert',
        upsert: {
          data: {
            oneofKind: undefined,
          },
        },
      },
    };
  }

  /**
   * @since 0.3.4
   * @example
   * ingestSdk.ingestRecord(
   *   IngestRecord.upsert('record-id').node({
   *     externalId: 'lot-1',
   *     type: 'ParkingLot'
   *     properties: [{
   *         type: "customProp",
   *         value: '42',
   *         metadata: {
   *            assuranceLevel: 1,
   *            verificationTime: Utils.dateToTimestamp(new Date()),
   *            source: "Myself",
   *            customMetadata: {
   *                "customdata":'SomeCustomData'
   *            },
   *          }
   *       }],
   *   })
   * );
   */
  node(node: IngestNodeRecord) {
    const defaultRecord = new IngestRecord(this.request);
    if (!this.request.record) return defaultRecord;

    const operation = this.request.record.operation;
    if (operation.oneofKind !== 'upsert') return defaultRecord;

    const properties = [] as Property[];
    if (node.properties) {
      for (const property of node.properties) {
        const metadata = {} as Metadata;

        if (property.metadata?.assuranceLevel) {
          metadata['assuranceLevel'] = property.metadata.assuranceLevel;
        }
        if (property.metadata?.verificationTime) {
          metadata['verificationTime'] = property.metadata.verificationTime;
        }
        if (property.metadata?.source) {
          metadata['source'] = property.metadata.source;
        }
        if (property.metadata?.customMetadata) {
          const listCustom: { [key: string]: Value } = {};
          for (const [key, value] of Object.entries(property.metadata?.customMetadata)) {
            listCustom[key] = Value.fromJson(Utils.objectToJsonValue(value));
          }
          metadata['customMetadata'] = listCustom;
        }
        properties.push({
          type: property.type,
          value: Value.fromJson(Utils.objectToJsonValue(property.value)),
          metadata: property.metadata ? metadata : undefined,
        });
      }
    }
    operation.upsert.data = {
      oneofKind: 'node',
      node: {
        ...node,
        tags: node.tags ?? [],
        properties: properties ?? [],
        id: node.id ?? '',
        isIdentity: node.isIdentity ?? false,
      },
    };

    return new IngestRecord(this.request);
  }

  /**
   * @since 0.3.4
   * @example
   * ingestSdk.ingestRecord(
   *   IngestRecord.upsert('record-id').relationship({
   *     source: { externalId: 'vehicle-1', type: 'Vehicle' },
   *     target: { externalId: 'lot-1', type: 'ParkingLot' },
   *     type: 'CAN_USE'
   *   })
   * );
   */
  relationship(relationship: IngestRelationship) {
    if (!this.request.record) return new IngestRecord(this.request);

    const operation = this.request.record.operation;
    if (operation.oneofKind === 'upsert') {
      const properties = [] as Property[];
      if (relationship.properties) {
        for (const property of relationship.properties) {
          const metadata = {} as Metadata;

          if (property.metadata?.assuranceLevel) {
            metadata['assuranceLevel'] = property.metadata.assuranceLevel;
          }
          if (property.metadata?.verificationTime) {
            metadata['verificationTime'] = property.metadata.verificationTime;
          }
          if (property.metadata?.source) {
            metadata['source'] = property.metadata.source;
          }
          if (property.metadata?.customMetadata) {
            const listCustom: { [key: string]: Value } = {};
            for (const [key, value] of Object.entries(property.metadata?.customMetadata)) {
              listCustom[key] = Value.fromJson(Utils.objectToJsonValue(value));
            }
            metadata['customMetadata'] = listCustom;
          }
          properties.push({
            type: property.type,
            value: Value.fromJson(Utils.objectToJsonValue(property.value)),
            metadata: property.metadata ? metadata : undefined,
          });
        }
      }

      operation.upsert.data = {
        oneofKind: 'relationship',
        relationship: {
          ...relationship,
          properties: properties ?? [],
        },
      };
    }

    return new IngestRecord(this.request);
  }
}

export class IngestRecordDelete extends IngestRecord {
  constructor(id: string) {
    super();
    this.request.record = {
      id,
      operation: {
        oneofKind: 'delete',
        delete: {
          data: {
            oneofKind: undefined,
          },
        },
      },
    };
  }

  /**
   * @since 0.3.4
   * @example
   * ingestSdk.ingestRecord(
   *   IngestRecord.delete('record-id').node({
   *     externalId: 'lot-1',
   *     type: 'ParkingLot',
   *   })
   * );
   */
  node(node: IngestNodeMatch) {
    const defaultRecord = new IngestRecord(this.request);
    if (!this.request.record) return defaultRecord;

    const operation = this.request.record.operation;
    if (operation.oneofKind !== 'delete') return defaultRecord;

    operation.delete.data = {
      oneofKind: 'node',
      node,
    };

    return new IngestRecord(this.request);
  }

  /**
   * @since 0.3.4
   * @example
   * ingestSdk.ingestRecord(
   *   IngestRecord.delete('record-id').nodeProperty(
   *     {
   *       externalId: 'lot-1',
   *       type: 'ParkingLot',
   *     },
   *     'nodePropertyName'
   *   )
   * );
   */
  nodeProperty(match: NodeMatch, propertyType: string) {
    const defaultRecord = new IngestRecord(this.request);
    if (!this.request.record) return defaultRecord;

    const operation = this.request.record.operation;
    if (operation.oneofKind !== 'delete') return defaultRecord;

    operation.delete.data = {
      oneofKind: 'nodeProperty',
      nodeProperty: {
        match: match,
        propertyType: propertyType,
      },
    };

    return new IngestRecord(this.request);
  }

  /**
   * @since 0.3.4
   * @example
   * ingestSdk.ingestRecord(
   *   IngestRecord.delete('record-id').relationship({
   *     source: { externalId: 'vehicle-1', type: 'Vehicle' },
   *     target: { externalId: 'lot-1', type: 'ParkingLot' },
   *     type: 'CAN_USE',
   *     properties: []
   *   })
   * );
   */
  relationship(relationship: DeleteRelationship) {
    const defaultRecord = new IngestRecord(this.request);
    if (!this.request.record) return defaultRecord;

    const operation = this.request.record.operation;
    if (operation.oneofKind !== 'delete') return defaultRecord;

    operation.delete.data = {
      oneofKind: 'relationship',
      relationship: {
        ...relationship,
        properties: relationship.properties ?? [],
      },
    };

    return new IngestRecord(this.request);
  }

  /**
   * @since 0.3.4
   * @example
   * ingestSdk.ingestRecord(
   *   IngestRecord.delete('record-id').relationshipProperty(
   *     {
   *       source: { externalId: 'vehicle-1', type: 'Vehicle' },
   *       target: { externalId: 'lot-1', type: 'ParkingLot' },
   *       type: 'CAN_USE',
   *       propertyType: 'relationPropertyName'
   *     },
   *   )
   * );
   */
  relationshipProperty(relationshipProperty: IngestRelationshipProperty) {
    const defaultRecord = new IngestRecord(this.request);
    if (!this.request.record) return defaultRecord;

    const operation = this.request.record.operation;
    if (operation.oneofKind !== 'delete') return defaultRecord;

    operation.delete.data = {
      oneofKind: 'relationshipProperty',
      relationshipProperty: {
        ...relationshipProperty,
      },
    };

    return new IngestRecord(this.request);
  }
}

/**
 * IngestAPI represents the service interface for data ingestion.
 * @category Clients
 * @since 0.4.1
 * @example
 * // Example how to create a new ingest client
 * const sdk = await IngestClient.createInstance();
 */
export class IngestClient {
  private client: IngestAPIClient;
  constructor(sdk: SdkClient) {
    this.client = sdk.client as IngestAPIClient;
  }
  static createInstance(appCredential?: string | unknown): Promise<IngestClient> {
    return new Promise<IngestClient>((resolve, reject) => {
      SdkClient.createIdentityInstance(IngestAPIClient, appCredential)
        .then((sdk) => {
          resolve(new IngestClient(sdk));
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  /**
   * @since 0.3.4
   * @example
   * await sdk.ingestRecord(
   *   IngestRecord.upsert('recordId-1').node.resource({
   *     externalId: 'parkingLot-1',
   *     type: 'ParkingLot',
   *     properties: {
   *       customProp: '42',
   *     },
   *   }),
   * );
   */
  ingestRecord(record: IngestRecord): Promise<IngestRecordResponse> {
    const req: IngestRecordRequest = record.marshal();
    return new Promise((resolve, reject) => {
      this.client.ingestRecord(req, (err, response) => {
        if (err) reject(err);
        else if (!response)
          reject(new SdkError(SdkErrorCode.SDK_CODE_6, SkdErrorText.SDK_CODE_6(IngestClient.name)));
        else {
          resolve(response);
        }
      });
    });
  }

  /**
   * @since 0.3.4
   * @example
   * const input = Readable.from(
   *   [
   *     IngestRecord.upsert('recordId-1').node({
   *       externalId: 'lotA',
   *       type: 'ParkingLot',
   *     }),
   *     IngestRecord.upsert('recordId-2').node({
   *       externalId: 'vehicleA',
   *       type: 'Vehicle',
   *     }),
   *     IngestRecord.upsert('recordId-3').node({
   *       externalId: 'person1',
   *       type: 'Person',
   *       properties: [{
   *         type: "customProp",
   *         value: '42',
   *         metadata: {
   *            assuranceLevel: 1,
   *            verificationTime: Utils.dateToTimestamp(new Date()),
   *            source: "Myself",
   *            customMetadata: {
   *                "customdata": 'SomeCustomData'
   *            },
   *          }
   *       }],
   *     }),
   *     IngestRecord.upsert('recordId-4').relationship({
   *       sourceMatch: { externalId: 'person1', type: 'Person' },
   *       targetMatch: { externalId: 'vehicleA', type: 'Vehicle' },
   *       type: 'OWNS',
   *     }),
   *     IngestRecord.upsert('recordId-5').relationship({
   *       sourceMatch: { externalId: 'vehicleA', type: 'Vehicle' },
   *       targetMatch: { externalId: 'lotA', type: 'ParkingLot' },
   *       type: 'CAN_PARK',
   *     }),
   *   ],
   *   { objectMode: true },
   * );
   *
   * const output = sdk.streamRecords(input);
   */
  streamRecords(stream: Readable) {
    const [input, output] = streamKeeper(this.client.streamRecords.bind(this.client), [
      new IndexFixer('recordIndex'),
    ]);

    stream.on('data', async (chunk) => {
      if (chunk instanceof IngestRecord) {
        input.write(chunk.marshal());
      }
    });

    stream.on('end', () => {
      input.end();
    });

    return output;
  }

  /**
   * @since 0.4.1
   * @example
   *   const input = [
   *     IngestRecord.upsert('recordId-3').node({
   *       externalId: 'tom',
   *       type: 'Person',
   *       properties: [
   *         {
   *            type: "employeeId",
   *            value: 123
   *         },
   *         {
   *          type: "name",
   *          value: "Tom Doe"
   *         }
   *        ]
   *       },
   *       isIdentity: true
   *     }).getRecord(),
   *     IngestRecord.upsert('recordId-3').node({
   *       externalId: 'w_west_g1',
   *       type: 'UserGroup',
   *       properties: [
   *          {
   *            type: "name",
   *            value: "west"
   *          }
   *       ]
   *     }).getRecord(),
   *     IngestRecord.upsert('recordId-3').relationship({
   *       sourceMatch: { externalId: 'tom', type: 'Person' },
   *       targetMatch: { externalId: 'w_west_g1', type: 'UserGroup' },
   *       type: 'BELONGS',
   *     }).getRecord(),
   *   ];
   *   await sdk.streamRecords(input)
   */
  streamRecordsArray(records: RecordModel[]): Promise<StreamRecordsResponse[]> {
    return new Promise((resolve, reject) => {
      const result: StreamRecordsResponse[] = [];
      const [input, output] = streamKeeper<StreamRecordsRequest, StreamRecordsResponse>(
        this.client.streamRecords.bind(this.client),
        [new IndexFixer('recordIndex')],
      );
      for (const record of records) {
        input.write({ record } as IngestRecordRequest);
      }
      if (records && records.length) {
        input.end();
      }
      output.on('data', (newChunk) => {
        result.push(newChunk);
      });
      output.on('error', (error) => {
        reject(error);
      });
      output.on('end', () => {
        resolve(result);
      });
    });
  }
}
