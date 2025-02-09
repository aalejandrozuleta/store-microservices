import { clientRedis } from '@config/redisDb';

export const getRefreshTokenFromRedis = async (email: string) => {
  try {
    return await clientRedis.get(`refreshToken:${email}`);
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};
