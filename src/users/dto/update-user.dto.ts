import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
export class UpdateUserDto extends PartialType(
  OmitType(CreateUserDto, ['password' as const]),
) {}
