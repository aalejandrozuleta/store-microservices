import { clientRedis } from '@config/redisDb';

export const saveTokenToRedis = async (
  userId: number,
  deviceId: string,
  refreshToken: string
) => {
  try {
    const key = `accessToken:${deviceId}`;
    const expiration = parseInt(
      process.env.REDIS_REFRESH_EXPIRATION || '604800'
    ); // 7 días

    const result = await clientRedis.set(key, refreshToken, { EX: expiration });

    if (!result) {
      throw new Error('No se pudo guardar el refresh token en Redis');
    }
  } catch (error) {
    console.error('Error guardando el refresh token en Redis:', error);
    throw new Error(
      `Error al guardar el refresh token para el usuario ${userId}: ${error}`
    );
  }
};
