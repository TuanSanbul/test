import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CouponExchangeDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  couponId: string;
}
