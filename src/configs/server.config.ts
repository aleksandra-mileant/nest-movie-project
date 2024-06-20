import { IsInt, IsString, validateSync } from 'class-validator';
import { plainToInstance } from 'class-transformer';

export class ServerConfig {
  static validate(config: Record<string, unknown>) {
    const validatedConfig = plainToInstance(ServerConfig, config, {
      enableImplicitConversion: true,
    });
    const errors = validateSync(validatedConfig, {
      skipMissingProperties: false,
    });

    if (errors.length > 0) {
      throw new Error(errors.toString());
    }
    return validatedConfig;
  }

  @IsInt()
  APPLICATION_PORT: number;

  @IsString()
  DATABASE_HOST: string;

  @IsInt()
  DATABASE_PORT: number;

  @IsString()
  DATABASE_NAME: string;

  @IsString()
  DATABASE_USER: string;

  @IsString()
  DATABASE_PASSWORD: string;
}
