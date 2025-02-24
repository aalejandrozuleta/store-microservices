import { getTokenFromRedis } from '@helpers/jwt/getTokenRedis';
import { verifyToken } from '@helpers/jwt/verifyToken';
import { NextFunction, Request, Response } from 'express';

// Middleware de autenticación JWT
export const jwtAuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authorization = req.get('Authorization');
    if (!authorization) {
      console.error('❌ Falta el header Authorization');
      res.status(403).send('authorization header is missing');
      return next({ status: 401, message: 'Authorization header is missing' });
    }

    const token = authorization.split(' ')[1];
    if (!token) {
      console.error('❌ Token no encontrado en el header');
      res.status(403).json({ status: 'error', message: 'Token is missing' });
      return next({ status: 401, message: 'Token is missing' });
    }

    const decoded = verifyToken(token);
    if (typeof decoded === 'string') {
      console.error('❌ Token inválido');
      res.status(403).json({ status: 'error', message: 'Invalid token' });
      return next({ status: 401, message: 'Invalid token' });
    }

    const email = decoded.email;
    const tokenFromRedis = await getTokenFromRedis(email);

    if (!tokenFromRedis || token !== tokenFromRedis) {
      console.error('❌ Token no coincide o no existe');
      res
        .status(403)
        .json({ status: 'error', message: 'Token mismatch or not found' });
      return next({ status: 403, message: 'Token mismatch or not found' });
    }

    // Guardar el usuario en el request
    req.body.user = decoded;
    next();
  } catch (error) {
    console.error('Error in jwtAuthMiddleware:', error);
    res.status(403).json({ status: 'error', message: 'Unauthorized' });
  }
};

// Middleware de autorización basado en roles
export const authorizeRoles = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.body.user;

    if (!user || !roles.includes(user.role)) {
      return next({ status: 403, message: 'Access denied' });
    }

    next();
  };
};
