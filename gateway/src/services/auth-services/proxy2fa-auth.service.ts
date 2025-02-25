import axios, { AxiosError } from 'axios';
import { Request } from 'express';

/**
 * Realiza una solicitud HTTP a otro servicio (proxy) utilizando los mismos parámetros de la solicitud original.
 *
 * Esta función toma la solicitud original, ajusta la URL para eliminar la parte del path `/api/auth`,
 * clona los encabezados y realiza la solicitud HTTP al servicio externo utilizando Axios. Si ocurre un error,
 * se maneja y se lanza con información detallada.
 *
 * @async
 * @function proxyRequest
 * @param {Request} req - Objeto de solicitud de Express que contiene los detalles de la solicitud HTTP original.
 * @param {string} serviceUrl - URL base del servicio al que se va a realizar la solicitud.
 * @returns {Promise<Object>} Retorna la respuesta del servicio con el mismo formato que Axios.
 *
 * @throws {Object} Si ocurre un error, se lanza un objeto con el código de estado y los datos del error.
 * El objeto tiene la forma `{ status: number, data: string }`.
 *
 * @example
 * const response = await proxyRequest(req, 'http://auth-service');
 * res.status(response.status).json(response.data);
 */
export const proxyRequest2fa = async (req: Request, serviceUrl: string) => {
  try {
    // Clonar los headers y eliminar los que no son necesarios
    const headers = { ...req.headers };
    delete headers.host;
    delete headers['content-length'];

    const response = await axios({
      method: req.method,
      url: `${serviceUrl}/auth/2fa${req.originalUrl.replace('/api/auth', '')}`, // Ajuste de la URL
      headers,
      data: req.body,
    });

    return response;
  } catch (error: unknown) {
    console.error('Error proxying request:', (error as Error).message);

    // Verificar si el error es de Axios y manejar la respuesta si está presente
    if (error instanceof AxiosError && error.response) {
      console.error('Detalles del error:', error.response.data);
      throw {
        status: error.response.status,
        data: error.response.data,
      };
    } else {
      // Error general si no es de Axios o no tiene respuesta
      throw {
        status: 500,
        data: 'An error occurred while proxying the request.',
      };
    }
  }
};
