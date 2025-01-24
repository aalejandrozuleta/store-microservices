import axios from 'axios';

export const hashPassword = async (password: string) => {
  const gatewayServiceUrl = process.env.GATEWAY_SERVICE_URL || '';

  try {
    const response = await axios.post(
      `${gatewayServiceUrl}/api/shared/hashPassword`,
      {
        password,
      }
    );

    return response.data.value;
  } catch (error) {
    // console.error('Error al generar el hash:', error);
    throw error;
  }
};
