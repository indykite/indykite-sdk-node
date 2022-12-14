import { Bcrypt as BcryptModel } from '../../../grpc/indykite/identity/v1beta1/import';
import HashAlgorithm from './hash_algorithm';

class Bcrypt extends HashAlgorithm {
  constructor() {
    super('bcrypt');
  }

  marshal(): { oneofKind: 'bcrypt'; bcrypt: BcryptModel } {
    return {
      oneofKind: 'bcrypt',
      bcrypt: {},
    };
  }
}

export default Bcrypt;
