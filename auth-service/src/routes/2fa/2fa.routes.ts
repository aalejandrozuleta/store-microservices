import express, { Router } from 'express';
export const router2fa: Router = express.Router();

import { twoFactorRegisterController } from '@controller/2fa/register.controller';
router2fa.post('/register', twoFactorRegisterController);
