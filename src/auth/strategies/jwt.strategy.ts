import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UserRoles } from 'src/users/users.model';

// https://docs.nestjs.com/recipes/passport

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      // передаем в качестве Bearer
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(payload: {
    email: string;
    id: any;
    role: UserRoles;
  }): Promise<{ email: string; id: any; role: UserRoles }> {
    return payload; // Return the entire payload
  }
}
