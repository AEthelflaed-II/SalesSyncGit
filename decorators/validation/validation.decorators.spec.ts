import { PaginationOptions } from '@/app/base/interfaces/crud-options.interfaces';
import { IsValidPagination } from '@/infra/decorators/validation/is-valid-pagination';
import { validate } from 'class-validator';

describe('Decorator::Validation', () => {
  class Test {
    @IsValidPagination()
    pagination: PaginationOptions = new PaginationOptions();
  }

  const test = new Test();

  it("should throw an error if isn't a valid pagination", async () => {
    test.pagination.page = 0;
    test.pagination.limit = 0;

    const errors = await validate(test);
    expect(errors.length).toBe(1);
  });

  it('should not throw an error if is a valid pagination', async () => {
    test.pagination.page = 1;
    test.pagination.limit = 10;

    const errors = await validate(test);
    expect(errors.length).toBe(0);
  });
});
