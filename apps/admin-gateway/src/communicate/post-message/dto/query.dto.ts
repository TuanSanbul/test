import { Sort } from '@lib/common/enums';
import {
  IOrderFieldsPostMessage,
  IQueryFieldsPostMessage,
  IQueryPostMessage,
} from '@lib/common/interfaces/modules/communicate';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsOptional, IsString, ValidateNested } from 'class-validator';

export class QueryFieldsMessageDto implements IQueryFieldsPostMessage {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  title: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  content: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  username: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  nickName: string;
}

export class OrderFieldsMessageDto implements IOrderFieldsPostMessage {
  @ApiProperty({ required: false, enum: Sort })
  @IsOptional()
  @IsEnum(Sort)
  username: Sort;

  @ApiProperty({ required: false, enum: Sort })
  @IsOptional()
  @IsEnum(Sort)
  level: Sort;

  @ApiProperty({ required: false, enum: Sort })
  @IsOptional()
  @IsEnum(Sort)
  nickName: Sort;

  @ApiProperty({ required: false, enum: Sort })
  @IsOptional()
  @IsEnum(Sort)
  createdAt: Sort;

  @ApiProperty({ required: false, enum: Sort })
  @IsOptional()
  @IsEnum(Sort)
  confirmDate: Sort;
}

export class QueryMessageDto implements IQueryPostMessage {
  @ApiProperty({ required: true, type: QueryFieldsMessageDto })
  @ValidateNested()
  @Type(() => QueryFieldsMessageDto)
  queryFields: QueryFieldsMessageDto;

  @ApiProperty({ required: true, type: OrderFieldsMessageDto })
  @ValidateNested()
  @Type(() => OrderFieldsMessageDto)
  orderFields: OrderFieldsMessageDto;
}
