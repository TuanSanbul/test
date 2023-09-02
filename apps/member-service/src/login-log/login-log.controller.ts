import { ServiceName } from '@lib/common/enums';
import { IMessage, IQueryMessage } from '@lib/common/interfaces';
import { LoginLog } from '@lib/core/databases/mongo';
import { getPattern } from '@lib/utils/helpers';
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { LoginLogService } from './login-log.service';

@Controller()
export class LoginLogController {
  static prefixCmd = [ServiceName.MEMBER_SERVICE, LoginLogController.name];
  constructor(private readonly loginLogService: LoginLogService) {}

  @MessagePattern({
    cmd: getPattern(
      LoginLogController.prefixCmd,
      LoginLogController.prototype.getListLogs.name,
    ),
  })
  getListLogs(message: IMessage<IQueryMessage<LoginLog>>) {
    const { payload } = message;
    return this.loginLogService.getListLogs(payload);
  }
}
