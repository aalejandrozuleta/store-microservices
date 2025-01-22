import { hashPasswordService } from "@services/bcrypt/hashPassword.service";
import { Request, Response } from "express";

/**
 * Controlador para generar el hash de una contraseña.
 * 
 * Este controlador recibe la contraseña en el cuerpo de la solicitud (`req.body.password`), 
 * llama al servicio `hashPasswordService` para generar el hash, 
 * y devuelve una respuesta con el hash generado o un error si ocurre algún problema.
 * 
 * @param req - Objeto de solicitud de Express, que contiene el cuerpo de la solicitud con la contraseña.
 * @param res - Objeto de respuesta de Express, utilizado para enviar la respuesta al cliente.
 * 
 * @throws Error - Si ocurre un error durante el proceso de generación del hash.
 */
export const hashPasswordController = async (req: Request, res: Response): Promise<void> => {
  try {
    const hash = await hashPasswordService(req.body.password);
    res.status(200).send({ message: "Hash generado correctamente", value: hash });
  } catch (error) {
    res.status(500).send({ message: error });
  }
};
