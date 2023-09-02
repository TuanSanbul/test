import { ServiceName } from '@lib/common/enums';
import { IPatternMessage } from '@lib/common/interfaces';
import { BaseGatewayController } from '@lib/core/base';
import { ServiceProviderBuilder } from '@lib/core/message-handler';
import { TimeFilterDto } from '@lib/utils/validation-pipe';
import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  CouponConfigUpdateDto,
  CouponUsedDto,
  QueryBodyCouponDto,
} from './dto';

@Controller('coupon')
@ApiTags('Member Service')
@ApiBearerAuth()
export class CouponController extends BaseGatewayController {
  constructor(private readonly serviceClient: ServiceProviderBuilder) {
    super(CouponController.name, ServiceName.MEMBER_SERVICE);
  }

  @Get('list-items')
  async getListItems() {
    const functionName = CouponController.prototype.getListItems.name;
    const message = {};

    const pattern: IPatternMessage = { cmd: this.prefixCmd(functionName) };
    return this.serviceClient.sendMessage(this.serviceName, message, pattern);
  }

  @Post('logs/listing')
  async getListLogs(
    @Query() query: TimeFilterDto,
    @Body() body: QueryBodyCouponDto,
  ) {
    const functionName = CouponController.prototype.getListLogs.name;
    const message = { payload: Object.assign(query, body) };

    const pattern: IPatternMessage = { cmd: this.prefixCmd(functionName) };
    return this.serviceClient.sendMessage(this.serviceName, message, pattern);
  }

  @Post('config')
  async updateConfig(@Body() body: CouponConfigUpdateDto) {
    const functionName = CouponController.prototype.updateConfig.name;
    const message = { payload: body };

    const pattern: IPatternMessage = { cmd: this.prefixCmd(functionName) };
    return this.serviceClient.sendMessage(this.serviceName, message, pattern);
  }

  @Post('used')
  async usedCoupon(@Body() body: CouponUsedDto) {
    const functionName = CouponController.prototype.usedCoupon.name;
    const message = { payload: { id: body.couponLogId } };

    const pattern: IPatternMessage = { cmd: this.prefixCmd(functionName) };
    return this.serviceClient.sendMessage(this.serviceName, message, pattern);
  }
}
