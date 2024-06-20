import { Column, DataType, Model, Table } from 'sequelize-typescript';

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
}
