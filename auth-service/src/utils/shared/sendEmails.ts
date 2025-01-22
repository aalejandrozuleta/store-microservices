import axios from 'axios';

export const sendEmails = async (data: EmailsInterface) => {
  const gatewayServiceUrl = process.env.GATEWAY_SERVICE_URL || '';
  
  try {
    const response = await axios.post(`${gatewayServiceUrl}/api/shared/sendEmail`, {
      data,
    });
    return response.data.value;
  } catch (error) {
    console.error('Error al enviar el correo:', error);
    throw error;
  }
};
