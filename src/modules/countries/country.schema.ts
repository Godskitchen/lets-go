import { Continent } from '../../types';
import { StatusCodes } from '../../utils/constants';

export type CountriesQuery = {
  letters?: string;
  continents?: string;
}

export const CountriesQuerySchema = {
  type: 'object',
  properties: {
    letters: {
      type: 'string',
      description: 'Буквы русского алфафита в верхнем или нижнем регистре через запятую (не забудьте про экранирование таких символов в строке URL, axios это делает автоматически), порядок букв учитывается, посторонние символы автоматически удаляются и не учитываются в запросе.',
      example: 'А,Б,О',
    },
    continents: {
      type: 'string',
      description: `Список континентов через запятую, Доступны значения из списка: ${Object.values(Continent).join(', ')}. Посторонние значения автоматически удаляются и не учитываются в запросе`,
      example: 'Asia,Oceania'
    }
  },
  additionalProperties: false,
} as const;

export const CountriesResponseSchema = {
  [StatusCodes.OK]: {
    type: 'object',
    description: 'Список стран с учетом фильтров',
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
    example: {
      'А': [
        {
          'flags': {
            'png': 'https://flagcdn.com/w320/au.png',
            'svg': 'https://flagcdn.com/au.svg'
          },
          'name': {
            'common': 'Australia',
            'rus': 'Австралия'
          },
          'continent': [
            'Oceania'
          ],
          'island': false
        },
        {
          'flags': {
            'png': 'https://flagcdn.com/w320/at.png',
            'svg': 'https://flagcdn.com/at.svg'
          },
          'name': {
            'common': 'Austria',
            'rus': 'Австрия'
          },
          'continent': [
            'Europe'
          ],
          'island': false
        }
      ]
    }
  },
} as const;

