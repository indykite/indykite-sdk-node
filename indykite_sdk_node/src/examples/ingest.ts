import { IngestClient, IngestRecord } from '../sdk/ingest';

IngestClient.createInstance().then((sdk) => {
  const input = [
    IngestRecord.upsert('recordId-33')
      .node.digitalTwin({
        id: '',
        externalId: '784512',
        type: 'Individual',
        properties: {
          employeeId: '63259',
          name: 'Rufus Molecule',
          email: 'mol@yahoo.uk',
        },
      })
      .getRecord(),
    IngestRecord.upsert('recordId-34')
      .node.resource({
        externalId: '654789',
        type: 'UserGroup',
        properties: {
          name: 'west',
        },
      })
      .getRecord(),
    IngestRecord.upsert('recordId-35')
      .relation({
        sourceMatch: { externalId: '784512', type: 'Individual' },
        targetMatch: { externalId: '654789', type: 'UserGroup' },
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
