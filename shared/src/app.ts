import { Response } from 'express';
import dotenv from 'dotenv';
import { app } from '@config/serverOptions';
dotenv.config();

// Importa las rutas de la aplicación
import { routerBcrypt } from '@routes/bcrypt.routes';
import { routerEmail } from '@routes/email.routes';
import swaggerRouter from '@config/swagger';

//  Usar rutas
app.use('/shared', routerBcrypt);
app.use("/shared", routerEmail);
app.use(swaggerRouter); 

// eslint-disable-next-line @typescript-eslint/no-explicit-any
app.use((err: any, res: Response) => {
  res.status(500).send({ message: err.message });
});