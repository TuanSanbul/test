import { ServiceName } from '@lib/common/enums';
import {
  IMoneyInsert,
  IMoneyMessage,
  MoneyQuery,
} from '@lib/common/interfaces/modules/money';
import { getPattern } from '@lib/utils/helpers';
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { MoneyService } from './money.service';

@Controller()
export class MoneyController {
  static prefixCmd = [ServiceName.MEMBER_SERVICE, MoneyController.name];
  constructor(private readonly moneyService: MoneyService) {}

  @MessagePattern({
    cmd: getPattern(
      MoneyController.prefixCmd,
      MoneyController.prototype.getList.name,
    ),
  })
  getList(message: IMoneyMessage) {
    return this.moneyService.getList(message.payload as MoneyQuery);
  }

  @MessagePattern({
    cmd: getPattern(
      MoneyController.prefixCmd,
      MoneyController.prototype.insert.name,
    ),
  })
  insert(message: IMoneyMessage) {
    return this.moneyService.insertMoney(
      message.payload as IMoneyInsert,
      message.request,
    );
  }
}
