import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateReviewDto } from 'src/reviews/dto/create-review.dto';
export class UpdateReviewDto extends PartialType(
  OmitType(CreateReviewDto, ['movieId', 'userId' as const]),
) {}
