import axios from 'axios';

export async function getServerPublicIP(): Promise<string | null> {
  try {
    const response = await axios.get<{ ip: string }>('https://api.ipify.org?format=json', {
      timeout: 5000
    });
    return response.data.ip;
  } catch (error) {
    const err = error as Error;
    console.warn(`No se pudo obtener IP pública del servidor: ${err.message}`);
    return null;
  }
}
