import { ServiceName } from '@lib/common/enums';
import {
  CouponLogQuery,
  ICouponConfig,
  ICouponExchange,
  ICouponMessage,
  ICouponUsed,
} from '@lib/common/interfaces/modules/coupon';
import { getPattern } from '@lib/utils/helpers';
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { CouponService } from './coupon.service';

@Controller()
export class CouponController {
  static prefixCmd = [ServiceName.MEMBER_SERVICE, CouponController.name];
  constructor(private readonly couponService: CouponService) {}

  @MessagePattern({
    cmd: getPattern(
      CouponController.prefixCmd,
      CouponController.prototype.updateConfig.name,
    ),
  })
  updateConfig(message: ICouponMessage) {
    return this.couponService.updateConfig(message.payload as ICouponConfig);
  }

  @MessagePattern({
    cmd: getPattern(
      CouponController.prefixCmd,
      CouponController.prototype.getListItems.name,
    ),
  })
  getListItems() {
    return this.couponService.getListItems();
  }

  @MessagePattern({
    cmd: getPattern(
      CouponController.prefixCmd,
      CouponController.prototype.getListLogs.name,
    ),
  })
  getListLogs(message: ICouponMessage) {
    return this.couponService.getListLogs(message.payload as CouponLogQuery);
  }

  @MessagePattern({
    cmd: getPattern(
      CouponController.prefixCmd,
      CouponController.prototype.exchange.name,
    ),
  })
  exchange(message: ICouponMessage) {
    return this.couponService.exchange(
      message.payload as ICouponExchange,
      message.request,
    );
  }

  @MessagePattern({
    cmd: getPattern(
      CouponController.prefixCmd,
      CouponController.prototype.usedCoupon.name,
    ),
  })
  usedCoupon(message: ICouponMessage) {
    return this.couponService.used(message.payload as ICouponUsed);
  }
}
