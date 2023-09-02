import { ServiceName } from '@lib/common/enums';
import { IPatternMessage } from '@lib/common/interfaces/services';
import { BaseGatewayController } from '@lib/core/base';
import { ServiceProviderBuilder } from '@lib/core/message-handler';
import { Body, Controller, Post, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { CreateDepositDto } from './dto';

@Controller('deposit')
@ApiTags('Calculator Service')
@ApiBearerAuth()
export class DepositController extends BaseGatewayController {
  constructor(private readonly serviceClient: ServiceProviderBuilder) {
    super(DepositController.name, ServiceName.CALCULATE_SERVICE);
  }

  @Post('create')
  async createDeposit(@Req() request: Request, @Body() body: CreateDepositDto) {
    const functionName = DepositController.prototype.createDeposit.name;
    const pattern: IPatternMessage = {
      cmd: this.prefixCmd(functionName),
    };
    const ipAddress = request.connection.remoteAddress.split(':').pop();

    const message = {
      payload: {
        ipAddress,
        ...body,
      },
    };

    return this.serviceClient.sendMessage(
      ServiceName.CALCULATE_SERVICE,
      message,
      pattern,
    );
  }
}
