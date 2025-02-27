import axios from 'axios';
import { Request } from 'express';

// Mapeo de servicios con su prefijo correspondiente
const routeMappings: Record<string, string> = {
  auth: '/auth/user',
  shared: '',
  '2fa': '/auth/2fa',
};

export const proxyRequest = async (
  req: Request,
  serviceUrl: string,
  serviceKey: string
) => {
  let cleanPath = req.originalUrl.replace(/^\/api/, ''); // Eliminar "/api" de la URL

  // Si el servicio tiene un prefijo definido en el mapeo, lo agregamos
  const prefix = routeMappings[serviceKey] || '';
  if (prefix && cleanPath.startsWith(prefix)) {
    cleanPath = cleanPath.replace(prefix, '');
  }

  // Construir la URL final
  const targetUrl = `${serviceUrl}${prefix}${cleanPath}`;

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
