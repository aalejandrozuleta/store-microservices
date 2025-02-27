import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { logger } from '@config/logger';

// Esquema Zod para la validación de datos de registro
const verifySchema = z.object({
  twoFactorCode: z
    .string()
    .length(6, {
      message: 'El código de autenticación debe tener exactamente 6 caracteres',
    })
    .regex(/^[a-zA-Z0-9]+$/, {
      message: 'El código solo puede contener letras y números',
    }),
});

// Middleware de validación utilizando Zod
export const validateTwoFactorCode = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const result = verifySchema.safeParse(req.body);

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
