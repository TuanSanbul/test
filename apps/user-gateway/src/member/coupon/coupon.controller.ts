import { Public, UserDecorator } from '@lib/common/decorators';
import { ServiceName } from '@lib/common/enums';
import { IPatternMessage } from '@lib/common/interfaces';
import { IJwtPayload } from '@lib/common/interfaces/modules/auth';
import { BaseGatewayController } from '@lib/core/base';
import { ServiceProviderBuilder } from '@lib/core/message-handler';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CouponExchangeDto } from './dto';

@Controller('coupon')
@ApiTags('Member Service')
export class CouponController extends BaseGatewayController {
  constructor(private readonly serviceClient: ServiceProviderBuilder) {
    super(CouponController.name, ServiceName.MEMBER_SERVICE);
  }

  @Public()
  @Get('list-items')
  async getListItems() {
    const functionName = CouponController.prototype.getListItems.name;
    const message = {};

    const pattern: IPatternMessage = { cmd: this.prefixCmd(functionName) };
    return this.serviceClient.sendMessage(this.serviceName, message, pattern);
  }

  @ApiBearerAuth()
  @Post('exchange')
  async exchange(
    @UserDecorator() user: IJwtPayload,
    @Body() body: CouponExchangeDto,
  ) {
    const functionName = CouponController.prototype.exchange.name;
    const message = { payload: body, request: user };

    const pattern: IPatternMessage = { cmd: this.prefixCmd(functionName) };
    return this.serviceClient.sendMessage(this.serviceName, message, pattern);
  }
}
