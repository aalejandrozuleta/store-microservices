import { AuthDto } from '@dto/user/auth.dto';
import { generateToken } from '@helpers/jwt/generateToken';
import { getTokenFromRedis } from '@helpers/redis/getTokenFromRedis';
import { incrementFailedAttempts } from '@helpers/redis/incrementFailedAttempts';
import { isBlocked } from '@helpers/redis/isBlocked';
import { resetFailedAttempts } from '@helpers/redis/resetFailedAttempts';
import { saveTokenToRedis } from '@helpers/redis/saveTokenToRedis';
import { RedisInterface } from '@interfaces/redis.interface';
import { AuthRepository } from '@repositories/user/auth.repository';
import { comparePassword } from '@utils/shared/comparePassword';

/**
 * Servicio de autenticación para validar credenciales del usuario y generar un token JWT.
 * @param user - Objeto de datos del usuario que incluye email y contraseña.
 * @returns Un token de autenticación generado.
 * @throws Error si el usuario está bloqueado, no existe o la contraseña es incorrecta.
 */
export const authService = async (user: AuthDto): Promise<string> => {
  // Verificar si el usuario está bloqueado debido a múltiples intentos fallidos
  if (await isBlocked(user.email)) {
    throw new Error(
      'Demasiados intentos fallidos. Por favor, inténtelo de nuevo más tarde.'
    );
  }

  // Obtener las credenciales del usuario desde el repositorio
  const credential = await AuthRepository.getUserPassword(user.email);

  if (!credential) {
    // Incrementar los intentos fallidos en Redis si el usuario no existe
    await incrementFailedAttempts(user.email);
    throw new Error('Usuario no encontrado');
  }

  // Crear un objeto con los datos relevantes del usuario para Redis
  const userData: RedisInterface = {
    id: credential.id,
    name: credential.name,
    email: user.email,
    blockUser: (await isBlocked(user.email)) ? 1 : 0,
  };

  // Validar la contraseña ingresada con la almacenada
  const isValid = await comparePassword(user.password, credential.password);

  if (!isValid) {
    // Incrementar los intentos fallidos en Redis si la contraseña es incorrecta
    await incrementFailedAttempts(user.email);
    throw new Error('Contraseña incorrecta');
  }

  // Reiniciar los intentos fallidos tras una autenticación exitosa
  await resetFailedAttempts(user.email);

  // Obtener un token existente desde Redis
  const existingToken = await getTokenFromRedis(user.email);

  // Generar un nuevo token JWT
  const token = generateToken(
    userData.id,
    userData.email,
    userData.name,
    userData.blockUser,
    new Date(),
    existingToken || undefined // Usar token existente si está disponible
  );

  // Guardar el token en Redis
  await saveTokenToRedis(user.email, token);

  // Retornar el token generado
  return token;
};
