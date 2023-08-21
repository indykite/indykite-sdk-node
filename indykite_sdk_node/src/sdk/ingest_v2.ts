import { SdkClient } from './client/client';
import { IngestAPIClient } from '../grpc/indykite/ingest/v1beta2/ingest_api.grpc-client';
import {
  IngestRecordRequest,
  IngestRecordResponse,
  StreamRecordsRequest,
  StreamRecordsResponse,
} from '../grpc/indykite/ingest/v1beta2/ingest_api';
import { SdkError, SdkErrorCode, SkdErrorText } from './error';
import { IndexFixer, streamKeeper } from './utils/stream';
import { Record } from '../grpc/indykite/ingest/v1beta2/model';

/**
 * IngestAPI represents the service interface for data ingestion.
 * @category Clients
 * @since 0.4.1
 * @example
 * // Example how to create a new ingest client
 * const sdk = await IngestV2Client.createInstance();
 */
export class IngestV2Client {
  private client: IngestAPIClient;
  constructor(sdk: SdkClient) {
    this.client = sdk.client as IngestAPIClient;
  }
  static createInstance(appCredential?: string | unknown): Promise<IngestV2Client> {
    return new Promise<IngestV2Client>((resolve, reject) => {
      SdkClient.createIdentityInstance(IngestAPIClient, appCredential)
        .then((sdk) => {
          resolve(new IngestV2Client(sdk));
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  /**
   * https://pkg.go.dev/github.com/indykite/jarvis-sdk-go@v0.11.0/ingest#V2Client.IngestRecord
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
  ingestRecord(record: Record): Promise<IngestRecordResponse> {
    const req: IngestRecordRequest = {
      record,
    } as IngestRecordRequest;
    return new Promise((resolve, reject) => {
      this.client.ingestRecord(req, (err, response) => {
        if (err) reject(err);
        else if (!response)
          reject(
            new SdkError(SdkErrorCode.SDK_CODE_6, SkdErrorText.SDK_CODE_6(IngestV2Client.name)),
          );
        else {
          resolve(response);
        }
      });
    });
  }

  /**
   * https://pkg.go.dev/github.com/indykite/jarvis-sdk-go@v0.11.0/ingest#V2Client.SendRecord
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
  streamRecords(records: Record[]): Promise<StreamRecordsResponse[]> {
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
