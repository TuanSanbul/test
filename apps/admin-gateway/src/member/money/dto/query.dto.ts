import { QueryFields } from '@lib/common/interfaces';
import { Member, MoneyLog } from '@lib/core/databases/postgres';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

class QueryFieldsMoneyLog implements QueryFields<MoneyLog & Member> {
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
  reason: string;
}

class OrderByMoneyLog {}

export class QueryBodyMoneyLogDto {
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => QueryFieldsMoneyLog)
  @ApiProperty({ type: QueryFieldsMoneyLog })
  queryFields: QueryFieldsMoneyLog;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => OrderByMoneyLog)
  @ApiProperty({ type: OrderByMoneyLog })
  orderFields: OrderByMoneyLog;
}
