import { clientRedis } from '@config/redisDb';
import { blockUser } from './blockUser';
import { getFailedAttempts } from './getFailedAttempts';
import { BLOCK_TIME, MAX_ATTEMPTS } from './variables';

/**
 * Incrementa el contador de intentos fallidos de inicio de sesión para un usuario.
 *
 * - Si el usuario ya está bloqueado, extiende el tiempo de bloqueo en Redis.
 * - Si el número de intentos fallidos alcanza el límite (`MAX_ATTEMPTS`), se bloquea al usuario.
 * - Si aún no ha alcanzado el límite, se incrementa el contador y se actualiza su expiración.
 *
 * @param email - Correo electrónico del usuario.
 * @returns Una promesa que se resuelve cuando la operación finaliza.
 */
export const incrementFailedAttempts = async (email: string): Promise<void> => {
  const attempts = await getFailedAttempts(email);
  const blockKey = `blocked_user:${email}`;

  // Verifica si el usuario ya está bloqueado en Redis
  const isBlocked = await clientRedis.get(blockKey);

  if (isBlocked) {
    // Si el usuario ya está bloqueado, extiende el tiempo de bloqueo
    await clientRedis.expire(blockKey, BLOCK_TIME);
  } else if (attempts + 1 >= MAX_ATTEMPTS) {
    // Bloquea al usuario si supera el número máximo de intentos
    await blockUser(email);
  } else {
    // Incrementa los intentos fallidos y actualiza su expiración
    await clientRedis.set(`failed_attempts:${email}`, attempts + 1, {
      EX: BLOCK_TIME,
    });
  }
};
