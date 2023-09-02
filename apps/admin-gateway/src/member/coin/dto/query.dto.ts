import { QueryFields } from '@lib/common/interfaces';
import { CoinLog, Member } from '@lib/core/databases/postgres';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

class QueryFieldsCoin implements QueryFields<CoinLog & Member> {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  username: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  reason: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  nickName: string;
}

class OrderByCoin {}

export class QueryBodyCoinDto {
  @IsOptional()
  @IsObject()
  @ValidateNested({ each: true })
  @Type(() => QueryFieldsCoin)
  @ApiProperty({ type: QueryFieldsCoin })
  queryFields: QueryFieldsCoin;

  @IsOptional()
  @IsObject()
  @ValidateNested({ each: true })
  @Type(() => OrderByCoin)
  @ApiProperty({ type: OrderByCoin })
  orderFields: OrderByCoin;
}
