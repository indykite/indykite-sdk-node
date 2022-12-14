import { HMACMD5 as HMACMD5Model } from '../../../grpc/indykite/identity/v1beta1/import';
import HashAlgorithm from './hash_algorithm';

class HMACMD5 extends HashAlgorithm {
  constructor(public key: Buffer) {
    super('hmacMd5');
  }

  marshal(): { oneofKind: 'hmacMd5'; hmacMd5: HMACMD5Model } {
    return {
      oneofKind: 'hmacMd5',
      hmacMd5: {
        key: this.key,
      },
    };
  }
}

export default HMACMD5;
