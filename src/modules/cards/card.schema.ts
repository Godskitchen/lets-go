import { CountryNames } from '../../db/countrylist';
import { Transport } from '../../types';


export const CreateCardDtoSchema = {
  type: 'object',
  properties: {
    companionCount: {
      type: 'integer',
      minimum: 1,
      maximum: 10,
      description: 'Число попутчиков.',
      errorMessage: 'Число попутчиков может быть целым положительным числом от 1 до 10',
    },
    children: {
      type: 'boolean',
      description: 'Флаг, показывающий возможность иметь попутчиков с детьми',
      errorMessage: 'Свойство children должно быть булевым значением'
    },
    startDate: {
      type: 'string',
      format: 'date',
      description: 'Дата начала поездки в формате YYYY-MM-DD',
      errorMessage: 'Начальная дата поездки должна быть в формате YYYY-MM-DD'
    },
    endDate: {
      type: 'string',
      format: 'date',
      description: 'Дата окончания поездки в формате YYYY-MM-DD.',
      errorMessage: 'Начальная дата поездки должна быть в формате YYYY-MM-DD'
    },
    countryList: {
      type: 'array',
      description: 'Список запланированных стран. От 1 до 4 уникальных стран. Массив объектов вида: {name: string, description?: string}',
      items: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            description: 'Наименование страны на русском языке. Должно быть из списка предложенных стран',
            enum: CountryNames,
            errorMessage: 'Наименование страны должно быть на русском языке из списка предложенных.'
          },
          description: {
            type: 'string',
            maxLength: 200,
            description: 'Ваш план действий и развлечений в стране. Необязательное поле. Максимум 200 символов',
            default: '',
            errorMessage: 'Описание плана развлечений может иметь не больше 200 символов'
          }
        },
        required: ['name'],
        errorMessage: {
          required: {
            name: 'Наименование страны является обязательным полем'
          }
        },
        additionalProperties: false,
      },
      minItems: 1,
      maxItems: 4,
      errorMessage: {
        type: 'Список стран должен быть массивом объектов от 1 до 4 уникальных стран.'
      }
    },
    hashTags: {
      type: 'array',
      maxItems: 6,
      uniqueItems: true,
      items: {
        type: 'string',
        pattern: '^#[a-zA-Zа-яА-ЯёЁ0-9]{1,19}$',
        maxLength: 20,
        minLength: 2,
        errorMessage: {
          maxLength: 'Каждый хэштег может иметь длину не больше 20 символов.',
          minLength: 'Каждый хэштег может иметь длину не меньше 2 символов.',
          pattern: 'Каждый хэштег должен начинаться с "#".'

        }
      },
      description: 'Список хэштегов. Каждый тэг должен начинаться с "#". Максимум 6 хэштегов, длина каждого тега не больше 20 символов',
      errorMessage: {
        uniqueItems: 'Каждый хэштег должен быть уникален',
        maxItems: 'Максимальное число хэштегов равно 6'
      }
    },
    transport: {
      type: 'array',
      minItems: 1,
      maxItems: 4,
      uniqueItems: true,
      items: {
        enum: Object.values(Transport),
        errorMessage: {
          enum: `Транспорт может быть выбран только из указанного списка: ${Object.values(Transport).join(', ')}`
        }
      },
      description: `Список транспорта, на котором планируется путешествие. Доступные значения: ${Object.values(Transport).join(', ')}`,
      errorMessage: {
        type: 'Список транспорта должен быть массивом',
        minItems: 'Минимальное количество элементов транспорта - 1',
        maxItems: 'Максимальное количество элементов транспорта - 4',
        uniqueItems: 'Все элементы списка транспорта должны быть уникальны.'
      }
    }
  },
  required: ['companionCount', 'children', 'startDate', 'endDate', 'countryList', 'transport'],
  additionalProperties: false,
} as const;
