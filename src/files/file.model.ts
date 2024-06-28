import { Column, ForeignKey, Model, Table } from 'sequelize-typescript';
import { UsersModel } from 'src/users/users.model';

@Table
export class FileModel extends Model<FileModel> {
  @Column
  originalname: string;

  @Column
  mimetype: string;

  @Column
  filename: string;

  @Column
  path: string;

  @ForeignKey(() => UsersModel)
  @Column
  userId: number;
}
