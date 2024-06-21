import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// https://jwt.io/
// https://docs.nestjs.com/recipes/passport

// В NestJS перед приватным роутером ставятся guard, которые позволяют проверить
// авторизационные данные и пропуписть дальше в случае, если все хорошо либо выдать ошибку

// Агоритм шифрования - хедер + payload (наши данные) + jwt секрет
// JwtGuard Проверяет правильность заполениня валидации JWT
@Injectable()
export class JwtGuard extends AuthGuard('jwt') {}
