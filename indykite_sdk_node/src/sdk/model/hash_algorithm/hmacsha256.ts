import { HMACSHA256 as HMACSHA256Model } from '../../../grpc/indykite/identity/v1beta1/import';
import HashAlgorithm from './hash_algorithm';

class HMACSHA256 extends HashAlgorithm {
  constructor(public key: Buffer) {
    super('hmacSha256');
  }

  marshal(): { oneofKind: 'hmacSha256'; hmacSha256: HMACSHA256Model } {
    return {
      oneofKind: 'hmacSha256',
      hmacSha256: {
        key: this.key,
      },
    };
  }
}

export default HMACSHA256;
