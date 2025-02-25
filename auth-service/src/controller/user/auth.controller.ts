import { logger } from '@config/logger';
import { AuthDto } from '@dto/user/auth.dto';
import { verifyRecaptcha } from '@security/recaptcha';
import { getFailedAttempts } from '@services/redis/getFailedAttempts';
import { UserInterface } from '@interfaces/user/user.interface';
import { authService } from '@services/user/auth.service';
import { getDeviceInfo } from '@utils/UAparse/getDeviceInfo';
import { Request, Response } from 'express';

/**
 * Controlador de autenticación para manejar el inicio de sesión de usuarios.
 *
 * Este controlador realiza las siguientes acciones:
 * - Verifica intentos fallidos de inicio de sesión.
 * - Valida un reCAPTCHA si se superan los intentos permitidos.
 * - Autentica al usuario con sus credenciales.
 * - Registra la información del dispositivo.
 * - Devuelve un token JWT si la autenticación es exitosa.
 *
 * @param {Request} req - Solicitud HTTP que contiene el correo electrónico, contraseña y, si es necesario, el token de reCAPTCHA.
 * @param {Response} res - Respuesta HTTP con el estado de autenticación y el token generado.
 */

export const authController = async (req: Request, res: Response) => {
  try {
    const user = req.body as Pick<
      UserInterface,
      'email' | 'password' | 'twoFactorCode'
    >;
    const devices = await getDeviceInfo(req);

    // Verificar intentos fallidos en Redis
    const failedAttempts = await getFailedAttempts(user.email);
    if (failedAttempts >= 2) {
      const { recaptchaToken } = req.body;
      const isRecaptchaValid = await verifyRecaptcha(recaptchaToken);
      if (!isRecaptchaValid) {
        res.status(403).json({ error: 'Recaptcha inválido' });
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
    res
      .status(500)
      .json({ error: errorMessage, message: 'Error al iniciar sesión' });
  }
};
