import { HealthService } from '@lib/utils/modules';
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class AuthServiceController {
  constructor(private readonly healthService: HealthService) {}

  @MessagePattern({ cmd: 'auth.healthCheck' })
  healthCheck() {
    return this.healthService.healthCheck();
  }
}
