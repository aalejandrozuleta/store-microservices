import axios from 'axios';
import { UAParser } from 'ua-parser-js';
import { UserDevicesInterface } from '@interfaces/user/user.interface';
import { Request } from 'express';

/**
 * Obtiene la información del dispositivo a partir de la solicitud entrante.
 *
 * Esta función adquiere la dirección IP y el User-Agent desde las cabeceras de la solicitud
 * para extraer detalles del dispositivo. Intenta determinar la ubicación basada en la dirección IP.
 *
 * @async
 * @function getDeviceInfo
 * @param {any} req - El objeto de solicitud HTTP.
 * @returns {Promise<UserDevicesInterface>} La información del dispositivo del usuario incluyendo el nombre del dispositivo, dirección IP, user agent, y ubicación.
 */

export const getDeviceInfo = async (
  req: Request
): Promise<UserDevicesInterface> => {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const userAgent = req.headers['user-agent'] || 'Desconocido';

  // Analizar User-Agent para detectar el dispositivo
  const parser = new UAParser();
  const deviceInfo = parser.getResult();

  const devices: UserDevicesInterface = {
    device_name: deviceInfo.device.model
      ? `${deviceInfo.device.vendor || ''} ${deviceInfo.device.model}`
      : `${deviceInfo.os.name || 'OS desconocido'} ${deviceInfo.os.version || ''}`.trim(),
    ip_address: Array.isArray(ip) ? ip[0] : ip || 'Desconocido',
    user_agent: userAgent,
    location: '',
  };

  // Obtener la ubicación si la IP es válida

  try {
    const geoData = await axios.get(
      `http://ip-api.com/json/${devices.ip_address}`
    );
    if (geoData.data && geoData.data.status === 'success') {
      devices.location = `${geoData.data.city}, ${geoData.data.country}`;
    } else {
      devices.location = 'Desconocida';
    }
  } catch (geoError) {
    console.error('Error obteniendo la ubicación:', geoError);
  }

  return devices;
};
