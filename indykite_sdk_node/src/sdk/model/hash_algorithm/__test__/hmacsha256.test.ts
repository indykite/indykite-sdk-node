import HMACSHA256 from '../hmacsha256';
import HashAlgorithm from '../hash_algorithm';

describe('when a new instance is created', () => {
  const key = Buffer.from('key-value');
  let instance: HashAlgorithm;

  beforeEach(() => {
    instance = new HMACSHA256(key);
  });

  it('marshals correctly', () => {
    expect(instance.marshal()).toEqual({
      oneofKind: 'hmacSha256',
      hmacSha256: {
        key,
      },
    });
  });
});
