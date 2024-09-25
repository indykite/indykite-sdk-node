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

IngestClient.createInstance().then((sdk) => {
  sdk
    .batchUpsertNodes([
      {
        externalId: 'person3',
        type: 'Person',
        properties: [
          {
            type: 'customProp',
            value: '42',
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
      },
      {
        externalId: 'person4',
        type: 'Person',
        properties: [
          {
            type: 'email',
            value: 'person4@yahoo.com',
          },
        ],
      },
    ])
    .then((response) => {
      console.log(JSON.stringify(response));
    });
});

IngestClient.createInstance().then((sdk) => {
  sdk
    .batchUpsertNodes([
      {
        externalId: 'car3',
        type: 'Car',
        properties: [
          {
            type: 'customProp',
            externalValue: {
              resolver: {
                oneofKind: 'id',
                id: 'gid:AAAACf8ZbwrfSUA-tnXjiShw-hQ',
              },
            },
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
      },
      {
        externalId: 'car4',
        type: 'Car',
        properties: [
          {
            type: 'color',
            value: 'blue',
          },
        ],
      },
    ])
    .then((response) => {
      console.log(JSON.stringify(response));
    });
});

IngestClient.createInstance().then((sdk) => {
  sdk.batchUpsertRelationships([
    {
      source: { externalId: 'person3', type: 'Person' },
      target: { externalId: 'car3', type: 'Car' },
      type: 'OWNS',
      properties: [
        {
          type: 'customProp',
          value: '46',
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
    },
    {
      source: { externalId: 'person4', type: 'Person' },
      target: { externalId: 'car4', type: 'Car' },
      type: 'OWNS',
      properties: [
        {
          type: 'licence',
          value: '4712589',
        },
      ],
    },
  ]);
});

IngestClient.createInstance().then((sdk) => {
  sdk
    .batchDeleteNodes([
      {
        externalId: 'person1',
        type: 'Person',
      },
      {
        externalId: 'person2',
        type: 'Person',
      },
    ])
    .then((response) => {
      console.log(JSON.stringify(response));
    });
});

IngestClient.createInstance().then((sdk) => {
  sdk.batchDeleteRelationships([
    {
      source: { externalId: 'person3', type: 'Person' },
      target: { externalId: 'car3', type: 'Car' },
      type: 'OWNS',
      properties: [
        {
          type: 'customProp',
          value: '46',
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
    },
    {
      source: { externalId: 'person4', type: 'Person' },
      target: { externalId: 'car4', type: 'Car' },
      type: 'OWNS',
      properties: [
        {
          type: 'licence',
          value: '4712589',
        },
      ],
    },
  ]);
});

IngestClient.createInstance().then((sdk) => {
  sdk
    .batchDeleteNodeProperties([
      {
        match: {
          externalId: 'person1',
          type: 'Person',
        },
        propertyType: 'customProp',
      },
      {
        match: {
          externalId: 'person1',
          type: 'Person',
        },
        propertyType: 'customProp2',
      },
    ])
    .then((response) => {
      console.log(JSON.stringify(response));
    });
});

IngestClient.createInstance().then((sdk) => {
  sdk.batchDeleteRelationshipProperties([
    {
      source: { externalId: 'person3', type: 'Person' },
      target: { externalId: 'car3', type: 'Car' },
      type: 'OWNS',
      propertyType: 'custom3',
    },
    {
      source: { externalId: 'person4', type: 'Person' },
      target: { externalId: 'car4', type: 'Car' },
      type: 'OWNS',
      propertyType: 'custom4',
    },
  ]);
});
