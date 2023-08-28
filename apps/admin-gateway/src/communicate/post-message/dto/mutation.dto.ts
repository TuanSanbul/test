import { ICreatePostMessage } from '@lib/common/interfaces/modules/communicate';
import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsDateString, IsNotEmpty, IsString } from 'class-validator';
import * as moment from 'moment';

export class CreateMessageDto implements ICreatePostMessage {
  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ required: true })
  @IsString()
  sender: string;

  @ApiProperty({ required: true, isArray: true, type: String })
  @Type(() => String)
  @IsArray()
  receivers: string[];
}

export class UpdateMessageDto extends PartialType(
  OmitType(CreateMessageDto, ['sender', 'receivers']),
) {
  @ApiProperty({ required: true, default: moment().utc().toISOString() })
  @IsDateString()
  confirmDate: Date;
}
