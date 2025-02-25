import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import { TwoFactorRegisterRepository } from '@repositories/2fa/register.repository';
import { TwoFactorDto } from '@dto/2fa/register.dto';

/**
 * Genera una clave secreta para la autenticación en dos pasos (2FA) y devuelve un código QR para configurarla.
 *
 * @param {number} userId - ID del usuario que activa la autenticación en dos pasos.
 * @param {string} email - Correo electrónico del usuario (usado en la etiqueta del código QR).
 * @returns {Promise<{ secret: string, qrCodeUrl: string }>} Un objeto con la clave secreta y la URL del código QR.
 * @throws {Error} Si no se puede generar la URL para el código QR.
 */

export const generate2FASecret = async (user: TwoFactorDto) => {
  try {
    // Generar clave secreta para el usuario
    const secret = speakeasy.generateSecret({
      name: `Auth Service - ${user.email}`,
    });

    // Validar que la URL del OTP sea válida
    if (!secret.otpauth_url) {
      throw new Error('No se pudo generar la URL para el código QR');
    }

    // Guardar la clave secreta en la base de datos
    await TwoFactorRegisterRepository.save2FASecret(user.id, secret.base32);

    // Generar código QR en base64
    const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url);

    return { secret: secret.base32, qrCodeUrl };
  } catch (error) {
    console.error('Error en twoFactorService:', error);
    throw new Error('No se pudo generar el código de 2FA');
  }
};
