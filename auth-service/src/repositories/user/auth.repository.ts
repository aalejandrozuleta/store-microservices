import db from '@config/mysqlDb';
import { FieldPacket, RowDataPacket } from 'mysql2';

export class AuthRepository {
  /**
   * Obtiene el usuario y sus dispositivos en una sola consulta.
   *
   * @param {string} email - El correo electrónico del usuario.
   * @returns {Promise<{ user: RowDataPacket | null, devicesDb: RowDataPacket[] }>}
   * Una promesa que resuelve con el usuario y su lista de dispositivos.
   */
  static async getUserWithDevices(email: string) {
    const sql = `
      SELECT u.id, u.name, u.password, u.role, d.id as device_id, d.device_name, d.ip_address, 
             d.user_agent, d.location, d.login_time
      FROM users u
      LEFT JOIN user_devices d ON u.id = d.user_id
      WHERE u.email = ?
      ORDER BY d.login_time ASC
    `;
    const values = [email];
    const [rows]: [RowDataPacket[], FieldPacket[]] = await db.query(
      sql,
      values
    );

    if (rows.length === 0) return { user: null, devicesDb: [] };

    const user = {
      id: rows[0].id,
      name: rows[0].name,
      password: rows[0].password,
      role: rows[0].role,
    };

    const devicesDb = rows
      .filter((row) => row.device_id) // Filtrar usuarios sin dispositivos
      .map(
        ({
          device_id,
          device_name,
          ip_address,
          user_agent,
          location,
          login_time,
        }) => ({
          id: device_id,
          device_name,
          ip_address,
          user_agent,
          location,
          login_time,
        })
      );

    return { user, devicesDb };
  }

  /**
   * Elimina un dispositivo por su ID.
   *
   * @param {number} deviceId - ID del dispositivo a eliminar.
   * @returns {Promise<void>} Una promesa que se resuelve cuando se elimina el dispositivo.
   */
  static async deleteDevice(deviceId: number) {
    const sql = 'DELETE FROM user_devices WHERE id = ?';
    await db.query(sql, [deviceId]);
  }

  // Verificar si el usuario tiene 2FA habilitado
  static async has2FAEnabled(userId: number) {
    const sql = 'SELECT two_factor_secret FROM users WHERE id = ?';
    const [rows]: [RowDataPacket[], FieldPacket[]] = await db.query(sql, [
      userId,
    ]);
    return rows.length && rows[0].two_factor_secret ? true : false;
  }
}
