import { MD5 as MD5Model } from '../../../grpc/indykite/identity/v1beta1/import';
import HashAlgorithm from './hash_algorithm';

class MD5 extends HashAlgorithm {
  constructor(public key: string) {
    super('md5');
  }

  marshal(): { oneofKind: 'md5'; md5: MD5Model } {
    return {
      oneofKind: 'md5',
      md5: {
        rounds: this.key,
      },
    };
  }
}

export default MD5;
