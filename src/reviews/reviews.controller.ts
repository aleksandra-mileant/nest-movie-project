import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ReviewsService } from 'src/reviews/reviews.service';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ReviewModel } from 'src/reviews/reviews.model';
import { CreateReviewDto } from 'src/reviews/dto/create-review.dto';
import { UpdateReviewDto } from 'src/reviews/dto/update-review.dto';
import { ReviewResponseDto } from 'src/reviews/dto/review-response.dto';
import { PaginationParamsDto } from 'src/common/dto/pagination-params.dto';
import { PaginatedResultDto } from 'src/common/dto/paginated-result.dto';
import { ApiPaginatedResponse } from 'src/common/decorators/api-paginated-response.decorator';
import { JwtGuard } from 'src/auth/quards/jwt.guard';
import { TelegramService } from 'src/telegram/telegram.service';

@ApiTags('reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(
    private readonly reviewsService: ReviewsService,
    private readonly telegramService: TelegramService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all reviews' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiPaginatedResponse(ReviewResponseDto, 'Return all reviews.')
  async findAll(
    @Query() { page, limit }: PaginationParamsDto,
  ): Promise<PaginatedResultDto<ReviewModel>> {
    return this.reviewsService.findAll({ page, limit });
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
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiPaginatedResponse(
    ReviewResponseDto,
    'Return reviews for a specific movie.',
  )
  async findByMovieId(
    @Param('movieId', ParseIntPipe) movieId: number,
    @Query() { page, limit }: PaginationParamsDto,
  ): Promise<PaginatedResultDto<ReviewModel>> {
    return this.reviewsService.getByMovieId(movieId, { page, limit });
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get reviews by user id' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiPaginatedResponse(
    ReviewResponseDto,
    'Return reviews for a specific user.',
  )
  async findByUserId(
    @Param('userId', ParseIntPipe) userId: number,
    @Query() { page, limit }: PaginationParamsDto,
  ): Promise<PaginatedResultDto<ReviewModel>> {
    return this.reviewsService.getByUserId(userId, { page, limit });
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

  @Post('notify')
  @ApiOperation({ summary: 'Send a notification' })
  async notify(@Body() createReviewDto: CreateReviewDto): Promise<void> {
    const message =
      `Content: ${createReviewDto.content} ` +
      `With rating: ${createReviewDto.rating} ` +
      `For ${createReviewDto.movieId} movie ` +
      `From ${createReviewDto.userId} user`;
    return this.telegramService.sendMessage(message);
  }

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

  @UseGuards(JwtGuard)
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
