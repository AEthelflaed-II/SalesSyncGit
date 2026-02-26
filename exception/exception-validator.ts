import { ApplicationError } from '@/common/errors/application.error';
import { ValidationExceptionFactory } from './validation-exception-factory';
import { ValidationError } from 'class-validator';

export const exceptionValidator = (errors: ValidationError[], property?: string) => {
  if (errors?.length) {
    throw new ApplicationError(
      ValidationExceptionFactory(errors, property).getResponse() as ApplicationError,
    );
  }
};
