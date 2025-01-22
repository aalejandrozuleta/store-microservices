import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const swaggerOptions: swaggerJsDoc.Options = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Microservicio de Usuarios',
      version: '1.0.0',
      description: 'Esta es la documentación de la API para gestionar usuarios.',
    },
    servers: [
      {
        url: 'http://localhost:4001',
      },
    ],
  },
  apis: ['./src/routes/*.ts'], // Ruta donde se encuentran los controladores o endpoints
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

export default (app: Express) => {
  // Ruta para servir la documentación de Swagger
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
};
