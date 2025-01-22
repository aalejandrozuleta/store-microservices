import { logger } from '@config/logger';
import { RegisterDto } from '@dto/user/register.dto';
import { UserInterface } from '@interfaces/user.interface';
import { registerService } from '@services/user/register.service';
import { Request, Response } from 'express';
import { validationResult } from 'express-validator';

/**
 * Controlador para manejar el registro de nuevos usuarios.
 *
 * Este controlador recibe los datos del usuario desde la solicitud HTTP (body) y utiliza
 * Miramos que no haya errores en el middleware
 * el servicio de registro para guardar la nueva información del usuario en la base de datos.
 * Si el registro es exitoso, se responde con un mensaje de éxito y un código de estado 201.
 * En caso de error, maneja la excepción y responde con un mensaje de error y un código de estado 500.
 *
 * @param req - Objeto de solicitud HTTP que contiene los datos del nuevo usuario en el cuerpo.
 * Se omiten las propiedades `accountStatus` y `registeredAt` al recibir el usuario.
 * @param res - Objeto de respuesta HTTP utilizado para devolver una respuesta al cliente.
 *
 * @returns Una respuesta JSON con el estado del registro:
 *          - Si el registro es exitoso, se devuelve un código 201 y un mensaje de éxito.
 *          - Si ocurre un error, se devuelve un código 500 y un mensaje de error.
 */

export const registerController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  // Validar los datos de entrada utilizando express-validator
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.warn('Validación fallida', { errors: errors.array() }); // Log de advertencia

    res
      .status(400)
      .json({ errors: errors.array().map((err) => err.msg) });
      return;
  }

  // Se obtiene el usuario del cuerpo de la solicitud, omitiendo las propiedades accountStatus y registeredAt
  const user = req.body as Omit<UserInterface, 'accountStatus' | 'registeredAt'>;

  // Se crea un objeto RegisterDto con los datos del usuario para pasarlo al servicio de registro
  const newUser = new RegisterDto(
    user.name,
    user.email,
    user.birthdate,
    user.password,
    user.role,
  );

  try {
    // Se llama al servicio de registro para guardar al nuevo usuario en la base de datos
    await registerService(newUser);

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

