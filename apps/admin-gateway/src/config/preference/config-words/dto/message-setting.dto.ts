import {
  IMessageSetting,
  IUpdateMessage,
} from '@lib/common/interfaces/modules/preference';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class MessageSettingDto implements IMessageSetting {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsString()
  messageWelcome: string;

  @ApiProperty()
  @IsString()
  messageReply: string;
}

export class UpdateWordsDto implements IUpdateMessage {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsString()
  message: string;
}
