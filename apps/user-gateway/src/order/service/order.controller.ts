import { UserDecorator } from '@lib/common/decorators';
import { ServiceName } from '@lib/common/enums';
import { IPatternMessage } from '@lib/common/interfaces';
import { IJwtPayload } from '@lib/common/interfaces/modules/auth';
import { BaseGatewayController } from '@lib/core/base';
import { ServiceProviderBuilder } from '@lib/core/message-handler';
import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateOrderDto } from './dto';

@Controller()
@ApiTags('Order Service')
@ApiBearerAuth()
export class OrderController extends BaseGatewayController {
  constructor(private readonly serviceClient: ServiceProviderBuilder) {
    super(OrderController.name, ServiceName.ORDER_SERVICE);
  }

  @Post('create')
  createOrder(
    @UserDecorator() user: IJwtPayload,
    @Body() payload: CreateOrderDto,
  ) {
    const functionName = OrderController.prototype.createOrder.name;
    const pattern: IPatternMessage = {
      cmd: this.prefixCmd(functionName),
    };

    const { memberId, ipAddress } = user;
    const message = {
      id: memberId,
      payload: Object.assign(payload, { ipAddress }),
    };

    return this.serviceClient.sendMessage(
      ServiceName.ORDER_SERVICE,
      message,
      pattern,
    );
  }
}
