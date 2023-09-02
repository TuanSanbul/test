import { localIp } from '@lib/common/constants';
import { ServiceName } from '@lib/common/enums';
import { ICustomRequest, IPatternMessage } from '@lib/common/interfaces';
import { BaseGatewayController } from '@lib/core/base';
import { ServiceProviderBuilder } from '@lib/core/message-handler';
import { Body, Controller, Post, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateWithdrawalDto } from './dto';

@Controller('withdrawal')
@ApiTags('Member Service')
@ApiBearerAuth()
export class WithdrawalController extends BaseGatewayController {
  constructor(private readonly serviceClient: ServiceProviderBuilder) {
    super(WithdrawalController.name, ServiceName.MEMBER_SERVICE);
  }

  @Post('create')
  async createWithdrawal(
    @Req() request: ICustomRequest,
    @Body() body: CreateWithdrawalDto,
  ) {
    const functionName = WithdrawalController.prototype.createWithdrawal.name;
    const pattern: IPatternMessage = {
      cmd: this.prefixCmd(functionName),
    };
    const ipAddress = request.connection.remoteAddress.split(':').pop();
    const { user } = request;
    const message = {
      payload: {
        ipAddress: ipAddress === '1' ? localIp : ipAddress,
        request: user,
        ...body,
      },
    };

    return this.serviceClient.sendMessage(this.serviceName, message, pattern);
  }
}
