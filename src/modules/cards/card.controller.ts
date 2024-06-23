import { FastifyInstance } from 'fastify';
import { StatusCodes } from '../../utils/constants';
import { CardDateValidationPrehandler } from './card.prehandler';
import { CardsQuery, CreateCardDtoSchema, ResponseNewCardSchema } from './card.schema';
import { createNewCard } from './card.service';
import { CardListById } from '../../db/cardlist';

export async function cardController(fastify: FastifyInstance) {
  fastify.post(
    '/',
    {
      schema: {
        tags: ['cards'],
        description: 'Создание новой карточки пользователя.',
        body: CreateCardDtoSchema,
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

  fastify.get<{Querystring: CardsQuery, Params: {cardId: string}}>(
    '/:cardId',
    {
      schema: {
        tags: ['countries'],
        description: 'Получение списка карточек пользователей с учетом тех предпочтений, которые были указаны в форме. Возможна фильтрация по стране, а также по континенту. Также предусмотрена пагинация - по умолчанию отдается 4 первых карточки, включая основную карточку пользвоателя.',

      }
    },
    async({params}, reply) => {
      const cards = CardListById.get(params.cardId);
      if (!cards) {
        reply.code(StatusCodes.NOT_FOUND).send({
          error: '[404]: Not Found',
          message: 'Карточка пользователя с таким id не найдена'
        });
      } else {
        reply.code(StatusCodes.OK).send({
          cardList: Array.from(cards)
        });
      }
    });
}
