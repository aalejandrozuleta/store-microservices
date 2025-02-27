import { clientRedis } from '@config/redisDb';

/**
 * Obtiene el email asociado a un token temporal y lo elimina.
 * @param token - Token generado.
 * @returns Email del usuario o null si no existe.
 */
export const getTempTokenFromTempToken = async (token: string) => {
  const email = await clientRedis.get(`tempAuthToken:${token}`);
  return email;
};
