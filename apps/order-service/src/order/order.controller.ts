import { ServiceName } from '@lib/common/enums';
import { IMessage, IMutationResponse } from '@lib/common/interfaces';
import { IPayloadCreateOrder } from '@lib/common/interfaces/modules/order';
import { ResponseResult } from '@lib/common/types';
import { getPattern } from '@lib/utils/helpers';
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { OrderService } from './order.service';

@Controller()
export class OrderController {
  static prefixCmd = [ServiceName.ORDER_SERVICE, OrderController.name];
  constructor(private readonly orderService: OrderService) {}

  @MessagePattern({
    cmd: getPattern(
      OrderController.prefixCmd,
      OrderController.prototype.createOrder.name,
    ),
  })
  createOrder(
    message: IMessage<IPayloadCreateOrder>,
  ): Promise<ResponseResult<IMutationResponse>> {
    const { payload, id } = message;
    return this.orderService.createBetRecord(id, payload);
  }
}
