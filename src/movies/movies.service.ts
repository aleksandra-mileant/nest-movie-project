import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { GenreOfMovies, MoviesModel } from 'src/movies/movies.model';
import { CreateMovieDto } from 'src/movies/dto/create-movie.dto';
import { UpdateMovieDto } from 'src/movies/dto/update-movie.dto';
import {
  MOVIES_BY_GENRE_NOT_FOUND_ERROR,
  MOVIES_NOT_FOUND_ERROR,
} from 'src/movies/movies.constants';

@Injectable()
export class MoviesService {
  constructor(
    @InjectModel(MoviesModel)
    private readonly movieModel: typeof MoviesModel,
  ) {}

  async findAll(): Promise<MoviesModel[]> {
    return this.movieModel.findAll();
  }

  async getOne(id: number): Promise<MoviesModel | null> {
    const movie = await this.movieModel.findOne({
      where: {
        id,
      },
    });

    if (!movie) {
      throw new NotFoundException(MOVIES_NOT_FOUND_ERROR);
    }

    return movie;
  }

  async getByGender(genre: GenreOfMovies): Promise<MoviesModel[] | []> {
    const movies = await this.movieModel.findAll({
      where: {
        genre,
      },
    });

    if (movies.length === 0) {
      throw new NotFoundException(MOVIES_BY_GENRE_NOT_FOUND_ERROR);
    }

    return movies;
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
