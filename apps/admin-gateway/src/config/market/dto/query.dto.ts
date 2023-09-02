import { MarketStatus, MarketType, Sort } from '@lib/common/enums';
import {
  IQueryMessage,
  OrderFields,
  QueryFields,
} from '@lib/common/interfaces/request';
import { Market } from '@lib/core/databases/postgres';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class QueryFieldsMarketDto implements QueryFields<Market> {
  @ApiProperty({ required: false, type: String })
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty({ required: false, type: String })
  @IsString()
  @IsOptional()
  nameKo: string;

  @ApiProperty({ required: false, type: Number })
  @IsNumber()
  @IsOptional()
  order: number;

  @ApiProperty({ required: false, type: Number })
  @IsNumber()
  @IsOptional()
  score: number;

  @ApiProperty({ required: false, type: String })
  @IsString()
  @IsOptional()
  marketConfigId: string;

  @ApiProperty({ required: false, enum: MarketStatus })
  @IsEnum(MarketStatus)
  @IsOptional()
  status: MarketStatus;

  @ApiProperty({ required: false, enum: MarketType })
  @IsEnum(MarketType)
  @IsOptional()
  type: MarketType;
}

export class OrderFieldsMarketDto implements OrderFields<Market> {
  @ApiProperty({ required: false, enum: Sort })
  @IsOptional()
  @IsEnum(Sort)
  id: Sort;

  @ApiProperty({ required: false, enum: Sort })
  @IsOptional()
  @IsEnum(Sort)
  name: Sort;

  @ApiProperty({ required: false, enum: Sort })
  @IsOptional()
  @IsEnum(Sort)
  nameKo: Sort;

  @ApiProperty({ required: false, enum: Sort })
  @IsOptional()
  @IsEnum(Sort)
  order: Sort;

  @ApiProperty({ required: false, enum: Sort })
  @IsOptional()
  @IsEnum(Sort)
  score: Sort;

  @ApiProperty({ required: false, enum: Sort })
  @IsOptional()
  @IsEnum(Sort)
  status: Sort;

  @ApiProperty({ required: false, enum: Sort })
  @IsOptional()
  @IsEnum(Sort)
  type: Sort;

  @ApiProperty({ required: false, enum: Sort })
  @IsOptional()
  @IsEnum(Sort)
  createdAt: Sort;

  @ApiProperty({ required: false, enum: Sort })
  @IsOptional()
  @IsEnum(Sort)
  updatedAt: Sort;
}

export class QueryMarketDto implements IQueryMessage<Market> {
  @ApiProperty({ required: true, type: QueryFieldsMarketDto })
  @ValidateNested()
  @Type(() => QueryFieldsMarketDto)
  queryFields: QueryFieldsMarketDto;

  @ApiProperty({ required: true, type: OrderFieldsMarketDto })
  @ValidateNested()
  @Type(() => OrderFieldsMarketDto)
  orderFields: OrderFieldsMarketDto;
}
