import { ApiProperty } from '@nestjs/swagger';

export class FilesUploadDto {
  @ApiProperty({
    type: 'array',
    name: 'files',
    items: { type: 'string', format: 'binary' },
  })
  files: Express.Multer.File[];
}

export class FileUploadDto {
  @ApiProperty({
    type: 'string',
    name: 'file',
    format: 'binary',
  })
  files: Express.Multer.File;
}
