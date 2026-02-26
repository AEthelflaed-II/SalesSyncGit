import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsValidPagination(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isValidPagination',
      target: object.constructor,
      propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value) {
          return value.canPaginate();
        },
        defaultMessage() {
          return (
            (validationOptions?.message &&
              typeof validationOptions.message === 'string' &&
              validationOptions.message) ||
            'Configuração de paginação inválida'
          );
        },
      },
    });
  };
}
