import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';
import { UserRoles } from 'src/users/users.model';
export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'John', description: 'The first name of user' })
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Smith', description: 'The last name of user' })
  lastName: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'admin',
    description: 'The role of user',
    enum: UserRoles,
  })
  @IsEnum(UserRoles)
  role: UserRoles;

  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    example: 'emailexample@gmail.com',
    description: 'The Email of user',
  })
  email: string;

  @IsNotEmpty()
  @MinLength(3, { message: 'Password must have at least 6 characters.' })
  @ApiProperty({
    example: 'Password1!',
    description: 'The Password of user',
  })
  password: string;
}
