import { HealthService } from '@lib/utils/modules';
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class CommunicateServiceController {
  constructor(private readonly healthService: HealthService) {}

  @MessagePattern({ cmd: 'communicate.healthCheck' })
  healthCheck() {
    return this.healthService.healthCheck();
  }
}
