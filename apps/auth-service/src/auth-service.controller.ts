import { HealthService } from '@lib/utils/modules';
import { Controller } from '@nestjs/common';

@Controller()
export class AuthServiceController {
  constructor(private readonly healthService: HealthService) {}

}
