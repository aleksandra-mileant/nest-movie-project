import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { ReviewModel } from 'src/reviews/reviews.model';
import { UsersModel } from 'src/users/users.model';
import { MoviesModel } from 'src/movies/movies.model';

@Module({
  imports: [SequelizeModule.forFeature([ReviewModel, UsersModel, MoviesModel])],
  providers: [ReviewsService],
  controllers: [ReviewsController],
})
export class ReviewsModule {}
