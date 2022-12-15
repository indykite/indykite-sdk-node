import { SHA512 as SHA512Model } from '../../../grpc/indykite/identity/v1beta2/import';
import HashAlgorithm from './hash_algorithm';

class SHA512 extends HashAlgorithm {
  constructor(public key: string) {
    super('sha512');
  }

  marshal(): { oneofKind: 'sha512'; sha512: SHA512Model } {
    return {
      oneofKind: 'sha512',
      sha512: {
        rounds: this.key,
      },
    };
  }
}

export default SHA512;
