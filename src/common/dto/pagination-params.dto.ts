import { IsInt, Min } from 'class-validator';

export class PaginationParamsDto {
  @IsInt()
  @Min(1)
  page: number = 1;

  @IsInt()
  @Min(1)
  limit: number = 10;
}
