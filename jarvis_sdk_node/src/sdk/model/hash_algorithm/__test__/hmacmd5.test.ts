import HMACMD5 from '../hmacmd5';
import HashAlgorithm from '../hash_algorithm';

describe('when a new instance is created', () => {
  const key = Buffer.from('key-value');
  let instance: HashAlgorithm;

  beforeEach(() => {
    instance = new HMACMD5(key);
  });

  it('marshals correctly', () => {
    expect(instance.marshal()).toEqual({
      oneofKind: 'hmacMd5',
      hmacMd5: {
        key,
      },
    });
  });
});
