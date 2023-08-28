import { CommunicateEnum } from '@lib/common/enums/communicate.enum';
import { ICommunication } from '@lib/common/interfaces/modules/communicate';
import { ICommunicateSetting } from '@lib/core/databases/mongo';
import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import * as moment from 'moment';

export class SettingDto implements Partial<ICommunicateSetting> {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  font: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  color: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  top: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  left: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  mobileTop: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  mobileLeft: number;
}

export class CreateNotificationDto
  implements
    Omit<
      ICommunication,
      | 'id'
      | 'createdAt'
      | 'updatedAt'
      | 'parent'
      | 'children'
      | 'setting'
      | 'ipAddress'
    >
{
  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ required: true })
  @IsString()
  content: string;

  @ApiProperty({ required: true, enum: CommunicateEnum })
  @IsEnum(CommunicateEnum)
  type: CommunicateEnum;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  fileUrl: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  status: boolean;

  @ApiProperty({ required: true, default: moment().utc().toISOString() })
  @IsDateString()
  applyDate: Date;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  author: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  parent: string;

  @ApiProperty({ required: false, type: SettingDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => SettingDto)
  setting: SettingDto;
}

export class UpdateNotificationDto extends PartialType(
  OmitType(CreateNotificationDto, ['type']),
) {}
