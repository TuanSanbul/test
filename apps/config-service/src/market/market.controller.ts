import { ServiceName } from '@lib/common/enums';
import {
  IMessage,
  IMutationResponse,
  IPaginationResponse,
  IQueryMessage,
} from '@lib/common/interfaces';
import { IUpdateListMarket } from '@lib/common/interfaces/modules/market';
import { ResponseResult } from '@lib/common/types';
import { Market } from '@lib/core/databases/postgres';
import { getPattern } from '@lib/utils/helpers';
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';
import { MarketService } from './market.service';
import { MarketConfig } from '@lib/core/databases/mongo';

@Controller()
@ApiTags('Config Service')
export class MarketController {
  static prefixCmd = [ServiceName.CONFIG_SERVICE, MarketController.name];

  constructor(private readonly marketService: MarketService) {}

  @MessagePattern({
    cmd: getPattern(
      MarketController.prefixCmd,
      MarketController.prototype.getList.name,
    ),
  })
  getList(
    message: IMessage<IQueryMessage<Market>>,
  ): Promise<ResponseResult<IPaginationResponse<Market>>> {
    const { payload } = message;
    return this.marketService.getList(payload);
  }

  @MessagePattern({
    cmd: getPattern(
      MarketController.prefixCmd,
      MarketController.prototype.getMarketConfig.name,
    ),
  })
  getMarketConfig(): Promise<ResponseResult<MarketConfig[]>> {
    return this.marketService.getMarketConfig();
  }

  @MessagePattern({
    cmd: getPattern(
      MarketController.prefixCmd,
      MarketController.prototype.getDetail.name,
    ),
  })
  getDetail(message: IMessage): Promise<ResponseResult<Market>> {
    const { id } = message;
    return this.marketService.getDetail(id);
  }

  @MessagePattern({
    cmd: getPattern(
      MarketController.prefixCmd,
      MarketController.prototype.updateMarket.name,
    ),
  })
  updateMarket(
    message: IMessage<Partial<Market>>,
  ): Promise<ResponseResult<IMutationResponse>> {
    const { payload } = message;
    return this.marketService.updateMarket(payload);
  }

  @MessagePattern({
    cmd: getPattern(
      MarketController.prefixCmd,
      MarketController.prototype.createMarket.name,
    ),
  })
  createMarket(
    message: IMessage<Partial<Market>>,
  ): Promise<ResponseResult<IMutationResponse>> {
    const { payload } = message;
    return this.marketService.createMarket(payload);
  }

  @MessagePattern({
    cmd: getPattern(
      MarketController.prefixCmd,
      MarketController.prototype.updateListMarket.name,
    ),
  })
  updateListMarket(
    message: IMessage<IUpdateListMarket>,
  ): Promise<ResponseResult<IMutationResponse>> {
    const { payload } = message;
    return this.marketService.updateListMarket(payload);
  }
}
