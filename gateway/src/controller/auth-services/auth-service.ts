import { proxyRequest } from '@services/proxy-auth-service';
import { Request, Response } from 'express';

/**
 * Controlador para manejar las solicitudes de autenticación.
 * 
 * Este controlador realiza una solicitud a un servicio de autenticación utilizando un proxy,
 * y luego devuelve la respuesta de ese servicio al cliente.
 * 
 * @async
 * @function authController
 * @param {Request} req - Objeto de solicitud de Express que contiene los detalles de la solicitud HTTP.
 * @param {Response} res - Objeto de respuesta de Express utilizado para enviar una respuesta al cliente.
 * @returns {Promise<Response>} - Retorna una respuesta con el código de estado y los datos del servicio de autenticación.
 * 
 * @throws {Error} Si ocurre un error en la solicitud al servicio de autenticación o cualquier otro error.
 * Devuelve un error con un mensaje claro en la respuesta.
 */

export const authController = async (req: Request, res: Response): Promise<Response> => {
  const authServiceUrl = process.env.AUTH_SERVICE_URL || '';
  
  try {
    // Realiza la solicitud al servicio de autenticación a través del proxy
    const response = await proxyRequest(req, authServiceUrl);

    // Devuelve la respuesta del servicio de autenticación
    return res.status(response.status).json(response.data);
  } catch (error) {
    // Manejar errores, proporcionando un mensaje claro
    const errorMessage =
      error instanceof Error ? error.message : 'Ocurrió un error desconocido';

    // Devuelve una respuesta de error
    return res.status(500).json({ error: errorMessage });
  }
};
