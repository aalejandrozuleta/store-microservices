import { clientRedis } from '@config/redisDb';

export const saveTokenToRedis = async (email: string, refreshToken: string) => {
  try {
    const result = await clientRedis.set(
      `refreshToken:${email}`,
      refreshToken,
      {
        EX: parseInt(process.env.REDIS_REFRESH_EXPIRATION || '604800'), // 7 días
      }
    );

    if (!result) {
      throw new Error('No se pudo guardar el refresh token en Redis');
    }
  } catch (error) {
    console.error('Error guardando el refresh token en Redis:', error);
    throw new Error(
      `Error al guardar el refresh token para ${email} en Redis: ${error}`
    );
  }
};
