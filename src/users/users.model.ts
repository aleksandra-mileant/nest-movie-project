import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { ReviewModel } from 'src/reviews/reviews.model';
import { FileModel } from 'src/files/file.model';

export enum UserRoles {
  Admin = 'admin',
  Guest = 'guest',
}

@Table
export class UsersModel extends Model<UsersModel> {
  @Column
  firstName: string;

  @Column
  lastName: string;

  @Column
  email: string;

  @Column
  password: string;

  @Column({
    type: DataType.ENUM(...Object.values(UserRoles)),
    allowNull: false,
  })
  role: UserRoles;

  @HasMany(() => ReviewModel)
  reviews: ReviewModel[];

  @HasMany(() => FileModel)
  files: FileModel[];
}
