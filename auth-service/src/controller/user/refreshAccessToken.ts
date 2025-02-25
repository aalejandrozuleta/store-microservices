import { Request, Response } from 'express';
import { generateTokens } from '@security/jwt/generateToken';
import { verifyRefreshToken } from '@security/jwt/refreshToken';
import { getRefreshTokenFromRedis } from '@services/redis/getRefreshTokenFromRedis';
import { saveTokenToRedis } from '@services/redis/saveTokenToRedis';
import { DecodedTokenInterface } from '@interfaces/jwt/decode.interface';

export const refreshAccessToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      res.status(400).json({ message: 'Refresh Token is required' });
    }

    // Decodificar el Refresh Token
    const decoded = verifyRefreshToken(refreshToken) as DecodedTokenInterface;

    // Obtener el Refresh Token almacenado en Redis
    const storedToken = await getRefreshTokenFromRedis(decoded.email);
    if (!storedToken || storedToken !== refreshToken) {
      res.status(403).json({ message: 'Invalid Refresh Token' });
    }

    // Generar nuevos tokens
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(
      decoded.id,
      decoded.email,
      decoded.name
    );

    // Guardar el nuevo Refresh Token en Redis
    await saveTokenToRedis(decoded.id, decoded.email, newRefreshToken);

    res.json({ accessToken, refreshToken: newRefreshToken });
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Unauthorized' });
  }
};
