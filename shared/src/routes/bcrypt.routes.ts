import express, { Router } from 'express';
export const routerBcrypt: Router = express.Router();
import { hashPasswordController } from '@controller/bcrypt/hashPasswordController';
routerBcrypt.use('/hashPassword', hashPasswordController);