import { TokenIntrospectFactory } from '../factory';
import { TokenIntrospect } from '../token_introspect';

describe('createInstance', () => {
  let client: TokenIntrospect;

  beforeEach(() => {
    client = TokenIntrospectFactory.createInstance('instance-name', {
      tokenMatcher: {
        oneofKind: 'jwt',
        jwt: {
          issuer: 'https://example.com',
          audience: 'audience-id',
        },
      },
      validation: {
        oneofKind: 'offline',
        offline: {
          publicJwks: [
            Buffer.from(
              JSON.stringify({
                kid: 'abc',
                use: 'sig',
                alg: 'RS256',
                n: '--nothing-real-just-random-xyqwerasf--',
                kty: 'RSA',
              }),
            ),
            Buffer.from(
              JSON.stringify({
                kid: 'jkl',
                use: 'sig',
                alg: 'RS256',
                n: '--nothing-real-just-random-435asdf43--',
                kty: 'RSA',
              }),
            ),
          ],
        },
      },
      claimsMapping: {
        email: { selector: 'mail' },
        name: { selector: 'full_name' },
      },
      ikgNodeType: 'Person',
      performUpsert: true,
    });
  });

  it('creates a correct instance', () => {
    expect(client).toEqual(new TokenIntrospect(client));
  });
});
