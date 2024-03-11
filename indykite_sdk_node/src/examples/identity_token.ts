import { IdentityClient } from '../sdk/identity';
const userToken = process.env.USER_TOKEN || 'MISSING_TOKEN';

IdentityClient.createInstance()
  .then(async (sdk) => {
    const tokenInfo = await sdk.introspectToken(userToken);
    console.log('Token introspection', JSON.stringify(tokenInfo, null, 2));
    if (!tokenInfo.active) {
      console.log('Inactive token, boring...');
      return;
    }
  })
  .catch((err) => {
    console.error(err);
  });
