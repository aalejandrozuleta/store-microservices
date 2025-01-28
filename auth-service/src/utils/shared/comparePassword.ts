import axios from 'axios';

export const comparePassword = async (
  password: string,
  hashPassword: string
) => {
  const gatewayServiceUrl = process.env.GATEWAY_SERVICE_URL || '';

  try {
    const response = await axios.post(
      `${gatewayServiceUrl}/api/shared/comparePassword`,
      {
        password,
        hashPassword,
      }
    );

    return response.data.value;
  } catch (error) {
    // console.error('Error al generar el hash:', error);
    throw error;
  }
};
