import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const TEMP_TOKEN_SECRET =
  process.env.TEMP_TOKEN_SECRET || 'temporary_secret_key';

/**
 * Genera un token temporal para la verificación 2FA.
 *
 * @param {string} userId - ID del usuario.
 * @returns {string} Token temporal válido por 5 minutos.
 */
export const generateTempToken = (userId: string): string => {
  return jwt.sign({ userId }, TEMP_TOKEN_SECRET, { expiresIn: '5m' });
};

/**
 * Verifica y decodifica un token temporal.
 *
 * @param {string} token - Token temporal a verificar.
 * @returns {string | null} Retorna el ID del usuario si es válido, de lo contrario null.
 */
export const verifyTempToken = (token: string): string | null => {
  try {
    const decoded = jwt.verify(token, TEMP_TOKEN_SECRET) as { userId: string };
    return decoded.userId;
  } catch (error) {
    console.error('Token temporal inválido o expirado:', error);
    return null;
  }
};
