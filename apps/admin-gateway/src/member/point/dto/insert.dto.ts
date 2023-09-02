import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class PointInsertDto {
  @ApiProperty({ type: Number })
  @IsNumber()
  @Type(() => Number)
  amount: number;

  @ApiProperty({})
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiPropertyOptional({})
  @IsString()
  reason: string;
}
