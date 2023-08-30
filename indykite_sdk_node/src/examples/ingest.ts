import { IngestRecord } from '../sdk/ingest';
import { IngestV2Client } from '../sdk/ingest_v2';

IngestV2Client.createInstance().then((sdk) => {
  const input = [
    IngestRecord.upsert('recordId-3')
      .node.digitalTwin({
        externalId: 'tom',
        type: 'Person',
        tenantId: 'gid:AAAAA2luZHlraURlgAADDwAAAAE',
        identityProperties: {
          email: 'tom@demo.com',
        },
        properties: {
          employeeId: '123',
          name: 'Tom Doe',
        },
      })
      .getRecord(),
    IngestRecord.upsert('recordId-3')
      .node.resource({
        externalId: 'w_west_g1',
        type: 'UserGroup',
        properties: {
          name: 'west',
        },
      })
      .getRecord(),
    IngestRecord.upsert('recordId-3')
      .relation({
        sourceMatch: { externalId: 'tom', type: 'Person' },
        targetMatch: { externalId: 'w_west_g1', type: 'UserGroup' },
        type: 'BELONGS',
      })
      .getRecord(),
  ];
  const output = sdk.streamRecords(input).then((response) => {
    for (const item of response) console.log(JSON.stringify(item), item.error, item.info);
  });
  console.log(JSON.stringify(output));
  sdk
    .ingestRecord(
      IngestRecord.upsert('recordId-1')
        .node.resource({
          externalId: 'parkingLot-1',
          type: 'ParkingLot',
          properties: {
            customProp: '42',
          },
        })
        .getRecord(),
    )
    .then((response) => {
      console.log(JSON.stringify(response));
    });
});
