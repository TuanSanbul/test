import { Sort } from '@lib/common/enums';
import { IQueryMessage, OrderFields } from '@lib/common/interfaces';
import { IQueryFieldDeposit } from '@lib/common/interfaces/modules/deposit';
import { Deposit, Member } from '@lib/core/databases/postgres';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class QueryFieldsDepositDto implements Partial<IQueryFieldDeposit> {
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

export class OrderDepositDto implements OrderFields<Deposit & Member> {
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
  total: Sort;

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

export class QueryDepositDto implements IQueryMessage<Deposit> {
  @ApiProperty({ required: true, type: QueryFieldsDepositDto })
  @ValidateNested()
  @Type(() => QueryFieldsDepositDto)
  queryFields: QueryFieldsDepositDto;

  @ApiProperty({ required: true, type: OrderDepositDto })
  @ValidateNested()
  @Type(() => OrderDepositDto)
  orderFields: OrderDepositDto;
}
