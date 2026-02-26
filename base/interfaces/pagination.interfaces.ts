import { IsOptional, Min, ValidateIf } from 'class-validator';
import { IsValidPagination } from '@/infra/decorators/validation/is-valid-pagination';
import { ParseInteger } from '@/infra/decorators/validation/parse-integer.decorator';

export class PaginationOptions {
  page?: number;
  limit?: number;

  public canPaginate() {
    return (
      (this.page && this.page > 0 && this.limit && this.limit > 0) ||
      (this.limit > 0 && !this.page)
    );
  }

  public build() {
    return {
      skip:
        this.page > 0 && this.limit > 0
          ? (this.page - 1) * this.limit
          : undefined,
      take: this.limit,
    };
  }
}
export class ListBase {
  @IsOptional()
  search?: string;

  @IsOptional()
  @ParseInteger()
  @Min(1)
  private page?: number;

  @IsOptional()
  @ParseInteger()
  @Min(1)
  private limit?: number;

  @ValidateIf((object: ListBase, value: PaginationOptions) => {
    value.page = object.page;
    value.limit = object.limit;
    delete object.page;
    delete object.limit;
    return value.canPaginate();
  })
  @IsValidPagination()
  pagination: PaginationOptions = new PaginationOptions();

  public canFilter() {
    return Object.keys(this).some((key) => this[key]);
  }
}

export interface IPaginationResultOptions {
  totalRecords: number;
  totalPages?: number;
  pageNumber?: number;
  pageSize?: number;
}

export class PaginationResult<T> {
  totalRecords: number;
  totalPages?: number;
  pageNumber?: number;
  pageSize?: number;
  nextPage?: string;
  previousPage?: string;
  data: T[];

  constructor(data: T[], options: IPaginationResultOptions) {
    this.totalRecords = options.totalRecords;

    if (options.pageNumber && options.pageSize) {
      this.totalRecords = options.totalRecords;
      this.totalPages = options.totalPages;
      this.pageNumber = options.pageNumber;
      this.pageSize = options.pageSize;
      this.nextPage = `page=${options.pageNumber + 1}&limit=${options.pageSize}`;
      this.previousPage =
        options.pageNumber > 1
          ? `page=${options.pageNumber - 1}&limit=${options.pageSize}`
          : undefined;
    }

    this.data = data;
  }
}
