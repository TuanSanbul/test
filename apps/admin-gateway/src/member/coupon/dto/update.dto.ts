import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class CouponConfigUpdateDto {
  @ApiProperty({ example: false })
  @IsBoolean()
  toggle: boolean;
}
