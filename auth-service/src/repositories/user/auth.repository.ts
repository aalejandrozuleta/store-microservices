import db from '@config/mysqlDb';
import { UserDevicesInterface } from '@interfaces/user.interface';
import { FieldPacket, RowDataPacket } from 'mysql2';

export class AuthRepository {
  /**
   * Obtiene la contraseña del usuario por correo electrónico.
   *
   * @param {string} email - El correo electrónico del usuario.
   * @returns {Promise<RowDataPacket[]>} Una promesa que resuelve con los datos del usuario encontrados.
   */
  static async getUserPassword(email: string) {
    const sql = 'SELECT id, name, password FROM users WHERE email = ?';
    const values = [email];
    const [rows]: [RowDataPacket[], FieldPacket[]] = await db.query(
      sql,
      values
    );
    return rows;
  }

  /**
   * Obtiene los dispositivos asociados a un usuario.
   *
   * @param {number} userId - El ID del usuario.
   * @returns {Promise<RowDataPacket[]>} Una promesa que resuelve con la lista de dispositivos del usuario.
   */
  static async getDevices(userId: number) {
    const sql =
      'SELECT id, user_id, device_name, ip_address, user_agent, location, login_time FROM user_devices WHERE user_id = ? ORDER BY login_time ASC';
    const values = [userId];
    const [rows]: [RowDataPacket[], FieldPacket[]] = await db.query(
      sql,
      values
    );
    return rows;
  }

  /**
   * Añade un dispositivo a la lista de dispositivos del usuario.
   *
   * @param {UserDevicesInterface} device - La información del dispositivo a añadir.
   * @returns {Promise<void>} Una promesa que se resuelve cuando se haya insertado el dispositivo.
   */
  static async addDevice(device: UserDevicesInterface) {
    const sql =
      'INSERT INTO user_devices (user_id, device_name, ip_address, user_agent, location) VALUES (?, ?, ?, ?, ?)';
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
   * Elimina un dispositivo dado su ID.
   *
   * @param {number} deviceId - El ID del dispositivo a eliminar.
   * @returns {Promise<void>} Una promesa que se resuelve cuando se haya eliminado el dispositivo.
   */
  static async deleteDevice(deviceId: number) {
    const sql = 'DELETE FROM user_devices WHERE id = ?';
    const values = [deviceId];
    await db.query(sql, values);
  }
}
