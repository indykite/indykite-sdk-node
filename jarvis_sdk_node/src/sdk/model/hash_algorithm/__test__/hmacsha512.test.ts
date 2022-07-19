import HMACSHA512 from '../hmacsha512';
import HashAlgorithm from '../hash_algorithm';

describe('when a new instance is created', () => {
  const key = Buffer.from('key-value');
  let instance: HashAlgorithm;

  beforeEach(() => {
    instance = new HMACSHA512(key);
  });

  it('marshals correctly', () => {
    expect(instance.marshal()).toEqual({
      oneofKind: 'hmacSha512',
      hmacSha512: {
        key,
      },
    });
  });
});
