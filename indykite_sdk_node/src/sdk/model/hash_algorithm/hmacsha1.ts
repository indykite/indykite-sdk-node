import { HMACSHA1 as HMACSHA1Model } from '../../../grpc/indykite/identity/v1beta2/import';
import HashAlgorithm from './hash_algorithm';

class HMACSHA1 extends HashAlgorithm {
  constructor(public key: Buffer) {
    super('hmacSha1');
  }

  marshal(): { oneofKind: 'hmacSha1'; hmacSha1: HMACSHA1Model } {
    return {
      oneofKind: 'hmacSha1',
      hmacSha1: {
        key: this.key,
      },
    };
  }
}

export default HMACSHA1;
