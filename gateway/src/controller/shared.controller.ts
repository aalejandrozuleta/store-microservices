import { Request, Response } from 'express';
import { proxyRequest } from '@services/proxyRequest.service';

export const sharedController = async (req: Request, res: Response) => {
  const sharedServiceUrl = process.env.SHARED_SERVICE_URL || '';
  if (!sharedServiceUrl) {
    throw new Error(
      'No se ha definido el valor de la variable de entorno SHARED_SERVICE_URL'
    );
  }
  try {
    const response = await proxyRequest(req, sharedServiceUrl, '');
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : 'Internal Server Error',
    });
  }
};
