import { ApiProperty } from '@nestjs/swagger';

export class ReviewResponseDto {
  @ApiProperty({ example: 1, description: 'The ID of the review' })
  id: number;

  @ApiProperty({
    example: 'Great movie!',
    description: 'The content of the review',
  })
  content: string;

  @ApiProperty({ example: 5, description: 'The rating of the movie' })
  rating: number;

  @ApiProperty({
    example: 1,
    description: 'The ID of the user who created the review',
  })
  userId: number;

  @ApiProperty({ example: 1, description: 'The ID of the reviewed movie' })
  movieId: number;

  @ApiProperty({
    example: '2024-06-21T12:34:56.789Z',
    description: 'The date the review was created',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2024-06-21T12:34:56.789Z',
    description: 'The date the review was last updated',
  })
  updatedAt: Date;
}
