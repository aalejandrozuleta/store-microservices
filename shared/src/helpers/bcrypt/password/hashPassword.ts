import bcrypt from 'bcrypt';

/**
 * Genera un hash seguro para una contraseña utilizando bcrypt.
 *
 * Esta función toma una contraseña y la hashea con un salt generado automáticamente.
 * El hash resultante puede ser utilizado para almacenarlo de forma segura.
 *
 * @param password - La contraseña que se quiere hashear.
 *
 * @returns Una promesa que resuelve al hash generado de la contraseña.
 */
export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);

  // Crear el hash de la contraseña
  const hashedPassword = await bcrypt.hash(password, salt);

  return hashedPassword;
};
