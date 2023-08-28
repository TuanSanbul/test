import { ServiceName } from '@lib/common/enums';
import { BaseGatewayController } from '@lib/core/base';
import { ServiceProviderBuilder } from '@lib/core/message-handler';
import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller()
@ApiTags('Order Service')
@ApiBearerAuth()
export class OrderController extends BaseGatewayController {
  constructor(private readonly serviceClient: ServiceProviderBuilder) {
    super(OrderController.name, ServiceName.ORDER_SERVICE);
  }
}
