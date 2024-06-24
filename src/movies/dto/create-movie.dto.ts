import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';
import { GenreOfMovies } from 'src/movies/movies.model';
import { Transform } from 'class-transformer';

export class CreateMovieDto {
  @IsString()
  @MinLength(2, { message: 'Title must have at least 2 characters.' })
  @IsNotEmpty()
  @ApiProperty({ example: 'Inception', description: 'The title of the movie' })
  title: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3, { message: 'Description must have at least 3 characters.' })
  @ApiProperty({
    example: 'Description of the movie',
    description: 'The description of the movie',
  })
  description: string;

  @IsNotEmpty()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  @ApiProperty({
    example: '2010-07-16',
    description: 'The release date of the movie',
  })
  releaseDate: Date;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'adventure',
    description: 'The genre of the movie',
    enum: GenreOfMovies,
  })
  @IsEnum(GenreOfMovies)
  genre: GenreOfMovies;
}
