import { MarketStatus, MarketType } from '@lib/common/enums';
import {
  IUpdateListMarket,
  IUpdateMarket,
} from '@lib/common/interfaces/modules/market';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class CreateMarketDto {
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

  @ApiProperty({ required: false, enum: MarketStatus })
  @IsEnum(MarketStatus)
  @IsOptional()
  status: MarketStatus;

  @ApiProperty({ required: false, enum: MarketType })
  @IsEnum(MarketType)
  @IsOptional()
  type: MarketType;

  @ApiProperty({ required: false, type: String })
  @IsString()
  @IsOptional()
  marketConfigId: string;
}

export class UpdateMarketDto implements IUpdateMarket {
  @ApiProperty({ type: String })
  @IsString()
  id: string;

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

  @ApiProperty({ required: false, enum: MarketStatus })
  @IsEnum(MarketStatus)
  @IsOptional()
  status: MarketStatus;

  @ApiProperty({ required: false, enum: MarketType })
  @IsEnum(MarketType)
  @IsOptional()
  type: MarketType;

  @ApiProperty({ required: false, type: String })
  @IsString()
  @IsOptional()
  marketConfigId: string;
}

export class UpdateListMarketDto implements IUpdateListMarket {
  @ApiProperty({ type: () => [UpdateMarketDto] })
  @Type(() => UpdateMarketDto)
  @ValidateNested({ each: true })
  @IsArray()
  market: UpdateMarketDto[];
}
