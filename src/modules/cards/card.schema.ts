import { CountryNames } from '../../db/countrylist';
import { Continent, Transport } from '../../types';
import { StatusCodes } from '../../utils/constants';

export type GetCardsQuery = {
  countries?: string;
  continents?: string;
  page: number;
}

export const CreateCardBodySchema = {
  type: 'object',
  properties: {
    companionCount: {
      type: 'integer',
      minimum: 1,
      maximum: 10,
      description: 'Число попутчиков.',
      errorMessage: {
        type: 'Число попутчиков может быть целым положительным числом от 1 до 10',
        minimum: 'Минимальное число попутчиков равно 1',
        maximum: 'Максимальное число попутчиков равно 10',
      }
    },
    children: {
      type: 'boolean',
      description: 'Флаг, показывающий возможность иметь попутчиков с детьми',
      errorMessage: {
        type: 'Свойство children должно быть булевым значением'
      }
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
      errorMessage: 'Конечная дата поездки должна быть в формате YYYY-MM-DD'
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
  errorMessage: {
    required: {
      companionCount: 'отсутствует обязательное свойство companionCount',
      children: 'отсутствует обязательное свойство children',
      startDate: 'отсутствует обязательное свойство startDate',
      endDate: 'отсутствует обязательное свойство endDate',
      countryList: 'отсутствует обязательное свойство countryList',
      transport: 'отсутствует обязательное свойство transport'
    }
  },
  example: {
    'companionCount': 3,
    'children': false,
    'startDate': '2024-06-22',
    'endDate': '2024-07-20',
    'countryList': [
      {
        'name': 'Россия',
        'description': 'Бухать водку в барах'
      }
    ],
    'hashTags': ['#tag1', '#tag2'],
    'transport': ['plane', 'walk']
  }
} as const;

export const ResponseNewCardSchema = {
  [StatusCodes.OK]: {
    type: 'object',
    description: 'Получен уникальный Id карточки в формате UUIDv4. Используйте его для получения информации по созданной карточке, а также карточкам других пользователей, соответствующим Вашим условиям',
    properties: {
      message: {
        type: 'string',
        description: 'Сообщение об успешном создании карточки пользователя'
      },
      id: {
        type: 'string',
        description: 'id новой карточки'
      }
    },
    example: {
      message: 'Карточка успешно создана',
      id: 'ea75dfac-ca45-4ba5-aef9-7c667eb13258'
    }
  },
  [StatusCodes.BAD_REQUEST]: {
    type: 'object',
    description: 'Ошибка валидации dto объекта',
    properties: {
      error: { const: 'Validation error' },
      code: { const: 400 },
      status: {const: 'Bad request'},
      issues: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            field: {type: 'string'},
            message: {type: 'string'}
          }
        }
      }
    }
  }
} as const;

export const GetCardsQuerySchema = {
  type: 'object',
  properties: {
    countries: {
      type: 'string',
      description: 'Названия стран на русском языке через запятую. Посторонние значения автоматически удаляются и не учитываются в запросе',
      example: 'Турция,Египет,Бразилия',
    },
    continents: {
      type: 'string',
      description: `Список континентов через запятую, Доступны значения из списка: ${Object.values(Continent).join(', ')}. Посторонние значения автоматически удаляются и не учитываются в запросе`,
      example: 'Asia,Oceania'
    },
    page: {
      type: 'integer',
      minimum: 1,
      description: 'Номер страницы списка. Целое число от 1. По умолчанию номер равен 1',
      default: 1,
      errorMessage: 'Номер страницы должен быть целым положительным числом'
    }
  },
  additionalProperties: false,
} as const;

export const GetCardsParamSchema = {
  type: 'object',
  properties: {
    cardId: {
      type: 'string',
      format: 'uuid',
      description: 'Уникальный идентификатор карточки пользователя в формате uuid v4',
      errorMessage: 'cardId должен быть в формате UUID'
    }
  },
  required: ['cardId'],
  additionalProperties: false,
} as const;

export const ResponseGetCardsSchema = {
  [StatusCodes.OK]: {
    type: 'object',
    description: 'Получен набор карточек с учетом пагинации. Максимум 4 карточки. Также получено общее количество карточек с учетом возможных фильтров',
    properties: {
      cardList: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            cardId: {
              type: 'string',
              description: 'уникальный id карточки'
            },
            name: {
              type: 'string',
              description: 'Имя и фамилия'
            },
            avatarUrl: {
              type: 'string',
              description: 'url ссылка на аватар'
            },
            countryList: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    description: 'Название страны на русском языке'
                  },
                  description: {
                    type: 'string',
                    description: 'Описание планов времяпровождения в данной стране. Необязательное поле'
                  }
                }
              },
              description: 'Список стран для посещения'
            }
          }
        },
        description: 'Набор карточек с учетом пагинации. Максимум 4 карточки'
      },
      totalCardsCount: {
        type: 'integer',
        description: 'Общее количество карточек с учетом возможных фильтров'
      }
    },
  },
  [StatusCodes.BAD_REQUEST]: {
    type: 'object',
    description: 'Ошибка валидации строки запроса',
    properties: {
      statusCode: {const: 400},
      error: { const: 'Bad Request' },
      message: { type: 'string' }
    }
  },
  [StatusCodes.NOT_FOUND]: {
    type: 'object',
    description: 'Карточка пользователя не найдена',
    properties: {
      error: {const: '[404]: Not Found'},
      message: { type: 'string' }
    }
  }
} as const;
