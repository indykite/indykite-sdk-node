import { StandardScrypt as StandardScryptModel } from '../../../grpc/indykite/identity/v1beta1/import';
import HashAlgorithm from './hash_algorithm';

class StandardScrypt extends HashAlgorithm {
  constructor(
    public blockSize: string,
    public derivedKeyLength: string,
    public memoryCost: string,
    public parallelization: string,
  ) {
    super('standardScrypt');
  }

  marshal(): { oneofKind: 'standardScrypt'; standardScrypt: StandardScryptModel } {
    return {
      oneofKind: 'standardScrypt',
      standardScrypt: {
        blockSize: this.blockSize,
        derivedKeyLength: this.derivedKeyLength,
        memoryCost: this.memoryCost,
        parallelization: this.parallelization,
      },
    };
  }
}

export default StandardScrypt;
