import { FastifyInstance } from 'fastify';
import { StatusCodes } from '../../utils/constants';
import { CountryListQueryParser } from './country.prehandler';
import { CountriesQuery, CountriesQuerySchema, CountriesResponseSchema } from './country.schema';
import { getCountryList } from './country.service';


export async function countryController(fastify: FastifyInstance) {
  fastify.get<{ Querystring: CountriesQuery }>(
    '/',
    {
      schema: {
        tags: ['countries'],
        description: 'Получение списка стран. Возможна фильтрация по определенным буквам алфавита, а также по континентам.',
        querystring: CountriesQuerySchema,
        response: CountriesResponseSchema
      },
      preHandler: CountryListQueryParser,
    },
    async ({query}, reply) => {
      const countrylist = getCountryList(query);
      reply.code(StatusCodes.OK).send(countrylist);
    }
  );
}
