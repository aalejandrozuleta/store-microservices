export class AuthDto {
  private _email: string;
  private _password: string;
  private _twoFactorCode?: string;

  constructor(email: string, password: string, twoFactorCode?: string) {
    this._email = email;
    this._password = password;
    this._twoFactorCode = twoFactorCode;
  }

  /**
   * Getter email
   * @return {string}
   */
  public get email(): string {
    return this._email;
  }

  /**
   * Getter twoFactorCode
   * @return {string | undefined}
   */
  public get twoFactorCode(): string | undefined {
    return this._twoFactorCode;
  }

  /**
   * Getter password
   * @return {string}
   */
  public get password(): string {
    return this._password;
  }

  /**
   * Setter email
   * @param {string} value
   */
  public set email(value: string) {
    this._email = value;
  }

  /**
   * Setter password
   * @param {string} value
   */
  public set password(value: string) {
    this._password = value;
  }

  /**
   * Setter twoFactorCode
   * @param {string | undefined} value
   */
  public set twoFactorCode(value: string | undefined) {
    this._twoFactorCode = value;
  }
}
