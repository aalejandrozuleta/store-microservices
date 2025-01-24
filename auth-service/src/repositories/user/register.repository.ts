import { RegisterDto } from '@dto/user/register.dto';
import db from '@config/mysqlDb';

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
      'INSERT INTO users (name, email, birthdate, password, role_id) VALUES (?, ?, ?, ?, ?)';
    const values = [
      user.name,
      user.email,
      user.birthdate,
      user.password,
      user.role,
    ];
    return await db.query(sql, values);
  }
}
