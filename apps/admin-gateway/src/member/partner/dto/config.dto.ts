import { versionUUID } from '@lib/common/constants';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';

export class ConfigPartnerDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID(versionUUID)
  memberId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  partnerTypeId: string;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  rate: string;
}
