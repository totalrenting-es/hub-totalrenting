import { FastifyInstance } from 'fastify';
import { getIPRoutes } from './get-ip';

export async function settingsRoutes(fastify: FastifyInstance) {
  await fastify.register(getIPRoutes);
}
