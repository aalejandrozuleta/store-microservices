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
   * Dirección de correo electrónico de recuperación del usuario.
   *
   * Este campo contiene el correo electrónico de recuperación y debe ser una cadena de texto válida.
   *
   * @type {string}
   */
  recovery_email: string;

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
   * Este campo representa el rol del usuario, que puede ser 'ADMIN', 'MODERATOR', 'STORE_OWNER', 'DELIVERY_OWNER', 'USER'.
   * El valor del rol determina los permisos y la funcionalidad disponible para el usuario.
   *
   * @type {'ADMIN' | 'MODERATOR' | 'STORE_OWNER' | 'DELIVERY_OWNER' | 'USER'}
   */
  role: 'ADMIN' | 'MODERATOR' | 'STORE_OWNER' | 'DELIVERY_OWNER' | 'USER';

  /**
   * Ubicación del usuario.
   *
   * Este campo representa la ubicación del usuario y debe ser una cadena de texto.
   *
   * @type {string}
   */
  location: string;

  /**
   * Estado de la cuenta del usuario.
   *
   * Este campo indica el estado actual de la cuenta del usuario, por ejemplo, "ACTIVO", "INACTIVO", "SUSPENDIDO".
   *
   * @type {'ACTIVE' | 'INACTIVE' | 'SUSPENDED'}
   */
  accountStatus: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
}

/**
 * Interfaz que define la estructura de los dispositivos de usuario.
 *
 * Esta interfaz especifica los campos necesarios para almacenar información sobre los dispositivos
 * que utiliza un usuario para acceder al sistema.
 *
 * @interface UserDevicesInterface
 */
export interface UserDevicesInterface {
  /**
   * Identificador del usuario al que pertenece el dispositivo.
   *
   * Este campo es un número que referencia al usuario asociado al dispositivo.
   *
   * @type {number}
   */
  user_id?: number;

  /**
   * Nombre del dispositivo.
   *
   * Este campo es una cadena de texto que indica el nombre del dispositivo.
   *
   * @type {string}
   */
  device_name: string;

  /**
   * Dirección IP del dispositivo.
   *
   * Este campo es una cadena de texto que contiene la dirección IP desde donde el usuario accedió.
   *
   * @type {string}
   */
  ip_address: string;

  /**
   * Agente de usuario del dispositivo.
   *
   * Este campo es una cadena de texto que indica el agente de usuario del navegador o dispositivo.
   *
   * @type {string}
   */
  user_agent: string;

  /**
   * Ubicación del dispositivo.
   *
   * Este campo es una cadena de texto que indica la ubicación del dispositivo.
   *
   * @type {string}
   */
  location: string;

  /**
   * Estado del dispositivo.
   *
   * Este campo indica si el dispositivo ha sido autorizado o no.
   *
   * @type {string}
   */

  autorizad?: string;
}
