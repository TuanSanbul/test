import { ServiceName } from '@lib/common/enums';
import { IPatternMessage } from '@lib/common/interfaces';
import { BaseGatewayController } from '@lib/core/base';
import { ServiceProviderBuilder } from '@lib/core/message-handler';
import { TimeFilterDto } from '@lib/utils/validation-pipe';
import { Body, Controller, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { QueryOrderDto } from './dto';

@Controller()
@ApiTags('Order Service')
@ApiBearerAuth()
export class OrderListingController extends BaseGatewayController {
  constructor(private readonly serviceClient: ServiceProviderBuilder) {
    super(OrderListingController.name, ServiceName.ORDER_SERVICE);
  }

  @Post('listing')
  @ApiBearerAuth()
  async getListOrder(
    @Query() query: TimeFilterDto,
    @Body() body: QueryOrderDto,
  ) {
    const functionName = OrderListingController.prototype.getListOrder.name;
    const message = { payload: Object.assign(body, query) };

    const pattern: IPatternMessage = { cmd: this.prefixCmd(functionName) };
    return this.serviceClient.sendMessage(this.serviceName, message, pattern);
  }
}
