import { Scrypt as ScryptModel } from '../../../grpc/indykite/identity/v1beta1/import';
import HashAlgorithm from './hash_algorithm';

class Scrypt extends HashAlgorithm {
  constructor(
    public key: Buffer,
    public saltSeparator: Buffer,
    public rounds: string,
    public memoryCost: string,
  ) {
    super('scrypt');
  }

  marshal(): { oneofKind: 'scrypt'; scrypt: ScryptModel } {
    return {
      oneofKind: 'scrypt',
      scrypt: {
        key: new Uint8Array(this.key),
        saltSeparator: new Uint8Array(this.saltSeparator),
        rounds: this.rounds,
        memoryCost: this.memoryCost,
      },
    };
  }
}

export default Scrypt;
