import { RegisterDto } from '@dto/user/register.dto';
import { GetUserEmail } from '@repositories/user/getUserEmail';
import { EmailsInterface } from '@interfaces/shared/emails.interface';
import { UserDevicesInterface } from '@interfaces/user/user.interface';
import { RegisterRepository } from '@repositories/user/register.repository';
import { hashPassword } from '@utils/shared/hashPassword';
import { sendEmails } from '@utils/shared/sendEmails';

/**
 * Servicio para registrar un nuevo usuario.
 *
 * Este servicio realiza las siguientes acciones:
 * 1. Verifica si el correo electrónico del usuario ya está registrado en la base de datos.
 * 2. Si el correo electrónico existe, lanza un error.
 * 3. Hashea la contraseña antes de almacenarla.
 * 4. Registra al usuario en la base de datos.
 * 5. Registrar los dispositivos del usuario en la base de datos.
 * 6. Envía un correo electrónico de confirmación al usuario.
 *
 * @async
 * @function registerService
 * @param {RegisterDto} user - Objeto de datos del usuario que contiene la información para el registro.
 * @param {UserDevicesInterface} devices - Información del dispositivo del usuario.
 * @throws {Error} Si el correo electrónico ya existe o si ocurre algún error en el proceso.
 * @returns {Promise<void>}
 */
export const registerService = async (
  user: RegisterDto,
  devices: UserDevicesInterface
) => {
  try {
    // Comprobamos si el correo electrónico ya está registrado
    const isEmailRegistered = await GetUserEmail.getUserEmail(user.email);

    if (isEmailRegistered.length > 0) {
      throw new Error(`Email ${user.email} ya está registrado`);
    }

    // Hasheamos la contraseña llamando al microservicio shared
    const passwordHash = await hashPassword(user.password);

    // Asignamos el valor hasheado a la propiedad password
    user.password = passwordHash;

    // Registramos al usuario en la base de datos con el objeto completo
    const idRegisterUser: number = await RegisterRepository.register(user);
    devices.user_id = idRegisterUser;
    devices.autorizad = 'AUTORICE';
    RegisterRepository.registerDevices(devices);

    // Enviamos un correo electrónico con el enlace de activación
    const data: EmailsInterface = {
      email: user.email,
      variables: {
        name: user.name,
      },
      subject: 'Registro exitoso',
      template: 'register.html',
    };

    await sendEmails(data);
  } catch (error) {
    // Lanza el error hacia el controlador
    throw error;
  }
};
