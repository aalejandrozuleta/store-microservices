import { TwoFactorDto } from '@dto/user/2fa.dto';
import { generate2FASecret } from '@security/2FA/generate2FASecret';

export const twoFactorService = async (user: TwoFactorDto) => {
  return await generate2FASecret(user);
};
