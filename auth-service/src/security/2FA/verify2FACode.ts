import { AuthRepository } from '@repositories/user/auth.repository';
import speakeasy from 'speakeasy';

/**
 * Verifica un código de autenticación en dos pasos (2FA) ingresado por el usuario.
 *
 * @param {number} userId - ID del usuario que intenta autenticarse.
 * @param {string} token - Código de autenticación de 6 dígitos generado por la app de 2FA.
 * @returns {Promise<boolean>} Devuelve `true` si el código es válido, de lo contrario lanza un error.
 * @throws {Error} Si la autenticación en dos pasos no está configurada o el código es inválido.
 */

export const verify2FACode = async (userId: number, token: string) => {
  const secret = await AuthRepository.get2FASecret(userId);
  if (!secret) {
    throw new Error('La autenticación en dos pasos no está configurada.');
  }

  const isValid = speakeasy.totp.verify({
    secret: secret,
    encoding: 'base32',
    token: token,
    window: 1, // Permite un código anterior o futuro (30s de tolerancia)
  });

  if (!isValid) {
    throw new Error('Código de autenticación inválido.');
  }

  return true;
};
