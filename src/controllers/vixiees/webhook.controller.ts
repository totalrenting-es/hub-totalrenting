import { FastifyRequest, FastifyReply } from 'fastify';
import services from '../../services';

export async function handleTotalrentingWebhook(request: FastifyRequest, reply: FastifyReply) {
  const body = request.body as Record<string, unknown>;

  console.log(`[Vixiees Webhook] Received totalrenting webhook - event: ${(body as any)?.event}`);

  // Fire-and-forget: forward to all destinations in background
  services.vixiees.forwardWebhook('totalrenting', body).catch((err) => {
    console.error('[Vixiees Webhook] Unexpected error in totalrenting forward:', err);
  });

  // Respond immediately to Vixiees
  return reply.send({ ok: true });
}

export async function handleTwipoWebhook(request: FastifyRequest, reply: FastifyReply) {
  const body = request.body as Record<string, unknown>;

  console.log(`[Vixiees Webhook] Received twipo webhook - event: ${(body as any)?.event}`);

  // Fire-and-forget: forward to all destinations in background
  services.vixiees.forwardWebhook('twipo', body).catch((err) => {
    console.error('[Vixiees Webhook] Unexpected error in twipo forward:', err);
  });

  // Respond immediately to Vixiees
  return reply.send({ ok: true });
}
