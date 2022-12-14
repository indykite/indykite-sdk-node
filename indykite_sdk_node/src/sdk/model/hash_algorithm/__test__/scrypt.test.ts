import Scrypt from '../scrypt';
import HashAlgorithm from '../hash_algorithm';

describe('when a new instance is created', () => {
  const key = Buffer.from('key-value');
  const saltSeparator = Buffer.from('salt-separator');
  let instance: HashAlgorithm;

  beforeEach(() => {
    instance = new Scrypt(key, saltSeparator, 'rounds', 'memory-cost');
  });

  it('marshals correctly', () => {
    expect(instance.marshal()).toEqual({
      oneofKind: 'scrypt',
      scrypt: {
        key: new Uint8Array(key),
        saltSeparator: new Uint8Array(saltSeparator),
        rounds: 'rounds',
        memoryCost: 'memory-cost',
      },
    });
  });
});
