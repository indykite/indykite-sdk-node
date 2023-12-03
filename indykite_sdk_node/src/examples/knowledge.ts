import { IdentityKnowledgeClient } from '../sdk/knowledge';

IdentityKnowledgeClient.createInstance().then((sdk) => {
  const output = sdk.getDigitalTwinByID('gid:AAAAFVWpABqrVE79hcLfsk4PUDk').then((response) => {
    console.log(JSON.stringify(response));
    console.log(output);
  });
});
