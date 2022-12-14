import MD5 from '../md5';
import HashAlgorithm from '../hash_algorithm';

describe('when a new instance is created', () => {
  const rounds = '14';
  let instance: HashAlgorithm;

  beforeEach(() => {
    instance = new MD5(rounds);
  });

  it('marshals correctly', () => {
    expect(instance.marshal()).toEqual({
      oneofKind: 'md5',
      md5: {
        rounds,
      },
    });
  });
});
