import { AttendanceTabEnum } from '@lib/common/enums';
import {
  IQueryAttendance,
  IQueryFieldsAttendance,
} from '@lib/common/interfaces/modules/member';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class QueryFieldsAttendanceDto implements IQueryFieldsAttendance {
  @ApiProperty({ required: true, enum: AttendanceTabEnum })
  @IsEnum(AttendanceTabEnum)
  tab: AttendanceTabEnum;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  username: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  nickName: string;
}

export class QueryAttendanceDto implements IQueryAttendance {
  @ApiProperty({ required: true, type: QueryFieldsAttendanceDto })
  @IsObject()
  @ValidateNested()
  @Type(() => QueryFieldsAttendanceDto)
  queryFields: QueryFieldsAttendanceDto;
}
