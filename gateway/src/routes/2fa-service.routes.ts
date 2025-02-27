import { Router } from 'express';
export const router2fa = Router();

import {
  authorizeRoles,
  jwtAuthMiddleware,
} from '@middlewares/jwtValidation.middleware';
import { twoFaController } from '@controller/2fa.controller';

router2fa.use(
  '/register',
  jwtAuthMiddleware,
  authorizeRoles([
    'ADMIN',
    'MODERATOR',
    'STORE_OWNER',
    'DELIVERY_OWNER',
    'USER',
  ]),
  twoFaController
);

router2fa.use(
  '/verify',
  // authorizeRoles([
  //   'ADMIN',
  //   'MODERATOR',
  //   'STORE_OWNER',
  //   'DELIVERY_OWNER',
  //   'USER',
  // ]),
  twoFaController
);
