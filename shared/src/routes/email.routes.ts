import express, { Router } from 'express';
export const routerEmail: Router = express.Router();

import { emailController } from '@controller/emails/email.controller';
routerEmail.use('/sendEmail', emailController);