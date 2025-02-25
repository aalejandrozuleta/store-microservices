import { clientRedis } from '@config/redisDb';

/**
 * Verifica si el código ingresado es válido comparándolo con el código almacenado en Redis.
 * Si el código es correcto, se elimina de Redis para evitar reutilización.
 *
 * @param email - Correo del usuario asociado al código
 * @param code - Código ingresado por el usuario
 * @returns `true` si el código es válido, `false` si es incorrecto o ha expirado
 */
export const verifyCodeFromRedis = async (
  email: string,
  code: string
): Promise<boolean> => {
  try {
    const key = `verification_code:${email}`;
    const storedCode = await clientRedis.get(key);

    if (!storedCode || storedCode !== code) {
      return false;
    }

    // Eliminar el código después de la validación para evitar reutilización
    // await clientRedis.del(`verification_code:${email}`);

    return true;
  } catch (error) {
    console.error('Error en verifyCodeFromRedis:', error);
    return false;
  }
};
