import dotenv from 'dotenv';
import { app } from '@config/serverOptions';
dotenv.config();

// Importa las rutas de la aplicación
import { routerAdministrator } from '@routes/administrator/administrator.routes';
import { routerUser } from '@routes/user/user.routes';
import swaggerRouter from '@config/swagger';
import { router2fa } from '@routes/2fa/2fa.routes';

//  Usar rutas
app.use('/auth/administrator', routerAdministrator);
app.use('/auth/user', routerUser);
app.use('/auth/2fa', router2fa);
app.use(swaggerRouter);

// app.use((err: any, req: any, res: Response) => {
//   res.status(500).send({ message: err.message });
// });
