import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MoviesModule } from './movies/movies.module';
import { ConfigModule } from '@nestjs/config';
import { ServerConfig } from 'src/configs/server.config';
import { MoviesModel } from 'src/movies/movies.model';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { UsersModel } from 'src/users/users.model';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: ServerConfig.validate,
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT) || 5432,
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      autoLoadModels: true,
      synchronize: true,
      models: [MoviesModel, UsersModel],
    }),
    MoviesModule,
    AuthModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
