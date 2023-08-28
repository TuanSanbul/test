import { HealthService } from '@lib/utils/modules';
import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@Controller('gateway')
@ApiTags('Admin Gateway')
export class AdminGatewayController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  healthCheck() {
    return this.healthService.healthCheck();
  }
}
