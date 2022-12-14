import Bcrypt from '../bcrypt';
import HashAlgorithm from '../hash_algorithm';

describe('when a new instance is created', () => {
  let instance: HashAlgorithm;

  beforeEach(() => {
    instance = new Bcrypt();
  });

  it('marshals correctly', () => {
    expect(instance.marshal()).toEqual({
      oneofKind: 'bcrypt',
      bcrypt: {},
    });
  });
});
