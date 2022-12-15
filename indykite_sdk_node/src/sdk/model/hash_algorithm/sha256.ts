import { SHA256 as SHA256Model } from '../../../grpc/indykite/identity/v1beta2/import';
import HashAlgorithm from './hash_algorithm';

class SHA256 extends HashAlgorithm {
  constructor(public key: string) {
    super('sha256');
  }

  marshal(): { oneofKind: 'sha256'; sha256: SHA256Model } {
    return {
      oneofKind: 'sha256',
      sha256: {
        rounds: this.key,
      },
    };
  }
}

export default SHA256;
