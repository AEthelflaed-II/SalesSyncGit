import { Transform } from 'class-transformer';

export const ParseString = (options?: { each: boolean }) => {
  return Transform(({ value }) => {
    if (options?.each) {
      const values: string[] = value.split(',');
      return values.map((value) => {
        if (typeof value !== 'string') {
          return value;
        }

        return value.trim();
      });
    }

    if (typeof value !== 'string') {
      return value;
    }

    return value.trim();
  });
};
