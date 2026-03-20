import { FastifyInstance } from 'fastify';
import { handleTwipoWebhook } from '../../../controllers/vixiees';

const schema = {
  tags: ['Vixiees'],
  summary: 'Webhook Twipo',
  description: '**`WEBHOOK`**\n\nRecibe eventos webhook desde la cuenta de Vixiees de Twipo y los reenvía a los destinos configurados.'
};

export async function twipoWebhookRoute(fastify: FastifyInstance) {
  fastify.post('/twipo', { schema }, handleTwipoWebhook);
}
