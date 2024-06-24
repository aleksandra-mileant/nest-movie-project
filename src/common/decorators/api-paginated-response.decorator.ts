import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { PaginatedResultDto } from 'src/common/dto/paginated-result.dto';

export const ApiPaginatedResponse = <TModel extends Type<unknown>>(
  model: TModel,
  description: string,
) => {
  return applyDecorators(
    ApiExtraModels(PaginatedResultDto, model),
    ApiOkResponse({
      description,
      schema: {
        allOf: [
          { $ref: getSchemaPath(PaginatedResultDto) },
          {
            properties: {
              data: {
                type: 'array',
                items: { $ref: getSchemaPath(model) },
              },
            },
          },
        ],
      },
    }),
  );
};
