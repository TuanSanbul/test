import { ServiceName } from '@lib/common/enums';
import { IConnStatusMessage } from '@lib/common/interfaces/modules/connection-status';
import { IMutationResponse } from '@lib/common/interfaces/response';
import { IMessage } from '@lib/common/interfaces/services';
import { ResponseResult } from '@lib/common/types';
import { getPattern } from '@lib/utils/helpers';
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ConnectionStatusService } from './connection-status.service';

@Controller()
export class ConnectionStatusController {
  static prefixCmd = [
    ServiceName.COMMUNICATE_SERVICE,
    ConnectionStatusController.name,
  ];
  constructor(private readonly postService: ConnectionStatusService) {}

  @MessagePattern({
    cmd: getPattern(
      ConnectionStatusController.prefixCmd,
      ConnectionStatusController.prototype.getConnStatus.name,
    ),
  })
  getConnStatus(
    message: IMessage<IConnStatusMessage>,
  ): Promise<ResponseResult<IMutationResponse>> {
    const { payload } = message;
    return this.postService.getConnStatus(payload);
  }
}
