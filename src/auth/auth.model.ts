import { Column, Model, Table } from 'sequelize-typescript';

@Table
export class AuthModel extends Model<AuthModel> {
  @Column
  email: string;

  @Column
  password: string;
}
