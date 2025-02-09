import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const verifyRefreshToken = (refreshToken: string) => {
  const refreshSecret = process.env.JWT_REFRESH_SECRET;

  if (!refreshSecret) {
    throw new Error('JWT refresh secret is missing in environment variables.');
  }

  try {
    return jwt.verify(refreshToken, refreshSecret);
  } catch (error) {
    console.error(error);
    throw new Error('Invalid refresh token');
  }
};
