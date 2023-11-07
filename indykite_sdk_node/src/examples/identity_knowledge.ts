import { IdentityKnowledgeClient } from '../sdk/knowledge';

IdentityKnowledgeClient.createInstance().then((ikClient) => {
  const path = '(:Organization)';
  const resp = ikClient.read(path, '', {});
  console.log(JSON.stringify(resp));

  ikClient.listNodes('Organization').then((response) => {
    console.log(JSON.stringify(response));
  });
});
