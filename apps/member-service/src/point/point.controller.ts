import { ServiceName } from '@lib/common/enums';
import {
  IPointInsert,
  IPointMessage,
  PointLogQuery,
} from '@lib/common/interfaces/modules/point';
import { getPattern } from '@lib/utils/helpers';
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { PointService } from './point.service';

@Controller()
export class PointController {
  static prefixCmd = [ServiceName.MEMBER_SERVICE, PointController.name];
  constructor(private readonly pointService: PointService) {}

  @MessagePattern({
    cmd: getPattern(
      PointController.prefixCmd,
      PointController.prototype.getList.name,
    ),
  })
  getList(message: IPointMessage) {
    return this.pointService.getList(message.payload as PointLogQuery);
  }

  @MessagePattern({
    cmd: getPattern(
      PointController.prefixCmd,
      PointController.prototype.insert.name,
    ),
  })
  insert(message: IPointMessage) {
    return this.pointService.insertPoint(
      message.payload as IPointInsert,
      message.request,
    );
  }
}
