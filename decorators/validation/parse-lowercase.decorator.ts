import { Transform } from 'class-transformer';

export const ParseLowercase = () => {
  return Transform(({ value }) => {
    return value ? value.toLowerCase() : value;
  });
};
