import { CommunicateTemplateEnum } from '@lib/common/enums/communicate.enum';
import { ICommunicateTemplate } from '@lib/core/databases/mongo';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateTemplateDto implements Partial<ICommunicateTemplate> {
  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ required: true })
  @IsString()
  content: string;

  @ApiProperty({ required: true, enum: CommunicateTemplateEnum })
  @IsEnum(CommunicateTemplateEnum)
  type: CommunicateTemplateEnum;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  fileUrl: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  status: boolean;
}

export class UpdateTemplateDto extends PartialType(CreateTemplateDto) {}
