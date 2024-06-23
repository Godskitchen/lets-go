import { FastifyRequest, FastifyReply, HookHandlerDoneFunction } from 'fastify';
import { Continent, UserCardDto, ValidationFieldIssue } from '../../types';
import dayjs from 'dayjs';
import { StatusCodes } from '../../utils/constants';
import { GetCardsQuery } from './card.schema';
import { CountryNames } from '../../db/countrylist';

const MAX_TRIP_DAYS_DURATION = 31;

export const CardDateValidationPrehandler = (
  {body}: FastifyRequest<{Body: UserCardDto}>,
  reply: FastifyReply,
  next: HookHandlerDoneFunction) => {
  const { startDate, endDate } = body;
  const formattedStartDate = dayjs(startDate);
  const formattedEndDate = dayjs(endDate);
  const currentDate = dayjs().format('YYYY-MM-DD');

  const validationErrors: ValidationFieldIssue[] = [];

  if (formattedStartDate.isBefore(currentDate)) {
    validationErrors.push({
      field: 'startDate',
      message: 'Дата начала поездки не может быть меньше текущей даты'
    });
  }

  if (formattedEndDate.isBefore(currentDate)) {
    validationErrors.push({
      field: 'endDate',
      message: 'Дата окончания поездки не может быть меньше текущей даты'
    });
  }

  if(formattedEndDate.isBefore(formattedStartDate) || formattedEndDate.isSame(formattedStartDate)) {
    validationErrors.push({
      field: 'endDate',
      message: 'Дата окончания поездки не может быть меньше или равна дате начала поездки'
    });
  }

  if(formattedEndDate.diff(formattedStartDate, 'days') > MAX_TRIP_DAYS_DURATION) {
    validationErrors.push({
      field: 'endDate',
      message: 'Длительность поездки не может превышать 31 день.'
    });
  }

  if (validationErrors.length) {
    reply.code(StatusCodes.BAD_REQUEST).send({
      error: 'Validation error',
      code: 400,
      status: 'Bad request',
      issues: validationErrors
    });
  }

  next();
};

export const GetCardQueryParser = (
  req: FastifyRequest<{Querystring: GetCardsQuery}>,
  _: FastifyReply,
  next: HookHandlerDoneFunction) => {
  const { countries, continents } = req.query;
  if (countries) {
    const countryArray = [...new Set(countries.split(','))];
    const validCountries = countryArray.filter((country) => CountryNames.includes(country));
    req.query.countries = validCountries.join(',');
  }

  if (continents) {
    const continentArray = [...new Set(continents.split(','))].map((continent) => continent.trim());
    const validContinents = continentArray.filter((continent) => (Object.values(Continent) as string[]).includes(continent));
    req.query.continents = validContinents.join(',');
  }

  next();
};

