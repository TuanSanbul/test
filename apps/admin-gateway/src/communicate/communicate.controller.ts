import { ServiceName } from '@lib/common/enums';
import { IPatternMessage } from '@lib/common/interfaces/services';
import { ServiceProviderBuilder } from '@lib/core/message-handler';
import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@Controller('communicate')
@ApiTags('Communicate Service')
export class CommunicateServiceController {
  constructor(private readonly serviceClient: ServiceProviderBuilder) {}

  @Get('health')
  async healthCheck() {
    const pattern: IPatternMessage = { cmd: 'communicate.healthCheck' };
    return this.serviceClient.sendMessage(
      ServiceName.COMMUNICATE_SERVICE,
      {},
      pattern,
    );
  }
}
