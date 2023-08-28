import { versionUUID } from '@lib/common/constants';
import { OrderCurrency } from '@lib/common/enums';
import { IPayloadCreateOrder } from '@lib/common/interfaces/modules/order';
import { IPayloadCreateOrderDetail } from '@lib/common/interfaces/modules/order/detail';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsUUID,
  ValidateNested,
} from 'class-validator';

export class CreateOrderDetailDto implements IPayloadCreateOrderDetail {
  @ApiProperty({ required: true, default: false })
  @IsBoolean()
  status: boolean;

  @ApiProperty({ required: true, default: 0 })
  @IsNumber()
  odds: number;

  @ApiProperty({ required: true, default: 0 })
  @IsNumber()
  handicap: number;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsUUID(versionUUID)
  gameDetailId: string;
}

export class CreateOrderDto implements IPayloadCreateOrder {
  @ApiProperty({ required: true, default: 0 })
  @IsNumber()
  betAmount: number;

  @ApiProperty({ required: true, default: 0 })
  @IsNumber()
  expectWinning: number;

  @ApiProperty({ required: true, default: 0 })
  @IsNumber()
  rate: number;

  @ApiProperty({ required: true, default: OrderCurrency.KRW })
  @IsEnum(OrderCurrency)
  currency: OrderCurrency;

  @ApiProperty({ required: true, isArray: true, type: CreateOrderDetailDto })
  @IsArray()
  @ValidateNested()
  orderDetails: CreateOrderDetailDto[];
  ipAddress: string;
}
