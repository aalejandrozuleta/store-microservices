import db from '@config/mysqlDb';

export class TwoFactorRepository {
  /**
   * Guarda la clave secreta de 2FA para un usuario.
   *
   * @param {number} userId - ID del usuario.
   * @param {string} secret - Clave secreta de 2FA.
   * @returns {Promise<void>}
   */

  static async save2FASecret(userId: number, secret: string) {
    const sql = 'UPDATE users SET two_factor_secret = ? WHERE id = ?';
    await db.query(sql, [secret, userId]);
  }
}
