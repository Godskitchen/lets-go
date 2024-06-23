import { FastifyInstance } from 'fastify';
import { StatusCodes } from '../../utils/constants';
import { CardDateValidationPrehandler, GetCardQueryParser } from './card.prehandler';
import { GetCardsQuery, CreateCardBodySchema, GetCardsParamSchema, ResponseNewCardSchema, GetCardsQuerySchema, ResponseGetCardsSchema } from './card.schema';
import { createNewCard, getCardsById } from './card.service';

export async function cardController(fastify: FastifyInstance) {
  fastify.post(
    '/',
    {
      schema: {
        tags: ['cards'],
        description: 'Создание новой карточки пользователя.',
        body: CreateCardBodySchema,
        response: ResponseNewCardSchema
      },
      preHandler: CardDateValidationPrehandler,
      errorHandler({validation}, _, reply) {
        if (validation) {
          const validationErrors = validation.map(({message, instancePath}) => ({
            ...(instancePath && { field: instancePath }),
            ...(message && { message }),
          }));
          reply.status(StatusCodes.BAD_REQUEST).send({
            error: 'Validation error',
            code: StatusCodes.BAD_REQUEST,
            status: 'Bad request',
            issues: validationErrors
          });
        }
      },
    },
    async ({body}, reply) => {
      const cardId = await createNewCard(body);
      reply.code(StatusCodes.OK).send({
        message: 'Карточка пользователя успешно создана',
        id: cardId
      });
    }
  );

  fastify.get<{Querystring: GetCardsQuery, Params: {cardId: string}}>(
    '/:cardId',
    {
      schema: {
        tags: ['countries'],
        description: 'Получение списка карточек пользователей с учетом тех предпочтений, которые были указаны в форме. Возможна фильтрация по странам, а также по континентам. Также предусмотрена пагинация - по умолчанию отдается 4 первых карточки, включая основную карточку пользвоателя.',
        params: GetCardsParamSchema,
        querystring: GetCardsQuerySchema,
        response: ResponseGetCardsSchema
      },
      preHandler: GetCardQueryParser
    },
    async({params, query}, reply) => {
      const cards = await getCardsById(params.cardId, query);
      if (!cards) {
        reply.code(StatusCodes.NOT_FOUND).send({
          error: '[404]: Not Found',
          message: 'Карточка пользователя с таким id не найдена'
        });
      } else {
        reply.code(StatusCodes.OK).send(cards);
      }
    }
  );
}
