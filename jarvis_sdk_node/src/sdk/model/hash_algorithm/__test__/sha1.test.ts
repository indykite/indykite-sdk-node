import SHA1 from '../sha1';
import HashAlgorithm from '../hash_algorithm';

describe('when a new instance is created', () => {
  const rounds = '14';
  let instance: HashAlgorithm;

  beforeEach(() => {
    instance = new SHA1(rounds);
  });

  it('marshals correctly', () => {
    expect(instance.marshal()).toEqual({
      oneofKind: 'sha1',
      sha1: {
        rounds,
      },
    });
  });
});
