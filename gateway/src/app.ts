import { Response } from 'express';
import dotenv from 'dotenv';
import { app } from '@config/serverOptions';
dotenv.config();

// Rutas
import { routerAuthService } from '@routes/auth-service/auth-service.routes';
import { routerSharedService } from '@routes/shared-service.routes';
import { router2fa } from '@routes/auth-service/2fa-service.routes';

// Middleware de rutas
app.use('/api/auth', routerAuthService);
app.use('/api/shared', routerSharedService);
app.use('/api/2fa', router2fa);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
app.use((err: any, res: Response) => {
  res.status(500).send({ message: err.message });
});
