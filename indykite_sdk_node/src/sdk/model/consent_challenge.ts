import * as grpcId from '../../grpc/indykite/identity/v1beta2/identity_management_api';
import { MapValue } from '../../grpc/indykite/objects/v1beta1/struct';
import { DigitalTwin } from './digitaltwin';
import { SdkError, SdkErrorCode } from '../error';
import { Utils } from '../utils/utils';

export interface ConsentChallengeScope {
  name: string;
  displayName: string;
  description: string;
  required: boolean;
}

export interface ConsentChallengeAudience {
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
  error: string;
  errorDescription: string;
  errorHint: string;
  statusCode: number;
}

export interface ConsentRequestSessionData {
  accessToken?: MapValue;
  idToken?: MapValue;
  userInfo?: MapValue;
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
  private rememberFor?: string;

  constructor(
    public challenge: string,
    public clientId: string,
    public scopes: ConsentChallengeScope[],
    public requestUrl: string,
    public audiences: ConsentChallengeAudience[],
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
    response: grpcId.CheckOAuth2ConsentChallengeResponse,
    challenge: string,
  ): ConsentChallenge {
    return new ConsentChallenge(
      challenge,
      response.clientId,
      response.scopes,
      response.requestUrl,
      response.audiences,
      response.appSpaceId,
      response.acrs,
      response.subjectIdentifier,
      response.skip,
      response.digitalTwin &&
        new DigitalTwin(
          response.digitalTwin.id,
          response.digitalTwin.tenantId,
          response.digitalTwin.kind,
          response.digitalTwin.state,
          response.digitalTwin.tags,
        ),
      Utils.timestampToDate(response.authenticatedAt),
      Utils.timestampToDate(response.requestedAt),
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

  getRememberFor(): string | undefined {
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

  setRememberFor(seconds: string): void {
    this.rememberFor = seconds;
  }

  setSession(session: ConsentRequestSessionData): void {
    this.sessionData = session;
  }
}
