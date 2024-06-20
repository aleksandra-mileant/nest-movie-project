import { PartialType } from '@nestjs/swagger';
import { CreateMovieDto } from 'src/movies/dto/create-movie.dto';

export class UpdateMovieDto extends PartialType(CreateMovieDto) {}
