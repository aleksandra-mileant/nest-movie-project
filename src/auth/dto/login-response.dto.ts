import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseDto {
  @ApiProperty({
    example: 'access_token',
    description: 'The access token of the user',
  })
  access_token: string;
}
