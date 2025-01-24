import bcrypt from 'bcrypt';

/**
 * Compara una contraseña con su hash utilizando bcrypt.
 *
 * Esta función compara la contraseña proporcionada con el hash almacenado
 * para verificar si ambas coinciden.
 *
 * @param password - La contraseña que se desea comparar con el hash.
 * @param hash - El hash previamente generado de la contraseña.
 *
 * @returns Una promesa que resuelve a `true` si la contraseña coincide con el hash, `false` si no.
 */
export const comparePassword = (
  password: string,
  hash: string
): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};
