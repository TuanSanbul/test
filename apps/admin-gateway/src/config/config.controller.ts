import { ServiceName } from '@lib/common/enums';
import { IPatternMessage } from '@lib/common/interfaces/services';
import { BaseGatewayController } from '@lib/core/base';
import { ServiceProviderBuilder } from '@lib/core/message-handler';
import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('config')
@ApiTags('Config Service')
@ApiBearerAuth()
export class ConfigController extends BaseGatewayController {
  constructor(private readonly serviceClient: ServiceProviderBuilder) {
    super(ConfigController.name, ServiceName.CONFIG_SERVICE);
  }

  @Get('health')
  async healthCheck() {
    const pattern: IPatternMessage = { cmd: 'config.healthCheck' };
    return this.serviceClient.sendMessage(
      ServiceName.CONFIG_SERVICE,
      {},
      pattern,
    );
  }

  @Get('bank/listing')
  getListBank() {
    const functionName = ConfigController.prototype.getListBank.name;
    const pattern: IPatternMessage = {
      cmd: this.prefixCmd(functionName),
    };

    return this.serviceClient.sendMessage(
      ServiceName.CONFIG_SERVICE,
      {},
      pattern,
    );
  }
}
