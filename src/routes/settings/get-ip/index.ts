import { FastifyInstance } from 'fastify';
import { getIPRoute } from './get';

export async function getIPRoutes(fastify: FastifyInstance) {
  await fastify.register(getIPRoute);
}
