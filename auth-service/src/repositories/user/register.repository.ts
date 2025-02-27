import { RegisterDto } from '@dto/user/register.dto';
import db from '@config/mysqlDb';
import { UserDevicesInterface } from '@interfaces/user/user.interface';
import { ResultSetHeader } from 'mysql2';

/**
 * Clase que gestiona las operaciones de registro de usuarios en la base de datos.
 * Esta clase contiene métodos para insertar nuevos usuarios en la base de datos.
 *
 * @class RegisterRepository
 */
export class RegisterRepository {
  /**
   * Registra un nuevo usuario en la base de datos.
   *
   * Este método inserta un nuevo usuario en la tabla `users` con los datos proporcionados en el objeto `RegisterDto`.
   * Los datos del usuario incluyen el nombre, correo electrónico, fecha de nacimiento, contraseña y rol.
   *
   * @param {RegisterDto} user - Objeto que contiene los datos del usuario a registrar.
   *
   * @throws {Error} Si ocurre un error durante la ejecución de la consulta SQL.
   */
  static async register(user: RegisterDto) {
    const sql =
      'INSERT INTO users (name, email, birthdate, password, location) VALUES (?, ?, ?, ?, ?)';
    const values = [
      user.name,
      user.email,
      user.birthdate,
      user.password,
      user.location,
    ];
    const [result] = await db.query<ResultSetHeader>(sql, values);
    return result.insertId;
  }

  static async registerDevices(devices: UserDevicesInterface) {
    const sql =
      'INSERT INTO user_devices (user_id, device_name, ip_address, user_agent, location) VALUES (?, ?, ?, ?, ?)';
    const values = [
      devices.user_id,
      devices.device_name,
      devices.ip_address,
      devices.user_agent,
      devices.location,
    ];
    await db.query(sql, values);
  }
}
