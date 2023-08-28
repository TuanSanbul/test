import { UserDecorator } from '@lib/common/decorators';
import { ServiceName } from '@lib/common/enums';
import { IMessage, IPatternMessage } from '@lib/common/interfaces';
import { IJwtPayload } from '@lib/common/interfaces/modules/auth';
import { IApproveDeposit } from '@lib/common/interfaces/modules/deposit';
import { BaseGatewayController } from '@lib/core/base';
import { ServiceProviderBuilder } from '@lib/core/message-handler';
import { PaginationDTO, TimeFilterDto } from '@lib/utils/validation-pipe';
import { Body, Controller, Param, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import {
  QueryBankCheckDto,
  QueryDepositDto,
  QueryIpAddressDto,
  RemoveBankCheckDto,
} from './dto';

@Controller('deposit')
@ApiTags('Member Service')
@ApiBearerAuth()
export class DepositController extends BaseGatewayController {
  constructor(private readonly serviceClient: ServiceProviderBuilder) {
    super(DepositController.name, ServiceName.MEMBER_SERVICE);
  }

  @Post('listing')
  async getListDeposit(
    @Query() query: TimeFilterDto,
    @Body() body: QueryDepositDto,
  ) {
    const functionName = DepositController.prototype.getListDeposit.name;
    const message: IMessage = { payload: Object.assign(query, body) };

    const pattern: IPatternMessage = { cmd: this.prefixCmd(functionName) };
    return this.serviceClient.sendMessage(this.serviceName, message, pattern);
  }

  @Post('ip/listing')
  async getListIpDeposit(
    @Query() query: PaginationDTO,
    @Body() body: QueryIpAddressDto,
  ) {
    const functionName = DepositController.prototype.getListIpDeposit.name;
    const message: IMessage = { payload: Object.assign(query, body) };

    const pattern: IPatternMessage = { cmd: this.prefixCmd(functionName) };
    return this.serviceClient.sendMessage(this.serviceName, message, pattern);
  }

  @Post('bank-check/listing')
  async getBankCheck(
    @Body() body: QueryBankCheckDto,
    @Query() query: PaginationDTO,
  ) {
    const functionName = DepositController.prototype.getBankCheck.name;

    const message: IMessage = { payload: Object.assign(query, body) };

    const pattern: IPatternMessage = { cmd: this.prefixCmd(functionName) };
    return this.serviceClient.sendMessage(this.serviceName, message, pattern);
  }

  @Post('bank-check/remove')
  async removeBankCheck(@Body() payload: RemoveBankCheckDto) {
    const functionName = DepositController.prototype.removeBankCheck.name;

    const message: IMessage = { payload };

    const pattern: IPatternMessage = { cmd: this.prefixCmd(functionName) };
    return this.serviceClient.sendMessage(this.serviceName, message, pattern);
  }

  @Post('approve/:id')
  async approveDeposit(
    @Param('id') id: string,
    @UserDecorator() request: IJwtPayload,
  ) {
    const functionName = DepositController.prototype.approveDeposit.name;

    const message: IMessage<IApproveDeposit> = { payload: { id, request } };

    const pattern: IPatternMessage = { cmd: this.prefixCmd(functionName) };
    return this.serviceClient.sendMessage(this.serviceName, message, pattern);
  }

  @Post('reject/:id')
  async rejectDeposit(@Param('id') id: string) {
    const functionName = DepositController.prototype.rejectDeposit.name;

    const message = { id };

    const pattern: IPatternMessage = { cmd: this.prefixCmd(functionName) };
    return this.serviceClient.sendMessage(this.serviceName, message, pattern);
  }
}
