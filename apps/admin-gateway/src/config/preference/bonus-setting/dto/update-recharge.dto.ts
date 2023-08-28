import {
  IChargeConfigInfo,
  IListRechargeBonus,
  IRechargeBonus,
  IRechargeBonusItem,
  RechargeBonusState,
} from '@lib/common/interfaces/modules/preference';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class RechargeItemDto implements IRechargeBonusItem {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty({ enum: RechargeBonusState })
  @IsOptional()
  @IsEnum(RechargeBonusState)
  type: RechargeBonusState;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  firstRechargePercent: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  rechargePercent: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  rechargeName: string;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  status: boolean;

  @ApiProperty()
  @IsOptional()
  @IsString()
  rechargeBonusId: string;
}

export class UpdateRechargeDto implements IRechargeBonus {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsBoolean()
  status: boolean;

  @ApiProperty({ type: () => [RechargeItemDto] })
  @Type(() => RechargeItemDto)
  @ValidateNested({ each: true })
  @IsArray()
  listItem: RechargeItemDto[];
}

export class MemberConfigInfoDto implements IChargeConfigInfo {
  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  isUseFirstChargeBonus: boolean;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  firstChargePointBonus: number;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  isFCMaxPointApply: boolean;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  firstChargeMaxPoint: number;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  isRCMaxPointApply: boolean;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  RechargeMaxPoint: number;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  isMaxCoinBonusApply: boolean;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  firstChargeCoinBonus: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  rechargeCoinBonus: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  mainConfigId: string;
}

export class UpdateListRechargeDto implements IListRechargeBonus {
  @ApiProperty({ type: MemberConfigInfoDto })
  @Type(() => MemberConfigInfoDto)
  @ValidateNested()
  chargeConfigInfo: MemberConfigInfoDto;

  @ApiProperty({ type: () => [UpdateRechargeDto] })
  @Type(() => UpdateRechargeDto)
  @ValidateNested({ each: true })
  @IsArray()
  rechargeBonus: UpdateRechargeDto[];
}
