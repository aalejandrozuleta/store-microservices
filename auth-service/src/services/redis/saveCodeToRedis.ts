import { clientRedis } from '@config/redisDb';

/**
 * Guarda un código temporal en Redis con una expiración definida.
 *
 * @param userId - ID del usuario.
 * @param code - Código generado para la autenticación.
 * @param expiresIn - Tiempo de expiración en segundos (por defecto 5 minutos).
 */

export const saveCodeToRedis = async (
  email: string,
  code: string,
  expiresIn: number = 300
): Promise<void> => {
  try {
    const key = `verification_code:${email}`;

    // Guardar el código en Redis con una expiración predeterminada de 5 minutos (300 segundos)
    await clientRedis.set(key, code, { EX: expiresIn });
  } catch (error) {
    console.error('Error al guardar el código en Redis:', error);
    throw error;
  }
};
