import { ImportDigitalTwinsRequest } from '../../../grpc/indykite/identity/v1beta2/import';

abstract class HashAlgorithm {
  constructor(public type: ImportDigitalTwinsRequest['hashAlgorithm']['oneofKind']) {}

  abstract marshal(): ImportDigitalTwinsRequest['hashAlgorithm'];
}

export default HashAlgorithm;
