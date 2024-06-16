import { FastifyReply, FastifyRequest, HookHandlerDoneFunction } from 'fastify';
import { CountriesQuery } from './country.schema';
import { Continent } from '../../types';

export const CountryListQueryParser = (
  req: FastifyRequest<{Querystring: CountriesQuery}>,
  _: FastifyReply,
  done: HookHandlerDoneFunction) => {
  const { letters, continents } = req.query;
  if (letters) {
    const letterArray = [...new Set(letters.split(','))].map((char) => char.trim().toUpperCase());
    const regex = /^[А-Я]$/;

    const validLetters = letterArray.filter((char) => regex.test(char));
    req.query.letters = validLetters.join(',');
  }

  if (continents) {
    const continentArray = [...new Set(continents.split(','))].map((continent) => continent.trim());
    const validContinents = continentArray.filter((continent) => (Object.values(Continent) as string[]).includes(continent));
    req.query.continents = validContinents.join(',');
  }
  done();
};
