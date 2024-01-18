import { IdentityClient } from '../sdk/identity';

const consentChallengeToken = process.env.CONSENT_CHALLENGE || 'MISSING_CONSENT_CHALLENGE';

IdentityClient.createInstance()
  .then(async (sdk) => {
    const consentChallenge = await sdk.checkConsentChallenge({
      challenge: consentChallengeToken,
    });
    console.log(consentChallenge?.scopes);

    const consentVerifier = await sdk.createConsentVerifier({
      consentChallenge: consentChallengeToken,
      result: {
        oneofKind: 'approval',
        approval: {
          grantedAudiences: [],
          grantScopes: ['openid', 'email'],
          remember: true,
          rememberFor: '0',
        },
      },
    });
    console.log(JSON.stringify(consentVerifier, null, 2));
  })
  .catch((err) => {
    console.error(err);
  });
