/**
 * Interfaz que define la estructura de un usuario.
 * 
 * Esta interfaz especifica los campos necesarios para crear o representar un usuario en el sistema. 
 * Incluye información personal del usuario, como su nombre, correo electrónico, fecha de nacimiento, 
 * y el estado de la cuenta, entre otros.
 * 
 * @interface UserInterface
 */
export interface UserInterface {
  /**
   * Nombre completo del usuario.
   * 
   * Este campo representa el nombre del usuario y debe ser una cadena de texto.
   * 
   * @type {string}
   */
  name: string;

  /**
   * Dirección de correo electrónico del usuario.
   * 
   * Este campo representa el correo electrónico del usuario y debe ser una cadena de texto válida.
   * 
   * @type {string}
   */
  email: string;

  /**
   * Fecha de nacimiento del usuario.
   * 
   * Este campo contiene la fecha de nacimiento del usuario. El tipo de dato es `Date`.
   * 
   * @type {Date}
   */
  birthdate: Date;

  /**
   * Contraseña del usuario.
   * 
   * Este campo contiene la contraseña del usuario, que se espera sea una cadena de texto.
   * Debe ser almacenada de forma segura (por ejemplo, encriptada) antes de guardarse en la base de datos.
   * 
   * @type {string}
   */
  password: string;

  /**
   * Rol del usuario en el sistema.
   * 
   * Este campo representa el rol del usuario, que puede ser un número o el valor 2.
   * El valor del rol determina los permisos y la funcionalidad disponible para el usuario.
   * 
   * @type {number | 2}
   */
  role: number | 2;

  /**
   * Estado de la cuenta del usuario.
   * 
   * Este campo indica el estado actual de la cuenta del usuario, por ejemplo, "activo", "suspendido", etc.
   * 
   * @type {string}
   */
  accountStatus: string;

  /**
   * Fecha en que el usuario fue registrado en el sistema.
   * 
   * Este campo contiene la fecha de registro del usuario y debe ser de tipo `Date`.
   * 
   * @type {Date}
   */
  registeredAt: Date;
}
