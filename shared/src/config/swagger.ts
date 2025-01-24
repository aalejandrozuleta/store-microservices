import swaggerUi from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';
import dotenv from 'dotenv';
import { Router } from 'express';

// Cargar las variables de entorno desde el archivo .env
dotenv.config();

export const swaggerOptions: swaggerJsDoc.Options = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Microservicio de shared',
      version: '1.0.0',
      description:
        'Esta es la documentación de la API para gestionar usuarios.',
    },
    servers: [
      {
        // Usar process.env para obtener la URL del servidor
        url: process.env.API_URL || 'http://localhost:4001', // Valor predeterminado si no está definida
      },
    ],
  },
  apis: ['./src/routes/*.routes.ts'], // Ruta donde se encuentran los controladores o endpoints
};

// Generar la documentación Swagger
const swaggerDocs = swaggerJsDoc(swaggerOptions);

// Crear el router para Swagger
const swaggerRouter = Router();

// Configurar Swagger en la ruta /api-docs
swaggerRouter.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

export default swaggerRouter;
