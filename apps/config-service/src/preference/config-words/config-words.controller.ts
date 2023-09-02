import { ServiceName } from '@lib/common/enums';
import {
  IUnavailableWord,
  IUpdateMessage,
} from '@lib/common/interfaces/modules/preference';
import { getPattern } from '@lib/utils/helpers';
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';
import { ConfigWordsService } from './config-words.service';
import { IMessage } from '@lib/common/interfaces';

@Controller()
@ApiTags('Config Service')
export class ConfigWordsController {
  static prefixCmd = [ServiceName.CONFIG_SERVICE, ConfigWordsController.name];
  constructor(private readonly configWordsService: ConfigWordsService) {}

  @MessagePattern({
    cmd: getPattern(
      ConfigWordsController.prefixCmd,
      ConfigWordsController.prototype.getUnavailableWords.name,
    ),
  })
  getUnavailableWords() {
    return this.configWordsService.getUnavailableWords();
  }

  @MessagePattern({
    cmd: getPattern(
      ConfigWordsController.prefixCmd,
      ConfigWordsController.prototype.setUnavailableWords.name,
    ),
  })
  setUnavailableWords(message: IMessage<IUnavailableWord>) {
    const { payload } = message;
    return this.configWordsService.setUnavailableWords(payload);
  }

  @MessagePattern({
    cmd: getPattern(
      ConfigWordsController.prefixCmd,
      ConfigWordsController.prototype.getMessageSetting.name,
    ),
  })
  getMessageSetting() {
    return this.configWordsService.getMessageSetting();
  }

  @MessagePattern({
    cmd: getPattern(
      ConfigWordsController.prefixCmd,
      ConfigWordsController.prototype.setRegisterMessage.name,
    ),
  })
  setRegisterMessage(message: IMessage<IUpdateMessage>) {
    const { payload } = message;
    return this.configWordsService.setRegisterMessage(payload);
  }

  @MessagePattern({
    cmd: getPattern(
      ConfigWordsController.prefixCmd,
      ConfigWordsController.prototype.setReplyMessage.name,
    ),
  })
  setReplyMessage(message: IMessage<IUpdateMessage>) {
    const { payload } = message;
    return this.configWordsService.setReplyMessage(payload);
  }
}
