import { IdentityClient } from '../sdk/identity';
import { Property } from '../sdk/model';

const consentChallengeToken = process.env.CONSENT_CHALLENGE || 'MISSING_CONSENT_CHALLENGE';

IdentityClient.createInstance()
  .then(async (sdk) => {
    const consentChallenge = await sdk.checkConsentChallenge(consentChallengeToken);
    consentChallenge.approveScopes(['openid', 'email']);
    console.log('Scopes:', consentChallenge.scopes);
    console.log('Approved scopes: ', consentChallenge.getApprovedScopeNames());
    const { authorizationEndpoint, verifier } = await sdk.createConsentVerifier(consentChallenge);
    console.log('Result: ', {
      authorizationEndpoint,
      verifier,
    });
  })
  .catch((err) => {
    console.error(err);
  });
