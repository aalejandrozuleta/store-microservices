import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

export const app = express();

// Cargar las variables de entorno desde el archivo .env
dotenv.config(); // Cargar configuraciones de entorno (por ejemplo, variables de la base de datos, puertos, etc.)

// Configuración de middleware CORS para permitir solicitudes desde orígenes específicos
const allowedOrigins = [
  process.env.CORS_FRONTEND as string,
  process.env.CORS_BACKEND as string,
];
app.use(
  cors({
    origin: allowedOrigins.filter(
      (origin): origin is string => typeof origin === 'string' // Asegura que las orígenes son cadenas de texto
    ),
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Métodos permitidos para las solicitudes CORS
    credentials: true, // Permitir el envío de cookies con las solicitudes
    allowedHeaders: ['Content-Type', 'Authorization'], // Headers permitidos
  })
);

// Agrega morgan como middleware para logging de peticiones HTTP
app.use(morgan('combined')); // 'combined' es un formato estándar de morgan para logs HTTP

// Habilitar el manejo de JSON en las solicitudes entrantes
app.use(express.json()); // Habilita el parseo de JSON en el cuerpo de las solicitudes

// Habilitar helmet para proteger la aplicación contra vulnerabilidades de seguridad
app.use(helmet()); // Helmet ayuda a proteger la app configurando cabeceras HTTP

// Deshabilitar el encabezado 'x-powered-by' para evitar revelar detalles innecesarios del servidor
app.disable('x-powered-by'); // Evita que el servidor revele información sobre la tecnología utilizada

// Configuración para manejar formularios URL-encoded en el cuerpo de las solicitudes
app.use(express.urlencoded({ extended: true })); // Permite que los formularios sean procesados correctamente

// Limitar la tasa de solicitudes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Limitar a 100 solicitudes por IP
});
app.use(limiter);

const PORT: string | number = process.env.PORT || ''; // Define el puerto del servidor (por defecto desde .env)

if (isNaN(Number(PORT))) {
  console.error('El valor de PORT no es un número válido.');
  process.exit(1);
}

try {
  app.listen(PORT, () => {
    console.info(
      `Servidor gateway en el puerto http://localhost:${PORT}` // Muestra en consola que el servidor está corriendo
    );
  });
} catch (error) {
  console.error(
    'No se pudo iniciar el servidor debido a un error:', // Mensaje de error si no se puede iniciar el servidor
    error
  );
}
