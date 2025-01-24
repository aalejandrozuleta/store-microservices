import db from '@config/mysqlDb';
import { FieldPacket, RowDataPacket } from 'mysql2';

/**
 * Clase que proporciona métodos para interactuar con la base de datos de usuarios.
 * En particular, esta clase está enfocada en la obtención de un usuario por su correo electrónico.
 *
 * @class GetUserEmail
 */
export class GetUserEmail {
  /**
   * Obtiene el correo electrónico de un usuario de la base de datos.
   *
   * Este método consulta la base de datos para verificar si existe un usuario con el correo electrónico
   * proporcionado. Si el usuario existe, devuelve el correo electrónico; si no, devuelve un resultado vacío.
   *
   * @param {string} email - El correo electrónico del usuario a buscar.
   *
   * @throws {Error} Si ocurre un error durante la ejecución de la consulta SQL.
   */
  static async getUserEmail(email: string) {
    const sql = 'SELECT email FROM users WHERE email = ?';
    const values = [email];
    // Desestructuramos la respuesta para obtener solo las filas
    const [rows]: [RowDataPacket[], FieldPacket[]] = await db.query(
      sql,
      values
    );

    return rows;
  }
}
