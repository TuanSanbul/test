import { ServiceName } from '@lib/common/enums';
import { IMessage, IPaginationResponse } from '@lib/common/interfaces';
import { IQueryOrder } from '@lib/common/interfaces/modules/order';
import { ResponseResult } from '@lib/common/types';
import { Order } from '@lib/core/databases/postgres';
import { getPattern } from '@lib/utils/helpers';
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { OrderListingService } from './order-listing.service';

@Controller()
export class OrderListingController {
  static prefixCmd = [ServiceName.ORDER_SERVICE, OrderListingController.name];
  constructor(private readonly orderListingService: OrderListingService) {}

  @MessagePattern({
    cmd: getPattern(
      OrderListingController.prefixCmd,
      OrderListingController.prototype.getListOrder.name,
    ),
  })
  getListOrder(
    message: IMessage<IQueryOrder>,
  ): Promise<ResponseResult<IPaginationResponse<Order>>> {
    const { payload } = message;
    return this.orderListingService.getListOrder(payload);
  }
}
