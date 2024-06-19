import Fastify, { FastifyRequest } from 'fastify';
import { StatusCodes } from './utils/constants';
import { getCountryList } from './modules/countries/country.service';
import { CountriesQuery, CountriesQuerySchema, CountriesResponseSchema } from './modules/countries/country.schema';
import { CountryListQueryParser } from './modules/countries/country.prehandler';
import { CreateCardDtoSchema } from './modules/cards/card.schema';
import addErrors from 'ajv-errors';
import { CardDateValidationPrehandler } from './modules/cards/card.prehandler';
import { v4 as uuidv4 } from 'uuid';

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
      strictSchema: true,
    },
    plugins: [addErrors]
  },
  logger: loggerOptions
});


// Declare a route
fastify.get('/', async (_request, _reply) => ({ hello: 'world' }));
fastify.get<{ Querystring: CountriesQuery }>(
  '/countries',
  {
    schema: {querystring: CountriesQuerySchema, response: CountriesResponseSchema },
    preHandler: CountryListQueryParser,
  },
  async ({query}, reply) => {
    const countrylist = getCountryList(query);
    reply.code(StatusCodes.OK).send(countrylist);
  }
);
fastify.post(
  '/users',
  {
    schema: {body: CreateCardDtoSchema},
    preHandler: CardDateValidationPrehandler
  },
  async (req, reply) => {
    reply.code(StatusCodes.OK).send(uuidv4());
  }
);


// Run the server!
try {
  await fastify.listen({ host: '0.0.0.0', port: 3000 });
} catch (err) {
  fastify.log.error(err);
  throw new Error;
}
