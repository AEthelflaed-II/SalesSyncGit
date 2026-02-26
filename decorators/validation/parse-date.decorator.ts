import { Transform } from 'class-transformer';

export const ParseDate = () => {
  return Transform(({ value }) => {
    if (Number.isNaN(Date.parse(value))) {
      return value;
    }

    return new Date(value);
  });
};
