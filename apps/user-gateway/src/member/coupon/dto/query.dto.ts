import { CouponFilterBy } from '@lib/common/enums';
import { QueryFields } from '@lib/common/interfaces';
import { Member } from '@lib/core/databases/postgres';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDefined,
  IsEnum,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

class QueryFieldsCoupon implements QueryFields<Member> {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  username: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  nickName: string;
}

class OrderByCoupon {}

export class QueryBodyCouponDto {
  @ApiProperty({ type: QueryFieldsCoupon })
  @IsObject()
  @IsDefined()
  @Type(() => QueryFieldsCoupon)
  @ValidateNested()
  queryFields: QueryFieldsCoupon;

  @ApiProperty({ type: OrderByCoupon })
  @IsObject()
  @IsDefined()
  @Type(() => OrderByCoupon)
  @ValidateNested()
  orderFields: OrderByCoupon;

  @ApiProperty({ enum: CouponFilterBy, default: CouponFilterBy.CreatedAt })
  @IsEnum(CouponFilterBy)
  @IsOptional()
  filterBy: CouponFilterBy;
}
