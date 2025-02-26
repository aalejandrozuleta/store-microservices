import { logger } from '@config/logger';
import { verify2fa } from '@interfaces/2fa/verify.interface';
import { verify2FAService } from '@services/2fa/verify.service';
import { getDeviceInfo } from '@utils/UAparse/getDeviceInfo';
import { Request, Response } from 'express';

/**
 * Verifica el código 2FA del usuario.
 */
export const verify2FAController = async (req: Request, res: Response) => {
  try {
    console.log('req ----------------------');

    const data = req.body as verify2fa;

    console.log('data ----------------------', data);
    const devices = await getDeviceInfo(req);
    console.log('devices ----------------------', devices);
    const token = await verify2FAService(data, devices);
    console.log('token ----------------------', token);

    res.status(201).json({ message: 'User Auth successfully', token: token });
  } catch (error) {
    console.log(error);
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
