import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';
import { BlackListService } from './black-list.service';
import {
  IBlackListMember,
  IDeleteBlackListIp,
  IUpdateBlackListIp,
} from '@lib/common/interfaces/modules/blacklist';
import { ServiceName } from '@lib/common/enums';
import { getPattern } from '@lib/utils/helpers';
import { ResponseResult } from '@lib/common/types';
import {
  IMessage,
  IMutationResponse,
  IPaginationResponse,
  IQueryMessage,
} from '@lib/common/interfaces';
import { BlackList, Member } from '@lib/core/databases/postgres';

@Controller()
@ApiTags('Config Service')
export class BlackListController {
  static prefixCmd = [ServiceName.CONFIG_SERVICE, BlackListController.name];

  constructor(private readonly blackListService: BlackListService) {}

  @MessagePattern({
    cmd: getPattern(
      BlackListController.prefixCmd,
      BlackListController.prototype.getListIp.name,
    ),
  })
  getListIp(): Promise<ResponseResult<string[]>> {
    return this.blackListService.getListIp();
  }

  @MessagePattern({
    cmd: getPattern(
      BlackListController.prefixCmd,
      BlackListController.prototype.getListMember.name,
    ),
  })
  getListMember(
    message: IMessage<IQueryMessage<BlackList & Member>>,
  ): Promise<ResponseResult<IPaginationResponse<BlackList>>> {
    const { payload } = message;
    return this.blackListService.getListMember(payload);
  }

  @MessagePattern({
    cmd: getPattern(
      BlackListController.prefixCmd,
      BlackListController.prototype.addIpAddress.name,
    ),
  })
  addIpAddress(
    message: IMessage<IUpdateBlackListIp>,
  ): Promise<ResponseResult<IMutationResponse>> {
    const { payload } = message;

    return this.blackListService.addIpAddress(payload);
  }

  @MessagePattern({
    cmd: getPattern(
      BlackListController.prefixCmd,
      BlackListController.prototype.deleteIpAddress.name,
    ),
  })
  deleteIpAddress(
    message: IMessage<IDeleteBlackListIp>,
  ): Promise<ResponseResult<IMutationResponse>> {
    const { payload } = message;
    return this.blackListService.deleteIpAddress(payload);
  }

  @MessagePattern({
    cmd: getPattern(
      BlackListController.prefixCmd,
      BlackListController.prototype.deleteMember.name,
    ),
  })
  deleteMember(message: IMessage): Promise<ResponseResult<IMutationResponse>> {
    const { id } = message;
    return this.blackListService.deleteMember(id);
  }

  @MessagePattern({
    cmd: getPattern(
      BlackListController.prefixCmd,
      BlackListController.prototype.addMember.name,
    ),
  })
  addMember(
    message: IMessage<IBlackListMember>,
  ): Promise<ResponseResult<IMutationResponse>> {
    const { payload } = message;
    return this.blackListService.addMember(payload);
  }
}
