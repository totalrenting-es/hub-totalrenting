import { FastifyInstance } from 'fastify';
import { handleTotalrentingWebhook } from '../../../controllers/vixiees';

const schema = {
  tags: ['Vixiees'],
  summary: 'Webhook Totalrenting',
  description: '**`WEBHOOK`**\n\nRecibe eventos webhook desde la cuenta de Vixiees de Totalrenting y los reenvía a los destinos configurados.'
};

export async function totalrentingWebhookRoute(fastify: FastifyInstance) {
  fastify.post('/totalrenting', { schema }, handleTotalrentingWebhook);
}
