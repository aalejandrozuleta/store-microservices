import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';


dotenv.config();

const app = express();
app.use(express.json());

// Configuración de middleware
const allowedOrigins = [process.env.CORS_FRONTEND, process.env.CORS_BACKEND];
app.use(
  cors({
    origin: allowedOrigins.filter(
      (origin): origin is string => typeof origin === 'string',
    ),
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);
app.use(morgan('combined'));

// Limitar la tasa de solicitudes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Limitar a 100 solicitudes por IP
});
app.use(limiter);

// Rutas
import { routerAuthService } from '@routes/auth-service.routes';

// Middleware de rutas
app.use('/api/auth', routerAuthService);


// Puerto de escucha
const PORT = process.env.PORT || "";
app.listen(PORT, () => {
  console.info(`Gateway escuchando en el puerto ${PORT}`);
});