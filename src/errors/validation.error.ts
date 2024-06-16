import { FastifySchemaValidationError } from 'fastify/types/schema';
import { StatusCodes } from '../utils/constants';

export default class ValidationError extends Error {
  public httpStatusCode!: number;
  public details: FastifySchemaValidationError[] = [];

  constructor(message: string, details: FastifySchemaValidationError[]) {
    super(message);

    this.httpStatusCode = StatusCodes.BAD_REQUEST;
    this.message = message;
    this.details = details;
  }
}
