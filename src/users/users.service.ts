import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UserRoles, UsersModel } from 'src/users/users.model';
import { USERS_NOT_FOUND_ERROR } from 'src/users/users.constants';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { genSalt, hash } from 'bcryptjs';
import { ALREADY_REGISTERED_ERROR } from 'src/auth/auth.constants';
import { PaginationParamsDto } from 'src/common/dto/pagination-params.dto';
import { PaginatedResultDto } from 'src/common/dto/paginated-result.dto';
import { paginate } from 'src/common/utils/pagination.util';
import { FileModel } from 'src/files/file.model';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(UsersModel)
    private readonly usersModel: typeof UsersModel,
  ) {}

  async findAll(
    @Query() { page, limit }: PaginationParamsDto,
  ): Promise<PaginatedResultDto<UsersModel>> {
    return paginate(
      this.usersModel,
      {
        attributes: {
          exclude: ['password'],
        },
        order: [['createdAt', 'DESC']],
        include: [FileModel],
      },
      page,
      limit,
    );
  }

  async getOne(id: number): Promise<UsersModel | null> {
    const user = await this.usersModel.findOne({
      where: {
        id,
      },
      attributes: {
        exclude: ['password'],
      },
      include: [FileModel],
    });

    if (!user) {
      throw new NotFoundException(USERS_NOT_FOUND_ERROR);
    }

    return user;
  }

  async getByEmail(email: string): Promise<UsersModel | null> {
    return await this.usersModel.findOne({ where: { email } });
  }

  async getByRole(
    role: UserRoles,
    { page, limit }: PaginationParamsDto,
  ): Promise<PaginatedResultDto<UsersModel>> {
    return paginate(
      this.usersModel,
      {
        where: {
          role,
        },
        attributes: {
          exclude: ['password'],
        },
        order: [['createdAt', 'DESC']],
        include: [FileModel],
      },
      page,
      limit,
    );
  }

  async create(
    createUserDto: CreateUserDto,
  ): Promise<Omit<UsersModel, 'password'>> {
    const salt = await genSalt(10);
    const newUser = new UsersModel({
      firstName: createUserDto.firstName,
      lastName: createUserDto.lastName,
      email: createUserDto.email,
      role: createUserDto.role,
      password: await hash(createUserDto.password, salt),
    });

    const oldUser = await this.getByEmail(createUserDto.email);

    if (oldUser) {
      throw new BadRequestException(ALREADY_REGISTERED_ERROR);
    }

    const savedUser = await newUser.save();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = savedUser.toJSON();

    return userWithoutPassword as Omit<UsersModel, 'password'>;
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<Omit<UsersModel, 'password'> | null> {
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

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = updatedUser.toJSON();

    return userWithoutPassword as Omit<UsersModel, 'password'>;
  }

  async remove(id: number): Promise<void> {
    const deletedUser = await this.usersModel.destroy({ where: { id } });

    if (!deletedUser) {
      throw new NotFoundException(USERS_NOT_FOUND_ERROR);
    }
  }
}
