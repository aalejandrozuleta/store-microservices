import { clientRedis } from '@config/redisDb';

// Obtener el número de intentos fallidos desde Redis
export const getFailedAttempts = async (email: string): Promise<number> => {
  const attempts = await clientRedis.get(`failed_attempts:${email}`);
  return attempts ? parseInt(attempts, 10) : 0;
};
