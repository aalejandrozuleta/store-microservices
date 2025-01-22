import { clientRedis } from "./redisDb";

const checkDb = async () => {
  try {
    await clientRedis.connect();
    console.info('Conexión a la base de datos Redis exitosa.');
  } catch (error) {
    console.error('Error al conectar con Redis:', error);
  }
};

export default checkDb;