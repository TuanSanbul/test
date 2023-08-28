import { Withdrawal, Member } from '@lib/core/databases/postgres';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import {
  IQueryMessage,
  OrderFields,
  QueryFields,
} from '@lib/common/interfaces';
import { Type } from 'class-transformer';
import { Sort } from '@lib/common/enums';

export class QueryFieldsWithdrawalDto
  implements QueryFields<Withdrawal & Member>
{
  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsString()
  username: string;

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsString()
  nickName: string;

  @ApiProperty({ type: Number, required: false })
  @IsOptional()
  @IsNumber()
  level: number;

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsString()
  phone: string;

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsString()
  ipAddress: string;

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsString()
  bankOwnerName: string;

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsString()
  recommenderUsername: string;
}

export class OrderWithdrawalDto implements OrderFields<Withdrawal> {
  @ApiProperty({ required: false, enum: Sort })
  @IsOptional()
  @IsEnum(Sort)
  id: Sort;

  @ApiProperty({ required: false, enum: Sort })
  @IsOptional()
  @IsEnum(Sort)
  username: Sort;

  @ApiProperty({ required: false, enum: Sort })
  @IsOptional()
  @IsEnum(Sort)
  nickName: Sort;

  @ApiProperty({ required: false, enum: Sort })
  @IsOptional()
  @IsEnum(Sort)
  amount: Sort;

  @ApiProperty({ required: false, enum: Sort })
  @IsOptional()
  @IsEnum(Sort)
  bankOwnerName: Sort;

  @ApiProperty({ required: false, enum: Sort })
  @IsOptional()
  @IsEnum(Sort)
  level: Sort;

  @ApiProperty({ required: false, enum: Sort })
  @IsOptional()
  @IsEnum(Sort)
  bankName: Sort;

  @ApiProperty({ required: false, enum: Sort })
  @IsOptional()
  @IsEnum(Sort)
  bankAccountNumber: Sort;

  @ApiProperty({ required: false, enum: Sort })
  @IsOptional()
  @IsEnum(Sort)
  ipAddress: Sort;

  @ApiProperty({ required: false, enum: Sort })
  @IsOptional()
  @IsEnum(Sort)
  createdAt: Sort;
}

export class QueryWithdrawalDto implements IQueryMessage<Withdrawal> {
  @ApiProperty({ required: true, type: QueryFieldsWithdrawalDto })
  @ValidateNested()
  @Type(() => QueryFieldsWithdrawalDto)
  queryFields: QueryFieldsWithdrawalDto;

  @ApiProperty({ required: true, type: OrderWithdrawalDto })
  @ValidateNested()
  @Type(() => OrderWithdrawalDto)
  orderFields: OrderWithdrawalDto;
}
