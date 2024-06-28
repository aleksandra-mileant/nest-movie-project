import { ApiProperty } from '@nestjs/swagger';

export class FileElementResponse {
  @ApiProperty({
    example: '2024-06-28/test.test.docx',
    description: 'The url of the file',
  })
  url: string;

  @ApiProperty({
    example: 'test.test.docx',
    description: 'The name of the file',
  })
  name: string;
}
