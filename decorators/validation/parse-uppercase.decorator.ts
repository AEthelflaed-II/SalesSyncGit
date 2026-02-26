import { Transform } from 'class-transformer';

export const ParseUppercase = () => {
  return Transform(({ value }) => {
    return value ? value.toUpperCase() : value;
  });
};
