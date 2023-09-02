import { IQueryMessage, QueryFields } from '@lib/common/interfaces';
import { Role } from '@lib/core/databases/postgres';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class QueryFieldsRoleDto implements QueryFields<Role> {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name: string;
}

export class QueryRoleDto implements Omit<IQueryMessage<Role>, 'orderFields'> {
  @ApiProperty({ required: true, type: QueryFieldsRoleDto })
  @IsObject()
  @ValidateNested()
  @Type(() => QueryFieldsRoleDto)
  queryFields: QueryFieldsRoleDto;
}
