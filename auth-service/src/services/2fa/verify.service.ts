import { clientRedis } from '@config/redisDb';
import { verify2fa } from '@interfaces/2fa/verify.interface';
import { UserDevicesInterface } from '@interfaces/user/user.interface';
import { GeneralUserRepository } from '@repositories/general/general-user.repository';
import { verify2FACode } from '@security/2FA/verify2FACode';
import { generateTokens } from '@security/jwt/generateToken';
import { getTempTokenFromTempToken } from '@services/redis/getTempTokenToRedis';
import { saveTokenToRedis } from '@services/redis/saveTokenToRedis';

export const verify2FAService = async (
  data: verify2fa,
  devices: UserDevicesInterface
) => {
  try {
    // Validar código en Redis
    const getUserToken = await getTempTokenFromTempToken(data.token);

    if (!getUserToken) {
      throw new Error('Se venció el tiempo validación vuelva a intentarlo');
    }

    const userData = await GeneralUserRepository.getUserByEmail(getUserToken);

    if (!userData) {
      throw new Error('Usuario no encontrado');
    }

    const isValid2FA = await verify2FACode(userData[0].id, data.twoFactorCode);
    if (!isValid2FA) {
      throw new Error('Código de autenticación inválido');
    }

    // Generar tokens
    const token = generateTokens(
      userData[0].id,
      getUserToken,
      userData[0].name,
      userData[0].role
    );
    await saveTokenToRedis(userData[0].id, getUserToken, token.accessToken);

    devices.user_id = userData[0].id;

    await GeneralUserRepository.addDevice(devices);
    await clientRedis.del(`tempAuthToken:${data.token}`); // Eliminar después de usar
    return token;
  } catch (error) {
    throw error;
  }
};
