import { versionUUID } from '@lib/common/constants';
import { Sort } from '@lib/common/enums';
import {
  IQueryMessage,
  OrderFields,
  QueryFields,
} from '@lib/common/interfaces';
import { Member } from '@lib/core/databases/postgres';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';

export class QueryFieldsProfileDto implements QueryFields<Member> {
  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsString()
  username: string;

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @MinLength(1)
  @MaxLength(1)
  @IsString()
  group: string;

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsString()
  nickName: string;

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsUUID(versionUUID)
  id: string;
}

export class OrderFieldsProfileDto implements OrderFields<Member> {
  @ApiProperty({ required: false, enum: Sort })
  @IsOptional()
  @IsEnum(Sort)
  id: Sort;

  @ApiProperty({ required: false, enum: Sort })
  @IsOptional()
  @IsEnum(Sort)
  createdAt: Sort;

  @ApiProperty({ required: false, enum: Sort })
  @IsOptional()
  @IsEnum(Sort)
  updatedAt: Sort;
}

export class QueryProfileDto implements IQueryMessage<Member> {
  @ApiProperty({ required: true, type: QueryFieldsProfileDto })
  @ValidateNested()
  @Type(() => QueryFieldsProfileDto)
  queryFields: QueryFieldsProfileDto;

  @ApiProperty({ required: true, type: OrderFieldsProfileDto })
  @ValidateNested()
  @Type(() => OrderFieldsProfileDto)
  orderFields: OrderFieldsProfileDto;
}
