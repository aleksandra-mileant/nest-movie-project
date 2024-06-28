import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UsersModel } from 'src/users/users.model';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): UsersModel => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
