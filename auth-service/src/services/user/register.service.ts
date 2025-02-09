import { RegisterDto } from '@dto/user/register.dto';
import { GetUserEmail } from '@helpers/repositories/user/getUserEmail';
import { EmailsInterface } from '@interfaces/emails.interface';
import { UserDevicesInterface } from '@interfaces/user.interface';
import { RegisterRepository } from '@repositories/user/register.repository';
import { hashPassword } from '@utils/shared/hashPassword';
import { sendEmails } from '@utils/shared/sendEmails';
import axios from 'axios';

/**
 * Servicio para registrar un nuevo usuario.
 *
 * Este servicio realiza las siguientes acciones:
 * 1. Verifica si el correo electrónico del usuario ya está registrado en la base de datos.
 * 2. Si el correo electrónico existe, lanza un error.
 * 3. Hashea la contraseña antes de almacenarlo.
 * 4. Registra al usuario en la base de datos.
 * 5. Envía un correo electrónico de confirmación al usuario.
 *
 * @param user - El objeto de datos del usuario que contiene la información para el registro.
 * @throws Error - Si el correo electrónico ya existe o si ocurre algún error en el proceso.
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

    if (typeof devices.ip_address === 'string') {
      try {
        const geoData = await axios.get(`http://ip-api.com/json/${ip}`);
        if (geoData.data && geoData.data.status === 'success') {
          devices.location = `${geoData.data.city}, ${geoData.data.country}`;
        }
      } catch (geoError) {
        console.error('Error obteniendo la ubicación:', geoError);
      }
    }

    // Hasheamos la contraseña llamando al microservicio shared
    const passwordHash = await hashPassword(user.password);

    // Asignamos el valor hasheado a la propiedad password
    user.password = passwordHash;

    // Registramos al usuario en la base de datos con el objeto completo
    const idRegisterUser: number = await RegisterRepository.register(user);
    devices.user_id = idRegisterUser;
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
