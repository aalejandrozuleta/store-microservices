import { clientRedis } from '@config/redisDb';

// Restablecer el contador de intentos fallidos y desbloquear al usuario
export const resetFailedAttempts = async (email: string): Promise<void> => {
  await clientRedis.del(`failed_attempts:${email}`);
  await clientRedis.del(`blocked_user:${email}`);
};
