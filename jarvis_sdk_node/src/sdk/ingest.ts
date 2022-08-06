import * as sdkTypes from './model';

import { SdkErrorCode, SdkError } from './error';
import { Utils } from './utils/utils';
import { SdkClient } from './client/client';
import { IngestAPIClient } from '../grpc/indykite/ingest/v1beta1/ingest_api.grpc-client';
import { StreamRecordsRequest } from '../grpc/indykite/ingest/v1beta1/ingest_api';
import { Record } from '../grpc/indykite/ingest/v1beta1/model';

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

  //just testing it should return Promise
  // should consider passing stream of objects instead of array???
  ingest(
    mappingId: string,
    externalId: string,
    objects: {
      [key: string]: unknown;
    }[],
    recordId?: string,
  ): void {
    const client = this.client.streamRecords();
    client.on('data', (data) => {
      console.log('received data', JSON.stringify(data, null, 2));
    });
    client.on('end', () => {
      console.log('end of stream');
    });
    client.on('error', (err) => {
      console.error('ingestion error', JSON.stringify(err, null, 2));
    });

    try {
      objects.forEach((obj) => {
        const record = {} as Record;
        record.id =
          recordId && typeof obj[recordId] === 'string'
            ? (obj[recordId] as string)
            : (obj[externalId] as string);

        record.externalId = externalId;
        record.data = {};
        if (typeof obj === 'object') {
          Object.keys(obj).forEach((key) => {
            const v = obj[key];
            record.data[key] = Utils.objectToValue(v);
          });
          const request = {
            mappingConfigId: mappingId,
            record,
          } as StreamRecordsRequest;
          client.write(request);
          console.log('single object sent', record.id);
        }
      });
    } finally {
      client.end();
    }
  }
}
