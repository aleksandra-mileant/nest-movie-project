import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { GenreOfMovies, MoviesModel } from 'src/movies/movies.model';
import { CreateMovieDto } from 'src/movies/dto/create-movie.dto';
import { UpdateMovieDto } from 'src/movies/dto/update-movie.dto';
import { MOVIES_NOT_FOUND_ERROR } from 'src/movies/movies.constants';
import { ReviewModel } from 'src/reviews/reviews.model';
import { PaginatedResultDto } from 'src/common/dto/paginated-result.dto';
import { paginate } from 'src/common/utils/pagination.util';
import { PaginationParamsDto } from 'src/common/dto/pagination-params.dto';

@Injectable()
export class MoviesService {
  constructor(
    @InjectModel(MoviesModel)
    private readonly movieModel: typeof MoviesModel,
  ) {}

  async findAll({
    page,
    limit,
  }: PaginationParamsDto): Promise<PaginatedResultDto<MoviesModel>> {
    return paginate(
      this.movieModel,
      {
        order: [['createdAt', 'DESC']],
        include: [ReviewModel],
      },
      page,
      limit,
    );
  }

  async getOne(id: number): Promise<MoviesModel | null> {
    const movie = await this.movieModel.findOne({
      where: {
        id,
      },
      include: [ReviewModel],
    });

    if (!movie) {
      throw new NotFoundException(MOVIES_NOT_FOUND_ERROR);
    }

    return movie;
  }

  async getByGender(
    genre: GenreOfMovies,
    { page, limit }: PaginationParamsDto,
  ): Promise<PaginatedResultDto<MoviesModel>> {
    return paginate(
      this.movieModel,
      {
        where: { genre },
        include: [ReviewModel],
        order: [['createdAt', 'DESC']],
      },
      page,
      limit,
    );
  }

  async create(createMovieDto: CreateMovieDto): Promise<MoviesModel | null> {
    const newMovie = new MoviesModel(createMovieDto);
    return await newMovie.save();
  }

  async update(
    id: number,
    updateMovieDto: UpdateMovieDto,
  ): Promise<MoviesModel | null> {
    const [numberOfAffectedRows, [updatedMovie]] = await this.movieModel.update(
      updateMovieDto,
      {
        where: { id },
        returning: true,
      },
    );

    if (numberOfAffectedRows === 0) {
      throw new NotFoundException(MOVIES_NOT_FOUND_ERROR);
    }
    return updatedMovie;
  }

  async remove(id: number): Promise<void> {
    const deletedMovie = await this.movieModel.destroy({ where: { id } });

    if (!deletedMovie) {
      throw new NotFoundException(MOVIES_NOT_FOUND_ERROR);
    }
  }
}
