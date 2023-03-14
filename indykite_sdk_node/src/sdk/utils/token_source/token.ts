export class Token {
  constructor(public accessToken: string, public tokenType: string, public expiry: Date) {}

  /**
   * Check if the token is valid. This function returns false when the token is expired or when
   * there is less than 30 seconds before the token gets invalidated.
   * @since 0.2.3
   */
  valid(): boolean {
    const current = new Date();
    const shiftedCurrentTime = current.getTime() + 30 * 1000;
    return this.expiry.getTime() > shiftedCurrentTime;
  }
}
