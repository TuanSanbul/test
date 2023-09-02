import { GameFeedType, Sort } from '@lib/common/enums';
import { QueryFields } from '@lib/common/interfaces';
import { GameFeed } from '@lib/core/databases/postgres';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDefined,
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';

class QueryFieldsNewsFeed implements QueryFields<GameFeed> {
  @ApiProperty({ required: false })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  fid: string;

  @ApiProperty({ required: false })
  @IsUUID()
  @IsOptional()
  sportId: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  sportName: string;

  @ApiProperty({ required: false })
  @IsUUID()
  @IsOptional()
  nationId: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  nationName: string;

  @ApiProperty({ required: false })
  @IsUUID()
  @IsOptional()
  leagueId: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  leagueName: string;

  @ApiProperty({
    required: false,
    enum: GameFeedType,
    default: GameFeedType.PreMatch,
  })
  @IsEnum(GameFeedType)
  @IsOptional()
  type: GameFeedType;

  @ApiProperty({ required: false })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  homeTeam: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  awayTeam: string;
}

class OrderByNewsFeed implements QueryFields<GameFeed> {
  @ApiProperty({ required: false, default: Sort.Asc })
  @IsEnum(Sort)
  @IsOptional()
  leagueName: Sort;

  @ApiProperty({ required: false, default: Sort.Asc })
  @IsEnum(Sort)
  @IsOptional()
  nationName: Sort;

  @ApiProperty({ required: false, default: Sort.Asc })
  @IsEnum(Sort)
  @IsOptional()
  sportName: Sort;

  @ApiProperty({ required: false, default: Sort.Asc })
  @IsEnum(Sort)
  @IsOptional()
  homeTeam: Sort;

  @ApiProperty({ required: false, default: Sort.Asc })
  @IsEnum(Sort)
  @IsOptional()
  awayTeam: Sort;
}

class CustomFilter {
  @ApiProperty({ required: false })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  topLeagueId: string;
}

export class QueryBodyNewsFeed {
  @ApiProperty({ type: QueryFieldsNewsFeed })
  @IsObject()
  @IsDefined()
  @Type(() => QueryFieldsNewsFeed)
  @ValidateNested()
  queryFields: QueryFieldsNewsFeed;

  @ApiProperty({ type: OrderByNewsFeed })
  @IsObject()
  @IsDefined()
  @Type(() => OrderByNewsFeed)
  @ValidateNested()
  orderFields: OrderByNewsFeed;

  @ApiProperty({ type: CustomFilter })
  @Type(() => CustomFilter)
  @IsOptional()
  customFilter?: CustomFilter;
}
