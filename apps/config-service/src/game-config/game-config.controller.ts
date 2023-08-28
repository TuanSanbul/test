import { ServiceName } from '@lib/common/enums';
import { IMessage, IMutationResponse } from '@lib/common/interfaces';
import {
  IGameAmount,
  IGameConfig,
  IUpdateGameConfig,
} from '@lib/common/interfaces/modules/game-config';
import { ResponseResult } from '@lib/common/types';
import { getPattern } from '@lib/utils/helpers';
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';
import { GameConfigService } from './game-config.service';
import { GameCategory } from '@lib/core/databases/postgres';

@Controller()
@ApiTags('Config Service')
export class GameConfigController {
  static prefixCmd = [ServiceName.CONFIG_SERVICE, GameConfigController.name];

  constructor(private readonly gameConfigService: GameConfigService) {}

  @MessagePattern({
    cmd: getPattern(
      GameConfigController.prefixCmd,
      GameConfigController.prototype.getGameConfig.name,
    ),
  })
  getGameConfig() {
    return this.gameConfigService.getGameConfig();
  }

  @MessagePattern({
    cmd: getPattern(
      GameConfigController.prefixCmd,
      GameConfigController.prototype.createGameConfig.name,
    ),
  })
  createGameConfig(
    message: IMessage<IGameConfig>,
  ): Promise<ResponseResult<IMutationResponse>> {
    const { payload } = message;
    return this.gameConfigService.createGameConfig(payload);
  }

  @MessagePattern({
    cmd: getPattern(
      GameConfigController.prefixCmd,
      GameConfigController.prototype.updateGameConfig.name,
    ),
  })
  updateGameConfig(
    message: IMessage<IUpdateGameConfig>,
  ): Promise<ResponseResult<IMutationResponse>> {
    const { payload } = message;
    return this.gameConfigService.updateGameConfig(payload);
  }

  @MessagePattern({
    cmd: getPattern(
      GameConfigController.prefixCmd,
      GameConfigController.prototype.getGameAmountConfig.name,
    ),
  })
  getGameAmountConfig() {
    return this.gameConfigService.getGameAmountConfig();
  }

  @MessagePattern({
    cmd: getPattern(
      GameConfigController.prefixCmd,
      GameConfigController.prototype.updateGameAmountConfig.name,
    ),
  })
  updateGameAmountConfig(
    message: IMessage<IGameAmount[]>,
  ): Promise<ResponseResult<IMutationResponse>> {
    const { payload } = message;
    return this.gameConfigService.updateGameAmountConfig(payload);
  }

  @MessagePattern({
    cmd: getPattern(
      GameConfigController.prefixCmd,
      GameConfigController.prototype.createGameCategory.name,
    ),
  })
  createGameCategory(
    message: IMessage<string>,
  ): Promise<ResponseResult<GameCategory>> {
    const { payload } = message;
    return this.gameConfigService.createGameCategory(payload);
  }

  @MessagePattern({
    cmd: getPattern(
      GameConfigController.prefixCmd,
      GameConfigController.prototype.getGameCategories.name,
    ),
  })
  getGameCategories(): Promise<ResponseResult<GameCategory[]>> {
    return this.gameConfigService.getGameCategories();
  }
}
