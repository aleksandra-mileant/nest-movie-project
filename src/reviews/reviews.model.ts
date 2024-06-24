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

  @ForeignKey(() => UsersModel)
  @Column
  userId: number;

  @ForeignKey(() => MoviesModel)
  @Column
  movieId: number;

  @BelongsTo(() => UsersModel)
  user: UsersModel;

  @BelongsTo(() => MoviesModel)
  movie: MoviesModel;
}
