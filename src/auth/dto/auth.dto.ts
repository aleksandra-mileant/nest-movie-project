import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class AuthDto {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    example: 'exapmleemail@gmail.com',
    description: 'The email of the user',
  })
  email: string;

  @IsNotEmpty()
  @MinLength(3, { message: 'Password must have at least 6 characters.' })
  @ApiProperty({
    example: 'Password1!',
    description: 'The password of the user',
  })
  password: string;
}
