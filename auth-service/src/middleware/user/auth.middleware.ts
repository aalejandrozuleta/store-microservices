import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { logger } from '@config/logger';

// Esquema Zod para la validación de datos de registro
const authSchema = z.object({
  email: z.string().email({ message: 'El correo electrónico debe ser válido' }),

  password: z
    .string()
    .min(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
    .max(20, { message: 'La contraseña no debe exceder los 20 caracteres' })
    .regex(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])/, {
      message:
        'La contraseña debe tener al menos una letra mayúscula, una letra minúscula, un número y un carácter especial',
    }),
});

// Middleware de validación utilizando Zod
export const authValidator = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const result = authSchema.safeParse(req.body);

  if (!result.success) {
    logger.warn('Validación fallida', { errors: result.error.errors });
    res
      .status(400)
      .json({ errors: result.error.errors.map((err) => err.message) });
  } else {
    req.body = result.data; // Asignamos los datos validados al cuerpo de la solicitud
    next(); // Si la validación es exitosa, pasamos al siguiente middleware
  }
};
