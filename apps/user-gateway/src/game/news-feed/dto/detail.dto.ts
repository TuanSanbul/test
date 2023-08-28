import { QueryFields } from '@lib/common/interfaces';
import { GameDetail, GameFeed } from '@lib/core/databases/postgres';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDefined,
  IsObject,
  IsOptional,
  IsUUID,
  ValidateNested,
} from 'class-validator';

class QueryFieldsGameDetail implements QueryFields<GameDetail> {
  @ApiProperty({ required: false })
  @IsUUID()
  @IsOptional()
  gameFeedId: string;
}

class OrderByGameDetail implements QueryFields<GameFeed> {}

export class QueryBodyGameDetail {
  @ApiProperty({ type: QueryFieldsGameDetail })
  @IsObject()
  @IsDefined()
  @Type(() => QueryFieldsGameDetail)
  @ValidateNested()
  queryFields: QueryFieldsGameDetail;

  @ApiProperty({ type: OrderByGameDetail })
  @IsObject()
  @IsDefined()
  @Type(() => OrderByGameDetail)
  @ValidateNested()
  orderFields: OrderByGameDetail;
}
