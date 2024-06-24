import { IsNotEmpty, IsInt, IsString, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReviewDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'Great movie!',
    description: 'The content of the review',
  })
  content: string;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(5)
  @ApiProperty({
    example: 5,
    description: 'The rating of the movie',
  })
  rating: number;

  @IsNotEmpty()
  @IsInt()
  @ApiProperty({
    example: 1,
    description: 'The id of the movie',
  })
  movieId: number;

  @IsNotEmpty()
  @IsInt()
  @ApiProperty({
    example: 12,
    description: 'The id of the user',
  })
  userId: number;
}
