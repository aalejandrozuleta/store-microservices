import { Router } from 'express';
export const routerAuthService = Router();

// usuario
import { userController } from '@controller/auth-services/user.controller-auth';
routerAuthService.use('/register', userController);

// administrador
