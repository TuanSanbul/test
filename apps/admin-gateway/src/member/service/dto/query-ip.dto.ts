import { Sort } from '@lib/common/enums';
import { OrderFields } from '@lib/common/interfaces';
import { IQueryMemberIP } from '@lib/common/interfaces/modules/member';
import { Member } from '@lib/core/databases/postgres';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsOptional, ValidateNested } from 'class-validator';
import { QueryFieldsMemberDto } from './query.dto';

export class QueryFieldsMemberIPDto extends PickType(QueryFieldsMemberDto, [
  'lastLoginIP',
]) {}

export class OrderFieldsMemberIPDto implements OrderFields<Member> {
  @ApiProperty({ required: false, enum: Sort })
  @IsOptional()
  @IsEnum(Sort)
  username: Sort;

  @ApiProperty({ required: false, enum: Sort })
  @IsOptional()
  @IsEnum(Sort)
  lastLoginIP: Sort;

  @ApiProperty({ required: false, enum: Sort })
  @IsOptional()
  @IsEnum(Sort)
  lastAccess: Sort;
}

export class QueryMemberIPDto implements IQueryMemberIP {
  @ApiProperty({ required: true, type: QueryFieldsMemberIPDto })
  @ValidateNested()
  @Type(() => QueryFieldsMemberIPDto)
  queryFields: QueryFieldsMemberIPDto;

  @ApiProperty({ required: true, type: OrderFieldsMemberIPDto })
  @ValidateNested()
  @Type(() => OrderFieldsMemberIPDto)
  orderFields: OrderFieldsMemberIPDto;
}
