import { FastifyRequest, FastifyReply } from 'fastify';
import services from '../../services';

export async function handleGetIP(_request: FastifyRequest, reply: FastifyReply) {
  try {
    const ip = await services.settings.getServerPublicIP();
    if (ip) {
      return reply.send({ ip });
    }
    return reply.status(500).send({ error: 'No se pudo obtener la IP pública del servidor' });
  } catch (error) {
    const err = error as Error;
    return reply.status(500).send({ error: err.message });
  }
}
