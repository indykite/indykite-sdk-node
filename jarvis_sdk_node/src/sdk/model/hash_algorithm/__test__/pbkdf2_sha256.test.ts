import PBKDF2SHA256 from '../pbkdf2_sha256';
import HashAlgorithm from '../hash_algorithm';

describe('when a new instance is created', () => {
  const rounds = '14';
  let instance: HashAlgorithm;

  beforeEach(() => {
    instance = new PBKDF2SHA256(rounds);
  });

  it('marshals correctly', () => {
    expect(instance.marshal()).toEqual({
      oneofKind: 'pbkdf2Sha256',
      pbkdf2Sha256: {
        rounds,
      },
    });
  });
});
