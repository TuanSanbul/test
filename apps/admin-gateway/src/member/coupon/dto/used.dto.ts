import { versionUUID } from '@lib/common/constants';
import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class CouponUsedDto {
  @ApiProperty()
  @IsUUID(versionUUID)
  couponLogId: string;
}
