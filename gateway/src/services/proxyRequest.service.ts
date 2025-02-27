import axios from 'axios';
import { Request } from 'express';

export const proxyRequest = async (
  req: Request,
  serviceUrl: string,
  path: string
) => {
  // Remueve solo '/api' de la URL original
  const cleanPath = req.originalUrl.replace('/api', '');

  // Construye la URL final
  const targetUrl = `${serviceUrl}${cleanPath}`;

  console.log('route --------', targetUrl);

  try {
    const response = await axios({
      method: req.method,
      url: targetUrl,
      headers: { ...req.headers, host: undefined, 'content-length': undefined },
      data: req.body,
    });

    return response;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw error.response
      ? { status: error.response.status, message: error.response.data }
      : { status: 500, message: 'Error en el proxy' };
  }
};
