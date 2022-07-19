import PBKDFSHA1 from '../pbkdf_sha1';
import HashAlgorithm from '../hash_algorithm';

describe('when a new instance is created', () => {
  const rounds = '14';
  let instance: HashAlgorithm;

  beforeEach(() => {
    instance = new PBKDFSHA1(rounds);
  });

  it('marshals correctly', () => {
    expect(instance.marshal()).toEqual({
      oneofKind: 'pbkdfSha1',
      pbkdfSha1: {
        rounds,
      },
    });
  });
});
