export class Token {
  constructor(public accessToken: string, public tokenType: string, public expiry: Date) {}

  valid(): boolean {
    const current = new Date();
    const shiftedCurrentTime = current.getTime() + 30 * 1000;
    return this.expiry.getTime() > shiftedCurrentTime;
  }
}
