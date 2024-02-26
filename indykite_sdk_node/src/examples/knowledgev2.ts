import { IdentityKnowledgeReadClient } from '../sdk/knowledgev2';
import { Value } from '../grpc/indykite/objects/v1beta2/value';
import { Utils } from '../sdk/utils/utils';

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
