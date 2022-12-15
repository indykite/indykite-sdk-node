import { SHA1 as SHA1Model } from '../../../grpc/indykite/identity/v1beta2/import';
import HashAlgorithm from './hash_algorithm';

class SHA1 extends HashAlgorithm {
  constructor(public key: string) {
    super('sha1');
  }

  marshal(): { oneofKind: 'sha1'; sha1: SHA1Model } {
    return {
      oneofKind: 'sha1',
      sha1: {
        rounds: this.key,
      },
    };
  }
}

export default SHA1;
