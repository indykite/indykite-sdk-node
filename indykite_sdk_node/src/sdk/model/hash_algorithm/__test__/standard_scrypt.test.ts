import StandardScrypt from '../standard_scrypt';
import HashAlgorithm from '../hash_algorithm';

describe('when a new instance is created', () => {
  let instance: HashAlgorithm;

  beforeEach(() => {
    instance = new StandardScrypt(
      'block-size',
      'derived-key-length',
      'memory-cost',
      'parallelization',
    );
  });

  it('marshals correctly', () => {
    expect(instance.marshal()).toEqual({
      oneofKind: 'standardScrypt',
      standardScrypt: {
        blockSize: 'block-size',
        derivedKeyLength: 'derived-key-length',
        memoryCost: 'memory-cost',
        parallelization: 'parallelization',
      },
    });
  });
});
