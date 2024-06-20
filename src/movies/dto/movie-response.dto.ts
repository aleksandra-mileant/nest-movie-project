import { ApiProperty } from '@nestjs/swagger';
import { GenreOfMovies } from 'src/movies/movies.model';

export class MovieResponseDto {
  @ApiProperty({ example: 1, description: 'The ID of the movie' })
  id: number;

  @ApiProperty({ example: 'Inception', description: 'The title of the movie' })
  title: string;

  @ApiProperty({
    example: 'description',
    description: 'The description of the movie',
  })
  description: string;

  @ApiProperty({
    example: '2010-07-16',
    description: 'The release date of the movie',
  })
  releaseDate: string;

  @ApiProperty({
    example: 'adventure',
    description: 'The genre of the movie',
    enum: GenreOfMovies,
  })
  genre: GenreOfMovies;

  @ApiProperty({
    example: '2024-06-20T08:57:20.365Z',
    description: 'The creation date of the movie record',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2024-06-20T08:57:20.365Z',
    description: 'The last update date of the movie record',
  })
  updatedAt: Date;
}
