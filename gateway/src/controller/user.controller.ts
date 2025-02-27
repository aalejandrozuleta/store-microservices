import { Request, Response } from 'express';
import { proxyRequest } from '@services/proxyRequest.service';

export const userController = async (req: Request, res: Response) => {
  const authServiceUrl = process.env.AUTH_SERVICE_URL || '';
  if (!authServiceUrl) {
    throw new Error(
      'No se ha definido el valor de la variable de entorno AUTH_SERVICE_URL'
    );
  }
  try {
    const response = await proxyRequest(req, authServiceUrl, '/auth/user');
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : 'Internal Server Error',
    });
  }
};
