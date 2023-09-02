import { ServiceName } from '@lib/common/enums';
import { Role } from '@lib/core/databases/postgres';
import { getPattern } from '@lib/utils/helpers';
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { RoleService } from './role.service';
import { IMessage, IQueryMessage } from '@lib/common/interfaces';
import { ResponseResult } from '@lib/common/types';

@Controller()
export class RoleController {
  static prefixCmd = [ServiceName.MEMBER_SERVICE, RoleController.name];
  constructor(private readonly roleService: RoleService) {}

  @MessagePattern({
    cmd: getPattern(
      RoleController.prefixCmd,
      RoleController.prototype.getOrCreate.name,
    ),
  })
  getOrCreate(groupName: string): Promise<Role> {
    return this.roleService.getOrCreate(groupName);
  }

  @MessagePattern({
    cmd: getPattern(
      RoleController.prefixCmd,
      RoleController.prototype.getById.name,
    ),
  })
  getById(message: IMessage): Promise<Role> {
    const { id } = message;
    return this.roleService.getById(id);
  }

  @MessagePattern({
    cmd: getPattern(
      RoleController.prefixCmd,
      RoleController.prototype.getListRole.name,
    ),
  })
  getListRole(
    message: IMessage<IQueryMessage<Role>>,
  ): Promise<ResponseResult<Role[]>> {
    const { payload } = message;
    return this.roleService.getListRole(payload);
  }
}
