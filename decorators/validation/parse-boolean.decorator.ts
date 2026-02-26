import { Transform } from 'class-transformer';

export const ParseBoolean = () => {
  return Transform(({ value }) => {
    if (value !== 'true' && value !== 'false') {
      return value;
    }
    return value === 'true';
  });
};
