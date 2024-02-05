import { IdentityKnowledgeClient } from '../sdk/knowledgev2';
import { Value } from '../grpc/indykite/objects/v1beta1/struct';
import { Utils } from '../sdk/utils/utils';

IdentityKnowledgeClient.createInstance().then((sdk) => {
  const output = sdk.getIdentityByID('gid:AAAAFc2eT9KmxEs0vQzNrAEDMJQ').then((response) => {
    console.log(output);
    console.log(JSON.stringify(response));
    console.log(response);
  });
});

IdentityKnowledgeClient.createInstance().then((sdk) => {
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

IdentityKnowledgeClient.createInstance().then((sdk) => {
  const output = sdk.listIdentities().then((response) => {
    console.log(output);
    console.log(JSON.stringify(response));
    console.log(response);
  });
});

IdentityKnowledgeClient.createInstance().then((sdk) => {
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
