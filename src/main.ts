import Fastify, { FastifyRequest } from 'fastify';
import addErrors from 'ajv-errors';
import swagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
// import { countryController } from './modules/countries/country.controller';
import { cardController } from './modules/cards/card.controller';
import cors from '@fastify/cors';
import { seedCardList } from './utils/helpers';

const loggerOptions = {
  transport: {
    target: 'pino-pretty',
    options: {
      translateTime: 'SYS:HH:MM:ss',
    },
  },
  serializers: {
    req (request: FastifyRequest) {
      return {
        method: request.method,
        url: request.url,
        remoteAddress: request.ip,
      };
    }
  }
};


const fastify = Fastify({
  ajv: {
    customOptions: {
      allErrors: true,
      removeAdditional: 'all',
      coerceTypes: 'array',
      useDefaults: true,
      strictSchema: false,
    },
    plugins: [addErrors]
  },
  logger: loggerOptions
});


await fastify.register(swagger, {
  openapi: {
    openapi: '3.1.0',
    info: {
      title: 'Test swagger',
      description: 'Testing the Fastify swagger API',
      version: '0.1.0'
    },
    tags: [
      { name: 'countries', description: 'Описание действий со странами' },
      { name: 'cards', description: 'Описание действий с карточками пользователей' }
    ],
  }
});


// await fastify.register(countryController, {prefix: '/countries'});
// fastify.log.info('Countries routes added');

await fastify.register(cardController, {prefix: '/cards'});
fastify.log.info('Cards routes added');

await fastify.register(fastifySwaggerUi, {
  routePrefix: '/api',
  uiConfig: {
    layout: 'BaseLayout',
    showCommonExtensions: false,
    deepLinking: false,
  }
});
fastify.log.info('Swagger UI generated');

await seedCardList(100);
fastify.log.info('Card pool seeded');


await fastify.register(cors);


// Run the server!
try {
  await fastify.listen({ host: '0.0.0.0', port: 3000 });
} catch (err) {
  fastify.log.error(err);
  throw new Error;
}
