import { versionUUID } from '@lib/common/constants';
import { Sort } from '@lib/common/enums';
import {
  IQueryMessage,
  OrderFields,
  QueryFields,
} from '@lib/common/interfaces';
import { IRemoveBankCheck } from '@lib/common/interfaces/modules/deposit';
import { BankCheck, Member } from '@lib/core/databases/postgres';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsOptional,
  IsUUID,
  ValidateNested,
} from 'class-validator';

export class QueryFieldsBankCheckDto implements QueryFields<BankCheck> {}

export class OrderBankCheckDto implements OrderFields<BankCheck & Member> {
  @ApiProperty({ required: false, enum: Sort })
  @IsOptional()
  @IsEnum(Sort)
  id: Sort;

  @ApiProperty({ required: false, enum: Sort })
  @IsOptional()
  @IsEnum(Sort)
  nickName: Sort;

  @ApiProperty({ required: false, enum: Sort })
  @IsOptional()
  @IsEnum(Sort)
  username: Sort;

  @ApiProperty({ required: false, enum: Sort })
  @IsOptional()
  @IsEnum(Sort)
  createdAt: Sort;
}

export class QueryBankCheckDto implements IQueryMessage<BankCheck> {
  @ApiProperty({ required: true, type: QueryFieldsBankCheckDto })
  @ValidateNested()
  @Type(() => QueryFieldsBankCheckDto)
  queryFields: QueryFieldsBankCheckDto;

  @ApiProperty({ required: true, type: OrderBankCheckDto })
  @ValidateNested()
  @Type(() => OrderBankCheckDto)
  orderFields: OrderBankCheckDto;
}

export class RemoveBankCheckDto implements IRemoveBankCheck {
  @ApiProperty()
  @IsArray()
  @IsUUID(versionUUID, { each: true })
  listId: string[];
}
