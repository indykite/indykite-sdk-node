import { Token } from '../token';

describe('when token is valid', () => {
  let token: Token;
  beforeEach(() => {
    token = new Token('accessToken', 'Bearer', new Date(2099, 11, 31));
  });

  it('returns the token is valid', () => {
    expect(token.valid()).toBe(true);
  });
});

describe('when token is expired', () => {
  let token: Token;
  beforeEach(() => {
    token = new Token('accessToken', 'Bearer', new Date(2022, 11, 31));
  });

  it('returns the token is expired', () => {
    expect(token.valid()).toBe(false);
  });
});

describe('when token is going to be expired in 15 seconds', () => {
  let token: Token;
  beforeEach(() => {
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + 15);
    token = new Token('accessToken', 'Bearer', expiration);
  });

  it('returns the token is expired', () => {
    expect(token.valid()).toBe(false);
  });
});
