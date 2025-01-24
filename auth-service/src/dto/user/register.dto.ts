/**
 * Clase que representa un objeto de transferencia de datos (DTO) para el registro de un usuario.
 *
 * Esta clase se utiliza para transferir la información necesaria para registrar un nuevo usuario en el sistema,
 * incluyendo el nombre, correo electrónico, fecha de nacimiento, contraseña y rol.
 * Los datos son encapsulados en la clase, proporcionando getters y setters para acceder y modificar los valores.
 *
 * @class RegisterDto
 */
export class RegisterDto {
  /**
   * Crea una instancia de la clase `RegisterDto` con los datos necesarios para el registro.
   *
   * @param name - Nombre completo del usuario.
   * @param email - Dirección de correo electrónico del usuario.
   * @param birthdate - Fecha de nacimiento del usuario.
   * @param password - Contraseña del usuario.
   * @param role - Rol del usuario en el sistema (por ejemplo, 1 para administrador, 2 para cliente).
   */
  constructor(
    name: string,
    email: string,
    birthdate: Date,
    password: string,
    role: number
  ) {
    this._name = name;
    this._email = email;
    this._birthdate = birthdate;
    this._password = password;
    this._role = role;
  }

  /**
   * Obtiene el nombre del usuario.
   *
   * @returns {string} El nombre del usuario.
   */
  public get name(): string {
    return this._name;
  }

  /**
   * Obtiene el correo electrónico del usuario.
   *
   * @returns {string} El correo electrónico del usuario.
   */
  public get email(): string {
    return this._email;
  }

  /**
   * Obtiene la fecha de nacimiento del usuario.
   *
   * @returns {Date} La fecha de nacimiento del usuario.
   */
  public get birthdate(): Date {
    return this._birthdate;
  }

  /**
   * Obtiene la contraseña del usuario.
   *
   * @returns {string} La contraseña del usuario.
   */
  public get password(): string {
    return this._password;
  }

  /**
   * Obtiene el rol del usuario.
   *
   * @returns {number} El rol del usuario en el sistema.
   */
  public get role(): number {
    return this._role;
  }

  /**
   * Establece el nombre del usuario.
   *
   * @param {string} value - El nombre a establecer.
   */
  public set name(value: string) {
    this._name = value;
  }

  /**
   * Establece el correo electrónico del usuario.
   *
   * @param {string} value - El correo electrónico a establecer.
   */
  public set email(value: string) {
    this._email = value;
  }

  /**
   * Establece la fecha de nacimiento del usuario.
   *
   * @param {Date} value - La fecha de nacimiento a establecer.
   */
  public set birthdate(value: Date) {
    this._birthdate = value;
  }

  /**
   * Establece la contraseña del usuario.
   *
   * @param {string} value - La contraseña a establecer.
   */
  public set password(value: string) {
    this._password = value;
  }

  /**
   * Establece el rol del usuario.
   *
   * @param {number} value - El rol a establecer.
   */
  public set role(value: number) {
    this._role = value;
  }

  // Propiedades privadas
  private _name: string;
  private _email: string;
  private _birthdate: Date;
  private _password: string;
  private _role: number;
}
