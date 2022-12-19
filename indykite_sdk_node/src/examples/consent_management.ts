import { IdentityClient } from '../sdk/identity';

const OAUTH2_APPLICATON_ID = process.env.OAUTH2_APPLICATON_ID;
const DIGITAL_TWIN_ID = process.env.DIGITAL_TWIN_ID;

IdentityClient.createInstance()
  .then(async (sdk) => {
    if (!OAUTH2_APPLICATON_ID) throw new Error('Missing APPLICATION_ID');
    if (!DIGITAL_TWIN_ID) throw new Error('Missing DIGITAL_TWIN_ID');

    const result = await sdk.createConsent(OAUTH2_APPLICATON_ID, DIGITAL_TWIN_ID, ['ice_cream']);
    console.log(result);
  })
  .catch((err) => {
    console.error(err);
  });
