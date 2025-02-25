import { logger } from '@config/logger';
import { verifyLoginInterface } from '@interfaces/user/verifyLogin.interface';
import { verifyLoginService } from '@services/user/verifyLogin.service';
import { getDeviceInfo } from '@utils/UAparse/getDeviceInfo';
import { Request, Response } from 'express';

export const verifyLoginController = async (req: Request, res: Response) => {
  try {
    const data = req.body as verifyLoginInterface;
    const devices = await getDeviceInfo(req);
    const token = await verifyLoginService(data, devices);
    res.status(201).json({ message: 'User Auth successfully', token: token });
  } catch (error) {
    // Manejo de errores
    const errorMessage =
      error instanceof Error ? error.message : 'Ocurrió un error desconocido';

    // Se loggea el error para análisis posterior, incluyendo los detalles del usuario y el mensaje de error
    logger.error('Error al verificar el login', {
      email: req.body?.email || 'Email no proporcionado',
      error: errorMessage,
    });

    // Se devuelve una respuesta de error con el código de estado 500 y el mensaje de error
    res
      .status(500)
      .json({ error: errorMessage, message: 'Error al verificar el login' });
  }
};
