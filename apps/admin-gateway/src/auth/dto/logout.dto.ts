import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class LogoutDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  deviceId: string;
}
