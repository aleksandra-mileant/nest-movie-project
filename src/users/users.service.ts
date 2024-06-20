import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UserRoles, UsersModel } from 'src/users/users.model';
import { USERS_NOT_FOUND_ERROR } from 'src/users/users.constants';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(UsersModel)
    private readonly usersModel: typeof UsersModel,
  ) {}

  async findAll(): Promise<UsersModel[]> {
    return this.usersModel.findAll();
  }

  async getOne(id: number): Promise<UsersModel | null> {
    const user = await this.usersModel.findOne({
      where: {
        id,
      },
    });

    if (!user) {
      throw new NotFoundException(USERS_NOT_FOUND_ERROR);
    }

    return user;
  }

  async getByRole(role: UserRoles): Promise<UsersModel[] | []> {
    return this.usersModel.findAll({
      where: {
        role,
      },
    });
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<UsersModel | null> {
    const [numberOfAffectedRows, [updatedUser]] = await this.usersModel.update(
      updateUserDto,
      {
        where: { id },
        returning: true,
      },
    );

    if (numberOfAffectedRows === 0) {
      throw new NotFoundException(USERS_NOT_FOUND_ERROR);
    }
    return updatedUser;
  }

  async remove(id: number): Promise<void> {
    const deletedUser = await this.usersModel.destroy({ where: { id } });

    if (!deletedUser) {
      throw new NotFoundException(USERS_NOT_FOUND_ERROR);
    }
  }
}
