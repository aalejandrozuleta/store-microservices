import { AuthDto } from '@dto/user/auth.dto';
import { incrementFailedAttempts } from '@services/redis/incrementFailedAttempts';
import { isBlocked } from '@services/redis/isBlocked';
import { resetFailedAttempts } from '@services/redis/resetFailedAttempts';
import { saveTokenToRedis } from '@services/redis/saveTokenToRedis';
import { UserDevicesInterface } from '@interfaces/user/user.interface';
import { AuthRepository } from '@repositories/user/auth.repository';
import { comparePassword } from '@utils/shared/comparePassword';
import { generateTokens } from '@security/jwt/generateToken';
import { generateCode } from '@helpers/genereteCode';
import { sendEmails } from '@utils/shared/sendEmails';
import { saveCodeToRedis } from '@services/redis/saveCodeToRedis';

const MAX_DEVICES = parseInt(process.env.MAX_DEVICES || '4', 10);

/**
 * Servicio de autenticación para validar credenciales, gestionar dispositivos y generar tokens JWT.
 *
 * @param user - Datos de autenticación del usuario.
 * @param device - Información del dispositivo desde el cual se intenta acceder.
 * @returns Un objeto con el token JWT o indicaciones de que se requiere verificación adicional.
 * @throws Error si las credenciales son inválidas o si el usuario está bloqueado.
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

    // Obtener credenciales y dispositivos registrados del usuario
    const credential = await AuthRepository.getUserWithDevices(user.email);
    if (!credential || !credential.user) {
      await incrementFailedAttempts(user.email);
      throw new Error('Credenciales inválidas');
    }

    const { user: userDataDb, devicesDb } = credential;

    // Verificar la contraseña
    if (!(await comparePassword(user.password, userDataDb.password))) {
      await incrementFailedAttempts(user.email);
      throw new Error('Credenciales inválidas');
    }

    // Resetear intentos fallidos tras una autenticación exitosa
    await resetFailedAttempts(user.email);

    // Verificar si el usuario tiene autenticación en dos pasos (2FA) habilitada
    const has2FA = await AuthRepository.has2FAEnabled(userDataDb.id);

    // Determinar si el dispositivo o la ubicación son nuevos
    const isNewDevice = !devicesDb.find(
      (d) => d.device_name === device.device_name
    );
    const lastLocation = devicesDb.length
      ? devicesDb[devicesDb.length - 1].location
      : null;
    const isNewLocation = lastLocation && lastLocation !== device.location;

    // Si el usuario tiene 2FA habilitado, requiere verificación
    if (has2FA) {
      return { requires2FA: true };
    }

    // Si es un nuevo dispositivo o ubicación, enviar código de verificación por correo
    if (isNewDevice || isNewLocation) {
      const verificationCode = generateCode(6);
      await saveCodeToRedis(user.email, verificationCode, 300); // Expira en 5 min

      await sendEmails({
        email: user.email,
        variables: {
          name: userDataDb.name,
          device: device.device_name,
          code: verificationCode,
        },
        subject: 'Verificación de Nuevo Inicio de Sesión',
        template: 'newDevice.html',
      });

      return { requiresVerification: true };
    }

    // Si el usuario ha alcanzado el límite de dispositivos, eliminar el más antiguo
    if (devicesDb.length >= MAX_DEVICES) {
      await AuthRepository.deleteDevice(devicesDb[0].id);
    }

    // Generar token JWT para el usuario autenticado
    const token = generateTokens(
      userDataDb.id,
      user.email,
      userDataDb.name,
      userDataDb.role
    );
    await saveTokenToRedis(userDataDb.id, user.email, token.accessToken);

    return token;
  } catch (error) {
    console.error('Error en authService:', error);
    throw error;
  }
};
