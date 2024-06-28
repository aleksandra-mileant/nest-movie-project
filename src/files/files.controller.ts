import {
  Controller,
  HttpCode,
  Post,
  UseGuards,
  Req,
  Get,
  Param,
  Res,
  Delete,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';
import { FilesService } from './files.service';
import { FileResponseDto } from 'src/files/dto/file-reposonse.dto';
import { JwtGuard } from 'src/auth/quards/jwt.guard';
import {
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { createReadStream } from 'fs';
import { join } from 'path';
import { User } from 'src/common/decorators/user.decorator';
import { FileModel } from 'src/files/file.model';
import { PaginationParamsDto } from 'src/common/dto/pagination-params.dto';
import { PaginatedResultDto } from 'src/common/dto/paginated-result.dto';

@ApiTags('files')
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload')
  @ApiOperation({ summary: 'Upload file or image' })
  @HttpCode(200)
  @UseGuards(JwtGuard)
  @ApiResponse({
    status: 200,
    description: 'The file has been successfully uploaded.',
    type: FileResponseDto,
  })
  async uploadFile(
    @Req() req: FastifyRequest,
    @User() user: any,
  ): Promise<FileModel[]> {
    return this.filesService.handleFileUpload(req, user);
  }

  @ApiOperation({ summary: 'Get a file by filename' })
  @ApiParam({
    name: 'date',
    required: true,
    description: 'Date folder of the file to retrieve',
  })
  @ApiParam({
    name: 'filename',
    required: true,
    description: 'Name of the file to retrieve',
  })
  @Get('static/:date/:filename')
  async getFile(
    @Param('date') date: string,
    @Param('filename') filename: string,
    @Res() res: FastifyReply,
  ) {
    const filePath = join('uploads', date, filename);
    res.type('image/webp');
    return res.send(createReadStream(filePath));
  }

  @Get()
  @ApiOperation({ summary: 'Get all files' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'The files have been successfully retrieved.',
    type: [FileResponseDto],
  })
  async getAllFiles(
    @Query() paginationParams?: PaginationParamsDto,
  ): Promise<PaginatedResultDto<FileModel>> {
    return this.filesService.getAllFiles(paginationParams);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a file by ID' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID of the file to retrieve',
  })
  @ApiResponse({
    status: 200,
    description: 'The file has been successfully retrieved.',
    type: FileResponseDto,
  })
  async getFileById(@Param('id', ParseIntPipe) id: number): Promise<FileModel> {
    return this.filesService.getFileById(id);
  }

  @Get('user/:userId')
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiOperation({ summary: 'Get files by user ID' })
  @ApiParam({
    name: 'userId',
    required: true,
    description: 'ID of the user whose files to retrieve',
  })
  @ApiResponse({
    status: 200,
    description: 'The files have been successfully retrieved.',
    type: [FileResponseDto],
  })
  async getFilesByUserId(
    @Param('userId', ParseIntPipe) userId: number,
    @Query() { page, limit }: PaginationParamsDto,
  ): Promise<PaginatedResultDto<FileModel>> {
    return this.filesService.getFilesByUserId(userId, { page, limit });
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a file' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID of the file to delete',
  })
  @ApiResponse({
    status: 200,
    description: 'The file has been successfully deleted.',
  })
  async deleteFile(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.filesService.deleteFile(id);
  }
}
