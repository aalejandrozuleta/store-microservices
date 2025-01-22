import { comparePassword } from "@helpers/bcrypt/password/comparePassword";

/**
 * Servicio para comparar una contraseña con un hash.
 * 
 * Este servicio utiliza la función `comparePassword` para realizar la comparación entre la contraseña
 * y el hash proporcionado. Si ocurre un error, lo captura y lo lanza de nuevo para ser gestionado 
 * por el controlador.
 * 
 * @param password - La contraseña proporcionada por el usuario.
 * @param hash - El hash de la contraseña almacenado en la base de datos.
 * 
 * @returns Una promesa que resuelve en un valor booleano, que indica si la contraseña coincide con el hash.
 * @throws Error - Si ocurre un error al comparar la contraseña y el hash.
 */
export const comparePasswordService = (password: string, hash: string): Promise<boolean> => {
  return comparePassword(password, hash).catch(error => {
    console.error('Error al comparar la contraseña:', error);
    throw error;
  });
};
