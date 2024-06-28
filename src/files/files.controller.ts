import {
  Controller,
  HttpCode,
  Post,
  UseGuards,
  Req,
  Get,
  Param,
  Res,
} from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';
import { FilesService } from './files.service';
import { FileElementResponse } from 'src/files/dto/file-reposonse.dto';
import { JwtGuard } from 'src/auth/quards/jwt.guard';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { createReadStream } from 'fs';
import { join } from 'path';

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
    type: FileElementResponse,
  })
  async uploadFile(@Req() req: FastifyRequest): Promise<FileElementResponse[]> {
    return this.filesService.handleFileUpload(req);
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
}
