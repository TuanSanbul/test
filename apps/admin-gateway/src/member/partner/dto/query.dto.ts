import { Sort } from '@lib/common/enums';
import { QueryFields } from '@lib/common/interfaces';
import { PartnerLog } from '@lib/core/databases/postgres';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDefined,
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

class QueryFieldsPartner implements QueryFields<PartnerLog> {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  username: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  nickName: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  partnerTypeId: string;
}

class OrderByPartner {
  @ApiProperty({ required: false, default: Sort.Asc })
  @IsEnum(Sort)
  @IsOptional()
  username: Sort;

  @ApiProperty({ required: false, default: Sort.Asc })
  @IsEnum(Sort)
  @IsOptional()
  createdAt: Sort;
}

export class QueryBodyPartnerDto {
  @ApiProperty({ type: QueryFieldsPartner })
  @IsObject()
  @IsDefined()
  @Type(() => QueryFieldsPartner)
  @ValidateNested()
  queryFields: QueryFieldsPartner;

  @ApiProperty({ type: OrderByPartner })
  @IsObject()
  @IsDefined()
  @Type(() => OrderByPartner)
  @ValidateNested()
  orderFields: OrderByPartner;
}
