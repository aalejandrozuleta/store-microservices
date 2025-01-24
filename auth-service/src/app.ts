import { Response } from 'express';
import dotenv from 'dotenv';
import { app } from '@config/serverOptions';
dotenv.config();

// Importa las rutas de la aplicación
import { routerAdministrator } from '@routes/administrator/administrator.routes';
import { routerUser } from '@routes/user/user.routes';
import swaggerRouter from '@config/swagger';

//  Usar rutas
app.use('/auth/administrator', routerAdministrator);
app.use('/auth/user', routerUser);
app.use(swaggerRouter);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
app.use((err: any, req: any, res: Response) => {
  res.status(500).send({ message: err.message });
});
