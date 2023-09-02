import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ required: true })
  @MinLength(4)
  @IsString()
  username: string;

  @ApiProperty({ required: true })
  @MinLength(4)
  @IsString()
  password: string;
}
