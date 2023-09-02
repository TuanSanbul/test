import { ServiceName } from '@lib/common/enums';
import { IPatternMessage } from '@lib/common/interfaces/services';
import { ServiceProviderBuilder } from '@lib/core/message-handler';
import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@Controller('order')
@ApiTags('Order Service')
export class OrderServiceController {
  constructor(private readonly serviceClient: ServiceProviderBuilder) {}

  @Get('health')
  async healthCheck() {
    const pattern: IPatternMessage = { cmd: 'order.healthCheck' };
    return this.serviceClient.sendMessage(
      ServiceName.ORDER_SERVICE,
      {},
      pattern,
    );
  }
}
