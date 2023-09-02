import {
  IGameConfig,
  IGameType,
  IGameAmount,
} from '@lib/common/interfaces/modules/game-config';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class CreateGameConfigDto implements IGameConfig {
  @ApiProperty({ type: () => [GameTypeDto] })
  @Type(() => GameTypeDto)
  @ValidateNested({ each: true })
  @IsArray()
  gameTypes: GameTypeDto[];
}

export class GameTypeDto implements IGameType {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  nameKo: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  order: number;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  isActive: boolean;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  isAutoResult: boolean;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  isAutoRegistration: boolean;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  gameCategoryId: string;
}

export class GameAmountDto implements IGameAmount {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  id: string;
}

export class ListGameAmountDto {
  @ApiProperty({ type: () => [GameAmountDto] })
  @Type(() => GameAmountDto)
  @IsArray()
  data: GameAmountDto[];
}
