import { CommunicateTemplateEnum, Sort } from '@lib/common/enums';
import {
  IQueryMessage,
  OrderFields,
  QueryFields,
} from '@lib/common/interfaces/request';
import { CommunicateTemplate } from '@lib/core/databases/mongo';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsOptional, IsString, ValidateNested } from 'class-validator';

export class QueryFieldsTemplateDto
  implements QueryFields<CommunicateTemplate>
{
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  title: string;

  @ApiProperty({ required: false, enum: CommunicateTemplateEnum })
  @IsOptional()
  @IsEnum(CommunicateTemplateEnum)
  type: CommunicateTemplateEnum;
}

export class OrderFieldsTemplateDto
  implements OrderFields<CommunicateTemplate>
{
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

export class QueryTemplateDto implements IQueryMessage<CommunicateTemplate> {
  @ApiProperty({ required: true, type: QueryFieldsTemplateDto })
  @ValidateNested()
  @Type(() => QueryFieldsTemplateDto)
  queryFields: QueryFieldsTemplateDto;

  @ApiProperty({ required: true, type: OrderFieldsTemplateDto })
  @ValidateNested()
  @Type(() => OrderFieldsTemplateDto)
  orderFields: OrderFieldsTemplateDto;
}
