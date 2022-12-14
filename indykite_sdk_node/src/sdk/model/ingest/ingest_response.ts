import { Status } from '../../../grpc/google/rpc/status';
import { StreamRecordsResponse } from '../../../grpc/indykite/ingest/v1beta1/ingest_api';
import { RecordError } from '../../../grpc/indykite/ingest/v1beta1/model';

export class IngestResults {
  public errorResults: IngestResultError[] = [];
  public hasError = false;
  public results: IngestResult[] = [];

  addResult(result: IngestResult): void {
    this.results.push(result);
    if (!this.hasError && result.isError()) {
      this.errorResults.push(result);
      this.hasError = true;
    }
  }

  deserializeAndAdd(result: StreamRecordsResponse): void {
    const instance = IngestResult.deserialize(result);
    this.addResult(instance);
  }
}

export class IngestResult {
  constructor(public id: string, public index: number) {}

  isSuccess(): this is IngestResultSuccess {
    return this instanceof IngestResultSuccess;
  }

  isError(): this is IngestResultError {
    return this instanceof IngestResultError;
  }

  static deserialize(result: StreamRecordsResponse): IngestResult {
    if (result.error.oneofKind !== undefined) {
      return IngestResultError.deserialize(result);
    }
    return new IngestResultSuccess(result.recordId, result.recordIndex);
  }
}

export class IngestResultSuccess extends IngestResult {}

export class IngestResultError extends IngestResult {
  public propertyErrors: Record<string, string[]>;
  public errorCode?: number;
  public errorMessage?: string;
  public errorDetails?: unknown;

  constructor(
    public id: string,
    public index: number,
    recordError: RecordError = { propertyErrors: {} },
    statusError?: Status,
  ) {
    super(id, index);

    this.propertyErrors = Object.keys(recordError.propertyErrors).reduce(
      (errors: Record<string, string[]>, propertyError: string) => {
        errors[propertyError] = recordError.propertyErrors[propertyError].messages;
        return errors;
      },
      {},
    );

    if (statusError) {
      this.errorCode = statusError.code;
      this.errorMessage = statusError.message;
      this.errorDetails = statusError.details;
    }
  }

  static deserialize(result: StreamRecordsResponse): IngestResultError {
    const recordError =
      result.error.oneofKind === 'recordError' ? result.error.recordError : undefined;
    const statusError =
      result.error.oneofKind === 'statusError' ? result.error.statusError : undefined;
    return new IngestResultError(result.recordId, result.recordIndex, recordError, statusError);
  }
}
