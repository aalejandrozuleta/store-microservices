import { EmailsInterface } from "@interfaces/emails.interface";
import { emailService } from "@services/emails/email.service";
import { Request, Response } from "express";

/**
 * Controlador para manejar el envío de correos electrónicos.
 *
 * Este controlador recibe los datos del correo electrónico desde el cuerpo de la solicitud,
 * los valida contra la interfaz `EmailsInterface` y utiliza el servicio `emailService` para
 * enviar el correo. Devuelve una respuesta indicando si el correo fue enviado exitosamente
 * o si ocurrió un error.
 *
 * @param req - Objeto de solicitud de Express que contiene los datos del correo en el cuerpo (`req.body.data`).
 * @param res - Objeto de respuesta de Express para enviar la respuesta al cliente.
 *
 * @returns Una respuesta HTTP con un estado `200` si el correo fue enviado correctamente, o un estado `500` en caso de error.
 */
export const emailController = async (req: Request, res: Response): Promise<void> => {
  const data = req.body.data as EmailsInterface;

  try {
    await emailService(data);
    res.status(200).send({ message: "Correo enviado correctamente" });
  } catch (error) {
    console.error("Error al enviar correo:", error);
    res.status(500).send({ message: error });
  }
};
