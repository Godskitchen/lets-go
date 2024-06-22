import { FastifyInstance } from 'fastify';
import { StatusCodes } from '../../utils/constants';
import { CardDateValidationPrehandler } from './card.prehandler';
import { CreateCardDtoSchema, ResponseNewCardSchema } from './card.schema';
import { createNewCard } from './card.service';

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
}
