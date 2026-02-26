import { removeDocumentMask, validateCPF } from '@/common/utils/document';
import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsCPF(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isCPF',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: string) {
          return value ? validateCPF(removeDocumentMask(value)) : false;
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a valid CPF (000.000.000-00)`;
        },
      },
    });
  };
}
