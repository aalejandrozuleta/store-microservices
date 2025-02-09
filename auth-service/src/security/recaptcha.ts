import axios from 'axios';

export const verifyRecaptcha = async (
  recaptchaToken: string
): Promise<boolean> => {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;
  const response = await axios.post(
    'https://www.google.com/recaptcha/api/siteverify',
    null,
    {
      params: {
        secret: secretKey,
        response: recaptchaToken,
      },
    }
  );

  return response.data.success;
};
