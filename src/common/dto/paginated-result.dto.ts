import { ApiProperty } from '@nestjs/swagger';

export class PaginatedResultDto<T> {
  @ApiProperty({
    description: 'The data rows of the current page',
    isArray: true,
    type: Object, // Swagger does not support generics, this will just indicate it's an array of objects
  })
  data: T[];

  @ApiProperty({ example: 1, description: 'Total number of pages' })
  totalPages: number;

  @ApiProperty({ example: 1, description: 'Number of items per page' })
  itemsPerPage: number;

  @ApiProperty({ example: 1, description: 'Total count of the records' })
  count: number;
}
