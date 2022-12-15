import { HMACSHA512 as HMACSHA512Model } from '../../../grpc/indykite/identity/v1beta2/import';
import HashAlgorithm from './hash_algorithm';

class HMACSHA512 extends HashAlgorithm {
  constructor(public key: Buffer) {
    super('hmacSha512');
  }

  marshal(): { oneofKind: 'hmacSha512'; hmacSha512: HMACSHA512Model } {
    return {
      oneofKind: 'hmacSha512',
      hmacSha512: {
        key: this.key,
      },
    };
  }
}

export default HMACSHA512;
