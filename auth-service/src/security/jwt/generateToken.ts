import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const generateTokens = (userId: number, email: string, name: string) => {
  const secret = process.env.JWT_SECRET;
  const refreshSecret = process.env.JWT_REFRESH_SECRET;
  const accessTokenExpiresIn = process.env.JWT_EXPIRES_IN || '15m';
  const refreshTokenExpiresIn = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

  if (!secret || !refreshSecret) {
    throw new Error('JWT secrets are missing in environment variables.');
  }

  const payload = { id: userId, name, email };

  const accessToken = jwt.sign(payload, secret, {
    expiresIn: accessTokenExpiresIn,
  });
  const refreshToken = jwt.sign(payload, refreshSecret, {
    expiresIn: refreshTokenExpiresIn,
  });

  return { accessToken, refreshToken };
};
