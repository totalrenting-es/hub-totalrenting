import { FastifyInstance } from 'fastify';
import { handleGetIP } from '../../../controllers/settings';

const schema = {
  tags: ['Settings'],
  summary: 'Obtener IP pública del servidor',
  description: '**`UTIL`**\n\nDevuelve la IP pública del servidor proxy.',
  response: {
    200: {
      type: 'object',
      properties: {
        ip: { type: 'string' }
      }
    },
    500: {
      type: 'object',
      properties: {
        error: { type: 'string' }
      }
    }
  }
};

export async function getIPRoute(fastify: FastifyInstance) {
  fastify.get('/get-ip', { schema }, handleGetIP);
}
