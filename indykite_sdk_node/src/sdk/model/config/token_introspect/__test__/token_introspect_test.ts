import { TokenIntrospect } from '../token_introspect';

describe('when the instance is created', () => {
  let client: TokenIntrospect;

  beforeEach(() => {
    client = new TokenIntrospect({
      name: 'instance-name',
      displayName: 'Instance Name',
      description: { value: 'Instance description' },
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
    expect(client.name).toBe('instance-name');
    expect(client.displayName).toBe('Instance Name');
    expect(client.description?.value).toBe('Instance description');
    expect(client.tokenMatcher.oneofKind).toBe('jwt');
    expect(client.validation.oneofKind).toBe('offline');
    expect(client.ikgNodeType).toBe('Person');
    expect(client.performUpsert).toBe(true);
  });
});
