import { MemberFilterDate } from '@lib/common/enums';
import { OrderFields } from '@lib/common/interfaces';
import {
  IQueryFieldsMember,
  IQueryMember,
} from '@lib/common/interfaces/modules/member';
import { Member, RegisterCode } from '@lib/core/databases/postgres';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import * as moment from 'moment';

export class QueryFieldsMemberDto implements IQueryFieldsMember {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MaxLength(1)
  group?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Max(10)
  @Min(0)
  level?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  nickName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isInterested?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  lastLoginIP: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  bankName: string;

  @ApiProperty({
    required: false,
    enum: MemberFilterDate,
    default: MemberFilterDate.CreatedAt,
  })
  @IsOptional()
  @IsEnum(MemberFilterDate)
  checkDate: MemberFilterDate;

  @ApiProperty({ required: true, enum: [0, 1, 2], default: 0 })
  @IsIn([0, 1, 2])
  tab: number;

  @ApiProperty({ required: false, type: String })
  @IsOptional()
  @IsString()
  recommendedCode?: RegisterCode;

  @ApiProperty({ required: false, type: String })
  @IsOptional()
  @IsString()
  recommender?: Member;

  @ApiProperty({ required: false, default: moment().utc().toISOString() })
  @IsOptional()
  @IsDateString()
  startTimeMoney?: Date;

  @ApiProperty({ required: false, default: moment().utc().toISOString() })
  @IsOptional()
  @IsDateString()
  endTimeMoney?: Date;
}

export class OrderFieldsMemberDto implements OrderFields<Member> {}

export class QueryMemberDto implements Omit<IQueryMember, 'orderFields'> {
  @ApiProperty({ required: true, type: QueryFieldsMemberDto })
  @ValidateNested()
  @Type(() => QueryFieldsMemberDto)
  queryFields: QueryFieldsMemberDto;
}
