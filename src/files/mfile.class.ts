export class MFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
  stream: NodeJS.ReadableStream;
  destination: string;
  filename: string;
  path: string;

  constructor(file: Express.Multer.File | MFile) {
    this.fieldname = file.fieldname;
    this.originalname = file.originalname;
    this.encoding = file.encoding;
    this.mimetype = file.mimetype;
    this.size = file.size;
    this.buffer = file.buffer;
    this.stream = file.stream;
    this.destination = file.destination || '';
    this.filename = file.filename || '';
    this.path = file.path || '';
  }
}
