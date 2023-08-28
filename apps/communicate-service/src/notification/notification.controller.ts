import { ServiceName } from '@lib/common/enums';
import {
  ICommunication,
  IGetDetailNotification,
} from '@lib/common/interfaces/modules/communicate';
import { IQueryMessage } from '@lib/common/interfaces/request';
import {
  IMutationResponse,
  IPaginationResponse,
} from '@lib/common/interfaces/response';
import { IMessage } from '@lib/common/interfaces/services';
import { ResponseResult } from '@lib/common/types';
import { Communicate, Member } from '@lib/core/databases/postgres';
import { getPattern } from '@lib/utils/helpers';
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { NotificationService } from './notification.service';

@Controller()
export class NotificationController {
  static prefixCmd = [
    ServiceName.COMMUNICATE_SERVICE,
    NotificationController.name,
  ];
  constructor(private readonly notificationService: NotificationService) {}

  @MessagePattern({
    cmd: getPattern(
      NotificationController.prefixCmd,
      NotificationController.prototype.createNotification.name,
    ),
  })
  createNotification(
    message: IMessage<ICommunication>,
  ): Promise<ResponseResult<IMutationResponse>> {
    const { payload } = message;
    return this.notificationService.createNotification(payload);
  }

  @MessagePattern({
    cmd: getPattern(
      NotificationController.prefixCmd,
      NotificationController.prototype.getList.name,
    ),
  })
  getList(
    message: IMessage<IQueryMessage<Communicate & Member>>,
  ): Promise<ResponseResult<IPaginationResponse<Communicate>>> {
    const { payload } = message;
    return this.notificationService.getList(payload);
  }

  @MessagePattern({
    cmd: getPattern(
      NotificationController.prefixCmd,
      NotificationController.prototype.updateNotification.name,
    ),
  })
  updateNotification(
    message: IMessage<Partial<ICommunication>>,
  ): Promise<ResponseResult<IMutationResponse>> {
    const { id, payload } = message;
    return this.notificationService.updateNotification(id, payload);
  }

  @MessagePattern({
    cmd: getPattern(
      NotificationController.prefixCmd,
      NotificationController.prototype.getOneById.name,
    ),
  })
  getOneById(
    message: IMessage<IGetDetailNotification>,
  ): Promise<ResponseResult<Communicate>> {
    const { payload } = message;
    return this.notificationService.getOneById(payload);
  }

  @MessagePattern({
    cmd: getPattern(
      NotificationController.prefixCmd,
      NotificationController.prototype.softDeleteNotification.name,
    ),
  })
  softDeleteNotification(
    message: IMessage<{ ids: string[] }>,
  ): Promise<ResponseResult<IMutationResponse>> {
    const { ids = [] } = message.payload;
    return this.notificationService.softDeleteNotification(ids);
  }
}
