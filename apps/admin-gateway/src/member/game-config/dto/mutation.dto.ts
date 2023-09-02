import { versionUUID } from '@lib/common/constants';
import {
  IPayloadUpdateGameType,
  IPayloadUpdateMemberGameConfig,
} from '@lib/common/interfaces/modules/member';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsUUID,
  ValidateNested,
} from 'class-validator';

export class UpdateGameTypeDto implements IPayloadUpdateGameType {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID(versionUUID)
  id: string;

  @ApiProperty({ required: false, default: false })
  @IsOptional()
  @IsBoolean()
  isAvailability: boolean;

  @ApiProperty({ required: false, default: false })
  @IsOptional()
  @IsBoolean()
  status: boolean;

  @ApiProperty({ required: false, default: 0 })
  @IsOptional()
  @IsNumber()
  maxBetAmount: number;

  @ApiProperty({ required: false, default: 0 })
  @IsOptional()
  @IsNumber()
  maxWinningAmount: number;

  @ApiProperty({ required: false, default: 0 })
  @IsOptional()
  @IsNumber()
  dividendRate: number;

  @ApiProperty({ required: false, default: 0 })
  @IsOptional()
  @IsNumber()
  losingPoint: number;

  @ApiProperty({ required: false, default: 0 })
  @IsOptional()
  @IsNumber()
  referralDropPoint: number;

  @ApiProperty({ required: false, default: 0 })
  @IsOptional()
  @IsNumber()
  miniGameBettingTime: number;
}

export class UpdateMemberGameConfigDto
  implements IPayloadUpdateMemberGameConfig
{
  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID(versionUUID)
  id: string;

  @ApiProperty({ required: false, default: false })
  @IsOptional()
  @IsBoolean()
  status: boolean;

  @ApiProperty({ required: false, default: 0 })
  @IsOptional()
  @IsNumber()
  firstChargePoint: number;

  @ApiProperty({ required: false, default: 0 })
  @IsOptional()
  @IsNumber()
  percentPerCharge: number;

  @ApiProperty({ required: false, default: 0 })
  @IsOptional()
  @IsNumber()
  winOdds: number;

  @ApiProperty({ required: false, default: 0 })
  @IsOptional()
  @IsNumber()
  lossOdds: number;

  @ApiProperty({ required: false, default: 0 })
  @IsOptional()
  @IsNumber()
  handicap: number;

  @ApiProperty({ required: false, default: 0 })
  @IsOptional()
  @IsNumber()
  dividendFor4Folders: number;

  @ApiProperty({ required: false, default: 0 })
  @IsOptional()
  @IsNumber()
  minimumDividendFor4Folders: number;

  @ApiProperty({ required: false, default: 0 })
  @IsOptional()
  @IsNumber()
  liveBetting: number;

  @ApiProperty({ required: false, default: 0 })
  @IsOptional()
  @IsNumber()
  payback: number;

  @ApiProperty({ required: false, type: UpdateGameTypeDto, isArray: true })
  @IsOptional()
  @IsArray()
  @Type(() => UpdateGameTypeDto)
  @ValidateNested({ each: true })
  gameTypeConfigs?: IPayloadUpdateGameType[];
}
