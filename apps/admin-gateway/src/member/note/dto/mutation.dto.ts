import { MemoNoteType } from '@lib/common/enums';
import { IMemoNote } from '@lib/common/interfaces/modules/member';
import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';
import * as moment from 'moment';

export class CreateNoteDto implements IMemoNote {
  @ApiProperty({ required: true })
  @IsString()
  content: string;

  @ApiProperty({ required: true, enum: MemoNoteType })
  @IsEnum(MemoNoteType)
  type: MemoNoteType;

  @ApiProperty({ required: false, default: moment().utc().toISOString() })
  @IsOptional()
  @IsDateString()
  noteDate: Date;

  @ApiProperty({ required: true, type: String })
  @IsString()
  member: string;
}
