import { IngestClient, IngestRecord } from '../sdk/ingest';

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
            value: {
              type: {
                oneofKind: 'stringValue',
                stringValue: 'email@example.com',
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
            value: {
              type: {
                oneofKind: 'stringValue',
                stringValue: 'west',
              },
            },
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
            value: {
              type: {
                oneofKind: 'integerValue',
                integerValue: '42',
              },
            },
          },
        ],
      }),
    )
    .then((response) => {
      console.log(JSON.stringify(response));
    });
});
