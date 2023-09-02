import { CommunicateEnum, Sort } from '@lib/common/enums';
import { IQueryCommunicate } from '@lib/common/interfaces/modules/communicate';
import { IQueryMessage, OrderFields } from '@lib/common/interfaces/request';
import { Communicate } from '@lib/core/databases/postgres';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class QueryFieldsNotificationDto implements Partial<IQueryCommunicate> {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  title: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  content: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  username: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  nickName: string;

  @ApiProperty({ required: true, enum: CommunicateEnum })
  @IsEnum(CommunicateEnum)
  type: CommunicateEnum;

  @ApiProperty({ required: true, default: false })
  @IsBoolean()
  deleted: boolean;
}

export class OrderFieldsNotificationDto implements OrderFields<Communicate> {
  @ApiProperty({ required: false, enum: Sort })
  @IsOptional()
  @IsEnum(Sort)
  id: Sort;

  @ApiProperty({ required: false, enum: Sort })
  @IsOptional()
  @IsEnum(Sort)
  createdAt: Sort;

  @ApiProperty({ required: false, enum: Sort })
  @IsOptional()
  @IsEnum(Sort)
  updatedAt: Sort;
}

export class QueryNotificationDto implements IQueryMessage<Communicate> {
  @ApiProperty({ required: true, type: QueryFieldsNotificationDto })
  @ValidateNested()
  @Type(() => QueryFieldsNotificationDto)
  queryFields: QueryFieldsNotificationDto;

  @ApiProperty({ required: true, type: OrderFieldsNotificationDto })
  @ValidateNested()
  @Type(() => OrderFieldsNotificationDto)
  orderFields: OrderFieldsNotificationDto;
}
