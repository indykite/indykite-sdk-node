import { PBKDF2SHA256 as PBKDF2SHA256Model } from '../../../grpc/indykite/identity/v1beta1/import';
import HashAlgorithm from './hash_algorithm';

class PBKDF2SHA256 extends HashAlgorithm {
  constructor(public key: string) {
    super('pbkdf2Sha256');
  }

  marshal(): { oneofKind: 'pbkdf2Sha256'; pbkdf2Sha256: PBKDF2SHA256Model } {
    return {
      oneofKind: 'pbkdf2Sha256',
      pbkdf2Sha256: {
        rounds: this.key,
      },
    };
  }
}

export default PBKDF2SHA256;
