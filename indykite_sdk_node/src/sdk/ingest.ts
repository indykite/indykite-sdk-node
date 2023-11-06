import { Utils } from './utils/utils';
import { SdkClient } from './client/client';
import { IngestAPIClient } from '../grpc/indykite/ingest/v1beta2/ingest_api.grpc-client';
import {
  IngestRecordRequest,
  IngestRecordResponse,
} from '../grpc/indykite/ingest/v1beta2/ingest_api';
import { SdkError, SdkErrorCode } from './error';
import { Readable } from 'stream';
import { IndexFixer, streamKeeper } from './utils/stream';
import { Record as RecordModel } from '../grpc/indykite/ingest/v1beta2/model';

export interface IngestResourceRecord {
  externalId: string;
  type: string;
  tags?: string[];
  properties?: Record<string, unknown>;
}

export interface IngestDigitalTwinRecord extends IngestResourceRecord {
  id: string;
  tenantId: string;
  identityProperties?: Record<string, unknown>;
}

export interface IngestNodeMatch {
  externalId: string;
  type: string;
}

export interface IngestRelationMatch {
  sourceMatch: IngestNodeMatch;
  targetMatch: IngestNodeMatch;
  type: string;
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
   *   IngestRecord.upsert('record-id').node.resource({
   *     externalId: 'lot-1',
   *     type: 'ParkingLot'
   *   })
   * );
   */
  get node() {
    return new IngestRecordUpsertNode(this.request);
  }

  /**
   * @since 0.3.4
   * @example
   * ingestSdk.ingestRecord(
   *   IngestRecord.upsert('record-id').relation({
   *     sourceMatch: { externalId: 'vehicle-1', type: 'Vehicle' },
   *     targetMatch: { externalId: 'lot-1', type: 'ParkingLot' },
   *     type: 'CanUse',
   *   })
   * );
   */
  relation(match: IngestRelationMatch, properties?: Record<string, unknown>) {
    if (!this.request.record) return new IngestRecord(this.request);

    const operation = this.request.record.operation;
    if (operation.oneofKind === 'upsert') {
      operation.upsert.data = {
        oneofKind: 'relation',
        relation: {
          match,
          properties: !properties
            ? []
            : Object.keys(properties).map((propertyKey) => ({
                key: propertyKey,
                value: Utils.objectToValue(properties[propertyKey]),
              })),
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
  nodeProperty(node: IngestNodeMatch, key: string) {
    const defaultRecord = new IngestRecord(this.request);
    if (!this.request.record) return defaultRecord;

    const operation = this.request.record.operation;
    if (operation.oneofKind !== 'delete') return defaultRecord;

    operation.delete.data = {
      oneofKind: 'nodeProperty',
      nodeProperty: {
        match: node,
        key,
      },
    };

    return new IngestRecord(this.request);
  }

  /**
   * @since 0.3.4
   * @example
   * ingestSdk.ingestRecord(
   *   IngestRecord.delete('record-id').relation({
   *     sourceMatch: { externalId: 'vehicle-1', type: 'Vehicle' },
   *     targetMatch: { externalId: 'lot-1', type: 'ParkingLot' },
   *     type: 'CanUse',
   *   })
   * );
   */
  relation(relation: IngestRelationMatch) {
    const defaultRecord = new IngestRecord(this.request);
    if (!this.request.record) return defaultRecord;

    const operation = this.request.record.operation;
    if (operation.oneofKind !== 'delete') return defaultRecord;

    operation.delete.data = {
      oneofKind: 'relation',
      relation,
    };

    return new IngestRecord(this.request);
  }

  /**
   * @since 0.3.4
   * @example
   * ingestSdk.ingestRecord(
   *   IngestRecord.delete('record-id').relationProperty(
   *     {
   *       sourceMatch: { externalId: 'vehicle-1', type: 'Vehicle' },
   *       targetMatch: { externalId: 'lot-1', type: 'ParkingLot' },
   *       type: 'CanUse',
   *     },
   *     'relationPropertyName'
   *   )
   * );
   */
  relationProperty(relation: IngestRelationMatch, key: string) {
    const defaultRecord = new IngestRecord(this.request);
    if (!this.request.record) return defaultRecord;

    const operation = this.request.record.operation;
    if (operation.oneofKind !== 'delete') return defaultRecord;

    operation.delete.data = {
      oneofKind: 'relationProperty',
      relationProperty: {
        match: relation,
        key,
      },
    };

    return new IngestRecord(this.request);
  }
}

export class IngestRecordUpsertNode extends IngestRecord {
  constructor(request: IngestRecordRequest) {
    super(request);
    if (!this.request.record) return;

    const operation = this.request.record.operation;
    if (operation.oneofKind === 'upsert') {
      operation.upsert.data = {
        oneofKind: 'node',
        node: {
          type: {
            oneofKind: undefined,
          },
        },
      };
    }
  }

  /**
   * @since 0.3.4
   * @example
   * ingestSdk.ingestRecord(
   *   IngestRecord.upsert('record-id').node.digitalTwin({
   *     externalId: 'external-dt-id',
   *     tenantId: 'tenant-id',
   *     type: 'CarOwner'
   *   })
   * );
   */
  digitalTwin(dt: IngestDigitalTwinRecord) {
    if (!this.request.record) return new IngestRecord(this.request);
    const properties = dt.properties;
    const identityProperties = dt.identityProperties;

    const operation = this.request.record.operation;
    if (operation.oneofKind === 'upsert') {
      const data = operation.upsert.data;
      if (data.oneofKind === 'node') {
        data.node.type = {
          oneofKind: 'digitalTwin',
          digitalTwin: {
            ...dt,
            tags: dt.tags ?? [],
            properties: !properties
              ? []
              : Object.keys(properties).map((propertyKey) => ({
                  key: propertyKey,
                  value: Utils.objectToValue(properties[propertyKey]),
                })),
            identityProperties: !identityProperties
              ? []
              : Object.keys(identityProperties).map((propertyKey) => ({
                  key: propertyKey,
                  value: Utils.objectToValue(identityProperties[propertyKey]),
                })),
          },
        };
      }
    }

    return new IngestRecord(this.request);
  }

  /**
   * @since 0.3.4
   * @example
   * ingestSdk.ingestRecord(
   *   IngestRecord.upsert('record-id').node.resource({
   *     externalId: 'lot-1',
   *     type: 'ParkingLot'
   *   })
   * );
   */
  resource(resource: IngestResourceRecord) {
    if (!this.request.record) return new IngestRecord(this.request);
    const properties = resource.properties;

    const operation = this.request.record.operation;
    if (operation.oneofKind === 'upsert') {
      const data = operation.upsert.data;
      if (data.oneofKind === 'node') {
        data.node.type = {
          oneofKind: 'resource',
          resource: {
            ...resource,
            tags: resource.tags ?? [],
            properties: !properties
              ? []
              : Object.keys(properties).map((propertyKey) => ({
                  key: propertyKey,
                  value: Utils.objectToValue(properties[propertyKey]),
                })),
          },
        };
      }
    }

    return new IngestRecord(this.request);
  }
}

/**
 * IngestAPI represents the service interface for data ingestion.
 * @category Clients
 * @since 0.3.4
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
          reject(new SdkError(SdkErrorCode.SDK_CODE_1, 'No ingest record response'));
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
   *     IngestRecord.upsert('recordId-1').node.resource({
   *       externalId: 'lotA',
   *       type: 'ParkingLot',
   *     }),
   *     IngestRecord.upsert('recordId-2').node.resource({
   *       externalId: 'vehicleA',
   *       type: 'Vehicle',
   *     }),
   *     IngestRecord.upsert('recordId-3').node.digitalTwin({
   *       externalId: 'person1',
   *       type: 'Person',
   *       tenantId: 'gid:AAAAAxe5-tWaWUvfnFwaMnFwsRk',
   *       properties: {
   *         customProp: '42',
   *       },
   *     }),
   *     IngestRecord.upsert('recordId-4').relation({
   *       sourceMatch: { externalId: 'person1', type: 'Person' },
   *       targetMatch: { externalId: 'vehicleA', type: 'Vehicle' },
   *       type: 'OWNS',
   *     }),
   *     IngestRecord.upsert('recordId-5').relation({
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
}
