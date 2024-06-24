import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ReviewsService } from 'src/reviews/reviews.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ReviewModel } from 'src/reviews/reviews.model';
import { CreateReviewDto } from 'src/reviews/dto/create-review.dto';
import { UpdateReviewDto } from 'src/reviews/dto/update-review.dto';
import { ReviewResponseDto } from 'src/reviews/dto/review-response.dto';

@ApiTags('reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all reviews' })
  @ApiResponse({
    status: 200,
    description: 'Return all reviews.',
    type: ReviewResponseDto,
    isArray: true,
  })
  async findAll(): Promise<ReviewModel[]> {
    return this.reviewsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a review by id' })
  @ApiResponse({
    status: 200,
    description: 'Return a review.',
    type: ReviewResponseDto,
  })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ReviewModel | null> {
    return this.reviewsService.getOne(id);
  }

  @Get('movie/:movieId')
  @ApiOperation({ summary: 'Get reviews by movie id' })
  @ApiResponse({
    status: 200,
    description: 'Return reviews for a specific movie.',
    type: ReviewResponseDto,
    isArray: true,
  })
  async findByMovieId(
    @Param('movieId', ParseIntPipe) movieId: number,
  ): Promise<ReviewModel[]> {
    return this.reviewsService.getByMovieId(movieId);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get reviews by user id' })
  @ApiResponse({
    status: 200,
    description: 'Return reviews for a specific user.',
    type: ReviewResponseDto,
    isArray: true,
  })
  async findByUserId(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<ReviewModel[]> {
    return this.reviewsService.getByUserId(userId);
  }

  @Post()
  @ApiOperation({ summary: 'Create a review' })
  @ApiResponse({
    status: 201,
    description: 'The review has been successfully created.',
    type: ReviewResponseDto,
  })
  async create(
    @Body() createReviewDto: CreateReviewDto,
  ): Promise<ReviewModel | null> {
    return this.reviewsService.create(createReviewDto);
  }

  // @UseGuards(JwtGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Update a review by id' })
  @ApiResponse({
    status: 200,
    description: 'The review has been successfully updated.',
    type: ReviewResponseDto,
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateReviewDto: UpdateReviewDto,
  ): Promise<ReviewModel | null> {
    return this.reviewsService.update(id, updateReviewDto);
  }

  // @UseGuards(JwtGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a review by id' })
  @ApiResponse({
    status: 200,
    description: 'The review has been successfully deleted.',
  })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.reviewsService.remove(id);
  }
}
