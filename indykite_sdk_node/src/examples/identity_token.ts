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

    // Get Digital Twin using token
    const dtByToken = await sdk.getDigitalTwinByToken(userToken);
    console.log('Digital Twin By Token:', JSON.stringify(dtByToken, null, 2));

    if (!dtByToken.digitalTwin) {
      console.log('Missing DigitalTwin?');
      return;
    }

    const dt = dtByToken.digitalTwin;
    console.log(dt.digitalTwin?.id);

    const randString = Math.random().toString(36).slice(2);
    const email = `test+example_${randString}@indykite.com`;
    console.log(`Generated email: ${email}`);
  })
  .catch((err) => {
    console.error(err);
  });
