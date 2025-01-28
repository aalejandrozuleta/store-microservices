import { clientRedis } from '@config/redisDb';

export const getTokenFromRedis = async (email: string) => {
  try {
    const token = await clientRedis.get(`token:${email}`);
    return token;
  } catch (error) {
    console.error('Error:', error);
    throw error; // Re-lanzar el error para el controlador
  }
};
