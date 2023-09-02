import { TimerDto } from '@lib/common/dto';
import { ServiceName } from '@lib/common/enums';
import { IPatternMessage } from '@lib/common/interfaces';
import { BaseGatewayController } from '@lib/core/base';
import { ServiceProviderBuilder } from '@lib/core/message-handler';
import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { QueryBodyPartnerDto } from './dto';

@ApiTags('Member Service')
@Controller()
export class PartnerController extends BaseGatewayController {
  constructor(private readonly serviceClient: ServiceProviderBuilder) {
    super(PartnerController.name, ServiceName.MEMBER_SERVICE);
  }

  @Post('partner/logs/listing')
  @ApiBearerAuth()
  getListLog(@Query() query: TimerDto, @Body() payload: QueryBodyPartnerDto) {
    const functionName = PartnerController.prototype.getListLog.name;
    const message = { payload: Object.assign(query, payload) };

    const pattern: IPatternMessage = { cmd: this.prefixCmd(functionName) };
    return this.serviceClient.sendMessage(this.serviceName, message, pattern);
  }

  @Post('partner/settlement/listing')
  @ApiBearerAuth()
  getPartnerSettlement(
    @Query() query: TimerDto,
    @Body() payload: QueryBodyPartnerDto,
  ) {
    const functionName = PartnerController.prototype.getPartnerSettlement.name;
    const message = { payload: Object.assign(query, payload) };

    const pattern: IPatternMessage = { cmd: this.prefixCmd(functionName) };
    return this.serviceClient.sendMessage(this.serviceName, message, pattern);
  }

  @Get('partner-type/list-items')
  getListPartnerType() {
    const functionName = PartnerController.prototype.getListPartnerType.name;
    const message = {};

    const pattern: IPatternMessage = { cmd: this.prefixCmd(functionName) };
    return this.serviceClient.sendMessage(this.serviceName, message, pattern);
  }

  @Post('partner/config')
  setPartnerConfig() {
    const functionName = PartnerController.prototype.setPartnerConfig.name;
    const message = {};

    const pattern: IPatternMessage = { cmd: this.prefixCmd(functionName) };
    return this.serviceClient.sendMessage(this.serviceName, message, pattern);
  }
}
