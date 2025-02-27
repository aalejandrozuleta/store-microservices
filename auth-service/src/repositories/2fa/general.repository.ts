import db from '@config/mysqlDb';
import { FieldPacket, RowDataPacket } from 'mysql2';

export class General2FARepository {
  static async get2FASecret(userId: number) {
    const sql = 'SELECT two_factor_secret FROM users WHERE id = ?';
    const [rows]: [RowDataPacket[], FieldPacket[]] = await db.query(sql, [
      userId,
    ]);
    return rows.length && rows[0].two_factor_secret
      ? rows[0].two_factor_secret
      : null;
  }
}
