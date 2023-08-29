import { BaseGatewayController } from '@lib/core/base';
import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('connection-status')
@ApiTags('Communicate Service')
@ApiBearerAuth()
export class ConnectionStatusController extends BaseGatewayController {}
