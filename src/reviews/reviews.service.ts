import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ReviewModel } from 'src/reviews/reviews.model';
import { MOVIES_NOT_FOUND_ERROR } from 'src/movies/movies.constants';
import { REVIEW_NOT_FOUND_ERROR } from 'src/reviews/reviews.constants';
import { CreateReviewDto } from 'src/reviews/dto/create-review.dto';
import { UpdateReviewDto } from 'src/reviews/dto/update-review.dto';
import { USERS_NOT_FOUND_ERROR } from 'src/users/users.constants';
import { PaginationParamsDto } from 'src/common/dto/pagination-params.dto';
import { PaginatedResultDto } from 'src/common/dto/paginated-result.dto';
import { paginate } from 'src/common/utils/pagination.util';
import { MoviesService } from 'src/movies/movies.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(ReviewModel)
    private readonly reviewModel: typeof ReviewModel,
    private readonly moviesService: MoviesService,
    private readonly usersService: UsersService,
  ) {}

  async findAll({
    page,
    limit,
  }: PaginationParamsDto): Promise<PaginatedResultDto<ReviewModel>> {
    return paginate(
      this.reviewModel,
      { order: [['createdAt', 'DESC']] },
      page,
      limit,
    );
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

  async getByMovieId(
    movieId: number,
    { page, limit }: PaginationParamsDto,
  ): Promise<PaginatedResultDto<ReviewModel>> {
    return paginate(
      this.reviewModel,
      {
        where: { movieId },
        order: [['createdAt', 'DESC']],
      },
      page,
      limit,
    );
  }

  async getByUserId(
    userId: number,
    { page, limit }: PaginationParamsDto,
  ): Promise<PaginatedResultDto<ReviewModel>> {
    return paginate(
      this.reviewModel,
      {
        where: { userId },
        order: [['createdAt', 'DESC']],
      },
      page,
      limit,
    );
  }

  async create(createReviewDto: CreateReviewDto): Promise<ReviewModel | null> {
    const movie = await this.moviesService.getOne(createReviewDto.movieId);

    if (!movie) {
      throw new NotFoundException(MOVIES_NOT_FOUND_ERROR);
    }

    const user = await this.usersService.getOne(createReviewDto.userId);

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
