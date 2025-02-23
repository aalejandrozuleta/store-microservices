import { clientRedis } from '@config/redisDb';

/**
 * Revoca el token de actualización (refresh token) de un usuario en un dispositivo específico.
 * @param userId - ID del usuario.
 * @param email - Email del usuario.
 */
export const revokeRefreshToken = async (
  userId: number,
  email: string
): Promise<void> => {
  await clientRedis.del(`refreshToken:${userId}:${email}`);
};

/**
 * Revoca todos los tokens de actualización (refresh tokens) de un usuario.
 * @param userId - ID del usuario.
 */
export const revokeAllTokens = async (userId: number): Promise<void> => {
  const keys = await clientRedis.keys(`refreshToken:${userId}:*`);

  if (keys.length > 0) {
    await Promise.all(keys.map((key) => clientRedis.del(key))); // Eliminación en paralelo
  }
};

/**
 * Revoca un token de actualización antiguo, agregándolo a la lista negra.
 * @param oldRefreshToken - Token de actualización que será revocado.
 */
export const revokeOldToken = async (
  oldRefreshToken: string
): Promise<void> => {
  const tokenKey = `revokedToken:${oldRefreshToken}`;

  // Verifica si ya ha sido revocado
  const exists = await clientRedis.get(tokenKey);
  if (!exists) {
    await clientRedis.set(tokenKey, 'revoked', { EX: 86400 }); // Expira en 24 horas
  }
};
