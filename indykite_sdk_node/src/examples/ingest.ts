import { IngestClient, IngestRecord } from '../sdk/ingest';

IngestClient.createInstance().then((sdk) => {
  const input = [
    IngestRecord.upsert('recordId-330')
      .node.digitalTwin({
        id: '',
        externalId: '748596',
        type: 'Person',
        properties: {
          employeeId: '65241',
          name: 'Ren Molecule',
          email: 'ren@yahoo.uk',
        },
      })
      .getRecord(),
    IngestRecord.upsert('recordId-340')
      .node.resource({
        externalId: '986532',
        type: 'Organization',
        properties: {
          name: 'west',
        },
      })
      .getRecord(),
    IngestRecord.upsert('recordId-350')
      .relation({
        sourceMatch: { externalId: '748596', type: 'Individual' },
        targetMatch: { externalId: '986532', type: 'Organization' },
        type: 'BELONGS',
      })
      .getRecord(),
  ];
  const output = sdk.streamRecordsArray(input).then((response) => {
    for (const item of response) console.log(JSON.stringify(item), item.error, item.info);
  });
  console.log(JSON.stringify(output));
  sdk
    .ingestRecord(
      IngestRecord.upsert('recordId-36').node.resource({
        externalId: 'loollolol',
        type: 'ParkingLot',
        properties: {
          customProp: '42',
        },
      }),
    )
    .then((response) => {
      console.log(JSON.stringify(response));
    });
});
