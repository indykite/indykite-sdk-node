import { IdentityClient } from '../sdk/identity';

const OAUTH2_APPLICATON_ID = process.env.OAUTH2_APPLICATON_ID;
const DIGITAL_TWIN_ID = process.env.DIGITAL_TWIN_ID;
const CONSENT_ID = process.env.CONSENT_ID;

IdentityClient.createInstance()
  .then(async (sdk) => {
    if (!OAUTH2_APPLICATON_ID) throw new Error('Missing APPLICATION_ID');
    if (!DIGITAL_TWIN_ID) throw new Error('Missing DIGITAL_TWIN_ID');
    console.log('creating consent...');
    const result = await sdk.createConsent(OAUTH2_APPLICATON_ID, DIGITAL_TWIN_ID, ['ice_cream']);
    console.log(result);
  })
  .catch((err) => {
    console.error(err);
  });

IdentityClient.createInstance()
  .then(async (sdk) => {
    if (!DIGITAL_TWIN_ID) throw new Error('Missing DIGITAL_TWIN_ID');
    console.log('fetching consents for user...');
    const result = await sdk.listConsents(DIGITAL_TWIN_ID);
    console.log(result.consents);
  })
  .catch((err) => {
    console.error(err);
  });

IdentityClient.createInstance()
  .then(async (sdk) => {
    if (!DIGITAL_TWIN_ID) throw new Error('Missing DIGITAL_TWIN_ID');
    if (!CONSENT_ID) throw new Error('Missing CONSENT_ID');
    console.log('revoking consent...');
    await sdk.revokeConsent(DIGITAL_TWIN_ID, [CONSENT_ID]);
    console.log('revoked');
  })
  .catch((err) => {
    console.error(err);
  });
