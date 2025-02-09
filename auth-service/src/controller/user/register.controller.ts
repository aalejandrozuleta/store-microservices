import { logger } from '@config/logger';
import { RegisterDto } from '@dto/user/register.dto';
import { UserInterface } from '@interfaces/user.interface';
import { registerService } from '@services/user/register.service';
import { getDeviceInfo } from '@utils/UAparse/getDeviceInfo';
import { Request, Response } from 'express';

/**
 * Controlador para gestionar el registro de nuevos usuarios.
 *
 * Este controlador recibe los datos del usuario desde una solicitud HTTP (body) y
 * utiliza un servicio de registro para almacenar la nueva información del usuario
 * en la base de datos. Si el registro es exitoso, responde con un mensaje de éxito
 * y un código de estado 201. En caso de error, maneja la excepción y responde con
 * un mensaje de error y código de estado 500.
 *
 * @async
 * @function registerController
 * @param {Request} req - Objeto de solicitud HTTP que contiene los datos del nuevo usuario en el cuerpo.
 *    Las propiedades `accountStatus` y `registeredAt` se omiten al recibir los datos del usuario.
 * @param {Response} res - Objeto de respuesta HTTP utilizado para devolver una respuesta al cliente.
 * @returns {Promise<void>} Una respuesta JSON con el estado del registro:
 *    - Si el registro es exitoso, se devuelve un código 201 y un mensaje de éxito.
 *    - Si ocurre un error, se devuelve un código 500 y un mensaje de error.
 */

export const registerController = async (req: Request, res: Response) => {
  // Se obtiene el usuario del cuerpo de la solicitud, omitiendo las propiedades accountStatus y registeredAt
  const user = req.body as Omit<
    UserInterface,
    'accountStatus' | 'registeredAt' | 'recovery_email' | 'role'
  >;

  const devices = await getDeviceInfo(req);

  // Se crea un objeto RegisterDto con los datos del usuario para pasarlo al servicio de registro
  const newUser = new RegisterDto(
    user.name,
    user.email,
    user.birthdate,
    user.password,
    devices.location
  );

  try {
    // Se llama al servicio de registro para guardar al nuevo usuario en la base de datos
    await registerService(newUser, devices);

    // Registro exitoso, se loggea el evento con los detalles del nuevo usuario
    logger.info('User created successfully', {
      name: user.name,
      email: user.email,
    });

    // Se devuelve una respuesta de éxito con el código de estado 201
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    // Manejo de errores
    const errorMessage =
      error instanceof Error ? error.message : 'Ocurrió un error desconocido';

    // Se loggea el error para análisis posterior, incluyendo los detalles del usuario y el mensaje de error
    logger.error('Error al registrar usuario', {
      name: user?.name || 'Nombre no proporcionado',
      email: user?.email || 'Email no proporcionado',
      error: errorMessage,
    });

    // Se devuelve una respuesta de error con el código de estado 500 y el mensaje de error
    res.status(500).json({ error: errorMessage });
  }
};
