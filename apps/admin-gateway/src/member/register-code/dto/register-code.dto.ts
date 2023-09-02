import { RegisterCodeType } from '@lib/common/enums';
import { IRegisterCode } from '@lib/common/interfaces/modules/register-code';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class RegisterCodeDto implements Partial<IRegisterCode> {
  @ApiProperty({ type: Number, required: false })
  @IsOptional()
  bonus?: number;

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsString()
  recommendCode: string;

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsString()
  memberId: string;

  @ApiProperty({ enum: RegisterCodeType })
  @IsOptional()
  @IsEnum(RegisterCodeType)
  type: RegisterCodeType;

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsString()
  detail: string;

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsString()
  registeredDomain: string;
}

export class UpdateRegisterCodeDto extends RegisterCodeDto {
  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsString()
  id: string;
}
