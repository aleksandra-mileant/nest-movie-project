import { ApiProperty } from '@nestjs/swagger';

export class FileResponseDto {
  @ApiProperty({ example: 1, description: 'The ID of the file' })
  id: number;

  @ApiProperty({
    example: 'test.test.docx',
    description: 'The original name of the file',
  })
  originalname: string;

  @ApiProperty({
    example:
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    description: 'The MIME type of the file',
  })
  mimetype: string;

  @ApiProperty({
    example: 'test.test.docx',
    description: 'The name of the file',
  })
  filename: string;

  @ApiProperty({
    example: '2024-06-28/test.test.docx',
    description: 'The path of the file',
  })
  path: string;

  @ApiProperty({
    example: 1,
    description: 'The ID of the user',
  })
  userId: number;

  @ApiProperty({
    example: '2024-06-20T08:57:20.365Z',
    description: 'The creation date of the file record',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2024-06-20T08:57:20.365Z',
    description: 'The last update date of the file record',
  })
  updatedAt: Date;
}
