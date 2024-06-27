import {
  Controller,
  HttpCode,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { FileElementResponse } from './dto/file-element.reposonse';
import { FilesService } from './files.service';
import { JwtGuard } from 'src/auth/quards/jwt.guard';
import { MFile } from 'src/files/mfile.class';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload')
  @HttpCode(200)
  @UseGuards(JwtGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<FileElementResponse[]> {
    const saveArray: MFile[] = [new MFile(file)];

    if (file.mimetype.includes('image')) {
      const buffer = await this.filesService.convertToWebP(file.buffer);
      saveArray.push(
        new MFile({
          originalname: `${file.originalname.split('.')[0]}.webp`,
          buffer,
        }),
      );
    }

    return this.filesService.saveFiles(saveArray);
  }
}
