import { ServiceName } from '@lib/common/enums';
import {
  CoinLogQuery,
  ICoinInsert,
  ICoinMessage,
} from '@lib/common/interfaces/modules/coin';
import { getPattern } from '@lib/utils/helpers';
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { CoinService } from './coin.service';

@Controller()
export class CoinController {
  static prefixCmd = [ServiceName.MEMBER_SERVICE, CoinController.name];
  constructor(private readonly coinService: CoinService) {}

  @MessagePattern({
    cmd: getPattern(
      CoinController.prefixCmd,
      CoinController.prototype.getList.name,
    ),
  })
  getList(message: ICoinMessage) {
    return this.coinService.getList(message.payload as CoinLogQuery);
  }

  @MessagePattern({
    cmd: getPattern(
      CoinController.prefixCmd,
      CoinController.prototype.insertCoin.name,
    ),
  })
  insertCoin(message: ICoinMessage) {
    return this.coinService.insertCoin(
      message.request,
      message.payload as ICoinInsert,
    );
  }
}
