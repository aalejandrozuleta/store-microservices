import { Router } from 'express';
export const routerAuthService = Router();

// usuario
import { userController } from '@controller/auth-services/user.controller-auth';
import {
  authorizeRoles,
  jwtAuthMiddleware,
} from '@middlewares/jwtValidation.middleware';
routerAuthService.use('/register', userController);
routerAuthService.use('/auth', userController);
routerAuthService.use('/refresh', userController);
routerAuthService.use('/logout', userController);
routerAuthService.use(
  '/2fa',
  jwtAuthMiddleware,
  authorizeRoles([
    'ADMIN',
    'MODERATOR',
    'STORE_OWNER',
    'DELIVERY_OWNER',
    'USER',
  ]),
  userController
);

// administrador

// general
