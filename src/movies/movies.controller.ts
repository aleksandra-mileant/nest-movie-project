import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { MoviesService } from './movies.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBadRequestResponse,
  ApiParam,
} from '@nestjs/swagger';
import { GenreOfMovies, MoviesModel } from 'src/movies/movies.model';
import { CreateMovieDto } from 'src/movies/dto/create-movie.dto';
import { UpdateMovieDto } from 'src/movies/dto/update-movie.dto';
import { MovieResponseDto } from 'src/movies/dto/movie-response.dto';
import { UserRoles } from 'src/users/users.model';
import { JwtGuard } from 'src/auth/quards/jwt.guard';

@ApiTags('movies')
@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all movies' })
  @ApiResponse({
    status: 200,
    description: 'Return all movies.',
    type: MovieResponseDto,
    isArray: true,
  })
  @ApiBadRequestResponse({ description: 'Something went wrong, try again.' })
  async findAll(): Promise<MoviesModel[]> {
    return this.moviesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a movie by id' })
  @ApiResponse({
    status: 200,
    description: 'Return a movie.',
    type: MovieResponseDto,
  })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<MoviesModel | null> {
    return this.moviesService.getOne(id);
  }

  @Get('/genre/:genre')
  @ApiParam({ name: 'genre', required: true, enum: UserRoles })
  @ApiOperation({ summary: 'Get movies by genre' })
  @ApiResponse({
    status: 200,
    description: 'Return movies with the specified genre.',
    type: MovieResponseDto,
    isArray: true,
  })
  async findByGenre(
    @Param('genre') genre: GenreOfMovies,
  ): Promise<MoviesModel[] | []> {
    return this.moviesService.getByGender(genre);
  }

  @Post()
  @ApiOperation({ summary: 'Create a movie' })
  @ApiResponse({
    status: 201,
    description: 'The movie has been successfully created.',
    type: MovieResponseDto,
  })
  async create(
    @Body() createMovieDto: CreateMovieDto,
  ): Promise<MoviesModel | null> {
    return this.moviesService.create(createMovieDto);
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Update a movie by id' })
  @ApiResponse({
    status: 200,
    description: 'The movie has been successfully updated.',
    type: MovieResponseDto,
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMovieDto: UpdateMovieDto,
  ): Promise<MoviesModel | null> {
    return this.moviesService.update(id, updateMovieDto);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a movie by id' })
  @ApiResponse({
    status: 200,
    description: 'The movie has been successfully deleted.',
  })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.moviesService.remove(id);
  }
}
