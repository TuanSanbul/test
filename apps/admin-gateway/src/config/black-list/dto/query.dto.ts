import { Sort } from '@lib/common/enums';
import {
  IQueryMessage,
  OrderFields,
  QueryFields,
} from '@lib/common/interfaces/request';
import { BlackList, Member } from '@lib/core/databases/postgres';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsOptional, IsString, ValidateNested } from 'class-validator';

export class QueryFieldsBlackListDto
  implements QueryFields<BlackList & Member>
{
  @ApiProperty({ required: false, type: String })
  @IsString()
  @IsOptional()
  username: string;

  @ApiProperty({ required: false, type: String })
  @IsString()
  @IsOptional()
  phone: string;

  @ApiProperty({ required: false, type: String })
  @IsString()
  @IsOptional()
  fullName: string;

  @ApiProperty({ required: false, type: String })
  @IsString()
  @IsOptional()
  bankName: string;

  @ApiProperty({ required: false, type: String })
  @IsString()
  @IsOptional()
  bankAccountNumber: string;

  @ApiProperty({ required: false, type: String })
  @IsString()
  @IsOptional()
  detail: string;
}

export class OrderFieldsBlackListDto implements OrderFields<BlackList> {
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

export class QueryBlackListDto implements IQueryMessage<BlackList> {
  @ApiProperty({ required: true, type: QueryFieldsBlackListDto })
  @ValidateNested()
  @Type(() => QueryFieldsBlackListDto)
  queryFields: QueryFieldsBlackListDto;

  @ApiProperty({ required: true, type: OrderFieldsBlackListDto })
  @ValidateNested()
  @Type(() => OrderFieldsBlackListDto)
  orderFields: OrderFieldsBlackListDto;
}
