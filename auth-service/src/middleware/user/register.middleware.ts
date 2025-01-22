import { body, validationResult, ValidationChain, ValidationError } from 'express-validator';
import { Request } from 'express';

/**
 * Valida los campos necesarios para el registro de un usuario.
 * Utiliza `express-validator` para asegurarse de que los datos proporcionados son válidos.
 * 
 * @constant registerValidator
 * @type {ValidationChain[]}
 */
const registerValidator: ValidationChain[] = [
  body('name')
    .isString()
    .withMessage('El nombre debe ser una cadena de caracteres')
    .isLength({ min: 3 })
    .withMessage('El nombre debe tener al menos 3 caracteres')
    .matches(/^[A-Za-z\s]+$/)
    .withMessage('El nombre solo debe contener letras y espacios'),

  body('email')
    .isEmail()
    .withMessage('El correo electrónico debe ser válido')
    .normalizeEmail(),

  body('birthdate')
    .isDate()
    .withMessage('La fecha de nacimiento debe ser una fecha válida'),

  body('password')
    .isString()
    .withMessage('La contraseña debe ser una cadena de caracteres')
    .isLength({ min: 8, max: 20 })
    .matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])/)
    .withMessage('La contraseña debe tener al menos una letra mayúscula, una letra minúscula, un número y un carácter especial'),

  body('role')
    .isInt({ min: 1, max: 4 })
    .withMessage('El rol debe ser un número entre 1 y 4'),
];

/**
 * Función para validar los datos de la solicitud.
 * 
 * Este método se utiliza para revisar si existen errores de validación y devolverlos.
 * 
 * @param {Request} req - Objeto de solicitud HTTP.
 * @returns {ValidationError[]} - Devuelve un array con los errores de validación si existen, de lo contrario un array vacío.
 */
const validateUser = (req: Request): ValidationError[] => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return errors.array();
  }

  return [];
};

export { registerValidator, validateUser };
