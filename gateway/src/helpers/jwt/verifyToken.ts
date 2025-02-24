import jwt, {
  JsonWebTokenError,
  NotBeforeError,
  TokenExpiredError,
} from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const verifyToken = (token: string) => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error('JWT secret key not found in environment variables.');
  }

  try {
    return jwt.verify(token, secret);
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      throw new Error('Token expired.');
    } else if (error instanceof NotBeforeError) {
      throw new Error('Token not valid yet.');
    } else if (error instanceof JsonWebTokenError) {
      throw new Error('Invalid token.');
    }
    throw error;
  }
};
