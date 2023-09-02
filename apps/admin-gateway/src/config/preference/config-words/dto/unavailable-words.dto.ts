import { IUnavailableWord } from '@lib/common/interfaces/modules/preference';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UnavailableWordsDto implements IUnavailableWord {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsString()
  filterWord: string;

  @ApiProperty()
  @IsString()
  prohibitedWord: string;
}
