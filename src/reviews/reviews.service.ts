import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ReviewModel } from 'src/reviews/reviews.model';
import { MOVIES_NOT_FOUND_ERROR } from 'src/movies/movies.constants';
import { REVIEW_NOT_FOUND_ERROR } from 'src/reviews/reviews.constants';
import { CreateReviewDto } from 'src/reviews/dto/create-review.dto';
import { UpdateReviewDto } from 'src/reviews/dto/update-review.dto';
import { MoviesModel } from 'src/movies/movies.model';
import { UsersModel } from 'src/users/users.model';
import { USERS_NOT_FOUND_ERROR } from 'src/users/users.constants';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(ReviewModel)
    private readonly reviewModel: typeof ReviewModel,
    @InjectModel(MoviesModel)
    private readonly movieModel: typeof MoviesModel,
    @InjectModel(UsersModel)
    private readonly usersModel: typeof UsersModel,
  ) {}

  async findAll(): Promise<ReviewModel[]> {
    return this.reviewModel.findAll({
      order: [['createdAt', 'DESC']],
    });
  }

  async getOne(id: number): Promise<ReviewModel | null> {
    const review = await this.reviewModel.findOne({
      where: {
        id,
      },
    });

    if (!review) {
      throw new NotFoundException(REVIEW_NOT_FOUND_ERROR);
    }

    return review;
  }

  async getByMovieId(movieId: number): Promise<ReviewModel[]> {
    return this.reviewModel.findAll({
      where: {
        movieId,
      },
      order: [['createdAt', 'DESC']],
    });
  }

  async getByUserId(userId: number): Promise<ReviewModel[]> {
    return this.reviewModel.findAll({
      where: {
        userId,
      },
      order: [['createdAt', 'DESC']],
    });
  }

  async create(createReviewDto: CreateReviewDto): Promise<ReviewModel | null> {
    const movie = await this.movieModel.findByPk(createReviewDto.movieId);

    if (!movie) {
      throw new NotFoundException(MOVIES_NOT_FOUND_ERROR);
    }

    const user = await this.usersModel.findByPk(createReviewDto.userId);

    if (!user) {
      throw new NotFoundException(USERS_NOT_FOUND_ERROR);
    }

    const newReview = new ReviewModel(createReviewDto);
    return await newReview.save();
  }

  async update(
    id: number,
    updateReviewDto: UpdateReviewDto,
  ): Promise<ReviewModel | null> {
    const [numberOfAffectedRows, [updatedReview]] =
      await this.reviewModel.update(updateReviewDto, {
        where: { id },
        returning: true,
      });

    if (numberOfAffectedRows === 0) {
      throw new NotFoundException(MOVIES_NOT_FOUND_ERROR);
    }
    return updatedReview;
  }

  async remove(id: number): Promise<void> {
    const deletedReview = await this.reviewModel.destroy({ where: { id } });

    if (!deletedReview) {
      throw new NotFoundException(REVIEW_NOT_FOUND_ERROR);
    }
  }
}
