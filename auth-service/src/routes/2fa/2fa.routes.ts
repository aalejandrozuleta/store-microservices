import express, { Router } from 'express';
export const router2fa: Router = express.Router();

import { twoFactorRegisterController } from '@controller/2fa/register.controller';
router2fa.post('/register', twoFactorRegisterController);

import { verify2FAController } from '@controller/2fa/verify.controller';
import { validateTwoFactorCode } from '@middleware/2fa/verify.middleware';
router2fa.post('/verify', validateTwoFactorCode, verify2FAController);
