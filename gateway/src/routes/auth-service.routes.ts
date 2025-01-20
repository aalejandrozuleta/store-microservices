import { Router } from 'express';
export const routerAuthService = Router();

import { authController } from '@controller/auth-services/auth-service';
routerAuthService.use('/lender/register', authController);
