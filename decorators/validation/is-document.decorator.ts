import { removeDocumentMask, validateDocument } from '@/common/utils/document';
import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsDocument(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isDocument',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: string) {
          return value ? validateDocument(removeDocumentMask(value)) : false;
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a valid CPF (000.000.000-00) or CNPJ (00.000.000/0000-00)`;
        },
      },
    });
  };
}
