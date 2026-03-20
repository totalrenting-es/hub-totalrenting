import { FastifyRequest, FastifyReply } from 'fastify';
import services from '../../services';

export async function handleProxyRequest(request: FastifyRequest, reply: FastifyReply) {
  try {
    const path = (request.params as { '*': string })['*'];
    const queryString = request.url.includes('?') ? request.url.split('?').slice(1).join('?') : '';
    const fullPath = '/' + path + (queryString ? `?${queryString}` : '');

    const result = await services.alphabet.proxyRequest(fullPath, request.method, request.headers as Record<string, string | undefined>, request.body as Buffer | undefined, request.headers['content-type']);

    Object.entries(result.headers).forEach(([key, value]) => {
      reply.header(key, value);
    });

    return reply.status(result.status).send(result.data);
  } catch (error) {
    const err = error as Error;
    console.error(`[Alphabet Proxy] Error: ${err.message}`);
    return reply.status(500).send({ error: 'Proxy error', message: err.message });
  }
}
