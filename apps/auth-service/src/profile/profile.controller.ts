import { ResponseResult } from '@lib/common/types';
import { Member } from '@lib/core/databases/postgres';
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ProfileService } from './profile.service';

@Controller()
export class ProfileController {
  static cmd = 'auth.';
  constructor(private readonly profileService: ProfileService) {}

  @MessagePattern({ cmd: ProfileController.cmd + 'getProfile' })
  getProfile(memberId: string): Promise<ResponseResult<Member>> {
    return this.profileService.getProfile(memberId);
  }
}
