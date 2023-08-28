import { UserDecorator } from '@lib/common/decorators';
import { ServiceName } from '@lib/common/enums';
import { IMessage, IPatternMessage } from '@lib/common/interfaces';
import { IJwtPayload } from '@lib/common/interfaces/modules/auth';
import { IRejectWithdrawal } from '@lib/common/interfaces/modules/withdrawal';
import { BaseGatewayController } from '@lib/core/base';
import { ServiceProviderBuilder } from '@lib/core/message-handler';
import { PaginationDTO, TimeFilterDto } from '@lib/utils/validation-pipe';
import { Body, Controller, Param, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { QueryIpAddressDto, QueryWithdrawalDto } from './dto';

@Controller('withdrawal')
@ApiTags('Member Service')
@ApiBearerAuth()
export class WithdrawalController extends BaseGatewayController {
  constructor(private readonly serviceClient: ServiceProviderBuilder) {
    super(WithdrawalController.name, ServiceName.MEMBER_SERVICE);
  }

  @Post('listing')
  async getListWithdrawal(
    @Query() query: TimeFilterDto,
    @Body() body: QueryWithdrawalDto,
  ) {
    const functionName = WithdrawalController.prototype.getListWithdrawal.name;
    const message: IMessage = { payload: Object.assign(query, body) };

    const pattern: IPatternMessage = { cmd: this.prefixCmd(functionName) };
    return this.serviceClient.sendMessage(this.serviceName, message, pattern);
  }

  @Post('ip/listing')
  async getListIpWithdrawal(
    @Query() query: PaginationDTO,
    @Body() body: QueryIpAddressDto,
  ) {
    const functionName =
      WithdrawalController.prototype.getListIpWithdrawal.name;
    const message: IMessage = { payload: Object.assign(query, body) };

    const pattern: IPatternMessage = { cmd: this.prefixCmd(functionName) };
    return this.serviceClient.sendMessage(this.serviceName, message, pattern);
  }

  @Post('approve/:id')
  async approveWithdrawal(@Param('id') id: string) {
    const functionName = WithdrawalController.prototype.approveWithdrawal.name;

    const message = { id };

    const pattern: IPatternMessage = { cmd: this.prefixCmd(functionName) };
    return this.serviceClient.sendMessage(this.serviceName, message, pattern);
  }

  @Post('reject/:id')
  async rejectWithdrawal(
    @Param('id') id: string,
    @UserDecorator() request: IJwtPayload,
  ) {
    const functionName = WithdrawalController.prototype.rejectWithdrawal.name;

    const message: IMessage<IRejectWithdrawal> = { payload: { id, request } };

    const pattern: IPatternMessage = { cmd: this.prefixCmd(functionName) };
    return this.serviceClient.sendMessage(this.serviceName, message, pattern);
  }
}
