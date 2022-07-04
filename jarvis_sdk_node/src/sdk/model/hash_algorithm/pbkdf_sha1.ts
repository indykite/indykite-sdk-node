import { PBKDFSHA1 as PBKDFSHA1Model } from '../../../grpc/indykite/identity/v1beta1/import';
import HashAlgorithm from './hash_algorithm';

class PBKDFSHA1 extends HashAlgorithm {
  constructor(public key: string) {
    super('pbkdfSha1');
  }

  marshal(): { oneofKind: 'pbkdfSha1'; pbkdfSha1: PBKDFSHA1Model } {
    return {
      oneofKind: 'pbkdfSha1',
      pbkdfSha1: {
        rounds: this.key,
      },
    };
  }
}

export default PBKDFSHA1;
