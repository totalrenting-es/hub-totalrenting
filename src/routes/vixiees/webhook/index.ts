import { FastifyInstance } from 'fastify';
import { totalrentingWebhookRoute } from './totalrenting';
import { twipoWebhookRoute } from './twipo';

export async function webhookRoutes(fastify: FastifyInstance) {
  await fastify.register(totalrentingWebhookRoute);
  await fastify.register(twipoWebhookRoute);
}
