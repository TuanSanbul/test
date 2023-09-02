import {
  IDepositConfig,
  IListDepositConfig,
  IMainConfig,
  IMemberConfig,
  INoticeConfig,
  ISiteSettings,
} from '@lib/common/interfaces/modules/preference';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';

export class NoticeConfigDto implements Partial<INoticeConfig> {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  noticeConfigId: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  noticeMessage: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  noticeTitle: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isUseNotice: boolean;
}

export class CreateNoticeConfigDto implements Partial<INoticeConfig> {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  noticeTitle: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  noticeMessage: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isUseNotice: boolean;
}

export class QueryMainConfigDto {
  @ApiProperty({ required: true, type: String })
  @IsString()
  id: string;
}

export class CreateMemberConfigDto implements Partial<IMemberConfig> {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isAcceptRegisterMember: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isInstantApproval: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  maximumRating: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  memberRegisterGroup: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  messageReply: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  memberRegisterLevel: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isSignUpLetter: boolean;
}

export class UpdateMemberConfigDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  memberConfigId: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isAcceptRegisterMember: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isInstantApproval: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  maximumRating: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  memberRegisterGroup: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  memberRegisterLevel: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isSignUpLetter: boolean;
}

export class CreateMainConfigDto implements Partial<IMainConfig> {
  @ApiProperty()
  @IsString()
  companyName: string;

  @ApiProperty()
  @IsString()
  realtimeNotice: string;

  @ApiProperty()
  @IsString()
  filterWord: string;

  @ApiProperty()
  @IsString()
  prohibitedWord: string;

  @ApiProperty()
  @IsString()
  memberConfigId: string;

  @ApiProperty()
  @IsString()
  noticeConfigId: string;

  @ApiProperty()
  @IsBoolean()
  firstPointStatus: boolean;

  @ApiProperty()
  @IsNumber()
  limitComboQuantity: number;

  @ApiProperty()
  @IsNumber()
  limitComboOdds: number;

  @ApiProperty()
  @IsNumber()
  rechargeAmount: number;
}
export class DepositSettingDto implements IDepositConfig {
  @ApiProperty({ type: String })
  @MaxLength(1)
  @Matches(/^[A-Z]+$/i)
  type: string;
}

export class DepositSettingArrDto implements IListDepositConfig {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  mainConfigId: string;

  @ApiProperty({ type: () => [DepositSettingDto] })
  @Type(() => DepositSettingDto)
  @IsArray()
  data: DepositSettingDto[];
}

export class SiteSettingsDto implements ISiteSettings {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  mainConfigId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  memberConfigId: string;

  @ApiProperty({ required: false })
  @IsOptional()
  companyName: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  memberRegisterLevel: number;

  @ApiProperty({ required: false })
  @IsOptional()
  realtimeNotice: string;
}
