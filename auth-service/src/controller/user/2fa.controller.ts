import { logger } from '@config/logger';
import { TwoFactorDto } from '@dto/user/2fa.dto';
import { TwoFactorInterface } from '@interfaces/2fa.interface';
import { twoFactorService } from '@services/user/2fa.service';
import { Request, Response } from 'express';

export const twoFactorController = async (req: Request, res: Response) => {
  try {
    const token = req.body.user as TwoFactorInterface;

    console.log('token', req.body.user);

    const tokenDto = new TwoFactorDto(token.id, token.email);
    const { secret, qrCodeUrl } = await twoFactorService(tokenDto);

    res.status(200).json({
      message: '2FA activado correctamente',
      secret,
      qrCodeUrl,
    });
  } catch (error) {
    // Manejo de errores
    const errorMessage =
      error instanceof Error ? error.message : 'Ocurrió un error desconocido';

    // Se loggea el error para análisis posterior, incluyendo los detalles del usuario y el mensaje de error
    logger.error('Error al activar 2FA', {
      email: req.body?.email || 'Email no proporcionado',
      error: errorMessage,
    });

    // Se devuelve una respuesta de error con el código de estado 500 y el mensaje de error
    res
      .status(500)
      .json({ error: errorMessage, message: 'Error al activar 2FA' });
  }
};
