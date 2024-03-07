import { IngestClient, IngestRecord } from '../sdk/ingest';
import { Utils } from '../sdk/utils/utils';

IngestClient.createInstance().then((sdk) => {
  const input = [
    IngestRecord.upsert('recordId-331')
      .node({
        id: '',
        externalId: '748596',
        type: 'Person',
        isIdentity: true,
        properties: [
          {
            type: 'email',
            value: 'email@example.com',
            metadata: {
              assuranceLevel: 1,
              verificationTime: Utils.dateToTimestamp(new Date()),
              source: 'Myself',
              customMetadata: {
                customdata: 'SomeCustomData',
              },
            },
          },
        ],
      })
      .getRecord(),
    IngestRecord.upsert('recordId-341')
      .node({
        externalId: '986532',
        type: 'Organization',
        properties: [
          {
            type: 'name',
            value: 'west',
          },
        ],
      })
      .getRecord(),
    IngestRecord.upsert('recordId-351')
      .relationship({
        source: { externalId: '748596', type: 'Individual' },
        target: { externalId: '986532', type: 'Organization' },
        type: 'BELONGS',
        properties: [],
      })
      .getRecord(),
  ];
  const output = sdk.streamRecordsArray(input).then((response) => {
    for (const item of response) console.log(JSON.stringify(item), item.error, item.info);
  });
  console.log(JSON.stringify(output));

  sdk
    .ingestRecord(
      IngestRecord.upsert('recordId-36').node({
        externalId: 'loollolol',
        type: 'ParkingLot',
        properties: [
          {
            type: 'customprop',
            value: 42,
          },
        ],
      }),
    )
    .then((response) => {
      console.log(JSON.stringify(response));
    });
});
