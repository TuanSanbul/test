import { versionUUID } from '@lib/common/constants';
import { IQueryMessage } from '@lib/common/interfaces';
import { LoginLog } from '@lib/core/databases/mongo';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';

export class QueryFieldsLoginLogDto implements Partial<LoginLog> {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID(versionUUID)
  memberId: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  deviceId: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  userAgent: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  ipAddress: string;

  @ApiProperty({ required: false, type: Boolean })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  status: boolean;
}

export class QueryLoginLogDto
  implements Omit<IQueryMessage<LoginLog>, 'orderFields'>
{
  @ApiProperty({ required: true, type: QueryFieldsLoginLogDto })
  @ValidateNested()
  @IsObject()
  @Type(() => QueryFieldsLoginLogDto)
  queryFields: QueryFieldsLoginLogDto;
}
