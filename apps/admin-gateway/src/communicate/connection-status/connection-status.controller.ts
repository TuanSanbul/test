import { ServiceName } from '@lib/common/enums';
import { BaseGatewayController } from '@lib/core/base';
import { ServiceProviderBuilder } from '@lib/core/message-handler';
import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('connection-status')
@ApiTags('Communicate Service')
@ApiBearerAuth()
export class ConnectionStatusController extends BaseGatewayController {
  constructor(private readonly serviceClient: ServiceProviderBuilder) {
    super(ConnectionStatusController.name, ServiceName.COMMUNICATE_SERVICE);
  }
}
