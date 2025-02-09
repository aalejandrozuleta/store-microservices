import { clientRedis } from '@config/redisDb';
import { blockUser } from './blockUser';
import { getFailedAttempts } from './getFailedAttempts';
import { BLOCK_TIME, MAX_ATTEMPTS } from './variables';

// Incrementar el contador de intentos fallidos
export const incrementFailedAttempts = async (email: string): Promise<void> => {
  const attempts = await getFailedAttempts(email);

  if (attempts + 1 >= MAX_ATTEMPTS) {
    // Bloquear el usuario si se superan los intentos máximos
    await blockUser(email);
  } else {
    await clientRedis.set(`failed_attempts:${email}`, attempts + 1, {
      EX: BLOCK_TIME, // Actualizar el tiempo de expiración con cada intento fallido
    });
  }
};
