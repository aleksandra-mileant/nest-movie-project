import { Column, DataType, Model, Table, HasMany } from 'sequelize-typescript';
import { ReviewModel } from 'src/reviews/reviews.model';

export enum GenreOfMovies {
  Action = 'action',
  Adventure = 'adventure',
  Comedy = 'comedy',
  Crime = 'crime',
  Drama = 'drama',
  Epics = 'epics',
  Horror = 'horror',
  Romance = 'romance',
  Musical = 'musical',
}
@Table
export class MoviesModel extends Model<MoviesModel> {
  @Column
  title: string;

  @Column
  description: string;

  @Column
  releaseDate: Date;

  @Column({
    type: DataType.ENUM(...Object.values(GenreOfMovies)),
    allowNull: false,
  })
  genre: GenreOfMovies;

  // один фильм может иметь множество отзывов.
  @HasMany(() => ReviewModel)
  reviews: ReviewModel[];
}
