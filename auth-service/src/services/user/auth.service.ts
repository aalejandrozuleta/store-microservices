import { AuthDto } from '@dto/user/auth.dto';
import { incrementFailedAttempts } from '@services/redis/incrementFailedAttempts';
import { isBlocked } from '@services/redis/isBlocked';
import { resetFailedAttempts } from '@services/redis/resetFailedAttempts';
import { saveTokenToRedis } from '@services/redis/saveTokenToRedis';
import { RedisInterface } from '@interfaces/redis.interface';
import { UserDevicesInterface } from '@interfaces/user.interface';
import { AuthRepository } from '@repositories/user/auth.repository';
import { comparePassword } from '@utils/shared/comparePassword';
import { generateTokens } from '@security/jwt/generateToken';
import { generateCode } from '@helpers/genereteCode';
import { sendEmails } from '@utils/shared/sendEmails';
import { revokeAllTokens } from '@services/redis/revokeTokens';
import { verify2FACode } from '@security/2FA/verify2FACode';

/**
 * Servicio de autenticación para validar credenciales y generar un token JWT.
 *
 * @param {AuthDto} user - Objeto con las credenciales del usuario (correo y contraseña).
 * @param {UserDevicesInterface} device - Información del dispositivo desde donde se inicia sesión.
 * @param {string} [twoFactorCode] - Código opcional de 2FA si el usuario tiene autenticación en dos pasos activada.
 * @returns {Promise<{ accessToken: string, refreshToken: string }>} Token de acceso y actualización si la autenticación es exitosa.
 * @throws Error si el usuario está bloqueado, las credenciales son incorrectas o el intento de acceso es sospechoso.
 */

export const authService = async (
  user: AuthDto,
  device: UserDevicesInterface
) => {
  try {
    // Verificar si el usuario está bloqueado por intentos fallidos
    if (await isBlocked(user.email)) {
      throw new Error('Demasiados intentos fallidos. Inténtelo más tarde.');
    }

    // Obtener credenciales y dispositivos en una sola consulta
    const credential = await AuthRepository.getUserWithDevices(user.email);
    if (!credential || !credential.user) {
      await incrementFailedAttempts(user.email);
      throw new Error('Credenciales inválidas');
    }

    const { user: userDataDb, devicesDb } = credential;

    // Validar la contraseña
    if (!(await comparePassword(user.password, userDataDb.password))) {
      await incrementFailedAttempts(user.email);
      throw new Error('Credenciales inválidas');
    }

    // Verificar si el usuario tiene 2FA activado
    const has2FA = await AuthRepository.has2FAEnabled(userDataDb.id);
    if (has2FA) {
      if (!user.twoFactorCode)
        throw new Error(
          'Se requiere código de autenticación de Google Authenticator'
        );

      const isValid2FA = await verify2FACode(userDataDb.id, user.twoFactorCode);
      if (!isValid2FA) throw new Error('Código de autenticación inválido');
    }

    // Si pasó la autenticación, resetear intentos fallidos
    await resetFailedAttempts(user.email);

    // Si el usuario ya tiene 3 dispositivos registrados, eliminar el más antiguo
    if (devicesDb.length >= 3) {
      await AuthRepository.deleteDevice(devicesDb[0].id);
    }

    // Crear objeto de usuario para Redis
    const userData: RedisInterface = {
      id: userDataDb.id,
      name: userDataDb.name,
      email: user.email,
      role: userDataDb.role,
      blockUser: 0,
    };

    // Verificar si el dispositivo ya está registrado
    const existingDevice = devicesDb.find(
      (d) =>
        d.device_name === device.device_name &&
        d.ip_address === device.ip_address
    );

    // Si el dispositivo es nuevo, requiere verificación
    if (!existingDevice) {
      const verificationCode = generateCode(6);
      await AuthRepository.addDevice({
        ...device,
        user_id: userData.id,
        autorizad: 'INHAUTORICE', // NO autorizado por defecto
      });

      await sendEmails({
        email: user.email,
        variables: {
          name: userDataDb.name,
          device: device.device_name,
          code: verificationCode,
        },
        subject: 'Verificación de Dispositivo Nuevo',
        template: 'newDispositivo.html',
      });
    }

    // Verificar si la ubicación es diferente a la última registrada
    const lastLocation = devicesDb.length
      ? devicesDb[devicesDb.length - 1].location
      : null;
    if (lastLocation && lastLocation !== device.location) {
      await revokeAllTokens(userDataDb.id);

      await sendEmails({
        email: user.email,
        variables: {
          name: userDataDb.name,
          country: device.location,
          code: generateCode(6),
        },
        subject: 'Verificación de Inicio de Sesión en Otro País',
        template: 'blockDevice.html',
      });

      throw new Error(
        'Intento de acceso desde una ubicación desconocida. Cuenta bloqueada.'
      );
    }

    // Generar y guardar el token en Redis
    const token = generateTokens(
      userData.id,
      userData.email,
      userData.name,
      userData.role
    );
    await saveTokenToRedis(userDataDb.id, user.email, token.accessToken);

    return token;
  } catch (error) {
    console.error('Error en authService:', error);
    throw error;
  }
};
