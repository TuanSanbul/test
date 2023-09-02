import { PointType, Sort } from '@lib/common/enums';
import { OrderFields, QueryFields } from '@lib/common/interfaces';
import { Member, PointLog } from '@lib/core/databases/postgres';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';

class QueryFieldsPoint implements QueryFields<PointLog & Member> {
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

class OrderByPoint implements OrderFields<PointLog & Member> {
  @ApiProperty({ required: false, default: Sort.Asc })
  @IsEnum(Sort)
  @IsOptional()
  point: Sort;

  @ApiProperty({ required: false, default: Sort.Asc })
  @IsEnum(Sort)
  @IsOptional()
  createdAt: Sort;

  @ApiProperty({ required: false, default: Sort.Asc })
  @IsEnum(Sort)
  @IsOptional()
  username: Sort;

  @ApiProperty({ required: false, default: Sort.Asc })
  @IsEnum(Sort)
  @IsOptional()
  nickName: Sort;
}

class FilterByPoint {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsNotEmpty()
  @IsUUID()
  roleId: string;

  @ApiProperty({ enum: PointType, default: PointType.Positive })
  @IsEnum(PointType)
  @IsOptional()
  type: PointType;
}

export class QueryBodyPointDto {
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => QueryFieldsPoint)
  @ApiProperty({ type: QueryFieldsPoint })
  queryFields: QueryFieldsPoint;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => OrderByPoint)
  @ApiProperty({ type: OrderByPoint })
  orderFields: OrderByPoint;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => FilterByPoint)
  @ApiProperty({ type: FilterByPoint })
  filterBy: FilterByPoint;
}
