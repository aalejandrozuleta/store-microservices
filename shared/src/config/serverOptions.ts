import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import checkDb from './healtDb'; // Importa la función que verifica la conexión con la base de datos
import { morganMiddleware } from './logger'; // Importa el logger personalizado

export const app = express();

// Cargar las variables de entorno desde el archivo .env
dotenv.config(); // Cargar configuraciones de entorno (por ejemplo, variables de la base de datos, puertos, etc.)

// Configuración de middleware CORS para permitir solicitudes desde orígenes específicos
const allowedOrigins = [
  process.env.CORS_BACKEND as string,
];
app.use(
  cors({
    origin: allowedOrigins.filter(
      (origin): origin is string => typeof origin === 'string', // Asegura que las orígenes son cadenas de texto
    ),
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Métodos permitidos para las solicitudes CORS
    credentials: true, // Permitir el envío de cookies con las solicitudes
    allowedHeaders: ['Content-Type', 'Authorization'], // Headers permitidos
  }),
);

// Agrega morgan como middleware para logging de peticiones HTTP
app.use(morgan('combined')); // 'combined' es un formato estándar de morgan para logs HTTP

// Agrega un middleware personalizado para logging adicional
app.use(morganMiddleware); // Este es tu propio middleware que maneja los logs

// Habilitar el manejo de JSON en las solicitudes entrantes
app.use(express.json()); // Habilita el parseo de JSON en el cuerpo de las solicitudes

// Habilitar helmet para proteger la aplicación contra vulnerabilidades de seguridad
app.use(helmet()); // Helmet ayuda a proteger la app configurando cabeceras HTTP

// Deshabilitar el encabezado 'x-powered-by' para evitar revelar detalles innecesarios del servidor
app.disable('x-powered-by'); // Evita que el servidor revele información sobre la tecnología utilizada

// Configuración para manejar formularios URL-encoded en el cuerpo de las solicitudes
app.use(express.urlencoded({ extended: true })); // Permite que los formularios sean procesados correctamente

// Verificación de la base de datos antes de iniciar el servidor
checkDb().then(() => {
  const PORT: string | number = process.env.PORT || ""; // Define el puerto del servidor (por defecto desde .env)
  app.listen(PORT, () => {
    console.info(
      `Servidor shared corriendo en el puerto http://localhost:${PORT}`, // Muestra en consola que el servidor está corriendo
    );
  });
})
.catch((error: string) => {
  console.error(
    'No se pudo iniciar el servidor debido a un error en la base de datos:', // Mensaje de error si no se puede conectar a la base de datos
    error,
  );
});
