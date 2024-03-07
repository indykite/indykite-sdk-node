import { IdentityKnowledgeReadClient } from '../sdk/knowledgev2';
import { Value } from '../grpc/indykite/objects/v1beta2/value';
import { Utils } from '../sdk/utils/utils';

IdentityKnowledgeReadClient.createInstance().then((sdk) => {
  const output = sdk.listIdentities().then((response) => {
    console.log(output);
    console.log(JSON.stringify(response));
    console.log(response);
  });
});

IdentityKnowledgeReadClient.createInstance().then((sdk) => {
  const output = sdk.listNodes('Organization').then((response) => {
    console.log(output);
    console.log(JSON.stringify(response));
    console.log(response);
  });
});

IdentityKnowledgeReadClient.createInstance().then((sdk) => {
  const output = sdk.getIdentityByID('gid:AAAAFc2eT9KmxEs0vQzNrAEDMJQ').then((response) => {
    console.log(output);
    console.log(JSON.stringify(response));
    console.log(response);
  });
});

IdentityKnowledgeReadClient.createInstance().then((sdk) => {
  const output = sdk
    .getNodeByIdentifier({
      externalId: '986532',
      type: 'Organization',
    })
    .then((response) => {
      console.log(output);
      console.log(JSON.stringify(response));
      console.log(response);
    });
});

IdentityKnowledgeReadClient.createInstance().then((sdk) => {
  const output = sdk.listIdentities().then((response) => {
    console.log(output);
    console.log(JSON.stringify(response));
    console.log(response);
  });
});

IdentityKnowledgeReadClient.createInstance().then((sdk) => {
  const output = sdk
    .listNodesByProperty(
      {
        type: 'email',
        value: Value.fromJson(Utils.objectToJsonValue('ren@yahoo.uk')),
      },
      true,
    )
    .then((response) => {
      console.log(output);
      console.log(JSON.stringify(response));
      console.log(response);
    });
});

IdentityKnowledgeReadClient.createInstance().then((sdk) => {
  const output = sdk
    .listNodesByProperty(
      {
        type: 'email',
        value: Value.fromJson(Utils.objectToJsonValue('ren@yahoo.uk')),
      },
      true,
    )
    .then((response) => {
      console.log(output);
      console.log(JSON.stringify(response));
      console.log(response);
    });
});

IdentityKnowledgeReadClient.createInstance().then((sdk) => {
  const query =
    'MATCH (o:Organization)<-[:MANAGES]-(u:User) WHERE u.external_id = $externalId and u.type = $type';
  const output = sdk
    .read(
      query,
      {
        externalId: 'admin@mockmotors.com',
        type: 'User',
      },
      [{ variable: 'o', properties: [] }],
    )
    .then((response) => {
      console.log(output);
      console.log(JSON.stringify(response));
      console.log(response);
    });
});

IdentityKnowledgeReadClient.createInstance().then((sdk) => {
  const query =
    'MATCH (o:Organization)-[:PART_OF*0..3]->(:Organization)<-[:MANAGES]-(u:User)  WHERE u.external_id = $externalId';
  const output = sdk
    .read(
      query,
      {
        externalId: 'admin@mockmotors.com',
        type: 'User',
      },
      [{ variable: 'o', properties: [] }],
    )
    .then((response) => {
      console.log(output);
      console.log(JSON.stringify(response));
      console.log(response);
    });
});

IdentityKnowledgeReadClient.createInstance().then((sdk) => {
  const query =
    'MATCH (o:Organization)-[:PART_OF*0..3]->(:Organization)<-[r:MANAGES]-(u:User) WHERE u.external_id = $externalId and u.type = $type';
  const inputParams: {
    [key: string]: string;
  } = {
    externalId: 'admin@mockmotors.com',
    type: 'User',
  };
  const output = sdk
    .read(query, inputParams, [{ variable: 'o', properties: [] }])
    .then((response) => {
      console.log(output);
      console.log(JSON.stringify(response));
      console.log(response);
    });
});

IdentityKnowledgeReadClient.createInstance().then((sdk) => {
  const query = 'MATCH (o:InternalOrganization)<-[:WORKS_AT]-(:Profile)<-[:HAS]-(:User)';
  const inputParams = {};
  const output = sdk
    .read(query, inputParams, [{ variable: 'o', properties: [] }])
    .then((response) => {
      console.log(output);
      console.log(JSON.stringify(response));
      console.log(response);
    });
});

IdentityKnowledgeReadClient.createInstance().then((sdk) => {
  const query =
    'MATCH (u:User)-[:HAS]->(p:Profile) WHERE u.external_id = $externalId and u.type = $type';
  const inputParams: {
    [key: string]: string;
  } = {
    externalId: 'bob@swiftdeals.com',
    type: 'User',
  };
  const output = sdk
    .read(query, inputParams, [{ variable: 'p', properties: [] }])
    .then((response) => {
      console.log(output);
      console.log(JSON.stringify(response));
      console.log(response);
    });
});
