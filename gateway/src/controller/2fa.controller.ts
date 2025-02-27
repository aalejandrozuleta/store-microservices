import { Request, Response } from 'express';
import { proxyRequest } from '@services/proxyRequest.service';

export const twoFaController = async (req: Request, res: Response) => {
  const authServiceUrl = process.env.Auth_Service_URL || '';
  if (!authServiceUrl) {
    throw new Error(
      'No se ha definido el valor de la variable de entorno Auth_Service_URL'
    );
  }
  try {
    const response = await proxyRequest(req, authServiceUrl, '/auth/2fa');
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : 'Internal Server Error',
    });
  }
};
