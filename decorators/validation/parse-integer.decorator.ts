import { Transform } from 'class-transformer';

export const ParseInteger = (options?: { each: boolean }) => {
  return Transform(({ value }) => {
    if (options?.each) {
      const values: string[] = value.split(',');
      return values.map((value) => {
        if (Number.isNaN(Number(value))) {
          return value;
        }

        return Number(value);
      });
    }

    if (Number.isNaN(Number(value))) {
      return value;
    }

    return Number(value);
  });
};
