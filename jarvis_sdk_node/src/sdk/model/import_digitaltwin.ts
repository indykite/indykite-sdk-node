import {
  ImportDigitalTwin as ImportDigitalTwinModel,
  PasswordCredential as PasswordCredentialModel,
  ImportDigitalTwinResult as ImportDigitalTwinResultModel,
} from '../../grpc/indykite/identity/v1beta1/import';
import { Utils } from '../utils/utils';
import { DigitalTwin, DigitalTwinCore } from './digitaltwin';
import { PatchPropertiesBuilder, PatchResult, Property } from './property';

export interface Email {
  email: string;
  verified: boolean;
}

export interface Mobile {
  mobile: string;
  verified: boolean;
}

export interface PasswordHash {
  hash: Buffer;
  salt: Buffer;
}

export interface PasswordCredential {
  uid?: string | Email | Mobile;
  password?: string | PasswordHash;
}

export interface PropertyOperation {
  operation: 'add' | 'replace' | 'remove';
  property: Property;
}

export interface ImportProperties {
  operations: PatchPropertiesBuilder;
  forceDelete: boolean;
}

export interface UserProvider {
  uid: string;
  providerId: string;
  email: string;
  displayName: string;
  photoUrl: string;
}

export class ImportDigitalTwin extends DigitalTwin {
  private forceDeleteProperties?: boolean;

  static fromDigitalTwin(
    digitalTwin: DigitalTwin,
    password?: PasswordCredential,
    userProvider?: UserProvider[],
    lastLoginDate?: Date,
    lastRefreshDate?: Date,
    forceDeleteProperties?: boolean,
  ): ImportDigitalTwin {
    return new ImportDigitalTwin(
      digitalTwin.tenantId,
      digitalTwin.kind,
      digitalTwin.state,
      digitalTwin.id,
      password,
      userProvider,
      {
        operations: digitalTwin.getOperationsBuilder(),
        forceDelete: forceDeleteProperties ?? false,
      },
      digitalTwin.createTime,
      lastLoginDate,
      lastRefreshDate,
    );
  }

  constructor(
    public tenantId: string,
    public kind: number,
    public state: number,
    public digitalTwinId?: string,
    public password?: PasswordCredential,
    public userProvider?: UserProvider[],
    importProperties?: ImportProperties,
    createDate?: Date,
    public lastLoginDate?: Date,
    public lastRefreshDate?: Date,
  ) {
    super(digitalTwinId ?? '', tenantId, kind, state, createDate);

    if (importProperties) {
      this.patchBuilder = importProperties.operations;
      this.forceDeleteProperties = importProperties.forceDelete;
    }
  }

  marshal(): ImportDigitalTwinModel {
    const value: ImportDigitalTwinModel = {
      id: Utils.uuidToBuffer(this.id),
      tenantId: Utils.uuidToBuffer(this.tenantId),
      kind: this.kind,
      state: this.state,
      providerUserInfo: this.userProvider ?? [],
      password: this.marshalPassword(),
    };

    value.properties = {
      operations: this.patchBuilder.build(),
      forceDelete: this.forceDeleteProperties ?? false,
    };

    if (this.createTime && this.lastLoginDate && this.lastRefreshDate) {
      value.metadata = {
        creationTimestamp: this.createTime.getTime().toString(),
        lastLogInTimestamp: this.lastLoginDate.getTime().toString(),
        lastRefreshTimestamp: this.lastRefreshDate.getTime().toString(),
      };
    }

    return value;
  }

  private marshalPassword(): PasswordCredentialModel | undefined {
    if (!this.password) return;

    let uid, password;

    if (typeof this.password.uid === 'string') {
      uid = {
        oneofKind: 'username' as const,
        username: this.password.uid,
      };
    } else if (!this.password.uid) {
      uid = {
        oneofKind: undefined,
      };
    } else if ('mobile' in this.password.uid) {
      uid = {
        oneofKind: 'mobile' as const,
        mobile: this.password.uid,
      };
    } else {
      uid = {
        oneofKind: 'email' as const,
        email: this.password.uid,
      };
    }

    if (typeof this.password.password === 'string') {
      password = {
        oneofKind: 'value' as const,
        value: this.password.password,
      };
    } else if (!this.password.password) {
      password = {
        oneofKind: undefined,
      };
    } else {
      password = {
        oneofKind: 'hash' as const,
        hash: {
          passwordHash: this.password.password.hash.valueOf(),
          salt: this.password.password.salt.valueOf(),
        },
      };
    }

    return {
      uid,
      password,
    };
  }
}

export class ImportResult {
  constructor(public index: string) {}

  isSuccess(): this is ImportResultSuccess {
    return this instanceof ImportResultSuccess;
  }

  isError(): this is ImportResultError {
    return this instanceof ImportResultError;
  }

  static deserialize(result: ImportDigitalTwinResultModel): ImportResult | null {
    if (result.result.oneofKind === 'success') {
      let dt, patchResult;
      if (result.result.success.digitalTwin) {
        dt = DigitalTwinCore.fromModel(result.result.success.digitalTwin);
      }
      if (result.result.success.results) {
        patchResult = result.result.success.results.map((result) =>
          PatchResult.deserialize(result),
        );
      }

      return new ImportResultSuccess(result.index, dt, patchResult);
    } else if (result.result.oneofKind === 'error') {
      return new ImportResultError(result.index, result.result.error.message);
    }

    return new ImportResult(result.index);
  }
}

export class ImportResultSuccess extends ImportResult {
  constructor(
    index: string,
    public digitalTwin?: DigitalTwinCore,
    public propertiesResult?: PatchResult[],
  ) {
    super(index);
  }
}

export class ImportResultError extends ImportResult {
  constructor(index: string, public message: string[]) {
    super(index);
  }
}
