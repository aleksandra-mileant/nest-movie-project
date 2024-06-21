import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from 'src/users/users.service';
import { UserRoles, UsersModel } from 'src/users/users.model';
import { UserResponceDto } from 'src/users/dto/user-responce.dto';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all users or filter by role' })
  @ApiQuery({ name: 'role', required: false, enum: UserRoles })
  @ApiResponse({
    status: 200,
    description: 'Return all users or users with the specified role.',
    type: UserResponceDto,
    isArray: true,
  })
  async findAll(@Query('role') role?: UserRoles): Promise<UsersModel[]> {
    if (role) {
      return this.userService.getByRole(role);
    }
    return this.userService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a user by id' })
  @ApiResponse({
    status: 200,
    description: 'Return a user.',
    type: UserResponceDto,
  })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<UsersModel | null> {
    return this.userService.getOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a user by id' })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully updated.',
    type: UserResponceDto,
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<Omit<UsersModel, 'password'> | null> {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user by id' })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully deleted.',
  })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.userService.remove(id);
  }
}
