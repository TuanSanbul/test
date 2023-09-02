import { HealthService } from '@lib/utils/modules';
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class MemberServiceController {
  constructor(private readonly healthService: HealthService) {}

  @MessagePattern({ cmd: 'member.healthCheck' })
  healthCheck() {
    return this.healthService.healthCheck();
  }
}
