import { versionUUID } from '@lib/common/constants';
import { OrderDetailResult, OrderState, Sort } from '@lib/common/enums';
import {
  IOrderFieldsOrder,
  IQueryFieldsOrder,
  IQueryOrder,
} from '@lib/common/interfaces/modules/order';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';

export class QueryFieldsOrderDto implements IQueryFieldsOrder {
  @ApiProperty({
    required: false,
    enum: OrderDetailResult,
    default: OrderDetailResult.Waiting,
  })
  @IsOptional()
  @IsEnum(OrderDetailResult)
  orderDetailResult: OrderDetailResult;

  @ApiProperty({
    required: false,
    enum: OrderState,
    default: OrderState.Processing,
  })
  @IsOptional()
  @IsEnum(OrderState)
  orderState: OrderState;

  @ApiProperty({ required: false, default: false })
  @IsOptional()
  @IsBoolean()
  isAdmin: false;

  @ApiProperty({ required: false, default: false })
  @IsOptional()
  @IsBoolean()
  isInterested: false;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID(versionUUID)
  marketId: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  username: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  nickName: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  ipAddress: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  orderCode: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  homeTeamName: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  awayTeamName: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  leagueName: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  gameFeedId: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID(versionUUID)
  gameId: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID(versionUUID)
  gameCategoryId: string;
}

export class OrderFieldsOrderDto implements IOrderFieldsOrder {
  @ApiProperty({ enum: Sort })
  @IsOptional()
  @IsEnum(Sort)
  createdAt: Sort;

  @ApiProperty({ enum: Sort })
  @IsOptional()
  @IsEnum(Sort)
  expectWinning: Sort;

  @ApiProperty({ enum: Sort })
  @IsOptional()
  @IsEnum(Sort)
  betAmount: Sort;
}

export class QueryOrderDto implements IQueryOrder {
  @ApiProperty({ required: true, type: QueryFieldsOrderDto })
  @IsObject()
  @ValidateNested()
  @Type(() => QueryFieldsOrderDto)
  queryFields: QueryFieldsOrderDto;

  @ApiProperty({ required: true, type: OrderFieldsOrderDto })
  @IsObject()
  @ValidateNested()
  @Type(() => OrderFieldsOrderDto)
  orderFields: OrderFieldsOrderDto;
}
