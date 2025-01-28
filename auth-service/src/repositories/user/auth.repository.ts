import db from '@config/mysqlDb';
import { FieldPacket, RowDataPacket } from 'mysql2';
export class AuthRepository {
  static async getUserPassword(email: string) {
    const sql = 'SELECT id, name, password FROM users WHERE email = ?';
    const values = [email];
    const [rows]: [RowDataPacket[], FieldPacket[]] = await db.query(
      sql,
      values
    );
    return rows;
  }
}
