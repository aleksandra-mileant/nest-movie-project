import { FindAndCountOptions, Model, ModelCtor } from 'sequelize';
import { PaginatedResultDto } from '../dto/paginated-result.dto';

export async function paginate<T extends Model>(
  model: ModelCtor<T>,
  options: FindAndCountOptions,
  page: number,
  limit: number,
): Promise<PaginatedResultDto<T>> {
  const offset = (page - 1) * limit;
  const { count, rows } = await model.findAndCountAll({
    ...options,
    limit,
    offset,
  });

  const totalPages = Math.ceil(count / limit);

  return {
    data: rows,
    totalPages,
    itemsPerPage: limit,
    count,
  };
}
