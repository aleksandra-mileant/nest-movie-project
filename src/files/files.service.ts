import { Injectable } from '@nestjs/common';
import { FileElementResponse } from 'src/files/dto/file-reposonse.dto';
import { format } from 'date-fns';
import { path } from 'app-root-path';
import { ensureDir, writeFile } from 'fs-extra';
import * as sharp from 'sharp';
import { MFile } from './mfile.class';
import { MultipartFile } from '@fastify/multipart';
import { FastifyRequest } from 'fastify';

@Injectable()
export class FilesService {
  async saveFiles(files: MFile[]): Promise<FileElementResponse[]> {
    const dateFolder = format(new Date(), 'yyyy-MM-dd');
    const uploadFolder = `${path}/uploads/${dateFolder}`;

    await ensureDir(uploadFolder);

    const res: FileElementResponse[] = [];

    for (const file of files) {
      await writeFile(`${uploadFolder}/${file.originalname}`, file.buffer);
      res.push({
        url: `${dateFolder}/${file.originalname}`,
        name: file.originalname,
      });
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

  async handleFileUpload(req: FastifyRequest): Promise<FileElementResponse[]> {
    const files: MFile[] = [];
    const parts = req.parts();

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

    return this.saveFiles(saveArray);
  }
}
