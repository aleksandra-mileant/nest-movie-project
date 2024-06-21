import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersModel } from 'src/users/users.model';
import { compare } from 'bcryptjs';
import {
  USER_NOT_FOUND_ERROR,
  WRONG_PASSWORD_ERROR,
} from 'src/auth/auth.constants';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<Pick<UsersModel, 'email'>> {
    const user = await this.usersService.getByEmail(email);

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
    // в payload мы передаем данные, которые будут шифроваться в токен
    // можно шифровать не только email и password, хоть всю модель юзера
    const payload = { email };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
