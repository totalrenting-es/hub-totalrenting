import { FastifyInstance } from 'fastify';
import { proxyAllRoute } from './all';

export async function proxyRoutes(fastify: FastifyInstance) {
  await fastify.register(proxyAllRoute);
}
