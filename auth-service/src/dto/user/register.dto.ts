export class RegisterDto {
  constructor(
    name: string,
    email: string,
    birthdate: Date,
    password: string,
    location: string
  ) {
    this._name = name;
    this._email = email;
    this._birthdate = birthdate;
    this._password = password;
    this._location = location;
  }

  /**
   * Getter name
   * @return {string}
   */
  public get name(): string {
    return this._name;
  }

  /**
   * Getter email
   * @return {string}
   */
  public get email(): string {
    return this._email;
  }

  /**
   * Getter birthdate
   * @return {Date}
   */
  public get birthdate(): Date {
    return this._birthdate;
  }

  /**
   * Getter password
   * @return {string}
   */
  public get password(): string {
    return this._password;
  }

  /**
   * Getter location
   * @return {string}
   */
  public get location(): string {
    return this._location;
  }

  /**
   * Setter name
   * @param {string} value
   */
  public set name(value: string) {
    this._name = value;
  }

  /**
   * Setter email
   * @param {string} value
   */
  public set email(value: string) {
    this._email = value;
  }

  /**
   * Setter birthdate
   * @param {Date} value
   */
  public set birthdate(value: Date) {
    this._birthdate = value;
  }

  /**
   * Setter password
   * @param {string} value
   */
  public set password(value: string) {
    this._password = value;
  }

  /**
   * Setter location
   * @param {string} value
   */
  public set location(value: string) {
    this._location = value;
  }
  private _name: string;
  private _email: string;
  private _birthdate: Date;
  private _password: string;
  private _location: string;
}
