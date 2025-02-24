import { clientRedis } from '@config/redis';

export const getTokenFromRedis = async (email: string) => {
  try {
    return await clientRedis.get(`accessToken:${email}`);
  } catch (error) {
    console.error('Error al obtener token de Redis:', error);
    throw new Error('Failed to retrieve token from Redis');
  }
};
