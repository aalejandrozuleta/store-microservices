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
import { EmailsInterface } from '@interfaces/emails.interface';
import { generateCode } from '@helpers/genereteCode';
import { sendEmails } from '@utils/shared/sendEmails';

/**
 * Servicio de autenticación para validar las credenciales del usuario y generar un token JWT.
 *
 * Este servicio verifica si el usuario está bloqueado por intentos fallidos, valida las credenciales, maneja los dispositivos registrados
 * y la ubicación geográfica, y genera un token de acceso válido. Además, realiza acciones para evitar accesos no autorizados desde
 * dispositivos o ubicaciones no reconocidas.
 *
 * @param user - Objeto de datos del usuario que incluye el correo electrónico y la contraseña.
 * @param device - Objeto con los detalles del dispositivo desde el que el usuario está intentando iniciar sesión, como el nombre del dispositivo y la dirección IP.
 * @returns Un objeto con el token de acceso y el token de actualización generado.
 * @throws Error si el usuario está bloqueado por intentos fallidos, si el usuario no existe, si la contraseña es incorrecta,
 * o si el intento de acceso proviene de una ubicación no reconocida.
 */
export const authService = async (
  user: AuthDto,
  device: UserDevicesInterface
) => {
  try {
    // Verificar si el usuario está bloqueado debido a intentos fallidos
    if (await isBlocked(user.email)) {
      throw new Error(
        'Demasiados intentos fallidos. Por favor, inténtelo de nuevo más tarde.'
      );
    }

    // Obtener las credenciales del usuario desde el repositorio
    const credential = await AuthRepository.getUserPassword(user.email);
    if (!credential || !credential[0]) {
      // Incrementar los intentos fallidos en Redis si el usuario no existe
      await incrementFailedAttempts(user.email);
      throw new Error('Usuario no encontrado');
    }
    const acesCredential = credential[0];

    // Crear un objeto con los datos relevantes del usuario para Redis
    const userData: RedisInterface = {
      id: acesCredential.id,
      name: acesCredential.name,
      email: user.email,
      blockUser: (await isBlocked(user.email)) ? 1 : 0,
    };

    // Validar la contraseña ingresada con la almacenada
    const isValid = await comparePassword(
      user.password,
      acesCredential.password
    );
    if (!isValid) {
      // Incrementar los intentos fallidos en Redis si la contraseña es incorrecta
      await incrementFailedAttempts(user.email);
      throw new Error('Contraseña incorrecta');
    }

    // Reiniciar los intentos fallidos tras una autenticación exitosa
    await resetFailedAttempts(user.email);

    const devicesDb = await AuthRepository.getDevices(acesCredential.id);

    if (devicesDb.length >= 3) {
      // Si ya tiene 3 dispositivos registrados, eliminar el más antiguo
      await AuthRepository.deleteDevice(devicesDb[0].id);
    }

    // Verificar si el dispositivo ya existe en la base de datos
    const existingDevice = devicesDb.find(
      (d) =>
        d.device_name === device.device_name &&
        d.ip_address === device.ip_address
    );

    if (!existingDevice) {
      const data: EmailsInterface = {
        email: user.email,
        variables: {
          name: acesCredential.name,
          device: device.device_name,
          code: generateCode(6),
        },
        subject: 'Verificación de Dispositivo Nuevo',
        template: 'newDispositivo.html',
      };
      // Nuevo dispositivo detectado, requerir verificación manual (correo o código de verificación)
      await AuthRepository.addDevice({
        ...device,
        user_id: userData.id,
        autorizad: 'INHAUTORICE', // NO autorizado por defecto
      });

      await sendEmails(data);
    }

    const lastLocation =
      devicesDb.length > 0 ? devicesDb[devicesDb.length - 1].location : null;
    // Verificar si el usuario intenta acceder desde un país diferente
    if (lastLocation && lastLocation !== device.location) {
      const data: EmailsInterface = {
        email: user.email,
        variables: {
          name: acesCredential.name,
          country: device.location,
          code: generateCode(6),
        },
        subject: 'Verificación de Inicio de Sesión en Otro País',
        template: 'blockDevice.html',
      };

      await sendEmails(data);

      throw new Error(
        'Intento de acceso desde una ubicación desconocida. Cuenta bloqueada.'
      );
    }

    // Generar un nuevo token JWT
    const token = generateTokens(userData.id, userData.email, userData.name);

    // Guardar el token en Redis
    await saveTokenToRedis(user.email, token.accessToken);

    // Retornar el token generado
    return token;
  } catch (error) {
    console.error('Error al generar el token:', error);
    throw error;
  }
};
