import { Response } from 'express';
import dotenv from 'dotenv';
import { app } from '@config/serverOptions';
dotenv.config();

// Rutas
import { routerAuthService } from '@routes/auth-service.routes';
import { routerSharedService } from '@routes/shared-service.routes';

// Middleware de rutas
app.use('/api/auth', routerAuthService);
app.use('/api/shared',routerSharedService);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
app.use((err: any, res: Response) => {
  res.status(500).send({ message: err.message });
});