import { GenderEnum } from '@lib/common/enums';
import { IRegisterMember } from '@lib/common/interfaces/modules/auth';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import * as moment from 'moment';

export class RegisterDto implements IRegisterMember {
  @ApiProperty({ required: true })
  @IsString()
  recommenderCode: string;

  @ApiProperty({ required: true })
  @MinLength(4)
  @IsString()
  nickName: string;

  @ApiProperty({ required: true })
  @IsOptional()
  @MinLength(4)
  @IsString()
  fullName: string;

  @ApiProperty({ required: false, default: moment().utc().toISOString() })
  @IsOptional()
  @IsDateString()
  doB: Date;

  @ApiProperty({
    required: false,
    enum: GenderEnum,
    default: GenderEnum.Male,
  })
  @IsOptional()
  @IsEnum(GenderEnum)
  gender: GenderEnum;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEmail()
  email: string;

  @ApiProperty({ required: true })
  @MinLength(9)
  @IsString()
  phone: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  address: string;

  @ApiProperty({ required: true })
  @MinLength(4)
  @IsString()
  username: string;

  @ApiProperty({ required: true })
  @MinLength(4)
  @IsString()
  password: string;

  @ApiProperty({ required: true })
  @MinLength(4)
  @IsString()
  exchangePassword: string;

  @ApiProperty({ required: true })
  @IsString()
  bankName: string;

  @ApiProperty({ required: true })
  @IsString()
  bankOwnerName: string;

  @ApiProperty({ required: true })
  @IsString()
  bankAccountNumber: string;
}
