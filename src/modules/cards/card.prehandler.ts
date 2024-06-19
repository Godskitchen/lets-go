import { FastifyRequest, FastifyReply, HookHandlerDoneFunction } from 'fastify';
import { UserCard } from '../../types';
import dayjs from 'dayjs';
import { StatusCodes } from '../../utils/constants';

const MAX_TRIP_DAYS_DURATION = 31;

export const CardDateValidationPrehandler = (
  {body}: FastifyRequest<{Body: UserCard}>,
  reply: FastifyReply,
  done: HookHandlerDoneFunction) => {
  const { startDate, endDate } = body;
  const formattedStartDate = dayjs(startDate);
  const formattedEndDate = dayjs(endDate);
  const currentDate = dayjs().format('YYYY-MM-DD');

  if (formattedStartDate.isBefore(currentDate)) {
    reply.code(StatusCodes.BAD_REQUEST).send({
      startDate: 'Дата начала поездки не может быть меньше текущей даты'
    });
  }

  if (formattedEndDate.isBefore(currentDate)) {
    reply.code(StatusCodes.BAD_REQUEST).send({
      endDate: 'Дата окончания поездки не может быть меньше текущей даты'
    });
  }

  if(formattedEndDate.isBefore(formattedStartDate) || formattedEndDate.isSame(formattedStartDate)) {
    reply.code(StatusCodes.BAD_REQUEST).send({
      endDate: 'Дата окончания поездки не может быть меньше или равна дате начала поездки'
    });
  }

  if(formattedEndDate.diff(formattedStartDate, 'days') > MAX_TRIP_DAYS_DURATION) {
    reply.code(StatusCodes.BAD_REQUEST).send({
      endDate: 'Длительность поездки не может превышать 31 день.'
    });
  }
  done();
};

