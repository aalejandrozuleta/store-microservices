import { clientRedis } from '@config/redisDb';

// Verificar si el usuario está bloqueado
export const isBlocked = async (email: string): Promise<boolean> => {
  const blocked = await clientRedis.get(`blocked_user:${email}`);
  return blocked === 'true';
};
