import { versionUUID } from '@lib/common/constants';
import { GenderEnum } from '@lib/common/enums';
import {
  IPayloadCreateMember,
  IUpdateConfigMember,
  IUpdateDetailMember,
  IUpdateMultiMember,
} from '@lib/common/interfaces/modules/member';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import * as moment from 'moment';

export class PayloadMultiMemberDto implements IUpdateMultiMember {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsUUID(versionUUID)
  id: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({ required: false, type: Number, default: 0 })
  @IsOptional()
  @IsNumber()
  level: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MaxLength(1)
  @MinLength(1)
  group: string;

  @ApiProperty({ required: false, default: moment().utc().toISOString() })
  @IsOptional()
  @IsDateString()
  leaveDate: Date;

  @ApiProperty({ required: false, default: moment().utc().toISOString() })
  @IsOptional()
  @IsDateString()
  interceptDate: Date;
}

export class UpdateMultiMemberDto {
  @ApiProperty({ required: true, isArray: true, type: PayloadMultiMemberDto })
  @IsArray()
  @Type(() => PayloadMultiMemberDto)
  @ValidateNested()
  members: PayloadMultiMemberDto[];
}

export class UpdateConfigMember implements IUpdateConfigMember {
  @ApiProperty({ required: false })
  @IsOptional()
  @MinLength(4)
  @IsString()
  password: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MinLength(9)
  phone: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  bankName: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  bankOwnerName: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  bankAccountNumber: string;

  @ApiProperty({ required: false, default: moment().utc().toISOString() })
  @IsOptional()
  @IsDateString()
  leaveDate: Date;

  @ApiProperty({ required: false, default: moment().utc().toISOString() })
  @IsOptional()
  @IsDateString()
  interceptDate: Date;
}

export class UpdateDetailMember
  extends UpdateConfigMember
  implements IUpdateDetailMember
{
  @ApiProperty({ required: false })
  @IsOptional()
  @MinLength(4)
  @IsString()
  password: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @MinLength(4)
  @IsString()
  exchangePassword: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isInterested: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  verifiedPhone: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  level: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @MinLength(1)
  @MaxLength(1)
  @IsString()
  group: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  role: string;
}

export class CreateMemberDto implements IPayloadCreateMember {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  username: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  nickName: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  fullName: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  password: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  exchangePassword: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MinLength(9)
  phone: string;

  @ApiProperty({ required: false, enum: GenderEnum })
  @IsOptional()
  @IsEnum(GenderEnum)
  gender: GenderEnum;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isInterested: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  bankName: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  bankOwnerName: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  bankAccountNumber: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID(versionUUID)
  role: string;
}

export class LogoutMemberDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsUUID(versionUUID)
  memberId: string;
}
