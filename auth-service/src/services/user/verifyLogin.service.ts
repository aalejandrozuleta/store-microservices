import { UserDevicesInterface } from '@interfaces/user/user.interface';
import { verifyLoginInterface } from '@interfaces/user/verifyLogin.interface';
import { GeneralUserRepository } from '@repositories/general/general-user.repository';
import { generateTokens } from '@security/jwt/generateToken';
import { getTempTokenFromTempToken } from '@services/redis/getTempTokenToRedis';
import { saveTokenToRedis } from '@services/redis/saveTokenToRedis';
import { verifyCodeFromRedis } from '@services/redis/verifyCodeFromRedis';

export const verifyLoginService = async (
  data: verifyLoginInterface,
  device: UserDevicesInterface
) => {
  try {
    // Validar código en Redis
    const getUserToken = await getTempTokenFromTempToken(data.token);

    if (!getUserToken) {
      throw new Error('Se venció el tiempo validación vuelva a intentarlo');
    }

    const isValid = await verifyCodeFromRedis(getUserToken, data.code);
    if (!isValid) {
      throw new Error('Código de verificación inválido');
    }

    // Obtener datos del usuario
    const userData = await GeneralUserRepository.getUserByEmail(getUserToken);
    if (!userData) {
      throw new Error('Usuario no encontrado');
    }

    const token = generateTokens(
      userData[0].id,
      getUserToken,
      userData[0].name,
      userData[0].role
    );
    await saveTokenToRedis(userData[0].id, getUserToken, token.accessToken);

    device.user_id = userData[0].id;

    await GeneralUserRepository.addDevice(device);
    return token;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
