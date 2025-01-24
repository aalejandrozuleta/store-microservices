/**
 * Interfaz que define la estructura de los datos necesarios para enviar un correo electrónico.
 */
export interface EmailsInterface {
  /**
   * Dirección de correo electrónico del destinatario.
   *
   * @example "destinatario@example.com"
   */
  email: string;

  /**
   * Nombre del archivo de plantilla HTML que se utilizará para el correo.
   *
   * @example "welcome-template.html"
   */
  template: string;

  /**
   * Asunto del correo electrónico.
   *
   * @example "Bienvenido a nuestra plataforma"
   */
  subject: string;

  /**
   * Variables dinámicas que se utilizarán para personalizar la plantilla.
   *
   * Las claves del objeto representan los marcadores en la plantilla, y los valores son
   * los datos que los reemplazarán.
   *
   * @example
   * {
   *   "nombre": "Juan",
   *   "enlace": "https://example.com"
   * }
   */
  variables: {} | null;
}
