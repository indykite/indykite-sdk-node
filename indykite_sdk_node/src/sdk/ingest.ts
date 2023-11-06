import { SdkClient } from './client/client';
import { Utils } from './utils/utils';
import { IngestAPIClient } from '../grpc/indykite/ingest/v1beta2/ingest_api.grpc-client';
import {
  IngestRecordRequest,
  IngestRecordResponse,
  StreamRecordsRequest,
  StreamRecordsResponse,
} from '../grpc/indykite/ingest/v1beta2/ingest_api';
import { SdkError, SdkErrorCode, SkdErrorText } from './error';
import { IndexFixer, streamKeeper } from './utils/stream';
import { Record as RecordModel } from '../grpc/indykite/ingest/v1beta2/model';

export interface IngestResourceRecord {
  externalId: string;
  type: string;
  tags?: string[];
  properties?: Record<string, unknown>;
}

export interface IngestDigitalTwinRecord extends IngestResourceRecord {
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
   * @since 0.4.1
   * @example
   * await sdk.ingestRecord(
   *   IngestRecord.upsert('recordId-1').node.resource({
   *     externalId: 'parkingLot-1',
   *     type: 'ParkingLot',
   *     properties: {
   *       customProp: '42',
   *     },
   *   }).getRecord(),
   * )
   */
  ingestRecord(record: RecordModel): Promise<IngestRecordResponse> {
    const req: IngestRecordRequest = {
      record,
    } as IngestRecordRequest;
    return new Promise((resolve, reject) => {
      this.client.ingestRecord(req, (err, response) => {
        if (err) reject(err);
        else if (!response)
          reject(
            new SdkError(SdkErrorCode.SDK_CODE_6, SkdErrorText.SDK_CODE_6(IngestClient.name)),
          );
        else {
          resolve(response);
        }
      });
    });
  }

  /**
   * @since 0.4.1
   * @example
   *   const input = [
   *     IngestRecord.upsert('recordId-3').node.digitalTwin({
   *       externalId: 'tom',
   *       type: 'Person',
   *       tenantId: 'gid:AAAAA2luZHlraURlgAADDwAAAAE',
   *       identityProperties:{
   *         email: "tom@demo.com"
   *       },
   *       properties: {
   *         employeeId: '123',
   *         name: "Tom Doe"
   *       },
   *     }).getRecord(),
   *     IngestRecord.upsert('recordId-3').node.resource({
   *       externalId: 'w_west_g1',
   *       type: 'UserGroup',
   *       properties: {
   *         name: "west"
   *       }
   *     }).getRecord(),
   *     IngestRecord.upsert('recordId-3').relation({
   *       sourceMatch: { externalId: 'tom', type: 'Person' },
   *       targetMatch: { externalId: 'w_west_g1', type: 'UserGroup' },
   *       type: 'BELONGS',
   *     }).getRecord(),
   *   ];
   *   await sdk.streamRecords(input)
   */
  streamRecords(records: RecordModel[]): Promise<StreamRecordsResponse[]> {
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
