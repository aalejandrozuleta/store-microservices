import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { logger } from '@config/logger';

// Esquema Zod para la validación de datos de registro
const registerSchema = z.object({
  name: z
    .string()
    .min(3, { message: 'El nombre debe tener al menos 3 caracteres' })
    .regex(/^[A-Za-z\s]+$/, {
      message: 'El nombre solo debe contener letras y espacios',
    }),

  email: z.string().email({ message: 'El correo electrónico debe ser válido' }),

  birthdate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'La fecha de nacimiento debe ser válida',
  }),

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
export const registerValidator = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const result = registerSchema.safeParse(req.body);

  if (!result.success) {
    logger.warn('Validación fallida', { errors: result.error.errors });
    res
      .status(400)
      .json({ error: result.error.errors.map((err) => err.message) });
  } else {
    req.body = result.data; // Asignamos los datos validados al cuerpo de la solicitud
    next(); // Si la validación es exitosa, pasamos al siguiente middleware
  }
};
