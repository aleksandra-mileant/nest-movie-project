import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserResponceDto } from 'src/users/dto/user-responce.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersModel } from 'src/users/users.model';
import { LoginResponseDto } from 'src/auth/dto/login-response.dto';
import { AuthDto } from 'src/auth/dto/auth.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully registered.',
    type: UserResponceDto,
  })
  async register(
    @Body() createUserDto: CreateUserDto,
  ): Promise<UsersModel | null> {
    return this.authService.register(createUserDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login' })
  @ApiResponse({
    status: 200,
    description: 'The user has successfully logged in.',
    type: LoginResponseDto,
  })
  async login(@Body() authDto: AuthDto): Promise<{ access_token: string }> {
    const user = await this.authService.validateUser(
      authDto.email,
      authDto.password,
    );
    return this.authService.login(user.email);
  }
}
