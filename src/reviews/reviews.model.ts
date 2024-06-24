import {
  Column,
  ForeignKey,
  Model,
  Table,
  BelongsTo,
} from 'sequelize-typescript';
import { UsersModel } from 'src/users/users.model';
import { MoviesModel } from 'src/movies/movies.model';

@Table
export class ReviewModel extends Model<ReviewModel> {
  @Column
  content: string;

  @Column
  rating: number;

  // Этот столбец userId является внешним ключом, который указывает на идентификатор пользователя, связанного с этим отзывом.
  @ForeignKey(() => UsersModel)
  @Column
  userId: number;

  @ForeignKey(() => MoviesModel)
  @Column
  movieId: number;

  // Указывает на то, что каждый отзыв принадлежит одному пользователю.
  @BelongsTo(() => UsersModel)
  user: UsersModel;

  @BelongsTo(() => MoviesModel)
  movie: MoviesModel;
}
