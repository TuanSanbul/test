import { ServiceName } from '@lib/common/enums';
import { IMessage } from '@lib/common/interfaces';
import { IGetHistory } from '@lib/common/interfaces/modules/transaction';
import { getPattern } from '@lib/utils/helpers';
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { HistoryService } from './history.service';

@Controller()
export class HistoryController {
  static prefixCmd = [ServiceName.MEMBER_SERVICE, HistoryController.name];
  constructor(private readonly withdrawalService: HistoryService) {}

  @MessagePattern({
    cmd: getPattern(
      HistoryController.prefixCmd,
      HistoryController.prototype.getHistory.name,
    ),
  })
  getHistory(message: IMessage<IGetHistory>) {
    const { payload } = message;
    return this.withdrawalService.getHistory(payload);
  }
}
