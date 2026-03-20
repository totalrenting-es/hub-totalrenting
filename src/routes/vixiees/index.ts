import { FastifyInstance } from 'fastify';
import { webhookRoutes } from './webhook';

export async function vixieesRoutes(fastify: FastifyInstance) {
  await fastify.register(webhookRoutes, { prefix: '/webhook' });
}
