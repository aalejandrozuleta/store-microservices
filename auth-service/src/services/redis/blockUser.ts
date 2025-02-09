import { clientRedis } from '@config/redisDb';
import { BLOCK_TIME } from './variables';

// Bloquear al usuario por el tiempo definido
export const blockUser = async (email: string): Promise<void> => {
  await clientRedis.set(`blocked_user:${email}`, 'true', {
    EX: BLOCK_TIME,
  });
};
