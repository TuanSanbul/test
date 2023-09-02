import { HealthService } from '@lib/utils/modules';
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class OrderServiceController {
  constructor(private readonly healthService: HealthService) {}

  @MessagePattern({ cmd: 'order.healthCheck' })
  healthCheck() {
    return this.healthService.healthCheck();
  }
}
