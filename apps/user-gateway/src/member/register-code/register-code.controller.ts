import { ServiceName } from '@lib/common/enums';
import { IMessage, IPatternMessage } from '@lib/common/interfaces';
import { BaseGatewayController } from '@lib/core/base';
import { ServiceProviderBuilder } from '@lib/core/message-handler';
import { Controller, Get, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('register-code')
@ApiTags('Member Service')
@ApiBearerAuth()
export class RegisterCodeController extends BaseGatewayController {
  constructor(private readonly serviceClient: ServiceProviderBuilder) {
    super(RegisterCodeController.name, ServiceName.MEMBER_SERVICE);
  }

  @Get(':code')
  checkExistCode(@Param('code') code: string) {
    const functionName = RegisterCodeController.prototype.checkExistCode.name;
    const pattern: IPatternMessage = {
      cmd: this.prefixCmd(functionName),
    };
    const message: IMessage = { payload: code };
    return this.serviceClient.sendMessage(
      ServiceName.MEMBER_SERVICE,
      message,
      pattern,
    );
  }
}
