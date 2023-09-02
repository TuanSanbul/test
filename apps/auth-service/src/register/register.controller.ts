import { IRegisterMember } from '@lib/common/interfaces/modules/auth';
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { RegisterService } from './register.service';

@Controller()
export class RegisterController {
  static cmd = 'auth.';
  constructor(private readonly registerService: RegisterService) {}

  @MessagePattern({ cmd: RegisterController.cmd + 'register' })
  register(payload: IRegisterMember) {
    return this.registerService.register(payload);
  }
}
