import { Utils } from './utils/utils';
import { SdkClient } from './client/client';
import { IngestAPIClient } from '../grpc/indykite/ingest/v1beta1/ingest_api.grpc-client';
import {
  StreamRecordsRequest,
  StreamRecordsResponse,
} from '../grpc/indykite/ingest/v1beta1/ingest_api';
import * as grpc from '../grpc/indykite/ingest/v1beta1/model';
import { Readable } from 'stream';
import { IngestResults } from './model/ingest/ingest_response';
export class IngestClient {
  private client: IngestAPIClient;
  constructor(sdk: SdkClient) {
    this.client = sdk.client as IngestAPIClient;
  }
  static createInstance(token?: string | unknown): Promise<IngestClient> {
    return new Promise<IngestClient>((resolve, reject) => {
      SdkClient.createServiceInstance(IngestAPIClient, token)
        .then((sdk) => {
          resolve(new IngestClient(sdk));
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  ingest(
    mappingId: string,
    externalId: string,
    objects: Record<string, unknown>[] | Readable,
    recordId?: string,
  ): Promise<IngestResults> {
    let objectsStream = objects;
    if (Array.isArray(objectsStream)) {
      objectsStream = Readable.from(objectsStream);
    }

    return this.ingestStreamedObjects(mappingId, externalId, objectsStream, recordId);
  }

  private ingestStreamedObjects(
    mappingId: string,
    externalId: string,
    objectsStream: Readable,
    recordId?: string,
  ): Promise<IngestResults> {
    return new Promise((resolve, reject) => {
      const results = new IngestResults();
      const client = this.client.streamRecords();
      client.on('data', (data: StreamRecordsResponse) => {
        results.deserializeAndAdd(data);
      });
      client.on('end', () => {
        resolve(results);
      });
      client.on('error', (err) => {
        reject(err);
      });

      let obj: Record<string, unknown>;
      while ((obj = objectsStream.read()) !== null) {
        if (typeof obj === 'object') {
          const request = this.createRequest(obj, mappingId, externalId, recordId);
          client.write(request);
        }
      }

      client.end();
    });
  }

  private createRequest(
    obj: Record<string, unknown>,
    mappingId: string,
    externalId: string,
    recordId?: string,
  ): StreamRecordsRequest {
    const record = {} as grpc.Record;
    record.id = this.getRecordId(obj, externalId, recordId);
    record.externalId = externalId;
    record.data = {};
    Object.keys(obj).forEach((key) => {
      const v = obj[key];
      record.data[key] = Utils.objectToValue(v);
    });
    return {
      mappingConfigId: mappingId,
      record,
    };
  }

  private getRecordId(obj: Record<string, unknown>, externalId: string, recordId?: string) {
    return recordId && typeof obj[recordId] === 'string'
      ? (obj[recordId] as string).toString()
      : ((obj[externalId] ?? '') as string).toString();
  }
}
