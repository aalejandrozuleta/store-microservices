import { comparePasswordService } from '@services/bcrypt/comparePassword.service';
import { Request, Response } from 'express';

/**
 * Controlador para comparar una contraseña con un hash.
 *
 * Este controlador recibe la contraseña y el hash en el cuerpo de la solicitud (`req.body.password`, `req.body.hashPassword`),
 * llama al servicio `comparePasswordService` para comparar la contraseña con el hash,
 * y devuelve una respuesta indicando si la comparación fue exitosa o si ocurrió un error.
 *
 * @param req - Objeto de solicitud de Express, que contiene el cuerpo de la solicitud con la contraseña y el hash.
 * @param res - Objeto de respuesta de Express, utilizado para enviar la respuesta al cliente.
 *
 * @throws Error - Si ocurre un error durante el proceso de comparación de la contraseña.
 */
export const comparePasswordController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const compare = await comparePasswordService(
      req.body.password,
      req.body.hashPassword
    );
    res
      .status(200)
      .send({ message: 'Contraseña comparada correctamente', value: compare });
  } catch (error) {
    res.status(500).send({ message: error });
  }
};
