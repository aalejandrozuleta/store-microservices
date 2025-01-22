import { Router } from 'express';
export const routerSharedService = Router();

import { sharedController } from '@controller/shared/shared-service';
routerSharedService.post('/hashPassword', sharedController);
routerSharedService.post("/sendEmail", sharedController);
