import { clientRedis } from '@config/redisDb';

/**
 * Guarda un token temporal en Redis asociado a un usuario.
 * @param token - Token generado.
 * @param email - Email del usuario.
 * @param ttl - Tiempo de vida en segundos.
 */
export const saveTemporaryTokenToRedis = async (
  token: string,
  email: string,
  ttl: number
) => {
  await clientRedis.set(`tempAuthToken:${token}`, email, { EX: ttl });
};
