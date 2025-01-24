import { mongoConnection } from './mongoDb';
import pool from './mysqlDb';
import { clientRedis } from './redisDb';

const checkDb = async () => {
  try {
    await mongoConnection;
    console.info('Conexión a la base de datos MongoDB exitosa.');
  } catch (error) {
    console.error('Error al conectar con MongoDB:', error);
  }

  try {
    await pool.getConnection();
    console.info('Conexión a la base de datos MySQL exitosa.');
  } catch (error) {
    console.error('Error al conectar con MySQL:', error);
  }

  try {
    await clientRedis.connect();
    console.info('Conexión a la base de datos Redis exitosa.');
  } catch (error) {
    console.error('Error al conectar con Redis:', error);
  }
};

export default checkDb;
