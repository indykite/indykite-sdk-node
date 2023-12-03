import { IdentityClient } from '../sdk/identity';

const OAUTH2_APPLICATION_ID = process.env.OAUTH2_APPLICATION_ID;
const DIGITAL_TWIN_ID = process.env.DIGITAL_TWIN_ID;
const CONSENT_ID = process.env.CONSENT_ID;

IdentityClient.createInstance()
  .then(async (sdk) => {
    if (!DIGITAL_TWIN_ID) throw new Error('Missing DIGITAL_TWIN_ID');

    // Create a consent for the user
    if (!OAUTH2_APPLICATION_ID) throw new Error('Missing APPLICATION_ID');
    console.log('creating consent...');
    const createResponse = await sdk.createConsent(OAUTH2_APPLICATION_ID, DIGITAL_TWIN_ID, [
      'ice_cream',
    ]);
    console.log(createResponse);

    // // Get the consent
    console.log('fetching consents for user...');
    const listResponse = await sdk.listConsents(DIGITAL_TWIN_ID);
    console.log(listResponse.consents);

    // Revoking the consent
    if (!CONSENT_ID) throw new Error('Missing CONSENT_ID');
    console.log('revoking consent...');
    await sdk.revokeConsent(DIGITAL_TWIN_ID, [CONSENT_ID]);
    console.log('revoked');
  })
  .catch((err) => {
    console.error(err);
  });
