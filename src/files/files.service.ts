import {
  Injectable,
  NotFoundException,
  Query,
  UnauthorizedException,
} from '@nestjs/common';
import { format } from 'date-fns';
import { path } from 'app-root-path';
import { ensureDir, pathExists, unlink, writeFile } from 'fs-extra';
import * as sharp from 'sharp';
import { MFile } from './mfile.class';
import { MultipartFile } from '@fastify/multipart';
import { FastifyRequest } from 'fastify';
import { InjectModel } from '@nestjs/sequelize';
import { FileModel } from 'src/files/file.model';
import { UsersModel } from 'src/users/users.model';
import * as pathModule from 'path';
import { paginate } from 'src/common/utils/pagination.util';
import { PaginationParamsDto } from 'src/common/dto/pagination-params.dto';
import { PaginatedResultDto } from 'src/common/dto/paginated-result.dto';
import { FILE_NOT_FOUND_ERROR } from 'src/files/files.constants';

@Injectable()
export class FilesService {
  constructor(
    @InjectModel(FileModel)
    private readonly fileModel: typeof FileModel,
  ) {}
  async saveFiles(files: MFile[], userId: number): Promise<FileModel[]> {
    const dateFolder = format(new Date(), 'yyyy-MM-dd');
    const uploadFolder = `${path}/uploads/${dateFolder}`;

    await ensureDir(uploadFolder);

    const res: FileModel[] = [];

    for (const file of files) {
      await writeFile(`${uploadFolder}/${file.originalname}`, file.buffer);

      // Save file information to the database
      const savedFile = await this.fileModel.create({
        originalname: file.originalname,
        mimetype: file.mimetype,
        filename: file.originalname,
        path: `${dateFolder}/${file.originalname}`,
        userId: userId, // Associate the file with the user
      });

      // Add the file information to the response array
      res.push(savedFile);
    }
    return res;
  }

  convertToWebP(file: Buffer): Promise<Buffer> {
    return sharp(file).webp().toBuffer();
  }

  private async streamToBuffer(stream: NodeJS.ReadableStream): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];
      stream.on('data', (chunk) => chunks.push(chunk));
      stream.on('end', () => resolve(Buffer.concat(chunks)));
      stream.on('error', (err) => reject(err));
    });
  }

  async handleFileUpload(
    req: FastifyRequest,
    user: UsersModel,
  ): Promise<FileModel[]> {
    const files: MFile[] = [];
    const parts = req.parts();

    if (!user) {
      throw new UnauthorizedException();
    }

    for await (const part of parts) {
      if ((part as MultipartFile).file) {
        const filePart = part as MultipartFile;
        const fileBuffer = await this.streamToBuffer(filePart.file);
        const file: Express.Multer.File = {
          fieldname: filePart.fieldname,
          originalname: filePart.filename,
          encoding: filePart.encoding,
          mimetype: filePart.mimetype,
          size: fileBuffer.length,
          buffer: fileBuffer,
          stream: filePart.file,
          destination: '',
          filename: filePart.filename,
          path: '',
        };
        files.push(new MFile(file));
      }
    }

    const saveArray: MFile[] = [...files];

    for (const file of files) {
      if (file.mimetype.includes('image')) {
        const buffer = await this.convertToWebP(file.buffer);
        saveArray.push(
          new MFile({
            fieldname: file.fieldname,
            originalname: `${file.originalname.split('.')[0]}.webp`,
            encoding: file.encoding,
            mimetype: 'image/webp',
            size: buffer.length,
            buffer: buffer,
            stream: file.stream,
            destination: file.destination,
            filename: `${file.originalname.split('.')[0]}.webp`,
            path: file.path,
          }),
        );
      }
    }

    return this.saveFiles(saveArray, user.id);
  }

  async getAllFiles(
    @Query() { page, limit }: PaginationParamsDto,
  ): Promise<PaginatedResultDto<FileModel>> {
    return paginate(
      this.fileModel,
      {
        order: [['createdAt', 'DESC']],
      },
      page,
      limit,
    );
  }

  async getFileById(id: number): Promise<FileModel | null> {
    const file = await this.fileModel.findOne({ where: { id } });
    if (!file) {
      throw new NotFoundException(FILE_NOT_FOUND_ERROR);
    }
    return file;
  }

  async getFilesByUserId(
    userId: number,
    { page, limit }: PaginationParamsDto,
  ): Promise<PaginatedResultDto<FileModel>> {
    return paginate(
      this.fileModel,
      {
        order: [['createdAt', 'DESC']],
        where: {
          userId,
        },
      },
      page,
      limit,
    );
  }

  async deleteFile(id: number): Promise<void> {
    const file = await this.fileModel.findOne({ where: { id } });
    if (!file) {
      throw new NotFoundException(FILE_NOT_FOUND_ERROR);
    }
    const fullPath = pathModule.join(path, 'uploads', file.path);
    if (await pathExists(fullPath)) {
      await unlink(fullPath);
    } else {
      throw new NotFoundException(FILE_NOT_FOUND_ERROR);
    }
    await this.fileModel.destroy({ where: { id } });
  }
}
