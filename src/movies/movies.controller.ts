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
  Query,
} from '@nestjs/common';
import { MoviesService } from './movies.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBadRequestResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { GenreOfMovies, MoviesModel } from 'src/movies/movies.model';
import { CreateMovieDto } from 'src/movies/dto/create-movie.dto';
import { UpdateMovieDto } from 'src/movies/dto/update-movie.dto';
import { MovieResponseDto } from 'src/movies/dto/movie-response.dto';
import { UserRoles } from 'src/users/users.model';
import { JwtGuard } from 'src/auth/quards/jwt.guard';
import { PaginationParamsDto } from 'src/common/dto/pagination-params.dto';
import { PaginatedResultDto } from 'src/common/dto/paginated-result.dto';
import { ApiPaginatedResponse } from 'src/common/decorators/api-paginated-response.decorator';

@ApiTags('movies')
@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all movies' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiPaginatedResponse(MovieResponseDto, 'Return all movies.')
  @ApiBadRequestResponse({ description: 'Something went wrong, try again.' })
  async findAll(
    @Query() { page, limit }: PaginationParamsDto,
  ): Promise<PaginatedResultDto<MoviesModel>> {
    return this.moviesService.findAll({ page, limit });
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
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiOperation({ summary: 'Get movies by genre' })
  @ApiPaginatedResponse(
    MovieResponseDto,
    'Return movies with the specified genre.',
  )
  async findByGenre(
    @Param('genre') genre: GenreOfMovies,
    @Query() { page, limit }: PaginationParamsDto,
  ): Promise<PaginatedResultDto<MoviesModel>> {
    return this.moviesService.getByGender(genre, { page, limit });
  }

  @Get('/search')
  @ApiOperation({ summary: 'Search movies by title' })
  @ApiQuery({ name: 'title', required: true, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiPaginatedResponse(MovieResponseDto, 'Return movies by title.')
  async searchByTitle(
    @Query('title') title: string,
    @Query() { page, limit }: PaginationParamsDto,
  ): Promise<PaginatedResultDto<MoviesModel>> {
    return this.moviesService.searchByTitle(title, { page, limit });
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
