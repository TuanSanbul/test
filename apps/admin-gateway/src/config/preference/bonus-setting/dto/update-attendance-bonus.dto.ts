import {
  IUpdateAttendance,
  IUpdateAttendanceBonus,
  IUpdateCommentBonus,
} from '@lib/common/interfaces/modules/preference';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsString, ValidateNested } from 'class-validator';

export class UpdateAttendanceDto implements IUpdateAttendance {
  @ApiProperty()
  @IsNumber()
  rechargeAmount: number;

  @ApiProperty()
  @IsString()
  mainConfigId: string;

  @ApiPropertyOptional({ type: () => [UpdateAttendanceBonusDto] })
  @Type(() => UpdateAttendanceBonusDto)
  @ValidateNested({ each: true })
  @IsArray()
  attendanceBonus: UpdateAttendanceBonusDto[];

  @ApiPropertyOptional({ type: () => [UpdateBulletinBonusDto] })
  @Type(() => UpdateBulletinBonusDto)
  @ValidateNested({ each: true })
  @IsArray()
  bulletinBonus: UpdateBulletinBonusDto[];

  @ApiPropertyOptional({ type: () => [UpdateCommentBonusDto] })
  @Type(() => UpdateCommentBonusDto)
  @ValidateNested({ each: true })
  @IsArray()
  commentBonus: UpdateCommentBonusDto[];
}

export class UpdateAttendanceBonusDto implements IUpdateAttendanceBonus {
  @ApiProperty({ type: Number })
  @IsNumber()
  daysOfAttendance: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  reward: number;

  @ApiProperty({ type: String })
  @IsString()
  id: string;
}

export class UpdateCommentBonusDto implements IUpdateCommentBonus {
  @ApiProperty({ type: Number })
  @IsNumber()
  quantity: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  reward: number;

  @ApiProperty({ type: String })
  @IsString()
  id: string;
}

export class UpdateBulletinBonusDto extends UpdateCommentBonusDto {}
