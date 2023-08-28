import { ServiceName } from '@lib/common/enums';
import { IMessage, IPatternMessage } from '@lib/common/interfaces';
import { BaseGatewayController } from '@lib/core/base';
import { ServiceProviderBuilder } from '@lib/core/message-handler';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { MessageSettingDto, UnavailableWordsDto, UpdateWordsDto } from './dto';

@Controller('preference/config-words/')
@ApiTags('Config Service')
@ApiBearerAuth()
export class ConfigWordsController extends BaseGatewayController {
  constructor(private readonly serviceClient: ServiceProviderBuilder) {
    super(ConfigWordsController.name, ServiceName.CONFIG_SERVICE);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  getUnavailableWords(): Promise<UnavailableWordsDto> {
    const functionName =
      ConfigWordsController.prototype.getUnavailableWords.name;
    const pattern: IPatternMessage = {
      cmd: this.prefixCmd(functionName),
    };

    return this.serviceClient.sendMessage(
      ServiceName.CONFIG_SERVICE,
      {},
      pattern,
    );
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  setUnavailableWords(@Body() payload: UnavailableWordsDto) {
    const functionName =
      ConfigWordsController.prototype.setUnavailableWords.name;
    const pattern: IPatternMessage = {
      cmd: this.prefixCmd(functionName),
    };
    const message: IMessage = { payload };

    return this.serviceClient.sendMessage(
      ServiceName.CONFIG_SERVICE,
      message,
      pattern,
    );
  }

  @Get('message-setting')
  @HttpCode(HttpStatus.OK)
  getMessageSetting(): Promise<MessageSettingDto> {
    const functionName = ConfigWordsController.prototype.getMessageSetting.name;
    const pattern: IPatternMessage = {
      cmd: this.prefixCmd(functionName),
    };

    return this.serviceClient.sendMessage(
      ServiceName.CONFIG_SERVICE,
      {},
      pattern,
    );
  }

  @Post('reply-message')
  @HttpCode(HttpStatus.OK)
  setReplyMessage(@Body() payload: UpdateWordsDto) {
    const functionName = ConfigWordsController.prototype.setReplyMessage.name;
    const pattern: IPatternMessage = {
      cmd: this.prefixCmd(functionName),
    };
    const message: IMessage = { payload };

    return this.serviceClient.sendMessage(
      ServiceName.CONFIG_SERVICE,
      message,
      pattern,
    );
  }

  @Post('register-message')
  @HttpCode(HttpStatus.OK)
  setRegisterMessage(@Body() payload: UpdateWordsDto) {
    const functionName =
      ConfigWordsController.prototype.setRegisterMessage.name;
    const pattern: IPatternMessage = {
      cmd: this.prefixCmd(functionName),
    };
    const message: IMessage = { payload };
    return this.serviceClient.sendMessage(
      ServiceName.CONFIG_SERVICE,
      message,
      pattern,
    );
  }
}
