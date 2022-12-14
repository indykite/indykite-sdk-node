import SHA512 from '../sha512';
import HashAlgorithm from '../hash_algorithm';

describe('when a new instance is created', () => {
  const rounds = '14';
  let instance: HashAlgorithm;

  beforeEach(() => {
    instance = new SHA512(rounds);
  });

  it('marshals correctly', () => {
    expect(instance.marshal()).toEqual({
      oneofKind: 'sha512',
      sha512: {
        rounds,
      },
    });
  });
});
