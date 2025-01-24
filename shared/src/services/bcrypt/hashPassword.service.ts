import { hashPassword } from '@helpers/bcrypt/password/hashPassword';

/**
 * Servicio para generar un hash a partir de una contraseña.
 *
 * Este servicio utiliza la función `hashPassword` para generar un hash seguro de la contraseña proporcionada.
 * Si ocurre un error, lo captura y lo lanza de nuevo para ser gestionado por el controlador.
 *
 * @param password - La contraseña proporcionada por el usuario.
 *
 * @returns Una promesa que resuelve en el hash generado de la contraseña.
 * @throws Error - Si ocurre un error al generar el hash de la contraseña.
 */
export const hashPasswordService = (password: string): Promise<string> => {
  return hashPassword(password).catch((error) => {
    console.error('Error al generar el hash:', error);
    throw error;
  });
};
