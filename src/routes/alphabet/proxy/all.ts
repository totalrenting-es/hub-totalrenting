import { FastifyInstance } from 'fastify';
import { handleProxyRequest } from '../../../controllers/alphabet';

const schema = {
  tags: ['Alphabet'],
  summary: 'Proxy a Alphabet API',
  description: '**`PROXY`**\n\nReenvía todas las peticiones a la API de Alphabet manteniendo headers de autorización.'
};

export async function proxyAllRoute(fastify: FastifyInstance) {
  // Raw body parser for all content types within this scope
  fastify.addContentTypeParser('*', function (_request, payload, done) {
    let data = Buffer.alloc(0);
    payload.on('data', (chunk: Buffer) => {
      data = Buffer.concat([data, chunk]);
    });
    payload.on('end', () => {
      done(null, data);
    });
    payload.on('error', (err) => {
      done(err);
    });
  });

  // Also override JSON parser within this scope to get raw buffer
  fastify.addContentTypeParser('application/json', function (_request, payload, done) {
    let data = Buffer.alloc(0);
    payload.on('data', (chunk: Buffer) => {
      data = Buffer.concat([data, chunk]);
    });
    payload.on('end', () => {
      done(null, data);
    });
    payload.on('error', (err) => {
      done(err);
    });
  });

  fastify.all('/proxy/*', { schema }, handleProxyRequest);
}
