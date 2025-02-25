import { TwoFactorDto } from '@dto/2fa/register.dto';
import { generate2FASecret } from '@security/2FA/generate2FASecret';

export const twoFactorRegisterService = async (user: TwoFactorDto) => {
  return await generate2FASecret(user);
};
