import db from '@config/mysqlDb';
import { UserDevicesInterface } from '@interfaces/user/user.interface';
import { FieldPacket, RowDataPacket } from 'mysql2';
export class GeneralUserRepository {
  /**
   * Obtiene los datos de un usuario por su correo electrónico.
   *
   * @param {string} email - Correo electrónico del usuario.
   * @returns {Promise<UserInterface | null>} El objeto de usuario o null si no se encuentra.
   */
  static async getUserByEmail(email: string) {
    const sql = 'select * from users where email = ?';
    const [rows]: [RowDataPacket[], FieldPacket[]] = await db.query(sql, [
      email,
    ]);
    return rows;
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
}
