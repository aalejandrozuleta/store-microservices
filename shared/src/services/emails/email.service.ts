import { Resend } from 'resend';
import { EmailsInterface } from '@interfaces/emails.interface';
import path from 'path';
import { loadTemplate } from '@helpers/emails/loadTemplate';

/**
 * Servicio para enviar correos electrónicos utilizando la API de Resend.
 *
 * Este servicio construye y envía un correo electrónico utilizando un archivo de plantilla HTML
 * y las variables proporcionadas. Utiliza la librería `resend` para manejar el envío de correos.
 *
 * @param data - Objeto que implementa la interfaz `EmailsInterface`, que contiene los datos necesarios
 * para enviar el correo, como el destinatario, asunto, plantilla y variables para personalizar el contenido.
 *
 * @throws Error - Lanza un error si no se puede enviar el correo o si ocurre un problema con la configuración.
 *
 * @example
 *  Ejemplo de uso
 * const data: EmailsInterface = {
 *   email: "destinatario@example.com",
 *   subject: "Asunto del correo",
 *   template: "example-template.html",
 *   variables: {
 *     nombre: "Juan",
 *     enlace: "https://example.com"
 *   }
 * };
 * await emailService(data);
 */

export const emailService = async (data: EmailsInterface): Promise<void> => {
  // Inicializa la instancia de Resend con la clave API.
  const resend = new Resend(process.env.RESEND_API);

  // Define la dirección de remitente desde las variables de entorno.
  const fromString: string = process.env.FROM_RESEND || '';

  // Construye la ruta completa de la plantilla HTML.
  const sendHtml = path.join(__dirname, '../../template', data.template);

  // Carga el contenido de la plantilla y lo personaliza con las variables proporcionadas.
  const htmlContent = loadTemplate(sendHtml, data.variables || {});

  // Envía el correo utilizando la librería Resend.
  await resend.emails.send({
    from: fromString,
    to: data.email,
    subject: data.subject,
    html: htmlContent,
  });
};
