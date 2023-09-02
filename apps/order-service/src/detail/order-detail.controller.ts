import { ServiceName } from '@lib/common/enums';
import { Controller } from '@nestjs/common';
import { OrderDetailService } from './order-detail.service';

@Controller()
export class OrderDetailController {
  static prefixCmd = [ServiceName.ORDER_SERVICE, OrderDetailController.name];
  constructor(private readonly orderDetailService: OrderDetailService) {}
}
