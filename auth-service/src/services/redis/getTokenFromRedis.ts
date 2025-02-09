import { clientRedis } from '@config/redisDb';

export const getTokenFromRedis = async (email: string) => {
  try {
    const token = await clientRedis.get(`token:${email}`);
    if (!token) {
      throw new Error('Token not found in Redis');
    }
    return token;
  } catch (error) {
    console.error('Error obteniendo el token desde Redis:', error);
    throw new Error(
      `Error al obtener token para ${email} desde Redis: ${error}`
    );
  }
};
