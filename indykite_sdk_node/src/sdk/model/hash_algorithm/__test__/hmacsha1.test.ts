import HMACSHA1 from '../hmacsha1';
import HashAlgorithm from '../hash_algorithm';

describe('when a new instance is created', () => {
  const key = Buffer.from('key-value');
  let instance: HashAlgorithm;

  beforeEach(() => {
    instance = new HMACSHA1(key);
  });

  it('marshals correctly', () => {
    expect(instance.marshal()).toEqual({
      oneofKind: 'hmacSha1',
      hmacSha1: {
        key,
      },
    });
  });
});
