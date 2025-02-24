import db from '@config/mysqlDb';
import { UserDevicesInterface } from '@interfaces/user.interface';
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
   * Añade un nuevo dispositivo a la lista de dispositivos del usuario.
   *
   * @param {UserDevicesInterface} device - La información del dispositivo.
   * @returns {Promise<void>} Una promesa que se resuelve cuando se inserta el dispositivo.
   */
  static async addDevice(device: UserDevicesInterface) {
    const sql = `
      INSERT INTO user_devices (user_id, device_name, ip_address, user_agent, location) 
      VALUES (?, ?, ?, ?, ?)
    `;
    const values = [
      device.user_id,
      device.device_name,
      device.ip_address,
      device.user_agent,
      device.location,
    ];
    await db.query(sql, values);
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

  /**
   * Obtiene la clave secreta de 2FA de un usuario.
   *
   * @param {number} userId - ID del usuario.
   * @returns {Promise<string | null>} La clave secreta o null si no está registrada.
   */
  static async get2FASecret(userId: number) {
    const sql = 'SELECT two_factor_secret FROM users WHERE id = ?';
    const [rows]: [RowDataPacket[], FieldPacket[]] = await db.query(sql, [
      userId,
    ]);
    return rows.length ? rows[0].two_fa_secret : null;
  }

  // Verificar si el usuario tiene 2FA habilitado
  static async has2FAEnabled(userId: number) {
    const sql = 'SELECT two_factor_secret FROM users WHERE id = ?';
    const [rows]: [RowDataPacket[], FieldPacket[]] = await db.query(sql, [
      userId,
    ]);
    return rows.length && rows[0].two_fa_secret ? true : false;
  }
}
