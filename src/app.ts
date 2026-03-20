import Fastify from 'fastify';
import cors from '@fastify/cors';
import swagger from '@fastify/swagger';
import scalarPlugin from '@scalar/fastify-api-reference';
import { alphabetRoutes } from './routes/alphabet';
import { settingsRoutes } from './routes/settings';
import { vixieesRoutes } from './routes/vixiees';

export const buildApp = async () => {
  const fastify = Fastify({ logger: false });

  // CORS
  await fastify.register(cors, {
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
  });

  console.log('process.env.NODE_ENV', process.env.NODE_ENV);

  // OpenAPI spec
  await fastify.register(swagger, {
    openapi: {
      info: {
        title: 'Hub Totalrenting',
        description: 'Hub central de integraciones: proxy Alphabet, webhooks Vixiees (Totalrenting y Twipo) y automatizaciones',
        version: '1.0.0'
      },
      tags: [
        { name: 'Alphabet', description: 'Proxy a la API de Alphabet' },
        { name: 'Vixiees', description: 'Webhooks de Vixiees (fan-out a múltiples destinos)' },
        { name: 'Settings', description: 'Configuración y utilidades globales' },
        { name: 'Health', description: 'Estado del servidor' }
      ]
    }
  });

  // Scalar UI
  await fastify.register(scalarPlugin, {
    routePrefix: '/docs'
  });

  // Health check
  fastify.get(
    '/health',
    {
      schema: {
        tags: ['Health'],
        summary: 'Verificar estado del servidor',
        response: {
          200: {
            type: 'object',
            properties: {
              status: { type: 'string' },
              timestamp: { type: 'string' }
            }
          }
        }
      }
    },
    async () => {
      return { status: 'ok', timestamp: new Date().toISOString() };
    }
  );

  // Favicon
  fastify.get('/favicon.ico', async (_request, reply) => {
    return reply.status(204).send();
  });

  const apiPrefix = process.env.API_PREFIX || '/api';

  // Rutas
  await fastify.register(alphabetRoutes, { prefix: `${apiPrefix}/alphabet` });
  await fastify.register(settingsRoutes, { prefix: `${apiPrefix}/settings` });
  await fastify.register(vixieesRoutes, { prefix: `${apiPrefix}/vixiees` });

  return fastify;
};
