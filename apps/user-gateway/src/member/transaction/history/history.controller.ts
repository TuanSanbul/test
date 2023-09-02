import { ServiceName } from '@lib/common/enums';
import { IMessage, IPatternMessage } from '@lib/common/interfaces';
import { BaseGatewayController } from '@lib/core/base';
import { ServiceProviderBuilder } from '@lib/core/message-handler';
import { TimeFilterDto } from '@lib/utils/validation-pipe';
import { Body, Controller, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { QueryFieldsHistoryDetail } from './dto';

@Controller('history')
@ApiTags('Member Service')
@ApiBearerAuth()
export class HistoryController extends BaseGatewayController {
  constructor(private readonly serviceClient: ServiceProviderBuilder) {
    super(HistoryController.name, ServiceName.MEMBER_SERVICE);
  }

  @Post(':id')
  async getHistory(
    @Query() query: TimeFilterDto,
    @Body() body: QueryFieldsHistoryDetail,
  ) {
    const functionName = HistoryController.prototype.getHistory.name;
    const message: IMessage = { payload: Object.assign(query, body) };

    const pattern: IPatternMessage = { cmd: this.prefixCmd(functionName) };
    return this.serviceClient.sendMessage(this.serviceName, message, pattern);
  }
}
