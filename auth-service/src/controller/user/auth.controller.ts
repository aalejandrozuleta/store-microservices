import { logger } from '@config/logger';
import { AuthDto } from '@dto/user/auth.dto';
import { UserInterface } from '@interfaces/user.interface';
import { authService } from '@services/user/auth.service';
import { Request, Response } from 'express';

export const authController = async (req: Request, res: Response) => {
  try {
    const user = req.body as Pick<UserInterface, 'email' | 'password'>;
    const authUser = new AuthDto(user.email, user.password);

    // Se llama al servicio de registro para guardar al nuevo usuario en la base de datos
    const token: string = await authService(authUser);

    // Registro exitoso, se loggea el evento con los detalles del nuevo usuario
    logger.info('User Auth created successfully', {
      email: user.email,
    });

    // Se devuelve una respuesta de éxito con el código de estado 201
    res
      .status(201)
      .json({ message: 'User Auth created successfully', token: token });
  } catch (error) {
    // Manejo de errores
    const errorMessage =
      error instanceof Error ? error.message : 'Ocurrió un error desconocido';

    // Se loggea el error para análisis posterior, incluyendo los detalles del usuario y el mensaje de error
    logger.error('Error al ingresar al sistema', {
      email: user.email || 'Email no proporcionado',
      error: errorMessage,
    });

    // Se devuelve una respuesta de error con el código de estado 500 y el mensaje de error
    res.status(500).json({ error: errorMessage });
  }
};
