import { ServiceName } from '@lib/common/enums';
import { IMessage } from '@lib/common/interfaces';
import {
  IPayloadCreateMember,
  IQueryMember,
  IQueryMemberIP,
  IUpdateConfigMember,
  IUpdateDetailMember,
  IUpdateMultiMember,
} from '@lib/common/interfaces/modules/member';
import { getPattern } from '@lib/utils/helpers';
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import {
  MemberDetailService,
  MemberIPService,
  MemberListingService,
  MemberMutationService,
} from './services';

@Controller()
export class MemberController {
  static prefixCmd = [ServiceName.MEMBER_SERVICE, MemberController.name];
  constructor(
    private readonly memberListingService: MemberListingService,
    private readonly memberIPService: MemberIPService,
    private readonly memberMutationService: MemberMutationService,
    private readonly memberDetailService: MemberDetailService,
  ) {}

  @MessagePattern({
    cmd: getPattern(
      MemberController.prefixCmd,
      MemberController.prototype.getList.name,
    ),
  })
  getList(message: IMessage<IQueryMember>) {
    const { payload } = message;
    return this.memberListingService.getList(payload);
  }

  @MessagePattern({
    cmd: getPattern(
      MemberController.prefixCmd,
      MemberController.prototype.getMemberConfig.name,
    ),
  })
  getMemberConfig(message: IMessage) {
    const { id } = message;
    return this.memberListingService.getMemberConfig(id);
  }

  @MessagePattern({
    cmd: getPattern(
      MemberController.prefixCmd,
      MemberController.prototype.getDetailConfig.name,
    ),
  })
  getDetailConfig(message: IMessage) {
    const { id } = message;
    return this.memberListingService.getDetailConfig(id);
  }

  @MessagePattern({
    cmd: getPattern(
      MemberController.prefixCmd,
      MemberController.prototype.getListIP.name,
    ),
  })
  getListIP(message: IMessage<IQueryMemberIP>) {
    const { payload } = message;
    return this.memberIPService.getListIP(payload);
  }

  @MessagePattern({
    cmd: getPattern(
      MemberController.prefixCmd,
      MemberController.prototype.updateMultiMember.name,
    ),
  })
  updateMultiMember(
    message: IMessage<{ members: IUpdateMultiMember[]; actorLevel: number }>,
  ) {
    const { members, actorLevel } = message.payload;
    return this.memberMutationService.updateMultiMember(actorLevel, members);
  }

  @MessagePattern({
    cmd: getPattern(
      MemberController.prefixCmd,
      MemberController.prototype.updateConfigMember.name,
    ),
  })
  updateConfigMember(message: IMessage<Partial<IUpdateConfigMember>>) {
    const { id, payload } = message;
    return this.memberMutationService.updateConfigMember(id, payload);
  }

  @MessagePattern({
    cmd: getPattern(
      MemberController.prefixCmd,
      MemberController.prototype.updateDetailMember.name,
    ),
  })
  updateDetailMember(message: IMessage<Partial<IUpdateDetailMember>>) {
    const { id, payload } = message;
    return this.memberMutationService.updateDetailMember(id, payload);
  }

  @MessagePattern({
    cmd: getPattern(
      MemberController.prefixCmd,
      MemberController.prototype.createMember.name,
    ),
  })
  createMember(message: IMessage<IPayloadCreateMember>) {
    const { payload } = message;
    return this.memberMutationService.createMember(payload);
  }

  @MessagePattern({
    cmd: getPattern(
      MemberController.prefixCmd,
      MemberController.prototype.logoutMember.name,
    ),
  })
  logoutMember(message: IMessage) {
    const { id } = message;
    return this.memberMutationService.logoutMember(id);
  }

  @MessagePattern({
    cmd: getPattern(
      MemberController.prefixCmd,
      MemberController.prototype.getHistory.name,
    ),
  })
  getHistory(message: IMessage) {
    const { id } = message;
    return this.memberDetailService.getHistory(id);
  }
}
