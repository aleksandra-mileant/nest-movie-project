import { ApiProperty } from '@nestjs/swagger';
import { UserRoles } from 'src/users/users.model';

export class UserResponceDto {
  @ApiProperty({ example: 1, description: 'The ID of the user' })
  id: number;

  @ApiProperty({ example: 'John', description: 'The first name of user' })
  firstName: string;

  @ApiProperty({ example: 'Smith', description: 'The last name of user' })
  lastName: string;

  @ApiProperty({
    example: 'admin',
    description: 'The role of user',
    enum: UserRoles,
  })
  role: UserRoles;

  @ApiProperty({
    example: 'emailexample@gmail.com',
    description: 'The email of user',
  })
  email: string;

  @ApiProperty({
    example: '2024-06-20T08:57:20.365Z',
    description: 'The creation date of the user record',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2024-06-20T08:57:20.365Z',
    description: 'The last update date of the user record',
  })
  updatedAt: Date;
}
