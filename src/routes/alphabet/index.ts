import { FastifyInstance } from 'fastify';
import { proxyRoutes } from './proxy';

export async function alphabetRoutes(fastify: FastifyInstance) {
  await fastify.register(proxyRoutes);
}
