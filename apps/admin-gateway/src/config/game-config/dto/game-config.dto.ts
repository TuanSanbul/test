import { IUpdateGameConfig } from '@lib/common/interfaces/modules/game-config';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';
import { GameTypeDto } from './game-amount.dto';

export class UpdateGameTypeDto extends GameTypeDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  id: string;
}

export class UpdateGameConfigDto implements IUpdateGameConfig {
  @ApiProperty({ type: () => [UpdateGameTypeDto] })
  @Type(() => UpdateGameTypeDto)
  @ValidateNested({ each: true })
  @IsArray()
  data: UpdateGameTypeDto[];
}

export class CreateGameCategory {
  @ApiProperty()
  @IsString()
  name: string;
}
