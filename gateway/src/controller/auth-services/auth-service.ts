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
 * @returns {<Response>} - Retorna una respuesta con el código de estado y los datos del servicio de autenticación.
 * 
 * @throws {Error} Si ocurre un error en la solicitud al servicio de autenticación o cualquier otro error.
 * Devuelve un error con un mensaje claro en la respuesta.
 */


export const authController = async (req: Request, res: Response) => {
  const authServiceUrl = process.env.AUTH_SERVICE_URL || '';
  try {
    const response = await proxyRequest(req, authServiceUrl);
    res.status(response.status).json(response.data);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
};
