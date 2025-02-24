import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import { AuthRepository } from '@repositories/user/auth.repository';

/**
 * Genera una clave secreta para la autenticación en dos pasos (2FA) y devuelve un código QR para configurarla.
 *
 * @param {number} userId - ID del usuario que activa la autenticación en dos pasos.
 * @param {string} email - Correo electrónico del usuario (usado en la etiqueta del código QR).
 * @returns {Promise<{ secret: string, qrCodeUrl: string }>} Un objeto con la clave secreta y la URL del código QR.
 * @throws {Error} Si no se puede generar la URL para el código QR.
 */

export const generate2FASecret = async (userId: number, email: string) => {
  // Generar clave secreta
  const secret = speakeasy.generateSecret({
    name: `Auth Service - ${email}`,
  });

  // Verificar que otpauth_url no sea undefined
  if (!secret.otpauth_url) {
    throw new Error('No se pudo generar la URL para el código QR');
  }

  // Guardar la clave secreta en la base de datos
  await AuthRepository.save2FASecret(userId, secret.base32);

  // Generar código QR
  const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url);

  return { secret: secret.base32, qrCodeUrl };
};
