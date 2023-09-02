import { Sort } from '@lib/common/enums';
import {
  IQueryMessage,
  OrderFields,
  QueryFields,
} from '@lib/common/interfaces';
import { Withdrawal } from '@lib/core/databases/postgres';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsOptional, IsString, ValidateNested } from 'class-validator';

export class QueryFieldsIpAddressDto implements QueryFields<Withdrawal> {
  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsString()
  ipAddress: string;
}

export class OrderIpAddressDto implements OrderFields<Withdrawal> {
  @ApiProperty({ required: false, enum: Sort })
  @IsOptional()
  @IsEnum(Sort)
  id: Sort;

  @ApiProperty({ required: false, enum: Sort })
  @IsOptional()
  @IsEnum(Sort)
  confirmDate: Sort;

  @ApiProperty({ required: false, enum: Sort })
  @IsOptional()
  @IsEnum(Sort)
  createdAt: Sort;

  @ApiProperty({ required: false, enum: Sort })
  @IsOptional()
  @IsEnum(Sort)
  ipAddress: Sort;
}

export class QueryIpAddressDto implements IQueryMessage<Withdrawal> {
  @ApiProperty({ required: true, type: QueryFieldsIpAddressDto })
  @ValidateNested()
  @Type(() => QueryFieldsIpAddressDto)
  queryFields: QueryFieldsIpAddressDto;

  @ApiProperty({ required: true, type: OrderIpAddressDto })
  @ValidateNested()
  @Type(() => OrderIpAddressDto)
  orderFields: OrderIpAddressDto;
}
