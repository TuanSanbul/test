import { EGameType, EUserType } from '@lib/common/enums';
import {
  IAttendanceBonus,
  IBonus,
  IComboBonus,
  ICommentBonus,
  ICreateLevelRates,
  ILevelRate,
  ILostBonus,
  IUpdateBonusFolder,
  IUpdateComboBonus,
} from '@lib/common/interfaces/modules/preference';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class CreateBonusDto implements Partial<IBonus> {
  @ApiProperty({ required: true, enum: EUserType })
  @IsEnum(EUserType)
  userType: EUserType;

  @ApiProperty({ required: true, enum: EGameType })
  @IsEnum(EGameType)
  gameType: EGameType;

  @ApiProperty({ required: true, type: Boolean })
  @IsBoolean()
  status: boolean;

  @ApiProperty({ type: Date })
  applyDate: Date;

  @ApiProperty({ required: true })
  @IsString()
  mainConfigId: string;
}

export class BonusDto extends CreateBonusDto {
  @ApiProperty({ type: String })
  @IsString()
  id: string;
}

class LevelRateDto implements ILevelRate {
  @ApiProperty()
  @IsOptional()
  @IsString()
  id: string;

  @ApiProperty({ required: true })
  @IsNumber()
  level: number;

  @ApiProperty({ required: true })
  @IsNumber()
  rate: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  maxWinning: number;
}

export class UpdateBonusDto implements Partial<IBonus> {
  @ApiProperty({ enum: EUserType })
  @IsOptional()
  @IsEnum(EUserType)
  userType: EUserType;

  @ApiProperty({ enum: EGameType })
  @IsOptional()
  @IsEnum(EGameType)
  gameType: EGameType;

  @ApiProperty({ type: Boolean })
  @IsOptional()
  @IsBoolean()
  status: boolean;

  @ApiProperty({ type: Date })
  @IsOptional()
  applyDate: Date;

  @ApiProperty({ required: true })
  @IsString()
  id: string;

  @ApiPropertyOptional({ type: () => [LevelRateDto] })
  @Type(() => LevelRateDto)
  @ValidateNested({ each: true })
  @IsArray()
  levelRates: LevelRateDto[];
}

export class UpdateGameBonusDto implements ILostBonus {
  @ApiProperty({ type: UpdateBonusDto, required: false })
  @Type(() => UpdateBonusDto)
  @ValidateNested()
  user: UpdateBonusDto;

  @ApiProperty({ type: UpdateBonusDto, required: false })
  @Type(() => UpdateBonusDto)
  @ValidateNested()
  recommender: UpdateBonusDto;
}

export class UpdateBonusFolderDto implements IUpdateBonusFolder {
  @ApiProperty()
  @IsNumber()
  limitComboQuantity: number;

  @ApiProperty()
  @IsNumber()
  limitComboOdds: number;

  @ApiProperty()
  @IsString()
  mainConfigId: string;

  @ApiPropertyOptional({ type: () => [UpdateComboBonusDto] })
  @Type(() => UpdateComboBonusDto)
  @ValidateNested({ each: true })
  @IsArray()
  comboBonus: UpdateComboBonusDto[];
}

export class UpdateComboBonusDto implements IUpdateComboBonus {
  @ApiProperty({ type: Number })
  @IsNumber()
  quantity: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  odds: number;

  @ApiProperty({ type: String })
  @IsString()
  id: string;
}

export class CreateLevelRatesDto implements ICreateLevelRates {
  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  gameConfigId: string;

  @ApiProperty({ type: () => [LevelRateDto] })
  @ValidateNested()
  @Type(() => LevelRateDto)
  @IsArray()
  data: LevelRateDto[];
}

export class ComboBonusDto implements IComboBonus {
  @ApiProperty({ type: Number })
  @IsNumber()
  quantity: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  odds: number;

  @ApiProperty({ type: String })
  @IsString()
  mainConfigId: string;
}

export class ListBonusDto<T> {
  @ValidateNested()
  @ApiProperty({ type: () => [Object] })
  data: T[];

  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  mainConfigId: string;
}

export class CommentBonusDto implements ICommentBonus {
  @ApiProperty({ type: Number })
  @IsNumber()
  quantity: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  reward: number;

  @ApiProperty({ type: String })
  @IsString()
  mainConfigId: string;
}

export class BulletinBonusDto extends CommentBonusDto {}

export class AttendanceBonusDto implements IAttendanceBonus {
  @ApiProperty({ type: Number })
  @IsNumber()
  daysOfAttendance: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  reward: number;

  @ApiProperty({ type: String })
  @IsString()
  mainConfigId: string;
}

export class QueryMainConfigDto {
  @ApiProperty({ required: true, type: String })
  @IsString()
  id: string;
}
