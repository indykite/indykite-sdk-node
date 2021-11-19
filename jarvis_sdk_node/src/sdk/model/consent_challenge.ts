import * as grpcId from '../../grpc/indykite/identity/v1beta1/identity_management_api';
import { DigitalTwin } from './digitaltwin';
import { SdkError, SdkErrorCode } from '../error';
import { Utils } from '../utils/utils';

export interface Scope {
  name: string;
  displayName: string;
  description: string;
  required: boolean;
}

export interface Audience {
  userSupportEmailAddress: string;
  clientId: string;
  displayName: string;
  description: string;
  logoUrl: string;
  homepageUrl: string;
  privacyPolicyUrl: string;
  tosUrl: string;
}

export interface ConsentChallengeDenial {
  error?: string;
  errorDescription?: string;
  errorHint?: string;
  statusCode?: number;
}

export interface ConsentRequestSessionData {
  accessToken?: { [key: string]: unknown };
  idToken?: { [key: string]: unknown };
  userInfo?: { [key: string]: unknown };
}

export interface ConsentApproval {
  grantScopes?: string[];
  grantedAudiences?: string[];
  session?: ConsentRequestSessionData;
  remember?: boolean;
  rememberFor?: number;
}

export class ConsentChallenge {
  private approvedScopeNames: string[];
  private approvedAudiences: string[];
  private denialReason: ConsentChallengeDenial | null;
  private sessionData?: ConsentRequestSessionData;
  private remember?: boolean;
  private rememberFor?: number;

  constructor(
    public challenge: string,
    public clientId: string,
    public scopes: Scope[],
    public requestUrl: string,
    public audiences: Audience[],
    public appSpaceId: string,
    public acrs: string[],
    public subjectIdentifier: string,
    public skip: boolean,
    public digitalTwin?: DigitalTwin,
    public authenticatedAt?: Date,
    public requestedAt?: Date,
  ) {
    this.approvedScopeNames = [];
    this.approvedAudiences = [];
    this.denialReason = null;
  }

  static deserialize(
    response: grpcId.CheckConsentChallengeResponse,
    challenge: string,
  ): ConsentChallenge {
    return new ConsentChallenge(
      challenge,
      response.clientId,
      response.scopes,
      response.requestUrl,
      response.audiences,
      Utils.uuidToString(response.appSpaceId),
      response.acrs,
      response.subjectIdentifier,
      response.skip,
      response.digitalTwin &&
        new DigitalTwin(
          Utils.uuidToString(response.digitalTwin.id),
          Utils.uuidToString(response.digitalTwin.tenantId),
          response.digitalTwin.kind,
          response.digitalTwin.state,
        ),
      response.authenticatedAt,
      response.requestedAt,
    );
  }

  approveScope(scopeName: string): void {
    if (!this.scopes.find((scope) => scope.name === scopeName)) {
      throw new SdkError(SdkErrorCode.SDK_CODE_1, 'Unknown scope');
    }

    if (!this.approvedScopeNames.includes(scopeName)) {
      this.approvedScopeNames.push(scopeName);
    }
  }

  approveScopes(scopeNames: string[]): void {
    scopeNames.forEach(this.approveScope.bind(this));
  }

  approveAudience(audience: string): void {
    if (!this.approvedAudiences.includes(audience)) {
      this.approvedAudiences.push(audience);
    }
  }

  approveAudiences(audiences: string[]): void {
    audiences.forEach(this.approveAudience.bind(this));
  }

  deny(reason: ConsentChallengeDenial): void {
    this.denialReason = reason;
  }

  getApprovedAudiences(): string[] {
    return this.approvedAudiences;
  }

  getApprovedScopeNames(): string[] {
    return this.approvedScopeNames;
  }

  getDenialReason(): ConsentChallengeDenial | null {
    return this.denialReason;
  }

  getRemember(): boolean | undefined {
    return this.remember;
  }

  getRememberFor(): number | undefined {
    return this.rememberFor;
  }

  getSession(): ConsentRequestSessionData | undefined {
    return this.sessionData;
  }

  isDenied(): boolean {
    return !!this.denialReason;
  }

  setRemember(remember: boolean): void {
    this.remember = remember;
  }

  setRememberFor(seconds: number): void {
    this.rememberFor = seconds;
  }

  setSession(session: ConsentRequestSessionData): void {
    this.sessionData = session;
  }
}
