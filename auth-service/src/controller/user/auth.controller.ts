import { logger } from '@config/logger';
import { AuthDto } from '@dto/user/auth.dto';
import { verifyRecaptcha } from '@security/recaptcha';
import { getFailedAttempts } from '@services/redis/getFailedAttempts';
import { UserInterface } from '@interfaces/user.interface';
import { authService } from '@services/user/auth.service';
import { getDeviceInfo } from '@utils/UAparse/getDeviceInfo';
import { Request, Response } from 'express';

export const authController = async (req: Request, res: Response) => {
  try {
    const user = req.body as Pick<UserInterface, 'email' | 'password'>;
    const devices = await getDeviceInfo(req);

    // Verificar intentos fallidos en Redis
    const failedAttempts = await getFailedAttempts(user.email);
    if (failedAttempts >= 3) {
      const { recaptchaToken } = req.body;
      const isRecaptchaValid = await verifyRecaptcha(recaptchaToken);
      if (!isRecaptchaValid) {
        return res.status(403).json({ error: 'Recaptcha inválido' });
      }
    }

    const authUser = new AuthDto(user.email, user.password);
    const token = await authService(authUser, devices);
    // Registro exitoso, se loggea el evento con los detalles del nuevo usuario
    logger.info('User Auth created successfully', {
      email: user.email,
    });

    res
      .status(201)
      .json({ message: 'User Auth created successfully', token: token });
  } catch (error) {
    // Manejo de errores
    const errorMessage =
      error instanceof Error ? error.message : 'Ocurrió un error desconocido';

    // Se loggea el error para análisis posterior, incluyendo los detalles del usuario y el mensaje de error
    logger.error('Error al iniciar sesión', {
      email: req.body?.email || 'Email no proporcionado',
      error: errorMessage,
    });

    // Se devuelve una respuesta de error con el código de estado 500 y el mensaje de error
    res.status(500).json({ error: errorMessage });
  }
};
