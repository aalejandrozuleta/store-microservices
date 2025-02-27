import { Router } from 'express';
export const routerSharedService = Router();

import { sharedController } from '@controller/shared.controller';

routerSharedService.post('/hashPassword', sharedController);
routerSharedService.post('/comparePassword', sharedController);
routerSharedService.post('/sendEmail', sharedController);
