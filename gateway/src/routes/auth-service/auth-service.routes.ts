import { Router } from 'express';
export const routerAuthService = Router();

// usuario
import { userController } from '@controller/auth-services/user.controller-auth';

routerAuthService.use('/register', userController);
routerAuthService.use('/auth', userController);
routerAuthService.use('/refresh', userController);
routerAuthService.use('/logout', userController);
routerAuthService.use('/verifyLogin', userController);

// administrador

// general
