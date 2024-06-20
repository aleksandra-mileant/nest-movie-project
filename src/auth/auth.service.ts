import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersModel } from 'src/users/users.model';
import { compare, genSalt, hash } from 'bcryptjs';
import {
  ALREADY_REGISTERED_ERROR,
  USER_NOT_FOUND_ERROR,
  WRONG_PASSWORD_ERROR,
} from 'src/auth/auth.constants';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(UsersModel)
    private readonly usersModel: typeof UsersModel,
    private readonly jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<UsersModel | null> {
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

    return await newUser.save();
  }

  async getByEmail(email: string): Promise<UsersModel | null> {
    return await this.usersModel.findOne({ where: { email } });
  }

  async validateUser(
    email: string,
    password: string,
  ): Promise<Pick<UsersModel, 'email'>> {
    const user = await this.getByEmail(email);

    if (!user) {
      throw new UnauthorizedException(USER_NOT_FOUND_ERROR);
    }
    const isCorrectedPassword = await compare(password, user.password);

    if (!isCorrectedPassword) {
      throw new UnauthorizedException(WRONG_PASSWORD_ERROR);
    }

    return { email: user.email };
  }

  async login(email: string): Promise<{ access_token: string }> {
    const payload = { email };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
