import { StatusCodes } from '../../utils/constants';

export type CountriesQuery = {
  letters?: string;
  continents?: string;
}

export const CountriesQuerySchema = {
  type: 'object',
  properties: {
    letters: { type: 'string' },
    continents: {type: 'string' }
  },
  additionalProperties: false,
} as const;

export const CountriesResponseSchema = {
  [StatusCodes.OK]: {
    type: 'object',
    patternProperties: {
      '^[А-Я]$': {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            flags: {
              type: 'object',
              properties: {
                png: { type: 'string' },
                svg: { type: 'string' }
              }
            },
            name: {
              type: 'object',
              properties: {
                common: { type: 'string' },
                rus: { type: 'string' }
              }
            },
            continent: {
              type: 'array',
              items: { type: 'string' }
            },
            island: {type: 'boolean'}
          }
        }
      }
    },
  }
} as const;

