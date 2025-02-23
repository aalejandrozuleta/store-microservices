import { logger } from '@config/logger';
import { AuthDto } from '@dto/user/auth.dto';
import { verifyRecaptcha } from '@security/recaptcha';
import { getFailedAttempts } from '@services/redis/getFailedAttempts';
import { UserInterface } from '@interfaces/user.interface';
import { authService } from '@services/user/auth.service';
import { getDeviceInfo } from '@utils/UAparse/getDeviceInfo';
import { Request, Response } from 'express';

/**
 * Controlador de autenticación de usuarios.
 * Este controlador maneja la lógica para autenticar a un usuario basándose
 * en su correo electrónico y contraseña, además de verificar intentos fallidos
 * y validar el reCAPTCHA si es necesario.
 *
 * @param req - Objeto de solicitud que contiene el cuerpo de la petición
 *   - email: El correo electrónico del usuario
 *   - password: La contraseña del usuario
 *   - recaptchaToken: (Opcional) Token de reCAPTCHA para validación
 *
 * @param res - Objeto de respuesta para enviar el resultado al cliente
 *
 * @returns Envía una respuesta HTTP al cliente basada en el resultado del proceso de autenticación.
 *
 * 1. Extrae las credenciales de usuario (email y password) del cuerpo de la solicitud.
 * 2. Obtiene información del dispositivo del que proviene la solicitud.
 * 3. Verifica el número de intentos fallidos de autenticación para el email proporcionado en Redis.
 * 4. Si el número de intentos fallidos es mayor o igual a 3, verifica la validez del token de reCAPTCHA.
 * 5. Si el token de reCAPTCHA es inválido, responde con un error 403 (Prohibido).
 * 6. Si el reCAPTCHA es válido o los intentos fallidos son menores a 3, crea un `AuthDto` para el usuario.
 * 7. Llama al servicio de autenticación para generar un token de autenticación utilizando `authService`.
 * 8. Registra un mensaje de éxito en el logger, incluyendo el email del usuario.
 * 9. Responde con un código de estado 201 y el token de autenticación.
 * 10. Captura y maneja los errores de todo el proceso:
 *    - Registra el error en el logger, incluyendo el email del usuario y el mensaje de error.
 *    - Responde con un código de estado 500 y el mensaje de error.
 */
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
