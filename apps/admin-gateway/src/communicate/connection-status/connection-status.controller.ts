import { ServiceName } from '@lib/common/enums';
import { IPatternMessage } from '@lib/common/interfaces/services';
import { BaseGatewayController } from '@lib/core/base';
import { ServiceProviderBuilder } from '@lib/core/message-handler';
import { TimeFilterDto } from '@lib/utils/validation-pipe';
import { Body, Controller, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ConnStatusDto } from './dto';

@Controller('connection-status')
@ApiTags('Communicate Service')
@ApiBearerAuth()
export class ConnectionStatusController extends BaseGatewayController {
  constructor(private readonly serviceClient: ServiceProviderBuilder) {
    super(ConnectionStatusController.name, ServiceName.COMMUNICATE_SERVICE);
  }

  @Post('listing')
  async getConnStatus(
    @Body() payload: ConnStatusDto,
    @Query() query: TimeFilterDto,
  ) {
    const functionName =
      ConnectionStatusController.prototype.getConnStatus.name;
    const pattern: IPatternMessage = {
      cmd: this.prefixCmd(functionName),
    };

    const message = { payload: Object.assign(payload, query) };

    return this.serviceClient.sendMessage(
      ServiceName.COMMUNICATE_SERVICE,
      message,
      pattern,
    );
  }
}