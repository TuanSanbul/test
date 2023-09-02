import { ServiceName } from '@lib/common/enums';
import { IMessage, IQueryMessage } from '@lib/common/interfaces';
import { ResponseResult } from '@lib/common/types';
import { Member } from '@lib/core/databases/postgres';
import { getPattern } from '@lib/utils/helpers';
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ProfileService } from './profile.service';

@Controller()
export class ProfileController {
  static prefixCmd = [ServiceName.MEMBER_SERVICE, ProfileController.name];
  constructor(private readonly profileService: ProfileService) {}

  @MessagePattern({
    cmd: getPattern(
      ProfileController.prefixCmd,
      ProfileController.prototype.getMembers.name,
    ),
  })
  getMembers(
    message: IMessage<IQueryMessage<Member>>,
  ): Promise<ResponseResult<Member[]>> {
    const { payload } = message;
    return this.profileService.getMembers(payload);
  }

  @MessagePattern({
    cmd: getPattern(
      ProfileController.prefixCmd,
      ProfileController.prototype.getByIds.name,
    ),
  })
  getByIds(
    message: IMessage<{ ids: string[] }>,
  ): Promise<ResponseResult<Member[]>> {
    const { ids } = message.payload;
    return this.profileService.getByIds(ids);
  }
}
